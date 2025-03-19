document.addEventListener('DOMContentLoaded', function() {
    // Ayarlar Paneli Elementleri
    const settingsBtn = document.querySelector('.settings-btn');
    const settingsPanel = document.querySelector('.settings-panel');
    const closeSettings = document.querySelector('.close-settings');
    
    // Dil Seçimi
    const languageSelect = document.getElementById('language-select');
    
    // Otomatik Kaydırma
    const autoScrollToggle = document.getElementById('auto-scroll-toggle');
    
    // Yazı Boyutu
    const fontSizeSelect = document.getElementById('font-size-select');
    
    // Tema Seçenekleri
    const themeOptions = document.querySelectorAll('.theme-option');
    
    // Tema Toggle Butonu
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
    // Ses Bildirimleri
    const soundNotificationToggle = document.getElementById('sound-notification-toggle');
    
    // Ayarları localStorage'dan yükle
    loadSettings();
    
    // Ayarlar butonuna tıklama
    settingsBtn.addEventListener('click', function() {
        settingsPanel.classList.add('show');
    });
    
    // Ayarları kapatma butonu
    closeSettings.addEventListener('click', function() {
        settingsPanel.classList.remove('show');
    });
    
    // Dışarı tıklama ile kapatma
    document.addEventListener('click', function(e) {
        if (settingsPanel.classList.contains('show') && 
            !settingsPanel.contains(e.target) && 
            !settingsBtn.contains(e.target)) {
            settingsPanel.classList.remove('show');
        }
    });
    
    // Dil değişimi
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const selectedLang = this.value;
            saveSettings('language', selectedLang);
            
            // window.t fonksiyonunu kontrol et ve kullan
            const langChangedMsg = window.t ? 
                window.t('languageChanged') + ': ' + window.t(getLanguageName(selectedLang)) : 
                `Dil "${getLanguageName(selectedLang)}" olarak değiştirildi`;
            
            showToast(langChangedMsg, 'info');
            
            // Dil değişimini uygula
            if (window.changeLanguage) {
                window.changeLanguage(selectedLang);
            }
            
            // Dil değişikliği olayını tetikle
            document.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: selectedLang }
            }));
        });
    }
    
    // Otomatik kaydırma değişimi
    if (autoScrollToggle) {
        autoScrollToggle.addEventListener('change', function() {
            const isEnabled = this.checked;
            saveSettings('autoScroll', isEnabled);
            
            // Çeviri için kontrol et
            const status = isEnabled ? 
                (window.t ? window.t('settingEnabled') : 'etkinleştirildi') : 
                (window.t ? window.t('settingDisabled') : 'devre dışı bırakıldı');
            
            const autoScrollLabel = window.t ? window.t('autoScroll') : 'Otomatik kaydırma';
            
            showToast(`${autoScrollLabel} ${status}`, 'info');
        });
    }
    
    // Yazı boyutu değişimi
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', function() {
            const selectedSize = this.value;
            saveSettings('fontSize', selectedSize);
            applyFontSize(selectedSize);
            
            // Çeviri için kontrol et
            const fontSizeChangedMsg = window.t ? 
                window.t('fontSizeChanged') + ': ' + window.t(getFontSizeName(selectedSize)) : 
                `Yazı boyutu "${getFontSizeName(selectedSize)}" olarak değiştirildi`;
            
            showToast(fontSizeChangedMsg, 'info');
        });
    }
    
    // Tema seçimi
    if (themeOptions) {
        themeOptions.forEach(option => {
            option.addEventListener('click', function() {
                const theme = this.dataset.theme;
                
                // Aktif tema butonunu güncelle
                themeOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Temayı uygula
                applyTheme(theme);
                saveSettings('theme', theme);
                
                // Tema toggle butonunu güncelle
                updateThemeToggleButton(theme);
                
                // Çeviri için kontrol et
                const themeChangedMsg = window.t ? 
                    window.t('themeChanged') + ': ' + window.t(theme) : 
                    `Tema "${getThemeName(theme)}" olarak değiştirildi`;
                
                showToast(themeChangedMsg, 'success');
            });
        });
    }
    
    // Ses bildirimleri değişimi
    if (soundNotificationToggle) {
        soundNotificationToggle.addEventListener('change', function() {
            const isEnabled = this.checked;
            saveSettings('soundNotifications', isEnabled);
            
            // Çeviri için kontrol et
            const status = isEnabled ? 
                (window.t ? window.t('settingEnabled') : 'etkinleştirildi') : 
                (window.t ? window.t('settingDisabled') : 'devre dışı bırakıldı');
            
            const soundLabel = window.t ? window.t('soundNotifications') : 'Ses bildirimleri';
            
            showToast(`${soundLabel} ${status}`, 'info');
            
            // Test sesi çal
            if (isEnabled && window.SoundNotifications) {
                window.SoundNotifications.playNotificationSound();
            }
        });
    }
    
    // Ayarları localStorage'a kaydet
    function saveSettings(key, value) {
        try {
            const settings = JSON.parse(localStorage.getItem('turnaSettings')) || {};
            settings[key] = value;
            localStorage.setItem('turnaSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Ayarlar kaydedilemedi:', error);
        }
    }
    
    // Ayarları localStorage'dan yükle
    function loadSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('turnaSettings')) || {};
            
            // Dil ayarını yükle
            if (settings.language && languageSelect) {
                languageSelect.value = settings.language;
                
                // Dil değişimini uygula
                if (window.changeLanguage) {
                    window.changeLanguage(settings.language);
                }
            }
            
            // Otomatik kaydırma ayarını yükle
            if (autoScrollToggle && settings.autoScroll !== undefined) {
                autoScrollToggle.checked = settings.autoScroll;
            }
            
            // Yazı boyutu ayarını yükle
            if (settings.fontSize && fontSizeSelect) {
                fontSizeSelect.value = settings.fontSize;
                applyFontSize(settings.fontSize);
            }
            
            // Tema ayarını yükle
            if (settings.theme) {
                applyTheme(settings.theme);
                themeOptions.forEach(option => {
                    if (option.dataset.theme === settings.theme) {
                        option.classList.add('active');
                    } else {
                        option.classList.remove('active');
                    }
                });
                
                // Tema toggle butonunu güncelle
                updateThemeToggleButton(settings.theme);
            }
            
            // Ses bildirimleri ayarını yükle
            if (soundNotificationToggle && settings.soundNotifications !== undefined) {
                soundNotificationToggle.checked = settings.soundNotifications;
            }
            
        } catch (error) {
            console.error('Ayarlar yüklenemedi:', error);
        }
    }
    
    // Temayı uygula
    function applyTheme(theme) {
        // Önceki temaları temizle
        document.body.classList.remove('theme-light', 'theme-dark', 'theme-purple');
        
        // Yeni temayı ekle
        if (theme === 'light') {
            document.body.classList.add('theme-light');
        } else if (theme === 'dark') {
            document.body.classList.add('theme-dark');
        } else if (theme === 'purple') {
            document.body.classList.add('theme-purple');
        }
    }
    
    // Tema değiştirme butonunu güncelle
    function updateThemeToggleButton(theme) {
        if (!themeToggleBtn) return;
        
        if (theme === 'light') {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            if (window.t) {
                themeToggleBtn.title = window.t('lightTheme');
            }
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            if (window.t) {
                themeToggleBtn.title = window.t('darkTheme');
            }
        }
    }
    
    // Yazı boyutunu uygula
    function applyFontSize(size) {
        // Önceki boyutları temizle
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        
        // Yeni boyutu ekle
        document.body.classList.add(`font-${size}`);
    }
    
    // Dil adını al
    function getLanguageName(code) {
        const languages = {
            'tr': 'Türkçe',
            'en': 'English',
            'de': 'Deutsch',
            'fr': 'Français'
        };
        return languages[code] || code;
    }
    
    // Yazı boyutu adını al
    function getFontSizeName(size) {
        const sizes = {
            'small': 'Küçük',
            'medium': 'Orta',
            'large': 'Büyük'
        };
        return sizes[size] || size;
    }
    
    // Tema adını al
    function getThemeName(theme) {
        const themes = {
            'light': 'Açık',
            'dark': 'Koyu',
            'purple': 'Mor'
        };
        return themes[theme] || theme;
    }
    
    // Toast bildirimi göster
    function showToast(message, type = 'info') {
        // Ana uygulamadaki toast fonksiyonunu kullan
        if (window.showToast) {
            window.showToast(message, type);
        } else {
            // Toast fonksiyonu yoksa basit bir toast oluştur
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            
            let icon = 'info-circle';
            if (type === 'success') icon = 'check-circle';
            if (type === 'error') icon = 'exclamation-circle';
            if (type === 'warning') icon = 'exclamation-triangle';
            
            toast.innerHTML = `
                <div class="toast-icon"><i class="fas fa-${icon}"></i></div>
                <div class="toast-message">${message}</div>
                <button class="toast-close"><i class="fas fa-times"></i></button>
            `;
            
            // Toast konteyneri oluştur veya mevcut olanı kullan
            let toastContainer = document.querySelector('.toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.className = 'toast-container';
                document.body.appendChild(toastContainer);
            }
            
            // Toastı ekle
            toastContainer.appendChild(toast);
            
            // Kapatma butonu
            const closeBtn = toast.querySelector('.toast-close');
            closeBtn.addEventListener('click', function() {
                toast.remove();
            });
            
            // Otomatik kapat
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }
    }
});