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

canvas.width = 1000;
canvas.height = 750;

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

class Particle {
    constructor(x, y, color, size, speedX, speedY, life) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.life = life;
    }

    update(deltaTime) {
        this.x += this.speedX * deltaTime * 50;
        this.y += this.speedY * deltaTime * 50;
        this.life -= deltaTime;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function spawnEnemies() {
    const enemyCount = 5 + currentLevel * 2;
    for (let i = 0; i < enemyCount; i++) {
        const x = Math.random() * (canvas.width - 48);
        enemies.push(new Enemy(x, -48, currentLevel));
    }
}

function spawnBoss() {
    boss = new Boss(canvas.width / 2 - 50, 50, currentLevel);
    if (bossHealthContainer) {
        bossHealthContainer.classList.remove('hidden');
        bossDistanceText.classList.add('hidden');
        bossHealthBar.classList.remove('hidden');
        updateBossHealthBar();
    }
}

function spawnPowerUps() {
    const powerUpCount = Math.max(1, 3 - Math.floor(currentLevel / 3));
    for (let i = 0; i < powerUpCount; i++) {
        const x = Math.random() * (canvas.width - 32);
        powerUps.push(new PowerUp(x, -32));
    }
}

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if (e.key === ' ' && gameRunning) {
        player.fire(bullets);
    }
});
document.addEventListener('keyup', (e) => (keys[e.key] = false));

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

function updateBossHealthBar() {
    if (boss && bossHealthBar) {
        const maxHealth = 20 + currentLevel * 10;
        const healthPercentage = (boss.health / maxHealth) * 100;
        bossHealthBar.style.width = `${Math.max(0, healthPercentage)}%`;
    }
}

function updateHUD() {
    healthDisplay.textContent = player.health;
    scoreDisplay.textContent = Math.floor(player.score);
    levelDisplay.textContent = currentLevel;
    fireRateLevelDisplay.textContent = player.fireRateLevel;
    bulletCountLevelDisplay.textContent = player.bulletCountLevel;
    healthLevelDisplay.textContent = player.healthLevel;
    if (!boss && bossDistanceDisplay) {
        bossDistanceDisplay.textContent = Math.max(0, Math.floor(levelTimeLeft * 100));
    }
    updateBossHealthBar();
}

function endGame() {
    gameRunning = false;
    gameOverScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = Math.floor(player.score);
    finalLevelDisplay.textContent = currentLevel;
    if (bossHealthContainer) bossHealthContainer.classList.add('hidden');
}

function showLevelUpScreen() {
    gameRunning = false;
    levelUpScreen.classList.remove('hidden');
    if (bossHealthContainer) bossHealthContainer.classList.add('hidden');
}

function upgradeSkill(skill) {
    player.upgradeSkill(skill);
    levelUpScreen.classList.add('hidden');
    nextLevel();
}

function nextLevel() {
    currentLevel++;
    enemies = [];
    powerUps = [];
    bullets = [];
    bossBullets = [];
    particles = [];
    boss = null;
    levelTimeLeft = 20 + currentLevel * 5;
    speedBoostActive = false;
    spawnEnemies();
    spawnPowerUps();
    player.x = canvas.width / 2;
    player.y = canvas.height - 100;
    gameRunning = true;
    if (bossHealthContainer) bossHealthContainer.classList.remove('hidden');
    if (bossDistanceText) bossDistanceText.classList.remove('hidden');
    if (bossHealthBar) bossHealthBar.classList.add('hidden');
    updateHUD();
    gameLoop();
}

function restartGame() {
    player = new Player();
    enemies = [];
    powerUps = [];
    bullets = [];
    bossBullets = [];
    particles = [];
    boss = null;
    bossesDefeated = 0;
    currentLevel = 1;
    levelTimeLeft = 20;
    speedBoostActive = false;
    gameRunning = true;
    gameOverScreen.classList.add('hidden');
    levelUpScreen.classList.add('hidden');
    document.getElementById('winScreen').classList.add('hidden');
    if (bossHealthContainer) bossHealthContainer.classList.remove('hidden');
    if (bossDistanceText) bossDistanceText.classList.remove('hidden');
    if (bossHealthBar) bossHealthBar.classList.add('hidden');
    spawnEnemies();
    spawnPowerUps();
    updateHUD();
    gameLoop();
}

function winGame() {
    gameRunning = false;
    const winScreen = document.getElementById('winScreen');
    const winFinalScore = document.getElementById('winFinalScore');
    const winBossesDefeated = document.getElementById('winBossesDefeated');
    winScreen.classList.remove('hidden');
    winFinalScore.textContent = Math.floor(player.score);
    winBossesDefeated.textContent = bossesDefeated;
    if (bossHealthContainer) bossHealthContainer.classList.add('hidden');
}

function exitGame() {
    window.close();
}

