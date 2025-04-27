import React, { useState, useRef, useEffect, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    TextInput,
    ScrollView,
    StatusBar,
    Modal,
    Keyboard,
    ActivityIndicator,
    Animated,
    Image,
    Dimensions,
    Alert,
    Clipboard,
    FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GeminiService from '../services/GeminiService';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { AppContext } from '../context/AppContext';
import { CommonActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

export default function AnaEkranScreen({ navigation }) {
    const { userName } = useContext(AppContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSohbet, setActiveSohbet] = useState(null);
    const [yeniSohbetModalGorunur, setYeniSohbetModalGorunur] = useState(false);
    const [sohbetBasligi, setSohbetBasligi] = useState('');
    const [sonSohbetler, setSonSohbetler] = useState([
        { id: 1, baslik: 'Yazılım Geliştirme Soruları', lastMessageTime: '10:45' },
        { id: 2, baslik: 'Proje Yardımı', lastMessageTime: 'Dün' },
        { id: 3, baslik: 'Rapor Hazırlama', lastMessageTime: 'Salı' }
    ]);
    const [sohbetMesajlari, setSohbetMesajlari] = useState([
        { id: 1, metin: `Merhaba ${userName || 'Misafir Kullanıcı'}! Bugün size nasıl yardımcı olabilirim?`, gonderen: 'ai' }
    ]);
    const [mevcutMesaj, setMevcutMesaj] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recording, setRecording] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileModalVisible, setFileModalVisible] = useState(false);

    const scrollViewRef = useRef();
    const pulseAnim = useRef(new Animated.Value(1)).current;

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
                    alert('Sesli asistan için mikrofon izni gereklidir!');
                }
            } catch (error) {
                console.log('Mikrofon izni alınırken hata:', error);
            }
        };

        requestPermissions();
    }, []);

    const hizliIslemler = [
        {
            icon: 'chatbubble-outline',
            baslik: 'Yeni Sohbet',
            onPress: () => setYeniSohbetModalGorunur(true)
        },
        {
            icon: 'document-outline',
            baslik: 'Dosya Yükle',
            onPress: selectDocument
        },
        {
            icon: 'mic-outline',
            baslik: 'Sesli Komut',
            onPress: toggleRecording
        },
        {
            icon: 'bookmarks-outline',
            baslik: 'Kayıtlı Sohbetler',
            onPress: () => showSavedChats()
        }
    ];

    const oneriler = [
        "Bugün nasıl verimli çalışabilirim?",
        "Fotoğraf düzenleme hakkında bilgi verir misin?",
        "React Native ile nasıl animasyon eklenir?",
        "Bu hafta izlemem gereken bir film öner",
        "Web geliştirme için en iyi araçlar nelerdir?",
        "Yapay zeka nasıl çalışır?",
        "Python'da veri analizi nasıl yapılır?",
        "Türkiye'nin en güzel tatil yerleri hangileri?"
    ];

    // Drawer'ı açmak için
    const openDrawer = () => {
        if (navigation.openDrawer) {
            navigation.openDrawer();
        } else {
            console.log("Drawer navigatoru bulunamadı");
            // Drawer yoksa Main'e yönlendir
            navigation.dispatch(
                CommonActions.navigate({
                    name: 'Main'
                })
            );
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
            alert('Dosya seçilemedi.');
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

            const yeniMesajlar = [
                ...sohbetMesajlari,
                { id: Date.now(), metin: fileMessage, gonderen: 'kullanici' },
                { id: Date.now() + 1, metin: response, gonderen: 'ai' }
            ];

            setSohbetMesajlari(yeniMesajlar);

            // Eğer aktif sohbet yoksa, dosya ismiyle yeni bir sohbet oluştur
            if (!activeSohbet) {
                const yeniSohbet = {
                    id: Date.now(),
                    baslik: `${selectedFile.name} Analizi`,
                    lastMessageTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
                };

                setSonSohbetler(prev => [yeniSohbet, ...prev]);
                setActiveSohbet(yeniSohbet);
            }

            setSelectedFile(null);
        } catch (error) {
            console.error('Dosya analizi sırasında hata:', error);
            alert('Dosya analiz edilemedi.');
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
            alert('Ses kaydı başlatılamadı.');
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

            const yeniMesajlar = [
                ...sohbetMesajlari,
                { id: Date.now(), metin: message, gonderen: 'kullanici' },
                { id: Date.now() + 1, metin: "Sesli mesajınızı aldım, ancak şu an sesli komutları işleme özelliği henüz geliştirilme aşamasında. Lütfen yazılı olarak nasıl yardımcı olabileceğimi belirtin.", gonderen: 'ai' }
            ];

            setSohbetMesajlari(yeniMesajlar);
        } catch (error) {
            console.error('Ses kaydı durdurulurken hata:', error);
        }
    }

    // Kayıtlı sohbetleri göster
    function showSavedChats() {
        Alert.alert(
            "Kayıtlı Sohbetler",
            "Sohbet arşivinizi görüntüleyin ve yönetin",
            [
                {
                    text: "Tüm Sohbetler",
                    onPress: () => {
                        // Burada ileride tüm sohbetler ekranını gösterebilirsiniz
                        Alert.alert("Bilgi", "Bu özellik yakında eklenecek!");
                    }
                },
                {
                    text: "Favoriler",
                    onPress: () => {
                        Alert.alert("Bilgi", "Favori sohbetler özelliği geliştiriliyor!");
                    }
                },
                {
                    text: "İptal",
                    style: "cancel"
                }
            ]
        );
    }

    // Mesajı sesli okutma
    function speakMessage(message) {
        try {
            Speech.speak(message, {
                language: 'tr',
                pitch: 1.0,
                rate: 0.9
            });
        } catch (error) {
            console.error('Sesli okuma sırasında hata:', error);
        }
    }

    const sohbetBaslat = () => {
        if (sohbetBasligi.trim()) {
            const yeniSohbet = {
                id: Date.now(),
                baslik: sohbetBasligi,
                lastMessageTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
            };
            // Yeni sohbeti listenin başına ekle
            setSonSohbetler([yeniSohbet, ...sonSohbetler]);

            setActiveSohbet(yeniSohbet);
            setYeniSohbetModalGorunur(false);
            setSohbetBasligi('');

            // GeminiService'i kontrol et ve temizlemeyi dene
            try {
                if (GeminiService && typeof GeminiService.clearHistory === 'function') {
                    GeminiService.clearHistory();
                }
            } catch (error) {
                console.log('GeminiService.clearHistory çağrısında hata:', error);
            }

            setSohbetMesajlari([
                { id: 1, metin: `Merhaba ${userName || 'Misafir Kullanıcı'}! Yeni bir sohbet başlattınız. Size nasıl yardımcı olabilirim?`, gonderen: 'ai' }
            ]);
        }
    };

    const mesajGonder = async () => {
        if (mevcutMesaj.trim() === '') return;

        Keyboard.dismiss();
        setIsLoading(true);

        // Kullanıcı mesajı
        const kullaniciMesaji = mevcutMesaj;
        setMevcutMesaj('');

        // Kullanıcı mesajını ekranına ekle
        const yeniMesajlar = [
            ...sohbetMesajlari,
            { id: Date.now(), metin: kullaniciMesaji, gonderen: 'kullanici' }
        ];
        setSohbetMesajlari(yeniMesajlar);

        try {
            // AI yanıtını al
            const aiYaniti = await GeminiService.generateText(kullaniciMesaji);

            // AI yanıtını ekrana ekle
            setSohbetMesajlari(prevMesajlar => [
                ...prevMesajlar,
                { id: Date.now(), metin: aiYaniti, gonderen: 'ai' }
            ]);

            // Sohbetler listesini güncelle - zaman bilgisiyle
            if (activeSohbet) {
                setSonSohbetler(prevSohbetler => {
                    const guncellenmisListe = prevSohbetler.map(sohbet =>
                        sohbet.id === activeSohbet.id
                            ? { ...sohbet, lastMessageTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) }
                            : sohbet
                    );
                    return guncellenmisListe;
                });
            }
        } catch (error) {
            console.error('API çağrısı sırasında hata:', error);
            // Hata durumunda kullanıcıya bilgi ver
            setSohbetMesajlari(prevMesajlar => [
                ...prevMesajlar,
                { id: Date.now(), metin: "Üzgünüm, bir sorun oluştu. Lütfen tekrar deneyin.", gonderen: 'ai' }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    // Önerilen mesajı gönder
    const oneriGonder = (oneri) => {
        setMevcutMesaj(oneri);

        // Eğer aktif sohbet yoksa, önce yeni bir sohbet oluştur
        if (!activeSohbet) {
            const yeniSohbet = {
                id: Date.now(),
                baslik: oneri.length > 25 ? oneri.substring(0, 22) + "..." : oneri,
                lastMessageTime: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
            };

            setSonSohbetler([yeniSohbet, ...sonSohbetler]);
            setActiveSohbet(yeniSohbet);

            // Yeni bir sohbet başlatıldığında gemini history'i temizle
            try {
                if (GeminiService && typeof GeminiService.clearHistory === 'function') {
                    GeminiService.clearHistory();
                }
            } catch (error) {
                console.log('GeminiService.clearHistory çağrısında hata:', error);
            }

            setSohbetMesajlari([
                { id: 1, metin: `Merhaba ${userName || 'Misafir Kullanıcı'}! Size nasıl yardımcı olabilirim?`, gonderen: 'ai' }
            ]);
        }

        // otomatik olarak mesajı gönder
        setTimeout(() => {
            mesajGonder();
        }, 300);
    };

    // Profil ekranına git
    const goToProfile = () => {
        if (navigation.navigate) {
            navigation.navigate('Profil');
        } else {
            navigation.dispatch(
                CommonActions.navigate({
                    name: 'Profil'
                })
            );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#8A2BE2" barStyle="light-content" />

            {/* Üst Navigasyon - Aktif sohbet yoksa */}
            {!activeSohbet && (
                <View style={styles.ustNavigation}>
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
                    <View style={styles.modalIcerik}>
                        <Text style={styles.modalBaslik}>Yeni Sohbet Başlat</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Sohbet başlığını girin"
                            placeholderTextColor="#888"
                            value={sohbetBasligi}
                            onChangeText={setSohbetBasligi}
                        />
                        <View style={styles.modalButonlar}>
                            <TouchableOpacity
                                style={styles.modalIptalButon}
                                onPress={() => setYeniSohbetModalGorunur(false)}
                            >
                                <Text style={styles.modalIptalMetin}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalOnayButon}
                                onPress={sohbetBaslat}
                            >
                                <Text style={styles.modalOnayMetin}>Başlat</Text>
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
                    <View style={styles.modalIcerik}>
                        <Text style={styles.modalBaslik}>Dosya Yüklendi</Text>
                        <View style={styles.fileInfo}>
                            <Ionicons name="document" size={24} color="#8A2BE2" />
                            <Text style={styles.fileName}>
                                {selectedFile?.name || "Dosya"}
                            </Text>
                        </View>
                        <Text style={styles.modalText}>
                            Dosyayı analiz etmek ister misiniz?
                        </Text>
                        <View style={styles.modalButonlar}>
                            <TouchableOpacity
                                style={styles.modalIptalButon}
                                onPress={() => setFileModalVisible(false)}
                            >
                                <Text style={styles.modalIptalMetin}>İptal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalOnayButon}
                                onPress={analyzeFile}
                            >
                                <Text style={styles.modalOnayMetin}>Analiz Et</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {!activeSohbet ? (
                <View style={styles.icerikAlani}>
                    {/* Arama Çubuğu */}
                    <View style={styles.aramaKutusu}>
                        <Ionicons name="search" size={20} color="#888" style={styles.aramaIconu} />
                        <TextInput
                            style={styles.aramaInput}
                            placeholder="Sohbetlerde ara..."
                            placeholderTextColor="#888"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Hızlı İşlemler */}
                    <View style={styles.bolumBaslik}>
                        <Text style={styles.bolumBaslikMetni}>Hızlı İşlemler</Text>
                    </View>
                    <View style={{ height: 100 }}>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={hizliIslemler}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.hizliIslemButonu}
                                    onPress={item.onPress}
                                >
                                    {item.baslik === 'Sesli Komut' && isRecording ? (
                                        <Animated.View style={{
                                            transform: [{ scale: pulseAnim }]
                                        }}>
                                            <Ionicons name="mic" size={28} color="#FF4757" />
                                        </Animated.View>
                                    ) : (
                                        <Ionicons name={item.icon} size={24} color="#8A2BE2" />
                                    )}
                                    <Text style={styles.hizliIslemMetni}>{item.baslik}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={styles.hizliIslemlerScroll}
                        />
                    </View>

                    {/* Öneri Kartları */}
                    <View style={styles.bolumBaslik}>
                        <Text style={styles.bolumBaslikMetni}>Neler Sorabilirsiniz?</Text>
                    </View>
                    <View style={{ height: 140 }}>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={oneriler}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.oneriKarti}
                                    onPress={() => oneriGonder(item)}
                                >
                                    <Text style={styles.oneriMetni}>{item}</Text>
                                    <View style={styles.oneriIconContainer}>
                                        <Ionicons name="arrow-forward-circle" size={24} color="#8A2BE2" />
                                    </View>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item, index) => index.toString()}
                            contentContainerStyle={styles.oneriScroll}
                        />
                    </View>

                    {/* Son Sohbetler */}
                    <View style={styles.bolumBaslik}>
                        <Text style={styles.bolumBaslikMetni}>Son Sohbetler</Text>
                    </View>
                    {sonSohbetler.length > 0 ? (
                        sonSohbetler.map((sohbet) => (
                            <TouchableOpacity
                                key={sohbet.id}
                                style={styles.sohbetOgesi}
                                onPress={() => setActiveSohbet(sohbet)}
                            >
                                <Ionicons name="chatbubble-outline" size={24} color="#8A2BE2" />
                                <View style={styles.sohbetBilgi}>
                                    <Text style={styles.sohbetMetni}>{sohbet.baslik}</Text>
                                    <Text style={styles.sohbetZaman}>{sohbet.lastMessageTime}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#666" />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.bosSohbetContainer}>
                            <Image
                                source={require('../assets/empty-chat.png')}
                                style={styles.bosSohbetResim}
                            />
                            <Text style={styles.bosSohbetMetin}>
                                Henüz sohbet bulunmuyor
                            </Text>
                            <TouchableOpacity
                                style={styles.bosSohbetButon}
                                onPress={() => setYeniSohbetModalGorunur(true)}
                            >
                                <Text style={styles.bosSohbetButonMetin}>
                                    Yeni Sohbet Başlat
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            ) : (
                <View style={styles.sohbetEkrani}>
                    {/* Sohbet Üst Çubuğu */}
                    <View style={styles.sohbetUstCubuk}>
                        <TouchableOpacity
                            style={styles.geriButon}
                            onPress={() => setActiveSohbet(null)}
                        >
                            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.sohbetBaslikMetni}>{activeSohbet.baslik}</Text>
                        <TouchableOpacity
                            style={styles.sohbetMenuButon}
                            onPress={() => Alert.alert('Bilgi', 'Sohbet menüsü yakında eklenecek')}
                        >
                            <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Sohbet Mesajları */}
                    <ScrollView
                        style={styles.sohbetMesajlari}
                        ref={scrollViewRef}
                        onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                    >
                        {sohbetMesajlari.map((mesaj) => (
                            <View
                                key={mesaj.id}
                                style={[
                                    styles.mesajKutusu,
                                    mesaj.gonderen === 'ai' ? styles.aiMesaji : styles.kullaniciMesaji
                                ]}
                            >
                                <Text style={styles.mesajMetni}>{mesaj.metin}</Text>
                                {mesaj.gonderen === 'ai' && (
                                    <View style={styles.mesajAletler}>
                                        <TouchableOpacity
                                            style={styles.mesajAlet}
                                            onPress={() => speakMessage(mesaj.metin)}
                                        >
                                            <Ionicons name="volume-medium-outline" size={18} color="#888" />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.mesajAlet}
                                            onPress={() => {
                                                Clipboard.setString(mesaj.metin);
                                                Alert.alert('Bilgi', 'Mesaj panoya kopyalandı');
                                            }}
                                        >
                                            <Ionicons name="copy-outline" size={18} color="#888" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        ))}
                        {isLoading && (
                            <View style={styles.yukleniyor}>
                                <View style={styles.yukleniyorNoktalar}>
                                    <View style={styles.yukleniyorNokta} />
                                    <View style={[styles.yukleniyorNokta, { marginLeft: 4 }]} />
                                    <View style={[styles.yukleniyorNokta, { marginLeft: 4 }]} />
                                </View>
                            </View>
                        )}
                    </ScrollView>

                    {/* Mesaj Girişi */}
                    <View style={styles.mesajGirisi}>
                        <TouchableOpacity
                            style={styles.ekButon}
                            onPress={selectDocument}
                        >
                            <Ionicons name="add-circle-outline" size={24} color="#8A2BE2" />
                        </TouchableOpacity>

                        <TextInput
                            style={styles.mesajInput}
                            placeholder="Mesajınızı yazın..."
                            placeholderTextColor="#888"
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
                                    <Ionicons name="mic-outline" size={24} color="#8A2BE2" />
                                )}
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={styles.mesajGonderButonu}
                                onPress={mesajGonder}
                                disabled={isLoading}
                            >
                                <Ionicons name="send" size={24} color="#8A2BE2" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}

            {/* Alt Navigasyon */}
            <View style={styles.altNavigasyon}>
                <TouchableOpacity
                    style={styles.altNavButon}
                    onPress={() => {
                        if (activeSohbet) {
                            setActiveSohbet(null);
                        } else {
                            openDrawer();
                        }
                    }}
                >
                    <Ionicons name="home" size={24} color="#8A2BE2" />
                    <Text style={[styles.altNavMetin, { color: '#8A2BE2' }]}>Ana Ekran</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.altNavButon}
                    onPress={openDrawer}
                >
                    <Ionicons name="menu-outline" size={24} color="#888" />
                    <Text style={styles.altNavMetin}>Menü</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.altNavButon}
                    onPress={goToProfile}
                >
                    <Ionicons name="person-outline" size={24} color="#888" />
                    <Text style={styles.altNavMetin}>Profil</Text>
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
    ustNavigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#8A2BE2',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    sohbetUstCubuk: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#7209B7', // Farklı renk tonu 
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.2)',
        elevation: 8, // Android için gölge
        shadowColor: '#000',  // iOS için gölge
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
    },
    profilButon: {
        width: 40,
        alignItems: 'flex-end',
    },
    baslik: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    icerikAlani: {
        flex: 1,
    },
    aramaKutusu: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        margin: 15,
        paddingHorizontal: 15,
    },
    aramaIconu: {
        marginRight: 10,
    },
    aramaInput: {
        flex: 1,
        color: '#FFFFFF',
        paddingVertical: 12,
    },
    bolumBaslik: {
        paddingHorizontal: 15,
        marginTop: 15,
        marginBottom: 10,
    },
    bolumBaslikMetni: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    hizliIslemlerScroll: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    hizliIslemButonu: {
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        marginRight: 15,
        width: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    hizliIslemMetni: {
        color: '#FFFFFF',
        marginTop: 10,
        fontSize: 12,
    },
    oneriScroll: {
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    oneriKarti: {
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        padding: 15,
        marginRight: 15,
        width: width * 0.6, // Ekranın %60'ı kadar genişlik
        maxWidth: 250,
        minHeight: 80,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    oneriMetni: {
        color: '#FFFFFF',
        fontSize: 14,
        flex: 1,
        flexWrap: 'wrap',
    },
    oneriIconContainer: {
        marginLeft: 10,
    },
    sohbetOgesi: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        padding: 15,
        marginHorizontal: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    sohbetBilgi: {
        flex: 1,
        marginLeft: 15,
    },
    sohbetMetni: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    sohbetZaman: {
        color: '#888',
        fontSize: 12,
        marginTop: 5,
    },
    bosSohbetContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    bosSohbetResim: {
        width: 120,
        height: 120,
        opacity: 0.7,
        marginBottom: 20,
    },
    bosSohbetMetin: {
        color: '#888',
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    bosSohbetButon: {
        backgroundColor: '#8A2BE2',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    bosSohbetButonMetin: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    altNavigasyon: {
        flexDirection: 'row',
        backgroundColor: '#1E1E1E',
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'space-around',
    },
    altNavButon: {
        alignItems: 'center',
    },
    altNavMetin: {
        color: '#888',
        marginTop: 5,
        fontSize: 12,
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
        padding: 12,
        borderRadius: 18,
        marginBottom: 15,
    },
    aiMesaji: {
        backgroundColor: '#1E1E1E',
        alignSelf: 'flex-start',
        borderTopLeftRadius: 0,
    },
    kullaniciMesaji: {
        backgroundColor: '#8A2BE2',
        alignSelf: 'flex-end',
        borderTopRightRadius: 0,
    },
    mesajMetni: {
        color: '#FFFFFF',
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
        backgroundColor: '#1E1E1E',
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    ekButon: {
        marginRight: 10,
    },
    mesajInput: {
        flex: 1,
        backgroundColor: '#121212',
        color: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        maxHeight: 100,
    },
    sesButon: {
        marginLeft: 10,
        padding: 8,
    },
    mesajGonderButonu: {
        marginLeft: 10,
        padding: 8,
    },
    yukleniyor: {
        backgroundColor: '#1E1E1E',
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
        backgroundColor: '#8A2BE2',
        opacity: 0.8,
    },
    fileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#121212',
        borderRadius: 10,
        padding: 10,
        marginVertical: 15,
        width: '100%',
    },
    fileName: {
        color: '#FFFFFF',
        marginLeft: 10,
        fontSize: 14,
    },
    modalText: {
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    // Modal stilleri
    modalArkaPlan: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
    },
    modalIcerik: {
        width: '85%',
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 5,
    },
    modalBaslik: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    modalInput: {
        width: '100%',
        backgroundColor: '#121212',
        color: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 15,
        fontSize: 16,
    },
    modalButonlar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalIptalButon: {
        backgroundColor: '#333',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    modalOnayButon: {
        backgroundColor: '#8A2BE2',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
        flex: 1,
        alignItems: 'center',
    },
    modalIptalMetin: {
        color: '#FFFFFF',
        fontSize: 16,
    },
    modalOnayMetin: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});