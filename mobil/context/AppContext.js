import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

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
    },
    [LANGUAGES.EN]: {
        home: 'Home',
        profile: 'Profile',
        help: 'Help',
        settings: 'Settings',
        logout: 'Logout',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        turquoiseMode: 'Turquoise Mode',
        notifications: 'Notifications',
        language: 'Language',
        editProfile: 'Edit Profile',
        save: 'Save',
        cancel: 'Cancel',
        ok: 'OK',
        error: 'Error',
        success: 'Success',
        loading: 'Loading...',
        welcome: 'Welcome',
        email: 'Email',
        password: 'Password',
        login: 'Login',
        register: 'Register',
        forgotPassword: 'Forgot Password',
        noAccount: 'Don\'t have an account?',
        haveAccount: 'Already have an account?',
        name: 'Full Name',
        version: 'Version',
        theme: 'Theme',
        turkish: 'Turkish',
        english: 'English',
        french: 'French',
        chooseTheme: 'Choose Theme',
        chooseLanguage: 'Choose Language',
        // Chat related
        newChat: 'New Chat',
        searchChats: 'Search chats...',
        startChat: 'Start Chat',
        typeMessage: 'Type your message...',
        send: 'Send',
        // Help menu
        helpCenter: 'Help Center',
        faq: 'FAQ',
        contact: 'Contact',
        // File operations
        uploadFile: 'Upload File',
        chooseFile: 'Choose File',
        analyze: 'Analyze',
    },
    [LANGUAGES.FR]: {
        home: 'Accueil',
        profile: 'Profil',
        help: 'Aide',
        settings: 'Paramètres',
        logout: 'Déconnexion',
        darkMode: 'Mode Sombre',
        lightMode: 'Mode Clair',
        turquoiseMode: 'Mode Turquoise',
        notifications: 'Notifications',
        language: 'Langue',
        editProfile: 'Modifier le Profil',
        save: 'Enregistrer',
        cancel: 'Annuler',
        ok: 'OK',
        error: 'Erreur',
        success: 'Succès',
        loading: 'Chargement...',
        welcome: 'Bienvenue',
        email: 'E-mail',
        password: 'Mot de passe',
        login: 'Connexion',
        register: 'S\'inscrire',
        forgotPassword: 'Mot de passe oublié',
        noAccount: 'Vous n\'avez pas de compte?',
        haveAccount: 'Vous avez déjà un compte?',
        name: 'Nom Complet',
        version: 'Version',
        theme: 'Thème',
        turkish: 'Turc',
        english: 'Anglais',
        french: 'Français',
        chooseTheme: 'Choisir un Thème',
        chooseLanguage: 'Choisir une Langue',
        // Chat related
        newChat: 'Nouvelle Discussion',
        searchChats: 'Rechercher dans les discussions...',
        startChat: 'Démarrer la Discussion',
        typeMessage: 'Tapez votre message...',
        send: 'Envoyer',
        // Help menu
        helpCenter: 'Centre d\'Aide',
        faq: 'FAQ',
        contact: 'Contact',
        // File operations
        uploadFile: 'Télécharger un Fichier',
        chooseFile: 'Choisir un Fichier',
        analyze: 'Analyser',
    }
};

