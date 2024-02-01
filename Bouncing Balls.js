const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const {
    width,
    height
} = canvas;

function random(max, min) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomRGB() {
    return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}



class Ball {
    constructor(x, y, velX, velY, color, size) {
        this.x = x;
        this.y = y;
        this.velX = velX;
        this.velY = velY;
        this.color = color;
        this.size = size;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        if ((this.x + this.size) >= width) {
            this.velX = -(Math.abs(this.velX));
            this.color = randomRGB();
        }

        if ((this.x - this.size) <= 0) {
            this.velX = Math.abs(this.velX);
            this.color = randomRGB();
        }

        if ((this.y + this.size) >= height) {
            this.velY = -(Math.abs(this.velY));
            this.color = randomRGB();
        }

        if ((this.y - this.size) <= 0) {
            this.velY = Math.abs(this.velY);
            this.color = randomRGB();
        }
        this.x += this.velX;
        this.y += this.velY;
    }


    collisionDetct() {
        for (const otherBall of balls) {
            if (this !== otherBall) {
                const dx = otherBall.x - this.x;
                const dy = otherBall.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.size + otherBall.size) {
                    // Calculate collision angle and new velocities
                    const angle = Math.atan2(dy, dx);

                    // Relative velocity components
                    const relativeVelX = otherBall.velX - this.velX;
                    const relativeVelY = otherBall.velY - this.velY;

                    // Dot product of relative velocity and normal vector
                    const dotProduct = (relativeVelX * Math.cos(angle)) + (relativeVelY * Math.sin(angle));

                    // Calculate new velocities using the dot product
                    this.velX += dotProduct * Math.cos(angle);
                    this.velY += dotProduct * Math.sin(angle);

                    otherBall.velX -= dotProduct * Math.cos(angle);
                    otherBall.velY -= dotProduct * Math.sin(angle);
                }
            }
        }
    }






}

const balls = [];

while (balls.length < 15) {
    const size = random(10, 20);
    const ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the edge of the canvas, to avoid drawing errors
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        randomRGB(),
        size
    );

    balls.push(ball);
}

function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (const ball of balls) {
        ball.draw();
        ball.update();
        ball.collisionDetct();
    }

    requestAnimationFrame(loop);
}

loop();