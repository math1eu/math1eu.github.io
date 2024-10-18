const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Paramètres du jeu
const gravity = 0.5;
const jumpStrength = -10;
const speed = 5;
let scrollOffset = 0; // Décalage de défilement
let gameOverState = false; // État de Game Over
let score = 0; // Initialiser le score

// Dimensions du joueur
const player = {
    x: 0,
    y: 0,
    width: 30,  // Largeur de l'image
    height: 40, // Hauteur de l'image
    speedX: 0,
    speedY: 0,
    grounded: false,
    image: new Image() // Création d'une nouvelle image
};

// Image du joueur
player.image.src = 'images/perso.png'; 

// Plateformes 
const platforms = [
    { x: 0, y: 200, width: 400, height: 10 },   // Sol élevé
    { x: 500, y: 150, width: 100, height: 10 }, // Plateforme 1
    { x: 700, y: 100, width: 200, height: 10 }, // Plateforme 2
    { x: 1000, y: 200, width: 300, height: 10 }  // Sol élevé
];

// Obstacles 
const obstacles = [
    { x: 150, y: 160, width: 20, height: 40 },  // Obstacle sur la première plateforme
    { x: 800, y: 60, width: 20, height: 40 }    // Obstacle sur la deuxième plateforme
];

// Gérer les touches
let keys = {};

window.addEventListener('keydown', e => {
    keys[e.key] = true;

    // Si la touche 'Espace' est pressée et que le joueur est au sol, il saute
    if (e.key === ' ' && player.grounded) {
        player.speedY = jumpStrength;
        player.grounded = false;
    }
});

window.addEventListener('keyup', e => {
    keys[e.key] = false;
});

// Gérer les contrôles tactiles
canvas.addEventListener('touchstart', (e) => {
    const touchX = e.touches[0].clientX;
    if (touchX < canvas.width / 2) {
        // Si on touche à gauche de l'écran
        keys['ArrowLeft'] = true;
    } else {
        // Si on touche à droite de l'écran
        keys['ArrowRight'] = true;
    }
});

canvas.addEventListener('touchend', () => {
    keys['ArrowLeft'] = false;
    keys['ArrowRight'] = false;
    if (player.grounded) {
        player.speedY = jumpStrength;
    }
});

// Fonction de mise à jour du jeu
function update() {
    if (gameOverState) return; // Ne met à jour rien si le jeu est terminé

    // Déplacement horizontal
    if (keys['ArrowLeft'] && player.x > 0) { // Empêche de revenir au début
        player.speedX = -speed;
    } else if (keys['ArrowRight']) {
        player.speedX = speed;
    } else {
        player.speedX = 0;
    }

    // Appliquer la gravité
    player.speedY += gravity;

    // Déplacer le joueur
    player.x += player.speedX;
    player.y += player.speedY;

    // Si le joueur atteint la position de 60% de la largeur du canvas et se déplace vers la droite
    if (player.x > canvas.width * 0.6 && keys['ArrowRight']) {
        scrollOffset += player.speedX;
        player.x = canvas.width * 0.6; // Garde le joueur à cette position pendant le défilement
        score++; // Augmenter le score avec le défilement
    }

    // Si le joueur atteint la position de 40% de la largeur du canvas et se déplace vers la gauche
    if (player.x < canvas.width * 0.4 && keys['ArrowLeft'] && scrollOffset > 0) {
        scrollOffset += player.speedX;
        player.x = canvas.width * 0.4; // Garde le joueur à cette position pendant le défilement
    }

    // Collision avec les plateformes (ajustées pour le défilement)
    player.grounded = false;
    for (let platform of platforms) {
        if (player.x < platform.x - scrollOffset + platform.width &&
            player.x + player.width > platform.x - scrollOffset &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y) {
            player.y = platform.y - player.height;
            player.speedY = 0;
            player.grounded = true;
        }
    }

    // Vérifier la collision avec les obstacles
    for (let obstacle of obstacles) {
        const obstacleRelativeX = obstacle.x - scrollOffset; // Position de l'obstacle en tenant compte du défilement
        if (player.x < obstacleRelativeX + obstacle.width &&
            player.x + player.width > obstacleRelativeX &&
            player.y < obstacle.y + obstacle.height &&
            player.y + player.height > obstacle.y) {
            gameOver(); // Si le joueur touche un obstacle, appeler gameOver
        }
    }

    // Vérifier si le joueur est tombé hors des plateformes
    if (player.y > canvas.height) {
        gameOver(); // Si le joueur tombe hors de l'écran, appeler gameOver
    }
}

// Fonction de dessin
function draw() {
    // Effacer le canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le joueur (image)
    ctx.drawImage(player.image, player.x, player.y, player.width, player.height);

    // Dessiner les plateformes (en tenant compte du défilement)
    ctx.fillStyle = 'green';
    for (let platform of platforms) {
        ctx.fillRect(platform.x - scrollOffset, platform.y, platform.width, platform.height);
    }

    // Dessiner les obstacles (en tenant compte du défilement pour l'illusion de fixation)
    ctx.fillStyle = 'blue'; // Couleur des obstacles
    for (let obstacle of obstacles) {
        ctx.fillRect(obstacle.x - scrollOffset, obstacle.y, obstacle.width, obstacle.height);
    }

    // Afficher le score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30); // Afficher le score en haut à gauche
}

// Fonction de game over
function gameOver() {
    if (!gameOverState) { // Vérifiez si le jeu est déjà terminé
        gameOverState = true; // Définir l'état de game over
        alert(`Game Over! Vous avez heurté un obstacle ! Votre score est ${score}`);
        // Réinitialiser le jeu ou recharger la page
        location.reload(); 
    }
}

// Boucle de jeu
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Démarrer la boucle de jeu
player.image.onload = function() {
    gameLoop(); // Démarrer la boucle de jeu après le chargement de l'image
};
