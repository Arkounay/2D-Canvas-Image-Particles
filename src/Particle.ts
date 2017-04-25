import Vector from './Vector';
import * as Main from './Main';
import ParticleSystem from "./ParticleSystem";
import Tint from "./Tint";
import {CursorMode, RotationMode} from "./Modes";
import {getRandomAngle} from "./Utils";
import {PSOptionInterface} from "./PSOptionInterface";

export default class Particle {
    public readonly defaultRotation: number;
    public readonly defaultWidth: number;
    public readonly defaultHeight: number;
    public readonly defaultSpeed: number;
    public readonly defaultVelocity: Vector;
    public position: Vector;
    public velocity: Vector;
    public width: number;
    public height: number;

    private particleSystem: ParticleSystem;
    private image: HTMLImageElement;
    private rotation: number; // degrés
    private rotationSpeed: number;
    private minimumRotationSpeed: number;
    private alive: boolean = true;

    private tint: Tint;
    private buffer: HTMLCanvasElement;
    private psOptions: PSOptionInterface;
    private lifeTime: number;
    private currentTime: number;
    private lifeOpacity: number;
    private lifeScale: number;

    constructor(particleSystem: ParticleSystem, x: number, y: number, image: HTMLImageElement) {
        this.particleSystem = particleSystem;
        this.psOptions = particleSystem.options;
        let randomSize = Math.random();
        this.defaultWidth = this.psOptions.width[0] + randomSize * this.psOptions.width[1];
        this.defaultHeight = this.psOptions.height[0] + randomSize * this.psOptions.height[1];
        this.defaultSpeed = this.psOptions.speed[0] + Math.random() * (this.psOptions.speed[1] - this.psOptions.speed[0]);
        this.width = this.defaultWidth;
        this.height = this.defaultHeight;
        this.position = new Vector(x, y);
        this.velocity = new Vector(0, 0);
        this.setRandomVelocity();
        this.defaultVelocity = this.velocity.cpy();
        this.defaultRotation = getRandomAngle(this.psOptions.rotationStartAngle[0], this.psOptions.rotationStartAngle[1]);
        this.rotation = this.defaultRotation;
        this.rotationSpeed = this.psOptions.rotationSpeed[0] + Math.random() * (this.psOptions.rotationSpeed[1] - this.psOptions.rotationSpeed[0]);
        this.minimumRotationSpeed = this.psOptions.minimumRotationSpeed;
        this.lifeTime = this.psOptions.particleLifeTime;
        this.currentTime = 0;
        this.lifeOpacity = 1;
        this.lifeScale = 1;

        // rotation affected by scale
        this.rotationSpeed = this.rotationSpeed / (randomSize * this.psOptions.rotationSpeedSizeScale + 1);

        // minimum rotation speed
        if (this.rotationSpeed < 0 && this.rotationSpeed > -this.minimumRotationSpeed) {
            this.rotationSpeed = -this.minimumRotationSpeed;
        } else if (this.rotationSpeed > 0 && this.rotationSpeed < this.minimumRotationSpeed) {
            this.rotationSpeed = this.minimumRotationSpeed;
        }

        this.image = image;

        // offscreen buffer
        this.tint = this.psOptions.tints[Math.floor(Math.random() * this.psOptions.tints.length)].clone();
        if (this.tint.isActive() || this.psOptions.cursorMode == CursorMode.Light) {
            this.buffer = document.createElement('canvas');
            this.buffer.width = this.image.width;
            this.buffer.height = this.image.height;

            let tintedImage = this.buffer.getContext('2d');
            // fill offscreen buffer with the tint color
            tintedImage.fillStyle = this.tint.color;
            tintedImage.fillRect(0, 0, this.buffer.width, this.buffer.height);

            // destination atop makes a result with an alpha channel identical to the image, but with all pixels retaining their original color *as far as I can tell*
            tintedImage.globalCompositeOperation = "destination-atop";
            tintedImage.drawImage(this.image, 0, 0);
        }
    }

    public setRandomVelocity() {
        this.velocity.set(this.defaultSpeed, 0);
        this.velocity.setAngle(getRandomAngle(this.psOptions.velocityAngle[0], this.psOptions.velocityAngle[1]));
    }

