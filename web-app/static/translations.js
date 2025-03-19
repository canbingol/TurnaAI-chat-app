// Uygulama çevirileri
const translations = {
    // Türkçe (varsayılan dil)
    tr: {
        // Genel
        appName: "Turna AI Chat",
        newChat: "Yeni Sohbet",
        currentChat: "Şu anki sohbet",
        settings: "Ayarlar",
        
        // Sohbet modları
        chatMode: "Sohbet Modu",
        normal: "Normal",
        creative: "Yaratıcı",
        precise: "Kesin",
        
        // Sohbet alanı
        welcome: "Turna AI Chat'e hoş geldiniz! Size nasıl yardımcı olabilirim?",
        capabilities: "İşte yapabileceğim bazı şeyler:",
        capability1: "Sorularınızı yanıtlayabilirim",
        capability2: "Yaratıcı içerik oluşturabilirim",
        capability3: "Metinleri düzenleyebilirim",
        capability4: "Kodlama yardımı sunabilirim",
        placeholder: "Bir şeyler sorun...",
        
        // Butonlar ve aksiyonlar
        send: "Gönder",
        clear: "Temizle",
        copy: "Kopyala",
        copied: "Kopyalandı!",
        like: "Beğen",
        dislike: "Beğenme",
        voiceInput: "Sesli Giriş",
        attachFile: "Dosya Ekle",
        export: "Sohbeti Dışa Aktar",
        
        // Öneri çipleri
        suggestion1: "Turna AI nedir?",
        suggestion2: "Şiir yaz",
        suggestion3: "Python öğrenmeye nasıl başlarım?",
        suggestion4: "Türkiye'nin en güzel yerleri",
        
        // Ayarlar paneli
        generalSettings: "Genel",
        language: "Dil",
        autoScroll: "Otomatik kaydırma",
        appearance: "Görünüm",
        fontSize: "Yazı boyutu",
        small: "Küçük",
        medium: "Orta",
        large: "Büyük",
        theme: "Tema",
        dark: "Koyu",
        light: "Açık",
        purple: "Mor",
        notifications: "Bildirimler",
        soundNotifications: "Ses bildirimleri",
        
        // Profil menüsü
        profile: "Profil",
        history: "Geçmiş",
        preferences: "Tercihler",
        help: "Yardım",
        logout: "Çıkış Yap",
        
        // Dosya yükleme
        addFile: "Dosya Ekle",
        dragDrop: "Dosyalarınızı buraya sürükleyin veya",
        chooseFile: "Dosya Seçin",
        supportedTypes: "Desteklenen Dosya Türleri",
        pdfFiles: "PDF dosyaları",
        wordFiles: "Word dosyaları", 
        excelFiles: "Excel dosyaları",
        imageFiles: "Görsel dosyaları",
        codeFiles: "Kod dosyaları",
        cancel: "İptal",
        upload: "Yükle",
        uploading: "Yükleniyor...",
        
        // Geri bildirim
        sendFeedback: "Geri Bildirim Gönder",
        howWasResponse: "Bu cevabı nasıl buldunuz?",
        additionalComments: "Ek yorumlarınız",
        feedbackPlaceholder: "Deneyiminizle ilgili daha fazla ayrıntı paylaşın (isteğe bağlı)",
        submit: "Gönder",
        
        // Bildirimler ve hatalar
        error: "Bir hata oluştu. Lütfen tekrar deneyin.",
        networkError: "Ağ hatası. Lütfen bağlantınızı kontrol edin ve tekrar deneyin.",
        languageChanged: "Dil değiştirildi",
        themeChanged: "Tema değiştirildi",
        fontSizeChanged: "Yazı boyutu değiştirildi",
        settingEnabled: "etkinleştirildi",
        settingDisabled: "devre dışı bırakıldı",
        messageCopied: "Mesaj panoya kopyalandı",
        feedbackThanks: "Geri bildiriminiz için teşekkürler!",
        fileTooLarge: "Dosya çok büyük",
        fileUploaded: "Dosya başarıyla yüklendi",
        deleteConversation: "Sohbet silindi"
    },
    
    // English
    en: {
        // General
        appName: "Turna AI Chat",
        newChat: "New Chat",
        currentChat: "Current chat",
        settings: "Settings",
        
        // Chat modes
        chatMode: "Chat Mode",
        normal: "Normal",
        creative: "Creative",
        precise: "Precise",
        
        // Chat area
        welcome: "Welcome to Turna AI Chat! How can I help you?",
        capabilities: "Here are some things I can do:",
        capability1: "Answer your questions",
        capability2: "Create creative content",
        capability3: "Edit text",
        capability4: "Provide coding assistance",
        placeholder: "Ask something...",
        
        // Buttons and actions
        send: "Send",
        clear: "Clear",
        copy: "Copy",
        copied: "Copied!",
        like: "Like",
        dislike: "Dislike",
        voiceInput: "Voice Input",
        attachFile: "Attach File",
        export: "Export Chat",
        
        // Suggestion chips
        suggestion1: "What is Turna AI?",
        suggestion2: "Write a poem",
        suggestion3: "How do I start learning Python?",
        suggestion4: "Most beautiful places in Turkey",
        
        // Settings panel
        generalSettings: "General",
        language: "Language",
        autoScroll: "Auto-scroll",
        appearance: "Appearance",
        fontSize: "Font size",
        small: "Small",
        medium: "Medium",
        large: "Large",
        theme: "Theme",
        dark: "Dark",
        light: "Light",
        purple: "Purple",
        notifications: "Notifications",
        soundNotifications: "Sound notifications",
        
        // Profile menu
        profile: "Profile",
        history: "History",
        preferences: "Preferences",
        help: "Help",
        logout: "Log Out",
        
        // File upload
        addFile: "Add File",
        dragDrop: "Drag your files here or",
        chooseFile: "Choose File",
        supportedTypes: "Supported File Types",
        pdfFiles: "PDF files",
        wordFiles: "Word files", 
        excelFiles: "Excel files",
        imageFiles: "Image files",
        codeFiles: "Code files",
        cancel: "Cancel",
        upload: "Upload",
        uploading: "Uploading...",
        
        // Feedback
        sendFeedback: "Send Feedback",
        howWasResponse: "How was this response?",
        additionalComments: "Additional comments",
        feedbackPlaceholder: "Share more details about your experience (optional)",
        submit: "Submit",
        
        // Notifications and errors
        error: "An error occurred. Please try again.",
        networkError: "Network error. Please check your connection and try again.",
        languageChanged: "Language changed",
        themeChanged: "Theme changed",
        fontSizeChanged: "Font size changed",
        settingEnabled: "enabled",
        settingDisabled: "disabled",
        messageCopied: "Message copied to clipboard",
        feedbackThanks: "Thank you for your feedback!",
        fileTooLarge: "File is too large",
        fileUploaded: "File uploaded successfully",
        deleteConversation: "Chat deleted"
    },
    
    // Deutsch
    de: {
        // Allgemein
        appName: "Turna AI Chat",
        newChat: "Neuer Chat",
        currentChat: "Aktueller Chat",
        settings: "Einstellungen",
        
        // Chat-Modi
        chatMode: "Chat-Modus",
        normal: "Normal",
        creative: "Kreativ",
        precise: "Präzise",
        
        // Chat-Bereich
        welcome: "Willkommen bei Turna AI Chat! Wie kann ich Ihnen helfen?",
        capabilities: "Hier sind einige Dinge, die ich tun kann:",
        capability1: "Ihre Fragen beantworten",
        capability2: "Kreative Inhalte erstellen",
        capability3: "Texte bearbeiten",
        capability4: "Hilfe beim Programmieren bieten",
        placeholder: "Fragen Sie etwas...",
        
        // Buttons und Aktionen
        send: "Senden",
        clear: "Löschen",
        copy: "Kopieren",
        copied: "Kopiert!",
        like: "Gefällt mir",
        dislike: "Gefällt mir nicht",
        voiceInput: "Spracheingabe",
        attachFile: "Datei anhängen",
        export: "Chat exportieren",
        
        // Vorschlag-Chips
        suggestion1: "Was ist Turna AI?",
        suggestion2: "Schreibe ein Gedicht",
        suggestion3: "Wie fange ich an, Python zu lernen?",
        suggestion4: "Die schönsten Orte in der Türkei",
        
        // Einstellungsfenster
        generalSettings: "Allgemein",
        language: "Sprache",
        autoScroll: "Automatisches Scrollen",
        appearance: "Erscheinungsbild",
        fontSize: "Schriftgröße",
        small: "Klein",
        medium: "Mittel",
        large: "Groß",
        theme: "Thema",
        dark: "Dunkel",
        light: "Hell",
        purple: "Lila",
        notifications: "Benachrichtigungen",
        soundNotifications: "Tonbenachrichtigungen",
        
        // Profilmenü
        profile: "Profil",
        history: "Verlauf",
        preferences: "Präferenzen",
        help: "Hilfe",
        logout: "Abmelden",
        
        // Datei-Upload
        addFile: "Datei hinzufügen",
        dragDrop: "Ziehen Sie Ihre Dateien hierher oder",
        chooseFile: "Datei auswählen",
        supportedTypes: "Unterstützte Dateitypen",
        pdfFiles: "PDF-Dateien",
        wordFiles: "Word-Dateien", 
        excelFiles: "Excel-Dateien",
        imageFiles: "Bilddateien",
        codeFiles: "Code-Dateien",
        cancel: "Abbrechen",
        upload: "Hochladen",
        uploading: "Wird hochgeladen...",
        
        // Feedback
        sendFeedback: "Feedback senden",
        howWasResponse: "Wie war diese Antwort?",
        additionalComments: "Zusätzliche Kommentare",
        feedbackPlaceholder: "Teilen Sie mehr Details zu Ihrer Erfahrung mit (optional)",
        submit: "Absenden",
        
        // Benachrichtigungen und Fehler
        error: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        networkError: "Netzwerkfehler. Bitte überprüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
        languageChanged: "Sprache geändert",
        themeChanged: "Thema geändert",
        fontSizeChanged: "Schriftgröße geändert",
        settingEnabled: "aktiviert",
        settingDisabled: "deaktiviert",
        messageCopied: "Nachricht in die Zwischenablage kopiert",
        feedbackThanks: "Vielen Dank für Ihr Feedback!",
        fileTooLarge: "Datei ist zu groß",
        fileUploaded: "Datei erfolgreich hochgeladen",
        deleteConversation: "Chat gelöscht"
    },
    
    // Français
    fr: {
        // Général
        appName: "Turna AI Chat",
        newChat: "Nouvelle Conversation",
        currentChat: "Conversation actuelle",
        settings: "Paramètres",
        
        // Modes de conversation
        chatMode: "Mode de Conversation",
        normal: "Normal",
        creative: "Créatif",
        precise: "Précis",
        
        // Zone de conversation
        welcome: "Bienvenue sur Turna AI Chat ! Comment puis-je vous aider ?",
        capabilities: "Voici quelques choses que je peux faire :",
        capability1: "Répondre à vos questions",
        capability2: "Créer du contenu créatif",
        capability3: "Éditer du texte",
        capability4: "Fournir une assistance en programmation",
        placeholder: "Posez une question...",
        
        // Boutons et actions
        send: "Envoyer",
        clear: "Effacer",
        copy: "Copier",
        copied: "Copié !",
        like: "J'aime",
        dislike: "Je n'aime pas",
        voiceInput: "Entrée vocale",
        attachFile: "Joindre un fichier",
        export: "Exporter la conversation",
        
        // Suggestions
        suggestion1: "Qu'est-ce que Turna AI ?",
        suggestion2: "Écris un poème",
        suggestion3: "Comment commencer à apprendre Python ?",
        suggestion4: "Les plus beaux endroits en Turquie",
        
        // Panneau de paramètres
        generalSettings: "Général",
        language: "Langue",
        autoScroll: "Défilement automatique",
        appearance: "Apparence",
        fontSize: "Taille de police",
        small: "Petite",
        medium: "Moyenne",
        large: "Grande",
        theme: "Thème",
        dark: "Sombre",
        light: "Clair",
        purple: "Violet",
        notifications: "Notifications",
        soundNotifications: "Notifications sonores",
        
        // Menu profil
        profile: "Profil",
        history: "Historique",
        preferences: "Préférences",
        help: "Aide",
        logout: "Déconnexion",
        
        // Téléchargement de fichiers
        addFile: "Ajouter un fichier",
        dragDrop: "Glissez-déposez vos fichiers ici ou",
        chooseFile: "Choisir un fichier",
        supportedTypes: "Types de fichiers pris en charge",
        pdfFiles: "Fichiers PDF",
        wordFiles: "Fichiers Word", 
        excelFiles: "Fichiers Excel",
        imageFiles: "Fichiers image",
        codeFiles: "Fichiers de code",
        cancel: "Annuler",
        upload: "Télécharger",
        uploading: "Téléchargement en cours...",
        
        // Retour d'information
        sendFeedback: "Envoyer un commentaire",
        howWasResponse: "Comment était cette réponse ?",
        additionalComments: "Commentaires supplémentaires",
        feedbackPlaceholder: "Partagez plus de détails sur votre expérience (optionnel)",
        submit: "Soumettre",
        
        // Notifications et erreurs
        error: "Une erreur s'est produite. Veuillez réessayer.",
        networkError: "Erreur réseau. Veuillez vérifier votre connexion et réessayer.",
        languageChanged: "Langue modifiée",
        themeChanged: "Thème modifié",
        fontSizeChanged: "Taille de police modifiée",
        settingEnabled: "activé",
        settingDisabled: "désactivé",
        messageCopied: "Message copié dans le presse-papiers",
        feedbackThanks: "Merci pour votre commentaire !",
        fileTooLarge: "Le fichier est trop volumineux",
        fileUploaded: "Fichier téléchargé avec succès",
        deleteConversation: "Conversation supprimée"
    }
};

