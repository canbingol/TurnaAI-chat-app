import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
    const [language, setLanguage] = useState('tr');
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Kullanıcı profil bilgileri
    const [userName, setUserName] = useState('Misafir Kullanıcı');
    const [userEmail, setUserEmail] = useState('misafir@aiasistan.com');
    const [userAvatar, setUserAvatar] = useState(null);

    // Uygulama açıldığında kullanıcı bilgilerini yükleme
    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const parsedUserData = JSON.parse(userData);
                    setUser(parsedUserData);
                    setUserName(parsedUserData.name || 'Misafir Kullanıcı');
                    setUserEmail(parsedUserData.email || 'misafir@aiasistan.com');
                    setUserAvatar(parsedUserData.avatar);
                }

                // Ayarları yükle
                const storedDarkMode = await AsyncStorage.getItem('darkMode');
                if (storedDarkMode !== null) {
                    setIsDarkMode(storedDarkMode === 'true');
                }

                const storedNotifications = await AsyncStorage.getItem('notifications');
                if (storedNotifications !== null) {
                    setIsNotificationsEnabled(storedNotifications === 'true');
                }

                const storedLanguage = await AsyncStorage.getItem('language');
                if (storedLanguage) {
                    setLanguage(storedLanguage);
                }
            } catch (error) {
                console.log('Kullanıcı verisi yüklenirken hata:', error);
            }
        };

        loadUserData();
    }, []);

    // Kullanıcı oturum açtığında
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            // Gerçek bir uygulamada burada API çağrısı yapılır
            // Şimdilik basit bir simülasyon
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Demo için sabit kullanıcı
            const userData = {
                id: '1',
                name: 'Test Kullanıcı',
                email: email,
                avatar: null
            };

            setUser(userData);
            setUserName(userData.name);
            setUserEmail(userData.email);

            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            await AsyncStorage.setItem('userToken', 'demo-token');

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
            // Gerçek bir uygulamada burada API çağrısı yapılır
            // Şimdilik basit bir simülasyon
            await new Promise(resolve => setTimeout(resolve, 1500));

            const userData = {
                id: Date.now().toString(),
                name: name,
                email: email,
                avatar: null
            };

            setUser(userData);
            setUserName(userData.name);
            setUserEmail(userData.email);

            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            await AsyncStorage.setItem('userToken', 'demo-token');

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

    // Karanlık mod değiştiğinde
    const toggleDarkMode = async () => {
        try {
            const newMode = !isDarkMode;
            setIsDarkMode(newMode);
            await AsyncStorage.setItem('darkMode', newMode.toString());
        } catch (error) {
            console.log('Karanlık mod değiştirilirken hata:', error);
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

    // Dil değiştiğinde
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

            // Gerçek bir uygulamada API çağrısı yapılır
            await new Promise(resolve => setTimeout(resolve, 1000));

            const updatedUser = { ...user, name, email, avatar };
            setUser(updatedUser);
            setUserName(name);
            setUserEmail(email);
            if (avatar) setUserAvatar(avatar);

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

    return (
        <AppContext.Provider
            value={{
                isDarkMode,
                isNotificationsEnabled,
                language,
                user,
                isLoading,
                userName,
                userEmail,
                userAvatar,
                login,
                logout,
                register,
                toggleDarkMode,
                toggleNotifications,
                changeLanguage,
                updateUserProfile
            }}
        >
            {children}
        </AppContext.Provider>
    );
};