    /**
     * Kill particle smoothly
     * Called in update()
     * @param delta
     */
    private fadeOutForDie (delta) {
        // Increment time
        this.currentTime += delta;
        // Opacity
        if (this.currentTime > this.lifeTime - 1) {
            this.lifeOpacity -= delta;
        }
        // Limit opacity
        if (this.lifeOpacity < 0) {
            this.lifeOpacity = 0;
        }
        // Scale
        if (this.currentTime > this.lifeTime - 1) {
            this.lifeScale -= delta;
        }
        // Limit scale
        if (this.lifeScale < 0) {
            this.lifeScale = 0;
        }
        // It's time to kill
        if (this.currentTime >= this.lifeTime) {
            this.die();
        }
    }

    update(delta: number) {

        // Kill particle smoothly
        if (this.particleSystem.options.particleLifeTime > 0) {
            this.fadeOutForDie(delta);
        }

        this.position.add(this.velocity.x * delta, this.velocity.y * delta);

        if (this.psOptions.rotationMode === RotationMode.FollowVelocity) {
            this.rotation = this.velocity.angle() + this.defaultRotation;
        } else if (this.psOptions.rotationMode === RotationMode.Random) {
            this.rotation += this.rotationSpeed * delta;
        }

        if (this.psOptions.rotationMode === RotationMode.FollowVelocity) {
            // return to normal after bounce
            let scl = 3 * delta;
            let bounceVelocity = this.defaultVelocity.cpy().scl(scl, scl);
            this.velocity.add(bounceVelocity.x, bounceVelocity.y).scl(1 - scl, 1 - scl);
        }

        let dst = this.position.dst(this.particleSystem.cursorRelativeVector.x, this.particleSystem.cursorRelativeVector.y);
        if (dst < this.psOptions.cursorRadius) {
            // when the cursor is near, bounce and move to the opposite side
            if (this.psOptions.cursorMode == CursorMode.Bounce) {
                let intersection = this.position.cpy().add(-this.particleSystem.cursorRelativeVector.x, -this.particleSystem.cursorRelativeVector.y);
                this.velocity.setRotation(intersection.angle());

                let scl = delta * 10;
                if (dst > this.psOptions.cursorRadius * .9) {
                    scl *= .2;
                }
                intersection.scl(scl, scl).add(this.position.x, this.position.y);
                this.position.set(intersection.x, intersection.y);
            } else if (this.psOptions.cursorMode == CursorMode.Zoom) {
                if (dst > 0) {
                    let maxSizeMultiplier = 2;
                    let maxWithComputed = this.defaultWidth * maxSizeMultiplier;
                    this.width = maxWithComputed * this.psOptions.cursorRadius / dst / maxSizeMultiplier;
                    if (this.width >= maxWithComputed) {
                        this.width = maxWithComputed;
                    }
                    let maxHeightComputed = this.defaultWidth * maxSizeMultiplier;
                    this.height = maxHeightComputed * this.psOptions.cursorRadius / dst / maxSizeMultiplier;
                    if (this.height >= maxHeightComputed) {
                        this.height = maxHeightComputed;
                    }
                }
            } else if (this.psOptions.cursorMode == CursorMode.Light) {
                if (dst === 0) {
                    this.tint.opacity = 1;
                } else {
                    this.tint.opacity = this.psOptions.cursorRadius / dst - 1;
                }
                if (this.tint.opacity > 1) {
                    this.tint.opacity = 1;
                }
            }
        } else {
            if (this.psOptions.cursorMode == CursorMode.Zoom) {
                this.width = this.defaultWidth;
                this.height = this.defaultHeight;
            }
            if (this.psOptions.cursorMode == CursorMode.Light) {
                this.tint.opacity = 0;
            }
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
        // Particle fadeOut
        context.globalAlpha = this.lifeOpacity;
        context.drawImage(this.image, - ((this.width / 2) * this.lifeScale), -((this.height / 2)* this.lifeScale), this.width * this.lifeScale, this.height * this.lifeScale);
        if (this.tint.isActive()) {
            context.globalAlpha = this.tint.opacity;
            context.drawImage(this.buffer, - this.width / 2, - this.height / 2, this.width, this.height);
        }
        context.restore();
    }

    public die() {
        this.alive = false;
    }

    public get isAlive(): boolean {
        return this.alive;
    }

}