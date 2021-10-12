import * as Main from "./Main";
import {cursor} from "./Main";
import Particle from "./Particle";
import Vector from "./Vector";
import {mergeObjects} from "./Utils";
import Tint from "./Tint";
import {CursorMode, RotationMode} from "./Modes";
import {PSOptionInterface} from "./PSOptionInterface";

/**
 * A Particle System.
 */
export default class ParticleSystem {
    public static readonly defaults:PSOptionInterface = {
        maxParticles: 200,
        velocityAngle: [0, 360],
        speed: [20, 100],
        cursorMode: CursorMode.Bounce,
        rotationMode: RotationMode.Random,
        rotationStartAngle: [0, 360],
        minimumRotationSpeed: 0,
        rotationSpeed: [50, 50],
        rotationSpeedSizeScale: 1,
        tints: [new Tint('#FFFFFF', 0)],
        width: [8, 32],
        height: [8, 32],
        addOnClickNb: 5,
        density: 1,
        cursorRadius: 100,
        particleLifeTime: 0,
        particlePreDieTime: 1,
        particleCreationThrottle: 16 // Unit = ms
    };
    public readonly cursorRelativeVector = new Vector(0, 0);
    public readonly options:any = {};
    protected context;
    protected canvasBoundingClient: ClientRect;
    protected canvas: HTMLCanvasElement;
    protected particles: Array<Particle> = []; // TODO : particle emitter
    protected image = new Image();
    protected lastCursorPos: Vector;
    protected timer: number;
    protected timerThrottle: number;

    public constructor(canvas: string|HTMLCanvasElement, image: string, options: {} = {}) {
        if (typeof canvas === 'string') {
            this.canvas = <HTMLCanvasElement> document.getElementById(canvas);
        } else {
            this.canvas = canvas;
        }
        this.context = this.canvas.getContext('2d');
        this.image.src = image;
        this.options = mergeObjects(ParticleSystem.defaults, options);
        // New
        this.lastCursorPos = new Vector(0, 0);
        this.timer = 0;
        this.timerThrottle = this.options.particleCreationThrottle / 1000;

        window.addEventListener('resize', () => {
            this.onResize();
        });
        window.addEventListener('scroll', () => {
            this.onScroll();
        });
        this.onResize();

        this.image.onload = () => {
            this.canvas.addEventListener('click', () => {
                if (this.particles !== undefined) {
                    for (let i = 0; i < this.options.addOnClickNb; i++) {
                        this.particles.push(new Particle(this, this.cursorRelativeVector.x, this.cursorRelativeVector.y, this.image));
                    }
                }
            }, false);

            if (this.options.cursorMode !== CursorMode.Follow) {
                this.populate();
            }

            Main.particleSystems.push(this);
        };
    }

    protected populate() {
        for (let i = 0; i < this.canvas.width * this.canvas.height / 20000 * this.options.density && i < this.options.maxParticles; i++) {
            this.particles.push(new Particle(this, Math.random() * this.canvas.width, Math.random() * this.canvas.height, this.image));
        }
    }

    protected onScroll() {
        this.canvasBoundingClient = this.canvas.getBoundingClientRect();
    }

    protected onResize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.canvasBoundingClient = this.canvas.getBoundingClientRect();
    };

    /**
     *
     * @param cursorPosition
     */
    protected onFollow(cursorPosition: Vector) {
        if (!this.lastCursorPos.equals(cursorPosition)) {
            for (let i = 0; i < this.options.density; i++) {
                let a = Math.random();
                let b = Math.random();
                if (a < b) {
                    // [a, b] = [b, a]; ES6 swap
                    let tmp = a;
                    a = b;
                    b = tmp;
                }
                // b*R*sin(2*pi*a/b)).
                // generate randomly within cursor radius
                let x = this.cursorRelativeVector.x + b * this.options.cursorRadius * Math.cos(2 * Math.PI * a / b);
                let y = this.cursorRelativeVector.y + b * this.options.cursorRadius * Math.sin(2 * Math.PI * a / b);
                this.particles.push(new Particle(this, x, y, this.image));
            }
        }
    }

    /**
     * Called before the context starts updating and drawing
     */
    public preUpdate() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Update called by requestAnimationFrame.
     * @param delta - Delta Time
     */
    public update(delta: number) {
        this.timer += delta;
        this.cursorRelativeVector.set(cursor.position.x - this.canvasBoundingClient.left, cursor.position.y - this.canvasBoundingClient.top);

        if (this.options.cursorMode === CursorMode.Follow) {
            if (this.timer > this.timerThrottle) {
                this.onFollow(cursor.position);
                this.timer = 0;
            }
        }

        for (let i = this.particles.length - 1; i >= 0; i--) {
            let particle = this.particles[i];
            particle.update(delta);
            particle.draw(this.context);

            if (this.particles.length > this.options.maxParticles) {
                // remove particles that are off-screen if limit is reached
                // TODO : pool
                if (particle.position.x < -particle.width || particle.position.x > this.canvas.width + particle.width || particle.position.y < -particle.height || particle.position.y > this.canvas.height + particle.height) {
                    particle.die();
                }
            } else {
                // move particle to the other edge of the screen
                if (particle.position.x < -particle.width) {
                    particle.position.x = this.canvas.width;
                } else if (particle.position.x > this.canvas.width + particle.width) {
                    particle.position.x = 0;
                }
                if (particle.position.y < -particle.height) {
                    particle.position.y = this.canvas.height;
                } else if (particle.position.y > this.canvas.height + particle.height) {
                    particle.position.y = 0;
                }
            }

            if (!particle.isAlive) {
                this.particles.splice(i, 1);
            }
        }

        this.lastCursorPos.set(cursor.position.x, cursor.position.y);
    }

    /**
     * Draws debugging lines
     */
    public debug() {
        this.context.beginPath();
        this.context.fillStyle = "white";
        this.context.arc(this.cursorRelativeVector.x, this.cursorRelativeVector.y, this.options.cursorRadius, 0, 2 * Math.PI);
        this.context.stroke();
    }

    public destroy(): void {
        delete Main.particleSystems[Main.particleSystems.indexOf(this)];
    }

    public static destroyAll(): void {
        Main.particleSystems.splice(0);
    }

}