// Aktif dil değişkenini tut
let activeLanguage = 'tr';

// Dil değiştirme fonksiyonu
function changeLanguage(lang) {
    // Desteklenen bir dil mi kontrol et
    if (!translations[lang]) {
        console.error(`Desteklenmeyen dil: ${lang}`);
        return false;
    }
    
    // Aktif dili güncelle
    activeLanguage = lang;
    
    // Sayfadaki tüm metinleri güncelle
    updatePageTexts();
    
    // localStorage'a kaydet
    try {
        const settings = JSON.parse(localStorage.getItem('turnaSettings')) || {};
        settings.language = lang;
        localStorage.setItem('turnaSettings', JSON.stringify(settings));
    } catch (error) {
        console.error('Dil ayarı kaydedilemedi:', error);
    }
    
    return true;
}

// Sayfa metinlerini güncelle
function updatePageTexts() {
    // Sayfa başlığını güncelle
    document.title = translations[activeLanguage].appName;
    
    // Tüm data-i18n özniteliği olan elementleri güncelle
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[activeLanguage][key]) {
            element.textContent = translations[activeLanguage][key];
        }
    });
    
    // Butonların ve giriş alanlarının içeriklerini güncelle
    updateButtonsAndInputs();
}

// Butonları ve giriş alanlarını güncelle
function updateButtonsAndInputs() {
    // Yeni sohbet butonu
    const newChatBtn = document.querySelector('.new-chat-btn');
    if (newChatBtn) {
        newChatBtn.innerHTML = `<i class="fas fa-plus"></i> ${translations[activeLanguage].newChat}`;
    }
    
    // Sohbet modu başlığı
    const modeLabel = document.querySelector('.mode-label');
    if (modeLabel) {
        modeLabel.textContent = translations[activeLanguage].chatMode;
    }
    
    // Sohbet modu butonları
    const normalModeBtn = document.querySelector('.mode-btn[data-mode="normal"]');
    const creativeModeBtn = document.querySelector('.mode-btn[data-mode="creative"]');
    const preciseModeBtn = document.querySelector('.mode-btn[data-mode="precise"]');
    
    if (normalModeBtn) normalModeBtn.innerHTML = `<i class="fas fa-comment"></i> ${translations[activeLanguage].normal}`;
    if (creativeModeBtn) creativeModeBtn.innerHTML = `<i class="fas fa-paint-brush"></i> ${translations[activeLanguage].creative}`;
    if (preciseModeBtn) preciseModeBtn.innerHTML = `<i class="fas fa-bullseye"></i> ${translations[activeLanguage].precise}`;
    
    // Ayarlar butonu
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
        settingsBtn.innerHTML = `<i class="fas fa-cog"></i> ${translations[activeLanguage].settings}`;
    }
    
    // Kullanıcı giriş alanı
    const userInput = document.getElementById('user-input');
    if (userInput) {
        userInput.placeholder = translations[activeLanguage].placeholder;
    }
    
    // Mesaj gönderme ve temizleme butonları
    const sendButton = document.getElementById('send-button');
    const clearButton = document.getElementById('clear-btn');
    const micButton = document.getElementById('mic-btn');
    const attachButton = document.getElementById('attach-btn');
    const exportButton = document.getElementById('export-btn');
    
    if (sendButton) sendButton.title = translations[activeLanguage].send;
    if (clearButton) clearButton.title = translations[activeLanguage].clear;
    if (micButton) micButton.title = translations[activeLanguage].voiceInput;
    if (attachButton) attachButton.title = translations[activeLanguage].attachFile;
    if (exportButton) exportButton.title = translations[activeLanguage].export;
    
    // Öneri çipleri
    const suggestionChips = document.querySelectorAll('.suggestion-chip');
    if (suggestionChips.length >= 4) {
        suggestionChips[0].textContent = translations[activeLanguage].suggestion1;
        suggestionChips[1].textContent = translations[activeLanguage].suggestion2;
        suggestionChips[2].textContent = translations[activeLanguage].suggestion3;
        suggestionChips[3].textContent = translations[activeLanguage].suggestion4;
    }
    
    // Profil menüsü
    const profileOptions = document.querySelectorAll('.profile-option');
    if (profileOptions.length >= 5) {
        profileOptions[0].innerHTML = `<i class="fas fa-user"></i> ${translations[activeLanguage].profile}`;
        profileOptions[1].innerHTML = `<i class="fas fa-history"></i> ${translations[activeLanguage].history}`;
        profileOptions[2].innerHTML = `<i class="fas fa-sliders-h"></i> ${translations[activeLanguage].preferences}`;
        profileOptions[3].innerHTML = `<i class="fas fa-question-circle"></i> ${translations[activeLanguage].help}`;
        profileOptions[4].innerHTML = `<i class="fas fa-sign-out-alt"></i> ${translations[activeLanguage].logout}`;
    }
    
    // Ayarlar paneli
    updateSettingsPanel();
    
    // Dosya ekleme modal
    updateFileModal();
    
    // Geri bildirim modal
    updateFeedbackModal();
}

