// Theme switching functionality

document.addEventListener('DOMContentLoaded', function() {
    // Sidebar theme toggle button
    const themeIcon = document.querySelector('.sidebar-footer .theme-toggle i');
    if (themeIcon) {
        themeIcon.parentElement.addEventListener('click', function() {
            if (window.toggleTheme) {
                window.toggleTheme();
            }
        });
    }
    
    // Settings panel theme options
    const themeOptions = document.querySelectorAll('.theme-option');
    if (themeOptions.length) {
        themeOptions.forEach(option => {
            option.addEventListener('click', function() {
                const theme = this.dataset.theme;
                
                // Skip turquoise theme (not implemented)
                if (theme === 'turquoise') {
                    return;
                }
                
                // Use global theme toggle function
                if (window.toggleTheme) {
                    window.toggleTheme(theme);
                }
            });
        });
    }
});