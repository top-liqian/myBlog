const path = require('path')
const RunPlugin  = require('./plugins/run-plugins')
const DonePlugin = require('./plugins/done-plugins')

module.exports = {
    mode: 'development',
    context: process.cwd(), // 根目录
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    resolve: {
        extensions: ['.js', '.json']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    path.resolve(__dirname, 'loaders', 'logger-loader')
                ]
            },
            {
                test: /\.js$/,
                use: [
                    path.resolve(__dirname, 'loaders', 'logger1-loader')
                ]
            },
        ]
    },
    plugins: [
        new RunPlugin(),
        new DonePlugin()
    ]

}