"use strict";
class ParticleSystem {
    constructor() {
        this.activeParticleGroups = [];
    }
    createParticleGroup(colourH, colourS, colourL, variation, count, x, y) {
        const newParticleGroup = new ParticleGroup(colourH, colourS, colourL, variation, count, x, y);
        this.activeParticleGroups.push(newParticleGroup);
        setTimeout(() => {
            this.activeParticleGroups = this.activeParticleGroups.filter(particleGroup => particleGroup !== newParticleGroup);
        }, 300);
    }
}
class ParticleGroup {
    constructor(colourH, colourS, colourL, variation, count, x, y) {
        this.particles = [];
        this.colourH = colourH;
        this.colourS = colourS;
        this.colourL = colourL;
        this.variation = variation;
        this.count = count;
        this.burst(x, y);
    }
    burst(x, y) {
        for (let i = 0; i < this.count; i++) {
            this.particles.push(new Particle(this.randomize(this.colourH), this.randomize(this.colourS), this.randomize(this.colourL), x, y, this.randomize(0) / 3, this.randomize(0) / 3));
        }
    }
    drawInfo() {
        return this.particles;
    }
    randomize(value) {
        return value + Math.floor(Math.random() * (this.variation * 2 + 1)) - this.variation;
    }
}
class Particle {
    constructor(colourH, colourS, colourL, x, y, xVel, yVel, gravity = 0) {
        this.opacity = 100;
        this.colourH = colourH;
        this.colourS = colourS;
        this.colourL = colourL;
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.gravity = gravity;
    }
    update(gravity = 0) {
        this.x += this.xVel;
        this.y += this.yVel;
        this.y += gravity;
        this.opacity -= 5;
        this.gravity += gravity;
    }
}
