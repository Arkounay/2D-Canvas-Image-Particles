import * as Main from './Main';
import Particle from "./Particle";
import {cursor} from "./Main";
import Vector from "./Vector";
import {mergeObjects} from "./Utils";
import {CursorMode} from "./CursorMode";

/**
 * A Particle System.
 */
export default class ParticleSystem {
    public static readonly defaults:any = {
        maxParticles: 200,
        velocityAngle: [0, 360],
        cursorMode: CursorMode.Bounce,
    };
    public readonly cursorRelativeVector = new Vector(0, 0);
    public readonly options:any = {};
    private canvas: HTMLCanvasElement;
    protected context;
    protected particles: Array<Particle> = []; // TODO : particle emitter
    protected image = new Image();

    public constructor(canvasElementId: string, image: string, options: {} = {}) {
        this.canvas = <HTMLCanvasElement> document.getElementById(canvasElementId);
        this.context = this.canvas.getContext('2d');
        this.image.src = image;
        this.options = mergeObjects(ParticleSystem.defaults, options);
        console.log(this.options.velocityAngle);

        window.addEventListener('resize', () => {
            this.onResize();
        });
        this.onResize();

        this.canvas.addEventListener('click', () => {
            if (this.particles !== undefined) {
                for (let i = 0; i < 5; i++) {
                    this.particles.push(new Particle(this, this.cursorRelativeVector.x, this.cursorRelativeVector.y, this.image));
                }
            }
        }, false);

        for (let i = 0; i < this.canvas.width * this.canvas.height / 41000; i++) {
            this.particles.push(new Particle(this, Math.random() * this.canvas.width, Math.random() * this.canvas.height, this.image));
        }

        Main.particleSystems.push(this);

    }

    protected onResize() {
        // TODO Check IE
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
    };

    /**
     * Update called by requestAnimationFrame.
     * @param delta - Delta Time
     */
    public update(delta: number) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.cursorRelativeVector.set(cursor.position.x - this.canvas.offsetLeft, cursor.position.y - this.canvas.offsetTop);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            let particle = this.particles[i];
            particle.update(delta);
            particle.draw(this.context);

            if (this.particles.length > this.options.maxParticles) {
                // remove particles that are off-screen if limit is reached
                // TODO : pool
                if (particle.position.x < -particle.defaultSize || particle.position.x > this.canvas.width + particle.defaultSize || particle.position.y < -particle.defaultSize || particle.position.y > this.canvas.height + particle.defaultSize) {
                    particle.die();
                }
            } else {
                // move particle to the other edge of the screen
                if (particle.position.x < -particle.defaultSize) {
                    particle.position.x = this.canvas.width;
                } else if (particle.position.x > this.canvas.width + particle.defaultSize) {
                    particle.position.x = 0;
                }
                if (particle.position.y < -particle.defaultSize) {
                    particle.position.y = this.canvas.height;
                } else if (particle.position.y > this.canvas.height + particle.defaultSize) {
                    particle.position.y = 0;
                }
            }

            if (!particle.isAlive) {
                this.particles.splice(i, 1);
            }
        }
    }

    /**
     * Draws debugging lines
     */
    public debug() {
        this.context.beginPath();
        this.context.fillStyle = "white";
        this.context.arc(this.cursorRelativeVector.x, this.cursorRelativeVector.y, cursor.radius, 0, 2 * Math.PI);
        this.context.stroke();
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

}