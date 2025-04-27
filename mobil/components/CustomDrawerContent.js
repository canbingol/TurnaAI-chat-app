// CustomDrawerContent.js içinde navigasyon düzeltmesi

import React, { useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground,
    Alert,
    Linking
} from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { CommonActions } from '@react-navigation/native';

function CustomDrawerContent(props) {
    const { userName, userEmail, userAvatar, logout } = useContext(AppContext);

    const handleLogout = async () => {
        // Logout işlemini gerçekleştir
        const success = await logout();
        if (success) {
            props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Giris' }],
                })
            );
        }
    };

    // DÜZELTME: Drawer içindeki ekranlara güvenli navigasyon
    const navigateToScreen = (screenName) => {
        // Drawer'ı kapat
        props.navigation.closeDrawer();

        // Kısa bir gecikme ile navigasyon yap
        setTimeout(() => {
            // Ana ekran ve Profil için drawer'ın kendi navigate fonksiyonunu kullan
            if (screenName === 'Yardım' || screenName === 'GenelAyarlar') {
                // Stack navigator içindeki ekranlar için CommonActions kullan
                props.navigation.dispatch(
                    CommonActions.navigate({
                        name: screenName
                    })
                );
            } else {
                // Drawer navigator içindeki ekranlar için jumpTo kullan
                props.navigation.jumpTo(screenName);
            }
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

    return (
        <View style={styles.container}>
            {/* Üst Arka Plan */}
            <ImageBackground
                source={require('../assets/drawer-background.jpg')}
                style={styles.headerBackground}
            >
                {/* Profil Başlığı */}
                <View style={styles.profileContainer}>
                    <Image
                        source={userAvatar ? { uri: userAvatar } : require('../assets/default-profile.png')}
                        style={styles.profileImage}
                    />
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{userName}</Text>
                        <Text style={styles.profileEmail}>{userEmail}</Text>
                    </View>
                </View>
            </ImageBackground>

            {/* DÜZELTME: DrawerItemList yerine özel butonlar */}
            <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
                <View style={styles.drawerSection}>
                    {/* Ana Ekran butonu */}
                    <TouchableOpacity
                        style={[styles.drawerItem, props.state.index === 0 && styles.activeDrawerItem]}
                        onPress={() => navigateToScreen('Ana Ekran')}
                    >
                        <Ionicons
                            name="home-outline"
                            size={22}
                            color={props.state.index === 0 ? "#FFFFFF" : "#8A2BE2"}
                        />
                        <Text style={[
                            styles.drawerItemText,
                            props.state.index === 0 && styles.activeDrawerItemText
                        ]}>Ana Ekran</Text>
                    </TouchableOpacity>

                    {/* Profil butonu */}
                    <TouchableOpacity
                        style={[styles.drawerItem, props.state.index === 1 && styles.activeDrawerItem]}
                        onPress={() => navigateToScreen('Profil')}
                    >
                        <Ionicons
                            name="person-outline"
                            size={22}
                            color={props.state.index === 1 ? "#FFFFFF" : "#8A2BE2"}
                        />
                        <Text style={[
                            styles.drawerItemText,
                            props.state.index === 1 && styles.activeDrawerItemText
                        ]}>Profil</Text>
                    </TouchableOpacity>
                </View>

                {/* Ek Menü Elemanları */}
                <View style={styles.divider} />

                <View style={styles.drawerSection}>
                    <Text style={styles.sectionTitle}>Yardım & Bilgi</Text>

                    <TouchableOpacity
                        style={styles.drawerItem}
                        onPress={() => navigateToScreen('Yardım')}
                    >
                        <Ionicons name="help-circle-outline" size={22} color="#8A2BE2" />
                        <Text style={styles.drawerItemText}>Yardım</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.drawerItem}
                        onPress={showFAQ}
                    >
                        <Ionicons name="information-circle-outline" size={22} color="#8A2BE2" />
                        <Text style={styles.drawerItemText}>Sık Sorulan Sorular</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.drawerItem}
                        onPress={showContact}
                    >
                        <Ionicons name="mail-outline" size={22} color="#8A2BE2" />
                        <Text style={styles.drawerItemText}>İletişim</Text>
                    </TouchableOpacity>
                </View>
            </DrawerContentScrollView>

            {/* Alt Eylemler */}
            <View style={styles.bottomSection}>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigateToScreen('GenelAyarlar')}
                >
                    <Ionicons name="settings-outline" size={22} color="#8A2BE2" />
                    <Text style={styles.drawerItemText}>Ayarlar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={22} color="#8A2BE2" />
                    <Text style={styles.drawerItemText}>Çıkış Yap</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
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
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
        borderWidth: 2,
        borderColor: '#8A2BE2',
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
        paddingTop: 10,
    },
    drawerSection: {
        marginBottom: 10,
    },
    sectionTitle: {
        color: '#666',
        fontSize: 14,
        marginLeft: 16,
        marginVertical: 10,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginVertical: 2,
        borderRadius: 8,
        marginHorizontal: 5,
    },
    activeDrawerItem: {
        backgroundColor: '#8A2BE2',
    },
    drawerItemText: {
        color: '#FFFFFF',
        marginLeft: 32,
        fontSize: 16,
    },
    activeDrawerItemText: {
        fontWeight: 'bold',
    },
    bottomSection: {
        borderTopColor: '#333',
        borderTopWidth: 1,
        paddingVertical: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginVertical: 10,
        marginHorizontal: 16,
    },
});

export default CustomDrawerContent;