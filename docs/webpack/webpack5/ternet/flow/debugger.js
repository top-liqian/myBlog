const webpack = require('./webpack/index')

const options = require('./webpack.config.js')

debugger

const compiler = webpack(options)

compiler.run()