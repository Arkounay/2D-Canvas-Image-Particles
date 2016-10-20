import Vector from './Vector';
import * as Main from './Main';

export default class Particle {
    public static readonly MAX_SPEED = 12;
    public position: Vector;
    public velocity: Vector;
    public size: number;

    private image: HTMLImageElement;
    private rotation: number; // degrés
    private rotationSpeed: number;
    private alive: boolean = true;

    constructor(x: number, y: number, image: HTMLImageElement) {
        let randomSize = Math.random();
        this.size = 8 + randomSize * 25;
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.setRandomVelocity();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = 6 - randomSize * 5.5;
        this.image = image;
    }

    public setRandomVelocity() {
        this.velocity.set((Math.random() - .5) * Particle.MAX_SPEED, (Math.random() - .5) * Particle.MAX_SPEED);
    }

    update(delta: number) {
        this.position.add(this.velocity.x * delta, this.velocity.y * delta);
        this.rotation += this.rotationSpeed * delta;



        // when the cursor is near, bounce and move to the opposite side
        let dst = this.position.dst(Main.cursor.position.x, Main.cursor.position.y);
        if (dst < Main.cursor.radius) {
            let intersection = this.position.cpy().add(-Main.cursor.position.x, -Main.cursor.position.y);
            this.velocity.setRotation(intersection.angle());

            let scl = delta;
            if (dst > Main.cursor.radius * .9) {
                scl = delta * .2;
            }
            intersection.scl(scl, scl).add(this.position.x, this.position.y);
            this.position.set(intersection.x, intersection.y);
        }

    }


    /**
     * Renders the particle
     * @param context - Canvas context
     */
    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.beginPath();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation * Math.PI / 180);
        context.drawImage(this.image, - this.size / 2, - this.size / 2, this.size, this.size);
        context.fill();
        context.restore();
    }

    public die() {
        this.alive = false;
    }

    public get isAlive(): boolean {
        return this.alive;
    }

}