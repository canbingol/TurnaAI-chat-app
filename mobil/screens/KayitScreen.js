import React, { useState, useContext } from 'react';
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
    Alert,
    ScrollView,
    Keyboard
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../services/supabaseConfig'; // Doğrudan supabase'i içe aktarıyoruz

export default function KayitScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Validasyon hataları
    const [nameError, setNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const validateForm = () => {
        console.log("validateForm çağrıldı");
        let isValid = true;

        console.log("Değerler:", { name, email, password, confirmPassword });

        // İsim kontrolü
        if (!name.trim()) {
            setNameError('Lütfen adınızı giriniz');
            isValid = false;
        } else {
            setNameError('');
        }

        // Email kontrolü
        if (!email.trim()) {
            setEmailError('Lütfen e-posta adresinizi giriniz');
            isValid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            setEmailError('Geçerli bir e-posta adresi giriniz');
            isValid = false;
        } else {
            setEmailError('');
        }

        // Şifre kontrolü - min uzunluk kontrolü kaldırıldı
        if (!password) {
            setPasswordError('Lütfen şifre giriniz');
            isValid = false;
        } else {
            setPasswordError('');
        }

        // Şifre onay kontrolü
        if (password !== confirmPassword) {
            setConfirmPasswordError('Şifreler eşleşmiyor');
            isValid = false;
        } else {
            setConfirmPasswordError('');
        }

        console.log("Doğrulama sonucu:", isValid);
        return isValid;
    };

    const handleKayitOl = async () => {
        console.log("Kayıt Ol butonuna basıldı");

        if (!validateForm()) {
            console.log("Form doğrulama başarısız");
            return;
        }

        console.log("Form doğrulama başarılı, kayıt başlatılıyor...");
        Keyboard.dismiss();
        setIsLoading(true);

        try {
            console.log("Supabase auth.signUp çağrılıyor...");

            // 1. Auth kaydı
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { name }
                }
            });

            console.log("Auth.signUp yanıtı alındı");

            if (error) {
                console.error("Auth kayıt hatası:", error.message);
                Alert.alert(
                    "Kayıt Hatası",
                    error.message || "Kayıt sırasında bir hata oluştu."
                );
                setIsLoading(false);
                return;
            }

            if (!data || !data.user) {
                console.error("Kullanıcı kaydedildi ancak kullanıcı verisi alınamadı");
                Alert.alert(
                    "Kayıt Sorunu",
                    "Kayıt işlemi başarılı oldu ancak kullanıcı bilgileri alınamadı."
                );
                setIsLoading(false);
                return;
            }

            console.log("Auth kaydı başarılı, kullanıcı ID:", data.user.id);

            // 2. Users tablosuna kayıt
            console.log("Users tablosuna kayıt ekleniyor...");
            const { error: userError } = await supabase
                .from('users')
                .insert({
                    id: data.user.id,
                    name: name,
                    email: email,
                    password_hash: 'auth_managed', // Bu değer NOT NULL kısıtlaması için
                    created_at: new Date(),
                    updated_at: new Date()
                });

            if (userError) {
                console.error("Users tablosuna kayıt hatası:", userError.message);
                console.error("Hata detayları:", userError.details);

                // Users tablosuna kayıt başarısız olsa bile devam et
                // Zaten auth kaydı başarılı oldu
                console.log("Users tablosuna kayıt başarısız oldu ama işlem devam ediyor");
            } else {
                console.log("Users tablosuna kayıt başarılı");
            }

            // 3. Başarılı kayıt mesajı ve yönlendirme
            Alert.alert(
                "Kayıt Başarılı",
                "Hesabınız başarıyla oluşturuldu!",
                [
                    {
                        text: "Tamam",
                        onPress: () => navigation.replace("Main")
                    }
                ]
            );

        } catch (error) {
            console.error("Beklenmeyen kayıt hatası:", error);
            Alert.alert(
                "Kayıt Hatası",
                "Beklenmeyen bir hata oluştu: " + error.message
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#8A2BE2" barStyle="light-content" />

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/turna-logo.svg')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.title}>Turna AI</Text>
                </View>

                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={24} color="#8A2BE2" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Ad Soyad"
                            placeholderTextColor="#888"
                            value={name}
                            onChangeText={(text) => {
                                setName(text);
                                setNameError('');
                            }}
                        />
                    </View>
                    {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

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

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={24} color="#8A2BE2" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="Şifre Tekrar"
                            placeholderTextColor="#888"
                            value={confirmPassword}
                            onChangeText={(text) => {
                                setConfirmPassword(text);
                                setConfirmPasswordError('');
                            }}
                            secureTextEntry={!isConfirmPasswordVisible}
                        />
                        <TouchableOpacity
                            onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                            style={styles.passwordVisibilityToggle}
                        >
                            <Ionicons
                                name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                size={24}
                                color="#888"
                            />
                        </TouchableOpacity>
                    </View>
                    {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}

                    <TouchableOpacity
                        style={styles.kayitButton}
                        onPress={handleKayitOl}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.kayitButtonText}>Kayıt Ol</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Zaten hesabın var mı?</Text>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.loginLink}>Giriş Yap</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 30,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 10,
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
        marginBottom: 5,
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
        padding: 10,
    },
    errorText: {
        color: '#FF4757',
        fontSize: 12,
        marginLeft: 15,
        marginBottom: 10,
    },
    kayitButton: {
        backgroundColor: '#8A2BE2',
        borderRadius: 12,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    kayitButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    loginText: {
        marginRight: 5,
        fontSize: 16,
        color: '#888',
    },
    loginLink: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#8A2BE2',
    },
});