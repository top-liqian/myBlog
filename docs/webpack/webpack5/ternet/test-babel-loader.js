// ./loaders/babel-loader
const core = require('@babel/core')
const path = require('path')
/* 
  *  source：上个loader给这个loader的内容或者是原始模块的代码
  *  inputSourceMap： 上一个loader传递过来的sourceMap
  *  data:
*/
function loader(source, inputSourceMap, data) {
    const options = {
        presets: ["@babel/preset-env"],
        inputSourceMap, // 
        sourceMaps: true, // 告诉babel我们要生成map
        filename: path.basename(this.resourcePath)
    }
    let { code, map, ast } = core.transform(source, options)
    return this.callback(null, code, map, ast)
}

module.exports = loader

// map: 可以让我们进行代码调试，debug的时候可以看到源代码
// ast: 如果返回了ast给webpack，webpack则直接分析就可以了，就不需要自己转换ast了，节约了打包时间

// webpack.config.js

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                use:[path.resolve('./loaders/babel-loader.js')]
            }
        ]
    }
}