// Ayarlar panelini güncelle
function updateSettingsPanel() {
    // Ayarlar başlığı
    const settingsHeader = document.querySelector('.settings-header h3');
    if (settingsHeader) {
        settingsHeader.textContent = translations[activeLanguage].settings;
    }
    
    // Bölüm başlıkları
    const settingsSections = document.querySelectorAll('.settings-section h4');
    if (settingsSections.length >= 3) {
        settingsSections[0].textContent = translations[activeLanguage].generalSettings;
        settingsSections[1].textContent = translations[activeLanguage].appearance;
        settingsSections[2].textContent = translations[activeLanguage].notifications;
    }
    
    // Ayar etiketleri
    const settingLabels = document.querySelectorAll('.setting-item label:first-child');
    if (settingLabels.length >= 5) {
        settingLabels[0].textContent = translations[activeLanguage].language;
        settingLabels[1].textContent = translations[activeLanguage].autoScroll;
        settingLabels[2].textContent = translations[activeLanguage].fontSize;
        settingLabels[3].textContent = translations[activeLanguage].theme;
        settingLabels[4].textContent = translations[activeLanguage].soundNotifications;
    }
    
    // Yazı boyutu seçenekleri
    const fontSizeOptions = document.querySelectorAll('#font-size-select option');
    if (fontSizeOptions.length >= 3) {
        fontSizeOptions[0].textContent = translations[activeLanguage].small;
        fontSizeOptions[1].textContent = translations[activeLanguage].medium;
        fontSizeOptions[2].textContent = translations[activeLanguage].large;
    }
    
    // Tema butonları
    const themeOptions = document.querySelectorAll('.theme-option');
    if (themeOptions.length >= 3) {
        themeOptions[0].textContent = translations[activeLanguage].dark;
        themeOptions[1].textContent = translations[activeLanguage].light;
        themeOptions[2].textContent = translations[activeLanguage].purple;
    }
}

