// Données de consommation moyenne des appareils (en kWh)
const applianceConsumption = {
    fridge: {
        base: 1.5,    // kWh par jour
        description: "Consommation journalière moyenne"
    },
    tv: {
        base: 0.1,    // kWh par heure
        description: "Consommation par heure d'utilisation"
    },
    computer: {
        base: 0.15,   // kWh par heure
        description: "Consommation par heure d'utilisation"
    },
    washing: {
        base: 1.2,    // kWh par cycle
        description: "Consommation par cycle de lavage"
    },
    dishwasher: {
        base: 1.5,    // kWh par cycle
        description: "Consommation par cycle de lavage"
    },
    microwave: {
        base: 0.8,    // kWh par heure
        description: "Consommation par heure d'utilisation"
    },
    oven: {
        base: 2.3,    // kWh par heure
        description: "Consommation par heure d'utilisation"
    },
    aircon: {
        base: 1.5,    // kWh par heure
        description: "Consommation par heure d'utilisation"
    },
    heater: {
        base: 2.0,    // kWh par heure
        description: "Consommation par heure d'utilisation"
    },
    dryer: {
        base: 3.0,    // kWh par cycle
        description: "Consommation par cycle de séchage"
    },
    coffee: {
        base: 0.1,    // kWh par heure
        description: "Consommation par heure d'utilisation"
    },
    vacuum: {
        base: 1.2,    // kWh par heure
        description: "Consommation par heure d'utilisation"
    }
};

// Prix moyen du kWh en France (en euros)
const kWhPrice = 0.1740;

// Seuils de consommation pour le calcul du score (en kWh)
const consumptionThresholds = {
    low: 0.5,    // Consommation faible
    medium: 1.5, // Consommation moyenne
    high: 3.0    // Consommation élevée
};

// Fonction pour calculer le score écologique
function calculateEcoScore(consumption, appliance) {
    let score = 100;
    let message = '';
    
    // Ajustement du score en fonction de la consommation
    if (consumption > consumptionThresholds.high) {
        score -= 40;
        message = 'Consommation très élevée';
    } else if (consumption > consumptionThresholds.medium) {
        score -= 25;
        message = 'Consommation élevée';
    } else if (consumption > consumptionThresholds.low) {
        score -= 10;
        message = 'Consommation modérée';
    } else {
        message = 'Consommation faible';
    }

    // Ajustements spécifiques par appareil
    switch (appliance) {
        case 'fridge':
            if (consumption > 2) {
                score -= 10;
                message += ' - Réfrigérateur peu efficace';
            }
            break;
        case 'aircon':
            if (consumption > 2) {
                score -= 15;
                message += ' - Climatisation intensive';
            }
            break;
        case 'heater':
            if (consumption > 2.5) {
                score -= 20;
                message += ' - Chauffage excessif';
            }
            break;
        case 'oven':
            if (consumption > 2) {
                score -= 15;
                message += ' - Utilisation intensive du four';
            }
            break;
    }

    // Ajustement en fonction des heures d'utilisation
    const hours = parseFloat(document.getElementById('hours').value);
    if (hours > 12) {
        score -= 10;
        message += ' - Utilisation prolongée';
    } else if (hours > 6) {
        score -= 5;
        message += ' - Utilisation modérée';
    }

    // Limiter le score entre 0 et 100
    score = Math.max(0, Math.min(100, score));

    return { score, message };
}

// Fonction pour obtenir la couleur en fonction du score
function getScoreColor(score) {
    if (score >= 80) return '#2ecc71'; // Vert
    if (score >= 60) return '#f1c40f'; // Jaune
    if (score >= 40) return '#e67e22'; // Orange
    return '#e74c3c'; // Rouge
}

