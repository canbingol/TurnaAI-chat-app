import axios from 'axios';
import { GEMINI_API_KEY } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MODEL = 'gemini-2.0-flash';
const API_VERSION = 'v1beta';
const MAX_CONVERSATION_HISTORY = 10;

class GeminiService {
    constructor() {
        this.apiKey = GEMINI_API_KEY;
        this.baseUrl =
            `https://generativelanguage.googleapis.com/${API_VERSION}/models/${MODEL}:generateContent`;
        this.history = []; // Sohbet geçmişi
    }

    // Gemini API ile metin oluşturmak için
    async generateText(prompt, withHistory = true) {
        try {
            // Eğer API anahtarı yoksa
            if (!this.apiKey) {
                return "API anahtarı eksik. Lütfen .env dosyasına GEMINI_API_KEY ekleyin.";
            }

            let content;

            // Sohbet geçmişini kullanarak yanıt oluşturma
            if (withHistory && this.history.length > 0) {
                // Geçmiş dahil içerik hazırlama
                content = {
                    contents: [
                        ...this.history,
                        { parts: [{ text: prompt }], role: "user" }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topP: 1,
                        topK: 40,
                        maxOutputTokens: 1024,
                    }
                };
            } else {
                // Sadece güncel mesaj
                content = {
                    contents: [{ parts: [{ text: prompt }], role: "user" }],
                    generationConfig: {
                        temperature: 0.7,
                        topP: 1,
                        topK: 40,
                        maxOutputTokens: 1024,
                    }
                };
            }

            const { data } = await axios.post(
                `${this.baseUrl}?key=${this.apiKey}`,
                content,
                { headers: { 'Content-Type': 'application/json' } }
            );

            const response = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

            // Sohbet geçmişini güncelle
            if (withHistory) {
                this.addToHistory(prompt, response);
                this.saveHistory(); // Geçmişi AsyncStorage'a kaydet
            }

            return response;

        } catch (err) {
            console.error('Gemini API Hata Detayları:', {
                status: err.response?.status,
                data: err.response?.data,
                message: err.message
            });

            // Daha açıklayıcı hata mesajları
            if (err.response?.status === 400) {
                return 'Gönderilen istek geçersiz. Lütfen ifadenizi düzenleyin ve tekrar deneyin.';
            } else if (err.response?.status === 401) {
                return 'API anahtarı geçersiz. Lütfen geçerli bir API anahtarı kullanın.';
            } else if (err.response?.status === 429) {
                return 'API istek limiti aşıldı. Lütfen daha sonra tekrar deneyin.';
            } else if (err.response?.status === 500) {
                return 'Gemini sunucularında bir hata oluştu. Lütfen daha sonra tekrar deneyin.';
            }

            return 'Üzgünüm, şu anda yanıt veremiyorum. Daha sonra tekrar deneyin.';
        }
    }

    // Sohbet geçmişini temizle
    clearHistory() {
        this.history = [];
        this.saveHistory();
    }

    // Sohbet geçmişine ekle (maksimum 10 mesaj-yanıt çifti)
    addToHistory(userMessage, aiResponse) {
        // Kullanıcı mesajı ekle
        this.history.push({
            parts: [{ text: userMessage }],
            role: "user"
        });

        // AI yanıtı ekle
        this.history.push({
            parts: [{ text: aiResponse }],
            role: "model"
        });

        // Geçmişi MAX_CONVERSATION_HISTORY mesaj çiftiyle sınırla
        if (this.history.length > MAX_CONVERSATION_HISTORY * 2) {
            // İlk iki öğeyi kaldır (en eski mesaj ve yanıt)
            this.history = this.history.slice(2);
        }
    }

    // Sohbet geçmişini AsyncStorage'a kaydet
    async saveHistory() {
        try {
            await AsyncStorage.setItem('chat_history', JSON.stringify(this.history));
        } catch (error) {
            console.error('Sohbet geçmişi kaydedilirken hata:', error);
        }
    }

    // Sohbet geçmişini AsyncStorage'dan yükle
    async loadHistory() {
        try {
            const savedHistory = await AsyncStorage.getItem('chat_history');
            if (savedHistory) {
                this.history = JSON.parse(savedHistory);
            }
        } catch (error) {
            console.error('Sohbet geçmişi yüklenirken hata:', error);
        }
    }

    // Dosya yükleme özelliği için hazırlık
    async analyzeFile(fileContent, fileType) {
        // Dosya içeriğini ve tipini prompt'a ekleyerek analiz edilmesini sağlayalım
        const prompt = `Bu ${fileType} dosyasını analiz et ve içeriği hakkında bilgi ver:\n\n${fileContent}`;
        return this.generateText(prompt, false); // Sohbet geçmişi olmadan analiz et
    }

    // Özelleştirilmiş yanıt oluşturma fonksiyonu - stil, kişilik vb için
    async generateCustomText(prompt, options = {}) {
        const { creative = false, detailed = false, formal = false } = options;

        let temperatureValue = 0.7; // Varsayılan
        let maxTokens = 1024; // Varsayılan

        // Yaratıcılık ayarı
        if (creative) {
            temperatureValue = 0.9; // Daha yaratıcı
        }

        // Detay seviyesi
        if (detailed) {
            maxTokens = 2048; // Daha uzun yanıtlar
        }

        // Resmiyete göre istekte düzenleme
        let modifiedPrompt = prompt;
        if (formal) {
            modifiedPrompt = `Lütfen formal ve profesyonel bir dil kullanarak yanıtla: ${prompt}`;
        }

        try {
            const { data } = await axios.post(
                `${this.baseUrl}?key=${this.apiKey}`,
                {
                    contents: [{ parts: [{ text: modifiedPrompt }] }],
                    generationConfig: {
                        temperature: temperatureValue,
                        topP: 1,
                        topK: 40,
                        maxOutputTokens: maxTokens
                    }
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
        } catch (err) {
            console.error('Özel içerik oluşturulurken hata:', err);
            return 'Özel içerik oluşturulurken bir hata oluştu.';
        }
    }
}

export default new GeminiService();