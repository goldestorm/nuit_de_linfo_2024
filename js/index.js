// Variables pour le jeu principal
let temperature = 1.5; // En degrés Celsius
let biodiversity = 80; // En pourcentage
let pollution = 40; // En pourcentage

// Met à jour les valeurs affichées
function updateStats() {
  document.getElementById("temperature").textContent = `${temperature.toFixed(1)}°C`;
  adjustGameColor();
  checkGameOver();
}

// Ajuste les statistiques selon l'action du joueur
function adjustClimate(action) {
  const message = document.getElementById("message");
  switch (action) {
    case "renewable":
      temperature -= 0.2;
      pollution -= 10;
      message.textContent = "Vous avez investi dans les énergies renouvelables !";
      break;
    case "reforest":
      biodiversity += 10;
      pollution -= 5;
      message.textContent = "Vous avez reboisé des forêts 🌳 !";
      break;
    case "reduce_pollution":
      pollution -= 15;
      message.textContent = "Vous avez réduit la pollution industrielle !";
      break;
  }

  // Limite les statistiques pour qu'elles restent réalistes
  temperature = Math.max(0.5, Math.min(temperature, 20));
  biodiversity = Math.max(0, Math.min(biodiversity, 100));
  pollution = Math.max(0, Math.min(pollution, 100));

  updateStats();
}

// Ajuste la couleur de la div game en fonction de la température
function adjustGameColor() {
  const game = document.getElementById("game");
  const redValue = Math.min(255, Math.floor((temperature / 20) * 255));
  game.style.backgroundColor = `rgb(255, ${255 - redValue}, ${255 - redValue})`;
}

// Vérifie si le joueur a perdu
function checkGameOver() {
  const message = document.getElementById("message");
  const game = document.getElementById("game");

  if (temperature >= 15) {
    const titre = document.getElementById("titre");
    titre.textContent = "Ne vous inquiétez pas, il ne mord pas";
    message.textContent = "🌡️ La planète est trop chaude ! La partie est terminée.";
    const explanationMessage = document.getElementById('explanation-message1');
    explanationMessage.textContent = "Tout comme une fièvre élevée signale un danger pour le corps humain, le réchauffement des eaux océaniques est un signe alarmant pour la planète."
    +" L'augmentation de la température des océans perturbe les écosystèmes marins, provoque la mort des coraux et menace la biodiversité."
    +" À l'image d'un corps humain qui lutte pour réguler sa température, la Terre souffre de cette montée des eaux chaudes, un déséquilibre qui affecte tout l'équilibre climatique mondial."
    +" Réagir rapidement est essentiel pour éviter des conséquences irréversibles.";
    explanationMessage.style.display = 'inline-block';
    saveVictory("Temperature");
    game.style.opacity = 0; // Disparaît progressivement
    const hiddenButton = document.getElementById("hidden-page-button1");
    hiddenButton.style.display = 'inline-block';
    // Démarrer l'animation du bouton
    startButtonAnimation(document.getElementById("increase-temp-button"));
  }
}

// Gère le clic sur le bouton "Augmenter la température"
function handleIncreaseTemp() {
  const button = document.getElementById("increase-temp-button");
  const titre = document.getElementById("titre");
  titre.textContent += " ?";

  // Augmente la température
  temperature += 0.5;

  // Repositionner le bouton à l'intérieur de la div #game1
  positionButtonInsideGame(button);

  updateStats();
}

// Anime un bouton de manière aléatoire dans la div #game1
function startButtonAnimation(button) {
  function animate() {
    // Récupère la position de la div #game1
    const game1 = document.getElementById("game1");
    const gameRect = game1.getBoundingClientRect();

    // Calculer une nouvelle position aléatoire à l'intérieur de #game1
    const newX = Math.random() * (gameRect.width - button.offsetWidth);
    const newY = Math.random() * (gameRect.height - button.offsetHeight);

    // Appliquer la nouvelle position au bouton
    button.style.left = `${newX}px`;
    button.style.top = `${newY}px`;

    // Continue l'animation toutes les 200ms
    setTimeout(animate, 200);
  }
  animate();
}

