class Enemy {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 48;
        this.height = 48;
        this.speed = 2;
        this.img = new Image();
        this.img.src = 'assets/enemy.png';
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    move() {
        this.y += this.speed;
    }
}