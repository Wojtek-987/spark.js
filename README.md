# Spark.js - a TypeScript 2D particle FX library for the web

## Online [demo](https://editor.p5js.org/Wojtek987/sketches/UqBWRs7yg) with p5.js

## Usage:
Spark.js is a library that lets the user have granular control over the necessary things, but seamlessly handles the rest under the hood.

Download and include the `spark.js` file in your html:
```html
<script src="path/to/the/script/spark.js"></script>
```

### Getting started:

```js
// create an instance of the Spark class. This will be the collection of its ParticleGroups and Particles. You can have multiple of these running simultaneously, ex. one for directional combat bursts and one for generic firework-like bursts
const spark = new Spark();

// base particle colour HSL(360, 100, 100)
const myHSLColour = {
    h: 20,
    s: 65,
    l: 100
}

// variation of the colour in hsl (integer):
const variation = 5;

// the number of particles per "burst"
const count = 10;

// the center of the burst
const pos = {
    x: 50,
    Y: 50
}

// this creates a ParticleGroup. It can be accessed through the Spark through its [.activeParticleGroups] property. Once a ParticleGroup has been created, it should be handled in the draw() loop immediately.
spark.createParticleGroup(myHSLColour, variation, count, pos);

// (...)

// size for drawing, this setup is up to you. We're drawing squares in the HTML canvas in this example
const particleSize = 3; //px if you're using HTML canvas

// direction (optional). This can make the particles burst in one direction, not the firework-like default of {x: 0, y: 0}. These values are added each update to the pos of the Particle. Negative values are accepted
const direction = {
    x: 0,
    y: 1
}


// ----------- in your draw() loop: -----------

// Loop through all Particle instances, draw, and update them
function myDraw() {
    spark.activeParticleGroups.forEach(group => {
        group.particlesArray.forEach(particle => {
            // This will update the current Particle's position, opacity, and velocity (dir)
            particle.update(direction); // argument optional
    
            // (assuming you're using an HTML canvas)
            // set the fill style with the converted HSL to RGBA
            ctx.fillStyle = yourHslToRgbaFunction(particle.colour.h, particle.colour.s, particle.colour.l, particle.getOpacity);
    
            // Draw the rectangle at particle's position
            ctx.fillRect(particle.pos.x, particle.pos.y, particleSize, particleSize);
        });
    });
    
    // VERY IMPORTANT! This handles the garbage collection
    spark.update();
}
```


### Types:
```js
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
```

### Spark class properties:
```js
let groups: ParticleGroup[] = myParticleSystem.activeParticleGroups; // returns all instances of active ParticleGroup classes
// A ParticleGroup becomes inactive after all particles have reached an opacity of 0
```

### ParticleGroup class properties:
```js
let myParticleArray: Particle[] = myParticleGroup.particlesArray; // returns a list of all of its Particle class instances
```

### Particle class properties:
```js
private opacity: number = 100; int(0-100)
readonly colour: hslColour;
pos: position;
vel: velocity;
dir: direction;

// let myOpacity: number = myParticle.getOpacity -> returns the current opacity of the Particle

// how these are used in the update function:
public update(dir: direction = {x: 0, y: 0}): void {
    this.pos.x += this.vel.x + this.dir.x;
    this.pos.y += this.vel.y + this.dir.y;
    this.opacity -= 5;

    this.dir.x += dir.x;
    this.dir.y += dir.y;
}
```