// Positionne le bouton "Augmenter la Température" à l'intérieur de la div #game1
function positionButtonInsideGame(button) {
  const game1 = document.getElementById("game1"); // Utiliser game1 ici
  const gameRect = game1.getBoundingClientRect(); // Zone de la div #game1

  // Calculer une position aléatoire à l'intérieur de la zone de la div #game1
  let newX = Math.random() * (gameRect.width - button.offsetWidth);
  let newY = Math.random() * (gameRect.height - button.offsetHeight);

  button.style.left = `${newX}px`; // Ajouter la position relative de la div #game1
  button.style.top = `${newY}px`; // Ajouter la position relative de la div #game1
}

//PARTIE MINI JEU BALLS -------------------------------------------
let timeLeft = 10;
let ballCount = 8;
let gameInterval;

function updateTimer() {
  timeLeft--;
  document.getElementById("timer").textContent = `Temps restant : ${timeLeft}s`;

  if (timeLeft <= 0) {
    clearInterval(gameInterval);
    restartMiniGame();
  }
}

function removeBall(event) {
  const ball = event.target;
  const circleContainer = document.getElementById("circle-container");

  // Obtenez la position du cercle jaune
  const ballRect = ball.getBoundingClientRect();
  const containerRect = circleContainer.getBoundingClientRect();

  // Calculez la distance entre le centre du grand cercle et le centre du petit cercle
  const ballCenterX = ballRect.left + ballRect.width / 2;
  const ballCenterY = ballRect.top + ballRect.height / 2;
  const containerCenterX = containerRect.left + containerRect.width / 2;
  const containerCenterY = containerRect.top + containerRect.height / 2;

  // Calculez la distance entre les deux centres
  const distance = Math.sqrt(
    Math.pow(ballCenterX - containerCenterX, 2) + Math.pow(ballCenterY - containerCenterY, 2)
  );

  // Vérifiez si le cercle est en dehors du grand cercle
  const maxDistance = containerRect.width / 2; // Rayon du grand cercle
  if (distance > maxDistance) {
    ball.style.pointerEvents = "none"; // Désactive les interactions pour ce cercle
    ball.style.visibility = "hidden"; // Cache le cercle
    ballCount--;
  }

  if (ballCount == 0) {
    const div = document.getElementById("mini-game");
    const hiddenButton = document.getElementById("hidden-page-button2");
    hiddenButton.style.display = 'inline-block';
    const explanationMessage = document.getElementById('explanation-message1');
    explanationMessage.textContent = "Tout comme le cholestérol obstrue les artères et menace la santé du cœur, les déchets dans l'océan s'accumulent et perturbent l'écosystème marin."
    +" Ces déchets, notamment les plastiques, créent une pollution durable qui bloque les cycles naturels et empoisonne les organismes marins."
    +" À long terme, cette accumulation compromet l’équilibre écologique des océans, tout comme le cholestérol met en danger la vitalité du corps humain."
    +" Agir pour réduire ces déchets, c'est préserver la santé de nos océans et, par extension, celle de notre planète.";
    explanationMessage.style.display = 'inline-block';
    saveVictory("Plastique");
    div.remove();
  }
}

function startMiniGame() {
  timeLeft = 15;
  ballCount = 8;
  document.getElementById("timer").textContent = `Temps restant : ${timeLeft}s`;

  const circleContainer = document.getElementById("circle-container");
  const balls = document.querySelectorAll(".ball");

  // Réinitialiser les positions des boules et les styles
  balls.forEach((ball) => {
    ball.style.pointerEvents = 'auto'; // Activer les interactions
    ball.style.visibility = 'visible'; // Afficher la boule
    ball.style.left = ''; // Réinitialiser la position horizontale
    ball.style.top = ''; // Réinitialiser la position verticale
  });

  balls.forEach((ball) => {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * (circleContainer.offsetWidth / 2 - ball.offsetWidth);
    const x =
      circleContainer.offsetWidth / 2 + radius * Math.cos(angle) - ball.offsetWidth / 2;
    const y =
      circleContainer.offsetHeight / 2 + radius * Math.sin(angle) - ball.offsetHeight / 2;

    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;

    // Rendre les cercles déplaçables
    makeBallDraggable(ball);

    // Ajouter l'événement de suppression lors du clic
    ball.addEventListener("click", removeBall);
  });

  // Démarrer le compte à rebours
  gameInterval = setInterval(updateTimer, 1000);
}

