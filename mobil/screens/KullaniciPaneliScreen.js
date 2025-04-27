import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    TextInput,
    ScrollView,
    Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function KullaniciPaneliScreen({ navigation }) {
    const [name, setName] = useState('Kullanıcı Adı');
    const [email, setEmail] = useState('kullanici@email.com');
    const [bio, setBio] = useState('');

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

    const handleSaveProfile = () => {
        // Profil kaydetme işlemi
        console.log('Profil kaydedildi');
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="#8A2BE2" barStyle="light-content" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profil Düzenle</Text>
                <TouchableOpacity onPress={handleSaveProfile}>
                    <Text style={styles.saveButton}>Kaydet</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileImageContainer}>
                    <Image
                        source={require('../assets/default-profile.png')}
                        style={styles.profileImage}
                    />
                    <TouchableOpacity style={styles.editProfileImageButton}>
                        <Ionicons name="camera" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>

                {profileFields.map((field, index) => (
                    <View key={index} style={styles.inputContainer}>
                        <Ionicons name={field.icon} size={24} color="#8A2BE2" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder={field.label}
                            placeholderTextColor="#888"
                            value={field.value}
                            onChangeText={field.onChangeText}
                            keyboardType={field.keyboardType || 'default'}
                        />
                    </View>
                ))}

                <View style={styles.inputContainer}>
                    <Ionicons name="clipboard-outline" size={24} color="#8A2BE2" style={styles.inputIcon} />
                    <TextInput
                        style={[styles.input, styles.bioInput]}
                        placeholder="Biyografi (İsteğe Bağlı)"
                        placeholderTextColor="#888"
                        value={bio}
                        onChangeText={setBio}
                        multiline={true}
                        numberOfLines={4}
                    />
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
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#8A2BE2',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    saveButton: {
        color: '#fff',
        fontSize: 16,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 20,
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
        borderWidth: 3,
        borderColor: '#8A2BE2',
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
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    inputIcon: {
        marginRight: 15,
    },
    input: {
        flex: 1,
        color: '#fff',
        fontSize: 16,
    },
    bioInput: {
        height: 100,
        textAlignVertical: 'top',
    },
});