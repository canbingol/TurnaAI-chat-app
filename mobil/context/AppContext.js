import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import AuthService from '../services/AuthService';
import ChatService from '../services/ChatService';
import { supabase } from '../services/supabaseConfig';

export const AppContext = createContext();

// Temalar
export const THEMES = {
    DARK: 'dark',
    LIGHT: 'light',
    TURQUOISE: 'turquoise'
};

// Dil seçenekleri
export const LANGUAGES = {
    TR: 'tr',
    EN: 'en',
    FR: 'fr'
};

// Tema renkleri
export const themeColors = {
    [THEMES.DARK]: {
        primary: '#8A2BE2',
        background: '#121212',
        card: '#1E1E1E',
        cardAlt: '#242424',
        text: '#FFFFFF',
        textSecondary: '#888888',
        border: 'rgba(255,255,255,0.05)',
        statusBar: '#8A2BE2',
    },
    [THEMES.LIGHT]: {
        primary: '#8A2BE2',
        background: '#F5F5F5',
        card: '#FFFFFF',
        cardAlt: '#F0F0F0',
        text: '#212121',
        textSecondary: '#757575',
        border: '#E0E0E0',
        statusBar: '#8A2BE2',
    },
    [THEMES.TURQUOISE]: {
        primary: '#008B8B', // Daha koyu turkuaz 
        background: '#0A1515',
        card: '#0E2424',
        cardAlt: '#103030',
        text: '#FFFFFF',
        textSecondary: '#8CCCCC',
        border: 'rgba(0,139,139,0.15)',
        statusBar: '#008B8B',
    }
};

// Çeviriler
const translations = {
    [LANGUAGES.TR]: {
        home: 'Ana Ekran',
        profile: 'Profil',
        help: 'Yardım',
        settings: 'Ayarlar',
        logout: 'Çıkış Yap',
        darkMode: 'Karanlık Mod',
        lightMode: 'Aydınlık Mod',
        turquoiseMode: 'Turkuaz Mod',
        notifications: 'Bildirimler',
        language: 'Dil',
        editProfile: 'Profil Düzenle',
        save: 'Kaydet',
        cancel: 'İptal',
        ok: 'Tamam',
        error: 'Hata',
        success: 'Başarılı',
        loading: 'Yükleniyor...',
        welcome: 'Hoş Geldiniz',
        email: 'E-posta',
        password: 'Şifre',
        login: 'Giriş Yap',
        register: 'Kayıt Ol',
        forgotPassword: 'Şifremi Unuttum',
        noAccount: 'Hesabın yok mu?',
        haveAccount: 'Zaten hesabın var mı?',
        name: 'Ad Soyad',
        version: 'Sürüm',
        theme: 'Tema',
        turkish: 'Türkçe',
        english: 'İngilizce',
        french: 'Fransızca',
        chooseTheme: 'Tema Seçimi',
        chooseLanguage: 'Dil Seçimi',
        // Sohbet ilgili metinler
        newChat: 'Yeni Sohbet',
        searchChats: 'Sohbetlerde ara...',
        startChat: 'Sohbet Başlat',
        typeMessage: 'Mesajınızı yazın...',
        send: 'Gönder',
        // Yardım menüsü
        helpCenter: 'Yardım Merkezi',
        faq: 'Sık Sorulan Sorular',
        contact: 'İletişim',
        // Dosya işlemleri
        uploadFile: 'Dosya Yükle',
        chooseFile: 'Dosya Seç',
        analyze: 'Analiz Et',
        // Yeni çeviri öğeleri
        continueAsGuest: 'Misafir Olarak Devam Et',
        chatTitle: 'Sohbet Başlığı',
        start: 'Başlat',
        aiAssistantByYourSide: 'Yapay zeka asistanınız yanınızda',
        quickActions: 'Hızlı İşlemler',
        whatToAsk: 'Ne Sorabilirim?',
        recentChats: 'Son Sohbetler',
        voiceCommand: 'Sesli Komut',
        savedChats: 'Kaydedilen Sohbetler',
        messageCopied: 'Mesaj kopyalandı',
        noChatsYet: 'Henüz sohbet bulunmuyor',
        startNewChat: 'Yeni Sohbet Başlat',
        noSearchResults: 'Arama sonucu bulunamadı',
        fileUploaded: 'Dosya Yüklendi',
        analyzeFileQuestion: 'Bu dosyayı analiz etmek ister misiniz?',
        invalidCredentials: 'Geçersiz e-posta veya şifre',
        loginFailed: 'Giriş başarısız oldu',
        registrationFailed: 'Kayıt işlemi başarısız oldu',
        profileUpdateFailed: 'Profil güncellemesi başarısız oldu',
        guestModeActive: 'Misafir modu aktif',
        guestModeChatHistory: 'Misafir modunda sohbet geçmişi kaydedilmez',
    },
    [LANGUAGES.EN]: {
        // İngilizce çeviriler (değiştirilmedi)
        // ... (kısalık için çıkarıldı)
        continueAsGuest: 'Continue as Guest',
        guestModeActive: 'Guest mode active',
        guestModeChatHistory: 'Chat history is not saved in guest mode',
    },
    [LANGUAGES.FR]: {
        // Fransızca çeviriler (değiştirilmedi)
        // ... (kısalık için çıkarıldı)
        continueAsGuest: 'Continuer en tant qu\'invité',
        guestModeActive: 'Mode invité actif',
        guestModeChatHistory: 'L\'historique des discussions n\'est pas enregistré en mode invité',
    }
};

