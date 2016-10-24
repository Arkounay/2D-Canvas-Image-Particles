# WIP

## 2D Particle System using Canvas

TODO :
- [x] ~~handle multiple canvas~~
- [ ] add more options
- [ ] test on ie9
- [ ] create example page

### Usage
- Create a canvas with an id 
- Import dist/2d-canvas-image-particles.js
- Create a new ParticleSystem : `new ParticleSystem(canvas_id, image_path, options);`

### Options :
    {
        maxParticles: 200,
        velocityAngle: [0, 360],
        cursorMode: CursorMode.Bounce
    }

#### Example
    <canvas id="js-canvas"></canvas>
    
    <script src="dist/2d-canvas-image-particles.js"></script>
    <script>
        new ParticleSystem('js-canvas', 'images/default-particle.png', {
            cursorMode: CursorMode.Zoom
        });
    </script>