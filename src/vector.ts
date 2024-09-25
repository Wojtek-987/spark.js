// === Vector sub-library for complex math ===
class Vector {
    public readonly x: number;
    public readonly y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public copy(): Vector {
        return new Vector(this.x, this.y);
    }

    public overwrite(newX: number, newY: number): Vector {
        return new Vector(newX, newY);
    }

    public magnitude(): number {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    public normalize(): Vector {
        if(this.isZero(this))
            return this;

        const mag = this.magnitude();
        return new Vector(this.x / mag, this.y / mag);
    }

    public rotate(angle: number): Vector {
        if(this.isZero(this))
            return this;

        return new Vector(this.x * Math.cos(angle) - this.x * Math.sin(angle),
            this.y * Math.sin(angle) + this.y * Math.cos(angle));
    }

    get rotation(): number {
        if(this.isZero(this))
            return 0;

        return Math.atan2(this.y, this.x);
    }

    private isZero(vector: Vector): boolean {
        return vector.x === 0 && vector.y === 0;
    }
}

class Random {
    static mini(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static miniFloat(min: number, max: number, precision: number): number {
        return parseFloat((Math.random() * (max - min + 1) + min).toFixed(precision));
    }

    static variate(base: number, variation: number, precision: number): number {
        return base + this.miniFloat(-variation, variation, precision);
    }
}

class Numbers {
    static clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }
}

