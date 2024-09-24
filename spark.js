"use strict";
class Spark {
    constructor() {
        this.activeParticleGroups = [];
    }
    createParticleGroup(colour, variation, count, pos) {
        const newParticleGroup = new ParticleGroup(Object.assign({}, colour), variation, count, Object.assign({}, pos));
        this.activeParticleGroups.push(newParticleGroup);
        newParticleGroup.lifetimePromise.then(() => {
            this.activeParticleGroups = this.activeParticleGroups.filter(particleGroup => particleGroup !== newParticleGroup);
        });
    }
    update() {
        for (const particleGroup of this.activeParticleGroups) {
            particleGroup.update();
        }
    }
}
class ParticleGroup {
    constructor(colour, variation, count, pos) {
        this.particles = [];
        this.isResolved = false;
        this.colour = Object.assign({}, colour);
        this.variation = variation;
        this.count = count;
        this.pos = Object.assign({}, pos);
        this.burst(this.pos.x, this.pos.y);
        this.lifetimePromise = new Promise((resolve) => {
            this.resolveLifetimePromise = resolve;
        });
    }
    burst(x, y) {
        for (let i = 0; i < this.count; i++) {
            this.particles.push(new Particle({
                h: this.randomize(this.colour.h),
                s: this.randomize(this.colour.s),
                l: this.randomize(this.colour.l)
            }, { x, y }, {
                x: (Math.random() - 0.5) * this.variation / 3,
                y: (Math.random() - 0.5) * this.variation / 3
            }));
        }
    }
    update() {
        for (const particle of this.particles) {
            if (particle.getOpacity <= 0 && !this.isResolved) {
                this.isResolved = true;
                this.resolveLifetimePromise();
                break;
            }
        }
    }
    get particlesArray() {
        return this.particles;
    }
    randomize(value) {
        return value + Math.floor(Math.random() * (this.variation * 2 + 1)) - this.variation;
    }
}
class Particle {
    constructor(colour, pos, vel, dir = { x: 0, y: 0 }) {
        this.opacity = 100;
        this.colour = colour;
        this.pos = Object.assign({}, pos);
        this.vel = Object.assign({}, vel);
        this.dir = Object.assign({}, dir);
    }
    get getOpacity() {
        return this.opacity;
    }
    update(dir = { x: 0, y: 0 }) {
        this.pos.x += this.vel.x + this.dir.x;
        this.pos.y += this.vel.y + this.dir.y;
        this.opacity -= 5;
        this.dir.x += dir.x;
        this.dir.y += dir.y;
    }
}
