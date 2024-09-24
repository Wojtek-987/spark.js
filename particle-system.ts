type hslColour = {
    h: number,
    s: number,
    l: number
}

type position = {
    x: number,
    y: number
}

type velocity = {
    x: number,
    y: number
}

type direction = {
    x: number,
    y: number
}

class ParticleSystem {
    activeParticleGroups: ParticleGroup[] = [];

    createParticleGroup(colour: hslColour, variation: number, count: number, pos: position): void {
        const newParticleGroup = new ParticleGroup({...colour}, variation, count, {...pos});
        this.activeParticleGroups.push(newParticleGroup);

        newParticleGroup.lifetimePromise.then(() => {
            this.activeParticleGroups = this.activeParticleGroups.filter(particleGroup => particleGroup !== newParticleGroup);
        });
    }

    update(): void {
        for (const particleGroup of this.activeParticleGroups) {
            particleGroup.update();
        }
    }
}


class ParticleGroup {
    readonly colour: hslColour;
    private readonly variation: number;
    private readonly count: number;
    private readonly pos: position;
    private particles: Particle[] = [];
    private resolveLifetimePromise!: () => void;
    public lifetimePromise: Promise<void>;
    private isResolved: boolean = false;

    constructor(colour: hslColour, variation: number, count: number, pos: position) {
        this.colour = {...colour};
        this.variation = variation;
        this.count = count;
        this.pos = {...pos};

        this.burst(this.pos.x, this.pos.y);

        this.lifetimePromise = new Promise<void>((resolve) => {
            this.resolveLifetimePromise = resolve;
        });
    }

    private burst(x: number, y: number): void {
        for (let i = 0; i < this.count; i++) {
            this.particles.push(
                new Particle(
                    {
                        h: this.randomize(this.colour.h),
                        s: this.randomize(this.colour.s),
                        l: this.randomize(this.colour.l)
                    },
                    { x, y },
                    {
                        x: (Math.random() - 0.5) * this.variation / 3,
                        y: (Math.random() - 0.5) * this.variation / 3
                    }
                )
            );
        }
    }

    update(): void {
        for (const particle of this.particles) {
            if (particle.getOpacity <= 0 && !this.isResolved) {
                this.isResolved = true;
                this.resolveLifetimePromise();
                break;
            }
        }
    }

    get particlesArray(): Particle[] {
        return this.particles;
    }

    private randomize(value: number): number {
        return value + Math.floor(Math.random() * (this.variation * 2 + 1)) - this.variation;
    }
}


class Particle {
    private opacity: number = 100;
    readonly colour: hslColour;
    pos: position;
    vel: velocity;
    dir: direction;

    constructor(colour: hslColour, pos: position, vel: velocity, dir: direction = {x: 0, y: 0}) {
        this.colour = colour;
        this.pos = {...pos};
        this.vel = {...vel};
        this.dir = {...dir};
    }

    get getOpacity() {
        return this.opacity;
    }

    public update(dir: direction = {x: 0, y: 0}): void {
        this.pos.x += this.vel.x + this.dir.x;
        this.pos.y += this.vel.y + this.dir.y;
        this.opacity -= 5;

        this.dir.x += dir.x;
        this.dir.y += dir.y;
    }
}
