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
    collidesWith(obj) {
        return (
            this.x < obj.x + obj.width &&
            this.x + this.width > obj.x &&
            this.y < obj.y + obj.height &&
            this.y + this.height > obj.y
        );
    }

    takeDamage(amount) {
        this.health -= amount;
    }
}
class Boss {
    constructor(x, y, level) {
        this.x = x;
        this.y = y;
        this.width = 128;
        this.height = 128;
        this.speed = 2 + level * 0.5;
        this.health = 20 + level * 10;
        this.direction = 1;
        this.level = level;
        this.img = new Image();
        this.fireRate = 1000 / level;
        this.bulletColor = document.body.classList.contains('dark-mode') ? '#ffffff' : '#000000';

        switch (level % 5) {
            case 1:
                this.img.src = 'assets/boss1.png';
                break;
            case 2:
                this.img.src = 'assets/boss2.png';
                this.shotCount = 3;
                break;
            case 3:
                this.img.src = 'assets/boss3.png';
                this.fireRate = 1000;
                break;
            case 4:
                this.img.src = 'assets/boss4.png';
                this.bounce = true;
                break;
            case 0:
                this.img.src = 'assets/boss5.png';
                this.split = true;
                break;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    move() {
        this.x += this.speed * this.direction;
        if (this.x + this.width > canvas.width) this.direction = -1;
        if (this.x < 0) this.direction = 1;
    }

    fire(bullets) {
        if (this.shotCount) {
            for (let i = 0; i < this.shotCount; i++) {
                bullets.push(new BossBullet(
                    this.x + this.width / 2 - 2 + (i * 10 - (this.shotCount - 1) * 5),
                    this.y + this.height,
                    5,
                    this.bounce,
                    this.split
                ));
            }
        } else {
            bullets.push(new BossBullet(
                this.x + this.width / 2 - 2,
                this.y + this.height,
                5,
                this.bounce,
                this.split
            ));
        }
    }

    collidesWith(obj) {
        return (
            this.x < obj.x + obj.width &&
            this.x + this.width > obj.x &&
            this.y < obj.y + obj.height &&
            this.y + this.height > obj.y
        );
    }

    takeDamage(amount) {
        this.health -= amount;
    }
}

class BossBullet {
    constructor(x, y, speed, bounce, split) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 10;
        this.speed = speed;
        this.bounce = bounce;
        this.split = split;
        this.direction = 1;
    }

    update() {
        this.y += this.speed * this.direction;
        if (this.bounce && (this.y > canvas.height - this.height || this.y < 0)) {
            this.direction *= -1;
        }
        if (this.split && Math.random() < 0.02) {
            bossBullets.push(new BossBullet(this.x - 10, this.y, this.speed, this.bounce, false));
            bossBullets.push(new BossBullet(this.x + 10, this.y, this.speed, this.bounce, false));
        }
    }
}
