// Variables globales
let playerName = '';
let score = 0;
let timeLeft = 30;
let gameInterval;
let redDots = [];

// Références HTML
const dot = document.getElementById('dot');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');
const startButton = document.getElementById('start-button');
const clickSound = document.getElementById('click-sound');
const backgroundMusic = document.getElementById('background-music');
const redDotClickSound = document.getElementById('red-dot-click-sound');

// Fonction pour démarrer le jeu
function startGame() {
    playerName = prompt('Entrez votre nom :');
    if (!playerName) {
        alert("Vous devez entrer un nom pour jouer.");
        return;
    }

    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timeLeft;
    startButton.disabled = true;

    // Démarre la musique de fond
    backgroundMusic.play();

    gameInterval = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    showDot();
}

// Fonction pour afficher le point à un endroit aléatoire
function showDot() {
    const x = Math.floor(Math.random() * (gameContainer.clientWidth - 50));
    const y = Math.floor(Math.random() * (gameContainer.clientHeight - 50));
    
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.display = 'block';
}

// Fonction pour gérer le clic sur le point principal
dot.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
    dot.style.display = 'none';
    showDot(); // Affiche le point à un autre endroit immédiatement après un clic
    clickSound.play(); // Joue le son de clic
    generateRedDot(); // Ajoute un nouveau point rouge à chaque point gagné
});

// Fonction pour générer un point rouge
function generateRedDot() {
    const redDot = document.createElement('div');
    redDot.className = 'red-dot';
    const x = Math.random() * (gameContainer.clientWidth - 20);
    const y = Math.random() * (gameContainer.clientHeight - 20);
    redDot.style.left = `${x}px`;
    redDot.style.top = `${y}px`;
    gameContainer.appendChild(redDot);
    redDots.push(redDot);

    // Ajouter un événement de clic pour le point rouge
    redDot.addEventListener('click', () => {
        score--;
        scoreDisplay.textContent = score;
        flashScreen(); // Appliquer l'effet de flash
        redDot.remove(); // Retirer le point rouge quand il est cliqué
        redDotClickSound.play(); // Joue le son de clic sur le point rouge
    });

    // Faire bouger le point rouge
    moveRedDot(redDot);
}

// Fonction pour faire bouger un point rouge
function moveRedDot(redDot) {
    const move = () => {
        const x = Math.random() * (gameContainer.clientWidth - 20);
        const y = Math.random() * (gameContainer.clientHeight - 20);
        redDot.style.left = `${x}px`;
        redDot.style.top = `${y}px`;
    };

    setInterval(move, 1000); // Change de position toutes les secondes
}

// Fonction pour flasher l'écran
function flashScreen() {
    document.body.classList.add('blur-effect'); // Ajoute l'effet de flou
    setTimeout(() => {
        document.body.classList.remove('blur-effect'); // Retire l'effet de flou après 3 secondes
    }, 3000); // Délai de 3000 ms (3 secondes)
}

// Fonction pour terminer le jeu
function endGame() {
    clearInterval(gameInterval);
    dot.style.display = 'none';
    startButton.disabled = false;

    // Retire tous les points rouges
    redDots.forEach(redDot => redDot.remove());
    redDots = [];

    alert(`Jeu terminé, ${playerName} ! Votre score final est de ${score}`);
    backgroundMusic.pause(); // Arrête la musique de fond
    backgroundMusic.currentTime = 0; // Remet la musique au début
}

// Événement pour démarrer le jeu
startButton.addEventListener('click', startGame);
