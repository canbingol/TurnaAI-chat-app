document.addEventListener('DOMContentLoaded', function () {
    // DOM elementlerini seç
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const clearButton = document.getElementById('clear-btn');
    const newChatButton = document.querySelector('.new-chat-btn');
    const userProfile = document.querySelector('.user-profile');
    const profileMenu = document.querySelector('.profile-menu');
    const settingsBtn = document.querySelector('.settings-btn');
    const settingsPanel = document.querySelector('.settings-panel');
    const closeSettings = document.querySelector('.close-settings');
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const modeBtns = document.querySelectorAll('.mode-btn');
    const modelBtns = document.querySelectorAll('.model-btn');
    const exportBtn = document.getElementById('export-btn');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    const conversationsList = document.querySelector('.conversations-list');
    const themeOptions = document.querySelectorAll('.theme-option');
    const userNameDisplay = document.querySelector('.user-name');
    const userEmailDisplay = document.querySelector('.user-email');
    const logoutBtn = document.querySelector('.profile-options [href="#"]:last-child span');
    const mainHistoryBtn = document.querySelector('.history-btn');
    const profileMenuHistoryBtn = document.querySelector('.profile-options .history-btn');
    const historyModal = document.querySelector('.history-modal');
    
    // Opsiyonel elementler (mevcut olmayabilir)
    const attachBtn = document.getElementById('attach-btn'); // Dosya yükleme butonu
    const fileModal = document.getElementById('file-modal'); // Dosya yükleme modalı
    const closeModals = document.querySelectorAll('.close-modal'); // Modal kapatma butonları

    // Yeni DOM elementleri
    const profilePreferencesBtn = document.querySelector('.profile-options .preferences-btn');
    const mainPreferencesBtn = document.querySelector('.settings-btn');

    // Uygulama durumu
    let currentTheme = 'purple';
    let darkMode = true;
    let currentMode = 'normal';
    let currentModel = 'turnaV1'; // Varsayılan model
    let isRecording = false;
    let isAuthenticated = false;
    let currentUser = null;

    // Konuşma geçmişi
    let conversations = [];
    let currentConversation = {
        id: null,
        title: "Yeni Sohbet",
        messages: []
    };

    // Toast bildirimi göster
    function showToast(message, type = 'info') {
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
        closeBtn.addEventListener('click', function () {
            toast.remove();
        });

        // Otomatik kapat
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // Model seçimi için event listener'lar
    modelBtns.forEach(button => {
        button.addEventListener('click', function () {
            // Aktif sınıfını kaldır
            modelBtns.forEach(btn => btn.classList.remove('active'));

            // Tıklanan butona aktif sınıfı ekle
            this.classList.add('active');

            // Seçilen modeli güncelle
            currentModel = this.getAttribute('data-model');

            // Toast bildirimi göster
            const modelName = currentModel === 'turnaV1' ? 'TurnaV1' : 'Gemini';
            showToast(`Model "${modelName}" olarak değiştirildi`, 'info');

            console.log('Seçilen model:', currentModel);
        });
    });

    // Kullanıcı kimlik doğrulama durumunu kontrol et
    async function checkAuthStatus() {
        try {
            const response = await fetch('/api/user');

            if (response.ok) {
                const data = await response.json();
                currentUser = data.user;
                isAuthenticated = true;

                // Kullanıcı bilgilerini güncelle
                updateUserInfo(currentUser);

                // Sohbetleri yükle
                loadConversationsFromDB();

                return true;
            } else {
                isAuthenticated = false;
                currentUser = null;
                return false;
            }
        } catch (error) {
            console.error('Kimlik doğrulama kontrolü hatası:', error);
            isAuthenticated = false;
            currentUser = null;
            return false;
        }
    }

    // Kullanıcı bilgilerini güncelle
    function updateUserInfo(user) {
        if (userNameDisplay) {
            userNameDisplay.textContent = user.name;
        }

        if (userEmailDisplay) {
            userEmailDisplay.textContent = user.email;
        }

        // Profil menüsündeki kullanıcı adını da güncelle
        const userNameLarge = document.querySelector('.user-name-large');
        if (userNameLarge) {
            userNameLarge.textContent = user.name;
        }

        const userEmailElement = document.querySelector('.user-email');
        if (userEmailElement) {
            userEmailElement.textContent = user.email;
        }
    }

    // Kullanıcı girişi
    async function login(email, password) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                currentUser = data.user;
                isAuthenticated = true;

                // Kullanıcı bilgilerini güncelle
                updateUserInfo(currentUser);

                // Sohbetleri yükle
                loadConversationsFromDB();

                showToast('Giriş başarılı!', 'success');
                return true;
            } else {
                showToast(data.error || 'Giriş başarısız', 'error');
                return false;
            }
        } catch (error) {
            console.error('Giriş hatası:', error);
            showToast('Bağlantı hatası. Lütfen tekrar deneyin.', 'error');
            return false;
        }
    }

    // Kullanıcı kaydı
    async function register(name, email, password) {
        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                currentUser = data.user;
                isAuthenticated = true;

                // Kullanıcı bilgilerini güncelle
                updateUserInfo(currentUser);

                showToast('Kayıt başarılı!', 'success');
                return true;
            } else {
                showToast(data.error || 'Kayıt başarısız', 'error');
                return false;
            }
        } catch (error) {
            console.error('Kayıt hatası:', error);
            showToast('Bağlantı hatası. Lütfen tekrar deneyin.', 'error');
            return false;
        }
    }

    // Çıkış yap
    async function logout() {
        try {
            const response = await fetch('/api/logout', {
                method: 'POST'
            });

            if (response.ok) {
                currentUser = null;
                isAuthenticated = false;

                // Sayfayı yenile (giriş sayfasına dönmek için)
                window.location.reload();

                return true;
            } else {
                showToast('Çıkış yapılamadı', 'error');
                return false;
            }
        } catch (error) {
            console.error('Çıkış hatası:', error);
            showToast('Bağlantı hatası. Lütfen tekrar deneyin.', 'error');
            return false;
        }
    }

    // Veritabanından sohbetleri yükle
    async function loadConversationsFromDB() {
        try {
            const response = await fetch('/api/conversations');
            const data = await response.json();

            if (response.ok) {
                // Mevcut sohbetleri temizle ve sunucudan gelen verileri yükle
                conversations = [];
                conversationsList.innerHTML = '';

                if (data.conversations && data.conversations.length > 0) {
                    data.conversations.forEach(conv => {
                        conversations.push({
                            id: conv.id,
                            title: conv.title,
                            messages: []
                        });

                        addConversationToSidebar({
                            id: conv.id,
                            title: conv.title,
                            messages: []
                        });
                    });

                    // İlk sohbeti seç
                    if (conversations.length > 0) {
                        loadConversation(conversations[0].id);
                    }
                } else {
                    // Hiç sohbet yoksa yeni bir tane başlat
                    createNewConversation();
                }
            } else {
                showToast(data.error || 'Sohbetler yüklenirken bir hata oluştu', 'error');
            }
        } catch (error) {
            console.error('Sohbetleri yükleme hatası:', error);
            showToast('Sunucu bağlantısı hatası', 'error');
        }
    }

    // Seçili sohbetteki mesajları yükle
    async function loadMessages(conversationId) {
        try {
            const response = await fetch(`/api/messages/${conversationId}`);
            const data = await response.json();

            if (response.ok) {
                chatMessages.innerHTML = '';

                // Bulunan sohbeti currentConversation olarak ayarla
                const selectedConv = conversations.find(c => c.id === conversationId);
                if (selectedConv) {
                    currentConversation = {
                        id: selectedConv.id,
                        title: selectedConv.title,
                        messages: []
                    };

                    // Başlığı güncelle
                    document.querySelector('.conversation-title').textContent = selectedConv.title;
                }

                // Mesajları ekle
                if (data.messages && data.messages.length > 0) {
                    data.messages.forEach(msg => {
                        const messageObj = {
                            text: msg.content,
                            isUser: msg.is_user,
                            timestamp: new Date(msg.created_at)
                        };

                        // Mesajı ekrana ekle
                        addMessage(messageObj.text, messageObj.isUser, false);

                        // Mesajı yerel diziye ekle
                        currentConversation.messages.push(messageObj);
                    });

                    // Kod kopyalama butonlarını etkinleştir
                    setupCodeCopyButtons();

                    // Öneri çiplerini gizle
                    document.querySelector('.suggestion-chips').style.display = 'none';
                } else {
                    // Mesaj yoksa öneri çiplerini göster
                    document.querySelector('.suggestion-chips').style.display = 'flex';
                }

                // Aktif sohbet öğesini güncelle
                updateActiveSidebar(conversationId);

                // Aşağı kaydır
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } else {
                showToast(data.error || 'Mesajlar yüklenirken bir hata oluştu', 'error');
            }
        } catch (error) {
            console.error('Mesajları yükleme hatası:', error);
            showToast('Sunucu bağlantısı hatası', 'error');
        }
    }

    // Sohbeti yükle
    async function loadConversation(conversationId) {
        if (conversationId) {
            await loadMessages(conversationId);
            // Sohbet yüklendi event'ini tetikle
            document.dispatchEvent(new Event('conversationLoaded'));
        }
    }

    // Yeni sohbet oluştur ve veritabanına kaydet
    async function createNewConversation() {
        // Misafir modunda sadece localde yeni bir sohbet oluştur
        if (sessionStorage.getItem('isGuestMode') === 'true') {
            const newConversation = {
                id: 'guest-' + Date.now(),
                title: 'Misafir Sohbeti',
                messages: []
            };
            conversations.push(newConversation);
            addConversationToSidebar(newConversation);
            currentConversation = {
                id: newConversation.id,
                title: newConversation.title,
                messages: []
            };
            resetChatArea();
            updateGuestConversationTitle();
            updateActiveSidebar(newConversation.id);

            // Çıkış butonunu güncelle
            const logoutBtn = document.querySelector('.profile-options [href="#"]:last-child span');
            if (logoutBtn) {
                logoutBtn.textContent = 'Giriş Yap';
            }

            return newConversation.id;
        }
        // Normal kullanıcı için API'ye istek at
        try {
            const response = await fetch('/api/conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: "Yeni Sohbet" })
            });

            const data = await response.json();

            if (response.ok) {
                const newConversation = {
                    id: data.conversation.id,
                    title: data.conversation.title,
                    messages: []
                };

                conversations.push(newConversation);
                addConversationToSidebar(newConversation);
                currentConversation = {
                    id: newConversation.id,
                    title: newConversation.title,
                    messages: []
                };

                resetChatArea();
                document.querySelector('.conversation-title').textContent = newConversation.title;
                updateActiveSidebar(newConversation.id);

                // Yeni sohbet oluşturuldu event'ini tetikle
                document.dispatchEvent(new Event('conversationCreated'));

                return newConversation.id;
            } else {
                showToast(data.error || 'Sohbet oluşturulurken bir hata oluştu', 'error');
                return null;
            }
        } catch (error) {
            console.error('Sohbet oluşturma hatası:', error);
            showToast('Sunucu bağlantısı hatası', 'error');
            return null;
        }
    }

    // Sohbeti sil
    async function deleteConversation(conversationId) {
        try {
            const response = await fetch(`/api/conversations/${conversationId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                // Sohbeti diziden kaldır
                const index = conversations.findIndex(c => c.id === conversationId);
                if (index >= 0) {
                    conversations.splice(index, 1);
                }

                // Sidebar'dan sohbet öğesini kaldır
                const conversationItem = document.querySelector(`.conversation-item[data-id="${conversationId}"]`);
                if (conversationItem) {
                    conversationItem.remove();
                }

                // Eğer başka sohbetler varsa ilkini seç, yoksa yeni sohbet oluştur
                if (conversations.length > 0) {
                    loadConversation(conversations[0].id);
                } else {
                    createNewConversation();
                }

                // Sohbet silindi event'ini tetikle
                document.dispatchEvent(new Event('conversationDeleted'));

                showToast('Sohbet silindi', 'info');
                return true;
            } else {
                showToast(data.error || 'Sohbet silinirken bir hata oluştu', 'error');
                return false;
            }
        } catch (error) {
            console.error('Sohbet silme hatası:', error);
            showToast('Sunucu bağlantısı hatası', 'error');
            return false;
        }
    }

    // Sohbet başlığını güncelle
    async function updateConversationTitle(conversationId, title) {
        try {
            const response = await fetch(`/api/conversations/${conversationId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title })
            });

            const data = await response.json();

            if (response.ok) {
                // Yerel olarak sohbet başlığını güncelle
                const conversation = conversations.find(c => c.id === conversationId);
                if (conversation) {
                    conversation.title = title;
                }

                if (currentConversation.id === conversationId) {
                    currentConversation.title = title;
                    document.querySelector('.conversation-title').textContent = title;
                }

                // Sidebar'daki başlığı güncelle
                const conversationItem = document.querySelector(`.conversation-item[data-id="${conversationId}"] span`);
                if (conversationItem) {
                    conversationItem.textContent = title;
                }

                return true;
            } else {
                showToast(data.error || 'Başlık güncellenirken bir hata oluştu', 'error');
                return false;
            }
        } catch (error) {
            console.error('Başlık güncelleme hatası:', error);
            showToast('Sunucu bağlantısı hatası', 'error');
            return false;
        }
    }

    // Tema değiştirme işlevi
    function applyTheme(theme) {
        console.log("Old applyTheme in script.js called - using global toggleTheme instead");
        // Global toggleTheme fonksiyonunu kullan
        if (window.toggleTheme) {
            window.toggleTheme(theme);
        } else {
            console.error("toggleTheme function not found");
        }
    }

    // Tema seçenekleri için event listener'lar
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', function() {
            // Bu işlevi kaldır, tema.js ve settings.js üzerinden yönetiliyor
            console.log("Theme option click handled in script.js - should be handled by settings.js or theme.js");
        });
    });

    // Uygulama başladığında ayarları senkronize et
    document.addEventListener('DOMContentLoaded', function() {
        setupSettingsSync();
    });

    // Geçmiş butonlarını senkronize et
    if (profileMenuHistoryBtn && mainHistoryBtn) {
        profileMenuHistoryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const historyModal = document.querySelector('.history-modal');
            if (historyModal) {
                historyModal.classList.add('show');
                profileMenu.classList.remove('show'); // Profil menüsünü kapat
            }
        });

        mainHistoryBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const historyModal = document.querySelector('.history-modal');
            if (historyModal) {
                historyModal.classList.add('show');
            }
        });
    }

    // Kullanıcı profil menüsü için event listener
    if (userProfile && profileMenu) {
        userProfile.addEventListener('click', function(e) {
            e.stopPropagation();
            profileMenu.classList.toggle('show');
        });

        // Dışarı tıklandığında menüyü kapat
        document.addEventListener('click', function(e) {
            if (!profileMenu.contains(e.target) && !userProfile.contains(e.target)) {
                profileMenu.classList.remove('show');
            }
        });
    }

    // Çıkış butonuna tıklama işlevi
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function (e) {
            e.preventDefault();
            logout();
        });
    }

    // Sayfa herhangi bir yerine tıklandığında profil menüsünü kapat
    document.addEventListener('click', function (event) {
        if (profileMenu.classList.contains('show')) {
            profileMenu.classList.remove('show');
        }

        // Eğer ayarlar paneli açıksa ve dışına tıklanırsa kapat
        if (settingsPanel.classList.contains('show') &&
            !settingsPanel.contains(event.target) &&
            !settingsBtn.contains(event.target) &&
            !profilePreferencesBtn.contains(event.target)) {
            settingsPanel.classList.remove('show');
        }
    });

    // Profil menüsünün içine tıklandığında kapanmasını engelle
    profileMenu.addEventListener('click', function (e) {
        e.stopPropagation();
    });

    // Modalları aç/kapat
    if (attachBtn && fileModal) {
        attachBtn.addEventListener('click', function () {
            fileModal.classList.add('show');
        });
    }

    if (closeModals && closeModals.length > 0) {
        closeModals.forEach(closeBtn => {
            closeBtn.addEventListener('click', function () {
                // Bu butonun en yakın modal parent'ını bul ve gizle
                const modal = this.closest('.modal');
                if (modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }

    // Modlar arası geçiş
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const mode = this.getAttribute('data-mode');

            // Aktif mod butonunu güncelle
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Modu güncelle
            currentMode = mode;

            // Toast bildirimi göster
            showToast(window.t ? window.t('modeChanged') + ': ' + window.t(mode) :
                `Mod "${mode}" olarak değiştirildi`, 'info');
                
            console.log('Mod değiştirildi:', mode); // Debug log
        });
    });

    // Öneri çiplerine tıklama olayı
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Çip değerini metin kutusuna ekle
            userInput.value = this.textContent;
            // Metin kutusuna odaklan
            userInput.focus();
        });
    });

    // Sohbeti dışa aktar
    exportBtn.addEventListener('click', function () {
        if (currentConversation.messages.length === 0) {
            showToast(window.t ? window.t('noConversationToExport') :
                'Dışa aktarılacak sohbet bulunamadı', 'warning');
            return;
        }

        // Sohbeti dışa aktar
        const exportData = {
            title: currentConversation.title,
            date: new Date().toISOString(),
            messages: currentConversation.messages
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileName = `turna-chat-${new Date().toISOString().slice(0, 10)}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileName);
        linkElement.click();

        showToast(window.t ? window.t('conversationExported') :
            'Sohbet başarıyla dışa aktarıldı', 'success');
    });

    // Sohbet alanını sıfırla
    function resetChatArea() {
        // Sohbet alanını temizle - Çeviri desteğiyle karşılama mesajı
        const welcomeMsg = window.t ? window.t('welcome') : 'Turna AI Chat\'e hoş geldiniz! Size nasıl yardımcı olabilirim?';
        const capabilitiesMsg = window.t ? window.t('capabilities') : 'İşte yapabileceğim bazı şeyler:';
        const capability1Msg = window.t ? window.t('capability1') : 'Sorularınızı yanıtlayabilirim';
        const capability2Msg = window.t ? window.t('capability2') : 'Yaratıcı içerik oluşturabilirim';
        const capability3Msg = window.t ? window.t('capability3') : 'Metinleri düzenleyebilirim';
        const capability4Msg = window.t ? window.t('capability4') : 'Kodlama yardımı sunabilirim';
        // resetChatArea devamı
        const copyMsg = window.t ? window.t('copy') : 'Kopyala';
        const likeMsg = window.t ? window.t('like') : 'Beğen';
        const dislikeMsg = window.t ? window.t('dislike') : 'Beğenme';
        chatMessages.innerHTML = `
        <div class="message bot">
            <div class="message-content">
                <p>${welcomeMsg}</p>
                <p>${capabilitiesMsg}</p>
                <ul>
                    <li>${capability1Msg}</li>
                    <li>${capability2Msg}</li>
                    <li>${capability3Msg}</li>
                    <li>${capability4Msg}</li>
                </ul>
            </div>
            <div class="message-actions">
                <button class="copy-btn" title="${copyMsg}"><i class="fas fa-copy"></i></button>
                <button class="thumbs-up-btn" title="${likeMsg}"><i class="fas fa-thumbs-up"></i></button>
                <button class="thumbs-down-btn" title="${dislikeMsg}"><i class="fas fa-thumbs-down"></i></button>
            </div>
        </div>
        `;

        // Öneri çiplerini göster
        document.querySelector('.suggestion-chips').style.display = 'flex';

        // Kod kopyalama butonlarını etkinleştir
        setupCodeCopyButtons();
    }

    // Yeni sohbet başlat
    newChatButton.addEventListener('click', async function () {
        // Yeni sohbet oluştur
        await createNewConversation();
    });

    // Yan menüye sohbet ekle
    function addConversationToSidebar(conversation) {
        const conversationItem = document.createElement('div');
        conversationItem.className = 'conversation-item';
        conversationItem.dataset.id = conversation.id;
        conversationItem.innerHTML = `
            <i class="fas fa-comment-dots"></i>
            <span>${conversation.title}</span>
            <button class="delete-conversation"><i class="fas fa-times"></i></button>
        `;

        // Sohbete tıklama işlevi ekle
        conversationItem.addEventListener('click', function (e) {
            if (e.target.closest('.delete-conversation')) {
                return; // Silme butonuna tıklandıysa işlemi engelle
            }

            // Sohbeti yükle
            const id = this.dataset.id;
            loadConversation(id);

            // Mobil görünümde sidebar'ı kapat
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('show');
            }
        });

        // Silme butonuna tıklama işlevi ekle
        const deleteBtn = conversationItem.querySelector('.delete-conversation');
        deleteBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const id = conversationItem.dataset.id;
            deleteConversation(id);
        });

        conversationsList.insertBefore(conversationItem, conversationsList.firstChild);
    }

    // Aktif sohbeti sidebar'da güncelle
    function updateActiveSidebar(conversationId) {
        document.querySelectorAll('.conversation-item').forEach(item => {
            if (item.dataset.id === conversationId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Mesajı sohbete ekle
    function addMessage(text, isUser = false, saveToHistory = true) {
        // Misafir modunda ve kullanıcı mesajıysa ve ilk mesajsa, ekranı temizle
        if (sessionStorage.getItem('isGuestMode') === 'true' && isUser) {
            // Sadece bir tane mesaj varsa (bu ilk mesaj olacak)
            if (chatMessages.querySelectorAll('.message').length === 0) {
                // Ekranı temizle
                chatMessages.innerHTML = '';
            }
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;

        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        // Markdown benzeri formatlamalar
        text = formatMessageText(text);
        messageContent.innerHTML = text;

        messageDiv.appendChild(messageContent);

        // Bot mesajları için eylem butonları ekle
        if (!isUser) {
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'message-actions';

            const copyTitle = window.t ? window.t('copy') : 'Kopyala';
            const likeTitle = window.t ? window.t('like') : 'Beğen';
            const dislikeTitle = window.t ? window.t('dislike') : 'Beğenme';

            actionsDiv.innerHTML = `
                <button class="copy-btn" title="${copyTitle}"><i class="fas fa-copy"></i></button>
                <button class="thumbs-up-btn" title="${likeTitle}"><i class="fas fa-thumbs-up"></i></button>
                <button class="thumbs-down-btn" title="${dislikeTitle}"><i class="fas fa-thumbs-down"></i></button>
            `;

            // Kopyalama işlevi
            const copyBtn = actionsDiv.querySelector('.copy-btn');
            copyBtn.addEventListener('click', function () {
                navigator.clipboard.writeText(text.replace(/<[^>]*>/g, ''))
                    .then(() => {
                        showToast(window.t ? window.t('messageCopied') : 'Mesaj panoya kopyalandı', 'success');
                    })
                    .catch(err => {
                        console.error('Kopyalama hatası:', err);
                        showToast(window.t ? window.t('copyFailed') : 'Kopyalama başarısız oldu', 'error');
                    });
            });

            // Beğen/beğenme butonları
            const thumbsUpBtn = actionsDiv.querySelector('.thumbs-up-btn');
            const thumbsDownBtn = actionsDiv.querySelector('.thumbs-down-btn');

            thumbsUpBtn.addEventListener('click', function () {
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                } else {
                    this.classList.add('active');
                    thumbsDownBtn.classList.remove('active');
                    showToast(window.t ? window.t('feedbackReceived') : 'Teşekkürler! Geri bildiriminiz alındı.', 'success');
                }
            });

            thumbsDownBtn.addEventListener('click', function () {
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                } else {
                    this.classList.add('active');
                    thumbsUpBtn.classList.remove('active');

                    // Geri bildirim modalını göster
                    document.getElementById('feedback-modal').classList.add('show');
                }
            });

            messageDiv.appendChild(actionsDiv);
        }

        chatMessages.appendChild(messageDiv);

        // Mesajı kaydet
        if (saveToHistory) {
            currentConversation.messages.push({
                text,
                isUser,
                timestamp: new Date()
            });
            // Sohbet başlığını her mesajda güncelle
            if (sessionStorage.getItem('isGuestMode') === 'true') {
                updateGuestConversationTitle();
            } else if (isUser && currentConversation.messages.filter(msg => msg.isUser).length === 1) {
                // Sadece düz metin olarak başlık güncelle
                const title = text.replace(/<[^>]*>/g, '').substring(0, 20) + (text.replace(/<[^>]*>/g, '').length > 20 ? '...' : '');
                document.querySelector('.conversation-title').textContent = title;
                currentConversation.title = title;
                if (currentConversation.id) {
                    updateConversationTitle(currentConversation.id, title);
                }
                const conversationItem = document.querySelector(`.conversation-item[data-id="${currentConversation.id}"] span`);
                if (conversationItem) {
                    conversationItem.textContent = title;
                }
            }
        }

        // Aşağı kaydır
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Öneri çiplerini gizle, mesaj gönderdikten sonra
        document.querySelector('.suggestion-chips').style.display = 'none';

        return messageDiv;
    }

    // Mesaj metni formatlama
    function formatMessageText(text) {
        // Kod bloklarını işle
        text = text.replace(/```([\s\S]*?)```/g, function (match, code) {
            // Dil tespiti yap (ilk satırda varsa)
            let language = '';
            const firstLine = code.trim().split('\n')[0];
            if (firstLine && !firstLine.includes(' ')) {
                language = firstLine;
                code = code.substring(firstLine.length).trim();
            }

            const copyBtnText = window.t ? window.t('copy') : 'Kopyala';

            return `
                <div class="code-block">
                    ${language ? `<div class="code-language">${language}</div>` : ''}
                    <button class="code-copy-btn">${copyBtnText}</button>
                    <pre><code>${escapeHtml(code)}</code></pre>
                </div>
            `;
        });

        // Satır içi kod işle
        text = text.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Bağlantıları işle
        text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');

        // Kalın metin
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // İtalik metin
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');

        // Madde işaretleri
        text = text.replace(/^- (.*?)$/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*?<\/li>)+/g, '<ul>$&</ul>');

        // Numaralı listeler
        text = text.replace(/^\d+\. (.*?)$/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*?<\/li>)+/g, function (match) {
            if (!match.includes('<ul>')) {
                return '<ol>' + match + '</ol>';
            }
            return match;
        });

        // Paragraflar
        text = text.replace(/(.+?)(\n\n|$)/g, function (match, p1) {
            if (!p1.startsWith('<') || (p1.startsWith('<') && !p1.includes('</')) || p1.startsWith('<img')) {
                return '<p>' + p1 + '</p>';
            }
            return p1;
        });

        return text;
    }

    // HTML karakterlerini escape et
    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Yükleniyor göstergesi
    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.id = 'loading-indicator';

        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'loading-dot';
            loadingDiv.appendChild(dot);
        }

        chatMessages.appendChild(loadingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Yükleniyor göstergesini kaldır
    function hideLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loadingIndicator) {
            loadingIndicator.remove();
        }
    }

    // Hata mesajı göster
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'message bot error-message';

        const errorContent = document.createElement('div');
        errorContent.className = 'message-content';
        errorContent.textContent = message;

        errorDiv.appendChild(errorContent);
        chatMessages.appendChild(errorDiv);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Temizle butonuna basıldığında girdi alanını temizle
    if (clearButton) {
        clearButton.addEventListener('click', function () {
            userInput.value = '';
            userInput.focus();
        });
    }

    // Mesajı API'ye gönder
    async function sendMessage() {
        const message = userInput.value.trim();

        if (!message) {
            return;
        }

        // Gönder butonunu devre dışı bırak
        const sendButton = document.getElementById('send-button');
        if (sendButton) {
            sendButton.disabled = true;
            sendButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }

        // Misafir kullanıcı için mesaj limiti kontrolü
        if (!isAuthenticated) {
            const remainingMessages = parseInt(sessionStorage.getItem('guestRemainingMessages') || '5');
            
            if (remainingMessages <= 0) {
                showToast('Mesaj limitine ulaştınız. Lütfen giriş yapın.', 'warning');
                const loginModal = document.querySelector('.auth-modal');
                if (loginModal) {
                    loginModal.style.display = 'flex';
                }
                // Gönder butonunu aktif et
                if (sendButton) {
                    sendButton.disabled = false;
                    sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
                }
                return;
            }
            
            // Mesaj sayacını azalt ve kaydet
            const newRemainingMessages = remainingMessages - 1;
            sessionStorage.setItem('guestRemainingMessages', newRemainingMessages.toString());
            updateRemainingMessagesDisplay();

            // Son mesaj hakkını kullandıysa uyarı göster
            if (newRemainingMessages === 0) {
                setTimeout(() => {
                    showToast('Son mesaj hakkınızı kullandınız. Devam etmek için giriş yapmanız gerekiyor.', 'warning');
                    const loginModal = document.querySelector('.auth-modal');
                    if (loginModal) {
                        loginModal.style.display = 'flex';
                    }
                }, 1000);
            }
        }

        // Kullanıcı mesajını sohbete ekle
        addMessage(message, true);

        // Girdiyi temizle
        userInput.value = '';

        // Yükleniyor göstergesini göster
        showLoading();

        try {
            // API'ye istek gönder
            let endpoint = '/api/generate';
            let requestBody = {
                prompt: message,
                mode: currentMode,
                model: currentModel
            };

            if (isAuthenticated && currentConversation.id) {
                endpoint = '/api/messages';
                requestBody.conversation_id = currentConversation.id;
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            hideLoading();

            if (response.ok) {
                // AI yanıtını ekle
                addMessage(data.response);
                document.dispatchEvent(new Event('messageReceived'));
                setupCodeCopyButtons();
            } else {
                if (response.status === 401) {
                    showToast('Oturum süresi doldu. Lütfen tekrar giriş yapın.', 'error');
                    const loginModal = document.querySelector('.auth-modal');
                    if (loginModal) {
                        loginModal.style.display = 'flex';
                    }
                    return;
                }
                const errorMsg = window.t ? window.t('error') : 'Bir hata oluştu. Lütfen tekrar deneyin.';
                showError(data.error || errorMsg);
            }
        } catch (error) {
            hideLoading();
            const networkErrorMsg = window.t ? window.t('networkError') : 'Ağ hatası. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.';
            showError(networkErrorMsg);
            console.error('Error:', error);
        } finally {
            // İşlem tamamlandığında gönder butonunu aktif et
            if (sendButton) {
                sendButton.disabled = false;
                sendButton.innerHTML = '<i class="fas fa-paper-plane"></i>';
            }
        }
    }

    // Kod kopyalama butonlarını etkinleştir
    function setupCodeCopyButtons() {
        document.querySelectorAll('.code-copy-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const codeBlock = this.nextElementSibling;
                const code = codeBlock.textContent;

                navigator.clipboard.writeText(code)
                    .then(() => {
                        // Butonu geçici olarak değiştir
                        const originalText = this.textContent;
                        const copiedText = window.t ? window.t('copied') : 'Kopyalandı!';
                        this.textContent = copiedText;
                        this.style.backgroundColor = 'var(--success-green)';

                        setTimeout(() => {
                            this.textContent = originalText;
                            this.style.backgroundColor = '';
                        }, 2000);
                    })
                    .catch(err => {
                        console.error('Kopyalama hatası:', err);
                        const copyFailedMsg = window.t ? window.t('copyFailed') : 'Kopyalama başarısız oldu';
                        showToast(copyFailedMsg, 'error');
                    });
            });
        });
    }

    // Yıldız derecelendirme sistemi
    document.querySelectorAll('.star-rating i').forEach(star => {
        star.addEventListener('click', function () {
            const rating = this.dataset.rating;

            // Tüm yıldızları sıfırla
            document.querySelectorAll('.star-rating i').forEach(s => {
                s.className = 'far fa-star';
            });

            // Seçilen yıldıza kadar doldur
            for (let i = 1; i <= rating; i++) {
                document.querySelector(`.star-rating i[data-rating="${i}"]`).className = 'fas fa-star';
            }
        });
    });

    // Geri bildirim gönder
    const submitFeedbackBtn = document.querySelector('.submit-feedback-btn');
    if (submitFeedbackBtn) {
        submitFeedbackBtn.addEventListener('click', function () {
            // Burada gerçek bir uygulamada sunucuya geri bildirim gönderilirdi
            document.getElementById('feedback-modal').classList.remove('show');
            const thankYouMsg = window.t ? window.t('feedbackThanks') : 'Geri bildiriminiz için teşekkürler!';
            showToast(thankYouMsg, 'success');
        });
    }

    // Uygulamayı başlat
    function initializeApp() {
        console.log('Uygulama başlatılıyor...');

        // Kullanıcı kimlik doğrulama durumunu kontrol et
        checkAuthStatus().then(authResult => {
            // Eğer misafir modunda ise veya kimlik doğrulama başarılıysa, UI'ı güncelle
            if (authResult || sessionStorage.getItem('isGuestMode') === 'true') {
                console.log('Kullanıcı oturumu açık veya misafir modu aktif, UI güncelleniyor...');
                // Sayfa yüklendiğinde önceki tema ayarlarını yükle
                loadThemeSettings();
                updateUITexts();

                // Varsayılan konuşma oluştur veya son konuşmaları getir
                if (isAuthenticated) {
                    loadConversationsFromDB();
                } else if (sessionStorage.getItem('isGuestMode') === 'true') {
                    // Misafir modunda yeni konuşma oluştur
                    createNewConversation();
                    // Misafir modu sayacını göster
                    updateRemainingMessagesDisplay();
                }

                // Sayfa yüklendiğinde girdi alanına odaklan
                userInput.focus();

                // Kod kopyalama butonlarını etkinleştir
                setupCodeCopyButtons();

                // Dil ve tema değişikliği için event listener'lar ekle
                document.addEventListener('languageChanged', function () {
                    // Arayüz elemanlarını güncelle
                    updateUITexts();
                });

                // Yükleme ekranını gizle
                setTimeout(() => {
                    document.getElementById('loading-overlay').style.display = 'none';
                }, 500);
            } else {
                // Giriş yapılmamışsa ve misafir modu aktif değilse, auth modalı göster
                if (typeof window.showAuthModal === 'function') {
                    window.showAuthModal();
                }
                // Yükleme ekranını gizle
                setTimeout(() => {
                    document.getElementById('loading-overlay').style.display = 'none';
                }, 500);
            }
        });

        setupSidebarToggle();
    }

    // Uygulama başlangıcı için sahte yükleme ekranı
    function showAppLoading() {
        const loadingScreen = document.createElement('div');
        loadingScreen.className = 'app-loading';

        const loadingText = window.t ? window.t('loading') : 'Turna AI yükleniyor...';

        loadingScreen.innerHTML = `
        <img src="/static/turna-logo.svg" alt="Turna AI" class="app-loading-logo">
        <div class="app-loading-spinner"></div>
        <div class="app-loading-text">${loadingText}</div>
    `;

        document.body.appendChild(loadingScreen);

        setTimeout(() => {
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.remove();
            }, 500);
        }, 1500);
    }

    // Arayüz metinlerini güncelleme (dil değişikliğinde çağrılır)
    function updateUITexts() {
        if (!window.t) return; // çeviri fonksiyonu yoksa çık

        // Konuşma başlığı 
        if (currentConversation.id === null) {
            document.querySelector('.conversation-title').textContent = window.t('newChat');
        }

        // Buton başlıkları
        if (sendButton) sendButton.title = window.t('send');
        if (clearButton) clearButton.title = window.t('clear');
        if (exportBtn) exportBtn.title = window.t('export');

        // Öneri çiplerini güncelle - bu kısım translations.js tarafından yönetiliyor
    }

    // Kullanıcı giriş formu işlevi
    function setupLoginForm() {
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;

                if (!email || !password) {
                    showToast('E-posta ve şifre gerekli', 'error');
                    return;
                }

                const loginButton = document.getElementById('login-btn');
                loginButton.disabled = true;
                loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Giriş yapılıyor...';

                const success = await login(email, password);

                if (success) {
                    // Ana sayfaya yönlendir
                    window.location.href = '/';
                } else {
                    loginButton.disabled = false;
                    loginButton.innerHTML = 'Giriş Yap';
                }
            });
        }
    }

    // Kullanıcı kayıt formu işlevi
    function setupRegisterForm() {
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', async function (e) {
                e.preventDefault();

                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password').value;

                if (!name || !email || !password) {
                    showToast('Tüm alanlar gerekli', 'error');
                    return;
                }

                if (password !== confirmPassword) {
                    showToast('Şifreler eşleşmiyor', 'error');
                    return;
                }

                const registerButton = document.getElementById('register-btn');
                registerButton.disabled = true;
                registerButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Kayıt olunuyor...';

                const success = await register(name, email, password);

                if (success) {
                    // Ana sayfaya yönlendir
                    window.location.href = '/';
                } else {
                    registerButton.disabled = false;
                    registerButton.innerHTML = 'Kayıt Ol';
                }
            });
        }
    }

    // Eğer sayfada giriş/kayıt formu varsa, onları ayarla
    setupLoginForm();
    setupRegisterForm();

    // Uygulama başladığında
    showAppLoading();
    initializeApp();

    // Kalan mesaj sayısını gösteren fonksiyon
    function updateRemainingMessagesDisplay() {
        // Eğer varsa eski mesaj sayacını kaldır
        const existingCounter = document.getElementById('guest-message-counter');
        if (existingCounter) {
            existingCounter.remove();
        }
        
        // Misafir modu kontrolü
        if (sessionStorage.getItem('isGuestMode') === 'true') {
            // Kalan mesaj sayısını al
            const remainingMessages = sessionStorage.getItem('guestRemainingMessages') || '5';
            
            // Sağ üst köşeye sayacı ekle
            const counter = document.createElement('div');
            counter.id = 'guest-message-counter';
            counter.className = 'guest-counter';
            counter.innerHTML = `${remainingMessages}`;
            counter.title = `Kalan mesaj hakkınız: ${remainingMessages}`;
            
            // CSS ekle
            counter.style.position = 'fixed';
            counter.style.top = '10px';
            counter.style.right = '80px';
            counter.style.backgroundColor = 'var(--primary-color)';
            counter.style.color = 'white';
            counter.style.padding = '5px 10px';
            counter.style.borderRadius = '20px';
            counter.style.fontSize = '14px';
            counter.style.zIndex = '1001';
            counter.style.display = 'flex';
            counter.style.alignItems = 'center';
            counter.style.justifyContent = 'center';
            counter.style.minWidth = '24px';
            counter.style.height = '24px';
            counter.style.cursor = 'help';
            counter.style.userSelect = 'none';
            
            document.body.appendChild(counter);

            // Gönder butonunu kontrol et
            const sendButton = document.getElementById('send-button');
            if (sendButton) {
                if (parseInt(remainingMessages) <= 0) {
                    sendButton.disabled = true;
                    sendButton.title = 'Mesaj hakkınız kalmadı';
                } else {
                    sendButton.disabled = false;
                    sendButton.title = 'Gönder';
                }
            }
        }
    }
    
    // Uygulama başlangıcında ve misafir girişi yapıldığında sayaç gösterilsin
    function initializeGuestMode() {
        if (sessionStorage.getItem('isGuestMode') === 'true') {
            updateRemainingMessagesDisplay();
            updateGuestConversationTitle();
            
            // Çıkış butonunu güncelle
            const logoutBtn = document.querySelector('.profile-options [href="#"]:last-child span');
            if (logoutBtn) {
                logoutBtn.textContent = 'Giriş Yap';
                
                // Parent elementi bul ve click event'ini güncelle
                const logoutLink = logoutBtn.closest('a');
                if (logoutLink) {
                    logoutLink.removeEventListener('click', logout);
                    logoutLink.addEventListener('click', function(e) {
                        e.preventDefault();
                        const loginModal = document.querySelector('.auth-modal');
                        if (loginModal) {
                            loginModal.style.display = 'flex';
                        }
                    });
                }
            }
        }
    }
    
    // Global erişim için fonksiyonları window objesine ekle
    window.updateRemainingMessagesDisplay = updateRemainingMessagesDisplay;
    window.updateGuestConversationTitle = updateGuestConversationTitle;
    
    // Sayfa yüklendiğinde misafir modu kontrolü yap
    document.addEventListener('DOMContentLoaded', function() {
        initializeGuestMode();
    });

    // Sohbet başlığını güncelleyen fonksiyon
    function updateGuestConversationTitle() {
        if (sessionStorage.getItem('isGuestMode') === 'true') {
            const remaining = sessionStorage.getItem('guestRemainingMessages') || '5';
            const titleEl = document.querySelector('.conversation-title');
            if (titleEl) {
                titleEl.textContent = `Misafir Sohbeti`;
            }

        }
    }

    // Enter tuşuyla mesaj gönderme
    if (userInput) {
        userInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }

    // Gönder butonuna tıklama ile mesaj gönderme
    if (sendButton) {
        sendButton.addEventListener('click', function() {
            sendMessage();
        });
    }

    // Bu fonksiyon tamamlandıktan sonra sendMessage fonksiyonunu global yap
    document.addEventListener('DOMContentLoaded', function() {
        window.sendMessage = sendMessage;
    });

    // Sohbet geçmişi işlevselliği
    function setupHistoryFunctionality() {
        // Sohbet geçmişi listesini güncelle
        function updateHistoryModal() {
            const historyList = document.querySelector('.history-list');
            if (!historyList || !conversations.length) return;

            // Geçmiş listesini temizle
            historyList.innerHTML = '';
            
            // Tüm sohbetleri göster
            conversations.forEach(conv => {
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                historyItem.dataset.id = conv.id;
                
                historyItem.innerHTML = `
                    <div class="history-item-header">
                        <h4>${conv.title}</h4>
                    </div>
                    <p class="history-preview">${conv.messages && conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].text.substring(0, 100) + '...' : 'Henüz mesaj yok'}</p>
                    <div class="history-actions">
                        <button class="history-continue"><i class="fas fa-play"></i> Devam Et</button>
                        <button class="history-delete"><i class="fas fa-trash"></i></button>
                    </div>
                `;

                // Tıklama olaylarını ekle
                const continueBtn = historyItem.querySelector('.history-continue');
                const deleteBtn = historyItem.querySelector('.history-delete');

                // Devam Et butonuna tıklama
                continueBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Event bubbling'i engelle
                    const conversationId = historyItem.dataset.id;
                    loadConversation(conversationId);
                    // Modalı kapat
                    const historyModal = document.querySelector('.history-modal');
                    if (historyModal) {
                        historyModal.classList.remove('show');
                        historyModal.style.visibility = 'hidden';
                    }
                });

                // Sil butonuna tıklama
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Event bubbling'i engelle
                    if (confirm('Bu sohbeti silmek istediğinizden emin misiniz?')) {
                        deleteConversation(conv.id);
                    }
                });

                // Tüm karta tıklama (Devam Et ile aynı işlev)
                historyItem.addEventListener('click', function() {
                    const conversationId = this.dataset.id;
                    loadConversation(conversationId);
                    // Modalı kapat
                    const historyModal = document.querySelector('.history-modal');
                    if (historyModal) {
                        historyModal.classList.remove('show');
                        historyModal.style.visibility = 'hidden';
                    }
                });

                historyList.appendChild(historyItem);
            });
        }

        // Event listener'ları ekle
        if (mainHistoryBtn) {
            mainHistoryBtn.addEventListener('click', function() {
                updateHistoryModal();
                if (historyModal) {
                    historyModal.classList.add('show');
                    historyModal.style.visibility = 'visible';
                }
            });
        }

        if (profileMenuHistoryBtn) {
            profileMenuHistoryBtn.addEventListener('click', function() {
                updateHistoryModal();
                if (historyModal) {
                    historyModal.classList.add('show');
                    historyModal.style.visibility = 'visible';
                }
                if (profileMenu) {
                    profileMenu.classList.remove('show');
                }
            });
        }

        // Sohbet listesi değişikliklerini dinle
        document.addEventListener('conversationLoaded', updateHistoryModal);
        document.addEventListener('conversationCreated', updateHistoryModal);
        document.addEventListener('conversationDeleted', updateHistoryModal);

        // Geçmiş modalı kapatma butonu
        const closeHistoryBtn = document.querySelector('.close-history');
        if (closeHistoryBtn && historyModal) {
            closeHistoryBtn.addEventListener('click', function() {
                historyModal.classList.remove('show');
                historyModal.style.visibility = 'hidden';
            });
        }

        // Geçmiş modalı dışına tıklama
        document.addEventListener('click', function(event) {
            if (historyModal && historyModal.classList.contains('show') &&
                !historyModal.contains(event.target) &&
                !mainHistoryBtn.contains(event.target) &&
                !profileMenuHistoryBtn.contains(event.target)) {
                historyModal.classList.remove('show');
                historyModal.style.visibility = 'hidden';
            }
        });

        // Arama işlevselliği
        const searchInput = document.querySelector('.history-search input');
        if (searchInput) {
            searchInput.addEventListener('input', function(e) {
                const searchTerm = e.target.value.toLowerCase();
                const historyItems = document.querySelectorAll('.history-item');
                
                historyItems.forEach(item => {
                    const title = item.querySelector('h4').textContent.toLowerCase();
                    const preview = item.querySelector('.history-preview').textContent.toLowerCase();
                    
                    if (title.includes(searchTerm) || preview.includes(searchTerm)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        }
    }

    // Geçmiş işlevselliğini başlat
    setupHistoryFunctionality();

    // Tema ayarlarını kaydet
    function saveThemeSettings(theme) {
        if (window.toggleTheme) {
            window.toggleTheme(theme);
        } else {
            console.error("toggleTheme function not found");
        }
    }

    // Sidebar toggle işlevi
    function setupSidebarToggle() {
        const sidebarToggleCheckbox = document.getElementById('sidebar-toggle-checkbox');
        const sidebar = document.querySelector('.sidebar');
        
        // Önceki durumu localStorage'dan al
        const sidebarState = localStorage.getItem('sidebarState');
        if (sidebarState === 'collapsed') {
            sidebar.classList.add('collapsed');
            if (sidebarToggleCheckbox) {
                sidebarToggleCheckbox.checked = true;
            }
        }
        
        // Menü toggle butonu (mobil görünüm için)
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', function() {
                sidebar.classList.toggle('show');
            });
        }
        
        // Dışarı tıklandığında mobil menüyü kapat
        document.addEventListener('click', function(e) {
            if (window.innerWidth <= 768 && 
                sidebar.classList.contains('show') && 
                !sidebar.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                sidebar.classList.remove('show');
            }
        });
        
        // Toggle checkbox değiştiğinde durumu kaydet
        if (sidebarToggleCheckbox) {
            sidebarToggleCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    localStorage.setItem('sidebarState', 'collapsed');
                } else {
                    localStorage.setItem('sidebarState', 'expanded');
                }
            });
        }
    }
});

// Toast bildirimi fonksiyonunu global yap
window.showToast = function (message, type = 'info') {
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
    closeBtn.addEventListener('click', function () {
        toast.remove();
    });

    // Otomatik kapat
    setTimeout(() => {
        toast.remove();
    }, 3000);
};