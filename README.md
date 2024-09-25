# Spark.js
## TypeScript 2D particle FX module/library

## [Demo](https://editor.p5js.org/Wojtek987/sketches/UqBWRs7yg) with p5.js

## Usage:
Spark.js is a module that lets the user have granular control over the necessary things, but seamlessly handles the rest under the hood.

Download and include the `spark.js` file in your html (dist/ folder):
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
```

### Adding direction or "gravity" to the particle group:
```js
// direction (optional). This can make the particles burst in one direction, not the firework-like default of (x: 0, y: 0). These values are added each update to the pos of the Particle. Negative values are accepted
const direction = new Vector(0, 1);
```

### Controling the lifespan of Particles within a ParticleGroup:
The ```decay``` parameter is the amount substracted each frame from the Particle's opacity (0-100). Bigger values mean shorter lifespan.
```js
const decay = 5; // default value
```

### Creating a burst:
```js
// this creates a ParticleGroup. It can be accessed through the Spark through its [.activeParticleGroups] property. Once a ParticleGroup has been created, it should be handled in the draw() loop immediately.
spark.createParticleGroup(myHSLColour, variation, count, pos, direction);
```

### In your draw() loop:
```js
// Loop through all Particle instances, draw, and update them
function myDraw() {
    spark.draw((particle) => {
        particle.update();

        // example of drawing to HTML canvas with P5.js (external drawing library)
        fill(particle.colour.h, particle.colour.s, particle.colour.l, particle.getOpacity);
        rect(particle.pos.x, particle.pos.y, 3, 3);
    });
}
```


### Types:
```ts
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
```

### Spark class properties:
```ts
let groups: ParticleGroup[] = myParticleSystem.activeParticleGroups; // returns all instances of active ParticleGroup classes
// A ParticleGroup is deleted after all particles have reached an opacity of 0


spark.draw(callback(currentParticleForProcessing)); // handles processing of every particle with your callback function
```

### ParticleGroup class properties:
```ts
let myParticleArray: Particle[] = myParticleGroup.particlesArray; // returns a list of all of a PraticleGroup's Particle class instances
```

### Particle class properties:
```ts
private opacity: number = 100; // int(0-100)
readonly colour: hslColour;
public readonly pos: position;
public vel: velocity;
private dir: Vector;
public readonly decay: number;

// let myOpacity: number = myParticle.getOpacity -> returns the current opacity of the Particle
```
### Considerations:
This library was built and optimized for a ~60fps experience. Shifting significantly away from that value will require adjustments in the [decay], [vel], and [dir] parameters.
---
# Vector.ts
## Math library

### Vector docs:
```ts
const myVector: Vector = new Vector(1, -5);

myVector.copy(); // returns a copy of the vector to avoid pointers

myVector.overwrite(-2, 7.5); // overwrites the vector

myVector.magnitude(); // returns the magnitude (length) of the vector

myVector.normalize(); // normalizes the vector

myVector.rotate(angle: radians); // rotates the vector

myVector.rotation; // getter for the current rotation in radians
```
### Random docs:
```ts
Random.mini(0, 5); // returns a random int [0, 5] inclusive

Random.miniFloat(0, 5, 2); // returns a random float [0, 5] with decimal precision of 2

Random.variate(5, 2, 1); // returns a random float [3-7] with decimal precision of 1
```

### Numbers docs:
```ts
Numbers.clamp(variable, 2, 4); // returns a variable if within range [2-4], else returns the closest limit
```
