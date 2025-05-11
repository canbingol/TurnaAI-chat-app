import { supabase, handleSupabaseError } from './supabaseConfig';

class AuthService {
    // Mevcut giriş yapmış kullanıcıyı al
    async getCurrentUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) return null;

            // Kullanıcının profil verilerini users tablosundan al
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) {
                console.error('Kullanıcı verileri alınırken hata:', error);
                // Sadece temel auth bilgisini döndür
                return {
                    id: user.id,
                    email: user.email,
                    name: user.user_metadata?.name || 'Kullanıcı'
                };
            }

            return data;
        } catch (error) {
            handleSupabaseError(error);
            return null;
        }
    }

    async register(name, email, password) {
        try {
            console.log(`Kayıt başlatılıyor: ${email}`);

            // 1. Sadece Supabase Auth ile kayıt (users tablosuna ekleme yok)
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name
                    }
                }
            });

            if (error) {
                console.error('Auth kaydı hatası:', error);
                console.error('Tam hata:', JSON.stringify(error, null, 2));
                throw error;
            }

            if (!data || !data.user) {
                console.error('Auth kaydı başarılı ancak kullanıcı objesi dönmedi');
                return null;
            }

            console.log('Auth kaydı başarılı, kullanıcı ID:', data.user.id);
            return data.user;
        } catch (error) {
            console.error('Register fonksiyonunda hata:', error);
            throw error;
        }
    }

    // Mevcut bir kullanıcı girişi
    async login(email, password) {
        try {
            console.log(`Giriş yapılıyor: ${email}`);

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                console.error('Giriş hatası:', error);
                throw error;
            }

            console.log('Giriş başarılı, kullanıcı ID:', data.user.id);
            return data.user;
        } catch (error) {
            handleSupabaseError(error);
            return null;
        }
    }

    // Mevcut kullanıcının çıkışı
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            console.log('Çıkış başarılı');
            return true;
        } catch (error) {
            handleSupabaseError(error);
            return false;
        }
    }

    // Kullanıcı profilini güncelle
    async updateProfile(userId, updates) {
        try {
            const { data, error } = await supabase
                .from('users')
                .update({
                    ...updates,
                    updated_at: new Date()
                })
                .eq('id', userId)
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            handleSupabaseError(error);
            return null;
        }
    }

    // Şifre güncelleme
    async updatePassword(newPassword) {
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;
            return true;
        } catch (error) {
            handleSupabaseError(error);
            return false;
        }
    }

    // Şifre sıfırlama (e-posta gönderir)
    async resetPassword(email) {
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email);
            if (error) throw error;
            return true;
        } catch (error) {
            handleSupabaseError(error);
            return false;
        }
    }

    // Kullanıcının kimlik doğrulamasını kontrol et
    async isAuthenticated() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const hasSession = !!session;
            console.log('Authentication check:', hasSession ? 'User is authenticated' : 'No active session');
            return hasSession;
        } catch (error) {
            handleSupabaseError(error);
            return false;
        }
    }
}

export default new AuthService();