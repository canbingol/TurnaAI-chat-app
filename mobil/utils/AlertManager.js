import { Alert, Platform } from 'react-native';

// Daha güzel ve özelleştirilmiş alert mesajları için yardımcı fonksiyon
export const showCustomAlert = (title, message, buttons, options = {}) => {
    const { cancelable = true } = options;

    // Platformdan bağımsız olarak varsayılan butonları ayarla
    const defaultButtons = [
        {
            text: 'Tamam',
            style: 'default',
        }
    ];

    // Butonlar belirtilmemiş ise varsayılanları kullan
    const finalButtons = buttons || defaultButtons;

    // Alert'i göster
    Alert.alert(title, message, finalButtons, { cancelable });
};

// Önceden tanımlanmış özel alertlar

// Başarı alert'i
export const showSuccessAlert = (message, onPress) => {
    return showCustomAlert(
        '✅ Başarılı',
        message,
        [
            {
                text: 'Tamam',
                onPress: onPress,
                style: 'default'
            }
        ]
    );
};

// Hata alert'i
export const showErrorAlert = (message, onPress) => {
    return showCustomAlert(
        '❌ Hata',
        message,
        [
            {
                text: 'Tamam',
                onPress: onPress,
                style: 'default'
            }
        ]
    );
};

// Bilgi alert'i
export const showInfoAlert = (message, onPress) => {
    return showCustomAlert(
        'ℹ️ Bilgi',
        message,
        [
            {
                text: 'Tamam',
                onPress: onPress,
                style: 'default'
            }
        ]
    );
};

// Onay alert'i
export const showConfirmAlert = (message, onConfirm, onCancel) => {
    return showCustomAlert(
        '❓ Onay',
        message,
        [
            {
                text: 'İptal',
                onPress: onCancel,
                style: 'cancel'
            },
            {
                text: 'Onay',
                onPress: onConfirm,
                style: 'destructive'
            }
        ]
    );
};

// Çıkış onayı alert'i
export const showLogoutConfirm = (onConfirm) => {
    return showCustomAlert(
        '🚪 Çıkış Yap',
        'Oturumunuzu kapatmak istediğinize emin misiniz?',
        [
            {
                text: 'İptal',
                style: 'cancel'
            },
            {
                text: 'Çıkış Yap',
                onPress: onConfirm,
                style: 'destructive'
            }
        ]
    );
};

// Silme onayı alert'i
export const showDeleteConfirm = (itemName, onConfirm) => {
    return showCustomAlert(
        '🗑️ Silme Onayı',
        `${itemName} öğesini silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
        [
            {
                text: 'İptal',
                style: 'cancel'
            },
            {
                text: 'Sil',
                onPress: onConfirm,
                style: 'destructive'
            }
        ]
    );
};

// Dil değişikliği alert'i
export const showLanguageChanged = (onPress) => {
    return showSuccessAlert('Dil ayarınız başarıyla değiştirildi. Değişikliklerin tüm uygulamada görünmesi için uygulamayı yeniden başlatabilirsiniz.', onPress);
};

// Tema değişikliği alert'i 
export const showThemeChanged = (onPress) => {
    return showSuccessAlert('Tema ayarınız başarıyla değiştirildi.', onPress);
};