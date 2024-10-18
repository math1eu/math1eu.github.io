const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Paramètres du jeu
const gravity = 0.3; // Réduire la gravité pour ralentir la chute
const jumpStrength = -10;
const speed = 2; // Réduire la vitesse de déplacement
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
let keys = {
    left: false,
    right: false,
    jump: false
};

// Gestion des touches physiques
canvas.addEventListener('touchstart', (e) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;

    // Vérifiez si l'utilisateur touche la flèche gauche
    if (touchX < canvas.width / 2 - 50 && touchY > canvas.height - 70) {
        keys.left = true;
    } 
    // Vérifiez si l'utilisateur touche la flèche droite
    else if (touchX > canvas.width / 2 + 50 && touchY > canvas.height - 70) {
        keys.right = true;
    } 
    // Vérifiez si l'utilisateur touche le bouton de saut
    else if (touchX > canvas.width / 2 - 25 && touchX < canvas.width / 2 + 25 && touchY > canvas.height - 70) {
        if (player.grounded) {
            player.speedY = jumpStrength;
            player.grounded = false;
        }
        keys.jump = true; // Mettez à jour l'état du saut
    }
});

canvas.addEventListener('touchend', () => {
    keys.left = false;
    keys.right = false;
    keys.jump = false; // Réinitialiser l'état du saut
});

// Gérer les touches au clavier pour le jeu
window.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') {
        keys.left = true;
    } else if (e.key === 'ArrowRight') {
        keys.right = true;
    }
    // Si la touche 'Espace' est pressée et que le joueur est au sol, il saute
    if (e.key === ' ' && player.grounded) {
        player.speedY = jumpStrength;
        player.grounded = false;
    }
});

window.addEventListener('keyup', e => {
    if (e.key === 'ArrowLeft') {
        keys.left = false;
    } else if (e.key === 'ArrowRight') {
        keys.right = false;
    }
});

// Fonction de mise à jour du jeu
function update() {
    if (gameOverState) return; // Ne met à jour rien si le jeu est terminé

    // Déplacement horizontal
    if (keys.left && player.x > 0) { // Empêche de revenir au début
        player.speedX = -speed;
    } else if (keys.right) {
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
    if (player.x > canvas.width * 0.6 && keys.right) {
        scrollOffset += player.speedX;
        player.x = canvas.width * 0.6; // Garde le joueur à cette position pendant le défilement
        score++; // Augmenter le score avec le défilement
    }

    // Si le joueur atteint la position de 40% de la largeur du canvas et se déplace vers la gauche
    if (player.x < canvas.width * 0.4 && keys.left && scrollOffset > 0) {
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

    // Dessiner les contrôles
    drawControls();
}

// Fonction pour dessiner les flèches directionnelles
function drawControls() {
    ctx.fillStyle = 'gray'; // Couleur de fond des flèches

    // Flèche gauche
    ctx.beginPath();
    ctx.moveTo(50, canvas.height - 50);
    ctx.lineTo(30, canvas.height - 70);
    ctx.lineTo(30, canvas.height - 30);
    ctx.closePath();
    ctx.fill();

    // Flèche droite
    ctx.beginPath();
    ctx.moveTo(canvas.width - 50, canvas.height - 50);
    ctx.lineTo(canvas.width - 30, canvas.height - 70);
    ctx.lineTo(canvas.width - 30, canvas.height - 30);
    ctx.closePath();
    ctx.fill();

    // Flèche saut
    ctx.fillStyle = 'lightblue'; // Couleur de fond du saut
    ctx.fillRect(canvas.width / 2 - 25, canvas.height - 70, 50, 20); // Bouton de saut
    ctx.fillStyle = 'black';
    ctx.fillText('Saut', canvas.width / 2 - 15, canvas.height - 55);
}

// Fonction de Game Over
function gameOver() {
    gameOverState = true;
    alert(`Game Over! Your score: ${score}`);
}

// Boucle de jeu
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop(); // Démarrer la boucle de jeu