// Dosya modalını güncelle
function updateFileModal() {
    // Modal başlığı
    const fileModalHeader = document.querySelector('#file-modal .modal-header h3');
    if (fileModalHeader) {
        fileModalHeader.textContent = translations[activeLanguage].addFile;
    }
    
    // Sürükle bırak metni
    const dragDropText = document.querySelector('.upload-area p');
    if (dragDropText) {
        dragDropText.textContent = translations[activeLanguage].dragDrop;
    }
    
    // Dosya seç butonu
    const browseBtn = document.querySelector('.browse-btn');
    if (browseBtn) {
        browseBtn.textContent = translations[activeLanguage].chooseFile;
    }
    
    // Desteklenen dosya türleri başlığı
    const fileTypesHeader = document.querySelector('.file-list-area h4');
    if (fileTypesHeader) {
        fileTypesHeader.textContent = translations[activeLanguage].supportedTypes;
    }
    
    // Dosya türleri
    const fileTypes = document.querySelectorAll('.file-types li');
    if (fileTypes.length >= 5) {
        fileTypes[0].innerHTML = `<i class="fas fa-file-pdf"></i> ${translations[activeLanguage].pdfFiles}`;
        fileTypes[1].innerHTML = `<i class="fas fa-file-word"></i> ${translations[activeLanguage].wordFiles}`;
        fileTypes[2].innerHTML = `<i class="fas fa-file-csv"></i> ${translations[activeLanguage].excelFiles}`;
        fileTypes[3].innerHTML = `<i class="fas fa-file-image"></i> ${translations[activeLanguage].imageFiles}`;
        fileTypes[4].innerHTML = `<i class="fas fa-file-code"></i> ${translations[activeLanguage].codeFiles}`;
    }
    
    // İptal ve yükle butonları
    const cancelBtn = document.querySelector('#file-modal .cancel-btn');
    const uploadBtn = document.querySelector('#file-modal .upload-btn');
    
    if (cancelBtn) cancelBtn.textContent = translations[activeLanguage].cancel;
    if (uploadBtn) uploadBtn.textContent = translations[activeLanguage].upload;
}

