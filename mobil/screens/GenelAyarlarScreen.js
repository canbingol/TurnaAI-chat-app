import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Switch,
    ScrollView,
    Modal,
    Alert,
    Linking,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';

export default function GenelAyarlarScreen({ navigation }) {
    const {
        isDarkMode,
        isNotificationsEnabled,
        language,
        toggleDarkMode,
        toggleNotifications,
        changeLanguage,
        isLoading
    } = useContext(AppContext);

    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);
    const [fontSize, setFontSize] = useState('normal');
    const [cacheSize, setCacheSize] = useState(null);

    // Önbellek boyutunu hesapla (simülasyon)
    useEffect(() => {
        setTimeout(() => {
            setCacheSize('24.5 MB');
        }, 500);
    }, []);

    const languages = [
        { code: 'tr', label: 'Türkçe' },
        { code: 'en', label: 'İngilizce' },
        { code: 'de', label: 'Almanca' },
        { code: 'fr', label: 'Fransızca' },
        { code: 'es', label: 'İspanyolca' },
    ];

    const fontSizes = [
        { code: 'small', label: 'Küçük' },
        { code: 'normal', label: 'Normal' },
        { code: 'large', label: 'Büyük' },
        { code: 'xlarge', label: 'Çok Büyük' },
    ];

    // Dil değiştirme işlevi
    const handleLanguageChange = (langCode) => {
        setSelectedLanguage(langCode);
        setLanguageModalVisible(false);

        // Context'e kaydet
        if (changeLanguage) {
            changeLanguage(langCode);
        }

        // Dil değişikliği bildirimi
        Alert.alert(
            "Dil Değiştirildi",
            "Uygulama dili değiştirildi. Değişikliklerin tam olarak uygulanması için uygulamayı yeniden başlatmanız gerekebilir.",
            [{ text: "Tamam", style: "default" }]
        );
    };

    // Yazı boyutu değiştirme işlevi
    const handleFontSizeChange = (size) => {
        setFontSize(size);
        setFontSizeModalVisible(false);

        // Gerçek uygulamada burada font boyutunu kaydedin
        Alert.alert(
            "Yazı Boyutu Değiştirildi",
            "Yazı boyutu ayarınız değiştirildi. Değişikliğin uygulanması için uygulamayı yeniden başlatmanız gerekebilir.",
            [{ text: "Tamam", style: "default" }]
        );
    };

    // Önbelleği temizle
    const clearCache = () => {
        Alert.alert(
            "Önbelleği Temizle",
            "Uygulama önbelleğini temizlemek istediğinizden emin misiniz? Bu işlem uygulamayı yavaşlatabilir.",
            [
                {
                    text: "İptal",
                    style: "cancel"
                },
                {
                    text: "Temizle",
                    style: "destructive",
                    onPress: () => {
                        // Simülasyon - gerçek uygulamada önbellek temizleme kodunu buraya ekleyin
                        setTimeout(() => {
                            setCacheSize('0 MB');
                            Alert.alert("Bilgi", "Önbellek başarıyla temizlendi");
                        }, 1000);
                    }
                }
            ]
        );
    };

    // Bildirim ayarlarını göster
    const showNotificationSettings = () => {
        Alert.alert(
            "Bildirim Ayarları",
            "Hangi tür bildirimleri almak istiyorsunuz?",
            [
                {
                    text: "AI Asistan Yanıtları",
                    onPress: () => {
                        Alert.alert("Bilgi", "AI Asistan bildirim ayarları güncellendi");
                    }
                },
                {
                    text: "Sistem Bildirimleri",
                    onPress: () => {
                        Alert.alert("Bilgi", "Sistem bildirim ayarları güncellendi");
                    }
                },
                {
                    text: "Tüm Bildirimler",
                    onPress: () => {
                        Alert.alert("Bilgi", "Tüm bildirim ayarları güncellendi");
                    }
                },
                {
                    text: "İptal",
                    style: "cancel"
                }
            ]
        );
    };

    // Gizlilik Politikasını göster
    const showPrivacyPolicy = () => {
        Linking.openURL('https://www.turnaai.com/privacy');
    };

    // Kullanım Koşullarını göster
    const showTermsOfService = () => {
        Linking.openURL('https://www.turnaai.com/terms');
    };

    // Hakkında bilgisini göster
    const showAboutInfo = () => {
        Alert.alert(
            "Turna AI Hakkında",
            "Versiyon: 1.0.0\n\nTurna AI, yapay zeka destekli kişisel asistan uygulamasıdır. " +
            "Her türlü sorunuza yanıt verebilir, metin oluşturabilir ve başka birçok görevde size yardımcı olabilir.\n\n" +
            "© 2025 Turna AI Tüm Hakları Saklıdır.",
            [{ text: "Tamam", style: "default" }]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#8A2BE2" barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Ayarlar</Text>
                <View style={styles.placeholder} />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#8A2BE2" />
                </View>
            ) : (
                <ScrollView style={styles.scrollView}>
                    {/* Genel Ayarlar Bölümü */}
                    <View style={styles.settingsSection}>
                        <Text style={styles.sectionTitle}>Genel</Text>

                        <View style={styles.settingItem}>
                            <View style={styles.settingItemContent}>
                                <Ionicons name="moon-outline" size={24} color="#8A2BE2" />
                                <Text style={styles.settingItemText}>Karanlık Mod</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#767577", true: "#8A2BE2" }}
                                thumbColor={isDarkMode ? "#FFFFFF" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleDarkMode}
                                value={isDarkMode}
                            />
                        </View>

                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => setLanguageModalVisible(true)}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="globe-outline" size={24} color="#8A2BE2" />
                                <Text style={styles.settingItemText}>Dil</Text>
                            </View>
                            <View style={styles.settingValue}>
                                <Text style={styles.settingValueText}>
                                    {languages.find(lang => lang.code === selectedLanguage)?.label || 'Türkçe'}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color="#666" />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => setFontSizeModalVisible(true)}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="text-outline" size={24} color="#8A2BE2" />
                                <Text style={styles.settingItemText}>Yazı Boyutu</Text>
                            </View>
                            <View style={styles.settingValue}>
                                <Text style={styles.settingValueText}>
                                    {fontSizes.find(size => size.code === fontSize)?.label || 'Normal'}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color="#666" />
                            </View>
                        </TouchableOpacity>
                    </View>

                    {/* Bildirimler Bölümü */}
                    <View style={styles.settingsSection}>
                        <Text style={styles.sectionTitle}>Bildirimler</Text>

                        <View style={styles.settingItem}>
                            <View style={styles.settingItemContent}>
                                <Ionicons name="notifications-outline" size={24} color="#8A2BE2" />
                                <Text style={styles.settingItemText}>Bildirimleri Etkinleştir</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#767577", true: "#8A2BE2" }}
                                thumbColor={isNotificationsEnabled ? "#FFFFFF" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleNotifications}
                                value={isNotificationsEnabled}
                            />
                        </View>

                        {isNotificationsEnabled && (
                            <TouchableOpacity
                                style={styles.settingItem}
                                onPress={showNotificationSettings}
                            >
                                <View style={styles.settingItemContent}>
                                    <Ionicons name="options-outline" size={24} color="#8A2BE2" />
                                    <Text style={styles.settingItemText}>Bildirim Ayarları</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#666" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Depolama ve Veri Bölümü */}
                    <View style={styles.settingsSection}>
                        <Text style={styles.sectionTitle}>Depolama ve Veri</Text>

                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={clearCache}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="trash-outline" size={24} color="#8A2BE2" />
                                <Text style={styles.settingItemText}>Önbelleği Temizle</Text>
                            </View>
                            <Text style={styles.settingValueText}>{cacheSize || '...'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => Alert.alert("Bilgi", "Sohbet geçmişi temizlendi")}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="chatbubble-outline" size={24} color="#8A2BE2" />
                                <Text style={styles.settingItemText}>Sohbet Geçmişini Temizle</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>

                    {/* Yasal Bilgiler ve Destek */}
                    <View style={styles.settingsSection}>
                        <Text style={styles.sectionTitle}>Yasal ve Destek</Text>

                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={showPrivacyPolicy}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="shield-checkmark-outline" size={24} color="#8A2BE2" />
                                <Text style={styles.settingItemText}>Gizlilik Politikası</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#666" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={showTermsOfService}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="document-text-outline" size={24} color="#8A2BE2" />
                                <Text style={styles.settingItemText}>Kullanım Koşulları</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#666" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={() => Linking.openURL('mailto:destek@turnaai.com')}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="mail-outline" size={24} color="#8A2BE2" />
                                <Text style={styles.settingItemText}>Destek</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#666" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingItem}
                            onPress={showAboutInfo}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="information-circle-outline" size={24} color="#8A2BE2" />
                                <Text style={styles.settingItemText}>Hakkında</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            )}

            {/* Dil Seçimi Modal */}
            <Modal
                visible={languageModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setLanguageModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Dil Seçimi</Text>

                        <ScrollView style={styles.modalScrollView}>
                            {languages.map((lang) => (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[
                                        styles.modalItem,
                                        selectedLanguage === lang.code && styles.modalItemSelected
                                    ]}
                                    onPress={() => handleLanguageChange(lang.code)}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        selectedLanguage === lang.code && styles.modalItemTextSelected
                                    ]}>
                                        {lang.label}
                                    </Text>
                                    {selectedLanguage === lang.code && (
                                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setLanguageModalVisible(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>İptal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Yazı Boyutu Seçimi Modal */}
            <Modal
                visible={fontSizeModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setFontSizeModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Yazı Boyutu</Text>

                        <ScrollView style={styles.modalScrollView}>
                            {fontSizes.map((size) => (
                                <TouchableOpacity
                                    key={size.code}
                                    style={[
                                        styles.modalItem,
                                        fontSize === size.code && styles.modalItemSelected
                                    ]}
                                    onPress={() => handleFontSizeChange(size.code)}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        fontSize === size.code && styles.modalItemTextSelected
                                    ]}>
                                        {size.label}
                                    </Text>
                                    {fontSize === size.code && (
                                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setFontSizeModalVisible(false)}
                        >
                            <Text style={styles.modalCloseButtonText}>İptal</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#8A2BE2',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    placeholder: {
        width: 24, // Matches the back button width to center the title
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollView: {
        flex: 1,
    },
    settingsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        color: '#8A2BE2',
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 1,
    },
    settingItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingItemText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 15,
    },
    settingValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValueText: {
        color: '#888',
        fontSize: 14,
        marginRight: 5,
    },

    // Modal stilleri
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        padding: 20,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalScrollView: {
        marginBottom: 20,
        maxHeight: 300,
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    modalItemSelected: {
        backgroundColor: '#8A2BE2',
    },
    modalItemText: {
        color: '#fff',
        fontSize: 16,
    },
    modalItemTextSelected: {
        fontWeight: 'bold',
    },
    modalCloseButton: {
        backgroundColor: '#333',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});