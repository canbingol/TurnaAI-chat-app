import React, { useState, useEffect } from 'react';
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
    Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function YardimPaneliScreen({ navigation }) {
    const [genisleyenBolum, setGenisleyenBolum] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredSections, setFilteredSections] = useState([]);
    const [rotateAnimation] = useState(new Animated.Value(0));
    const [fadeAnimation] = useState(new Animated.Value(0));

    // Daha detaylı yardım bölümleri
    const yardimBolumleri = [
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
    }, [searchQuery]);

    useEffect(() => {
        // İlk yükleme
        setFilteredSections(yardimBolumleri);

        // Giriş animasyonu
        Animated.timing(fadeAnimation, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true
        }).start();
    }, []);

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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#8A2BE2" barStyle="light-content" />

            {/* Üst Navigasyon */}
            <View style={styles.ustNavigation}>
                <TouchableOpacity
                    style={styles.menuButon}
                    onPress={() => navigation.openDrawer()}
                >
                    <Ionicons name="menu" size={30} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.baslik}>Yardım Merkezi</Text>
                <View style={styles.profilButon} />
            </View>

            {/* Arama */}
            <View style={styles.aramaKutusu}>
                <Ionicons name="search" size={20} color="#888" style={styles.aramaIconu} />
                <TextInput
                    style={styles.aramaInput}
                    placeholder="Yardım konusu ara..."
                    placeholderTextColor="#888"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                    <TouchableOpacity
                        onPress={() => setSearchQuery('')}
                        style={styles.clearButton}
                    >
                        <Ionicons name="close-circle" size={20} color="#888" />
                    </TouchableOpacity>
                ) : null}
            </View>

            <Animated.ScrollView
                style={[styles.icerikAlani, { opacity: fadeAnimation }]}
            >
                {filteredSections.length > 0 ? (
                    filteredSections.map((bolum, index) => (
                        <View key={index} style={styles.yardimBolumu}>
                            <TouchableOpacity
                                style={styles.bolumBasligi}
                                onPress={() => bolumGenislet(index)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.bolumBaslikSol}>
                                    <Ionicons
                                        name={bolum.icon}
                                        size={24}
                                        color="#8A2BE2"
                                        style={styles.bolumIcon}
                                    />
                                    <Text style={styles.bolumBaslikMetni}>{bolum.baslik}</Text>
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
                                        color="#8A2BE2"
                                    />
                                </Animated.View>
                            </TouchableOpacity>

                            {genisleyenBolum === index && (
                                <View style={styles.bolumIcerigi}>
                                    <Text style={styles.bolumIcerikMetni}>{bolum.icerik}</Text>

                                    {bolum.baslik === 'İletişim' && (
                                        <View style={styles.actionButtons}>
                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                onPress={() => Linking.openURL('mailto:destek@aiasistan.com')}
                                            >
                                                <Ionicons name="mail" size={18} color="#fff" />
                                                <Text style={styles.actionButtonText}>E-posta Gönder</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.actionButton}
                                                onPress={() => Linking.openURL('https://www.aiasistan.com/destek')}
                                            >
                                                <Ionicons name="globe" size={18} color="#fff" />
                                                <Text style={styles.actionButtonText}>Web Sitesi</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.noResultsContainer}>
                        <Ionicons name="search-outline" size={60} color="#666" />
                        <Text style={styles.noResultsText}>
                            "{searchQuery}" ile ilgili sonuç bulunamadı
                        </Text>
                        <Text style={styles.noResultsSubtext}>
                            Farklı anahtar kelimeler deneyebilir veya tüm yardım konularını görmek için aramayı temizleyebilirsiniz.
                        </Text>
                        <TouchableOpacity
                            style={styles.clearSearchButton}
                            onPress={() => setSearchQuery('')}
                        >
                            <Text style={styles.clearSearchButtonText}>Aramayı Temizle</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* İletişim Bilgileri */}
                <View style={styles.contactSection}>
                    <Text style={styles.contactTitle}>İletişimde Kalalım</Text>
                    <Text style={styles.contactSubtitle}>
                        Daha fazla yardıma ihtiyacınız varsa bizimle iletişime geçin
                    </Text>

                    <View style={styles.contactButtons}>
                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={() => Linking.openURL('mailto:destek@aiasistan.com')}
                        >
                            <Ionicons name="mail-outline" size={24} color="#8A2BE2" />
                            <Text style={styles.contactButtonText}>E-posta</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={() => {/* Web sitesine yönlendir */ }}
                        >
                            <Ionicons name="globe-outline" size={24} color="#8A2BE2" />
                            <Text style={styles.contactButtonText}>Web Sitesi</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.contactButton}
                            onPress={() => {/* Sosyal medya */ }}
                        >
                            <Ionicons name="logo-twitter" size={24} color="#8A2BE2" />
                            <Text style={styles.contactButtonText}>Twitter</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.ScrollView>

            {/* Alt Navigasyon */}
            <View style={styles.altNavigasyon}>
                <TouchableOpacity
                    style={styles.altNavButon}
                    onPress={() => navigation.navigate('Ana Ekran')}
                >
                    <Ionicons name="home-outline" size={24} color="#888" />
                    <Text style={styles.altNavMetin}>Ana Ekran</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.altNavButon}
                >
                    <Ionicons name="help-circle" size={24} color="#8A2BE2" />
                    <Text style={[styles.altNavMetin, { color: '#8A2BE2' }]}>Yardım</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.altNavButon}
                    onPress={() => navigation.navigate('Profil')}
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
        paddingHorizontal: .0,
    },
    menuButon: {
        width: 40,
        alignItems: 'center',
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
    clearButton: {
        padding: 6,
    },
    icerikAlani: {
        flex: 1,
        paddingTop: 5,
    },
    yardimBolumu: {
        marginBottom: 10,
        backgroundColor: '#1E1E1E',
        marginHorizontal: 15,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    bolumBasligi: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
    },
    bolumBaslikSol: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    bolumIcon: {
        marginRight: 12,
    },
    bolumBaslikMetni: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    bolumIcerigi: {
        padding: 20,
        backgroundColor: '#242424',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    bolumIcerikMetni: {
        color: '#CCC',
        fontSize: 15,
        lineHeight: 22,
    },
    actionButtons: {
        flexDirection: 'row',
        marginTop: 15,
    },
    actionButton: {
        backgroundColor: '#8A2BE2',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    actionButtonText: {
        color: '#FFFFFF',
        marginLeft: 5,
        fontSize: 14,
    },
    noResultsContainer: {
        alignItems: 'center',
        padding: 40,
    },
    noResultsText: {
        color: '#FFF',
        fontSize: 18,
        marginTop: 20,
        textAlign: 'center',
    },
    noResultsSubtext: {
        color: '#888',
        fontSize: 14,
        marginTop: 10,
        textAlign: 'center',
        lineHeight: 20,
    },
    clearSearchButton: {
        backgroundColor: '#333',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 20,
    },
    clearSearchButtonText: {
        color: '#FFF',
        fontSize: 14,
    },
    contactSection: {
        marginTop: 20,
        marginBottom: 40,
        padding: 20,
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        marginHorizontal: 15,
    },
    contactTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    contactSubtitle: {
        color: '#888',
        fontSize: 14,
        marginBottom: 20,
    },
    contactButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contactButton: {
        alignItems: 'center',
        backgroundColor: '#242424',
        padding: 15,
        borderRadius: 10,
        width: '30%',
    },
    contactButtonText: {
        color: '#FFF',
        marginTop: 8,
        fontSize: 12,
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
});