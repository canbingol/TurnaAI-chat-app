import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Supabase yapılandırma değerleri - .coL yerine .co olarak düzeltildi
const supabaseUrl = 'https://jabgmlqqlaoatkvodznb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphYmdtbHFxbGFvYXRrdm9kem5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNTQxNzgsImV4cCI6MjA2MDYzMDE3OH0.lPJ6r7bGGBbGmOVI0bCWSFEEqJhVsdNun3wOiipirdc';

// Bağlantı başlangıcında log ekle
console.log('Supabase istemcisi oluşturuluyor...');
console.log('URL:', supabaseUrl);

// Tüm uygulama için tek bir supabase istemcisi oluşturun
export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            storage: AsyncStorage,
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false,
        },
        // Ağ hatalarıyla ilgili daha fazla bilgi almak için
        global: {
            fetch: (...args) => {
                console.log('Supabase fetch isteği yapılıyor...');
                return fetch(...args).then(response => {
                    if (!response.ok) {
                        console.error('Fetch hatası:', response.status, response.statusText);
                    } else {
                        console.log('Fetch başarılı:', response.status);
                    }
                    return response;
                }).catch(error => {
                    console.error('Fetch istisna hatası:', error);
                    throw error;
                });
            }
        }
    }
);

console.log('Supabase istemcisi oluşturuldu');

// Hataları işlemek için yardımcı fonksiyon
export const handleSupabaseError = (error) => {
    if (!error) {
        console.error('Tanımsız Supabase hatası');
        return 'Bilinmeyen bir hata oluştu.';
    }

    console.error('Supabase Hatası:', error.message || 'Bilinmeyen hata');

    if (error.name === 'TypeError' && error.message === 'Network request failed') {
        console.error('Ağ hatası. İnternet bağlantınızı kontrol edin.');
        return 'İnternet bağlantısı hatası. Lütfen bağlantınızı kontrol edin.';
    }

    if (error.details) {
        console.error('Detaylar:', error.details);
    }

    if (error.hint) {
        console.error('İpucu:', error.hint);
    }

    return error.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
};