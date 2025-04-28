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
    ActivityIndicator,
    Platform,
    Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext, THEMES, LANGUAGES } from '../context/AppContext';
import { CommonActions } from '@react-navigation/native';

export default function GenelAyarlarScreen({ navigation }) {
    const {
        theme,
        language,
        isNotificationsEnabled,
        toggleNotifications,
        changeTheme,
        changeLanguage,
        isLoading,
        getColors,
        t
    } = useContext(AppContext);

    // Tema ve renkleri al
    const colors = getColors();

    const [languageModalVisible, setLanguageModalVisible] = useState(false);
    const [themeModalVisible, setThemeModalVisible] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState(language);
    const [selectedTheme, setSelectedTheme] = useState(theme);
    const [fontSizeModalVisible, setFontSizeModalVisible] = useState(false);
    const [fontSize, setFontSize] = useState('normal');
    const [cacheSize, setCacheSize] = useState(null);

    // Animasyon değerleri
    const [fadeAnim] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(30));

    useEffect(() => {
        // Giriş animasyonu
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            })
        ]).start();
    }, []);

    // Önbellek boyutunu hesapla (simülasyon)
    useEffect(() => {
        setTimeout(() => {
            setCacheSize('24.5 MB');
        }, 500);
    }, []);

    const themes = [
        { code: THEMES.DARK, label: t('darkMode'), icon: 'moon-outline' },
        { code: THEMES.LIGHT, label: t('lightMode'), icon: 'sunny-outline' },
        { code: THEMES.TURQUOISE, label: t('turquoiseMode'), icon: 'color-palette-outline' }
    ];

    const languages = [
        { code: LANGUAGES.TR, label: t('turkish'), flag: '🇹🇷' },
        { code: LANGUAGES.EN, label: t('english'), flag: '🇬🇧' },
        { code: LANGUAGES.FR, label: t('french'), flag: '🇫🇷' }
    ];

    const fontSizes = [
        { code: 'small', label: t('small') },
        { code: 'normal', label: t('normal') },
        { code: 'large', label: t('large') },
        { code: 'xlarge', label: t('extraLarge') },
    ];

    // Tema değiştirme işlevi
    const handleThemeChange = (themeCode) => {
        setSelectedTheme(themeCode);
        setThemeModalVisible(false);

        // Context'e kaydet
        if (changeTheme) {
            changeTheme(themeCode);
        }

        // Tema değişikliği bildirimi
        Alert.alert(
            t("themeChanged"),
            t("themeChangeApplied"),
            [{ text: t("ok"), style: "default" }]
        );
    };

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
            t("languageChanged"),
            t("languageChangeApplied"),
            [{ text: t("ok"), style: "default" }]
        );
    };

    // Yazı boyutu değiştirme işlevi
    const handleFontSizeChange = (size) => {
        setFontSize(size);
        setFontSizeModalVisible(false);

        // Gerçek uygulamada burada font boyutunu kaydedin
        Alert.alert(
            t("fontSizeChanged"),
            t("fontSizeChangeApplied"),
            [{ text: t("ok"), style: "default" }]
        );
    };

    // Önbelleği temizle
    const clearCache = () => {
        Alert.alert(
            t("clearCache"),
            t("clearCacheConfirm"),
            [
                {
                    text: t("cancel"),
                    style: "cancel"
                },
                {
                    text: t("clear"),
                    style: "destructive",
                    onPress: () => {
                        // Simülasyon - gerçek uygulamada önbellek temizleme kodunu buraya ekleyin
                        setTimeout(() => {
                            setCacheSize('0 MB');
                            Alert.alert(t("info"), t("cacheCleared"));
                        }, 1000);
                    }
                }
            ]
        );
    };

    // Bildirim ayarlarını göster
    const showNotificationSettings = () => {
        Alert.alert(
            t("notificationSettings"),
            t("notificationSettingsDesc"),
            [
                {
                    text: t("aiAssistantNotifications"),
                    onPress: () => {
                        Alert.alert(t("info"), t("aiAssistantNotificationsUpdated"));
                    }
                },
                {
                    text: t("systemNotifications"),
                    onPress: () => {
                        Alert.alert(t("info"), t("systemNotificationsUpdated"));
                    }
                },
                {
                    text: t("allNotifications"),
                    onPress: () => {
                        Alert.alert(t("info"), t("allNotificationsUpdated"));
                    }
                },
                {
                    text: t("cancel"),
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
            t("aboutTurnaAI"),
            t("versionInfo") + "\n\n" +
            t("aboutDescription") + "\n\n" +
            t("copyright"),
            [{ text: t("ok"), style: "default" }]
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar backgroundColor={colors.statusBar} barStyle="light-content" />

            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{t('settings')}</Text>
                <View style={styles.placeholder} />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <ScrollView
                    style={styles.scrollView}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Genel Ayarlar Bölümü */}
                    <Animated.View
                        style={[
                            styles.settingsSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: slideAnim }]
                            }
                        ]}
                    >
                        <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('general')}</Text>

                        <TouchableOpacity
                            style={[styles.settingItem, { backgroundColor: colors.card }]}
                            onPress={() => setThemeModalVisible(true)}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons
                                    name={
                                        theme === THEMES.DARK ? "moon-outline" :
                                            theme === THEMES.LIGHT ? "sunny-outline" :
                                                "color-palette-outline"
                                    }
                                    size={24}
                                    color={colors.primary}
                                />
                                <Text style={[styles.settingItemText, { color: colors.text }]}>{t('theme')}</Text>
                            </View>
                            <View style={styles.settingValue}>
                                <Text style={[styles.settingValueText, { color: colors.textSecondary }]}>
                                    {themes.find(t => t.code === theme)?.label || t('darkMode')}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.settingItem, { backgroundColor: colors.card }]}
                            onPress={() => setLanguageModalVisible(true)}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="globe-outline" size={24} color={colors.primary} />
                                <Text style={[styles.settingItemText, { color: colors.text }]}>{t('language')}</Text>
                            </View>
                            <View style={styles.settingValue}>
                                <Text style={[styles.settingValueText, { color: colors.textSecondary }]}>
                                    {languages.find(lang => lang.code === language)?.flag} {languages.find(lang => lang.code === language)?.label || t('turkish')}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.settingItem, { backgroundColor: colors.card }]}
                            onPress={() => setFontSizeModalVisible(true)}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="text-outline" size={24} color={colors.primary} />
                                <Text style={[styles.settingItemText, { color: colors.text }]}>{t('fontSize')}</Text>
                            </View>
                            <View style={styles.settingValue}>
                                <Text style={[styles.settingValueText, { color: colors.textSecondary }]}>
                                    {fontSizes.find(size => size.code === fontSize)?.label || t('normal')}
                                </Text>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Bildirimler Bölümü */}
                    <Animated.View
                        style={[
                            styles.settingsSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: Animated.multiply(slideAnim, 1.2) }]
                            }
                        ]}
                    >
                        <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('notifications')}</Text>

                        <View style={[styles.settingItem, { backgroundColor: colors.card }]}>
                            <View style={styles.settingItemContent}>
                                <Ionicons name="notifications-outline" size={24} color={colors.primary} />
                                <Text style={[styles.settingItemText, { color: colors.text }]}>{t('enableNotifications')}</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#767577", true: colors.primary }}
                                thumbColor={isNotificationsEnabled ? "#FFFFFF" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleNotifications}
                                value={isNotificationsEnabled}
                            />
                        </View>

                        {isNotificationsEnabled && (
                            <TouchableOpacity
                                style={[styles.settingItem, { backgroundColor: colors.card }]}
                                onPress={showNotificationSettings}
                            >
                                <View style={styles.settingItemContent}>
                                    <Ionicons name="options-outline" size={24} color={colors.primary} />
                                    <Text style={[styles.settingItemText, { color: colors.text }]}>{t('notificationSettings')}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                            </TouchableOpacity>
                        )}
                    </Animated.View>

                    {/* Depolama ve Veri Bölümü */}
                    <Animated.View
                        style={[
                            styles.settingsSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: Animated.multiply(slideAnim, 1.4) }]
                            }
                        ]}
                    >
                        <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('storageAndData')}</Text>

                        <TouchableOpacity
                            style={[styles.settingItem, { backgroundColor: colors.card }]}
                            onPress={clearCache}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="trash-outline" size={24} color={colors.primary} />
                                <Text style={[styles.settingItemText, { color: colors.text }]}>{t('clearCache')}</Text>
                            </View>
                            <Text style={[styles.settingValueText, { color: colors.textSecondary }]}>{cacheSize || '...'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.settingItem, { backgroundColor: colors.card }]}
                            onPress={() => Alert.alert(t("info"), t("chatHistoryCleared"))}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="chatbubble-outline" size={24} color={colors.primary} />
                                <Text style={[styles.settingItemText, { color: colors.text }]}>{t('clearChatHistory')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Yasal Bilgiler ve Destek */}
                    <Animated.View
                        style={[
                            styles.settingsSection,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: Animated.multiply(slideAnim, 1.6) }]
                            }
                        ]}
                    >
                        <Text style={[styles.sectionTitle, { color: colors.primary }]}>{t('legalAndSupport')}</Text>

                        <TouchableOpacity
                            style={[styles.settingItem, { backgroundColor: colors.card }]}
                            onPress={showPrivacyPolicy}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="shield-checkmark-outline" size={24} color={colors.primary} />
                                <Text style={[styles.settingItemText, { color: colors.text }]}>{t('privacyPolicy')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.settingItem, { backgroundColor: colors.card }]}
                            onPress={showTermsOfService}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="document-text-outline" size={24} color={colors.primary} />
                                <Text style={[styles.settingItemText, { color: colors.text }]}>{t('termsOfService')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.settingItem, { backgroundColor: colors.card }]}
                            onPress={() => Linking.openURL('mailto:destek@turnaai.com')}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="mail-outline" size={24} color={colors.primary} />
                                <Text style={[styles.settingItemText, { color: colors.text }]}>{t('support')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.settingItem, { backgroundColor: colors.card }]}
                            onPress={showAboutInfo}
                        >
                            <View style={styles.settingItemContent}>
                                <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
                                <Text style={[styles.settingItemText, { color: colors.text }]}>{t('about')}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </Animated.View>
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
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{t('chooseLanguage')}</Text>

                        <ScrollView style={styles.modalScrollView}>
                            {languages.map((lang) => (
                                <TouchableOpacity
                                    key={lang.code}
                                    style={[
                                        styles.modalItem,
                                        selectedLanguage === lang.code && [styles.modalItemSelected, { backgroundColor: colors.primary }]
                                    ]}
                                    onPress={() => handleLanguageChange(lang.code)}
                                >
                                    <View style={styles.modalItemTextContainer}>
                                        <Text style={styles.flagText}>{lang.flag}</Text>
                                        <Text style={[
                                            styles.modalItemText,
                                            selectedLanguage === lang.code ? styles.modalItemTextSelected : { color: colors.text }
                                        ]}>
                                            {lang.label}
                                        </Text>
                                    </View>
                                    {selectedLanguage === lang.code && (
                                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.modalCloseButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => setLanguageModalVisible(false)}
                        >
                            <Text style={[styles.modalCloseButtonText, { color: colors.text }]}>{t('cancel')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Tema Seçimi Modal */}
            <Modal
                visible={themeModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setThemeModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{t('chooseTheme')}</Text>

                        <ScrollView style={styles.modalScrollView}>
                            {themes.map((themeOption) => (
                                <TouchableOpacity
                                    key={themeOption.code}
                                    style={[
                                        styles.modalItem,
                                        selectedTheme === themeOption.code && [styles.modalItemSelected, { backgroundColor: colors.primary }]
                                    ]}
                                    onPress={() => handleThemeChange(themeOption.code)}
                                >
                                    <View style={styles.modalItemTextContainer}>
                                        <Ionicons name={themeOption.icon} size={24} color={
                                            selectedTheme === themeOption.code ? "#FFFFFF" :
                                                themeOption.code === THEMES.DARK ? "#9775fa" :
                                                    themeOption.code === THEMES.LIGHT ? "#fcc419" :
                                                        "#00CED1"
                                        } style={styles.themeIcon} />
                                        <Text style={[
                                            styles.modalItemText,
                                            selectedTheme === themeOption.code ? styles.modalItemTextSelected : { color: colors.text }
                                        ]}>
                                            {themeOption.label}
                                        </Text>
                                    </View>
                                    {selectedTheme === themeOption.code && (
                                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <TouchableOpacity
                            style={[styles.modalCloseButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => setThemeModalVisible(false)}
                        >
                            <Text style={[styles.modalCloseButtonText, { color: colors.text }]}>{t('cancel')}</Text>
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
                    <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalTitle, { color: colors.text }]}>{t('fontSize')}</Text>

                        <ScrollView style={styles.modalScrollView}>
                            {fontSizes.map((size) => (
                                <TouchableOpacity
                                    key={size.code}
                                    style={[
                                        styles.modalItem,
                                        fontSize === size.code && [styles.modalItemSelected, { backgroundColor: colors.primary }]
                                    ]}
                                    onPress={() => handleFontSizeChange(size.code)}
                                >
                                    <Text style={[
                                        styles.modalItemText,
                                        fontSize === size.code ? styles.modalItemTextSelected : { color: colors.text },
                                        size.code === 'small' && { fontSize: 14 },
                                        size.code === 'large' && { fontSize: 18 },
                                        size.code === 'xlarge' && { fontSize: 20 }
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
                            style={[styles.modalCloseButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                            onPress={() => setFontSizeModalVisible(false)}
                        >
                            <Text style={[styles.modalCloseButtonText, { color: colors.text }]}>{t('cancel')}</Text>
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    placeholder: {
        width: 40,
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
        fontSize: 16,
        fontWeight: 'bold',
        marginHorizontal: 20,
        marginTop: 20,
        marginBottom: 10,
        letterSpacing: 0.5,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        marginBottom: 10,
        marginHorizontal: 15,
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
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    settingItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingItemText: {
        fontSize: 16,
        marginLeft: 15,
    },
    settingValue: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValueText: {
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
        borderRadius: 16,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    modalTitle: {
        fontSize: 20,
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
        paddingHorizontal: 15,
        borderRadius: 10,
        marginBottom: 8,
    },
    modalItemSelected: {
        backgroundColor: '#8A2BE2',
    },
    modalItemTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalItemText: {
        fontSize: 16,
    },
    modalItemTextSelected: {
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    flagText: {
        fontSize: 20,
        marginRight: 10,
    },
    themeIcon: {
        marginRight: 10,
    },
    modalCloseButton: {
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
    },
    modalCloseButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
});