function calculateConsumption() {
    const appliance = document.getElementById('appliance').value;
    const hours = parseFloat(document.getElementById('hours').value);
    const resultDiv = document.getElementById('result');

    if (isNaN(hours) || hours < 0 || hours > 24) {
        resultDiv.innerHTML = 'Veuillez entrer un nombre d\'heures valide (0-24)';
        return;
    }

    // Consommation en kWh par heure ou par cycle
    const consumptionRates = {
        fridge: 0.1, // 100W
        tv: 0.15, // 150W
        computer: 0.2, // 200W
        washing: 1.5, // 1500W par cycle
        dishwasher: 1.2, // 1200W par cycle
        microwave: 1.0, // 1000W
        oven: 2.0, // 2000W
        aircon: 1.5, // 1500W
        heater: 2.0, // 2000W
        dryer: 3.0, // 3000W par cycle
        coffee: 0.8, // 800W
        vacuum: 1.2, // 1200W
        ai_training: 10.0, // 10kW par heure (moyenne pour l'entraînement d'un modèle)
        ai_image: 2.0 // 2kW par heure (moyenne pour la génération d'images)
    };

    let consumption;
    let message;
    let dailyCost;
    let monthlyCost;
    let yearlyCost;

    // Calcul de la consommation et des coûts
    if (['washing', 'dishwasher', 'dryer'].includes(appliance)) {
        consumption = consumptionRates[appliance];
        dailyCost = consumption * kWhPrice;
        monthlyCost = dailyCost * 30;
        yearlyCost = dailyCost * 365;
        message = `
            <div class="consumption-details">
                <p>Votre ${getApplianceName(appliance)} consomme environ ${consumption.toFixed(2)} kWh par cycle</p>
                <p>Coûts estimés :</p>
                <ul>
                    <li>Par cycle : ${dailyCost.toFixed(2)}€</li>
                    <li>Par mois (30 cycles) : ${monthlyCost.toFixed(2)}€</li>
                    <li>Par an (365 cycles) : ${yearlyCost.toFixed(2)}€</li>
                </ul>
            </div>`;
    } else if (appliance === 'fridge') {
        consumption = consumptionRates[appliance] * 24; // Consommation journalière
        dailyCost = consumption * kWhPrice;
        monthlyCost = dailyCost * 30;
        yearlyCost = dailyCost * 365;
        message = `
            <div class="consumption-details">
                <p>Votre réfrigérateur consomme environ ${consumption.toFixed(2)} kWh par jour</p>
                <p>Coûts estimés :</p>
                <ul>
                    <li>Par jour : ${dailyCost.toFixed(2)}€</li>
                    <li>Par mois : ${monthlyCost.toFixed(2)}€</li>
                    <li>Par an : ${yearlyCost.toFixed(2)}€</li>
                </ul>
            </div>`;
    } else {
        consumption = consumptionRates[appliance] * hours;
        dailyCost = consumption * kWhPrice;
        monthlyCost = dailyCost * 30;
        yearlyCost = dailyCost * 365;
        message = `
            <div class="consumption-details">
                <p>Votre ${getApplianceName(appliance)} consomme environ ${consumption.toFixed(2)} kWh pour ${hours} heures d'utilisation</p>
                <p>Coûts estimés :</p>
                <ul>
                    <li>Par jour : ${dailyCost.toFixed(2)}€</li>
                    <li>Par mois : ${monthlyCost.toFixed(2)}€</li>
                    <li>Par an : ${yearlyCost.toFixed(2)}€</li>
                </ul>
            </div>`;
    }

    // Détails supplémentaires pour l'IA
    if (appliance.startsWith('ai_')) {
        const aiDetails = {
            ai_training: "L'entraînement d'un modèle d'IA peut consommer jusqu'à 10kW par heure selon la complexité du modèle et la taille du dataset. Cette consommation inclut le refroidissement des serveurs et l'infrastructure du datacenter.",
            ai_image: "La génération d'images par IA consomme environ 2kW par heure, incluant le traitement GPU et le refroidissement des serveurs. La consommation varie selon la résolution et la complexité des images."
        };
        message += `<p class="ai-details">${aiDetails[appliance]}</p>`;
    }

    // Calcul du score écologique
    const ecoScore = calculateEcoScore(consumption, appliance);
    const scoreColor = getScoreColor(ecoScore.score);

    // Ajout du score écologique au message
    message += `
        <div class="eco-score" style="margin-top: 1.5rem; padding: 1rem; background-color: ${scoreColor}20; border-radius: 10px; border-left: 4px solid ${scoreColor};">
            <h3 style="color: ${scoreColor}; margin-bottom: 0.5rem;">Score Écologique : ${ecoScore.score}/100</h3>
            <p style="color: var(--dark-color);">${ecoScore.message}</p>
        </div>`;

    // Conseils spécifiques pour chaque appareil
    const adviceMap = {
        fridge: "Maintenez une température de 4°C et évitez de laisser la porte ouverte trop longtemps.",
        tv: "Activez le mode économie d'énergie et éteignez complètement l'appareil plutôt que de le laisser en veille.",
        computer: "Utilisez le mode économie d'énergie et éteignez l'écran quand vous ne l'utilisez pas.",
        washing: "Lavez à froid quand c'est possible et remplissez complètement la machine.",
        dishwasher: "Utilisez le mode éco et remplissez complètement le lave-vaisselle.",
        microwave: "Préférez le micro-ondes au four pour les petits plats.",
        oven: "Évitez d'ouvrir la porte pendant la cuisson et utilisez la chaleur tournante.",
        aircon: "Maintenez une différence de température raisonnable avec l'extérieur (max 8°C).",
        heater: "Réglez le thermostat à 19°C maximum et baissez la température la nuit.",
        dryer: "Préférez le séchage à l'air libre quand c'est possible.",
        coffee: "Éteignez la machine après utilisation et détartrez-la régulièrement.",
        vacuum: "Nettoyez régulièrement les filtres pour maintenir l'efficacité.",
        ai_training: "L'entraînement d'un modèle d'IA dans un datacenter consomme beaucoup d'énergie. Considérez l'utilisation de modèles pré-entraînés ou l'optimisation des hyperparamètres pour réduire la consommation.",
        ai_image: "La génération d'images par IA est énergivore. Privilégiez les modèles optimisés et évitez les générations inutiles."
    };

    // Ajout des conseils personnalisés
    if (ecoScore.score < 40) {
        message += '<div class="advice warning"><p>⚠️ Attention : Votre consommation est très élevée. Considérez des alternatives plus économiques.</p></div>';
    } else if (ecoScore.score < 60) {
        message += '<div class="advice warning"><p>⚠️ Votre consommation est élevée. Pensez à optimiser votre utilisation.</p></div>';
    }

    message += `
        <div class="advice">
            <h4>Conseil :</h4>
            <p>${adviceMap[appliance]}</p>
        </div>`;

    resultDiv.innerHTML = message;
}

