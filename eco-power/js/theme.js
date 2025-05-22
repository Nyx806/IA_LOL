// Fonction pour définir le thème
function setTheme(theme) {
    // Supprimer l'attribut data-theme existant
    document.documentElement.removeAttribute('data-theme');
    
    // Appliquer le nouveau thème
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.documentElement.style.setProperty('--background-color', '#121212');
        document.documentElement.style.setProperty('--text-color', '#ffffff');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        document.documentElement.style.setProperty('--background-color', '#ffffff');
        document.documentElement.style.setProperty('--text-color', '#1a1a1a');
    }
    
    // Sauvegarder le thème
    localStorage.setItem('theme', theme);
}

// Fonction pour basculer le thème
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
}

// Initialisation du thème
document.addEventListener('DOMContentLoaded', () => {
    // Récupérer le thème sauvegardé ou utiliser le thème système
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
        setTheme(savedTheme);
    } else {
        setTheme(prefersDark ? 'dark' : 'light');
    }

    // Ajouter l'écouteur d'événements au bouton de thème
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Écouter les changements de préférence système
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
}); 