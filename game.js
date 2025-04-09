const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const healthDisplay = document.getElementById('health');
const scoreDisplay = document.getElementById('score');
const levelDisplay = document.getElementById('level');
const fireRateLevelDisplay = document.getElementById('fireRateLevel');
const bulletCountLevelDisplay = document.getElementById('bulletCountLevel');
const healthLevelDisplay = document.getElementById('healthLevel');
const bossDistanceDisplay = document.getElementById('bossDistance');
const bossDistanceText = document.getElementById('bossDistanceText');
const bossHealthBar = document.getElementById('bossHealthBar');
const bossHealthContainer = document.getElementById('bossHealthDisplay');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreDisplay = document.getElementById('finalScore');
const finalLevelDisplay = document.getElementById('finalLevel');
const levelUpScreen = document.getElementById('levelUp');
const startScreen = document.getElementById('startScreen');
const instructions = document.getElementById('instructions');
const startGameButton = document.getElementById('startGame');
const showInstructionsButton = document.getElementById('showInstructions');
const backToStartButton = document.getElementById('backToStart');
const toggleModeButton = document.getElementById('toggleMode');

canvas.width = 993;
canvas.height = 743;

let player = new Player();
let enemies = [];
let powerUps = [];
let bullets = [];
let bossBullets = [];
let particles = [];
let boss = null;
let keys = {};
let gameRunning = false;
let currentLevel = 1;
let levelTimeLeft = 20;
let lastTime = Date.now();
let bossLastShot = 0;
let speedBoostActive = false;
let bossesDefeated = 0;

startScreen.classList.remove('hidden');
startGameButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    gameRunning = true;
    spawnEnemies();
    spawnPowerUps();
    updateHUD();
    gameLoop();
});


showInstructionsButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    instructions.classList.remove('hidden');
});
backToStartButton.addEventListener('click', () => {
    instructions.classList.add('hidden');
    startScreen.classList.remove('hidden');
});
toggleModeButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    toggleModeButton.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

function spawnEnemies() {
    const x = Math.random() * (canvas.width - 48);
    enemies.push(new Enemy(x, -48));
}


document.addEventListener('keydown', (e) => (keys[e.key] = true));
document.addEventListener('keyup', (e) => (keys[e.key] = false));
function gameLoop() {
    if (!gameRunning) return;
    
    const now = Date.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    player.move(keys, canvas);
    player.draw(ctx);
    
    for (let enemy of enemies) {
        enemy.move();
        enemy.draw(ctx);
    }
    
    updateHUD();
    requestAnimationFrame(gameLoop);
}