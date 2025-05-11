import React, { useState, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    StatusBar,
    TextInput,
    Animated,
    Linking,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CommonActions } from '@react-navigation/native';
import { AppContext } from '../context/AppContext';
import { showInfoAlert } from '../utils/AlertManager';

export default function YardimPaneliScreen({ navigation }) {
    const { getColors, t, language } = useContext(AppContext);
    const colors = getColors();

    const [genisleyenBolum, setGenisleyenBolum] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSections, setFilteredSections] = useState([]);
    const [rotateAnimation] = useState(new Animated.Value(0));
    const [fadeAnimation] = useState(new Animated.Value(0));
    const [slideAnim] = useState(new Animated.Value(30));

    // Yardım bölümleri için dil desteği
    const getLocalizedHelpSections = () => {
        switch (language) {
            case 'en':
                return [
                    {
                        baslik: 'How to get started?',
                        icerik: 'To start using the AI Assistant app:\n\n1. Register or continue as a guest\n2. Click "New Chat" button on the home screen\n3. Enter a chat title and start the chat\n4. Type your question in the text box and send\n\nYou can adjust your preferences in settings to use the app more efficiently.',
                        icon: 'rocket-outline'
                    },
                    {
                        baslik: 'Chat features',
                        icerik: 'With the chat feature, you can get help from our AI-powered assistant.\n\n• You can send files along with text\n• You can record voice\n• You can ask questions on specific topics\n• Your chat history is saved\n• You can listen to AI responses with voice\n\nOur AI assistant can help you with programming, mathematics, general knowledge, and creative content.',
                        icon: 'chatbubble-ellipses-outline'
                    },
                    {
                        baslik: 'File sharing',
                        icerik: 'For file sharing, you can use the + button in the chat screen or the "Upload File" option on the main screen.\n\nSupported file types:\n• Text files (.txt, .md)\n• Code files (.js, .py, .java, etc.)\n• Document files (.pdf, .docx)\n• Spreadsheet files (.xlsx, .csv)\n\nFile size can be up to 10MB.',
                        icon: 'document-outline'
                    },
                    {
                        baslik: 'Voice commands',
                        icerik: 'To use voice commands:\n\n1. Click the "Voice Command" button on the main screen\n2. Press and hold the microphone icon on the chat screen\n3. Say your question and release\n\nVoice commands are currently in beta and may experience some issues.',
                        icon: 'mic-outline'
                    },
                    {
                        baslik: 'Profile settings',
                        icerik: 'You can edit your account information and preferences from profile settings.\n\nActions you can take:\n• Change profile picture\n• Update username\n• Change password\n• Edit notification preferences\n• Choose Dark/Light theme\n• Change language\n• Log out',
                        icon: 'person-outline'
                    },
                    {
                        baslik: 'Privacy and Data Security',
                        icerik: 'AI Assistant values the privacy and security of your user data. Your chats are encrypted and can only be viewed by you.\n\nFor more information about how your data is used, you can review our Privacy Policy.',
                        icon: 'shield-checkmark-outline'
                    },
                    {
                        baslik: 'New Features',
                        icerik: 'Upcoming new features:\n\n• Image generation\n• Multiple language support\n• Real-time translation\n• Voice recognition improvements\n• File analysis and summarization\n• Group chats\n\nMore features will be added with each update.',
                        icon: 'sparkles-outline'
                    },
                    {
                        baslik: 'Common Issues',
                        icerik: 'Common issues and solutions:\n\n• App running slow → Clear cache\n• Not receiving notifications → Check notification permissions\n• No response received → Check your internet connection\n• Cannot upload file → Check file size and format\n\nIf problems persist, contact our support team.',
                        icon: 'help-circle-outline'
                    },
                    {
                        baslik: 'Contact',
                        icerik: 'For questions, issues, or feedback:\n\nEmail: support@aiassistant.com\nWeb: www.aiassistant.com/support\n\nResponse time is usually 24 hours.',
                        icon: 'mail-outline'
                    }
                ];
            case 'fr':
                return [
                    {
                        baslik: 'Comment commencer?',
                        icerik: 'Pour commencer à utiliser l\'application AI Assistant:\n\n1. Inscrivez-vous ou continuez en tant qu\'invité\n2. Cliquez sur le bouton "Nouvelle Discussion" sur l\'écran d\'accueil\n3. Entrez un titre de discussion et commencez la discussion\n4. Tapez votre question dans la zone de texte et envoyez\n\nVous pouvez ajuster vos préférences dans les paramètres pour utiliser l\'application plus efficacement.',
                        icon: 'rocket-outline'
                    },
                    {
                        baslik: 'Fonctionnalités de discussion',
                        icerik: 'Avec la fonction de discussion, vous pouvez obtenir de l\'aide de notre assistant alimenté par l\'IA.\n\n• Vous pouvez envoyer des fichiers avec du texte\n• Vous pouvez enregistrer la voix\n• Vous pouvez poser des questions sur des sujets spécifiques\n• Votre historique de discussion est enregistré\n• Vous pouvez écouter les réponses de l\'IA avec la voix\n\nNotre assistant IA peut vous aider en programmation, mathématiques, connaissances générales et contenu créatif.',
                        icon: 'chatbubble-ellipses-outline'
                    },
                    {
                        baslik: 'Partage de fichiers',
                        icerik: 'Pour le partage de fichiers, vous pouvez utiliser le bouton + dans l\'écran de discussion ou l\'option "Télécharger un fichier" sur l\'écran principal.\n\nTypes de fichiers pris en charge:\n• Fichiers texte (.txt, .md)\n• Fichiers de code (.js, .py, .java, etc.)\n• Fichiers de document (.pdf, .docx)\n• Fichiers de tableur (.xlsx, .csv)\n\nLa taille du fichier peut aller jusqu\'à 10 Mo.',
                        icon: 'document-outline'
                    },
                    {
                        baslik: 'Commandes vocales',
                        icerik: 'Pour utiliser les commandes vocales:\n\n1. Cliquez sur le bouton "Commande Vocale" sur l\'écran principal\n2. Appuyez et maintenez l\'icône du microphone sur l\'écran de discussion\n3. Dites votre question et relâchez\n\nLes commandes vocales sont actuellement en version bêta et peuvent rencontrer certains problèmes.',
                        icon: 'mic-outline'
                    },
                    {
                        baslik: 'Paramètres du profil',
                        icerik: 'Vous pouvez modifier vos informations de compte et vos préférences à partir des paramètres du profil.\n\nActions que vous pouvez effectuer:\n• Changer la photo de profil\n• Mettre à jour le nom d\'utilisateur\n• Changer le mot de passe\n• Modifier les préférences de notification\n• Choisir le thème Sombre/Clair\n• Changer de langue\n• Se déconnecter',
                        icon: 'person-outline'
                    },
                    {
                        baslik: 'Confidentialité et Sécurité des Données',
                        icerik: 'AI Assistant valorise la confidentialité et la sécurité de vos données utilisateur. Vos discussions sont cryptées et ne peuvent être consultées que par vous.\n\nPour plus d\'informations sur l\'utilisation de vos données, vous pouvez consulter notre Politique de Confidentialité.',
                        icon: 'shield-checkmark-outline'
                    },
                    {
                        baslik: 'Nouvelles Fonctionnalités',
                        icerik: 'Nouvelles fonctionnalités à venir:\n\n• Génération d\'images\n• Support multilingue\n• Traduction en temps réel\n• Améliorations de la reconnaissance vocale\n• Analyse et résumé de fichiers\n• Discussions de groupe\n\nD\'autres fonctionnalités seront ajoutées à chaque mise à jour.',
                        icon: 'sparkles-outline'
                    },
                    {
                        baslik: 'Problèmes Courants',
                        icerik: 'Problèmes courants et solutions:\n\n• Application lente → Effacer le cache\n• Pas de notifications → Vérifier les autorisations de notification\n• Aucune réponse reçue → Vérifier votre connexion Internet\n• Impossible de télécharger un fichier → Vérifier la taille et le format du fichier\n\nSi les problèmes persistent, contactez notre équipe de support.',
                        icon: 'help-circle-outline'
                    },
                    {
                        baslik: 'Contact',
                        icerik: 'Pour les questions, problèmes ou commentaires:\n\nEmail: support@aiassistant.com\nWeb: www.aiassistant.com/support\n\nLe temps de réponse est généralement de 24 heures.',
                        icon: 'mail-outline'
                    }
                ];
            default: // 'tr' ve diğerleri
                return [
                    {
                        baslik: 'Nasıl başlangıç yapılır?',
                        icerik: 'AI Asistan uygulamasını kullanmaya başlamak için:\n\n1. Kayıt olun veya misafir olarak devam edin\n2. Ana ekranda "Yeni Sohbet" butonuna tıklayın\n3. Sohbet başlığı girin ve sohbeti başlatın\n4. Metin kutusuna sorunuzu yazın ve gönderin\n\nUygulamayı daha verimli kullanmak için ayarlardan tercihlerinizi düzenleyebilirsiniz.',
                        icon: 'rocket-outline'
                    },
                    {
                        baslik: 'Sohbet özellikleri',
                        icerik: 'Sohbet özelliği ile yapay zeka destekli asistanımızdan yardım alabilirsiniz.\n\n• Metin yanında dosya gönderebilirsiniz\n• Ses kaydı yapabilirsiniz\n• Özel konularda sorular sorabilirsiniz\n• Sohbet geçmişiniz kaydedilir\n• AI yanıtlarını sesli dinleyebilirsiniz\n\nAI asistanımız, programlama, matematik, genel bilgi ve yaratıcı içerik gibi alanlarda size yardımcı olabilir.',
                        icon: 'chatbubble-ellipses-outline'
                    },
                    {
                        baslik: 'Dosya paylaşımı',
                        icerik: 'Dosya paylaşımı için sohbet ekranındaki + butonunu veya ana ekrandaki "Dosya Yükle" seçeneğini kullanabilirsiniz.\n\nDesteklenen dosya türleri:\n• Metin dosyaları (.txt, .md)\n• Kod dosyaları (.js, .py, .java, vb.)\n• Belge dosyaları (.pdf, .docx)\n• Tablo dosyaları (.xlsx, .csv)\n\nDosya boyutu en fazla 10MB olabilir.',
                        icon: 'document-outline'
                    },
                    {
                        baslik: 'Sesli komutlar',
                        icerik: 'Sesli komut vermek için:\n\n1. Ana ekranda "Sesli Komut" butonuna tıklayın\n2. Sohbet ekranında mikrofon simgesine basılı tutun\n3. Sorunuzu söyleyin ve bırakın\n\nSesli komutlar şu an beta aşamasındadır ve bazı aksaklıklar yaşanabilir.',
                        icon: 'mic-outline'
                    },
                    {
                        baslik: 'Profil ayarları',
                        icerik: 'Profil ayarlarından hesap bilgilerinizi ve tercihlerinizi düzenleyebilirsiniz.\n\nYapabileceğiniz işlemler:\n• Profil fotoğrafı değiştirme\n• Kullanıcı adı güncelleme\n• Şifre değiştirme\n• Bildirim tercihlerini düzenleme\n• Karanlık/Aydınlık tema seçimi\n• Dil değiştirme\n• Oturumu kapatma',
                        icon: 'person-outline'
                    },
                    {
                        baslik: 'Gizlilik ve Veri Güvenliği',
                        icerik: 'AI Asistan, kullanıcı verilerinizin gizliliğine ve güvenliğine önem verir. Sohbetleriniz şifrelenir ve yalnızca siz tarafından görüntülenebilir.\n\nVerilerinizin kullanımı hakkında daha fazla bilgi için Gizlilik Politikamızı inceleyebilirsiniz.',
                        icon: 'shield-checkmark-outline'
                    },
                    {
                        baslik: 'Yeni Özellikler',
                        icerik: 'Yakında gelecek yeni özellikler:\n\n• Görsel oluşturma\n• Çoklu dil desteği\n• Gerçek zamanlı çeviri\n• Ses tanıma geliştirmeleri\n• Dosya analizi ve özetleme\n• Grup sohbetleri\n\nHer güncelleme ile daha fazla özellik eklenecektir.',
                        icon: 'sparkles-outline'
                    },
                    {
                        baslik: 'Sık Karşılaşılan Sorunlar',
                        icerik: 'Sık karşılaşılan sorunlar ve çözümleri:\n\n• Uygulama yavaş çalışıyor → Önbelleği temizleyin\n• Bildirimler gelmiyor → Bildirim izinlerini kontrol edin\n• Yanıt alınamıyor → İnternet bağlantınızı kontrol edin\n• Dosya yüklenemiyor → Dosya boyutunu ve formatını kontrol edin\n\nSorunlar devam ederse, destek ekibimize ulaşın.',
                        icon: 'help-circle-outline'
                    },
                    {
                        baslik: 'İletişim',
                        icerik: 'Sorularınız, sorunlarınız veya geri bildirimleriniz için:\n\nE-posta: destek@aiasistan.com\nWeb: www.aiasistan.com/destek\n\nYanıt süresi genellikle 24 saattir.',
                        icon: 'mail-outline'
                    }
                ];
        }
    };

    // Yardım bölümleri
    const yardimBolumleri = getLocalizedHelpSections();

    // Arama filtreleme
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredSections(yardimBolumleri);
        } else {
            const filtered = yardimBolumleri.filter(
                (bolum) =>
                    bolum.baslik.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    bolum.icerik.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredSections(filtered);
        }
    }, [searchQuery, language]);

    useEffect(() => {
        // İlk yükleme
        setFilteredSections(yardimBolumleri);

        // Giriş animasyonu
        Animated.parallel([
            Animated.timing(fadeAnimation, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            })
        ]).start();
    }, [language]);

    const bolumGenislet = (index) => {
        Animated.timing(rotateAnimation, {
            toValue: genisleyenBolum === index ? 0 : 1,
            duration: 300,
            useNativeDriver: true
        }).start();

        setGenisleyenBolum(genisleyenBolum === index ? null : index);
    };

    const rotateInterpolate = rotateAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg']
    });

    // DÜZELTME: Navigasyon işlevleri
    const goToHome = () => {
        // Ana sayfaya yönlendirme
        navigation.dispatch(
            CommonActions.navigate({
                name: 'Main',
            })
        );
        navigation.navigate('Ana Ekran');
    };

    const goToProfile = () => {
        // Profil sayfasına yönlendirme
        navigation.dispatch(
            CommonActions.navigate({
                name: 'Main',
                params: { screen: 'Profil' }
            })
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar backgroundColor={colors.statusBar} barStyle="light-content" />

            {/* Üst Navigasyon */}
            <View style={[styles.ustNavigation, { backgroundColor: colors.primary }]}>
                <TouchableOpacity
                    style={styles.menuButon}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.baslik}>{t('helpCenter')}</Text>
                <View style={styles.profilButon} />
            </View>

            {/* Arama */}
            <View style={[styles.aramaKutusu, { backgroundColor: colors.card }]}>
                <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.aramaIconu} />
                <TextInput
                    style={[styles.aramaInput, { color: colors.text }]}
                    placeholder={t('searchHelpTopic')}
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity
                        onPress={() => setSearchQuery('')}
                        style={styles.clearButton}
                    >
                        <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                ) : null}
            </View>

            <Animated.ScrollView
                style={[styles.icerikAlani, { opacity: fadeAnimation }]}
                showsVerticalScrollIndicator={false}
            >
                {filteredSections.length > 0 ? (
                    filteredSections.map((bolum, index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.yardimBolumu,
                                { backgroundColor: colors.card, transform: [{ translateY: slideAnim }] }
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.bolumBasligi}
                                onPress={() => bolumGenislet(index)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.bolumBaslikSol}>
                                    <Ionicons
                                        name={bolum.icon}
                                        size={24}
                                        color={colors.primary}
                                        style={styles.bolumIcon}
                                    />
                                    <Text style={[styles.bolumBaslikMetni, { color: colors.text }]}>{bolum.baslik}</Text>
                                </View>
                                <Animated.View
                                    style={{
                                        transform: genisleyenBolum === index ?
                                            [{ rotate: '180deg' }] : [{ rotate: '0deg' }]
                                    }}
                                >
                                    <Ionicons
                                        name="chevron-down"
                                        size={24}
                                        color={colors.primary}
                                    />
                                </Animated.View>
                            </TouchableOpacity>

                            {genisleyenBolum === index && (
                                <View style={[styles.bolumIcerigi, { backgroundColor: colors.cardAlt }]}>
                                    <Text style={[styles.bolumIcerikMetni, { color: colors.text }]}>{bolum.icerik}</Text>

                                    {bolum.baslik === ('İletişim' || 'Contact' || 'Contact') && (
                                        <View style={styles.actionButtons}>
                                            <TouchableOpacity
                                                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                                                onPress={() => Linking.openURL('mailto:destek@aiasistan.com')}
                                            >
                                                <Ionicons name="mail" size={18} color="#fff" />
                                                <Text style={styles.actionButtonText}>
                                                    {language === 'tr' ? 'E-posta Gönder' : language === 'en' ? 'Send Email' : 'Envoyer un E-mail'}
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={[styles.actionButton, { backgroundColor: colors.primary }]}
                                                onPress={() => Linking.openURL('https://www.aiasistan.com/destek')}
                                            >
                                                <Ionicons name="globe" size={18} color="#fff" />
                                                <Text style={styles.actionButtonText}>
                                                    {language === 'tr' ? 'Web Sitesi' : language === 'en' ? 'Website' : 'Site Web'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}
                        </Animated.View>
                    ))
                ) : (
                    <View style={styles.noResultsContainer}>
                        <Ionicons name="search-outline" size={60} color={colors.textSecondary} />
                        <Text style={[styles.noResultsText, { color: colors.text }]}>
                            {t('noResultsFound').replace('{query}', searchQuery)}
                        </Text>
                        <Text style={[styles.noResultsSubtext, { color: colors.textSecondary }]}>
                            {t('tryDifferentKeywords')}
                        </Text>
                        <TouchableOpacity
                            style={[styles.clearSearchButton, { backgroundColor: colors.primary }]}
                            onPress={() => setSearchQuery('')}
                        >
                            <Text style={styles.clearSearchButtonText}>{t('clearSearch')}</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* İletişim Bilgileri */}
                <Animated.View
                    style={[
                        styles.contactSection,
                        {
                            backgroundColor: colors.card,
                            opacity: fadeAnimation,
                            transform: [{ translateY: slideAnim }]
                        }
                    ]}
                >
                    <Text style={[styles.contactTitle, { color: colors.text }]}>{t('stayInTouch')}</Text>
                    <Text style={[styles.contactSubtitle, { color: colors.textSecondary }]}>
                        {t('needMoreHelp')}
                    </Text>

                    <View style={styles.contactButtons}>
                        <TouchableOpacity
                            style={[styles.contactButton, { backgroundColor: colors.cardAlt }]}
                            onPress={() => Linking.openURL('mailto:destek@aiasistan.com')}
                        >
                            <Ionicons name="mail-outline" size={24} color={colors.primary} />
                            <Text style={[styles.contactButtonText, { color: colors.text }]}>{t('email')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.contactButton, { backgroundColor: colors.cardAlt }]}
                            onPress={() => Linking.openURL('https://www.aiasistan.com')}
                        >
                            <Ionicons name="globe-outline" size={24} color={colors.primary} />
                            <Text style={[styles.contactButtonText, { color: colors.text }]}>{t('website')}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.contactButton, { backgroundColor: colors.cardAlt }]}
                            onPress={() => Linking.openURL('https://twitter.com/aiasistan')}
                        >
                            <Ionicons name="logo-twitter" size={24} color={colors.primary} />
                            <Text style={[styles.contactButtonText, { color: colors.text }]}>{t('twitter')}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </Animated.ScrollView>

            {/* Alt Navigasyon */}
            <View style={[styles.altNavigasyon, { backgroundColor: colors.card }]}>
                <TouchableOpacity
                    style={styles.altNavButon}
                    onPress={goToHome}
                >
                    <Ionicons name="home-outline" size={24} color={colors.textSecondary} />
                    <Text style={[styles.altNavMetin, { color: colors.textSecondary }]}>{t('home')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.altNavButon}
                >
                    <Ionicons name="help-circle" size={24} color={colors.primary} />
                    <Text style={[styles.altNavMetin, { color: colors.primary }]}>{t('help')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.altNavButon}
                    onPress={goToProfile}
                >
                    <Ionicons name="person-outline" size={24} color={colors.textSecondary} />
                    <Text style={[styles.altNavMetin, { color: colors.textSecondary }]}>{t('profile')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    ustNavigation: {
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
    aramaKutusu: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        margin: 15,
        paddingHorizontal: 15,
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
    aramaIconu: {
        marginRight: 10,
    },
    aramaInput: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
    },
    clearButton: {
        padding: 6,
    },
    icerikAlani: {
        flex: 1,
        paddingTop: 5,
    },
    yardimBolumu: {
        marginBottom: 12,
        marginHorizontal: 15,
        borderRadius: 16,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
            },
            android: {
                elevation: 4,
            },
        }),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    bolumBasligi: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    bolumBaslikSol: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bolumIcon: {
        marginRight: 14,
    },
    bolumBaslikMetni: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    bolumIcerigi: {
        padding: 20,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
    },
    bolumIcerikMetni: {
        fontSize: 15,
        lineHeight: 22,
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 20,
    },
    actionButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
        ...Platform.select({
            ios: {
                shadowColor: '#8A2BE2',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 3,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    actionButtonText: {
        color: '#FFFFFF',
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    noResultsContainer: {
        alignItems: 'center',
        padding: 40,
    },
    noResultsText: {
        fontSize: 18,
        marginTop: 20,
        textAlign: 'center',
        fontWeight: '600',
    },
    noResultsSubtext: {
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
        lineHeight: 20,
    },
    clearSearchButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 24,
        marginTop: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#8A2BE2',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    clearSearchButtonText: {
        color: '#FFF',
        fontSize: 15,
        fontWeight: '600',
    },
    contactSection: {
        marginTop: 20,
        marginBottom: 40,
        padding: 20,
        borderRadius: 16,
        marginHorizontal: 15,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    contactTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    contactSubtitle: {
        fontSize: 14,
        marginBottom: 20,
        lineHeight: 20,
    },
    contactButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contactButton: {
        alignItems: 'center',
        padding: 16,
        borderRadius: 14,
        width: '30%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 3,
            },
            android: {
                elevation: 3,
            },
        }),
    },
    contactButtonText: {
        marginTop: 8,
        fontSize: 13,
        fontWeight: '500',
    },
    altNavigasyon: {
        flexDirection: 'row',
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
        marginTop: 5,
        fontSize: 12,
        fontWeight: '500',
    },
});