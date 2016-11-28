///<reference path="ref/stats.ts"/>
import Vector from "./Vector";
import ParticleSystem from "./ParticleSystem";
import {CursorMode} from "./Modes";
import {RotationMode} from "./Modes";
import Tint from "./Tint";

let debug: boolean = typeof Stats !== 'undefined';
if (debug) {
    var stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    stats.domElement.style.position = 'fixed';
    stats.domElement.style.bottom = '0';
    stats.domElement.style.top = 'auto';
    document.body.appendChild(stats.dom);
}

export var cursor = {
    position: new Vector(0, 0),
};

window.addEventListener('mousemove', function(event) {
    cursor.position.set(event.clientX + window.pageXOffset, event.clientY + window.pageYOffset);
}, false);

export var particleSystems: Array<ParticleSystem> = [];

let lastUpdate = Date.now();

// main loop
(<any>window).main = function () {
    if (debug) {
        stats.begin();
    }

    let now = Date.now();
    let delta = (now - lastUpdate) / 100;
    lastUpdate = now;

    for (let particleSystem of particleSystems) {
        particleSystem.preUpdate();
    }

    for (let particleSystem of particleSystems) {
        particleSystem.update(delta);
    }

    if (debug) {
        for (let particleSystem of particleSystems) {
            particleSystem.debug();
        }

        stats.end();
    }

    window.requestAnimationFrame((<any>window).main);
};

(<any>window).main();

// export
(<any>window).ParticleSystem = ParticleSystem;
(<any>window).Tint = Tint;
(<any>window).CursorMode = CursorMode;
(<any>window).RotationMode = RotationMode;
