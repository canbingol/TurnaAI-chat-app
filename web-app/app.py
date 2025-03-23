from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='static')

# Initialize API client
api_key = ""


@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        user_input = data.get('prompt', 'Explain how AI works')
        
        # Call the Gemini API
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=user_input
        )
        
        return jsonify({'response': response.text})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
