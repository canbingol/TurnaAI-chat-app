import React, { useState, useContext, useEffect, useRef } from 'react';
import { CommonActions } from '@react-navigation/native';

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
    Animated,
    Easing,
    Dimensions,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppContext } from '../context/AppContext';
import { showInfoAlert, showErrorAlert } from '../utils/AlertManager';
import AsyncStorage from '@react-native-async-storage/async-storage';
const { width, height } = Dimensions.get('window');

export default function GirisScreen({ navigation }) {
    const { login, continueAsGuest, isLoading: contextLoading, getColors, t } = useContext(AppContext);
    const colors = getColors();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Animasyon değerleri
    const logoAnim = useRef(new Animated.Value(0)).current;
    const formAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(1)).current;
    const buttonScaleAnim = useRef(new Animated.Value(1)).current;

    // Logo için döndürme animasyonu
    const logoRotation = logoAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    // Giriş animasyonları
    useEffect(() => {
        // Logo animasyonu - Döndürme ve yükseltme
        Animated.sequence([
            Animated.timing(logoAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1)
            }),
            // Form alanlarını gösterme
            Animated.timing(formAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
                easing: Easing.out(Easing.quad)
            })
        ]).start();

        // Sürekli olarak logo pulse animasyonu
        const pulsateAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(buttonAnim, {
                    toValue: 1.05,
                    duration: 1500,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.quad)
                }),
                Animated.timing(buttonAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                    easing: Easing.inOut(Easing.quad)
                })
            ])
        );

        pulsateAnimation.start();

        return () => {
            pulsateAnimation.stop();
        };
    }, []);

    // Input validasyon state'leri
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleLogin = async () => {
        // Form validasyonu
        let isValid = true;

        // Email kontrolü
        if (!email.trim()) {
            setEmailError(t('emailRequired') || 'E-posta gerekli');
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            setEmailError(t('invalidEmail') || 'Geçersiz e-posta');
            isValid = false;
        } else {
            setEmailError('');
        }

        // Şifre kontrolü
        if (!password) {
            setPasswordError(t('passwordRequired') || 'Şifre gerekli');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (!isValid) return;

        Keyboard.dismiss();
        setIsLoading(true);

        setIsLoading(true);

        try {
            console.log('Giriş denemesi başlatılıyor...');

            // Önce misafir modunu temizle
            await AsyncStorage.removeItem('guestMode');
            await AsyncStorage.removeItem('guestMessageCount');

            // Supabase ile giriş işlemi
            const success = await login(email, password);

            if (success) {
                // Başarılı giriş
                setTimeout(() => {
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'Main' },
                            ],
                        })
                    );
                }, 200);
            }
        } catch (error) {
            console.error('Giriş işlemi hatası:', error);
            showErrorAlert('Giriş sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleMisafirGirisi = async () => {
        try {
            setIsLoading(true);

            // Önce AsyncStorage'ı temizle
            await Promise.all([
                AsyncStorage.removeItem('guestMode'),
                AsyncStorage.removeItem('guestMessageCount')
            ]);

            // Misafir girişini AppContext'teki fonksiyon ile yap
            const success = await continueAsGuest();

            if (success) {
                console.log('Misafir girişi başarılı, yönlendiriliyor...');

                // CommonActions ile kesin yönlendirme
                setTimeout(() => {
                    console.log('Ana ekrana yönlendiriliyor...');
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [
                                { name: 'Main' },
                            ],
                        })
                    );
                }, 200);
            } else {
                showErrorAlert('Misafir girişi sırasında bir hata oluştu.');
            }
        } catch (error) {
            console.error('Misafir girişi hatası:', error);
            showErrorAlert('Misafir girişi sırasında bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    // Buton basma animasyonu
    const onPressIn = () => {
        Animated.timing(buttonScaleAnim, {
            toValue: 0.95,
            duration: 100,
            useNativeDriver: true
        }).start();
    };

    const onPressOut = () => {
        Animated.timing(buttonScaleAnim, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true
        }).start();
    };

    // Loading durumunu kontrol et
    const isLoadingAny = isLoading || contextLoading;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
                <StatusBar backgroundColor={colors.statusBar} barStyle="light-content" />

                <View style={styles.logoContainer}>
                    <Animated.Image
                        source={require('../assets/turna-logo.svg')}
                        style={[
                            styles.logo,
                            {
                                transform: [
                                    { rotate: logoRotation },
                                    { scale: buttonAnim }
                                ]
                            }
                        ]}
                        resizeMode="contain"
                    />
                    <Animated.Text
                        style={[
                            styles.title,
                            {
                                color: colors.primary,
                                opacity: logoAnim,
                                transform: [{
                                    translateY: logoAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [20, 0]
                                    })
                                }]
                            }
                        ]}
                    >
                        Turna AI
                    </Animated.Text>
                    <Animated.Text
                        style={[
                            styles.subtitle,
                            {
                                color: colors.textSecondary,
                                opacity: logoAnim,
                                transform: [{
                                    translateY: logoAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [20, 0]
                                    })
                                }]
                            }
                        ]}
                    >
                        {t('aiAssistantByYourSide')}
                    </Animated.Text>
                </View>

                <Animated.View
                    style={[
                        styles.formContainer,
                        {
                            opacity: formAnim,
                            transform: [{
                                translateY: formAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [50, 0]
                                })
                            }]
                        }
                    ]}
                >
                    <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Ionicons name="mail-outline" size={24} color={colors.primary} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder={t('email')}
                            placeholderTextColor={colors.textSecondary}
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

                    <View style={[styles.inputContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        <Ionicons name="lock-closed-outline" size={24} color={colors.primary} style={styles.inputIcon} />
                        <TextInput
                            style={[styles.input, { color: colors.text }]}
                            placeholder={t('password')}
                            placeholderTextColor={colors.textSecondary}
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
                                color={colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>
                    {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>{t('forgotPassword')}</Text>
                    </TouchableOpacity>

                    <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
                        <TouchableOpacity
                            style={[styles.loginButton, { backgroundColor: colors.primary }]}
                            onPress={handleLogin}
                            disabled={isLoadingAny}
                            onPressIn={onPressIn}
                            onPressOut={onPressOut}
                        >
                            {isLoadingAny ? (
                                <ActivityIndicator color="#FFFFFF" size="small" />
                            ) : (
                                <Text style={styles.loginButtonText}>{t('login')}</Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>

                    <TouchableOpacity
                        style={[styles.misafirButton, { backgroundColor: colors.card, borderColor: colors.border }]}
                        onPress={handleMisafirGirisi}
                        disabled={isLoadingAny}
                    >
                        {isLoadingAny ? (
                            <ActivityIndicator color={colors.primary} size="small" />
                        ) : (
                            <Text style={[styles.misafirButtonText, { color: colors.primary }]}>{t('continueAsGuest')}</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.registerContainer}>
                        <Text style={[styles.registerText, { color: colors.textSecondary }]}>{t('noAccount')}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Kayit')}>
                            <Text style={[styles.registerLink, { color: colors.primary }]}>{t('register')}</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>

                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textSecondary }]}>{t('version')} 1.0.0</Text>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        fontSize: 28,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 5,
    },
    formContainer: {
        paddingHorizontal: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 5,
        paddingHorizontal: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        borderWidth: 1,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
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
        fontSize: 14,
    },
    loginButton: {
        borderRadius: 12,
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
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
    },
    misafirButtonText: {
        fontSize: 16,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    registerText: {
        marginRight: 5,
        fontSize: 16,
    },
    registerLink: {
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
        fontSize: 12,
    },
});