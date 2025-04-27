import React, { useState, useContext, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Image,
    StatusBar,
    ActivityIndicator,
    Keyboard,
    TouchableWithoutFeedback,
    Alert,
    Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GirisScreen({ navigation }) {
    const { login, isLoading } = useContext(AppContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [buttonScale] = useState(new Animated.Value(1));

    // Input validasyonu
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        // AsyncStorage'dan kayıtlı kullanıcı bilgilerini kontrol et
        checkSavedCredentials();
    }, []);

    const checkSavedCredentials = async () => {
        try {
            const savedEmail = await AsyncStorage.getItem('savedEmail');
            if (savedEmail) {
                setEmail(savedEmail);
            }
        } catch (error) {
            console.log('Kayıtlı bilgiler yüklenirken hata:', error);
        }
    };

    const handleLogin = async () => {
        // Form validasyonu
        let isValid = true;

        // Email kontrolü
        if (!email.trim()) {
            setEmailError('E-posta adresi boş olamaz');
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            setEmailError('Geçerli bir e-posta adresi girin');
            isValid = false;
        } else {
            setEmailError('');
        }

        // Şifre kontrolü
        if (!password) {
            setPasswordError('Şifre boş olamaz');
            isValid = false;
        } else if (password.length < 6) {
            setPasswordError('Şifre en az 6 karakter olmalıdır');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (!isValid) return;

        Keyboard.dismiss();

        // AppContext'teki login fonksiyonunu çağır
        const success = await login(email, password);

        if (success) {
            // Email'i kaydet
            try {
                await AsyncStorage.setItem('savedEmail', email);
            } catch (error) {
                console.log('Email kaydedilirken hata:', error);
            }

            // Ana ekrana yönlendir
            navigation.replace('Main');
        }
    };

    const handleMisafirGirisi = () => {
        // Misafir girişi animasyonu
        Animated.sequence([
            Animated.timing(buttonScale, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true
            }),
            Animated.timing(buttonScale, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true
            })
        ]).start(() => {
            // Misafir girişi
            navigation.replace('Main');
        });
    };

    // Buton basma animasyonu
    const onPressIn = () => {
        Animated.timing(buttonScale, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true
        }).start();
    };

    const onPressOut = () => {
        Animated.timing(buttonScale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true
        }).start();
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={styles.container}>
                <StatusBar backgroundColor="#8A2BE2" barStyle="light-content" />

                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/turna-logo.svg')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Turna AI</Text>
                    <Text style={styles.subtitle}>Yapay zeka asistanınız yanınızda</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={24} color="#8A2BE2" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="E-posta"
                            placeholderTextColor="#888"
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                setEmailError('');
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={24} color="#8A2BE2" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Şifre"
                            placeholderTextColor="#888"
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setPasswordError('');
                            }}
                            secureTextEntry={!isPasswordVisible}
                        />
                        <TouchableOpacity
                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                            style={styles.passwordVisibilityToggle}
                        >
                            <Ionicons
                                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                size={24}
                                color="#888"
                            />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
                    </TouchableOpacity>

                    <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                        <TouchableOpacity
                            style={styles.loginButton}
                            onPress={handleLogin}
                            disabled={isLoading}
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text style={styles.loginButtonText}>Giriş Yap</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity
                        style={styles.misafirButton}
                        onPress={handleMisafirGirisi}
                    >
                        <Text style={styles.misafirButtonText}>Misafir Olarak Devam Et</Text>
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Hesabın yok mu?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Kayit')}>
                            <Text style={styles.registerLink}>Kayıt Ol</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Sürüm 1.0.0</Text>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 10,
    },
    title: {
        color: '#8A2BE2',
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        color: '#888',
        fontSize: 16,
        marginTop: 5,
    },
    formContainer: {
        paddingHorizontal: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        marginBottom: 5,
        paddingHorizontal: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        paddingVertical: 14,
        fontSize: 16,
    },
    passwordVisibilityToggle: {
        padding: 10,
    },
    errorText: {
        color: '#FF4757',
        fontSize: 12,
        marginLeft: 15,
        marginBottom: 10,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
    },
    forgotPasswordText: {
        color: '#8A2BE2',
        fontSize: 14,
    },
    loginButton: {
        backgroundColor: '#8A2BE2',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 15,
        elevation: 3,
        shadowColor: '#8A2BE2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    misafirButton: {
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#333',
    },
    misafirButtonText: {
        color: '#8A2BE2',
        fontSize: 16,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    registerText: {
        color: '#888',
        marginRight: 5,
        fontSize: 16,
    },
    registerLink: {
        color: '#8A2BE2',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center',
    },
    footerText: {
        color: '#666',
        fontSize: 12,
    },
});