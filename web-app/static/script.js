document.addEventListener('DOMContentLoaded', function() {
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
    const attachBtn = document.getElementById('attach-btn');
    const fileModal = document.getElementById('file-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    const exportBtn = document.getElementById('export-btn');
    const micBtn = document.getElementById('mic-btn');
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    const conversationsList = document.querySelector('.conversations-list');
    const themeOptions = document.querySelectorAll('.theme-option');
    
    // Uygulama durumu
    let currentTheme = 'purple';
    let darkMode = true;
    let currentMode = 'normal';
    let isRecording = false;
    
    // Konuşma geçmişi
    let conversations = [];
    let currentConversation = {
        id: Date.now(),
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
        closeBtn.addEventListener('click', function() {
            toast.remove();
        });
        
        // Otomatik kapat
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
    
    // Tema değiştirme
    themeToggleBtn.addEventListener('click', function() {
        darkMode = !darkMode;
        if (darkMode) {
            document.body.classList.remove('theme-light');
            document.body.classList.add('theme-dark');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            
            // Tema seçimi butonlarını güncelle
            themeOptions.forEach(option => {
                if (option.dataset.theme === 'dark') {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
            
            // Toast bildirimi göster
            showToast(window.t ? window.t('themeChanged') + ': ' + window.t('dark') : 'Tema değiştirildi: Koyu', 'info');
            
            // Ayarları kaydet
            saveThemeSettings('dark');
        } else {
            document.body.classList.remove('theme-dark');
            document.body.classList.add('theme-light');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            
            // Tema seçimi butonlarını güncelle
            themeOptions.forEach(option => {
                if (option.dataset.theme === 'light') {
                    option.classList.add('active');
                } else {
                    option.classList.remove('active');
                }
            });
            
            // Toast bildirimi göster
            showToast(window.t ? window.t('themeChanged') + ': ' + window.t('light') : 'Tema değiştirildi: Açık', 'info');
            
            // Ayarları kaydet
            saveThemeSettings('light');
        }
    });
    
    // Tema ayarlarını kaydet
    function saveThemeSettings(theme) {
        try {
            const settings = JSON.parse(localStorage.getItem('turnaSettings')) || {};
            settings.theme = theme;
            localStorage.setItem('turnaSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('Tema ayarları kaydedilemedi:', error);
        }
    }
    
    // Tema ayarlarını yükle
    function loadThemeSettings() {
        try {
            const settings = JSON.parse(localStorage.getItem('turnaSettings')) || {};
            const theme = settings.theme || 'dark'; // varsayılan olarak koyu tema
            
            if (theme === 'light') {
                darkMode = false;
                document.body.classList.add('theme-light');
                document.body.classList.remove('theme-dark');
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
                
                // Tema seçimi butonlarını güncelle
                themeOptions.forEach(option => {
                    if (option.dataset.theme === 'light') {
                        option.classList.add('active');
                    } else {
                        option.classList.remove('active');
                    }
                });
            } else if (theme === 'purple') {
                darkMode = true;
                document.body.classList.add('theme-purple');
                document.body.classList.remove('theme-dark', 'theme-light');
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
                
                // Tema seçimi butonlarını güncelle
                themeOptions.forEach(option => {
                    if (option.dataset.theme === 'purple') {
                        option.classList.add('active');
                    } else {
                        option.classList.remove('active');
                    }
                });
            } else {
                // Koyu tema (varsayılan)
                darkMode = true;
                document.body.classList.add('theme-dark');
                document.body.classList.remove('theme-light');
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
                
                // Tema seçimi butonlarını güncelle
                themeOptions.forEach(option => {
                    if (option.dataset.theme === 'dark') {
                        option.classList.add('active');
                    } else {
                        option.classList.remove('active');
                    }
                });
            }
        } catch (error) {
            console.error('Tema ayarları yüklenemedi:', error);
        }
    }
    
    // Tema seçenekleri
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.dataset.theme;
            
            // Aktif tema butonunu güncelle
            themeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Tema değişikliğini uygula
            document.body.className = '';
            document.body.classList.add(`theme-${theme}`);
            currentTheme = theme;
            
            // Tema toggle butonunu güncelle
            if (theme === 'light') {
                darkMode = false;
                themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                darkMode = true;
                themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            }
            
            // Ayarları kaydet
            saveThemeSettings(theme);
            
            // Toast bildirimi göster
            showToast(window.t ? window.t('themeChanged') + ': ' + window.t(theme) : 
                      `Tema "${theme}" olarak değiştirildi`, 'success');
        });
    });
    
    // Mobil menü toggle
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('show');
    });
    
    // Mobil menü dışına tıklama ile kapatma
    document.addEventListener('click', function(e) {
        if (sidebar.classList.contains('show') && 
            !sidebar.contains(e.target) && 
            !menuToggle.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    });
    
    // Ayarlar panelini aç/kapat
    settingsBtn.addEventListener('click', function() {
        settingsPanel.classList.add('show');
    });
    
    closeSettings.addEventListener('click', function() {
        settingsPanel.classList.remove('show');
    });
    
    // Kullanıcı profil menüsünü aç/kapat
    userProfile.addEventListener('click', function(e) {
        e.stopPropagation();
        profileMenu.classList.toggle('show');
    });
    
    // Sayfa herhangi bir yerine tıklandığında profil menüsünü kapat
    document.addEventListener('click', function(event) {
        if (profileMenu.classList.contains('show')) {
            profileMenu.classList.remove('show');
        }
        
        // Eğer ayarlar paneli açıksa ve dışına tıklanırsa kapat
        if (settingsPanel.classList.contains('show') && 
            !settingsPanel.contains(event.target) && 
            !settingsBtn.contains(event.target)) {
            settingsPanel.classList.remove('show');
        }
    });
    
    // Profil menüsünün içine tıklandığında kapanmasını engelle
    profileMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });
    
    // Modalları aç/kapat
    attachBtn.addEventListener('click', function() {
        fileModal.classList.add('show');
    });
    
    closeModals.forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            // Bu butonun en yakın modal parent'ını bul ve gizle
            const modal = this.closest('.modal');
            modal.classList.remove('show');
        });
    });
    
    // Modlar arası geçiş
    modeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            
            // Aktif mod butonunu güncelle
            modeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Modu güncelle
            currentMode = mode;
            
            // Toast bildirimi göster
            showToast(window.t ? window.t('modeChanged') + ': ' + window.t(mode) : 
                      `Mod "${mode}" olarak değiştirildi`, 'info');
        });
    });
    
    // Öneri çipleri
    suggestionChips.forEach(chip => {
        chip.addEventListener('click', function() {
            const text = this.textContent;
            userInput.value = text;
            userInput.focus();
        });
    });
    
    // Mikrofon butonu
    micBtn.addEventListener('click', function() {
        if (isRecording) {
            // Kaydı durdur
            stopSpeechRecognition();
            micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            micBtn.style.color = '';
            isRecording = false;
        } else {
            // Kaydı başlat
            startSpeechRecognition();
            micBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
            micBtn.style.color = 'var(--danger-red)';
            isRecording = true;
        }
    });
    
    // Konuşma tanıma
    function startSpeechRecognition() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = true;
            recognition.lang = 'tr-TR'; // Dil seçimi
            
            recognition.onresult = function(event) {
                const result = event.results[0][0].transcript;
                userInput.value = result;
            };
            
            recognition.onerror = function(event) {
                console.error('Konuşma tanıma hatası:', event.error);
                stopSpeechRecognition();
                showToast('Ses tanıma başlatılamadı', 'error');
            };
            
            recognition.onend = function() {
                micBtn.innerHTML = '<i class="fas fa-microphone"></i>';
                micBtn.style.color = '';
                isRecording = false;
            };
            
            recognition.start();
            window.recognition = recognition;
        } else {
            showToast('Tarayıcınız ses tanımayı desteklemiyor', 'error');
        }
    }
    
    function stopSpeechRecognition() {
        if (window.recognition) {
            window.recognition.stop();
        }
    }
    
    // Sohbeti dışa aktar
    exportBtn.addEventListener('click', function() {
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
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileName = `turna-chat-${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileName);
        linkElement.click();
        
        showToast(window.t ? window.t('conversationExported') : 
                'Sohbet başarıyla dışa aktarıldı', 'success');
    });
    
    // Yeni sohbet başlat
    newChatButton.addEventListener('click', function() {
        // Mevcut sohbeti kaydet
        if (currentConversation.messages.length > 0) {
            conversations.push({...currentConversation});
            addConversationToSidebar(currentConversation);
        }
        
        // Sohbet alanını temizle - Çeviri desteğiyle karşılama mesajı
        const welcomeMsg = window.t ? window.t('welcome') : 'Turna AI Chat\'e hoş geldiniz! Size nasıl yardımcı olabilirim?';
        const capabilitiesMsg = window.t ? window.t('capabilities') : 'İşte yapabileceğim bazı şeyler:';
        const capability1Msg = window.t ? window.t('capability1') : 'Sorularınızı yanıtlayabilirim';
        const capability2Msg = window.t ? window.t('capability2') : 'Yaratıcı içerik oluşturabilirim';
        const capability3Msg = window.t ? window.t('capability3') : 'Metinleri düzenleyebilirim';
        const capability4Msg = window.t ? window.t('capability4') : 'Kodlama yardımı sunabilirim';
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
        
        // Yeni sohbet başlat
        currentConversation = {
            id: Date.now(),
            title: window.t ? window.t('newChat') : "Yeni Sohbet",
            messages: []
        };
        
        // Başlığı güncelle
        document.querySelector('.conversation-title').textContent = window.t ? window.t('newChat') : "Yeni Sohbet";
        
        // Aktif sohbeti güncelle
        updateActiveSidebar();
        
        // Öneri çiplerini göster
        document.querySelector('.suggestion-chips').style.display = 'flex';
        
        // Kod kopyalama butonlarını etkinleştir
        setupCodeCopyButtons();
    });
    
    // Yan menüye sohbet ekle
    function addConversationToSidebar(conversation) {
        // İlk mesajdan kısa bir başlık oluştur
        let title = window.t ? window.t('newChat') : "Yeni Sohbet";
        if (conversation.messages.length > 0) {
            const firstUserMsg = conversation.messages.find(msg => msg.isUser);
            if (firstUserMsg) {
                title = firstUserMsg.text.substring(0, 20) + (firstUserMsg.text.length > 20 ? "..." : "");
            }
        }
        
        const conversationItem = document.createElement('div');
        conversationItem.className = 'conversation-item';
        conversationItem.dataset.id = conversation.id;
        conversationItem.innerHTML = `
            <i class="fas fa-comment-dots"></i>
            <span>${title}</span>
            <button class="delete-conversation"><i class="fas fa-times"></i></button>
        `;
        
        // Sohbete tıklama işlevi ekle
        conversationItem.addEventListener('click', function(e) {
            if (e.target.closest('.delete-conversation')) {
                return; // Silme butonuna tıklandıysa işlemi engelle
            }
            
            // Sohbeti yükle
            const id = this.dataset.id;
            const selectedConv = conversations.find(c => c.id == id);
            
            if (selectedConv) {
                // Mevcut sohbeti kaydet
                if (currentConversation.messages.length > 0) {
                    const existingIndex = conversations.findIndex(c => c.id == currentConversation.id);
                    if (existingIndex >= 0) {
                        conversations[existingIndex] = {...currentConversation};
                    } else {
                        conversations.push({...currentConversation});
                    }
                }
                
                // Seçilen sohbeti yükle
                currentConversation = {...selectedConv};
                
                // Sohbet içeriğini göster
                renderConversation(currentConversation);
                
                // Başlığı güncelle
                document.querySelector('.conversation-title').textContent = selectedConv.title;
                
                // Öneri çiplerini gizle
                document.querySelector('.suggestion-chips').style.display = 'none';
            }
            
            // Aktif sohbeti işaretle
            document.querySelectorAll('.conversation-item').forEach(item => {
                item.classList.remove('active');
            });
            this.classList.add('active');
            
            // Mobil görünümde sidebar'ı kapat
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('show');
            }
        });
        
        // Silme butonuna tıklama işlevi ekle
        const deleteBtn = conversationItem.querySelector('.delete-conversation');
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = conversationItem.dataset.id;
            
            // Sohbeti diziden kaldır
            const index = conversations.findIndex(c => c.id == id);
            if (index >= 0) {
                conversations.splice(index, 1);
            }
            
            // DOM'dan kaldır
            conversationItem.remove();
            
            // Eğer aktif sohbet silindiyse yeni sohbet başlat
            if (currentConversation.id == id) {
                newChatButton.click();
            }
            
            showToast(window.t ? window.t('deleteConversation') : 'Sohbet silindi', 'info');
        });
        
        conversationsList.insertBefore(conversationItem, conversationsList.firstChild);
    }
    
    // Sohbeti ekrana yükle
    function renderConversation(conversation) {
        chatMessages.innerHTML = '';
        
        conversation.messages.forEach(msg => {
            if (msg.isUser) {
                addMessage(msg.text, true, false);
            } else {
                addMessage(msg.text, false, false);
            }
        });
        
        // Kod kopyalama butonlarını etkinleştir
        setupCodeCopyButtons();
    }
    
    // Aktif sohbeti sidebar'da güncelle
    function updateActiveSidebar() {
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // "Yeni Sohbet" elemanını aktif yap (veya uygun olanı)
        const firstItem = document.querySelector('.conversation-item');
        if (firstItem) {
            firstItem.classList.add('active');
        }
    }
    
    // Mesajı sohbete ekle
    function addMessage(text, isUser = false, saveToHistory = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user' : 'message bot';
        
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
            copyBtn.addEventListener('click', function() {
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
            
            thumbsUpBtn.addEventListener('click', function() {
                if (this.classList.contains('active')) {
                    this.classList.remove('active');
                } else {
                    this.classList.add('active');
                    thumbsDownBtn.classList.remove('active');
                    showToast(window.t ? window.t('feedbackReceived') : 'Teşekkürler! Geri bildiriminiz alındı.', 'success');
                }
            });
            
            thumbsDownBtn.addEventListener('click', function() {
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
            
            // Eğer bu ilk kullanıcı mesajıysa, sohbet başlığını güncelle
            if (isUser && currentConversation.messages.filter(msg => msg.isUser).length === 1) {
                const title = text.substring(0, 20) + (text.length > 20 ? "..." : "");
                document.querySelector('.conversation-title').textContent = title;
                currentConversation.title = title;
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
        text = text.replace(/```([\s\S]*?)```/g, function(match, code) {
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
        text = text.replace(/(<li>.*?<\/li>)+/g, function(match) {
            if (!match.includes('<ul>')) {
                return '<ol>' + match + '</ol>';
            }
            return match;
        });
        
        // Paragraflar
        text = text.replace(/(.+?)(\n\n|$)/g, function(match, p1) {
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
clearButton.addEventListener('click', function() {
    userInput.value = '';
    userInput.focus();
});

// Mesajı API'ye gönder
async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) {
        return;
    }
    
    // Kullanıcı mesajını sohbete ekle
    addMessage(message, true);
    
    // Girdiyi temizle
    userInput.value = '';
    
    // Yükleniyor göstergesini göster
    showLoading();
    
    try {
        // Seçilen moda göre sisteme farklı bir parametre gönder
        let promptPrefix = '';
        
        if (currentMode === 'creative') {
            promptPrefix = 'YARATICI MOD: ';
        } else if (currentMode === 'precise') {
            promptPrefix = 'KESİN MOD: ';
        }
        
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                prompt: promptPrefix + message,
                mode: currentMode 
            })
        });
        
        const data = await response.json();
        hideLoading();
        
        if (response.ok) {
            addMessage(data.response);
            
            // Mesaj alma olayını tetikle (ses bildirimleri için)
            document.dispatchEvent(new Event('messageReceived'));
            
            // Kod kopyalama butonlarını etkinleştir
            setupCodeCopyButtons();
        } else {
            const errorMsg = window.t ? window.t('error') : 'Bir hata oluştu. Lütfen tekrar deneyin.';
            showError(data.error || errorMsg);
        }
    } catch (error) {
        hideLoading();
        const networkErrorMsg = window.t ? window.t('networkError') : 'Ağ hatası. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.';
        showError(networkErrorMsg);
        console.error('Error:', error);
    }
}

// Kod kopyalama butonlarını etkinleştir
function setupCodeCopyButtons() {
    document.querySelectorAll('.code-copy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
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
    star.addEventListener('click', function() {
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
    submitFeedbackBtn.addEventListener('click', function() {
        // Burada gerçek bir uygulamada sunucuya geri bildirim gönderilirdi
        document.getElementById('feedback-modal').classList.remove('show');
        const thankYouMsg = window.t ? window.t('feedbackThanks') : 'Geri bildiriminiz için teşekkürler!';
        showToast(thankYouMsg, 'success');
    });
}

// Dosya yükleme işlevleri
const browseBtn = document.querySelector('.browse-btn');
const fileInput = document.getElementById('file-input');

if (browseBtn && fileInput) {
    browseBtn.addEventListener('click', function() {
        fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
        if (this.files.length > 0) {
            // Dosya seçildi
            const file = this.files[0];
            const uploadBtn = document.querySelector('.upload-btn');
            
            // Butonu etkinleştir
            uploadBtn.disabled = false;
            
            // Dosya bilgilerini göster
            const uploadArea = document.querySelector('.upload-area');
            uploadArea.innerHTML = `
                <div class="uploaded-files">
                    <div class="file-item">
                        <i class="file-icon fas fa-file"></i>
                        <div class="file-info">
                            <div class="file-name">${file.name}</div>
                            <div class="file-size">${formatFileSize(file.size)}</div>
                        </div>
                        <button class="file-remove"><i class="fas fa-times"></i></button>
                    </div>
                </div>
            `;
            
            // Dosyayı kaldır butonu
            const removeBtn = document.querySelector('.file-remove');
            removeBtn.addEventListener('click', function() {
                fileInput.value = '';
                uploadBtn.disabled = true;
                
                const dragDropText = window.t ? window.t('dragDrop') : 'Dosyalarınızı buraya sürükleyin veya';
                const chooseBtnText = window.t ? window.t('chooseFile') : 'Dosya Seçin';
                
                uploadArea.innerHTML = `
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>${dragDropText}</p>
                    <button class="browse-btn">${chooseBtnText}</button>
                `;
                
                // Browse butonunu yeniden etkinleştir
                document.querySelector('.browse-btn').addEventListener('click', function() {
                    fileInput.click();
                });
            });
            
            // Yükle butonu
            uploadBtn.addEventListener('click', function() {
                // Burada gerçek bir uygulamada dosya sunucuya yüklenirdi
                
                // İlerleme göstergesi göster
                const uploadingText = window.t ? window.t('uploading') : 'Yükleniyor...';
                
                const progressHTML = `
                    <div class="upload-progress show">
                        <div class="progress-bar-container">
                            <div class="progress-bar" style="width: 0%"></div>
                        </div>
                        <div class="progress-text">
                            <span>${uploadingText}</span>
                            <span>0%</span>
                        </div>
                    </div>
                `;
                
                uploadArea.insertAdjacentHTML('beforeend', progressHTML);
                
                // İlerleme animasyonu
                let progress = 0;
                const progressBar = document.querySelector('.progress-bar');
                const progressText = document.querySelector('.progress-text span:last-child');
                
                const interval = setInterval(() => {
                    progress += 5;
                    progressBar.style.width = `${progress}%`;
                    progressText.textContent = `${progress}%`;
                    
                    if (progress >= 100) {
                        clearInterval(interval);
                        document.getElementById('file-modal').classList.remove('show');
                        
                        const uploadedMsg = window.t ? 
                            window.t('fileUploaded').replace('{filename}', file.name) : 
                            `"${file.name}" dosyası başarıyla yüklendi`;
                        
                        showToast(uploadedMsg, 'success');
                        
                        // Mesaj alanına dosya bilgisi ekle
                        userInput.value += `\n[Ek dosya: ${file.name}] `;
                        userInput.focus();
                    }
                }, 100);
            });
        }
    });
}

// Dosya boyutu formatla
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

// Olay dinleyicileri
sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Başlangıç fonksiyonları
function initializeApp() {
    // Tema ayarlarını yükle
    loadThemeSettings();
    
    // Sayfa yüklendiğinde girdi alanına odaklan
    userInput.focus();
    
    // Kod kopyalama butonlarını etkinleştir
    setupCodeCopyButtons();
    
    // Dil ve tema değişikliği için event listener'lar ekle
    document.addEventListener('languageChanged', function() {
        // Arayüz elemanlarını güncelle
        updateUITexts();
    });
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
    if (currentConversation.id === Date.now()) {
        document.querySelector('.conversation-title').textContent = window.t('newChat');
    }
    
    // Buton başlıkları
    if (sendButton) sendButton.title = window.t('send');
    if (clearButton) clearButton.title = window.t('clear');
    if (micBtn) micBtn.title = window.t('voiceInput');
    if (attachBtn) attachBtn.title = window.t('attachFile');
    if (exportBtn) exportBtn.title = window.t('export');
    
    // Öneri çiplerini güncelle - bu kısım translations.js tarafından yönetiliyor
}

// Uygulama başladığında
showAppLoading();
initializeApp();
});

// Toast bildirimi fonksiyonunu global yap
window.showToast = showToast;

// sendMessage fonksiyonunu global yap (ses bildirimlerinde kullanım için)
window.sendMessage = sendMessage;