// Charge les victoires et affiche les trophées
function displayTrophies() {
    const trophies = loadVictories();
    const container = document.getElementById('trophy-container');

    if (trophies.length === 0) {
        container.innerHTML = "<p>Aucun trophée débloqué pour l'instant.</p>";
        return;
    }

    container.innerHTML = ''; // Réinitialise le contenu du conteneur
    trophies.forEach(trophy => {
        const trophyElement = document.createElement('div');
        trophyElement.classList.add('trophy');
        trophyElement.draggable = true; // Permet de faire glisser l'image
        trophyElement.innerHTML = `
            <img src="../img/${trophy}.png" alt="${trophy}">
            <div class="trophy-title">${trophy}</div>
        `;
        container.appendChild(trophyElement);

        // Ajoute l'événement de glisser
        trophyElement.addEventListener('dragstart', dragStart);
    });
}

// Fonction pour démarrer le glisser
function dragStart(e) {
    e.dataTransfer.setData('text', e.target.innerHTML); // Transfert les données (le trophée)
}

// Fonction pour gérer l'événement de glissement sur un cercle bleu
function allowDrop(e) {
    e.preventDefault(); // Nécessaire pour permettre le drop
}

// Fonction pour gérer l'événement de drop
function drop(e) {
    e.preventDefault();
    const target = e.target;

    // Si c'est un cercle bleu, on diminue l'opacité à chaque fois qu'un trophée est déposé dessus
    if (target.classList.contains('blue-circle')) {
        let opacity = parseFloat(target.style.opacity || 1);
        opacity -= 0.2; // Réduit l'opacité de 0.2
        target.style.opacity = opacity;

        // Si l'opacité atteint 0, on supprime le cercle
        if (opacity <= 0) {
            target.remove();
            checkAllCirclesRemoved(); // Vérifie si tous les cercles sont supprimés
        }
    }

    // Si c'est la porte et qu'on dépose la clé (Temperature)
    if (target.id === 'door' && e.dataTransfer.getData('text').includes('Fuite')) {
        target.style.backgroundImage = 'url("../img/Kraken.png")'; // Remplacer la porte par le Kraken
        target.removeEventListener('drop', drop); // Désactive l'interaction avec la porte
        target.id = 'kraken'; // Change l'id de la porte en Kraken
        target.addEventListener('drop', dropOnKraken); // Active l'interaction avec Kraken
    }

    // Si c'est Kraken et qu'on dépose le trophée Plastique
    if (target.id === 'kraken' && e.dataTransfer.getData('text').includes('Plastique')) {
        openYouTubeVideo(); // Ouvre la vidéo YouTube lorsque Plastique est déposé sur Kraken
    }
}

// Fonction pour vérifier si tous les cercles sont supprimés
function checkAllCirclesRemoved() {
    const remainingCircles = document.querySelectorAll('.blue-circle');
    if (remainingCircles.length === 0) {
        showDoor(); // Affiche la porte une fois tous les cercles supprimés
    }
}

// Afficher la porte lorsque tous les cercles ont disparu
function showDoor() {
    const gameArea = document.getElementById('game-area');
    const door = document.createElement('div');
    door.id = 'door'; // L'ID de la porte ici
    door.classList.add('door');
    door.style.position = 'absolute';
    door.style.bottom = '50px';
    door.style.left = '50%';
    door.style.transform = 'translateX(-50%)';
    door.style.width = '100px';
    door.style.height = '150px';
    door.style.backgroundImage = 'url("../img/Porte.png")';
    door.style.backgroundSize = 'cover';

    // Ajout d'un événement de drop sur la porte
    door.addEventListener('dragover', allowDrop);
    door.addEventListener('drop', drop);

    gameArea.appendChild(door);
}

// Fonction qui ouvre la vidéo YouTube lorsque le trophée est déposé sur Kraken
function openYouTubeVideo() {
    const videoUrl = 'https://www.youtube.com/watch?v=tIkvVGeB3Rg'; // Exemple de vidéo YouTube (remplacez par l'URL souhaitée)
    window.open(videoUrl, '_blank'); // Ouvre la vidéo dans un nouvel onglet
}

// Fonction pour gérer l'interaction avec Kraken
function dropOnKraken(e) {
    e.preventDefault();
    const target = e.target;

    // Vérifie que c'est bien le trophée Plastique qui est déposé sur Kraken
    if (e.dataTransfer.getData('text').includes('Plastique')) {
        target.id = 'kraken'; // Change l'id pour Kraken
        openYouTubeVideo(); // Ouvre la vidéo YouTube
    }
}

// Charge les victoires depuis localStorage
function loadVictories() {
    const savedVictories = localStorage.getItem('victories');
    return savedVictories ? JSON.parse(savedVictories) : [];
}

// Réinitialise les trophées
function resetVictories() {
    localStorage.removeItem('victories');
    displayTrophies(); // Met à jour l'affichage après réinitialisation
}

// Écouteur pour réinitialiser les trophées
document.getElementById('reset-button').addEventListener('click', resetVictories);

// Affiche les trophées au chargement de la page
document.addEventListener('DOMContentLoaded', displayTrophies);

// Fonction pour ajouter des cercles bleus
function addBlueCircles() {
    const gameArea = document.getElementById('game-area'); // Zone de jeu

    // Crée 5 cercles bleus (vous pouvez ajuster ce nombre selon vos préférences)
    for (let i = 0; i < 5; i++) {
        const circle = document.createElement('div');
        circle.classList.add('blue-circle');
        
        // Positionne les cercles à des endroits aléatoires à l'extérieur de la div des trophées
        circle.style.left = `${Math.random() * (gameArea.clientWidth - 50)}px`;
        circle.style.top = `${Math.random() * (gameArea.clientHeight - 50)}px`;

        // Ajoute les événements pour permettre le drop
        circle.addEventListener('dragover', allowDrop);
        circle.addEventListener('drop', drop);

        gameArea.appendChild(circle); // Ajoute les cercles à la zone de jeu
    }
}


// Ajout des cercles bleus au démarrage du jeu
addBlueCircles();
