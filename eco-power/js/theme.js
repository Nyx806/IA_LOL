// Fonction pour définir le thème
function setTheme(theme) {
    // Supprimer l'attribut data-theme existant
    document.documentElement.removeAttribute('data-theme');
    
    // Appliquer le nouveau thème
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Sauvegarder le thème
    localStorage.setItem('theme', theme);
    
    // Mettre à jour les couleurs du body
    document.body.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--background-color');
    document.body.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color');
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