import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    TextInput,
    FlatList,
    StatusBar,
    Modal,
    Keyboard,
    ActivityIndicator,
    Animated,
    Image,
    Dimensions,
    Alert,
    Clipboard,
    RefreshControl,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GeminiService from '../services/GeminiService';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { AppContext } from '../context/AppContext';
import { useFocusEffect } from '@react-navigation/native';
import { showInfoAlert, showDeleteConfirm } from '../utils/AlertManager';

const { width, height } = Dimensions.get('window');

function AnaEkranScreen({ navigation }) {
    const {
        userName,
        getColors,
        t,
        language,
        theme,
        chatHistory,
        addChat,
        guestMessageCount,
        addMessageToChat,
        deleteChat,
        sendMessageToAI,
        isGuestMode // Misafir modu durumu
    } = useContext(AppContext);

    const colors = getColors();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeSohbet, setActiveSohbet] = useState(null);
    const [yeniSohbetModalGorunur, setYeniSohbetModalGorunur] = useState(false);
    const [sohbetBasligi, setSohbetBasligi] = useState('');
    const [sonSohbetler, setSonSohbetler] = useState([]);
    const [sohbetMesajlari, setSohbetMesajlari] = useState([
        { id: 1, metin: `Merhaba ${userName || 'Misafir Kullanıcı'}! Bugün size nasıl yardımcı olabilirim?`, gonderen: 'ai' }
    ]);
    const [mevcutMesaj, setMevcutMesaj] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileModalVisible, setFileModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [filteredSohbetler, setFilteredSohbetler] = useState([]);

    const scrollViewRef = useRef();
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    // Dil bazlı öneriler listesi
    const getLangBasedSuggestions = (currentLang) => {
        switch (currentLang) {
            case 'en':
                return [
                    "How can I be more productive today?",
                    "Tell me about photo editing techniques",
                    "How to add animations in React Native?",
                    "Recommend a movie to watch this week",
                    "What are the best tools for web development?",
                    "How does artificial intelligence work?",
                    "How to analyze data in Python?",
                    "What are the best vacation spots in the world?"
                ];
            case 'fr':
                return [
                    "Comment puis-je être plus productif aujourd'hui?",
                    "Parlez-moi des techniques de retouche photo",
                    "Comment ajouter des animations dans React Native?",
                    "Recommandez-moi un film à regarder cette semaine",
                    "Quels sont les meilleurs outils pour le développement web?",
                    "Comment fonctionne l'intelligence artificielle?",
                    "Comment analyser des données en Python?",
                    "Quels sont les meilleurs lieux de vacances en France?"
                ];
            default: // 'tr' ve diğerleri
                return [
                    "Bugün nasıl daha verimli çalışabilirim?",
                    "Fotoğraf düzenleme teknikleri hakkında bilgi verir misin?",
                    "React Native ile nasıl animasyon eklenir?",
                    "Bu hafta izlemem gereken bir film öner",
                    "Web geliştirme için en iyi araçlar nelerdir?",
                    "Yapay zeka nasıl çalışır?",
                    "Python'da veri analizi nasıl yapılır?",
                    "Türkiye'nin en güzel tatil yerleri hangileri?"
                ];
        }
    };

    const [oneriler, setOneriler] = useState(getLangBasedSuggestions(language));

    // Misafir modu uyarısı
    const renderMisafirUyarisi = () => {
        if (isGuestMode && !activeSohbet) {
            return (
                <View style={styles.misafirUyariContainer}>
                    <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={[styles.misafirUyariText, { color: colors.textSecondary }]}>
                            {t('guestModeActive')}. {t('guestModeChatHistory')}
                        </Text>
                        <Text style={[styles.misafirUyariSubText, { color: colors.textSecondary, marginTop: 4 }]}>
                            Kalan mesaj hakkınız: {5 - guestMessageCount}
                        </Text>
                    </View>
                </View>
            );
        }
        return null;
    };

    // Sohbetleri yükle
    useFocusEffect(
        React.useCallback(() => {
            // Ekran her odaklandığında çalışacak kod
            setSonSohbetler(chatHistory);
            setFilteredSohbetler(chatHistory);

            // Animasyon
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

            return () => {
                // Ekrandan çıkınca çalışacak temizlik kodu
                fadeAnim.setValue(0);
                slideAnim.setValue(50);
            };
        }, [chatHistory])
    );

    // Language değiştiğinde önerileri güncelle
    useEffect(() => {
        setOneriler(getLangBasedSuggestions(language));
    }, [language]);

    // Arama metni değiştiğinde filtreleme
    useEffect(() => {
        if (!searchQuery) {
            setFilteredSohbetler(sonSohbetler);
            return;
        }

        const filtered = sonSohbetler.filter(sohbet =>
            sohbet.baslik.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredSohbetler(filtered);
    }, [searchQuery, sonSohbetler]);

    // Animasyonlu mikrofon pulse efekti
    useEffect(() => {
        if (isRecording) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, {
                        toValue: 1.3,
                        duration: 800,
                        useNativeDriver: true,
                    }),
                    Animated.timing(pulseAnim, {
                        toValue: 1,
                        duration: 800,
                        useNativeDriver: true,
                    })
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [isRecording]);

    // Gemini Service sohbet geçmişini yükle
    useEffect(() => {
        const loadChatHistory = async () => {
            if (activeSohbet) {
                await GeminiService.loadHistory();

                // Sohbet mesajlarını ayarla
                const activeChat = chatHistory.find(chat => chat.id === activeSohbet.id);
                if (activeChat && activeChat.messages) {
                    setSohbetMesajlari(activeChat.messages);
                }
            }
        };

        loadChatHistory();
    }, [activeSohbet]);

    // Ses kaydı izinleri
    useEffect(() => {
        const requestPermissions = async () => {
            try {
                const { status } = await Audio.requestPermissionsAsync();
                if (status !== 'granted') {
                    showInfoAlert('Sesli asistan için mikrofon izni gereklidir!');
                }
            } catch (error) {
                console.log('Mikrofon izni alınırken hata:', error);
            }
        };

        requestPermissions();
    }, []);

    // chatHistory güncellendiğinde aktif sohbetin referansını yenile
    useEffect(() => {
        if (activeSohbet) {
            const guncel = chatHistory.find(c => c.id === activeSohbet.id);
            if (guncel) {
                setActiveSohbet(guncel);   // aynı ID'li fakat güncel "messages" dizisi
            }
        }
    }, [chatHistory]);   // ← sadece chatHistory değişince çalışır

    const hizliIslemler = [
        {
            icon: 'chatbubble-outline',
            baslik: t('newChat'),
            onPress: () => setYeniSohbetModalGorunur(true)
        },
        {
            icon: 'document-outline',
            baslik: t('uploadFile'),
            onPress: selectDocument
        },
        {
            icon: 'mic-outline',
            baslik: t('voiceCommand'),
            onPress: toggleRecording
        },
        {
            icon: 'bookmarks-outline',
            baslik: t('savedChats'),
            onPress: () => showSavedChats()
        }
    ];

    // Yenileme işlemi
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        // Sohbetleri yeniden yükle
        setSonSohbetler(chatHistory);
        setFilteredSohbetler(chatHistory);

        // 1 saniye sonra yenileme durumunu kapat
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, [chatHistory]);

    // Drawer'ı açmak için
    const openDrawer = () => {
        if (navigation.openDrawer) {
            navigation.openDrawer();
        } else {
            console.log("Drawer navigatoru bulunamadı");
        }
    };

    // Dosya seçme işlevi
    async function selectDocument() {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['*/*'],
                copyToCacheDirectory: true,
            });

            if (result.canceled === false) {
                const fileUri = result.assets[0].uri;
                const fileName = result.assets[0].name;
                const fileType = fileName.split('.').pop().toLowerCase();

                setSelectedFile({
                    uri: fileUri,
                    name: fileName,
                    type: fileType
                });

                setFileModalVisible(true);
            }
        } catch (error) {
            console.error('Dosya seçilirken hata:', error);
            showInfoAlert('Dosya seçilemedi.');
        }
    }

    // Dosya analiz etme işlevi
    async function analyzeFile() {
        if (!selectedFile) return;

        setIsLoading(true);
        setFileModalVisible(false);

        try {
            const fileContent = await FileSystem.readAsStringAsync(selectedFile.uri, {
                encoding: FileSystem.EncodingType.UTF8
            });

            const response = await GeminiService.analyzeFile(
                fileContent.slice(0, 10000), // Çok büyük dosyalarda ilk 10000 karakteri kullan
                selectedFile.type
            );

            // Dosya analiz sonucunu sohbet olarak ekle
            const fileMessage = `📄 [${selectedFile.name}] dosyasını analiz edebilir misin?`;

            const messageId = Date.now();
            const responseId = messageId + 1;

            const newMessages = [
                { id: messageId, metin: fileMessage, gonderen: 'kullanici' },
                { id: responseId, metin: response, gonderen: 'ai' }
            ];

            // Eğer aktif sohbet yoksa, dosya ismiyle yeni bir sohbet oluştur
            if (!activeSohbet) {
                const newChatId = Date.now();
                const yeniSohbet = {
                    id: newChatId,
                    baslik: `${selectedFile.name} Analizi`,
                    lastMessageTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                    messages: [
                        { id: 1, metin: `Merhaba ${userName || 'Misafir Kullanıcı'}! Dosya analizi için size nasıl yardımcı olabilirim?`, gonderen: 'ai' },
                        ...newMessages
                    ]
                };

                await addChat(yeniSohbet);
                setActiveSohbet(yeniSohbet);
                setSohbetMesajlari(yeniSohbet.messages);
            } else {
                // Var olan sohbete mesajları ekle
                await addMessageToChat(activeSohbet.id, newMessages[0]);
                await addMessageToChat(activeSohbet.id, newMessages[1]);

                setSohbetMesajlari(prev => [...prev, ...newMessages]);
            }

            setSelectedFile(null);
        } catch (error) {
            console.error('Dosya analizi sırasında hata:', error);
            showInfoAlert('Dosya analiz edilemedi.');
        } finally {
            setIsLoading(false);
        }
    }

    // Ses kaydı başlatma/durdurma
    async function toggleRecording() {
        if (isRecording) {
            // Kaydı durdur
            await stopRecording();
        } else {
            // Kaydı başlat
            await startRecording();
        }
    }

    // Ses kaydı başlatma
    async function startRecording() {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);
            setIsRecording(true);
        } catch (error) {
            console.error('Ses kaydı başlatılamadı:', error);
            showInfoAlert('Ses kaydı başlatılamadı.');
        }
    }

    // Ses kaydı durdurma ve işleme
    async function stopRecording() {
        try {
            setIsRecording(false);
            await recording.stopAndUnloadAsync();

            const uri = recording.getURI();
            setRecording(null);

            // Gerçek bir uygulamada, burada kaydedilen sesi metin haline çevirmek için 
            // bir STT (Speech-to-Text) servisi kullanılması gerekir

            // Şimdilik basit bir mesaj göndereceğiz
            const message = "🎤 [Sesli Mesaj]";

            const messageId = Date.now();
            const responseId = messageId + 1;

            const newMessages = [
                { id: messageId, metin: message, gonderen: 'kullanici' },
                { id: responseId, metin: "Sesli mesajınızı aldım, ancak şu an sesli komutları işleme özelliği henüz geliştirilme aşamasında. Lütfen yazılı olarak nasıl yardımcı olabileceğimi belirtin.", gonderen: 'ai' }
            ];

            // Eğer aktif sohbet yoksa, yeni bir sohbet oluştur
            if (!activeSohbet) {
                const newChatId = Date.now();
                const yeniSohbet = {
                    id: newChatId,
                    baslik: "Sesli Komut",
                    lastMessageTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                    messages: [
                        { id: 1, metin: `Merhaba ${userName || 'Misafir Kullanıcı'}! Size nasıl yardımcı olabilirim?`, gonderen: 'ai' },
                        ...newMessages
                    ]
                };

                await addChat(yeniSohbet);
                setActiveSohbet(yeniSohbet);
                setSohbetMesajlari(yeniSohbet.messages);
            } else {
                // Var olan sohbete mesajları ekle
                await addMessageToChat(activeSohbet.id, newMessages[0]);
                await addMessageToChat(activeSohbet.id, newMessages[1]);

                setSohbetMesajlari(prev => [...prev, ...newMessages]);
            }
        } catch (error) {
            console.error('Ses kaydı durdurulurken hata:', error);
        }
    }

    // Kayıtlı sohbetleri göster
    function showSavedChats() {
        if (sonSohbetler.length === 0) {
            showInfoAlert("Henüz kayıtlı sohbet bulunmuyor.");
            return;
        }

        Alert.alert(
            t("savedChats"),
            t("manageSavedChats"),
            [
                {
                    text: t("allChats"),
                    onPress: () => {
                        // Burada ileride tüm sohbetler ekranını gösterebilirsiniz
                        showInfoAlert("Bu özellik yakında eklenecek!");
                    }
                },
                {
                    text: t("favorites"),
                    onPress: () => {
                        showInfoAlert("Favori sohbetler özelliği geliştiriliyor!");
                    }
                },
                {
                    text: t("cancel"),
                    style: "cancel"
                }
            ]
        );
    }

    // Mesajı sesli okutma
    function speakMessage(message) {
        try {
            Speech.speak(message, {
                language: language,
                pitch: 1.0,
                rate: 0.9
            });
        } catch (error) {
            console.error('Sesli okuma sırasında hata:', error);
        }
    }

    const sohbetBaslat = async () => {
        if (sohbetBasligi.trim()) {
            const newChatId = Date.now();
            const yeniSohbet = {
                id: newChatId,
                baslik: sohbetBasligi,
                lastMessageTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
                messages: [
                    { id: 1, metin: `Merhaba ${userName || 'Misafir Kullanıcı'}! Yeni bir sohbet başlattınız. Size nasıl yardımcı olabilirim?`, gonderen: 'ai' }
                ]
            };

            // Sohbeti context'e ekle
            await addChat(yeniSohbet);

            // UI güncellemeleri
            setYeniSohbetModalGorunur(false);
            setSohbetBasligi('');

            // BURASI ÖNEMLİ: Önce sohbet mesajlarını ayarla, sonra aktif sohbeti
            setSohbetMesajlari(yeniSohbet.messages);
            setActiveSohbet(yeniSohbet); // openChat yerine doğrudan setActiveSohbet kullanın

            // GeminiService geçmişini temizle
            try {
                if (GeminiService && typeof GeminiService.clearHistory === 'function') {
                    GeminiService.clearHistory();
                }
            } catch (error) {
                console.log('GeminiService.clearHistory çağrısında hata:', error);
            }
        }
    };

    // AnaEkranScreen.js içindeki openChat fonksiyonunu güncelle

    const openChat = (sohbet) => {
        if (!sohbet) return;

        // Sohbetin güncel halini chatHistory'den al
        const currentChat = chatHistory.find(c => c.id === sohbet.id) || sohbet;

        // Mesajları yükle
        if (currentChat.messages && currentChat.messages.length > 0) {
            setSohbetMesajlari([...currentChat.messages]);
        } else {
            // Eğer mesaj yoksa, başlangıç mesajını göster
            setSohbetMesajlari([
                {
                    id: 1,
                    metin: `Merhaba ${userName || 'Misafir Kullanıcı'}! Size nasıl yardımcı olabilirim?`,
                    gonderen: 'ai'
                }
            ]);
        }

        // Sohbeti aktif olarak ayarla
        setActiveSohbet(currentChat);

        // GeminiService geçmişini temizle ve yükle
        try {
            if (GeminiService) {
                GeminiService.clearHistory();

                // Mevcut mesajları geçmişe ekle
                if (currentChat.messages) {
                    currentChat.messages.forEach(msg => {
                        if (msg.gonderen === 'kullanici') {
                            GeminiService.addToHistory(msg.metin, '');
                        } else if (msg.gonderen === 'ai' && msg.id !== 1) {
                            // İlk karşılama mesajı hariç AI mesajlarını ekle
                            const prevUserMsg = currentChat.messages[currentChat.messages.indexOf(msg) - 1];
                            if (prevUserMsg && prevUserMsg.gonderen === 'kullanici') {
                                GeminiService.addToHistory(prevUserMsg.metin, msg.metin);
                            }
                        }
                    });
                }
            }
        } catch (error) {
            console.log('GeminiService history yükleme hatası:', error);
        }
    };

    const mesajGonder = async () => {
        if (!mevcutMesaj.trim()) return;

        // Misafir modu mesaj limiti kontrolü
        if (isGuestMode && guestMessageCount >= 5) {
            Alert.alert(
                t('error'),
                'Misafir kullanıcılar 5 mesaj gönderebilir. Tam deneyim için lütfen kayıt olun.',
                [
                    {
                        text: t('register'),
                        onPress: () => navigation.navigate('Kayit')
                    },
                    {
                        text: t('ok'),
                        style: 'cancel'
                    }
                ]
            );
            return;
        }

        Keyboard.dismiss();
        setIsLoading(true);

        // Kullanıcı mesajını sakla
        const userMessageText = mevcutMesaj.trim();
        setMevcutMesaj(''); // Input'u hemen temizle

        try {
            let currentChat = activeSohbet;
            let shouldCreateNewChat = false;

            // Eğer aktif sohbet yoksa, yeni sohbet oluştur
            if (!currentChat) {
                shouldCreateNewChat = true;
                currentChat = {
                    id: Date.now(),
                    baslik: userMessageText.length > 25
                        ? userMessageText.slice(0, 22) + '...'
                        : userMessageText,
                    lastMessageTime: new Date().toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    messages: []
                };
            }

            // Kullanıcı mesajını oluştur
            const userMsg = {
                id: Date.now(),
                metin: userMessageText,
                gonderen: 'kullanici',
            };

            // Mesajları lokal olarak güncelle
            const updatedMessages = [...(currentChat.messages || []), userMsg];
            setSohbetMesajlari(updatedMessages);

            if (shouldCreateNewChat) {
                // Yeni sohbet oluştur
                const chatWithGreeting = {
                    ...currentChat,
                    messages: [
                        {
                            id: 1,
                            metin: `Merhaba ${userName || 'Misafir Kullanıcı'}! Size nasıl yardımcı olabilirim?`,
                            gonderen: 'ai',
                        },
                        userMsg
                    ]
                };

                // Context'e kaydet
                const newChatId = await addChat(chatWithGreeting);

                if (newChatId) {
                    chatWithGreeting.id = newChatId;
                    setActiveSohbet(chatWithGreeting);
                    setSohbetMesajlari(chatWithGreeting.messages);
                }
            } else {
                // Mevcut sohbeti güncelle
                if (!isGuestMode) {
                    await addMessageToChat(currentChat.id, userMsg);
                }
            }

            // AI yanıtını al
            const response = await GeminiService.generateText(userMessageText);

            // AI mesajını oluştur
            const aiMsg = {
                id: Date.now() + 1,
                metin: response,
                gonderen: 'ai',
            };

            // AI mesajını ekle
            const finalMessages = [...updatedMessages, aiMsg];
            setSohbetMesajlari(finalMessages);

            // Context'i güncelle
            if (!isGuestMode) {
                await addMessageToChat(currentChat.id, aiMsg);
            } else {
                // Misafir modunda sadece local state'i güncelle
                setChatHistory(prev => prev.map(chat => {
                    if (chat.id === currentChat.id) {
                        return {
                            ...chat,
                            messages: finalMessages,
                            lastMessageTime: new Date().toLocaleTimeString('tr-TR', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                        };
                    }
                    return chat;
                }));
            }

        } catch (error) {
            console.error('Mesaj gönderme hatası:', error);

            const errorMsg = {
                id: Date.now() + 2,
                metin: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.',
                gonderen: 'ai',
            };

            setSohbetMesajlari(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    // Önerilen mesajı gönder
    const oneriGonder = (oneri) => {
        setMevcutMesaj(oneri);

        // Eğer aktif sohbet yoksa, önce yeni bir sohbet oluştur
        if (!activeSohbet) {
            // otomatik olarak mesajı gönder
            setTimeout(() => {
                mesajGonder();
            }, 300);
        } else {
            // otomatik olarak mesajı gönder
            setTimeout(() => {
                mesajGonder();
            }, 300);
        }
    };

    // Profil ekranına git
    const goToProfile = () => {
        navigation.navigate('Profil');
    };

    // Sohbeti sil
    const confirmDeleteChat = (chatId) => {
        showDeleteConfirm(t('chat'), async () => {
            if (activeSohbet && activeSohbet.id === chatId) {
                setActiveSohbet(null);
                setSohbetMesajlari([
                    { id: 1, metin: `Merhaba ${userName || 'Misafir Kullanıcı'}! Bugün size nasıl yardımcı olabilirim?`, gonderen: 'ai' }
                ]);
            }
            await deleteChat(chatId);
        });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar backgroundColor={colors.statusBar} barStyle="light-content" />

            {/* Üst Navigasyon - Aktif sohbet yoksa */}
            {!activeSohbet && (
                <View style={[styles.ustNavigation, { backgroundColor: colors.primary }]}>
                    <TouchableOpacity
                        style={styles.menuButon}
                        onPress={openDrawer}
                    >
                        <Ionicons name="menu" size={30} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.baslik}>Turna AI</Text>
                    <TouchableOpacity
                        style={styles.profilButon}
                        onPress={goToProfile}
                    >
                        <Ionicons name="person-outline" size={26} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            )}

            {/* Yeni Sohbet Modal */}
            <Modal
                visible={yeniSohbetModalGorunur}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setYeniSohbetModalGorunur(false)}
            >
                <View style={styles.modalArkaPlan}>
                    <View style={[styles.modalIcerik, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalBaslik, { color: colors.text }]}>{t('newChat')}</Text>
                        <TextInput
                            style={[styles.modalInput, { backgroundColor: colors.background, color: colors.text }]}
                            placeholder={t('chatTitle')}
                            placeholderTextColor={colors.textSecondary}
                            value={sohbetBasligi}
                            onChangeText={setSohbetBasligi}
                        />
                        <View style={styles.modalButonlar}>
                            <TouchableOpacity
                                style={[styles.modalIptalButon, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
                                onPress={() => setYeniSohbetModalGorunur(false)}
                            >
                                <Text style={[styles.modalIptalMetin, { color: colors.text }]}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalOnayButon, { backgroundColor: colors.primary }]}
                                onPress={sohbetBaslat}
                            >
                                <Text style={styles.modalOnayMetin}>{t('start')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Dosya Modal */}
            <Modal
                visible={fileModalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setFileModalVisible(false)}
            >
                <View style={styles.modalArkaPlan}>
                    <View style={[styles.modalIcerik, { backgroundColor: colors.card }]}>
                        <Text style={[styles.modalBaslik, { color: colors.text }]}>{t('fileUploaded')}</Text>
                        <View style={[styles.fileInfo, { backgroundColor: colors.background }]}>
                            <Ionicons name="document" size={24} color={colors.primary} />
                            <Text style={[styles.fileName, { color: colors.text }]}>
                                {selectedFile?.name || t('file')}
                            </Text>
                        </View>
                        <Text style={[styles.modalText, { color: colors.text }]}>
                            {t('analyzeFileQuestion')}
                        </Text>
                        <View style={styles.modalButonlar}>
                            <TouchableOpacity
                                style={[styles.modalIptalButon, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
                                onPress={() => setFileModalVisible(false)}
                            >
                                <Text style={[styles.modalIptalMetin, { color: colors.text }]}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalOnayButon, { backgroundColor: colors.primary }]}
                                onPress={analyzeFile}
                            >
                                <Text style={styles.modalOnayMetin}>{t('analyze')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {!activeSohbet ? (
                <View style={styles.icerikAlani}>
                    {/* Arama Çubuğu */}
                    <View style={[styles.aramaKutusu, { backgroundColor: colors.card }]}>
                        <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.aramaIconu} />
                        <TextInput
                            style={[styles.aramaInput, { color: colors.text }]}
                            placeholder={t('searchChats')}
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

                    {/* Misafir modu uyarısı */}
                    {renderMisafirUyarisi()}

                    {/* Ana içerik alanı - Yenileme ile */}
                    <FlatList
                        data={[1]} // Tek elemanla listeyi temsil et
                        keyExtractor={() => "main"}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[colors.primary]}
                                tintColor={colors.primary}
                                progressBackgroundColor={colors.card}
                            />
                        }
                        renderItem={() => (
                            <View>
                                {/* Hızlı İşlemler */}
                                <View style={styles.bolumBaslik}>
                                    <Text style={[styles.bolumBaslikMetni, { color: colors.text }]}>{t('quickActions')}</Text>
                                </View>
                                <View style={{ height: 100 }}>
                                    <FlatList
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        data={hizliIslemler}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={[styles.hizliIslemButonu, { backgroundColor: colors.card }]}
                                                onPress={item.onPress}
                                            >
                                                {item.baslik === t('voiceCommand') && isRecording ? (
                                                    <Animated.View style={{
                                                        transform: [{ scale: pulseAnim }]
                                                    }}>
                                                        <Ionicons name="mic" size={28} color="#FF4757" />
                                                    </Animated.View>
                                                ) : (
                                                    <Ionicons name={item.icon} size={24} color={colors.primary} />
                                                )}
                                                <Text style={[styles.hizliIslemMetni, { color: colors.text }]}>{item.baslik}</Text>
                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                        contentContainerStyle={styles.hizliIslemlerScroll}
                                    />
                                </View>

                                {/* Öneri Kartları */}
                                <View style={styles.bolumBaslik}>
                                    <Text style={[styles.bolumBaslikMetni, { color: colors.text }]}>{t('whatToAsk')}</Text>
                                </View>
                                <View style={{ height: 140 }}>
                                    <FlatList
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        data={oneriler}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={[styles.oneriKarti, { backgroundColor: colors.card }]}
                                                onPress={() => oneriGonder(item)}
                                            >
                                                <Text style={[styles.oneriMetni, { color: colors.text }]}>{item}</Text>
                                                <View style={styles.oneriIconContainer}>
                                                    <Ionicons name="arrow-forward-circle" size={24} color={colors.primary} />
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        keyExtractor={(item, index) => index.toString()}
                                        contentContainerStyle={styles.oneriScroll}
                                    />
                                </View>

                                {/* Son Sohbetler */}
                                <View style={styles.bolumBaslik}>
                                    <Text style={[styles.bolumBaslikMetni, { color: colors.text }]}>{t('recentChats')}</Text>
                                </View>
                                {filteredSohbetler.length > 0 ? (
                                    filteredSohbetler.map((sohbet) => (
                                        <Animated.View
                                            key={sohbet.id}
                                            style={[
                                                styles.sohbetOgesi,
                                                { backgroundColor: colors.card, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
                                            ]}
                                        >
                                            <TouchableOpacity
                                                style={styles.sohbetIcerik}
                                                onPress={() => openChat(sohbet)}
                                            >
                                                <Ionicons name="chatbubble-outline" size={24} color={colors.primary} />
                                                <View style={styles.sohbetBilgi}>
                                                    <Text style={[styles.sohbetMetni, { color: colors.text }]}>{sohbet.baslik}</Text>
                                                    <Text style={[styles.sohbetZaman, { color: colors.textSecondary }]}>{sohbet.lastMessageTime}</Text>
                                                </View>
                                                <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
                                            </TouchableOpacity>

                                            {/* Silme butonu */}
                                            <TouchableOpacity
                                                style={styles.sohbetSilButton}
                                                onPress={() => confirmDeleteChat(sohbet.id)}
                                            >
                                                <Ionicons name="trash-outline" size={20} color="#FF4757" />
                                            </TouchableOpacity>
                                        </Animated.View>
                                    ))
                                ) : (
                                    <View style={styles.bosSohbetContainer}>
                                        <Image
                                            source={require('../assets/empty-chat.png')}
                                            style={styles.bosSohbetResim}
                                        />
                                        <Text style={[styles.bosSohbetMetin, { color: colors.textSecondary }]}>
                                            {searchQuery ? t('noSearchResults') : t('noChatsYet')}
                                        </Text>
                                        <TouchableOpacity
                                            style={[styles.bosSohbetButon, { backgroundColor: colors.primary }]}
                                            onPress={() => setYeniSohbetModalGorunur(true)}
                                        >
                                            <Text style={styles.bosSohbetButonMetin}>
                                                {t('startNewChat')}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        )
                        }
                    />
                </View >
            ) : (
                <View style={styles.sohbetEkrani}>
                    {/* Sohbet Üst Çubuğu */}
                    <View style={[styles.sohbetUstCubuk, { backgroundColor: colors.primary }]}>
                        <TouchableOpacity
                            style={styles.geriButon}
                            onPress={() => setActiveSohbet(null)}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.sohbetBaslikMetni}>{activeSohbet.baslik}</Text>
                        <TouchableOpacity
                            style={styles.sohbetMenuButon}
                            onPress={() => confirmDeleteChat(activeSohbet.id)}
                        >
                            <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Sohbet Mesajları */}
                    <FlatList
                        style={styles.sohbetMesajlari}
                        data={sohbetMesajlari}
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                        renderItem={({ item: mesaj }) => (
                            <View
                                style={[
                                    styles.mesajKutusu,
                                    mesaj.gonderen === 'ai'
                                        ? [styles.aiMesaji, { backgroundColor: colors.card }]
                                        : [styles.kullaniciMesaji, { backgroundColor: colors.primary }]
                                ]}
                            >
                                <Text style={[styles.mesajMetni, { color: colors.text }]}>{mesaj.metin}</Text>
                                {mesaj.gonderen === 'ai' && (
                                    <View style={styles.mesajAletler}>
                                        <TouchableOpacity
                                            style={styles.mesajAlet}
                                            onPress={() => speakMessage(mesaj.metin)}
                                        >
                                            <Ionicons name="volume-medium-outline" size={18} color={colors.textSecondary} />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.mesajAlet}
                                            onPress={() => {
                                                Clipboard.setString(mesaj.metin);
                                                showInfoAlert(t('messageCopied'));
                                            }}
                                        >
                                            <Ionicons name="copy-outline" size={18} color={colors.textSecondary} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        )}
                        keyExtractor={(mesaj) => mesaj.id.toString()}
                        ListFooterComponent={
                            isLoading ? (
                                <View style={[styles.yukleniyor, { backgroundColor: colors.card }]}>
                                    <View style={styles.yukleniyorNoktalar}>
                                        <View style={[styles.yukleniyorNokta, { backgroundColor: colors.primary }]} />
                                        <View style={[styles.yukleniyorNokta, { marginLeft: 4, backgroundColor: colors.primary }]} />
                                        <View style={[styles.yukleniyorNokta, { marginLeft: 4, backgroundColor: colors.primary }]} />
                                    </View>
                                </View>
                            ) : null
                        }
                    />

                    {/* Mesaj Girişi */}
                    <View style={[styles.mesajGirisi, { backgroundColor: colors.card }]}>
                        <TouchableOpacity
                            style={styles.ekButon}
                            onPress={selectDocument}
                        >
                            <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
                        </TouchableOpacity>

                        <TextInput
                            style={[styles.mesajInput, { backgroundColor: colors.background, color: colors.text }]}
                            placeholder={t('typeMessage')}
                            placeholderTextColor={colors.textSecondary}
                            value={mevcutMesaj}
                            onChangeText={setMevcutMesaj}
                            multiline
                        />

                        {mevcutMesaj.trim() === '' ? (
                            <TouchableOpacity
                                style={styles.sesButon}
                                onPress={toggleRecording}
                            >
                                {isRecording ? (
                                    <Animated.View style={{
                                        transform: [{ scale: pulseAnim }]
                                    }}>
                                        <Ionicons name="mic" size={24} color="#FF4757" />
                                    </Animated.View>
                                ) : (
                                    <Ionicons name="mic-outline" size={24} color={colors.primary} />
                                )}
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.mesajGonderButonu}
                                onPress={mesajGonder}
                                disabled={isLoading}
                            >
                                <Ionicons name="send" size={24} color={colors.primary} />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            {/* Alt Navigasyon */}
            <View style={[styles.altNavigasyon, { backgroundColor: colors.card }]}>
                <TouchableOpacity
                    style={styles.altNavButon}
                    onPress={() => {
                        if (activeSohbet) {
                            setActiveSohbet(null);
                        } else {
                            navigation.navigate('Ana Ekran');
                        }
                    }}
                >
                    <Ionicons name="home" size={24} color={colors.primary} />
                    <Text style={[styles.altNavMetin, { color: colors.primary }]}>{t('home')}</Text>
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
                    onPress={() => navigation.navigate('Profil')}
                >
                    <Ionicons name="person-outline" size={24} color={colors.textSecondary} />
                    <Text style={[styles.altNavMetin, { color: colors.textSecondary }]}>{t('profile')}</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView >
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
    sohbetUstCubuk: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    geriButon: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sohbetBaslikMetni: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    sohbetMenuButon: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
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
        alignItems: 'flex-end',
    },
    baslik: {
        color: '#FFFFFF',
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    },
    icerikAlani: {
        flex: 1,
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
    misafirUyariContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(138, 43, 226, 0.1)',
        padding: 12,
        margin: 15,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(138, 43, 226, 0.2)',
    },
    misafirUyariText: {
        marginLeft: 10,
        fontSize: 14,
        flex: 1,
    },
    bolumBaslik: {
        paddingHorizontal: 15,
        marginTop: 15,
        marginBottom: 10,
    },
    bolumBaslikMetni: {
        fontSize: 18,
        fontWeight: '600',
    },
    hizliIslemlerScroll: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    hizliIslemButonu: {
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        marginRight: 15,
        width: 100,
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
    hizliIslemMetni: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: '500',
    },
    oneriScroll: {
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    oneriKarti: {
        borderRadius: 16,
        padding: 16,
        marginRight: 15,
        width: width * 0.6,
        maxWidth: 250,
        minHeight: 90,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    oneriMetni: {
        fontSize: 14,
        flex: 1,
        flexWrap: 'wrap',
        lineHeight: 20,
    },
    oneriIconContainer: {
        marginLeft: 10,
    },
    sohbetOgesi: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        marginHorizontal: 15,
        marginBottom: 12,
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
    sohbetIcerik: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    sohbetBilgi: {
        flex: 1,
        marginLeft: 15,
    },
    sohbetMetni: {
        fontSize: 16,
        fontWeight: '500',
    },
    sohbetZaman: {
        fontSize: 12,
        marginTop: 5,
    },
    sohbetSilButton: {
        padding: 15,
        borderLeftWidth: 1,
        borderLeftColor: 'rgba(255,255,255,0.05)',
    },
    bosSohbetContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        marginTop: 20,
    },
    bosSohbetResim: {
        width: 120,
        height: 120,
        opacity: 0.7,
        marginBottom: 20,
    },
    bosSohbetMetin: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    bosSohbetButon: {
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 3,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    bosSohbetButonMetin: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
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
    sohbetEkrani: {
        flex: 1,
    },
    sohbetMesajlari: {
        flex: 1,
        padding: 15,
    },
    mesajKutusu: {
        maxWidth: '80%',
        padding: 14,
        borderRadius: 18,
        marginBottom: 15,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },
    aiMesaji: {
        alignSelf: 'flex-start',
        borderTopLeftRadius: 2,
    },
    kullaniciMesaji: {
        alignSelf: 'flex-end',
        borderTopRightRadius: 2,
    },
    mesajMetni: {
        fontSize: 16,
        lineHeight: 22,
    },
    mesajAletler: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 8,
    },
    mesajAlet: {
        padding: 5,
        marginLeft: 8,
    },
    mesajGirisi: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    ekButon: {
        marginRight: 10,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mesajInput: {
        flex: 1,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxHeight: 100,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    sesButon: {
        marginLeft: 10,
        padding: 8,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mesajGonderButonu: {
        marginLeft: 10,
        padding: 8,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
    },
    yukleniyor: {
        alignSelf: 'flex-start',
        borderRadius: 18,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    yukleniyorNoktalar: {
        flexDirection: 'row',
    },
    yukleniyorNokta: {
        width: 8,
        height: 8,
        borderRadius: 4,
        opacity: 0.8,
    },
    fileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
        marginVertical: 15,
        width: '100%',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    fileName: {
        marginLeft: 10,
        fontSize: 14,
    },
    modalText: {
        textAlign: 'center',
        marginBottom: 20,
    },
    modalArkaPlan: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalIcerik: {
        width: '85%',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 10,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    modalBaslik: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalInput: {
        width: '100%',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    modalButonlar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalIptalButon: {
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    modalOnayButon: {
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
        flex: 1,
        alignItems: 'center',
    },
    modalIptalMetin: {
        fontSize: 16,
        fontWeight: '500',
    },
    modalOnayMetin: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    misafirUyariSubText: {
        fontSize: 12,
        fontWeight: '600'
    },
});

export default AnaEkranScreen;