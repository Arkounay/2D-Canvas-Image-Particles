import Vector from './Vector';
import * as Main from './Main';
import ParticleSystem from "./ParticleSystem";
import {CursorMode} from "./CursorMode";

export default class Particle {
    public static readonly MAX_SPEED = 12;
    public readonly defaultSize: number;
    public position: Vector;
    public velocity: Vector;
    public size: number;

    private particleSystem: ParticleSystem;
    private image: HTMLImageElement;
    private rotation: number; // degrés
    private rotationSpeed: number;
    private alive: boolean = true;

    constructor(particleSystem: ParticleSystem, x: number, y: number, image: HTMLImageElement) {
        this.particleSystem = particleSystem;
        let randomSize = Math.random();
        this.defaultSize = 8 + randomSize * 25;
        this.size = this.defaultSize;
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.setRandomVelocity();
        this.rotation = Math.random() * 360;
        this.rotationSpeed = 6 - randomSize * 5.5;
        this.image = image;
    }

    public setRandomVelocity() {
        this.velocity.set((Math.random() - .5) * Particle.MAX_SPEED, 0);
        let delta = ((this.particleSystem.options.velocityAngle[1] - this.particleSystem.options.velocityAngle[0] + 360 + 180) % 360) - 180;
        let angle = (this.particleSystem.options.velocityAngle[0] + delta * Math.random() + 360) % 360;
        this.velocity.setAngle(angle);
    }

    update(delta: number) {
        this.position.add(this.velocity.x * delta, this.velocity.y * delta);
        this.rotation += this.rotationSpeed * delta;



        let dst = this.position.dst(this.particleSystem.cursorRelativeVector.x, this.particleSystem.cursorRelativeVector.y);
        if (dst < Main.cursor.radius) {
            // when the cursor is near, bounce and move to the opposite side
            if (this.particleSystem.options.cursorMode == CursorMode.Bounce) {
                let intersection = this.position.cpy().add(-this.particleSystem.cursorRelativeVector.x, -this.particleSystem.cursorRelativeVector.y);
                this.velocity.setRotation(intersection.angle());

                let scl = delta;
                if (dst > Main.cursor.radius * .9) {
                    scl = delta * .2;
                }
                intersection.scl(scl, scl).add(this.position.x, this.position.y);
                this.position.set(intersection.x, intersection.y);
            } else {
                if (dst > 0) {
                    let maxSizeMultiplier = 2;
                    let maxSizeComputed = this.defaultSize * maxSizeMultiplier;
                    this.size = maxSizeComputed * Main.cursor.radius / dst / maxSizeMultiplier;
                    if (this.size >= maxSizeComputed) {
                        this.size = maxSizeComputed;
                    }
                }
            }
        } else {
            this.size = this.defaultSize;
        }

    }


    /**
     * Renders the particle
     * @param context - Canvas context
     */
    draw(context: CanvasRenderingContext2D) {
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotation * Math.PI / 180);
        context.drawImage(this.image, - this.size / 2, - this.size / 2, this.size, this.size);
        context.restore();
    }

    public die() {
        this.alive = false;
    }

    public get isAlive(): boolean {
        return this.alive;
    }

}