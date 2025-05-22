// Données de consommation moyenne des appareils (en kWh)
const applianceConsumption = {
    fridge: 1.5,    // kWh par jour
    tv: 0.1,       // kWh par heure
    computer: 0.15, // kWh par heure
    washing: 1.2    // kWh par cycle
};

// Prix moyen du kWh en France (en euros)
const kWhPrice = 0.1740;

function calculateConsumption() {
    const appliance = document.getElementById('appliance').value;
    const hours = parseFloat(document.getElementById('hours').value);
    const resultDiv = document.getElementById('result');

    if (isNaN(hours) || hours < 0 || hours > 24) {
        resultDiv.innerHTML = 'Veuillez entrer un nombre d\'heures valide (0-24)';
        return;
    }

    let consumption;
    let message;

    switch (appliance) {
        case 'fridge':
            consumption = applianceConsumption.fridge;
            message = `Votre réfrigérateur consomme environ ${consumption.toFixed(2)} kWh par jour, soit ${(consumption * kWhPrice).toFixed(2)}€ par jour.`;
            break;
        case 'tv':
            consumption = applianceConsumption.tv * hours;
            message = `Votre télévision consomme environ ${consumption.toFixed(2)} kWh pour ${hours} heures d'utilisation, soit ${(consumption * kWhPrice).toFixed(2)}€.`;
            break;
        case 'computer':
            consumption = applianceConsumption.computer * hours;
            message = `Votre ordinateur consomme environ ${consumption.toFixed(2)} kWh pour ${hours} heures d'utilisation, soit ${(consumption * kWhPrice).toFixed(2)}€.`;
            break;
        case 'washing':
            consumption = applianceConsumption.washing;
            message = `Votre lave-linge consomme environ ${consumption.toFixed(2)} kWh par cycle, soit ${(consumption * kWhPrice).toFixed(2)}€ par cycle.`;
            break;
    }

    // Ajout de conseils personnalisés
    let advice = '';
    if (consumption > 1) {
        advice = '<br><br>💡 Conseil : Pensez à débrancher l\'appareil quand il n\'est pas utilisé pour réduire sa consommation en veille.';
    } else if (appliance === 'fridge') {
        advice = '<br><br>💡 Conseil : Assurez-vous que votre réfrigérateur est bien dégivré et que les joints sont en bon état.';
    } else if (appliance === 'tv') {
        advice = '<br><br>💡 Conseil : Activez le mode économie d\'énergie de votre téléviseur et réduisez la luminosité.';
    }

    resultDiv.innerHTML = message + advice;
}

// Animation des cartes au scroll
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.stat-card, .tip-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'all 0.5s ease-out';
        observer.observe(card);
    });
}); 