// script.js veya ayrı bir tema.js dosyasına ekleyin

document.addEventListener('DOMContentLoaded', function() {
    // Sol alttaki tema değiştirme düğmesini bul (varsa)
    const themeIcon = document.querySelector('.sidebar-footer .theme-toggle i');
    if (themeIcon) {
        // Tema simgesine tıklandığında
        themeIcon.parentElement.addEventListener('click', function() {
            // Ana tema değiştirme fonksiyonunu çağır
            if (window.toggleTheme) {
                window.toggleTheme();
            }
        });
    }
    
    // Ayarlar panelindeki tema butonlarını da etkinleştir
    const themeOptions = document.querySelectorAll('.theme-option');
    if (themeOptions.length) {
        themeOptions.forEach(option => {
            option.addEventListener('click', function() {
                const theme = this.dataset.theme;
                
                // Aktif tema butonunu güncelle
                themeOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                
                // Temayı uygula
                applyThemeFromSettings(theme);
            });
        });
    }
    
    // Ayarlar panelinden tema uygulaması
    function applyThemeFromSettings(theme) {
        const body = document.body;
        const themeToggleBtn = document.getElementById('theme-toggle-btn');
        
        // Önceki temaları temizle
        body.classList.remove('theme-light', 'theme-dark', 'theme-purple');
        
        // Yeni temayı ekle
        if (theme === 'light') {
            body.classList.add('theme-light');
            
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            }
        } else if (theme === 'dark') {
            body.classList.add('theme-dark');
            
            if (themeToggleBtn) {
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
        } else if (theme === 'purple') {
            body.classList.add('theme-purple');
        }
        
        // localStorage'a kaydet
        try {
            const settings = JSON.parse(localStorage.getItem('turnaSettings')) || {};
            settings.theme = theme;
            localStorage.setItem('turnaSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Tema ayarı kaydedilemedi:', error);
        }
        
        // Bildirim göster
        if (window.showToast && window.t) {
            window.showToast(window.t('themeChanged') + ': ' + window.t(theme), 'info');
        }
    }
});