const dot = document.getElementById('dot');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');
const startButton = document.getElementById('start-button');

let score = 0;
let timeLeft = 30;
let gameInterval;
let dotTimeout;

// Fonction pour démarrer le jeu
function startGame() {
    score = 0;
    timeLeft = 30;
    scoreDisplay.textContent = score;
    timeLeftDisplay.textContent = timeLeft;
    startButton.disabled = true;

    gameInterval = setInterval(() => {
        timeLeft--;
        timeLeftDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        } else {
            showDot();
        }
    }, 1000);

    showDot();
}

// Fonction pour afficher le point à un endroit aléatoire
function showDot() {
    const x = Math.floor(Math.random() * (gameContainer.clientWidth - 30));
    const y = Math.floor(Math.random() * (gameContainer.clientHeight - 30));
    
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.display = 'block';

    // Cache le point après un certain temps si le joueur ne clique pas dessus
    clearTimeout(dotTimeout);
    dotTimeout = setTimeout(() => {
        dot.style.display = 'none';
    }, 800);
}

// Fonction pour gérer le clic sur le point
dot.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
    dot.style.display = 'none';
});

// Fonction pour terminer le jeu
function endGame() {
    clearInterval(gameInterval);
    clearTimeout(dotTimeout);
    dot.style.display = 'none';
    startButton.disabled = false;
    alert(`Game over! Your final score is ${score}`);
}

startButton.addEventListener('click', startGame);
