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
}