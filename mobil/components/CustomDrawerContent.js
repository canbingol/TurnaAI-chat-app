import React, { useContext, useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground,
    Alert,
    Linking,
    Animated,
    Platform
} from 'react-native';
import {
    DrawerContentScrollView
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { CommonActions } from '@react-navigation/native';

function CustomDrawerContent(props) {
    const { userName, userEmail, userAvatar, logout, getColors, t } = useContext(AppContext);

    // Tema renklerini al
    const colors = getColors();

    // Animasyon değerleri
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(-50));

    useEffect(() => {
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
    }, []);

    const handleLogout = async () => {
        // Logout işlemini gerçekleştir
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
                            props.navigation.dispatch(
                                CommonActions.reset({
                                    index: 0,
                                    routes: [{ name: 'Giris' }],
                                })
                            );
                        }
                    }
                }
            ]
        );
    };

    // Düzeltilmiş navigasyon fonksiyonu
    const navigateToScreen = (screenName) => {
        // Drawer'ı kapat
        props.navigation.closeDrawer();

        // Kısa bir gecikme ile yönlendirme yap
        setTimeout(() => {
            props.navigation.navigate(screenName);
        }, 300);
    };

    // SSS göster
    const showFAQ = () => {
        Alert.alert(
            "Sık Sorulan Sorular",
            "1. Turna AI nedir?\nTurna AI, yapay zeka destekli bir asistan uygulamasıdır.\n\n" +
            "2. Turna AI'ı nasıl kullanabilirim?\nÖnce bir hesap oluşturun veya misafir olarak giriş yapın.\n\n" +
            "3. Uygulamanın internet bağlantısı gerekli mi?\nEvet, uygulamanın çoğu özelliği için internet bağlantısı gereklidir.\n\n" +
            "4. Verilerim güvende mi?\nEvet, tüm verileriniz şifrelenerek saklanır ve gizliliğinize önem verilir.\n\n" +
            "5. İnternet bağlantım yokken kullanabilir miyim?\nBazı temel özellikler çevrimdışı çalışabilir ancak çoğu özellik için internet gereklidir.",
            [{ text: "Tamam", style: "default" }]
        );
    };

    // İletişim göster
    const showContact = () => {
        Alert.alert(
            "İletişim Bilgileri",
            "E-posta: destek@turnaai.com\nTelefon: +90 212 123 4567\nWeb: www.turnaai.com",
            [
                {
                    text: "Web Sitesi",
                    onPress: () => Linking.openURL('https://www.turnaai.com')
                },
                {
                    text: "E-posta",
                    onPress: () => Linking.openURL('mailto:destek@turnaai.com')
                },
                {
                    text: "Kapat",
                    style: "cancel"
                }
            ]
        );
    };

    // Aktif ekranı kontrol et
    const isActiveScreen = (screenName) => {
        if (!props.state || !props.state.routes) return false;
        const activeRoute = props.state.routes[props.state.index];
        return activeRoute.name === screenName;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Üst Arka Plan */}
            <ImageBackground
                source={require('../assets/drawer-background.jpg')}
                style={styles.headerBackground}
            >
                {/* Profil Başlığı */}
                <Animated.View
                    style={[
                        styles.profileContainer,
                        {
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <Image
                        source={userAvatar ? { uri: userAvatar } : require('../assets/default-profile.png')}
                        style={[styles.profileImage, { borderColor: colors.primary }]}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{userName}</Text>
                        <Text style={styles.profileEmail}>{userEmail}</Text>
                    </View>
                </Animated.View>
            </ImageBackground>

            {/* Özel butonlar */}
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.drawerContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.drawerSection}>
                    {/* Ana Ekran butonu */}
                    <TouchableOpacity
                        style={[
                            styles.drawerItem,
                            isActiveScreen('Ana Ekran') && [styles.activeDrawerItem, { backgroundColor: colors.primary }]
                        ]}
                        onPress={() => navigateToScreen('Ana Ekran')}
                    >
                        <Ionicons
                            name="home-outline"
                            size={24}
                            color={isActiveScreen('Ana Ekran') ? "#FFFFFF" : colors.primary}
                        />
                        <Text style={[
                            styles.drawerItemText,
                            { color: colors.text },
                            isActiveScreen('Ana Ekran') && styles.activeDrawerItemText
                        ]}>{t('home')}</Text>
                    </TouchableOpacity>

                    {/* Profil butonu */}
                    <TouchableOpacity
                        style={[
                            styles.drawerItem,
                            isActiveScreen('Profil') && [styles.activeDrawerItem, { backgroundColor: colors.primary }]
                        ]}
                        onPress={() => navigateToScreen('Profil')}
                    >
                        <Ionicons
                            name="person-outline"
                            size={24}
                            color={isActiveScreen('Profil') ? "#FFFFFF" : colors.primary}
                        />
                        <Text style={[
                            styles.drawerItemText,
                            { color: colors.text },
                            isActiveScreen('Profil') && styles.activeDrawerItemText
                        ]}>{t('profile')}</Text>
                    </TouchableOpacity>

                    {/* Yardım butonu */}
                    <TouchableOpacity
                        style={[
                            styles.drawerItem,
                            isActiveScreen('Yardım') && [styles.activeDrawerItem, { backgroundColor: colors.primary }]
                        ]}
                        onPress={() => navigateToScreen('Yardım')}
                    >
                        <Ionicons
                            name="help-circle-outline"
                            size={24}
                            color={isActiveScreen('Yardım') ? "#FFFFFF" : colors.primary}
                        />
                        <Text style={[
                            styles.drawerItemText,
                            { color: colors.text },
                            isActiveScreen('Yardım') && styles.activeDrawerItemText
                        ]}>{t('help')}</Text>
                    </TouchableOpacity>

                    {/* Ayarlar butonu */}
                    <TouchableOpacity
                        style={[
                            styles.drawerItem,
                            isActiveScreen('Ayarlar') && [styles.activeDrawerItem, { backgroundColor: colors.primary }]
                        ]}
                        onPress={() => navigateToScreen('Ayarlar')}
                    >
                        <Ionicons
                            name="settings-outline"
                            size={24}
                            color={isActiveScreen('Ayarlar') ? "#FFFFFF" : colors.primary}
                        />
                        <Text style={[
                            styles.drawerItemText,
                            { color: colors.text },
                            isActiveScreen('Ayarlar') && styles.activeDrawerItemText
                        ]}>{t('settings')}</Text>
                    </TouchableOpacity>
                </View>

                {/* Ek Menü Elemanları */}
                <View style={[styles.divider, { backgroundColor: colors.border }]} />

                <View style={styles.drawerSection}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('helpandInfo')}</Text>

                    <TouchableOpacity
                        style={[styles.drawerItem, { backgroundColor: colors.background }]}
                        onPress={showFAQ}
                    >
                        <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
                        <Text style={[styles.drawerItemText, { color: colors.text }]}>{t('faq')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.drawerItem, { backgroundColor: colors.background }]}
                        onPress={showContact}
                    >
                        <Ionicons name="mail-outline" size={24} color={colors.primary} />
                        <Text style={[styles.drawerItemText, { color: colors.text }]}>{t('contact')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.drawerItem, { backgroundColor: colors.background }]}
                        onPress={() => Alert.alert(t('info'), `${t('version')}: 1.0.0\n© 2025 Turna AI ${t('allRightsReserved')}`)}
                    >
                        <Ionicons name="information" size={24} color={colors.primary} />
                        <Text style={[styles.drawerItemText, { color: colors.text }]}>{t('about')}</Text>
                    </TouchableOpacity>
                </View>
            </DrawerContentScrollView>

            {/* Alt Eylemler */}
            <View style={[styles.bottomSection, { borderTopColor: colors.border }]}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={22} color="#FFFFFF" />
                    <Text style={styles.logoutButtonText}>{t('logout')}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerBackground: {
        width: '100%',
        height: 170,
        justifyContent: 'flex-end',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 2,
    },
    profileInfo: {
        justifyContent: 'center',
    },
    profileName: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    profileEmail: {
        color: '#BBBBBB',
        fontSize: 14,
    },
    drawerContent: {
        paddingTop: 15,
    },
    drawerSection: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        marginLeft: 16,
        marginVertical: 10,
        letterSpacing: 0.5,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginVertical: 2,
        borderRadius: 10,
        marginHorizontal: 8,
    },
    activeDrawerItem: {
        backgroundColor: '#8A2BE2',
    },
    drawerItemText: {
        marginLeft: 16,
        fontSize: 16,
    },
    activeDrawerItemText: {
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    divider: {
        height: 1,
        marginVertical: 12,
        marginHorizontal: 16,
    },
    bottomSection: {
        padding: 16,
        borderTopWidth: 1,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF4757',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 10,
        justifyContent: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#FF4757',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    logoutButtonText: {
        color: '#FFFFFF',
        marginLeft: 10,
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default CustomDrawerContent; 