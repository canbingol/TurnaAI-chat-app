// services/GuestService.js
import { supabase } from './supabaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

class GuestService {
    // Device ID oluştur veya al - expo-device kullanmadan
    async getDeviceId() {
        try {
            let deviceId = await AsyncStorage.getItem('deviceId');
            if (!deviceId) {
                // Rastgele bir ID oluştur
                deviceId = 'device_' + Math.random().toString(36).substring(2, 15) +
                    Math.random().toString(36).substring(2, 15);
                await AsyncStorage.setItem('deviceId', deviceId);
            }
            return deviceId;
        } catch (error) {
            console.error('Device ID hatası:', error);
            return 'device_' + Math.random().toString(36).substring(2, 15);
        }
    }

    // Misafir oturumu oluştur veya al
    async getOrCreateGuestSession() {
        try {
            const deviceId = await this.getDeviceId();

            // Mevcut oturumu kontrol et
            const { data: existingSession, error: fetchError } = await supabase
                .from('guest_sessions')
                .select('*')
                .eq('device_id', deviceId)
                .single();

            if (existingSession && !fetchError) {
                return existingSession;
            }

            // Yeni oturum oluştur
            const { data: newSession, error: createError } = await supabase
                .from('guest_sessions')
                .insert({
                    device_id: deviceId,
                    message_count: 0
                })
                .select()
                .single();

            if (createError) throw createError;
            return newSession;
        } catch (error) {
            console.error('Guest session hatası:', error);
            return null;
        }
    }

    // Mesaj sayısını güncelle
    async updateMessageCount(sessionId, count) {
        try {
            const { error } = await supabase
                .from('guest_sessions')
                .update({
                    message_count: count,
                    updated_at: new Date()
                })
                .eq('id', sessionId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Mesaj sayısı güncelleme hatası:', error);
            return false;
        }
    }

    // Misafir konuşmaları getir
    async getGuestConversations(sessionId) {
        try {
            const { data, error } = await supabase
                .from('guest_conversations')
                .select(`
                    *,
                    guest_messages (*)
                `)
                .eq('guest_session_id', sessionId)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('Guest conversations hatası:', error);
            return [];
        }
    }

    // Yeni misafir konuşması oluştur
    async createGuestConversation(sessionId, title) {
        try {
            const { data, error } = await supabase
                .from('guest_conversations')
                .insert({
                    guest_session_id: sessionId,
                    title: title
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Guest conversation oluşturma hatası:', error);
            return null;
        }
    }

    // Misafir mesajı ekle
    async addGuestMessage(conversationId, content, isUser) {
        try {
            const { data, error } = await supabase
                .from('guest_messages')
                .insert({
                    conversation_id: conversationId,
                    content: content,
                    is_user: isUser
                })
                .select()
                .single();

            if (error) throw error;

            // Konuşmanın updated_at'ini güncelle
            await supabase
                .from('guest_conversations')
                .update({ updated_at: new Date() })
                .eq('id', conversationId);

            return data;
        } catch (error) {
            console.error('Guest message ekleme hatası:', error);
            return null;
        }
    }

    // Misafir konuşmasını sil
    async deleteGuestConversation(conversationId) {
        try {
            const { error } = await supabase
                .from('guest_conversations')
                .delete()
                .eq('id', conversationId);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Guest conversation silme hatası:', error);
            return false;
        }
    }
}

export default new GuestService();