import { supabase, handleSupabaseError } from './supabaseConfig';
import GeminiService from './GeminiService';

class ChatService {
    // Bir kullanıcı için tüm konuşmaları getir
    async getUserConversations(userId) {
        try {
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            handleSupabaseError(error);
            return [];
        }
    }

    // ID'ye göre tek bir konuşma getir
    async getConversation(conversationId) {
        try {
            const { data, error } = await supabase
                .from('conversations')
                .select('*')
                .eq('id', conversationId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            handleSupabaseError(error);
            return null;
        }
    }

    // Yeni bir konuşma oluştur
    async createConversation(userId, title) {
        try {
            const { data, error } = await supabase
                .from('conversations')
                .insert({
                    user_id: userId,
                    title: title,
                    created_at: new Date(),
                    updated_at: new Date()
                })
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            handleSupabaseError(error);
            return null;
        }
    }

    // Konuşma başlığını güncelle
    async updateConversation(conversationId, title) {
        try {
            const { data, error } = await supabase
                .from('conversations')
                .update({
                    title: title,
                    updated_at: new Date()
                })
                .eq('id', conversationId)
                .select();

            if (error) throw error;
            return data[0];
        } catch (error) {
            handleSupabaseError(error);
            return null;
        }
    }

    // Bir konuşmayı ve mesajlarını sil
    async deleteConversation(conversationId) {
        try {
            // Önce konuşmadaki tüm mesajları sil
            const { error: messagesError } = await supabase
                .from('messages')
                .delete()
                .eq('conversation_id', conversationId);

            if (messagesError) throw messagesError;

            // Sonra konuşmayı sil
            const { error: conversationError } = await supabase
                .from('conversations')
                .delete()
                .eq('id', conversationId);

            if (conversationError) throw conversationError;

            return true;
        } catch (error) {
            handleSupabaseError(error);
            return false;
        }
    }

    // Bir konuşma için mesajları getir
    async getConversationMessages(conversationId) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('conversation_id', conversationId)
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            handleSupabaseError(error);
            return [];
        }
    }

    // Bir konuşmaya mesaj ekle
    async addMessage(conversationId, content, isUser = true) {
        try {
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    conversation_id: conversationId,
                    content: content,
                    is_user: isUser,
                    created_at: new Date()
                })
                .select();

            if (error) throw error;

            // Konuşmanın updated_at zaman damgasını güncelle
            await supabase
                .from('conversations')
                .update({ updated_at: new Date() })
                .eq('id', conversationId);

            return data[0];
        } catch (error) {
            handleSupabaseError(error);
            return null;
        }
    }

    // AI'ya mesaj gönder ve yanıt al
    async sendMessageToAI(conversationId, message) {
        try {
            // Önce kullanıcı mesajını kaydet
            const userMessage = await this.addMessage(conversationId, message, true);
            if (!userMessage) throw new Error('Kullanıcı mesajı kaydedilemedi');

            // Gemini API'ye gönder ve yanıt al
            const aiResponse = await GeminiService.generateText(message);

            // AI yanıtını kaydet
            const aiMessage = await this.addMessage(conversationId, aiResponse, false);
            if (!aiMessage) throw new Error('AI yanıtı kaydedilemedi');

            return {
                userMessage,
                aiMessage
            };
        } catch (error) {
            console.error('AI konuşmasında hata:', error);
            return null;
        }
    }
}

export default new ChatService();