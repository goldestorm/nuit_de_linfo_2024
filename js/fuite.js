const player = document.getElementById('player');
const enemies = [];
const gameArea = document.getElementById('game-area');
const gameOverMessage = document.getElementById('game-over-message');
const timerDisplay = document.getElementById('timer'); // Affichage du chronomètre
const additionalMessage = document.getElementById('additional-message'); // Message supplémentaire
const restartButton = document.getElementById('restart-button'); // Récupère le bouton "Recommencer"
const continueButton = document.getElementById('continuer-button'); // Récupère le bouton "Continuer"

let isGameOver = false;
let timeLeft = 10; // Temps initial (10 secondes)
let timerInterval;
let enemySpawnInterval; // Variable pour stocker l'intervalle de spawn des ennemis

// Chargement de la progression au démarrage
const previousProgress = loadVictories();
if (previousProgress.includes("Fuite")) {
    console.log("Progression précédente : Fuite déjà accomplie.");
    // Ajoute une logique spécifique ici
}

function startTimer() {
    // Affiche le chronomètre à l'écran
    timerInterval = setInterval(() => {
      if (isGameOver) return;
  
      if (timeLeft > 0) {
        timeLeft--; // Décrémente le temps restant
      } else if (timeLeft > -30) {
        timeLeft--; // Après 10 secondes, le temps devient négatif
      }
  
      timerDisplay.textContent = `Temps restant : ${timeLeft} secondes`; // Met à jour l'affichage du chronomètre
  
      // Affiche des messages en fonction du temps
      if (timeLeft === 0) {
        additionalMessage.textContent = "Encore 10 secondes"; // Message à 0 secondes
      } else if (timeLeft === -10) {
        additionalMessage.textContent = "Pourquoi pas 30 secondes ? Tu t'amuses là ?"; // Message à -10 secondes
      }
  
      if (timeLeft <= -30) {
        clearInterval(timerInterval); // Stoppe le chronomètre quand il atteint -20
      }
  
      // Vérifie si le joueur a gagné lorsque le temps atteint -30
      if (timeLeft <= -30) {
        gameWon(); // Appel à la fonction de victoire
      }
    }, 1000); // Mise à jour toutes les secondes
  }
  
// Gère la victoire du joueur

function gameWon() {
  isGameOver = true;
  gameOverMessage.textContent = "Félicitations ! Vous avez gagné !"; // Message de victoire
  gameOverMessage.style.display = 'block';
  
  // Utilisation du conteneur pour le message explicatif
  const explanationMessage = document.getElementById('explanation-message');
  explanationMessage.textContent = 
  "Le réchauffement climatique, tout comme un corps humain affaibli, bouleverse les équilibres naturels. Dans les océans, des prédateurs émergent ou migrent vers des zones où ils n'étaient pas présents, perturbant les écosystèmes." 
  + " De la même manière, dans le corps humain, des virus inattendus peuvent s'introduire dans des zones autrefois protégées." 
  + " Comme les océans, notre corps lutte pour s'adapter à ces nouvelles menaces, mais il peut être submergé si ses défenses naturelles sont dépassées.";

  explanationMessage.style.display = 'inline-block';
  
  // Affiche le bouton "Continuer"
  continueButton.style.display = 'inline-block'; // Affiche le bouton "Continuer"
  
  // Arrête le chronomètre et sauvegarde
  saveVictory("Fuite");
  clearInterval(enemySpawnInterval); // Arrête la création d'ennemis
  clearInterval(timerInterval); // Arrête le chronomètre
}


// Met le joueur sous la souris
document.addEventListener('mousemove', (e) => {
  if (isGameOver) return; // Stoppe le jeu si "Game Over"
  const rect = gameArea.getBoundingClientRect();
  const x = e.clientX - rect.left - player.offsetWidth / 2;
  const y = e.clientY - rect.top - player.offsetHeight / 2;

  // Conserve le joueur dans les limites du jeu
  if (x >= 0 && x <= gameArea.clientWidth - player.offsetWidth) {
    player.style.left = `${x}px`;
  }
  if (y >= 0 && y <= gameArea.clientHeight - player.offsetHeight) {
    player.style.top = `${y}px`;
  }
});

