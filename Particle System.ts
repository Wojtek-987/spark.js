class ParticleSystem {
    activeParticleGroups: ParticleGroup[] = [];

    createParticleGroup(colourH: number, colourS: number, colourL: number, variation: number, count: number, x: number, y: number): void {
        const newParticleGroup = new ParticleGroup(colourH, colourS, colourL, variation, count, x, y)
        this.activeParticleGroups.push(newParticleGroup);
        setTimeout(() => {
            this.activeParticleGroups = this.activeParticleGroups.filter(particleGroup => particleGroup !== newParticleGroup);
        }, 300);
    }
}

class ParticleGroup {
    readonly colourH: number;
    readonly colourS: number;
    readonly colourL: number;
    private readonly variation: number;
    private readonly count: number;
    private particles: Particle[] = [];

    constructor(colourH: number, colourS: number, colourL: number, variation: number, count: number, x: number, y: number) {
        this.colourH = colourH;
        this.colourS = colourS;
        this.colourL = colourL;
        this.variation = variation;
        this.count = count;

        this.burst(x, y);
    }

    burst(x: number, y: number): void {
        for (let i = 0; i < this.count; i++) {
            this.particles.push(
                new Particle(
                    this.randomize(this.colourH),
                    this.randomize(this.colourS),
                    this.randomize(this.colourL),
                    x,
                    y,
                    this.randomize(0) / 3,
                    this.randomize(0) / 3
                )
            )
        }
    }

    drawInfo(): Particle[] {
        return this.particles;
    }

    private randomize(value: number): number {
        return value + Math.floor(Math.random() * (this.variation * 2 + 1)) - this.variation;
    }
}

class Particle {
    colourH: number;
    colourS: number;
    colourL: number;
    x: number;
    y: number;
    xVel: number;
    yVel: number;
    opacity: number = 100;
    gravity: number;

    constructor(colourH: number, colourS: number, colourL: number, x: number, y: number, xVel: number, yVel: number, gravity: number = 0) {
        this.colourH = colourH;
        this.colourS = colourS;
        this.colourL = colourL;
        this.x = x;
        this.y = y;
        this.xVel = xVel;
        this.yVel = yVel;
        this.gravity = gravity;
    }

    update(gravity: number = 0): void {
        this.x += this.xVel;
        this.y += this.yVel;
        this.y += gravity;
        this.opacity -= 5;

        this.gravity += gravity;
    }
}