export const AppContextProvider = ({ children }) => {
    // Tema ve dil durumları
    const [theme, setTheme] = useState(THEMES.DARK);
    const [language, setLanguage] = useState(LANGUAGES.TR);

    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isGuestMode, setIsGuestMode] = useState(false); // Misafir modu durumu

    // Kullanıcı profil bilgileri
    const [userName, setUserName] = useState('Misafir Kullanıcı');
    const [userEmail, setUserEmail] = useState('misafir@aiasistan.com');
    const [userAvatar, setUserAvatar] = useState(null);

    // Sohbet geçmişi
    const [chatHistory, setChatHistory] = useState([]);

    // Tema renklerini almak için yardımcı fonksiyon
    const getColors = () => themeColors[theme];

    // Çeviri fonksiyonu
    const t = (key) => {
        return translations[language][key] || key;
    };

    // Supabase auth state dinleyici
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (event === 'SIGNED_IN' && session) {
                    // Misafir modundan çık
                    setIsGuestMode(false);
                    await loadUserData(session.user.id);
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                    setUserName('Misafir Kullanıcı');
                    setUserEmail('misafir@aiasistan.com');
                    setUserAvatar(null);
                    setChatHistory([]);
                    setIsGuestMode(false); // Çıkış yapınca misafir modunu da kapat
                }
            }
        );

        // İlk oturum kontrolü
        checkSession();

        // Uygulamanın başlangıcında ayarları yükle
        loadSettings();

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    // Başlangıçta oturum kontrolü
    const checkSession = async () => {
        setIsLoading(true);
        try {
            // Önce misafir modu kontrolü
            const guestMode = await AsyncStorage.getItem('guestMode');
            if (guestMode === 'true') {
                setIsGuestMode(true);
                setIsLoading(false);
                return;
            }

            const currentUser = await AuthService.getCurrentUser();
            if (currentUser) {
                await loadUserData(currentUser.id);
            }
        } catch (error) {
            console.error('Session check error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Kullanıcı verilerini yükle
    const loadUserData = async (userId) => {
        setIsLoading(true);
        try {
            // Kullanıcı profilini al
            const userData = await AuthService.getCurrentUser();
            if (userData) {
                setUser(userData);
                setUserName(userData.name || 'Kullanıcı');
                setUserEmail(userData.email);
                setUserAvatar(userData.avatar_url);

                // Kullanıcının sohbet geçmişini yükle
                await loadChatHistory(userId);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // AppContextProvider içinde, register•login•logout vb. fonksiyonların hemen yanında
    const loadChatHistory = async (userId) => {
        if (isGuestMode) {
            setChatHistory([]);
            return;
        }

        try {
            // conversations ve içindeki messages ilişkisel olarak çekiliyor
            const { data: convs, error } = await supabase
                .from('conversations')
                .select(`
          id,
          title,
          updated_at,
          messages (
            id,
            content,
            is_user,
            created_at
          )
        `)
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });

            if (error) {
                console.error('Supabase fetch error:', error);
                return;
            }

            const normalized = convs.map(conv => ({
                id: conv.id,
                baslik: conv.title,
                lastMessageTime: new Date(conv.updated_at)
                    .toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                messages: (conv.messages || [])
                    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                    .map(msg => ({
                        id: msg.id,
                        metin: msg.content,
                        gonderen: msg.is_user ? 'kullanici' : 'ai'
                    }))
            }));

            setChatHistory(normalized);
        } catch (err) {
            console.error('Error loading chat history:', err);
        }
    };


    // Uygulama ayarlarını yükle
    const loadSettings = async () => {
        try {
            // Tema ayarını yükle
            const storedTheme = await AsyncStorage.getItem('theme');
            if (storedTheme && Object.values(THEMES).includes(storedTheme)) {
                setTheme(storedTheme);
            }

            // Bildirim ayarını yükle
            const storedNotifications = await AsyncStorage.getItem('notifications');
            if (storedNotifications !== null) {
                setIsNotificationsEnabled(storedNotifications === 'true');
            }

            // Dil ayarını yükle
            const storedLanguage = await AsyncStorage.getItem('language');
            if (storedLanguage && Object.values(LANGUAGES).includes(storedLanguage)) {
                setLanguage(storedLanguage);
            }

            // Misafir modu ayarını yükle
            const guestMode = await AsyncStorage.getItem('guestMode');
            if (guestMode === 'true') {
                setIsGuestMode(true);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    // Tema değiştirme fonksiyonu
    const changeTheme = async (newTheme) => {
        try {
            setTheme(newTheme);
            await AsyncStorage.setItem('theme', newTheme);
        } catch (error) {
            console.error('Error changing theme:', error);
        }
    };

    // Dil değiştirme fonksiyonu
    const changeLanguage = async (newLanguage) => {
        try {
            setLanguage(newLanguage);
            await AsyncStorage.setItem('language', newLanguage);
        } catch (error) {
            console.error('Error changing language:', error);
        }
    };

    // Bildirim tercihi değiştirme
    const toggleNotifications = async () => {
        try {
            const newNotificationSetting = !isNotificationsEnabled;
            setIsNotificationsEnabled(newNotificationSetting);
            await AsyncStorage.setItem('notifications', newNotificationSetting.toString());
        } catch (error) {
            console.error('Error toggling notifications:', error);
        }
    };

    // Giriş işlemi
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            // Misafir modundaysa, çık
            if (isGuestMode) {
                setIsGuestMode(false);
                await AsyncStorage.removeItem('guestMode');
            }

            const user = await AuthService.login(email, password);
            if (!user) {
                Alert.alert(t('error'), t('invalidCredentials'));
                setIsLoading(false);
                return false;
            }
            return true;
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert(t('error'), error.message || t('loginFailed'));
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Kayıt işlemi
    const register = async (name, email, password) => {
        setIsLoading(true);
        try {
            // Misafir modundaysa, çık
            if (isGuestMode) {
                setIsGuestMode(false);
                await AsyncStorage.removeItem('guestMode');
            }

            const user = await AuthService.register(name, email, password);
            if (!user) {
                Alert.alert(t('error'), t('registrationFailed'));
                setIsLoading(false);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert(t('error'), error.message || t('registrationFailed'));
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Misafir olarak devam et
    const continueAsGuest = async () => {
        setIsLoading(true);
        try {
            // Misafir modu ayarını kaydet
            setIsGuestMode(true);
            await AsyncStorage.setItem('guestMode', 'true');

            // Misafir kullanıcı bilgilerini ayarla
            setUser(null);
            setUserName('Misafir Kullanıcı');
            setUserEmail('misafir@aiasistan.com');
            setUserAvatar(null);

            // Sohbet geçmişini temizle
            setChatHistory([]);

            return true;
        } catch (error) {
            console.error('Guest mode error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Çıkış işlemi
    const logout = async () => {
        setIsLoading(true);
        try {
            // Misafir modundaysa, yalnızca misafir modunu kapat
            if (isGuestMode) {
                setIsGuestMode(false);
                await AsyncStorage.removeItem('guestMode');

                // Misafir bilgilerini sıfırla
                setUserName('Misafir Kullanıcı');
                setUserEmail('misafir@aiasistan.com');
                setUserAvatar(null);
                setChatHistory([]);

                return true;
            }

            // Normal çıkış işlemi
            const success = await AuthService.logout();
            if (success) {
                return true;
            }
            return false;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Profil güncelleme
    const updateUserProfile = async (name, email, avatar) => {
        setIsLoading(true);
        try {
            if (!user) {
                setIsLoading(false);
                return false;
            }

            const updates = {
                name,
                email,
            };

            if (avatar) {
                // Gerçek bir uygulamada, avatarı depolamaya yükleyip bir URL alırsınız
                updates.avatar_url = avatar;
            }

            const updatedUser = await AuthService.updateProfile(user.id, updates);
            if (!updatedUser) {
                Alert.alert(t('error'), t('profileUpdateFailed'));
                setIsLoading(false);
                return false;
            }

            setUserName(updatedUser.name);
            setUserEmail(updatedUser.email);
            if (updatedUser.avatar_url) {
                setUserAvatar(updatedUser.avatar_url);
            }

            return true;
        } catch (error) {
            console.error('Profile update error:', error);
            Alert.alert(t('error'), error.message || t('profileUpdateFailed'));
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Yeni sohbet ekle
    const addChat = async (chat) => {
        try {
            // Misafir modunda sohbeti sadece yerel state'te tut, veritabanına kaydetme
            if (isGuestMode) {
                setChatHistory(prev => [chat, ...prev]);
                return chat.id;
            }

            if (!user) return null;

            // Supabase'de konuşma oluştur
            const newConversation = await ChatService.createConversation(
                user.id,
                chat.baslik
            );

            if (!newConversation) return null;

            // Eğer sağlanmışsa, başlangıç AI karşılama mesajını ekle
            if (chat.messages && chat.messages.length > 0) {
                const greetingMessage = chat.messages[0];
                await ChatService.addMessage(
                    newConversation.id,
                    greetingMessage.metin,
                    false // AI mesajı
                );
            }

            // UI için formatla ve yerel duruma ekle
            const uiConversation = {
                id: newConversation.id,
                baslik: newConversation.title,
                lastMessageTime: new Date(newConversation.created_at).toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                messages: chat.messages || []
            };

            setChatHistory(prev => [uiConversation, ...prev]);
            return newConversation.id;
        } catch (error) {
            console.error('Error adding chat:', error);
            return null;
        }
    };

    // Sohbete mesaj ekle
    const addMessageToChat = async (chatId, message) => {
        try {
            // Misafir modunda sadece yerel state'i güncelle
            if (isGuestMode) {
                setChatHistory(prev => prev.map(chat => {
                    if (chat.id === chatId) {
                        return {
                            ...chat,
                            lastMessageTime: new Date().toLocaleTimeString('tr-TR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            messages: [...(chat.messages || []), message]
                        };
                    }
                    return chat;
                }));
                return true;
            }

            // Supabase'e mesaj ekle
            const newMessage = await ChatService.addMessage(
                chatId,
                message.metin,
                message.gonderen === 'kullanici' // is_user bayrağı
            );

            if (!newMessage) return false;

            // Yerel durumu güncelle
            setChatHistory(prev => prev.map(chat => {
                if (chat.id === chatId) {
                    // lastMessageTime güncelle
                    return {
                        ...chat,
                        lastMessageTime: new Date().toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        messages: [...(chat.messages || []), message]
                    };
                }
                return chat;
            }));

            return true;
        } catch (error) {
            console.error('Error adding message:', error);
            return false;
        }
    };

    // Sohbet sil
    const deleteChat = async (chatId) => {
        try {
            // Misafir modunda sadece yerel state'ten kaldır
            if (isGuestMode) {
                setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
                return true;
            }

            // Supabase'den konuşmayı sil
            const success = await ChatService.deleteConversation(chatId);

            if (!success) return false;

            // Yerel durumu güncelle
            setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
            return true;
        } catch (error) {
            console.error('Error deleting chat:', error);
            return false;
        }
    };

    // Bir sohbet için mesajları yükle
    const loadChatMessages = async (chatId) => {
        try {
            // Misafir modunda yerel state'ten al
            if (isGuestMode) {
                const chat = chatHistory.find(c => c.id === chatId);
                return chat?.messages || [];
            }

            const messages = await ChatService.getConversationMessages(chatId);

            // Mesajları UI için formatla
            const formattedMessages = messages.map(msg => ({
                id: msg.id,
                metin: msg.content,
                gonderen: msg.is_user ? 'kullanici' : 'ai',
                created_at: new Date(msg.created_at)
            }));

            // Yerel durumu güncelle
            setChatHistory(prev => prev.map(chat => {
                if (chat.id === chatId) {
                    return {
                        ...chat,
                        messages: formattedMessages
                    };
                }
                return chat;
            }));

            return formattedMessages;
        } catch (error) {
            console.error('Error loading chat messages:', error);
            return [];
        }
    };

    // AI'ya mesaj gönder
    const sendMessageToAI = async (chatId, userMessage) => {
        try {
            // Misafir modunda Gemini doğrudan kullan ve yerel state güncelle
            if (isGuestMode) {
                // GeminiService kullanarak AI yanıtı al
                const aiResponse = await GeminiService.generateText(userMessage);

                const userMsg = {
                    id: Date.now(),
                    metin: userMessage,
                    gonderen: 'kullanici',
                    created_at: new Date()
                };

                const aiMsg = {
                    id: Date.now() + 1,
                    metin: aiResponse,
                    gonderen: 'ai',
                    created_at: new Date()
                };

                // Yerel state güncelle
                setChatHistory(prev => prev.map(chat => {
                    if (chat.id === chatId) {
                        return {
                            ...chat,
                            lastMessageTime: new Date().toLocaleTimeString('tr-TR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            }),
                            messages: [...(chat.messages || []), userMsg, aiMsg]
                        };
                    }
                    return chat;
                }));

                return true;
            }

            // Normal mod: ChatService kullan
            const result = await ChatService.sendMessageToAI(chatId, userMessage);

            if (!result) return false;

            // Her iki mesajla da yerel durumu güncelle
            const userMsg = {
                id: result.userMessage.id,
                metin: result.userMessage.content,
                gonderen: 'kullanici',
                created_at: new Date(result.userMessage.created_at)
            };

            const aiMsg = {
                id: result.aiMessage.id,
                metin: result.aiMessage.content,
                gonderen: 'ai',
                created_at: new Date(result.aiMessage.created_at)
            };

            setChatHistory(prev => prev.map(chat => {
                if (chat.id === chatId) {
                    return {
                        ...chat,
                        lastMessageTime: new Date().toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        }),
                        messages: [...(chat.messages || []), userMsg, aiMsg]
                    };
                }
                return chat;
            }));

            return true;
        } catch (error) {
            console.error('Error in AI conversation:', error);
            return false;
        }
    };

    return (
        <AppContext.Provider
            value={{
                theme,
                language,
                isNotificationsEnabled,
                user,
                isLoading,
                userName,
                userEmail,
                userAvatar,
                chatHistory,
                isGuestMode, // Misafir modu durumunu paylaş
                getColors,
                t,
                login,
                logout,
                register,
                continueAsGuest, // Misafir modu fonksiyonunu paylaş
                changeTheme,
                toggleNotifications,
                changeLanguage,
                updateUserProfile,
                addChat,
                addMessageToChat,
                deleteChat,
                loadChatMessages,
                sendMessageToAI
            }}
        >
            {children}
        </AppContext.Provider>
    );
};