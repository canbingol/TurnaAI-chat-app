import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Image,
    StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function KayitScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

    const handleKayitOl = () => {
        // Kayıt kontrolleri
        if (password !== confirmPassword) {
            alert('Şifreler eşleşmiyor!');
            return;
        }
        navigation.replace('AnaEkran');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#8A2BE2" barStyle="light-content" />

            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/turna-logo.svg')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>AI Asistan</Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={24} color="#8A2BE2" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Ad Soyad"
                        placeholderTextColor="#888"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="mail-outline" size={24} color="#8A2BE2" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="E-posta"
                        placeholderTextColor="#888"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={24} color="#8A2BE2" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Şifre"
                        placeholderTextColor="#888"
                        value={password}
                        onChangeText={setPassword}
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

                <View style={styles.inputContainer}>
                    <Ionicons name="lock-closed-outline" size={24} color="#8A2BE2" style={styles.inputIcon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Şifre Tekrar"
                        placeholderTextColor="#888"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
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

                <TouchableOpacity
                    style={styles.kayitButton}
                    onPress={handleKayitOl}
                >
                    <Text style={styles.kayitButtonText}>Kayıt Ol</Text>
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Zaten hesabın var mı?</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.loginLink}>Giriş Yap</Text>
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
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 150,
        height: 150,
    },
    title: {
        color: '#8A2BE2',
        fontSize: 24,
        fontWeight: 'bold',
    },
    formContainer: {
        paddingHorizontal: 30,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#FFFFFF',
        paddingVertical: 12,
    },
    passwordVisibilityToggle: {
        padding: 10,
    },
    kayitButton: {
        backgroundColor: '#8A2BE2',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
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
        color: '#888',
        marginRight: 5,
    },
    loginLink: {
        color: '#8A2BE2',
        fontWeight: 'bold',
    },
});