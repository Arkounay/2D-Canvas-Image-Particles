# WIP!

## 2D Particle System using Canvas

A simple 2D particle system using Canvas.

- Multiple particle systems can be bound to the same canvas
- Works with 144hz monitors.


[demo](https://arkounay.github.io/2D-Canvas-Image-Particles/)

### Usage
- Create a canvas with an id 
- Import dist/2d-canvas-image-particles.js
- Create a new ParticleSystem : `new ParticleSystem(canvas_id, image_path, options);`

### Options :
    {
        maxParticles: number,
        velocityAngle: [min, max],
        speed: [min, max],
        rotationStartAngle: [min, max],
        cursorMode: CursorMode      // (Bounce, Zoom, Light),
        rotationMode: RotationMode,
        rotationSpeed: [min, max],
        tint: Tint                  // (new Tint('#hexColor', opacity)),
        width: [min, max],
        height: [min, max],
        addOnClickNb: number,
        density: number,
        cursorRadius: number
    }

#### Example
    <canvas id="js-canvas"></canvas>
    
    <script src="dist/2d-canvas-image-particles.js"></script>
    <script>
        new ParticleSystem('js-canvas', 'images/default-particle.png', {
            cursorMode: CursorMode.Zoom
        });
    </script>
    
You can check the [demo page](https://arkounay.github.io/2D-Canvas-Image-Particles/)'s sources for more examples.
    
### Build from sources
- `npm install`
- `npm run build`