function gameLoop() {
    if (!gameRunning) return;

    const now = Date.now();
    const deltaTime = (now - lastTime) / 1000;
    lastTime = now;

    player.score += deltaTime * 10;

    const timeDecrease = speedBoostActive ? deltaTime * 2 : deltaTime;
    levelTimeLeft -= timeDecrease;
    if (levelTimeLeft <= 0 && !boss) {
        spawnBoss();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#0a0a23' : '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#ffffff' : '#000000';
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.fillRect(x, y, 2, 2);
    }

    player.move(keys, canvas);
    player.draw(ctx);

    let bulletsToRemove = [];
    let enemiesToRemove = [];
    let powerUpsToRemove = [];
    let bossBulletsToRemove = [];

    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed;
        ctx.fillStyle = '#ff4444';
        ctx.fillRect(bullets[i].x, bullets[i].y, bullets[i].width, bullets[i].height);
        if (bullets[i].y < 0) {
            bulletsToRemove.push(i);
            continue;
        }

        for (let j = 0; j < enemies.length; j++) {
            if (enemies[j] && enemies[j].collidesWith(bullets[i])) {
                enemies[j].takeDamage(1);
                particles.push(new Particle(
                    enemies[j].x + enemies[j].width / 2,
                    enemies[j].y + enemies[j].height / 2,
                    '#ff0000',
                    5,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    0.2
                ));
                bulletsToRemove.push(i);
                if (enemies[j].health <= 0) {
                    player.score += 20;
                    for (let k = 0; k < 10; k++) {
                        particles.push(new Particle(
                            enemies[j].x + enemies[j].width / 2,
                            enemies[j].y + enemies[j].height / 2,
                            '#ffff00',
                            3,
                            (Math.random() - 0.5) * 5,
                            (Math.random() - 0.5) * 5,
                            0.5
                        ));
                    }
                    enemiesToRemove.push(j);
                }
                break;
            }
        }

        if (boss && boss.collidesWith(bullets[i])) {
            boss.takeDamage(1);
            particles.push(new Particle(
                boss.x + boss.width / 2,
                boss.y + boss.height / 2,
                '#ff0000',
                8,
                (Math.random() - 0.5) * 3,
                (Math.random() - 0.5) * 3,
                0.2
            ));
            bulletsToRemove.push(i);
            if (boss.health <= 0) {
                player.score += 100;
                for (let k = 0; k < 20; k++) {
                    particles.push(new Particle(
                        boss.x + boss.width / 2,
                        boss.y + boss.height / 2,
                        '#0000ff',
                        5,
                        (Math.random() - 0.5) * 6,
                        (Math.random() - 0.5) * 6,
                        0.8
                    ));
                }
                boss = null;
                bossesDefeated++;
                if (bossesDefeated >= 5) {
                    winGame();
                } else {
                    showLevelUpScreen();
                }
                return;
            }
            break;
        }
    }

    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i]) {
            enemies[i].move();
            enemies[i].draw(ctx);
            if (enemies[i].y > canvas.height) {
                enemiesToRemove.push(i);
                continue;
            }
            if (enemies[i].collidesWith(player)) {
                player.takeDamage(1);
                particles.push(new Particle(
                    player.x + player.width / 2,
                    player.y + player.height / 2,
                    '#ff0000',
                    5,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    0.2
                ));
                enemiesToRemove.push(i);
            }
        }
    }

    if (boss) {
        boss.move();
        boss.draw(ctx);
        if (boss.collidesWith(player)) {
            player.health = 0;
            particles.push(new Particle(
                player.x + player.width / 2,
                player.y + player.height / 2,
                '#ff0000',
                5,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                0.2
            ));
        }

        const now = Date.now();
        if (now - bossLastShot > boss.fireRate) {
            boss.fire(bossBullets);
            bossLastShot = now;
        }
    }

    for (let i = 0; i < bossBullets.length; i++) {
        if (bossBullets[i]) {
            bossBullets[i].update();
            ctx.fillStyle = document.body.classList.contains('dark-mode') ? '#ffffff' : '#000000';
            ctx.fillRect(bossBullets[i].x, bossBullets[i].y, bossBullets[i].width, bossBullets[i].height);
            if (bossBullets[i].y > canvas.height || bossBullets[i].y < 0) {
                bossBulletsToRemove.push(i);
                continue;
            }
            if (player.collidesWith(bossBullets[i])) {
                player.takeDamage(1);
                particles.push(new Particle(
                    player.x + player.width / 2,
                    player.y + player.height / 2,
                    '#ff0000',
                    5,
                    (Math.random() - 0.5) * 2,
                    (Math.random() - 0.5) * 2,
                    0.2
                ));
                bossBulletsToRemove.push(i);
            }
        }
    }

    for (let i = 0; i < powerUps.length; i++) {
        powerUps[i].move();
        powerUps[i].draw(ctx);
        if (powerUps[i].y > canvas.height) {
            powerUpsToRemove.push(i);
            continue;
        }
        if (powerUps[i].collidesWith(player)) {
            player.heal(powerUps[i].healAmount);
            player.applySpeedBoost();
            speedBoostActive = true;
            setTimeout(() => (speedBoostActive = false), 5000);
            for (let k = 0; k < 8; k++) {
                particles.push(new Particle(
                    powerUps[i].x + powerUps[i].width / 2,
                    powerUps[i].y + powerUps[i].height / 2,
                    '#00ff00',
                    4,
                    Math.cos(k * Math.PI / 4) * 3,
                    Math.sin(k * Math.PI / 4) * 3,
                    0.4
                ));
            }
            powerUpsToRemove.push(i);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update(deltaTime);
        particles[i].draw(ctx);
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }

    bulletsToRemove.sort((a, b) => b - a).forEach(i => bullets.splice(i, 1));
    enemiesToRemove.sort((a, b) => b - a).forEach(i => enemies.splice(i, 1));
    powerUpsToRemove.sort((a, b) => b - a).forEach(i => powerUps.splice(i, 1));
    bossBulletsToRemove.sort((a, b) => b - a).forEach(i => bossBullets.splice(i, 1));

    if (Math.random() < 0.01 * currentLevel) {
        const x = Math.random() * (canvas.width - 48);
        enemies.push(new Enemy(x, -48, currentLevel));
    }
    if (Math.random() < 0.005) {
        const x = Math.random() * (canvas.width - 32);
        powerUps.push(new PowerUp(x, -32));
    }

    updateHUD();

    if (player.health <= 0) {
        endGame();
    }

    requestAnimationFrame(gameLoop);
}

player.img.onload = () => {
};