import * as Main from './Main';
import Particle from "./Particle";
import {cursor} from "./Main";

/**
 * A Particle System.
 */
export default class ParticleSystem {
    private readonly maxParticles;
    private canvas: HTMLCanvasElement;
    protected context;
    protected particles: Array<Particle> = []; // TODO : particle emitter
    protected image = new Image();

    public constructor(canvasElementId: string, image: string, maxParticles = 200) {
        this.canvas = <HTMLCanvasElement> document.getElementById(canvasElementId);
        this.canvas.width = self.innerWidth;
        this.canvas.height = self.innerHeight;
        this.context = this.canvas.getContext('2d');
        this.image.src = image;
        this.maxParticles = maxParticles;

        window.addEventListener('resize', () => {
            this.canvas.width = self.innerWidth;
            this.canvas.height = self.innerHeight;
        });

        window.addEventListener('mousemove', function(event) {
            cursor.position.set(event.clientX, event.clientY);
        }, false);

        this.canvas.addEventListener('click', (event) => {
            if (this.particles !== undefined) {
                for (let i = 0; i < 5; i++) {
                    this.particles.push(new Particle(event.clientX, event.clientY, this.image));
                }
            }
        }, false);

        for (let i = 0; i < this.canvas.width * this.canvas.height / 41000; i++) {
            this.particles.push(new Particle(Math.random() * this.canvas.width, Math.random() * this.canvas.height, this.image));
        }

        Main.particleSystems.push(this);
    }

    /**
     * Update called by requestAnimationFrame.
     * @param delta - Delta Time
     */
    public update(delta: number) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            let particle = this.particles[i];
            particle.update(delta);
            particle.draw(this.context);

            if (this.particles.length > this.maxParticles) {
                // remove particles that are off-screen if limit is reached
                // TODO : pool
                if (particle.position.x < -particle.size || particle.position.x > this.canvas.width + particle.size || particle.position.y < -particle.size || particle.position.y > this.canvas.height + particle.size) {
                    particle.die();
                }
            } else {
                // move particle to the other edge of the screen
                if (particle.position.x < -particle.size) {
                    particle.position.x = this.canvas.width;
                } else if (particle.position.x > this.canvas.width + particle.size) {
                    particle.position.x = 0;
                }
                if (particle.position.y < -particle.size) {
                    particle.position.y = this.canvas.height;
                } else if (particle.position.y > this.canvas.height + particle.size) {
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
        this.context.arc(cursor.position.x, cursor.position.y, cursor.radius, 0, 2 * Math.PI);
        this.context.stroke();
    }

    public getCanvas(): HTMLCanvasElement {
        return this.canvas;
    }

}