// Geri bildirim modalını güncelle
function updateFeedbackModal() {
    // Modal başlığı
    const feedbackModalHeader = document.querySelector('#feedback-modal .modal-header h3');
    if (feedbackModalHeader) {
        feedbackModalHeader.textContent = translations[activeLanguage].sendFeedback;
    }
    
    // Değerlendirme sorusu
    const ratingQuestion = document.querySelector('.rating-area p');
    if (ratingQuestion) {
        ratingQuestion.textContent = translations[activeLanguage].howWasResponse;
    }
    
    // Ek yorumlar
    const additionalComments = document.querySelector('.feedback-text-area p');
    if (additionalComments) {
        additionalComments.textContent = translations[activeLanguage].additionalComments;
    }
    
    // Yorum giriş alanı
    const feedbackTextarea = document.querySelector('.feedback-text-area textarea');
    if (feedbackTextarea) {
        feedbackTextarea.placeholder = translations[activeLanguage].feedbackPlaceholder;
    }
    
    // İptal ve gönder butonları
    const cancelBtn = document.querySelector('#feedback-modal .cancel-btn');
    const submitBtn = document.querySelector('#feedback-modal .submit-feedback-btn');
    
    if (cancelBtn) cancelBtn.textContent = translations[activeLanguage].cancel;
    if (submitBtn) submitBtn.textContent = translations[activeLanguage].submit;
}

// Çeviri fonksiyonu (t = translate)
function t(key) {
    return translations[activeLanguage][key] || key;
}

// Sayfa yüklendiğinde dil ayarını yükle
document.addEventListener('DOMContentLoaded', function() {
    // localStorage'dan dil ayarını al
    try {
        const settings = JSON.parse(localStorage.getItem('turnaSettings')) || {};
        if (settings.language && translations[settings.language]) {
            changeLanguage(settings.language);
        }
    } catch (error) {
        console.error('Dil ayarı yüklenemedi:', error);
    }
    
    // Dil değiştirme olayını dinle
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function() {
            const success = changeLanguage(this.value);
            if (success && window.showToast) {
                window.showToast(`${t('languageChanged')}: ${getLanguageName(this.value)}`, 'info');
            }
        });
    }
    
    // İlk yükleme için metinleri güncelle
    updatePageTexts();
});

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

// Global olarak dışa aktar
window.t = t;
window.changeLanguage = changeLanguage;