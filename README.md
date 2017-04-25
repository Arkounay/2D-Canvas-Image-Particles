# 2D Particle System using Canvas

A simple lightweight 2D particle system using Canvas.

- Multiple particle systems can be bound to the same canvas
- Particles speed remain the same regardless of the refreshing rate
- Less than 10 KB
- Refresh rate independant : particles have the same behaviour between 60hz / 144hz monitors

[Check the demo page](https://arkounay.github.io/2D-Canvas-Image-Particles/)

## Usage
- Create a canvas with an id 
- Import dist/2d-canvas-image-particles.min.js
- Create a new ParticleSystem : `new ParticleSystem(canvas_id, image_path, options);`

### Example
    <canvas id="js-canvas"></canvas>
    
    <script src="dist/2d-canvas-image-particles.min.js"></script>
    <script>
        new ParticleSystem('js-canvas', 'images/default-particle.png', {
            cursorMode: CursorMode.Zoom
        });
    </script>
    
You can check the [demo page](https://arkounay.github.io/2D-Canvas-Image-Particles/)'s sources for more examples.

### Options
    {
        maxParticles: number,
        velocityAngle: [min, max],
        speed: [min, max],
        rotationStartAngle: [min, max],
        cursorMode: CursorMode,     // (CursorMode.Bounce, CursorMode.Zoom, CursorMode.Light),
        rotationMode: RotationMode, // (RotationMode.None, RotationMode.Random, RotationMode.FollowVelocity)
        rotationSpeed: [min, max],
        rotationSpeedSizeScale: number
        minimumRotationSpeed: number // if min is negative and max is positive
        tints: [new Tint('#hexColor', opacity)],
        width: [min, max],
        height: [min, max],
        addOnClickNb: number,
        density: number,
        cursorRadius: number
    }


#### Cursor Modes
* CursorMode.**Bounce**: particles will bounce off the cursor.
* CursorMode.**Zoom**: the closer the cursor is, the bigger the particles are.
* CursorMode.**Light**: works with Tint. Particles will enlight when cursor is close.

#### Rotation Modes
* RotationMode.**None**
* RotationMode.**Random**
* RotationMode.**FollowVelocity**: Will follow the specified velocity (use it with _CursorMode.Bounce_ so the particles go back to their base velocity, this is used for the rain example)
    
## Build from sources
- `npm install`
- `npm run build`

## IE Support
- IE9+ 