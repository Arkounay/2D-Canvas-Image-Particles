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
	__webpack_require__(2);
	module.exports = __webpack_require__(4);


/***/ },
/* 1 */
/***/ function(module, exports) {

	// requestAnimFrame polyfill
	window.requestAnimFrame = (function () {
	    return window.requestAnimationFrame ||
	        window.webkitRequestAnimationFrame ||
	        window.mozRequestAnimationFrame ||
	        function (callback) {
	            window.setTimeout(callback, 1000 / 60);
	        };
	})();


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	///<reference path="ref/stats.ts"/>
	var Vector_1 = __webpack_require__(3);
	var ParticleSystem_1 = __webpack_require__(4);
	var Modes_1 = __webpack_require__(10);
	var Modes_2 = __webpack_require__(10);
	var Tint_1 = __webpack_require__(8);
	var debug = typeof Stats !== 'undefined';
	if (debug) {
	    var stats = new Stats();
	    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
	    stats.domElement.style.position = 'fixed';
	    stats.domElement.style.bottom = '0';
	    stats.domElement.style.top = 'auto';
	    document.body.appendChild(stats.dom);
	}
	exports.cursor = {
	    position: new Vector_1.default(0, 0),
	};
	window.addEventListener('mousemove', function (event) {
	    exports.cursor.position.set(event.clientX, event.clientY);
	}, false);
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
	        particleSystem.preUpdate();
	    }
	    for (var _a = 0, particleSystems_2 = exports.particleSystems; _a < particleSystems_2.length; _a++) {
	        var particleSystem = particleSystems_2[_a];
	        particleSystem.update(delta);
	    }
	    if (debug) {
	        for (var _b = 0, particleSystems_3 = exports.particleSystems; _b < particleSystems_3.length; _b++) {
	            var particleSystem = particleSystems_3[_b];
	            particleSystem.debug();
	        }
	        stats.end();
	    }
	    window.requestAnimationFrame(window.main);
	};
	window.main();
	// export
	window.ParticleSystem = ParticleSystem_1.default;
	window.Tint = Tint_1.default;
	window.CursorMode = Modes_1.CursorMode;
	window.RotationMode = Modes_2.RotationMode;


