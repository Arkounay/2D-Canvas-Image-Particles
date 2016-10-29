export default class Vector {

    constructor(public x: number, public y: number) {
        this.set(x, y);
    }

    public set(x: number, y: number): Vector {
        this.x = x;
        this.y = y;
        return this;
    }

    public add(x: number, y: number): Vector {
        this.x += x;
        this.y += y;
        return this;
    }

    public dst2(x: number, y: number): number {
        let x_d = x - this.x;
        let y_d = y - this.y;
        return x_d * x_d + y_d * y_d;
    }

    public dst(x: number, y: number): number {
        return Math.sqrt(this.dst2(x, y));
    }

    public len(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    public nor(): Vector {
        let len = this.len();
        if (len !== 0) {
            this.x /= len;
            this.y /= len;
        }
        return this;
    }

    public scl(x: number, y: number): Vector {
        this.x *= x;
        this.y *= y;
        return this;
    }

    public cpy(): Vector {
        return new Vector(this.x, this.y);
    }

    public rotate(degrees: number): Vector {
        return this.rotateRad(degrees * Math.PI / 180);
    }

    public angle(): number {
        let angle = Math.atan2(this.y, this.x) * 180 / Math.PI;
        if (angle < 0) angle += 360;
        return angle;
    }

    public setRotation(degrees: number): Vector {
        return this.setRotationRad(degrees * Math.PI / 180)
    }

    public setRotationRad(radians: number): Vector {
        this.set(this.len(), 0);
        this.rotateRad(radians);

        return this;
    }

    private rotateRad(radians: number): Vector {
        let cos = Math.cos(radians);
        let sin = Math.sin(radians);

        let newX = this.x * cos - this.y * sin;
        let newY = this.x * sin + this.y * cos;

        this.x = newX;
        this.y = newY;

        return this;
    }

    public setAngle(degrees: number): Vector {
        return this.setAngleRad(degrees * Math.PI / 180);
    }

    public setAngleRad(radians: number): Vector {
        this.set(this.len(), 0);
        this.rotateRad(radians);
        return this;
    }

}