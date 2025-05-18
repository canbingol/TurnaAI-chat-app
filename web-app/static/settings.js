document.addEventListener('DOMContentLoaded', function() {
    // Ayarlar Paneli Elementleri
    const settingsBtn = document.querySelector('.settings-btn');
    const settingsPanel = document.querySelector('.settings-panel');
    const closeSettings = document.querySelector('.close-settings');
    
    // Dil Seçimi
    const languageSelect = document.getElementById('language-select');
    
    // Yazı Boyutu
    const fontSizeSelect = document.getElementById('font-size-select');
    
    // Tema Seçenekleri
    const themeOptions = document.querySelectorAll('.theme-option');
    
    // Tema Toggle Butonu
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    
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
            
            const langChangedMsg = window.t ? 
                window.t('languageChanged') + ': ' + window.t(getLanguageName(selectedLang)) : 
                `Dil "${getLanguageName(selectedLang)}" olarak değiştirildi`;
            
            showToast(langChangedMsg, 'info');
            
            if (window.changeLanguage) {
                window.changeLanguage(selectedLang);
            }
        });
    }
    
    // Yazı boyutu değişimi
    if (fontSizeSelect) {
        fontSizeSelect.addEventListener('change', function() {
            const selectedSize = this.value;
            saveSettings('fontSize', selectedSize);
            applyFontSize(selectedSize);
            
            const fontSizeChangedMsg = window.t ? 
                window.t('fontSizeChanged') + ': ' + window.t(getFontSizeName(selectedSize)) : 
                `Yazı boyutu "${getFontSizeName(selectedSize)}" olarak değiştirildi`;
            
            showToast(fontSizeChangedMsg, 'info');
        });
    }
    
    // Tema seçimi - Tema butonlarına tıklandığında
    if (themeOptions) {
        themeOptions.forEach(option => {
            option.addEventListener('click', function() {
                const theme = this.dataset.theme;
                
                // Turquoise temasını geç
                if (theme === 'turquoise') {
                    return;
                }
                
                // Global tema değiştirme fonksiyonunu çağır
                toggleTheme(theme);
            });
        });
    }
    
    // Global tema değiştirme fonksiyonu - dışa aktar
    window.toggleTheme = function(specificTheme) {
        // Mevcut temayı al
        const settings = JSON.parse(localStorage.getItem('turnaSettings')) || {};
        const currentTheme = settings.theme || 'purple';
        
        // Yeni tema - eğer belirli bir tema isteniyorsa onu kullan, yoksa toggle yap
        const newTheme = specificTheme || (currentTheme === 'light' ? 'purple' : 'light');
        
        // Temayı uygula
        applyTheme(newTheme);
        saveSettings('theme', newTheme);
        
        // Tema seçeneklerini güncelle - tüm tema butonlarını güncelle
        document.querySelectorAll('.theme-option').forEach(option => {
            if (option.dataset.theme === newTheme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
        
        // Tema butonunu güncelle
        updateThemeToggleButton(newTheme);
        
        return newTheme;
    };
    
    // Sidebar'daki tema toggle butonu
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            toggleTheme(); // Parametre vermeden çağırarak otomatik değişim sağla
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
                
                if (window.changeLanguage) {
                    window.changeLanguage(settings.language);
                }
            }
            
            // Yazı boyutu ayarını yükle
            if (settings.fontSize && fontSizeSelect) {
                fontSizeSelect.value = settings.fontSize;
                applyFontSize(settings.fontSize);
            }
            
            // Tema ayarını yükle (sadece light ve purple)
            if (settings.theme) {
                // Turquoise ise purple olarak değiştir
                const theme = settings.theme === 'turquoise' ? 'purple' : settings.theme;
                applyTheme(theme);
                
                // Tema butonlarını güncelle
                themeOptions.forEach(option => {
                    if (option.dataset.theme === theme) {
                        option.classList.add('active');
                    } else {
                        option.classList.remove('active');
                    }
                });
                
                updateThemeToggleButton(theme);
            }
        } catch (error) {
            console.error('Ayarlar yüklenemedi:', error);
        }
    }
    
    // Temayı uygula
    function applyTheme(theme) {
        // Önce bütün tema classlarını temizle
        document.body.classList.remove('theme-light', 'theme-turquoise', 'theme-purple');
        
        // Light tema için body'ye doğru class'ı ekle
        if (theme === 'light') {
            document.body.classList.add('theme-light');
            // Light tema için HTML'yi de ekle (CSS variables için)
            document.documentElement.classList.add('light-theme');
            document.documentElement.classList.remove('theme-purple');
        } else {
            // Mor tema için
            document.body.classList.add('theme-purple');
            // Light tema class'ını html'den kaldır
            document.documentElement.classList.remove('light-theme');
            document.documentElement.classList.add('theme-purple');
        }
    }
    
    // Tema değiştirme butonunu güncelle
    function updateThemeToggleButton(theme) {
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        if (!themeToggleBtn) return;
        
        // Düğmenin içeriğini temaya göre güncelle
        if (theme === 'light') {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            themeToggleBtn.title = 'Koyu Temaya Geç';
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            themeToggleBtn.title = 'Açık Temaya Geç';
        }
    }
    
    // Yazı boyutunu uygula
    function applyFontSize(size) {
        document.documentElement.style.fontSize = getFontSizeValue(size);
    }
    
    // Yazı boyutu değerini al
    function getFontSizeValue(size) {
        switch(size) {
            case 'small':
                return '14px';
            case 'large':
                return '18px';
            default:
                return '16px';
        }
    }
    
    function getLanguageName(code) {
        const languages = {
            'tr': 'Türkçe',
            'en': 'English',
            'de': 'Deutsch',
            'fr': 'Français'
        };
        return languages[code] || code;
    }
    
    function getFontSizeName(size) {
        const sizes = {
            'small': 'Küçük',
            'medium': 'Orta',
            'large': 'Büyük'
        };
        return sizes[size] || size;
    }
    
    function getThemeName(theme) {
        const themes = {
            'light': 'Açık',
            'purple': 'Mor'
        };
        return themes[theme] || theme;
    }
    
    function showToast(message, type = 'info') {
        if (window.showToast) {
            window.showToast(message, type);
        }
    }
});