/***/ },
/* 3 */
/***/ function(module, exports) {

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
	    Vector.prototype.setAngle = function (degrees) {
	        return this.setAngleRad(degrees * Math.PI / 180);
	    };
	    Vector.prototype.setAngleRad = function (radians) {
	        this.set(this.len(), 0);
	        this.rotateRad(radians);
	        return this;
	    };
	    return Vector;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Vector;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Main = __webpack_require__(2);
	var Particle_1 = __webpack_require__(5);
	var Main_1 = __webpack_require__(2);
	var Vector_1 = __webpack_require__(3);
	var Utils_1 = __webpack_require__(7);
	var Tint_1 = __webpack_require__(8);
	var Modes_1 = __webpack_require__(10);
	/**
	 * A Particle System.
	 */
	var ParticleSystem = (function () {
	    function ParticleSystem(canvasElementId, image, options) {
	        var _this = this;
	        if (options === void 0) { options = {}; }
	        this.cursorRelativeVector = new Vector_1.default(0, 0);
	        this.options = {};
	        this.particles = []; // TODO : particle emitter
	        this.image = new Image();
	        this.canvas = document.getElementById(canvasElementId);
	        this.context = this.canvas.getContext('2d');
	        this.image.src = image;
	        this.options = Utils_1.mergeObjects(ParticleSystem.defaults, options);
	        console.log(this.options.velocityAngle);
	        window.addEventListener('resize', function () {
	            _this.onResize();
	        });
	        this.onResize();
	        this.image.onload = function () {
	            _this.canvas.addEventListener('click', function () {
	                if (_this.particles !== undefined) {
	                    for (var i = 0; i < _this.options.addOnClickNb; i++) {
	                        _this.particles.push(new Particle_1.default(_this, _this.cursorRelativeVector.x, _this.cursorRelativeVector.y, _this.image));
	                    }
	                }
	            }, false);
	            for (var i = 0; i < _this.canvas.width * _this.canvas.height / 20000 * _this.options.density; i++) {
	                _this.particles.push(new Particle_1.default(_this, Math.random() * _this.canvas.width, Math.random() * _this.canvas.height, _this.image));
	            }
	            Main.particleSystems.push(_this);
	        };
	    }
	    ParticleSystem.prototype.onResize = function () {
	        // TODO Check IE
	        this.canvas.width = this.canvas.clientWidth;
	        this.canvas.height = this.canvas.clientHeight;
	    };
	    ;
	    /**
	     * Called before the context starts updating and drawing
	     */
	    ParticleSystem.prototype.preUpdate = function () {
	        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	    };
	    /**
	     * Update called by requestAnimationFrame.
	     * @param delta - Delta Time
	     */
	    ParticleSystem.prototype.update = function (delta) {
	        this.cursorRelativeVector.set(Main_1.cursor.position.x - this.canvas.offsetLeft, Main_1.cursor.position.y - this.canvas.offsetTop);
	        for (var i = this.particles.length - 1; i >= 0; i--) {
	            var particle = this.particles[i];
	            particle.update(delta);
	            particle.draw(this.context);
	            if (this.particles.length > this.options.maxParticles) {
	                // remove particles that are off-screen if limit is reached
	                // TODO : pool
	                if (particle.position.x < -particle.width || particle.position.x > this.canvas.width + particle.width || particle.position.y < -particle.height || particle.position.y > this.canvas.height + particle.height) {
	                    particle.die();
	                }
	            }
	            else {
	                // move particle to the other edge of the screen
	                if (particle.position.x < -particle.width) {
	                    particle.position.x = this.canvas.width;
	                }
	                else if (particle.position.x > this.canvas.width + particle.width) {
	                    particle.position.x = 0;
	                }
	                if (particle.position.y < -particle.height) {
	                    particle.position.y = this.canvas.height;
	                }
	                else if (particle.position.y > this.canvas.height + particle.height) {
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
	        this.context.arc(this.cursorRelativeVector.x, this.cursorRelativeVector.y, this.options.cursorRadius, 0, 2 * Math.PI);
	        this.context.stroke();
	    };
	    ParticleSystem.defaults = {
	        maxParticles: 200,
	        velocityAngle: [0, 360],
	        speed: [2, 10],
	        cursorMode: Modes_1.CursorMode.Bounce,
	        rotationMode: Modes_1.RotationMode.Random,
	        rotationStartAngle: [0, 360],
	        rotationSpeed: [0, 360],
	        tint: new Tint_1.default('#FFFFFF', 0),
	        width: [8, 32],
	        height: [8, 32],
	        addOnClickNb: 5,
	        density: 1,
	        cursorRadius: 100
	    };
	    return ParticleSystem;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = ParticleSystem;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var Vector_1 = __webpack_require__(3);
	var Modes_1 = __webpack_require__(10);
	var Utils_1 = __webpack_require__(7);
	var Particle = (function () {
	    function Particle(particleSystem, x, y, image) {
	        this.alive = true;
	        this.particleSystem = particleSystem;
	        this.psOptions = particleSystem.options;
	        var randomSize = Math.random();
	        this.defaultWidth = this.psOptions.width[0] + randomSize * this.psOptions.width[1];
	        this.defaultHeight = this.psOptions.height[0] + randomSize * this.psOptions.height[1];
	        this.defaultSpeed = this.psOptions.speed[0] + Math.random() * (this.psOptions.speed[1] - this.psOptions.speed[0]);
	        this.width = this.defaultWidth;
	        this.height = this.defaultHeight;
	        this.position = new Vector_1.default(x, y);
	        this.velocity = new Vector_1.default(0, 0);
	        this.setRandomVelocity();
	        this.defaultVelocity = this.velocity.cpy();
	        this.defaultRotation = Utils_1.getRandomAngle(this.psOptions.rotationStartAngle[0], this.psOptions.rotationStartAngle[1]);
	        this.rotation = this.defaultRotation;
	        this.rotationSpeed = 6 - randomSize * 5.5; // TODO configurable
	        this.image = image;
	        // offscreen buffer
	        this.tint = this.psOptions.tint.clone();
	        if (this.tint.isActive() || this.psOptions.cursorMode == Modes_1.CursorMode.Light) {
	            this.buffer = document.createElement('canvas');
	            this.buffer.width = this.image.width;
	            this.buffer.height = this.image.height;
	            var tintedImage = this.buffer.getContext('2d');
	            // fill offscreen buffer with the tint color
	            tintedImage.fillStyle = this.tint.color;
	            tintedImage.fillRect(0, 0, this.buffer.width, this.buffer.height);
	            // destination atop makes a result with an alpha channel identical to the image, but with all pixels retaining their original color *as far as I can tell*
	            tintedImage.globalCompositeOperation = "destination-atop";
	            tintedImage.drawImage(this.image, 0, 0);
	        }
	    }
	    Particle.prototype.setRandomVelocity = function () {
	        this.velocity.set(this.defaultSpeed, 0);
	        this.velocity.setAngle(Utils_1.getRandomAngle(this.psOptions.velocityAngle[0], this.psOptions.velocityAngle[1]));
	    };
	    Particle.prototype.update = function (delta) {
	        this.position.add(this.velocity.x * delta, this.velocity.y * delta);
	        if (this.psOptions.rotationMode === Modes_1.RotationMode.FollowVelocity) {
	            this.rotation = this.velocity.angle() + this.defaultRotation;
	        }
	        else if (this.psOptions.rotationMode === Modes_1.RotationMode.Random) {
	            this.rotation += this.rotationSpeed * delta;
	        }
	        if (this.psOptions.rotationMode === Modes_1.RotationMode.FollowVelocity) {
	            // return to normal after bounce
	            var scl = .3 * delta;
	            var bounceVelocity = this.defaultVelocity.cpy().scl(scl, scl);
	            this.velocity.add(bounceVelocity.x, bounceVelocity.y).scl(1 - scl, 1 - scl);
	        }
	        var dst = this.position.dst(this.particleSystem.cursorRelativeVector.x, this.particleSystem.cursorRelativeVector.y);
	        if (dst < this.psOptions.cursorRadius) {
	            // when the cursor is near, bounce and move to the opposite side
	            if (this.psOptions.cursorMode == Modes_1.CursorMode.Bounce) {
	                var intersection = this.position.cpy().add(-this.particleSystem.cursorRelativeVector.x, -this.particleSystem.cursorRelativeVector.y);
	                this.velocity.setRotation(intersection.angle());
	                var scl = delta;
	                if (dst > this.psOptions.cursorRadius * .9) {
	                    scl = delta * .2;
	                }
	                intersection.scl(scl, scl).add(this.position.x, this.position.y);
	                this.position.set(intersection.x, intersection.y);
	            }
	            else if (this.psOptions.cursorMode == Modes_1.CursorMode.Zoom) {
	                if (dst > 0) {
	                    var maxSizeMultiplier = 2;
	                    var maxWithComputed = this.defaultWidth * maxSizeMultiplier;
	                    this.width = maxWithComputed * this.psOptions.cursorRadius / dst / maxSizeMultiplier;
	                    if (this.width >= maxWithComputed) {
	                        this.width = maxWithComputed;
	                    }
	                    var maxHeightComputed = this.defaultWidth * maxSizeMultiplier;
	                    this.height = maxHeightComputed * this.psOptions.cursorRadius / dst / maxSizeMultiplier;
	                    if (this.height >= maxHeightComputed) {
	                        this.height = maxHeightComputed;
	                    }
	                }
	            }
	            else if (this.psOptions.cursorMode == Modes_1.CursorMode.Light) {
	                if (dst === 0) {
	                    this.tint.opacity = 1;
	                }
	                else {
	                    this.tint.opacity = this.psOptions.cursorRadius / dst - 1;
	                }
	                if (this.tint.opacity > 1) {
	                    this.tint.opacity = 1;
	                }
	            }
	        }
	        else {
	            if (this.psOptions.cursorMode == Modes_1.CursorMode.Zoom) {
	                this.width = this.defaultWidth;
	                this.height = this.defaultHeight;
	            }
	            if (this.psOptions.cursorMode == Modes_1.CursorMode.Light) {
	                this.tint.opacity = 0;
	            }
	        }
	    };
	    /**
	     * Renders the particle
	     * @param context - Canvas context
	     */
	    Particle.prototype.draw = function (context) {
	        context.save();
	        context.translate(this.position.x, this.position.y);
	        context.rotate(this.rotation * Math.PI / 180);
	        context.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
	        if (this.tint.isActive()) {
	            context.globalAlpha = this.tint.opacity;
	            context.drawImage(this.buffer, -this.width / 2, -this.height / 2, this.width, this.height);
	        }
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
	    return Particle;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Particle;


/***/ },
/* 6 */,
/* 7 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Merge properties between two objects
	 * @param obj1
	 * @param obj2
	 * @returns {}
	 */
	function mergeObjects(obj1, obj2) {
	    var obj3 = {};
	    for (var key in obj1) {
	        obj3[key] = obj1[key];
	    }
	    for (var key in obj2) {
	        obj3[key] = obj2[key];
	    }
	    return obj3;
	}
	exports.mergeObjects = mergeObjects;
	function getRandomAngle(min, max) {
	    var res;
	    if (min === 0) {
	        res = Math.random() * max;
	    }
	    else {
	        var delta = ((max - min + 360 + 180) % 360) - 180;
	        res = (min + delta * Math.random() + 360) % 360;
	    }
	    return res;
	}
	exports.getRandomAngle = getRandomAngle;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	var Tint = (function () {
	    function Tint(color, opacity) {
	        this.color = color;
	        this.opacity = opacity;
	    }
	    Tint.prototype.isActive = function () {
	        return this.opacity > 0;
	    };
	    Tint.prototype.clone = function () {
	        return new Tint(this.color, this.opacity);
	    };
	    return Tint;
	}());
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Tint;


/***/ },
/* 9 */,
/* 10 */
/***/ function(module, exports) {

	"use strict";
	(function (CursorMode) {
	    CursorMode[CursorMode["Bounce"] = 0] = "Bounce";
	    CursorMode[CursorMode["Zoom"] = 1] = "Zoom";
	    CursorMode[CursorMode["Light"] = 2] = "Light";
	})(exports.CursorMode || (exports.CursorMode = {}));
	var CursorMode = exports.CursorMode;
	(function (RotationMode) {
	    RotationMode[RotationMode["None"] = 0] = "None";
	    RotationMode[RotationMode["Random"] = 1] = "Random";
	    RotationMode[RotationMode["FollowVelocity"] = 2] = "FollowVelocity";
	})(exports.RotationMode || (exports.RotationMode = {}));
	var RotationMode = exports.RotationMode;


/***/ }
/******/ ]);