module.exports = {
    entry: ['./src/Polyfill.ts', './src/Main.ts', './src/ParticleSystem.ts'],
    output: {
        path: './dist',
        filename: '2d-canvas-image-particles.min.js',
    },
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    }
}