// Fonction pour obtenir le nom en français de l'appareil
function getApplianceName(appliance) {
    const names = {
        'fridge': 'réfrigérateur',
        'tv': 'télévision',
        'computer': 'ordinateur',
        'washing': 'lave-linge',
        'dishwasher': 'lave-vaisselle',
        'microwave': 'micro-ondes',
        'oven': 'four',
        'aircon': 'climatisation',
        'heater': 'chauffage',
        'dryer': 'sèche-linge',
        'coffee': 'machine à café',
        'vacuum': 'aspirateur'
    };
    return names[appliance] || appliance;
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

// Gestion de la navigation active
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav a');

    // Fonction pour mettre à jour le lien actif
    function updateActiveLink() {
        const scrollPosition = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Écouter le défilement
    window.addEventListener('scroll', updateActiveLink);
    // Mettre à jour au chargement initial
    updateActiveLink();

    // Gestion du clic sur les liens de navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                // Mettre à jour l'URL sans recharger la page
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
});

// Simulation de l'empreinte énergétique
document.addEventListener('DOMContentLoaded', function() {
    const sliders = document.querySelectorAll('.slider');
    const glacier = document.querySelector('.glacier');
    const waterLevel = document.querySelector('.water-level');
    const carbonFootprint = document.getElementById('carbon-footprint');
    const seaLevel = document.getElementById('sea-level');

    // Coefficients d'impact pour chaque type de consommation
    const impactCoefficients = {
        heating: 2.5,    // kg CO2 par heure
        lighting: 0.8,   // kg CO2 par heure
        appliances: 1.2, // kg CO2 par heure
        transport: 0.15  // kg CO2 par km
    };

    function updateSimulation() {
        let totalImpact = 0;
        
        // Calculer l'impact total
        sliders.forEach(slider => {
            const value = parseFloat(slider.value);
            const coefficient = impactCoefficients[slider.id];
            totalImpact += value * coefficient;
        });

        // Mettre à jour l'affichage
        carbonFootprint.textContent = `${totalImpact.toFixed(1)} kg CO2`;
        
        // Calculer l'impact sur le niveau de la mer (1 kg CO2 = 0.1 cm)
        const seaLevelRise = totalImpact * 0.1;
        seaLevel.textContent = `${seaLevelRise.toFixed(1)} cm`;

        // Mettre à jour la visualisation
        const glacierHeight = Math.max(0, 200 - (totalImpact * 2));
        const waterHeight = Math.min(250, totalImpact * 2);

        glacier.style.height = `${glacierHeight}px`;
        waterLevel.style.height = `${waterHeight}px`;

        // Mettre à jour l'apparence du soleil en fonction de l'empreinte carbone
        const sun = document.querySelector('.sun');
        const sunGlow = sun.querySelector('::before');
        
        // Calculer l'intensité du réchauffement (0 à 1)
        const warmingIntensity = Math.min(1, totalImpact / 50);
        
        // Calculer les couleurs en fonction de l'intensité
        const sunColor = `rgb(${255}, ${255 - warmingIntensity * 200}, ${0})`;
        const glowColor = `rgba(255, ${255 - warmingIntensity * 200}, 0, ${0.3 + warmingIntensity * 0.5})`;
        
        // Mettre à jour les styles du soleil
        sun.style.background = `radial-gradient(circle, ${sunColor}, #FF4500)`;
        sun.style.boxShadow = `0 0 ${40 + warmingIntensity * 40}px ${sunColor}`;
        
        // Mettre à jour l'animation du soleil
        const pulseScale = 1 + (warmingIntensity * 0.2);
        const pulseDuration = 4 - (warmingIntensity * 2);
        
        sun.style.animation = `sunPulse ${pulseDuration}s ease-in-out infinite`;
        
        // Mettre à jour le style du halo
        sun.style.setProperty('--glow-color', glowColor);
        sun.style.setProperty('--pulse-scale', pulseScale);
    }

    // Mettre à jour les valeurs affichées et la simulation
    sliders.forEach(slider => {
        const valueDisplay = slider.nextElementSibling;
        
        slider.addEventListener('input', function() {
            valueDisplay.textContent = `${this.value}${this.id === 'transport' ? 'km' : 'h'}`;
            updateSimulation();
        });
    });

    // Initialiser la simulation
    updateSimulation();
});

