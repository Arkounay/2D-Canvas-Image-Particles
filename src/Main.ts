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
    (<any>window).particleStats = stats;
}

export let cursor = {
    position: new Vector(0, 0),
};

window.addEventListener('mousemove', function(event) {
    cursor.position.set(event.clientX, event.clientY);
}, false);

export let particleSystems: Array<ParticleSystem> = [];

let lastUpdate = Date.now();

// IE9 requestAnimationFrame polyfill:
(function() {
    let lastTime = 0;
    let vendors = ['webkit', 'moz'];
    for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = <any>function(callback, element) {
            let currTime = new Date().getTime();
            let timeToCall = Math.max(0, 16 - (currTime - lastTime));
            let id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

// main loop
(<any>window).main = function () {
    if (debug) {
        stats.begin();
    }

    let now = Date.now();
    let delta = (now - lastUpdate) / 1000;
    lastUpdate = now;

    if (delta > 1) {
        delta = 1;
    }

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
