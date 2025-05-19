import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TextInput,
    ScrollView,
    Image,
    Alert,
    Animated,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import * as ImagePicker from 'expo-image-picker';

export default function KullaniciPaneliScreen({ navigation }) {
    const { userName, userEmail, userAvatar, updateUserProfile } = useContext(AppContext);

    const [name, setName] = useState(userName || 'Kullanıcı Adı');
    const [email, setEmail] = useState(userEmail || 'kullanici@email.com');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState(userAvatar);
    const [isLoading, setIsLoading] = useState(false);

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

    const profileFields = [
        {
            label: 'Ad Soyad',
            value: name,
            onChangeText: setName,
            icon: 'person-outline'
        },
        {
            label: 'E-posta',
            value: email,
            onChangeText: setEmail,
            icon: 'mail-outline',
            keyboardType: 'email-address'
        }
    ];

    // Profil resmi seçme
    const pickProfileImage = async () => {
        try {
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
            }
        } catch (error) {
            console.error('Görsel seçilirken hata:', error);
            Alert.alert('Hata', 'Profil resmi seçilirken bir sorun oluştu.');
        }
    };

    const handleSaveProfile = async () => {
        // Temel validasyon
        if (!name.trim()) {
            Alert.alert('Hata', 'Lütfen adınızı girin');
            return;
        }

        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Hata', 'Lütfen geçerli bir e-posta adresi girin');
            return;
        }

        setIsLoading(true);

        try {
            // updateUserProfile AppContext üzerinden çağrılacak
            if (updateUserProfile) {
                await updateUserProfile(name, email, avatar);
            }

            Alert.alert(
                'Başarılı',
                'Profil bilgileriniz güncellendi.',
                [
                    {
                        text: 'Tamam',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } catch (error) {
            Alert.alert('Hata', 'Profil güncellenirken bir sorun oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#8A2BE2" barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profil Düzenle</Text>
                <TouchableOpacity
                    style={styles.saveButton}
                    onPress={handleSaveProfile}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Animated.View style={{ opacity: fadeAnim }}>
                            <Ionicons name="sync" size={24} color="#fff" style={{ transform: [{ rotate: '45deg' }] }} />
                        </Animated.View>
                    ) : (
                        <Text style={styles.saveButtonText}>Kaydet</Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{
                    opacity: fadeAnim,
                    transform: [{ translateY: slideAnim }]
                }}>
                    <View style={styles.profileImageContainer}>
                        <Image
                            source={avatar ? { uri: avatar } : require('../assets/default-profile.png')}
                            style={styles.profileImage}
                        />
                        <TouchableOpacity
                            style={styles.editProfileImageButton}
                            onPress={pickProfileImage}
                        >
                            <Ionicons name="camera" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {profileFields.map((field, index) => (
                        <Animated.View
                            key={index}
                            style={[
                                styles.inputContainer,
                                {
                                    opacity: fadeAnim,
                                    transform: [{ translateY: Animated.multiply(slideAnim, index + 1.5) }]
                                }
                            ]}
                        >
                            <Ionicons name={field.icon} size={24} color="#8A2BE2" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder={field.label}
                                placeholderTextColor="#888"
                                value={field.value}
                                onChangeText={field.onChangeText}
                                keyboardType={field.keyboardType || 'default'}
                            />
                        </Animated.View>
                    ))}

                    <Animated.View
                        style={[
                            styles.inputContainer,
                            styles.bioContainer,
                            {
                                opacity: fadeAnim,
                                transform: [{ translateY: Animated.multiply(slideAnim, 3) }]
                            }
                        ]}
                    >
                        <Ionicons name="clipboard-outline" size={24} color="#8A2BE2" style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, styles.bioInput]}
                            placeholder="Biyografi (İsteğe Bağlı)"
                            placeholderTextColor="#888"
                            value={bio}
                            onChangeText={setBio}
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </Animated.View>
                </Animated.View>
            </ScrollView>
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
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    saveButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 30,
        paddingBottom: 50,
    },
    profileImageContainer: {
        alignSelf: 'center',
        marginBottom: 30,
        position: 'relative',
    },
    profileImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 4,
        borderColor: '#8A2BE2',
        ...Platform.select({
            ios: {
                shadowColor: '#8A2BE2',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
            },
            android: {
                elevation: 10,
            },
        }),
    },
    editProfileImageButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#8A2BE2',
        borderRadius: 25,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        marginBottom: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
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
    bioContainer: {
        alignItems: 'flex-start',
    },
    inputIcon: {
        marginRight: 15,
        marginTop: Platform.OS === 'ios' ? 0 : 10,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
        paddingVertical: 8,
    },
    bioInput: {
        height: 120,
        textAlignVertical: 'top',
    },
});