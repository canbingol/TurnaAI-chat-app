import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Image,
    Switch,
    ScrollView,
    StatusBar,
    Alert,
    ActivityIndicator,
    Platform,
    Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import * as ImagePicker from 'expo-image-picker';
import { CommonActions } from '@react-navigation/native';

export default function ProfilPaneliScreen({ navigation }) {
    const {
        theme,
        isNotificationsEnabled,
        userName,
        userEmail,
        userAvatar,
        changeTheme,
        toggleNotifications,
        logout,
        isLoading,
        getColors,
        t
    } = useContext(AppContext);

    // Tema renklerini al
    const colors = getColors();

    const [avatar, setAvatar] = useState(null);
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(-50));

    useEffect(() => {
        setAvatar(userAvatar);

        // Giriş animasyonu
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            })
        ]).start();
    }, [userAvatar]);

    const profilMenusu = [
        {
            icon: 'person-outline',
            baslik: 'Profil Bilgileri',
            onPress: () => navigation.navigate('KullaniciPaneli')
        },
        {
            icon: 'settings-outline',
            baslik: 'Ayarlar',
            onPress: () => navigateTo('Ayarlar')
        },
        {
            icon: 'shield-checkmark-outline',
            baslik: 'Gizlilik ve Güvenlik',
            onPress: () => showPrivacyOptions()
        },
        {
            icon: 'help-circle-outline',
            baslik: 'Yardım',
            onPress: () => navigateTo('Yardım')
        },
        {
            icon: 'log-out-outline',
            baslik: 'Çıkış Yap',
            onPress: handleLogout
        }
    ];

    // Navigasyon işlevi
    const navigateTo = (screenName) => {
        navigation.navigate(screenName);
    };

    // Gizlilik seçenekleri
    const showPrivacyOptions = () => {
        Alert.alert(
            "Gizlilik ve Güvenlik",
            "Hesabınızın gizlilik ve güvenlik ayarlarını yönetin",
            [
                {
                    text: "Şifre Değiştir",
                    onPress: () => Alert.alert("Bilgi", "Şifre değiştirme ekranı yakında eklenecek")
                },
                {
                    text: "Gizlilik Politikası",
                    onPress: () => Alert.alert("Bilgi", "Gizlilik politikası görüntüleme ekranı geliştirilmektedir")
                },
                {
                    text: "İptal",
                    style: "cancel"
                }
            ]
        );
    };

    // Çıkış yapma işlemi
    function handleLogout() {
        Alert.alert(
            "Çıkış Yap",
            "Oturumunuzu kapatmak istediğinize emin misiniz?",
            [
                {
                    text: "İptal",
                    style: "cancel"
                },
                {
                    text: "Çıkış Yap",
                    style: "destructive",
                    onPress: async () => {
                        const success = await logout();
                        if (success) {
                            navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Giris' }]
                                })
                            );
                        }
                    }
                }
            ]
        );
    }

    // Profil fotoğrafı seçme
    async function pickImage() {
        try {
            // İzinleri kontrol et
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('İzin Gerekli', 'Galeriye erişim izni vermeniz gerekiyor.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled) {
                setAvatar(result.assets[0].uri);
                Alert.alert('Başarılı', 'Profil fotoğrafınız güncellendi!');
                // Gerçek uygulamada burada avatar'ı AppContext aracılığıyla güncelleyebilirsiniz
                // updateUserAvatar(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Görsel seçilirken hata:', error);
            Alert.alert('Hata', 'Profil resmi seçilirken bir sorun oluştu.');
        }
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar backgroundColor={colors.statusBar} barStyle="light-content" />

            {/* Üst Navigasyon */}
            <View style={[styles.ustNavigation, { backgroundColor: colors.primary }]}>
                <TouchableOpacity
                    style={styles.menuButon}
                    onPress={() => navigation.openDrawer()}
                >
                    <Ionicons name="menu" size={26} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.baslik}>{t('profile')}</Text>
                <View style={styles.profilButon} />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Profil Başlığı */}
                    <Animated.View
                        style={[
                            styles.profilBasligi,
                            {
                                backgroundColor: colors.card,
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <View style={styles.profilResimKonteyneri}>
                            <Image
                                source={
                                    avatar
                                        ? { uri: avatar }
                                        : require('../assets/default-profile.png')
                                }
                                style={[styles.profilResmi, { borderColor: colors.primary }]}
                            />
                            <TouchableOpacity
                                style={[styles.profilDuzenleButonu, { backgroundColor: colors.primary }]}
                                onPress={pickImage}
                            >
                                <Ionicons name="camera" size={20} color="#FFFFFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={[styles.profilAdi, { color: colors.text }]}>{userName}</Text>
                        <Text style={[styles.profilEposta, { color: colors.textSecondary }]}>{userEmail}</Text>

                        <TouchableOpacity
                            style={[styles.duzenleButon, { backgroundColor: 'rgba(138, 43, 226, 0.15)', borderColor: colors.primary }]}
                            onPress={() => navigation.navigate('KullaniciPaneli')}
                        >
                            <Ionicons name="create-outline" size={18} color="#FFFFFF" />
                            <Text style={styles.duzenleButtonText}>{t('editProfile')}</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Ayarlar */}
                    <View style={styles.ayarlarBolumu}>
                        <View style={[styles.ayarOgesi, { backgroundColor: colors.card }]}>
                            <View style={styles.ayarIcerigi}>
                                <Ionicons name="moon-outline" size={24} color={colors.primary} />
                                <Text style={[styles.ayarMetni, { color: colors.text }]}>
                                    {theme === 'dark' ? t('darkMode') : theme === 'light' ? t('lightMode') : t('turquoiseMode')}
                                </Text>
                            </View>
                        </View>

                        <View style={[styles.ayarOgesi, { backgroundColor: colors.card }]}>
                            <View style={styles.ayarIcerigi}>
                                <Ionicons name="notifications-outline" size={24} color={colors.primary} />
                                <Text style={[styles.ayarMetni, { color: colors.text }]}>{t('notifications')}</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#767577", true: colors.primary }}
                                thumbColor={isNotificationsEnabled ? "#FFFFFF" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleNotifications}
                                value={isNotificationsEnabled}
                            />
                        </View>
                    </View>

                    {/* Profil Menüsü */}
                    {profilMenusu.map((menu, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.menuOgesi,
                                { backgroundColor: colors.card },
                                index === profilMenusu.length - 1 && [styles.lastMenuItem, { borderColor: 'rgba(255, 71, 87, 0.3)' }]
                            ]}
                            onPress={menu.onPress}
                        >
                            <View style={styles.menuIcerigi}>
                                <Ionicons name={menu.icon} size={24} color={
                                    menu.icon === 'log-out-outline' ? '#FF4757' : colors.primary
                                } />
                                <Text style={[
                                    styles.menuMetni,
                                    { color: colors.text },
                                    menu.icon === 'log-out-outline' && { color: '#FF4757' }
                                ]}>{menu.baslik}</Text>
                            </View>
                            <Ionicons
                                name="chevron-forward"
                                size={22}
                                color={menu.icon === 'log-out-outline' ? '#FF4757' : colors.textSecondary}
                            />
                        </TouchableOpacity>
                    ))}

                    {/* Uygulama Bilgileri */}
                    <View style={styles.appInfoContainer}>
                        <Image
                            source={require('../assets/turna-logo.svg')}
                            style={styles.appLogo}
                            resizeMode="contain"
                        />
                        <Text style={[styles.appName, { color: colors.primary }]}>Turna AI</Text>
                        <Text style={[styles.appVersion, { color: colors.textSecondary }]}>{t('version')} 1.0.0</Text>
                    </View>
                </ScrollView>
            )}

            {/* Alt Navigasyon */}
            <View style={[styles.altNavigasyon, { backgroundColor: colors.card }]}>
                <TouchableOpacity
                    style={styles.altNavButon}
                    onPress={() => navigation.navigate('Ana Ekran')}
                >
                    <Ionicons name="home-outline" size={24} color={colors.textSecondary} />
                    <Text style={[styles.altNavMetin, { color: colors.textSecondary }]}>{t('home')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.altNavButon}
                    onPress={() => navigation.navigate('Yardım')}
                >
                    <Ionicons name="help-circle-outline" size={24} color={colors.textSecondary} />
                    <Text style={[styles.altNavMetin, { color: colors.textSecondary }]}>{t('help')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.altNavButon}
                >
                    <Ionicons name="person" size={24} color={colors.primary} />
                    <Text style={[styles.altNavMetin, { color: colors.primary }]}>{t('profile')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ustNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#8A2BE2',
        paddingVertical: 15,
        paddingHorizontal: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    menuButon: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    profilButon: {
        width: 40,
    },
    baslik: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    profilBasligi: {
        alignItems: 'center',
        paddingVertical: 30,
        paddingHorizontal: 20,
        backgroundColor: '#1E1E1E',
        marginBottom: 20,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    profilResimKonteyneri: {
        position: 'relative',
        marginBottom: 15,
    },
    profilResmi: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 4,
        borderColor: '#8A2BE2',
    },
    profilDuzenleButonu: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#8A2BE2',
        borderRadius: 20,
        padding: 8,
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    profilAdi: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    profilEposta: {
        color: '#888',
        fontSize: 14,
        marginBottom: 20,
    },
    duzenleButon: {
        backgroundColor: 'rgba(138, 43, 226, 0.15)',
        borderRadius: 25,
        paddingVertical: 10,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#8A2BE2',
    },
    duzenleButtonText: {
        color: '#FFFFFF',
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    ayarlarBolumu: {
        marginBottom: 20,
    },
    ayarOgesi: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 1,
        borderRadius: 12,
        marginHorizontal: 15,
        marginBottom: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    ayarIcerigi: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ayarMetni: {
        color: '#FFFFFF',
        marginLeft: 15,
        fontSize: 16,
    },
    menuOgesi: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginHorizontal: 15,
        marginBottom: 10,
        borderRadius: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    lastMenuItem: {
        backgroundColor: 'rgba(255, 71, 87, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 71, 87, 0.3)',
    },
    menuIcerigi: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuMetni: {
        color: '#FFFFFF',
        marginLeft: 15,
        fontSize: 16,
    },
    appInfoContainer: {
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    appLogo: {
        width: 60,
        height: 60,
        marginBottom: 10,
    },
    appName: {
        color: '#8A2BE2',
        fontSize: 20,
        fontWeight: 'bold',
    },
    appVersion: {
        color: '#666',
        fontSize: 14,
        marginTop: 5,
    },
    altNavigasyon: {
        flexDirection: 'row',
        backgroundColor: '#1A1A1A',
        paddingVertical: 12,
        paddingHorizontal: 20,
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    altNavButon: {
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    altNavMetin: {
        color: '#888',
        marginTop: 5,
        fontSize: 12,
        fontWeight: '500',
    },
});