export const AppContextProvider = ({ children }) => {
    // Tema ve dil durumları
    const [theme, setTheme] = useState(THEMES.DARK);
    const [language, setLanguage] = useState(LANGUAGES.TR);

    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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

    // Uygulama açıldığında kullanıcı bilgilerini ve ayarları yükleme
    useEffect(() => {
        const loadUserData = async () => {
            try {
                // Kullanıcı bilgilerini yükle
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const parsedUserData = JSON.parse(userData);
                    setUser(parsedUserData);
                    setUserName(parsedUserData.name || 'Misafir Kullanıcı');
                    setUserEmail(parsedUserData.email || 'misafir@aiasistan.com');
                    setUserAvatar(parsedUserData.avatar);
                }

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

                // Sohbet geçmişini yükle
                const storedChatHistory = await AsyncStorage.getItem('chatHistory');
                if (storedChatHistory) {
                    setChatHistory(JSON.parse(storedChatHistory));
                }
            } catch (error) {
                console.log('Kullanıcı verisi yüklenirken hata:', error);
            }
        };

        loadUserData();
    }, []);

    // Sohbet geçmişi değiştiğinde AsyncStorage'a kaydet
    useEffect(() => {
        const saveChatHistory = async () => {
            try {
                await AsyncStorage.setItem('chatHistory', JSON.stringify(chatHistory));
            } catch (error) {
                console.error('Sohbet geçmişi kaydedilirken hata:', error);
            }
        };

        if (chatHistory.length > 0) {
            saveChatHistory();
        }
    }, [chatHistory]);

    // Tema değiştirme fonksiyonu
    const changeTheme = async (newTheme) => {
        try {
            setTheme(newTheme);
            await AsyncStorage.setItem('theme', newTheme);
        } catch (error) {
            console.log('Tema değiştirilirken hata:', error);
        }
    };

    // Kullanıcı oturum açtığında
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            // JSON dosyasından kullanıcıları yükle
            const usersData = await AsyncStorage.getItem('users');
            const users = usersData ? JSON.parse(usersData) : [];

            // Kullanıcıyı bul
            const user = users.find(u => u.email === email && u.password === password);

            if (!user) {
                Alert.alert('Hata', 'E-posta veya şifre hatalı');
                setIsLoading(false);
                return false;
            }

            // Kullanıcı bilgilerini ayarla
            setUser(user);
            setUserName(user.name);
            setUserEmail(user.email);
            setUserAvatar(user.avatar);

            // AsyncStorage'a kaydet
            await AsyncStorage.setItem('userData', JSON.stringify(user));
            await AsyncStorage.setItem('userToken', 'user-token-' + user.id);

            setIsLoading(false);
            return true;
        } catch (error) {
            console.log('Giriş yapılırken hata:', error);
            setIsLoading(false);
            Alert.alert('Hata', 'Giriş yapılırken bir sorun oluştu.');
            return false;
        }
    };

    // Kullanıcı kayıt olduğunda
    const register = async (name, email, password) => {
        setIsLoading(true);
        try {
            // JSON dosyasından kullanıcıları yükle
            const usersData = await AsyncStorage.getItem('users');
            const users = usersData ? JSON.parse(usersData) : [];

            // E-posta adresi kontrol et
            if (users.some(u => u.email === email)) {
                Alert.alert('Hata', 'Bu e-posta adresi zaten kullanılmakta');
                setIsLoading(false);
                return false;
            }

            // Yeni kullanıcı oluştur
            const newUser = {
                id: Date.now().toString(),
                name,
                email,
                password,
                avatar: null,
                createdAt: new Date().toISOString()
            };

            // Kullanıcıyı listeye ekle ve kaydet
            users.push(newUser);
            await AsyncStorage.setItem('users', JSON.stringify(users));

            // Kullanıcı bilgilerini ayarla
            setUser(newUser);
            setUserName(newUser.name);
            setUserEmail(newUser.email);

            // AsyncStorage'a kaydet
            await AsyncStorage.setItem('userData', JSON.stringify(newUser));
            await AsyncStorage.setItem('userToken', 'user-token-' + newUser.id);

            setIsLoading(false);
            return true;
        } catch (error) {
            console.log('Kayıt olunurken hata:', error);
            setIsLoading(false);
            Alert.alert('Hata', 'Kayıt olunurken bir sorun oluştu.');
            return false;
        }
    };

    // Kullanıcı çıkış yaptığında
    const logout = async () => {
        try {
            await AsyncStorage.removeItem('userToken');
            await AsyncStorage.removeItem('userData');

            setUser(null);
            setUserName('Misafir Kullanıcı');
            setUserEmail('misafir@aiasistan.com');
            setUserAvatar(null);

            return true;
        } catch (error) {
            console.log('Çıkış yapılırken hata:', error);
            return false;
        }
    };

    // Bildirim tercihi değiştiğinde
    const toggleNotifications = async () => {
        try {
            const newNotificationSetting = !isNotificationsEnabled;
            setIsNotificationsEnabled(newNotificationSetting);
            await AsyncStorage.setItem('notifications', newNotificationSetting.toString());
        } catch (error) {
            console.log('Bildirim ayarı değiştirilirken hata:', error);
        }
    };

    // Dil değiştirme fonksiyonu
    const changeLanguage = async (newLanguage) => {
        try {
            setLanguage(newLanguage);
            await AsyncStorage.setItem('language', newLanguage);
        } catch (error) {
            console.log('Dil değiştirilirken hata:', error);
        }
    };

    // Kullanıcı profil bilgilerini güncelleme
    const updateUserProfile = async (name, email, avatar) => {
        try {
            setIsLoading(true);

            // Mevcut kullanıcı verisini al
            if (!user) {
                setIsLoading(false);
                return false;
            }

            // Kullanıcı bilgilerini güncelle
            const updatedUser = { ...user, name, email, avatar };

            // Tüm kullanıcıları güncelle
            const usersData = await AsyncStorage.getItem('users');
            if (usersData) {
                const users = JSON.parse(usersData);
                const updatedUsers = users.map(u =>
                    u.id === user.id ? updatedUser : u
                );
                await AsyncStorage.setItem('users', JSON.stringify(updatedUsers));
            }

            // Yerel state'i güncelle
            setUser(updatedUser);
            setUserName(name);
            setUserEmail(email);
            if (avatar) setUserAvatar(avatar);

            // Güncel kullanıcı verisini kaydet
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

            setIsLoading(false);
            return true;
        } catch (error) {
            console.log('Profil güncellenirken hata:', error);
            setIsLoading(false);
            Alert.alert('Hata', 'Profil güncellenirken bir sorun oluştu.');
            return false;
        }
    };

    // Yeni sohbet ekle
    const addChat = async (chat) => {
        try {
            const newChatHistory = [chat, ...chatHistory];
            setChatHistory(newChatHistory);
            return chat.id;
        } catch (error) {
            console.error('Sohbet eklenirken hata:', error);
            return null;
        }
    };

    // Sohbete mesaj ekle
    const addMessageToChat = async (chatId, message) => {
        try {
            const updatedChatHistory = chatHistory.map(chat => {
                if (chat.id === chatId) {
                    return {
                        ...chat,
                        messages: [...chat.messages, message],
                        lastMessageTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                    };
                }
                return chat;
            });

            setChatHistory(updatedChatHistory);
            return true;
        } catch (error) {
            console.error('Mesaj eklenirken hata:', error);
            return false;
        }
    };

    // Sohbet sil
    const deleteChat = async (chatId) => {
        try {
            const updatedChatHistory = chatHistory.filter(chat => chat.id !== chatId);
            setChatHistory(updatedChatHistory);
            return true;
        } catch (error) {
            console.error('Sohbet silinirken hata:', error);
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
                getColors,
                t,
                login,
                logout,
                register,
                changeTheme,
                toggleNotifications,
                changeLanguage,
                updateUserProfile,
                addChat,
                addMessageToChat,
                deleteChat
            }}
        >
            {children}
        </AppContext.Provider>
    );
};