// Ses bildirimleri için yardımcı fonksiyonlar
const SoundNotifications = {
    // Ses dosyalarını önceden yükle (dosyaların mevcut olup olmadığını kontrol et)
    sounds: {
        message: null,
        notification: null,
        send: null
    },
    
    // Ses dosyalarını yükle
    init: function() {
        try {
            this.sounds.message = new Audio('/static/sounds/message.mp3');
            this.sounds.notification = new Audio('/static/sounds/notification.mp3');
            this.sounds.send = new Audio('/static/sounds/send.mp3');
            console.log('Ses dosyaları yüklendi');
            
            // Yüklenip yüklenmediğini kontrol et
            this.sounds.message.addEventListener('error', () => {
                console.error('Mesaj ses dosyası yüklenemedi');
            });
            
            this.sounds.notification.addEventListener('error', () => {
                console.error('Bildirim ses dosyası yüklenemedi');
            });
            
            this.sounds.send.addEventListener('error', () => {
                console.error('Gönderme ses dosyası yüklenemedi');
            });
        } catch (error) {
            console.error('Ses dosyaları yüklenemedi:', error);
        }
    },
    
    // Bildirimlerin etkin olup olmadığını kontrol et
    isEnabled: function() {
        try {
            const settings = JSON.parse(localStorage.getItem('turnaSettings')) || {};
            return settings.soundNotifications !== false; // Varsayılan olarak açık
        } catch (error) {
            console.error('Ses ayarları okunamadı:', error);
            return true; // Hata durumunda varsayılan olarak açık
        }
    },
    
    // Mesaj alındığında çal
    playMessageSound: function() {
        if (this.isEnabled() && this.sounds.message) {
            this.sounds.message.currentTime = 0;
            this.sounds.message.play().catch(e => console.log('Mesaj sesi çalınamadı:', e));
        }
    },
    
    // Bildirim sesi çal
    playNotificationSound: function() {
        if (this.isEnabled() && this.sounds.notification) {
            this.sounds.notification.currentTime = 0;
            this.sounds.notification.play().catch(e => console.log('Bildirim sesi çalınamadı:', e));
        }
    },
    
    // Mesaj gönderildiğinde çal
    playSendSound: function() {
        if (this.isEnabled() && this.sounds.send) {
            this.sounds.send.currentTime = 0;
            this.sounds.send.play().catch(e => console.log('Gönderme sesi çalınamadı:', e));
        }
    }
};

// Sayfa yüklendiğinde ses bildirimlerini ayarla
document.addEventListener('DOMContentLoaded', function() {
    // Ses dosyalarını başlat
    SoundNotifications.init();
    
    // Ses bildirimlerinin açılıp kapanmasını dinle
    const soundToggle = document.getElementById('sound-notification-toggle');
    const prefSounds = document.getElementById('pref-sounds');
    
    // İki ses toggle kontrolünü senkronize tut
    function updateSoundSettings(checked) {
        try {
            const settings = JSON.parse(localStorage.getItem('turnaSettings')) || {};
            settings.soundNotifications = checked;
            localStorage.setItem('turnaSettings', JSON.stringify(settings));
            
            // Diğer toggle'ı güncelle
            if (soundToggle && soundToggle !== this) {
                soundToggle.checked = checked;
            }
            
            if (prefSounds && prefSounds !== this) {
                prefSounds.checked = checked;
            }
            
            // Test sesi çal
            if (checked) {
                SoundNotifications.playNotificationSound();
            }
            
            // Toast bildirimi göster
            if (window.showToast) {
                if (window.t) {
                    // Çeviri varsa kullan
                    const status = checked ? window.t('settingEnabled') : window.t('settingDisabled');
                    window.showToast(window.t('soundNotifications') + ' ' + status, 'info');
                } else {
                    // Yoksa varsayılan mesaj
                    const status = checked ? 'etkinleştirildi' : 'devre dışı bırakıldı';
                    window.showToast(`Ses bildirimleri ${status}`, 'info');
                }
            }
        } catch (error) {
            console.error('Ses ayarları kaydedilemedi:', error);
        }
    }
    
    if (soundToggle) {
        soundToggle.addEventListener('change', function() {
            updateSoundSettings(this.checked);
        });
    }
    
    if (prefSounds) {
        prefSounds.addEventListener('change', function() {
            updateSoundSettings(this.checked);
        });
    }
    
    // Ayarlardan ses bildirimlerinin durumunu ayarla
    try {
        const settings = JSON.parse(localStorage.getItem('turnaSettings')) || {};
        if (soundToggle) {
            soundToggle.checked = settings.soundNotifications !== false;
        }
        if (prefSounds) {
            prefSounds.checked = settings.soundNotifications !== false;
        }
    } catch (error) {
        console.error('Ses ayarları yüklenemedi:', error);
    }
    
    // Gönderme butonuna tıklandığında ses çal
    const sendButton = document.getElementById('send-button');
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            // Bu olay zaten gerçekleşmiş olabilir, ancak ekstra güvenlik için buraya da ekliyoruz
            SoundNotifications.playSendSound();
        });
    }
    
    // script.js dosyasında 'messageReceived' olayı tetiklendiğinde
    document.addEventListener('messageReceived', function() {
        SoundNotifications.playMessageSound();
    });
    
    // Her ay için test ses dinleyicileri ekle
    function addTestSoundListener(elementId, soundFunction) {
        const element = document.getElementById(elementId);
        if (element) {
            element.addEventListener('click', function() {
                soundFunction.call(SoundNotifications);
            });
        }
    }
    
    // Test butonları eklenirse bunları etkinleştir
    addTestSoundListener('test-message-sound', SoundNotifications.playMessageSound);
    addTestSoundListener('test-notification-sound', SoundNotifications.playNotificationSound);
    addTestSoundListener('test-send-sound', SoundNotifications.playSendSound);
});

// Global olarak kullanılabilmesi için ses bildirimlerini dışa aktar
window.SoundNotifications = SoundNotifications;

// Toast bildirimi gösterme fonksiyonu
window.showToast = function(message, type = 'info') {
    const toastContainer = document.querySelector('.toast-container') || createToastContainer();
    const toast = createToast(message, type);
    toastContainer.appendChild(toast);

    // 3 saniye sonra toast'u kaldır
    setTimeout(() => {
        toast.remove();
    }, 3000);
};

// Toast container oluşturma
function createToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
    return container;
}

// Toast elementi oluşturma
function createToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // İkon seçimi
    let icon = 'info-circle';
    if (type === 'success') {
        icon = 'check-circle';
    } else if (type === 'warning') {
        icon = 'exclamation-triangle';
    } else if (type === 'error') {
        icon = 'times-circle';
    }
    
    toast.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span class="toast-message">${message}</span>
    `;
    
    return toast;
}