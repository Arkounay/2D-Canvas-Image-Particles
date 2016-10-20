/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	///<reference path="ref/stats.ts"/>
	var Vector_1 = __webpack_require__(2);
	var ParticleSystem_1 = __webpack_require__(3);
	var debug = typeof Stats !== 'undefined';
	if (debug) {
	    var stats = new Stats();
	    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
	    document.body.appendChild(stats.dom);
	}
	exports.cursor = {
	    position: new Vector_1.default(0, 0),
	    radius: 100
	};
	exports.particleSystems = [];
	var lastUpdate = Date.now();
	// main loop
	window.main = function () {
	    if (debug) {
	        stats.begin();
	    }
	    var now = Date.now();
	    var delta = (now - lastUpdate) / 100;
	    lastUpdate = now;
	    for (var _i = 0, particleSystems_1 = exports.particleSystems; _i < particleSystems_1.length; _i++) {
	        var particleSystem = particleSystems_1[_i];
	        particleSystem.update(delta);
	    }
	    if (debug) {
	        for (var _a = 0, particleSystems_2 = exports.particleSystems; _a < particleSystems_2.length; _a++) {
	            var particleSystem = particleSystems_2[_a];
	            particleSystem.debug();
	        }
	        stats.end();
	    }
	    window.requestAnimationFrame(window.main);
	};
	window.main();
	window.ParticleSystem = ParticleSystem_1.default;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/**
	 * Created by antonin on 18/10/2016.
	 */
	"use strict";
	var Vector = (function () {
	    function Vector(x, y) {
	        this.x = x;
	        this.y = y;
	        this.set(x, y);
	    }
	    Vector.prototype.set = function (x, y) {
	        this.x = x;
	        this.y = y;
	        return this;
	    };
	    Vector.prototype.add = function (x, y) {
	        this.x += x;
	        this.y += y;
	        return this;
	    };
	    Vector.prototype.dst2 = function (x, y) {
	        var x_d = x - this.x;
	        var y_d = y - this.y;
	        return x_d * x_d + y_d * y_d;
	    };
	    Vector.prototype.dst = function (x, y) {
	        return Math.sqrt(this.dst2(x, y));
	    };
	    Vector.prototype.len = function () {
	        return Math.sqrt(this.x * this.x + this.y * this.y);
	    };
	    Vector.prototype.nor = function () {
	        var len = this.len();
	        if (len !== 0) {
	            this.x /= len;
	            this.y /= len;
	        }
	        return this;
	    };
	    Vector.prototype.scl = function (x, y) {
	        this.x *= x;
	        this.y *= y;
	        return this;
	    };
	    Vector.prototype.cpy = function () {
	        return new Vector(this.x, this.y);
	    };
	    Vector.prototype.rotate = function (degrees) {
	        return this.rotateRad(degrees * Math.PI / 180);
	    };
	    Vector.prototype.angle = function () {
	        var angle = Math.atan2(this.y, this.x) * 180 / Math.PI;
	        if (angle < 0)
	            angle += 360;
	        return angle;
	    };
	    Vector.prototype.setRotation = function (degrees) {
	        return this.setRotationRad(degrees * Math.PI / 180);
	    };
	    Vector.prototype.setRotationRad = function (radians) {
	        this.set(this.len(), 0);
	        this.rotateRad(radians);
	        return this;
	    };
	    Vector.prototype.rotateRad = function (radians) {
	        var cos = Math.cos(radians);
	        var sin = Math.sin(radians);
	        var newX = this.x * cos - this.y * sin;
	        var newY = this.x * sin + this.y * cos;
	        this.x = newX;
	        this.y = newY;
	        return this;
	    };
	    return Vector;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Vector;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Main = __webpack_require__(1);
	var Particle_1 = __webpack_require__(4);
	var Main_1 = __webpack_require__(1);
	/**
	 * A Particle System.
	 */
	var ParticleSystem = (function () {
	    function ParticleSystem(canvasElementId, image, maxParticles) {
	        var _this = this;
	        if (maxParticles === void 0) { maxParticles = 200; }
	        this.particles = []; // TODO : particle emitter
	        this.image = new Image();
	        this.canvas = document.getElementById(canvasElementId);
	        this.canvas.width = self.innerWidth;
	        this.canvas.height = self.innerHeight;
	        this.context = this.canvas.getContext('2d');
	        this.image.src = image;
	        this.maxParticles = maxParticles;
	        window.addEventListener('resize', function () {
	            _this.canvas.width = self.innerWidth;
	            _this.canvas.height = self.innerHeight;
	        });
	        window.addEventListener('mousemove', function (event) {
	            Main_1.cursor.position.set(event.clientX, event.clientY);
	        }, false);
	        this.canvas.addEventListener('click', function (event) {
	            if (_this.particles !== undefined) {
	                for (var i = 0; i < 5; i++) {
	                    _this.particles.push(new Particle_1.default(event.clientX, event.clientY, _this.image));
	                }
	            }
	        }, false);
	        for (var i = 0; i < this.canvas.width * this.canvas.height / 41000; i++) {
	            this.particles.push(new Particle_1.default(Math.random() * this.canvas.width, Math.random() * this.canvas.height, this.image));
	        }
	        Main.particleSystems.push(this);
	    }
	    /**
	     * Update called by requestAnimationFrame.
	     * @param delta - Delta Time
	     */
	    ParticleSystem.prototype.update = function (delta) {
	        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	        for (var i = this.particles.length - 1; i >= 0; i--) {
	            var particle = this.particles[i];
	            particle.update(delta);
	            particle.draw(this.context);
	            if (this.particles.length > this.maxParticles) {
	                // remove particles that are off-screen if limit is reached
	                // TODO : pool
	                if (particle.position.x < -particle.size || particle.position.x > this.canvas.width + particle.size || particle.position.y < -particle.size || particle.position.y > this.canvas.height + particle.size) {
	                    particle.die();
	                }
	            }
	            else {
	                // move particle to the other edge of the screen
	                if (particle.position.x < -particle.size) {
	                    particle.position.x = this.canvas.width;
	                }
	                else if (particle.position.x > this.canvas.width + particle.size) {
	                    particle.position.x = 0;
	                }
	                if (particle.position.y < -particle.size) {
	                    particle.position.y = this.canvas.height;
	                }
	                else if (particle.position.y > this.canvas.height + particle.size) {
	                    particle.position.y = 0;
	                }
	            }
	            if (!particle.isAlive) {
	                this.particles.splice(i, 1);
	            }
	        }
	    };
	    /**
	     * Draws debugging lines
	     */
	    ParticleSystem.prototype.debug = function () {
	        this.context.beginPath();
	        this.context.fillStyle = "white";
	        this.context.arc(Main_1.cursor.position.x, Main_1.cursor.position.y, Main_1.cursor.radius, 0, 2 * Math.PI);
	        this.context.stroke();
	    };
	    ParticleSystem.prototype.getCanvas = function () {
	        return this.canvas;
	    };
	    return ParticleSystem;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ParticleSystem;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Vector_1 = __webpack_require__(2);
	var Main = __webpack_require__(1);
	var Particle = (function () {
	    function Particle(x, y, image) {
	        this.alive = true;
	        var randomSize = Math.random();
	        this.size = 8 + randomSize * 25;
	        this.position = new Vector_1.default(x, y);
	        this.velocity = new Vector_1.default(0, 0);
	        this.setRandomVelocity();
	        this.rotation = Math.random() * 360;
	        this.rotationSpeed = 6 - randomSize * 5.5;
	        this.image = image;
	    }
	    Particle.prototype.setRandomVelocity = function () {
	        this.velocity.set((Math.random() - .5) * Particle.MAX_SPEED, (Math.random() - .5) * Particle.MAX_SPEED);
	    };
	    Particle.prototype.update = function (delta) {
	        this.position.add(this.velocity.x * delta, this.velocity.y * delta);
	        this.rotation += this.rotationSpeed * delta;
	        // when the cursor is near, bounce and move to the opposite side
	        var dst = this.position.dst(Main.cursor.position.x, Main.cursor.position.y);
	        if (dst < Main.cursor.radius) {
	            var intersection = this.position.cpy().add(-Main.cursor.position.x, -Main.cursor.position.y);
	            this.velocity.setRotation(intersection.angle());
	            var scl = delta;
	            if (dst > Main.cursor.radius * .9) {
	                scl = delta * .2;
	            }
	            intersection.scl(scl, scl).add(this.position.x, this.position.y);
	            this.position.set(intersection.x, intersection.y);
	        }
	    };
	    /**
	     * Renders the particle
	     * @param context - Canvas context
	     */
	    Particle.prototype.draw = function (context) {
	        context.save();
	        context.beginPath();
	        context.translate(this.position.x, this.position.y);
	        context.rotate(this.rotation * Math.PI / 180);
	        context.drawImage(this.image, -this.size / 2, -this.size / 2, this.size, this.size);
	        context.fill();
	        context.restore();
	    };
	    Particle.prototype.die = function () {
	        this.alive = false;
	    };
	    Object.defineProperty(Particle.prototype, "isAlive", {
	        get: function () {
	            return this.alive;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Particle.MAX_SPEED = 12;
	    return Particle;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Particle;


/***/ }
/******/ ]);