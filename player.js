class Player {
    constructor() {
        this.x = 500;
        this.y = 650;
        this.width = 64;
        this.height = 64;
        this.speed = 5;
        this.health = 5;
        this.maxHealth = 5;
        this.score = 0;
        this.fireRateLevel = 1;
        this.bulletCountLevel = 1;
        this.healthLevel = 0;
        this.lastShot = 0;
        this.img = new Image();
        this.img.src = 'assets/player.png';
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    move(keys, canvas) {
        if (keys['ArrowLeft'] && this.x > 0) this.x -= this.speed;
        if (keys['ArrowRight'] && this.x < canvas.width - this.width) this.x += this.speed;
        if (keys['ArrowUp'] && this.y > 0) this.y -= this.speed;
        if (keys['ArrowDown'] && this.y < canvas.height - this.height) this.y += this.speed;
    }
    fire(bullets) {
        const now = Date.now();
        const fireRate = 300 / this.fireRateLevel;
        if (now - this.lastShot > fireRate) {
            for (let i = 0; i < this.bulletCountLevel; i++) {
                bullets.push({
                    x: this.x + this.width / 2 - 2 + (i * 10 - (this.bulletCountLevel - 1) * 5),
                    y: this.y,
                    width: 4,
                    height: 10,
                    speed: 10
                });
            }
            this.lastShot = now;
        }
    }
}


