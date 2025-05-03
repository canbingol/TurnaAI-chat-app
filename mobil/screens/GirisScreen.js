import React, { useState, useRef, useEffect } from 'react';
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
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabaseConfig';

export default function GirisScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Basitleştirilmiş giriş fonksiyonu
    const handleLogin = async () => {
        console.log('Giriş denemesi başlatılıyor...');

        // Basit form doğrulama
        if (!email.trim()) {
            setEmailError('E-posta adresi gerekli');
            return;
        } else {
            setEmailError('');
        }

        if (!password) {
            setPasswordError('Şifre gerekli');
            return;
        } else {
            setPasswordError('');
        }

        Keyboard.dismiss();
        setIsLoading(true);

        try {
            console.log('Supabase bağlantısı test ediliyor...');
            console.log('Giriş için kullanılan URL:', supabase.supabaseUrl);

            // Doğrudan Supabase ile giriş denemesi
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            console.log('Supabase yanıtı alındı');

            if (error) {
                console.error('Giriş hatası:', error.message);
                Alert.alert(
                    'Giriş Hatası',
                    error.message || 'Geçersiz e-posta veya şifre'
                );
                setIsLoading(false);
                return;
            }

            console.log('Giriş başarılı, session data:', data?.session ? 'Var' : 'Yok');

            if (!data || !data.user) {
                console.error('Kullanıcı verisi alınamadı');
                Alert.alert(
                    'Giriş Sorunu',
                    'Giriş başarılı ancak kullanıcı bilgileri alınamadı.'
                );
                setIsLoading(false);
                return;
            }

            console.log('Kullanıcı ID:', data.user.id);
            console.log('Ana ekrana yönlendiriliyor...');

            // Başarılı giriş - ana ekrana yönlendir
            navigation.replace('Main');
        } catch (error) {
            console.error('Beklenmeyen giriş hatası:', error);
            Alert.alert(
                'Bağlantı Hatası',
                'Giriş sırasında beklenmeyen bir hata oluştu: ' + error.message
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.logoContainer}>
                <Text style={styles.title}>Giriş Testi</Text>
            </View>

            <View style={styles.formContainer}>
                {/* E-posta giriş alanı */}
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

                {/* Şifre giriş alanı */}
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

                {/* Giriş butonu */}
                <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <Text style={styles.loginButtonText}>Giriş Yap</Text>
                    )}
                </TouchableOpacity>

                {/* Kayıt yönlendirme */}
                <View style={styles.registerContainer}>
                    <Text style={styles.registerText}>Hesabın yok mu?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Kayit')}>
                        <Text style={styles.registerLink}>Kayıt Ol</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#8A2BE2',
    },
    formContainer: {
        paddingHorizontal: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        marginBottom: 8,
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        paddingVertical: 14,
        fontSize: 16,
        color: '#FFFFFF',
    },
    passwordVisibilityToggle: {
        padding: 8,
    },
    errorText: {
        color: '#FF4757',
        fontSize: 12,
        marginLeft: 15,
        marginBottom: 12,
    },
    loginButton: {
        backgroundColor: '#8A2BE2',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 15,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
    },
    registerText: {
        color: '#888',
        marginRight: 5,
        fontSize: 16,
    },
    registerLink: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#8A2BE2',
    },
});