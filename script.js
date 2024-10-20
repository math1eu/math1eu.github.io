const dot = document.getElementById('dot');
const gameContainer = document.getElementById('game-container');
const scoreDisplay = document.getElementById('score');
const timeLeftDisplay = document.getElementById('time-left');
const startButton = document.getElementById('start-button');
const scoreList = document.getElementById('score-list');

let playerName = '';
let score = 0;
let timeLeft = 30;
let gameInterval;
let dotTimeout;
let topScores = JSON.parse(localStorage.getItem('topScores')) || [];

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

// Fonction pour gérer le clic sur le point
dot.addEventListener('click', () => {
    score++;
    scoreDisplay.textContent = score;
    dot.style.display = 'none';
    showDot(); // Affiche le point à un autre endroit immédiatement après un clic
});

// Fonction pour terminer le jeu
function endGame() {
    clearInterval(gameInterval);
    clearTimeout(dotTimeout);
    dot.style.display = 'none';
    startButton.disabled = false;

    // Ajouter le score actuel à la liste des meilleurs scores
    updateTopScores(playerName, score);
    alert(`Jeu terminé, ${playerName} ! Votre score final est de ${score}`);
}

// Met à jour le tableau des meilleurs scores
function updateTopScores(name, newScore) {
    topScores.push({ name, score: newScore });
    topScores.sort((a, b) => b.score - a.score);
    topScores = topScores.slice(0, 5); // Garde uniquement les 5 meilleurs scores
    localStorage.setItem('topScores', JSON.stringify(topScores));
    displayTopScores();
}

// Affiche les meilleurs scores dans le HTML
function displayTopScores() {
    scoreList.innerHTML = '';
    topScores.forEach(({ name, score }, index) => {
        const scoreItem = document.createElement('li');
        scoreItem.textContent = `${name} : ${score} points`;
        scoreList.appendChild(scoreItem);
    });
}

startButton.addEventListener('click', startGame);
displayTopScores();
