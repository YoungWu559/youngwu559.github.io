/**
 * Starter file for 02-08-01.js - the only exercise of page 8 of Workbook 2
 */

// @ts-check

// Find the canvas and start!

/* this is a random solution that appeared in the the starter code
 * it looks like Copilot generated this code
 */

const canvas = document.getElementById('box2canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fireworks = [];
const particles = [];

canvas.addEventListener('click', (event) => {
    const x = event.clientX;
    const y = event.clientY;
    const startX = Math.random() * canvas.width;
    const startY = canvas.height;
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    fireworks.push(new Firework(startX, startY, x, y, color));
});

function Firework(startX, startY, endX, endY, color) {
    this.x = startX;
    this.y = startY;
    this.endX = endX;
    this.endY = endY;
    this.color = color;
    this.radius = 5;
    this.speed = 5;
    this.angle = Math.atan2(endY - startY, endX - startX);
    this.exploded = false;
}

Firework.prototype.update = function() {
    if (!this.exploded) {
        const dx = this.speed * Math.cos(this.angle);
        const dy = this.speed * Math.sin(this.angle);
        this.x += dx;
        this.y += dy;

        if (Math.hypot(this.x - this.endX, this.y - this.endY) < this.speed) {
            this.exploded = true;
            this.explode();
        }
    }
};

Firework.prototype.explode = function() {
    for (let i = 0; i < 100; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = Math.random() * 3 + 2;
        particles.push(new Particle(this.x, this.y, angle, speed, this.color));
    }
};

Firework.prototype.draw = function() {
    if (!this.exploded) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};

function Particle(x, y, angle, speed, color) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.speed = speed;
    this.color = color;
    this.alpha = 1;
}

Particle.prototype.update = function() {
    this.x += this.speed * Math.cos(this.angle);
    this.y += this.speed * Math.sin(this.angle);
    this.alpha -= 0.02;
};

Particle.prototype.draw = function() {
    ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
    ctx.fillRect(this.x, this.y, 3, 3);
};

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    fireworks.forEach((firework, index) => {
        firework.update();
        firework.draw();
        if (firework.exploded && particles.length === 0) {
            fireworks.splice(index, 1);
        }
    });

    particles.forEach((particle, index) => {
        particle.update();
        particle.draw();
        if (particle.alpha <= 0) {
            particles.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

animate();