function makeBallDraggable(ball) {
  let offsetX, offsetY;

  ball.addEventListener("mousedown", (e) => {
    offsetX = e.clientX - ball.getBoundingClientRect().left;
    offsetY = e.clientY - ball.getBoundingClientRect().top;

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  });

  function onMouseMove(e) {
    const container = document.getElementById("circle-container").getBoundingClientRect();
    const ballWidth = ball.offsetWidth;
    const ballHeight = ball.offsetHeight;

    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;

    // Contraintes pour rester dans le cercle parent
    const minX = container.left;
    const maxX = container.right - ballWidth;
    const minY = container.top;
    const maxY = container.bottom - ballHeight;

    x = Math.max(minX, Math.min(x, maxX));
    y = Math.max(minY, Math.min(y, maxY));

    ball.style.left = `${x - container.left}px`;
    ball.style.top = `${y - container.top}px`;
  }

  function onMouseUp() {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  }
}

function restartMiniGame() {
  // Annuler l'ancien intervalle
  clearInterval(gameInterval);

  // Réinitialiser les variables du mini-jeu
  timeLeft = 15;
  ballCount = 8;
  document.getElementById("timer").textContent = `Temps restant : ${timeLeft}s`;

  // Réinitialiser le bouton et la page cachée
  const hiddenButton = document.getElementById("hidden-page-button2");
  hiddenButton.style.display = 'none';

  // Supprimer l'ancien mini-jeu, s'il existe déjà
  const existingMiniGame = document.getElementById("mini-game");
  if (existingMiniGame) {
    existingMiniGame.remove();
  }

  // Créer un nouveau conteneur pour le mini-jeu
  const newMiniGame = document.createElement('div');
  newMiniGame.id = 'mini-game';
  document.body.appendChild(newMiniGame);

  // Créer la zone de jeu
  const gameZone = document.createElement('div');
  gameZone.id = 'game-zone';
  newMiniGame.appendChild(gameZone);

  // Créer les cercles jaunes
  const circleContainer = document.createElement('div');
  circleContainer.id = 'circle-container';
  gameZone.appendChild(circleContainer);

  for (let i = 0; i < ballCount; i++) {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    circleContainer.appendChild(ball);
  }

  // Créer l'élément de timer
  const timerDiv = document.createElement('div');
  timerDiv.id = 'timer';
  timerDiv.textContent = `Temps restant : ${timeLeft}s`;
  newMiniGame.appendChild(timerDiv);

  // Créer le bouton de relance
  const restartButton = document.createElement('button');
  restartButton.id = 'restart-button';
  restartButton.textContent = "Relancer le jeu";
  restartButton.onclick = restartMiniGame;
  newMiniGame.appendChild(restartButton);

  // Redémarrer le mini-jeu
  startMiniGame();
}

// Démarre le mini-jeu dès le chargement
startMiniGame();

function loadVictories() {
  const savedVictories = localStorage.getItem('victories');
  return savedVictories ? JSON.parse(savedVictories) : [];
}

function saveVictory(gameName) {
  const victories = loadVictories(); // Charge les victoires existantes
  if (!victories.includes(gameName)) { // Évite les doublons
    console.log("Victoires sauvegardées :", victories);
      victories.push(gameName); // Ajoute la victoire
      localStorage.setItem('victories', JSON.stringify(victories)); // Sauvegarde
  }
}

