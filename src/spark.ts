/// <reference path="vector.ts" />

// === Globals ===
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




// === Spark Class (a particle system) ===

class Spark {
    public activeParticleGroups: ParticleGroup[] = [];

    public createParticleGroup(colour: hslColour, variation: number, count: number, pos: position, dir: Vector): void {
        const newParticleGroup: ParticleGroup = new ParticleGroup({...colour}, variation, count, {...pos}, dir);
        this.activeParticleGroups.push(newParticleGroup);

        newParticleGroup.lifetimePromise.then((): void => {
            this.activeParticleGroups = this.activeParticleGroups.filter(particleGroup => particleGroup !== newParticleGroup);
        });
    }

    public draw(userParticleFunction: (particle: Particle) => void): void {
        for (const group of this.activeParticleGroups) {
            for (const particle of group.particlesArray) {
                userParticleFunction(particle);
            }

            group.update();
        }
    }
}


// === A single burst of particles ===
class ParticleGroup {
    readonly colour: hslColour;
    private readonly variation: number;
    private readonly count: number;
    private readonly pos: position;
    private particles: Particle[] = [];
    private readonly dir: Vector;
    private readonly decay: number;

    private resolveLifetimePromise!: () => void;
    public lifetimePromise: Promise<void>;
    private isResolved: boolean = false;

    constructor(colour: hslColour, variation: number, count: number, pos: position, dir: Vector, decay: number = 5) {
        this.colour = {...colour};
        this.variation = variation;
        this.count = count;
        this.pos = {...pos};
        this.dir = dir;
        this.decay = Numbers.clamp(1, decay, 25);

        this.burst(this.pos.x, this.pos.y);

        this.lifetimePromise = new Promise<void>((resolve) => {
            this.resolveLifetimePromise = resolve;
        });
    }

    private burst(x: number, y: number): void {
        for (let i: number = 0; i < this.count; i++) {
            this.particles.push(
                new Particle(
                    {
                        h: Random.variate(this.colour.h, this.variation, 1),
                        s: Random.variate(this.colour.h, this.variation, 1),
                        l: Random.variate(this.colour.h, this.variation, 1)
                    },
                    { x, y },
                    new Vector(
                        Random.miniFloat(-2, 2, 2),
                        Random.miniFloat(-2, 2, 2)
                    ),
                    this.dir,
                    this.decay
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
}


// === A single particle ===
class Particle {
    private opacity: number = 100;
    readonly colour: hslColour;
    public readonly pos: position;
    public vel: velocity;
    private dir: Vector;
    public readonly decay: number;

    constructor(colour: hslColour, pos: position, vel: velocity, dir: Vector, decay: number) {
        this.colour = colour;
        this.pos = {...pos};
        this.vel = {...vel};
        this.dir = dir.copy();
        this.decay = decay;
    }

    get getOpacity() {
        return this.opacity;
    }

    public update(): void {
        this.pos.x += this.vel.x + this.dir.x;
        this.pos.y += this.vel.y + this.dir.y;
        this.opacity = Numbers.clamp(this.opacity - this.decay, 0, 100);
    }
}
