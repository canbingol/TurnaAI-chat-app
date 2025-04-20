from flask import Flask, request, jsonify, session, redirect, url_for
import os
import uuid
import datetime
import bcrypt
from functools import wraps
from dotenv import load_dotenv
from google import genai
from supabase import create_client, Client
import re

# Çevre değişkenlerini yükle
load_dotenv()

app = Flask(__name__, static_folder='static')
app.secret_key = os.getenv("FLASK_SECRET_KEY", os.urandom(24).hex())  # Session için güvenlik anahtarı

# Gemini API istemcisini başlat
api_key = os.getenv("GEMINI_KEY", "")

# Supabase istemcisini başlat
supabase_url = os.getenv("SUPABASE_URL", "")
supabase_key = os.getenv("SUPABASE_ANON_KEY", "")  # Kullanıcı tarafındaki işlemler için anon key
supabase: Client = create_client(supabase_url, supabase_key)

# Kullanıcı oturumunu kontrol eden dekoratör
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Oturum açmanız gerekiyor'}), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/register', methods=['POST'])
def register():
    """Yeni kullanıcı kaydı."""
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        
        # Temel doğrulama
        if not all([name, email, password]):
            return jsonify({'error': 'Tüm alanları doldurun'}), 400
            
        # E-posta kontrolü
        existing_user = supabase.table('users').select('*').eq('email', email).execute()
        if existing_user.data:
            return jsonify({'error': 'Bu e-posta adresi zaten kullanılıyor'}), 400
            
        # Şifreyi hash'le
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Yeni kullanıcı oluştur
        user_id = str(uuid.uuid4())
        user = {
            'id': user_id,
            'name': name,
            'email': email,
            'password_hash': password_hash
        }
        
        # Veritabanına kaydet
        response = supabase.table('users').insert(user).execute()
        
        # Kullanıcı oturumunu başlat
        user_data = response.data[0]
        session['user_id'] = user_data['id']
        session['user_name'] = user_data['name']
        session['user_email'] = user_data['email']
        
        return jsonify({
            'success': True,
            'user': {
                'id': user_data['id'],
                'name': user_data['name'],
                'email': user_data['email']
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    """Kullanıcı girişi."""
    try:
        data = request.json
        email = data.get('email')
        password = data.get('password')
        
        # Temel doğrulama
        if not all([email, password]):
            return jsonify({'error': 'E-posta ve şifre gerekli'}), 400
            
        # Kullanıcıyı bul
        response = supabase.table('users').select('*').eq('email', email).execute()
        
        if not response.data:
            return jsonify({'error': 'Kullanıcı bulunamadı'}), 404
            
        user = response.data[0]
        
        # Şifre kontrolü
        if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            return jsonify({'error': 'Geçersiz şifre'}), 401
            
        # Kullanıcı oturumunu başlat
        session['user_id'] = user['id']
        session['user_name'] = user['name']
        session['user_email'] = user['email']
        
        return jsonify({
            'success': True,
            'user': {
                'id': user['id'],
                'name': user['name'],
                'email': user['email']
            }
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    """Kullanıcı çıkışı."""
    session.clear()
    return jsonify({'success': True})

@app.route('/api/user', methods=['GET'])
@login_required
def get_user():
    """Oturum açmış kullanıcı bilgilerini getir."""
    return jsonify({
        'user': {
            'id': session['user_id'],
            'name': session['user_name'],
            'email': session['user_email']
        }
    })

@app.route('/api/user', methods=['PUT'])
@login_required
def update_user():
    """Kullanıcı bilgilerini güncelle."""
    try:
        data = request.json
        name = data.get('name')
        
        # Sadece ismi güncelleyelim (şifre ve e-posta değişikliği ek güvenlik gerektirir)
        if name:
            # Veritabanını güncelle
            supabase.table('users').update({'name': name}).eq('id', session['user_id']).execute()
            
            # Oturumu güncelle
            session['user_name'] = name
            
            return jsonify({
                'success': True,
                'user': {
                    'id': session['user_id'],
                    'name': session['user_name'],
                    'email': session['user_email']
                }
            })
        else:
            return jsonify({'error': 'Güncellenecek veri yok'}), 400
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/conversations', methods=['GET'])
@login_required
def get_conversations():
    """Kullanıcıya ait tüm sohbetleri getir."""
    try:
        # Kullanıcıya ait sohbetleri sorgula
        response = supabase.table('conversations').select('*').eq('user_id', session['user_id']).order('created_at', desc=True).execute()
        
        return jsonify({'conversations': response.data})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/conversations', methods=['POST'])
@login_required
def create_conversation():
    """Yeni bir sohbet oluştur."""
    try:
        # Yeni sohbet verisini al
        data = request.json
        title = data.get('title', 'Yeni Sohbet')
        
        # Yeni sohbet kaydı oluştur
        conversation_id = str(uuid.uuid4())
        conversation = {
            'id': conversation_id,
            'user_id': session['user_id'],
            'title': title
        }
        
        # Veritabanına kaydet
        response = supabase.table('conversations').insert(conversation).execute()
        
        return jsonify({'conversation': response.data[0]})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/conversations/<conversation_id>', methods=['PUT'])
@login_required
def update_conversation(conversation_id):
    """Sohbet başlığını güncelle."""
    try:
        data = request.json
        title = data.get('title')
        title = re.sub(r'<[^>]+>', '', title)
        if not title:
            return jsonify({'error': 'Başlık gerekli'}), 400
            
        # Sohbetin kullanıcıya ait olduğunu kontrol et
        check = supabase.table('conversations').select('id').eq('id', conversation_id).eq('user_id', session['user_id']).execute()
        if not check.data:
            return jsonify({'error': 'Sohbet bulunamadı veya erişim izniniz yok'}), 404
        
        # Sohbeti güncelle
        response = supabase.table('conversations').update({'title': title, 'updated_at': datetime.datetime.now().isoformat()}).eq('id', conversation_id).execute()
        
        return jsonify({'conversation': response.data[0]})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/conversations/<conversation_id>', methods=['DELETE'])
@login_required
def delete_conversation(conversation_id):
    """Belirli bir sohbeti sil."""
    try:
        # Sohbetin kullanıcıya ait olduğunu kontrol et
        check = supabase.table('conversations').select('id').eq('id', conversation_id).eq('user_id', session['user_id']).execute()
        if not check.data:
            return jsonify({'error': 'Sohbet bulunamadı veya erişim izniniz yok'}), 404
        
        # Cascade özelliği sayesinde ilişkili mesajlar da silinecek
        response = supabase.table('conversations').delete().eq('id', conversation_id).execute()
        
        return jsonify({'success': True})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/messages', methods=['POST'])
@login_required
def create_message():
    """Yeni bir mesaj oluştur ve yapay zeka yanıtını al."""
    try:
        data = request.json
        user_input = data.get('prompt', '')
        conversation_id = data.get('conversation_id', '')
        mode = data.get('mode', 'normal')  # Kullanım modu (normal, yaratıcı, kesin)
        
        # Sohbetin kullanıcıya ait olduğunu kontrol et
        check = supabase.table('conversations').select('id').eq('id', conversation_id).eq('user_id', session['user_id']).execute()
        if not check.data:
            return jsonify({'error': 'Sohbet bulunamadı veya erişim izniniz yok'}), 404
        
        # Kullanıcı mesajını veritabanına kaydet
        user_message = {
            'id': str(uuid.uuid4()),
            'conversation_id': conversation_id,
            'content': user_input,
            'is_user': True
        }
        
        supabase.table('messages').insert(user_message).execute()
        
        # Gemini API'ye istek gönder
        client = genai.Client(api_key=api_key)
        
        # Seçilen moda göre ayarlar
        if mode == 'creative':
            temperature = 0.8
        elif mode == 'precise':
            temperature = 0.2
        else:  # normal
            temperature = 0.5
            
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=user_input,
            config={"temperature": temperature}
        )
        
        ai_response = response.text
        
        # Yapay zeka yanıtını veritabanına kaydet
        ai_message = {
            'id': str(uuid.uuid4()),
            'conversation_id': conversation_id,
            'content': ai_response,
            'is_user': False
        }
        
        supabase.table('messages').insert(ai_message).execute()
        
        # Sohbet başlığı güncelleme (İlk mesaj ise)
        message_count = supabase.table('messages').select('id').eq('conversation_id', conversation_id).execute()
        if len(message_count.data) <= 2:  # İlk kullanıcı mesajı ve AI yanıtı
            # Başlık olarak kullanıcı mesajının ilk 20 karakteri
            title = user_input[:20] + ("..." if len(user_input) > 20 else "")
            supabase.table('conversations').update({"title": title, "updated_at": datetime.datetime.now().isoformat()}).eq('id', conversation_id).execute()
        else:
            # Her durumda güncellenme zamanını güncelle
            supabase.table('conversations').update({"updated_at": datetime.datetime.now().isoformat()}).eq('id', conversation_id).execute()
        
        return jsonify({'response': ai_response})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/messages/<conversation_id>', methods=['GET'])
@login_required
def get_messages(conversation_id):
    """Belirli bir sohbetteki tüm mesajları getir."""
    try:
        # Sohbetin kullanıcıya ait olduğunu kontrol et
        check = supabase.table('conversations').select('id').eq('id', conversation_id).eq('user_id', session['user_id']).execute()
        if not check.data:
            return jsonify({'error': 'Sohbet bulunamadı veya erişim izniniz yok'}), 404
        
        response = supabase.table('messages').select('*').eq('conversation_id', conversation_id).order('created_at').execute()
        
        return jsonify({'messages': response.data})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/check-connection', methods=['GET'])
def check_connection():
    """Veritabanı bağlantısını kontrol eder."""
    try:
        # Basit bir sorgu ile bağlantıyı test et
        response = supabase.table('users').select('id').limit(1).execute()
        
        # Supabase bağlantı hatası kontrolü
        if hasattr(response, 'error') and response.error is not None:
            return jsonify({'success': False, 'error': 'Veritabanına bağlanılamadı: ' + str(response.error)}), 500
            
        return jsonify({
            'success': True, 
            'message': 'Veritabanı bağlantısı başarılı',
            'database': 'Supabase'
        })
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/api/generate', methods=['POST'])
def generate():
    """Oturum gerektirmeden mesaj üretme - mevcut API ile uyumluluk için."""
    try:
        data = request.json
        user_input = data.get('prompt', 'Explain how AI works')
        mode = data.get('mode', 'normal')
        
        # Gemini API'ye istek gönder
        client = genai.Client(api_key=api_key)
        
        # Seçilen moda göre ayarlar
        if mode == 'creative':
            temperature = 0.8
        elif mode == 'precise':
            temperature = 0.2
        else:  # normal
            temperature = 0.5
            
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=user_input,
            config={"temperature": temperature}
        )
        
        return jsonify({'response': response.text})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)