// Initialisation d'un ennemi dans un coin aléatoire
function initEnemy() {
  let x, y;
  const corners = [
    { x: 0, y: 0 }, // Coin en haut à gauche
    { x: gameArea.clientWidth - 30, y: 0 }, // Coin en haut à droite
    { x: 0, y: gameArea.clientHeight - 30 }, // Coin en bas à gauche
    { x: gameArea.clientWidth - 30, y: gameArea.clientHeight - 30 } // Coin en bas à droite
  ];

  // Choisir un coin aléatoire parmi les quatre
  const randomCorner = corners[Math.floor(Math.random() * corners.length)];
  x = randomCorner.x;
  y = randomCorner.y;

  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.style.left = `${x}px`;
  enemy.style.top = `${y}px`;

  gameArea.appendChild(enemy);
  enemies.push(enemy);
}

// Déplace les ennemis vers le joueur
function moveEnemies() {
  if (isGameOver) return;

  enemies.forEach((enemy) => {
    const enemyRect = enemy.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    // Calcule la distance pour chaque axe
    const dx = playerRect.left + playerRect.width / 2 - (enemyRect.left + enemyRect.width / 2);
    const dy = playerRect.top + playerRect.height / 2 - (enemyRect.top + enemyRect.height / 2);

    // Normalise le déplacement pour un mouvement fluide
    const distance = Math.sqrt(dx * dx + dy * dy);
    const moveX = (dx / distance) * 4; // Augmente la vitesse horizontale (vitesse multipliée par 5)
    const moveY = (dy / distance) * 4; // Augmente la vitesse verticale (vitesse multipliée par 5)

    // Met à jour la position de l'ennemi
    const newX = parseFloat(enemy.style.left) + moveX;
    const newY = parseFloat(enemy.style.top) + moveY;

    enemy.style.left = `${newX}px`;
    enemy.style.top = `${newY}px`;

    // Vérifie la collision avec le joueur
    if (isColliding(player, enemy)) {
      gameOver();
    }
  });

  requestAnimationFrame(moveEnemies);
}

// Vérifie si deux éléments se touchent
function isColliding(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  return !(
    rect1.top > rect2.bottom ||
    rect1.bottom < rect2.top ||
    rect1.left > rect2.right ||
    rect1.right < rect2.left
  );
}

// Gère la fin du jeu
function gameOver() {
  isGameOver = true;
  gameOverMessage.textContent = "Game Over ! Vous avez été touché.";
  gameOverMessage.style.display = 'block';
  restartButton.style.display = 'inline-block'; // Affiche le bouton "Recommencer"
  clearInterval(timerInterval); // Arrête le chronomètre
  clearInterval(enemySpawnInterval); // Arrête la création d'ennemis
}

// Ajoute un ennemi toutes les 1 seconde
enemySpawnInterval = setInterval(initEnemy, 1000); // Intervalle réduit à 1 seconde

// Démarre le chronomètre
startTimer();

// Initialisation des ennemis
moveEnemies();

// Fonction pour recommencer le jeu
function restartGame() {
  // Réinitialisation des variables du jeu
  isGameOver = false;
  timeLeft = 10;
  timerDisplay.textContent = `Temps restant : ${timeLeft} secondes`;
  additionalMessage.textContent = "";
  enemies.forEach(enemy => enemy.remove()); // Supprime les ennemis
  enemies.length = 0; // Vide le tableau des ennemis
  gameArea.innerHTML = ''; // Vide la zone de jeu
  gameArea.appendChild(player); // Rajoute le joueur au centre

  // Cache le message et le bouton "Recommencer"
  gameOverMessage.style.display = 'none';
  restartButton.style.display = 'none';

  // Redémarre le chronomètre et le mouvement des ennemis
  startTimer();
  enemySpawnInterval = setInterval(initEnemy, 1000); 
  moveEnemies();
}

// Ajoute un écouteur d'événements au bouton "Recommencer"
restartButton.addEventListener('click', restartGame);

function saveVictory(gameName) {
  const victories = loadVictories(); // Charge les victoires existantes
  if (!victories.includes(gameName)) { // Évite les doublons
    console.log("Victoires sauvegardées :", victories);
      victories.push(gameName); // Ajoute la victoire
      localStorage.setItem('victories', JSON.stringify(victories)); // Sauvegarde
  }
}

function loadVictories() {
  const savedVictories = localStorage.getItem('victories');
  return savedVictories ? JSON.parse(savedVictories) : [];
}

function resetVictories() {
  localStorage.removeItem('victories'); // Supprime toutes les victoires
  console.log("Toutes les victoires ont été réinitialisées.");
}

