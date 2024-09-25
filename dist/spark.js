"use strict";
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    copy() {
        return new Vector(this.x, this.y);
    }
    overwrite(newX, newY) {
        return new Vector(newX, newY);
    }
    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    normalize() {
        if (this.isZero(this))
            return this;
        const mag = this.magnitude();
        return new Vector(this.x / mag, this.y / mag);
    }
    rotate(angle) {
        if (this.isZero(this))
            return this;
        return new Vector(this.x * Math.cos(angle) - this.x * Math.sin(angle), this.y * Math.sin(angle) + this.y * Math.cos(angle));
    }
    get rotation() {
        if (this.isZero(this))
            return 0;
        return Math.atan2(this.y, this.x);
    }
    isZero(vector) {
        return vector.x === 0 && vector.y === 0;
    }
}
class Random {
    static mini(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    static miniFloat(min, max, precision) {
        return parseFloat((Math.random() * (max - min + 1) + min).toFixed(precision));
    }
    static variate(base, variation, precision) {
        return base + this.miniFloat(-variation, variation, precision);
    }
}
class Numbers {
    static clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
}
class Spark {
    constructor() {
        this.activeParticleGroups = [];
    }
    createParticleGroup(colour, variation, count, pos, dir) {
        const newParticleGroup = new ParticleGroup(Object.assign({}, colour), variation, count, Object.assign({}, pos), dir);
        this.activeParticleGroups.push(newParticleGroup);
        newParticleGroup.lifetimePromise.then(() => {
            this.activeParticleGroups = this.activeParticleGroups.filter(particleGroup => particleGroup !== newParticleGroup);
        });
    }
    draw(userParticleFunction) {
        for (const group of this.activeParticleGroups) {
            for (const particle of group.particlesArray) {
                userParticleFunction(particle);
            }
            group.update();
        }
    }
}
class ParticleGroup {
    constructor(colour, variation, count, pos, dir, decay = 5) {
        this.particles = [];
        this.isResolved = false;
        this.colour = Object.assign({}, colour);
        this.variation = variation;
        this.count = count;
        this.pos = Object.assign({}, pos);
        this.dir = dir;
        this.decay = Numbers.clamp(1, decay, 25);
        this.burst(this.pos.x, this.pos.y);
        this.lifetimePromise = new Promise((resolve) => {
            this.resolveLifetimePromise = resolve;
        });
    }
    burst(x, y) {
        for (let i = 0; i < this.count; i++) {
            this.particles.push(new Particle({
                h: Random.variate(this.colour.h, this.variation, 1),
                s: Random.variate(this.colour.h, this.variation, 1),
                l: Random.variate(this.colour.h, this.variation, 1)
            }, { x, y }, new Vector(Random.miniFloat(-2, 2, 2), Random.miniFloat(-2, 2, 2)), this.dir, this.decay));
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
}
class Particle {
    constructor(colour, pos, vel, dir, decay) {
        this.opacity = 100;
        this.colour = colour;
        this.pos = Object.assign({}, pos);
        this.vel = Object.assign({}, vel);
        this.dir = dir.copy();
        this.decay = decay;
    }
    get getOpacity() {
        return this.opacity;
    }
    update() {
        this.pos.x += this.vel.x + this.dir.x;
        this.pos.y += this.vel.y + this.dir.y;
        this.opacity = Numbers.clamp(this.opacity - this.decay, 0, 100);
    }
}
