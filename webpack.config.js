module.exports = {
    entry: ['./src/Main.ts', './src/ParticleSystem.ts'],
    output: {
        path: './dist',
        filename: '2d-canvas-image-particles.js',
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