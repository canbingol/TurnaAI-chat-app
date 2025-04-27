// auth-profile.js - Sıfırdan yazılmış çalışan versiyon
document.addEventListener('DOMContentLoaded', function () {
    // DOM elementlerini seç
    const authModal = document.getElementById('auth-modal');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authTabs = document.querySelectorAll('.auth-tab');
    const togglePasswordBtns = document.querySelectorAll('.toggle-password');
    const profileLink = document.getElementById('profile-link');
    const historyLink = document.getElementById('history-link');
    const preferencesLink = document.getElementById('preferences-link');
    const helpLink = document.getElementById('help-link');
    const logoutLink = document.getElementById('logout-link');
    const profileCardOverlay = document.getElementById('profile-card-overlay');
    const profileCards = document.querySelectorAll('.profile-card');
    const closeProfileCardBtns = document.querySelectorAll('.close-profile-card');
    const guestLoginBtn = document.querySelector('.guest-login-btn');

    // CSS stillerini doğrudan ekle
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .profile-card-overlay {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: rgba(0, 0, 0, 0.7) !important;
            z-index: 9999 !important;
            display: none !important;
            justify-content: center !important;
            align-items: center !important;
        }
        
        .profile-card-overlay.visible {
            display: flex !important;
        }
        
        .profile-card {
            display: none !important;
            background-color: var(--dark-gray) !important;
            width: 90% !important;
            max-width: 500px !important;
            border-radius: 12px !important;
            box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3) !important;
            z-index: 10000 !important;
        }
        
        .profile-card.visible {
            display: block !important;
        }
    `;
    document.head.appendChild(styleElement);

    // Veritabanı bağlantı durumunu kontrol et
    async function checkDatabaseConnection() {
        try {
            const response = await fetch('/api/check-connection');
            const data = await response.json();

            if (response.ok) {
                console.log('Veritabanı bağlantısı başarılı:', data.message);
                return true;
            } else {
                console.error('Veritabanı bağlantı hatası:', data.error);
                return false;
            }
        } catch (error) {
            console.error('Veritabanı bağlantı kontrolü başarısız:', error);
            return false;
        }
    }

    // Sayfa yüklendiğinde veritabanı bağlantısını kontrol et
    checkDatabaseConnection()
        .then(isConnected => {
            if (isConnected) {
                console.log('Uygulama veritabanı ile çalışıyor');
            } else {
                console.log('Uygulama offline modda çalışıyor');
                showToast('Veritabanı bağlantısı kurulamadı. Bazı özellikler sınırlı olabilir.', 'warning');
            }
        });

    // Auth modal tabları arasında geçiş
    authTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Tüm tabları ve formları pasif yap
            authTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));

            // Tıklanan tabı ve ilgili formu aktif yap
            this.classList.add('active');
            const tabName = this.getAttribute('data-tab');

            if (tabName === 'login') {
                loginForm.classList.add('active');
            } else if (tabName === 'signup' || tabName === 'register') {
                registerForm.classList.add('active');
            }
        });
    });

    // Şifre göster/gizle butonları
    togglePasswordBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const passwordInput = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            // Şifre görünürlüğünü değiştir
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Auth modalını gösterme fonksiyonu
    function showAuthModal() {
        authModal.classList.add('show');
        // Login formunu aktif et
        authTabs.forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
        document.querySelector('.auth-tab[data-tab="login"]').classList.add('active');
        loginForm.classList.add('active');
    }

    // Auth modalını gizleme fonksiyonu
    function hideAuthModal() {
        authModal.classList.remove('show');
    }

    // Profil kartlarını gösterme fonksiyonu - Tamamen yeniden yazıldı
    function showProfileCard(cardId) {
        console.log('showProfileCard çağrıldı:', cardId);

        // Tüm kartları gizle
        profileCards.forEach(card => {
            card.classList.remove('visible');
        });

        // İstenen kartı göster
        const card = document.getElementById(cardId);
        if (card) {
            card.classList.add('visible');
            console.log('Kart gösteriliyor:', cardId);
        } else {
            console.error('Kart bulunamadı:', cardId);
        }

        // Overlay'i göster
        profileCardOverlay.classList.add('visible');
    }

    // Profil kartlarını gizleme fonksiyonu - Tamamen yeniden yazıldı
    function hideProfileCards() {
        console.log('hideProfileCards çağrıldı');

        // Overlay'i gizle
        profileCardOverlay.classList.remove('visible');

        // Tüm kartları gizle
        profileCards.forEach(card => {
            card.classList.remove('visible');
        });
    }

    // Profil linki tıklama olayı
    if (profileLink) {
        profileLink.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Profil linkine tıklandı');

            // Menüyü kapat
            const profileMenu = document.querySelector('.profile-menu');
            if (profileMenu) {
                profileMenu.classList.remove('show');
            }

            // Profil kartını göster
            showProfileCard('profile-card');
        });
    }

    // Geçmiş linki tıklama olayı
    if (historyLink) {
        historyLink.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Geçmiş linkine tıklandı');

            // Menüyü kapat
            const profileMenu = document.querySelector('.profile-menu');
            if (profileMenu) {
                profileMenu.classList.remove('show');
            }

            // Geçmiş kartını göster
            showProfileCard('history-card');
        });
    }

    // Tercihler linki tıklama olayı
    if (preferencesLink) {
        preferencesLink.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Tercihler linkine tıklandı');

            // Menüyü kapat
            const profileMenu = document.querySelector('.profile-menu');
            if (profileMenu) {
                profileMenu.classList.remove('show');
            }

            // Tercihler kartını göster
            showProfileCard('preferences-card');
        });
    }

    // Yardım linki tıklama olayı
    if (helpLink) {
        helpLink.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Yardım linkine tıklandı');

            // Menüyü kapat
            const profileMenu = document.querySelector('.profile-menu');
            if (profileMenu) {
                profileMenu.classList.remove('show');
            }

            // Yardım kartını göster
            showProfileCard('help-card');
        });
    }

    // Profil kartı kapatma butonları
    closeProfileCardBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            console.log('Kart kapatma butonuna tıklandı');
            hideProfileCards();
        });
    });

    // Overlay'e tıklama ile kartları kapat
    profileCardOverlay.addEventListener('click', function (e) {
        // Sadece overlay'in kendisine tıklandığında kapat
        if (e.target === profileCardOverlay) {
            hideProfileCards();
        }
    });

    // Login formu submit olayı
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                showToast('Lütfen e-posta ve şifrenizi girin', 'error');
                return;
            }

            try {
                console.log('Giriş denemesi:', { email, password });

                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Giriş başarılı:', data);
                    showToast('Giriş başarılı!', 'success');

                    // Auth modalını kapat
                    hideAuthModal();

                    // Sayfayı yenile
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    console.error('Giriş hatası:', data);
                    showToast(data.error || 'Giriş başarısız. Kullanıcı adı veya şifre hatalı.', 'error');
                }
            } catch (error) {
                console.error('Giriş işlemi sırasında hata:', error);
                showToast('Bağlantı hatası. Lütfen tekrar deneyin.', 'error');
            }
        });
    }

    // Register formu submit olayı
    if (registerForm) {
        registerForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const termsAgree = document.getElementById('terms-agree').checked;

            if (!name || !email || !password) {
                showToast('Lütfen tüm alanları doldurun', 'error');
                return;
            }

            if (password !== confirmPassword) {
                showToast('Şifreler eşleşmiyor', 'error');
                return;
            }

            if (!termsAgree) {
                showToast('Kullanım şartlarını kabul etmelisiniz', 'error');
                return;
            }

            try {
                console.log('Kayıt denemesi:', { name, email, password });

                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    console.log('Kayıt başarılı:', data);
                    showToast('Kayıt başarılı!', 'success');

                    // Auth modalını kapat
                    hideAuthModal();

                    // Sayfayı yenile
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    console.error('Kayıt hatası:', data);
                    showToast(data.error || 'Kayıt başarısız. Lütfen farklı bir e-posta adresi deneyin.', 'error');
                }
            } catch (error) {
                console.error('Kayıt işlemi sırasında hata:', error);
                showToast('Bağlantı hatası. Lütfen tekrar deneyin.', 'error');
            }
        });
    }

    // Misafir girişi butonu
    if (guestLoginBtn) {
        guestLoginBtn.addEventListener('click', function () {
            hideAuthModal();
            showToast('Misafir olarak giriş yapıldı', 'info');
        });
    }

    // Çıkış yapma işlemi
    if (logoutLink) {
        logoutLink.addEventListener('click', async function (e) {
            e.preventDefault();

            try {
                const response = await fetch('/api/logout', {
                    method: 'POST'
                });

                if (response.ok) {
                    showToast('Çıkış yapıldı', 'success');

                    // Sayfayı yenile
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    const data = await response.json();
                    showToast(data.error || 'Çıkış yapılırken bir hata oluştu', 'error');
                }
            } catch (error) {
                console.error('Çıkış işlemi sırasında hata:', error);
                showToast('Bağlantı hatası. Lütfen tekrar deneyin.', 'error');
            }
        });
    }

    // Kullanıcı kimlik doğrulama durumunu kontrol et
    async function checkAuthStatus() {
        try {
            const response = await fetch('/api/user');

            if (response.ok) {
                const data = await response.json();
                console.log('Kullanıcı oturumu açık:', data.user);
                return true;
            } else {
                console.log('Kullanıcı oturumu kapalı');
                // Kullanıcı giriş yapmamışsa, auth modalını göster
                showAuthModal();
                return false;
            }
        } catch (error) {
            console.error('Kimlik doğrulama kontrolü hatası:', error);
            return false;
        }
    }

    // Sayfa yüklendiğinde kimlik doğrulama durumunu kontrol et
    checkAuthStatus();

    // SSS açılır-kapanır panel işlevselliği
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', function () {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');

            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                icon.classList.remove('fa-chevron-up');
                icon.classList.add('fa-chevron-down');
            } else {
                answer.style.display = 'block';
                icon.classList.remove('fa-chevron-down');
                icon.classList.add('fa-chevron-up');
            }
        });
    });

    // Yardım tabları arasında geçiş
    const helpTabs = document.querySelectorAll('.help-tab');
    helpTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Tüm tabları ve içerikleri pasif yap
            helpTabs.forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.help-content').forEach(content => content.classList.remove('active'));

            // Tıklanan tabı ve ilgili içeriği aktif yap
            this.classList.add('active');
            const tabName = this.getAttribute('data-tab');
            const contentId = tabName + '-content';
            document.getElementById(contentId).classList.add('active');
        });
    });

    // Window global'e fonksiyon referanslarını ekle
    window.showProfileCard = showProfileCard;
    window.hideProfileCards = hideProfileCards;
});