// Mise à jour des valeurs des sliders
document.querySelectorAll('.slider').forEach(slider => {
    slider.addEventListener('input', function() {
        this.nextElementSibling.textContent = this.value + (this.id === 'transport' ? 'km' : 'h');
        updateVisualization();
    });
});

function updateVisualization() {
    const heating = parseInt(document.getElementById('heating').value);
    const lighting = parseInt(document.getElementById('lighting').value);
    const appliances = parseInt(document.getElementById('appliances').value);
    const transport = parseInt(document.getElementById('transport').value);

    // Calcul de l'empreinte carbone (en kg CO2)
    const carbonFootprint = (heating * 0.5) + (lighting * 0.2) + (appliances * 0.3) + (transport * 0.4);
    document.getElementById('carbon-footprint').textContent = carbonFootprint.toFixed(1) + ' kg CO2';

    // Calcul de l'impact sur le niveau de la mer (en cm)
    const seaLevelRise = carbonFootprint * 0.1;
    document.getElementById('sea-level').textContent = seaLevelRise.toFixed(2) + ' cm';

    // Mise à jour de la visualisation
    const waterLevel = document.querySelector('.water-level');
    const glacier = document.querySelector('.glacier');
    const sun = document.querySelector('.sun');

    // Ajustement du niveau d'eau (max 80% de la hauteur)
    waterLevel.style.height = (seaLevelRise * 2) + '%';
    
    // Ajustement de la hauteur du glacier
    glacier.style.height = (200 - seaLevelRise * 2) + 'px';

    // Ajustement de l'apparence du soleil en fonction de l'empreinte carbone
    const intensity = Math.min(carbonFootprint / 50, 1); // Normalisé entre 0 et 1
    sun.style.setProperty('--glow-color', `rgba(255, 215, 0, ${0.3 + intensity * 0.5})`);
    sun.style.setProperty('--pulse-scale', 1 + intensity * 0.2);
}
