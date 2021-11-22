# 生产环境webpack实战配置

## 一、提取css

因为css的下载与js的运行是并行的，当html比较大的情况下，所以我们把css单独的提取出来

npm i mini-css-extract-plugin

```js
const HtmlWepackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    loaders: [
        {
            test: /\.css/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'] // MiniCssExtractPlugin.loader替换style-loader收集所有的css
        }
    ]
    plugins:[
        // 将生成的css脚本插到html文档当中
        new HtmlWepackPlugin({
            template: './src/index.html'
        })
        // 将收集到的全部css汇总生成一个脚本
        new MiniCssExtractPlugin({
            filename: '[name].css'
        })
    ]
}
``` 

> 1. 为什么HtmlWepackPlugin插件会知道有css需要插入到html当中
> 
> 答： 原因是因为webpack的在打包结束之后会将所有的打包资源都放在assets对象上面，HtmlWepackPlugin会将assets对象上面的所有要插入到html的东西一次性都插入

> 2. chunkName的来由，即命名算法？
> 答： 
> 1. 把这个相对路径转换成绝对路径 c:\project\basic.js
> 2. 把这个绝对路径转换成相对于项目的相对路径 ./src/basic.js
> 3. 将相对路径中的.转成_ src_basic_js

**import 是一个天然的代码分隔快，只要遇到import就会单独生成一个chunk块。名字就是上述的名称算法**

> 3. 将图片放在images里面，将css放在css当中，怎么配置？

```js
const HtmlWepackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    loaders: [
        {
            test: /\.css/,
            use: [MiniCssExtractPlugin.loader, 'css-loader'] // MiniCssExtractPlugin.loader替换style-loader收集所有的css
        },
        {
            test: /\.(png|jgp|jpeg|bmp)$/,
            use: [{
                loader: 'file-loader',
                options: {
                    name: '[hash:5].[ext]',
                    esModule: false,
                    outputPath: 'images'
                    publicPath: '/images' // 加上/就是相对于根路径，不加/就是相当于当前的文件的相对路径 
                }
            }],
            exclude: /node_modules/, // 排除 node_modules 目录
        }
    ]
    plugins:[
        // 将生成的css脚本插到html文档当中
        new HtmlWepackPlugin({
            template: './src/index.html'
        })
        // 将收集到的全部css汇总生成一个脚本
        new MiniCssExtractPlugin({
            filename: '/css/[name].css'
        })
    ]
}
``` 

## 二、hash，chunkhash、contentHash

文件指纹是指打包后输出的文件名和后缀

hash一般是结合CDN缓存来使用的，通过webpack构建之后，生成对应的文件名自动带上对应的MD5值，如果文件内容改变的话，那么对应的文件哈希值也会发生改变，对应的HTML引用的url地址也会发生改变，触发CDN服务器从原服务器上拉取对应的数据，进而更新本地的缓存

｜ 占位符参数 ｜ 含义 ｜
｜ - ｜ - ｜
｜ ext ｜ 资源后缀名｜
｜name ｜ 文件名 ｜
｜path ｜ 文件相对路径｜
｜ folder｜ 文件所在的文件夹｜
｜ hash ｜ 每一次webpack构建生成的唯一的hash值｜
｜ chunkHash｜ 每个代码块（chunk）生成的hash值，来源于一个chunk，hash值就相同｜
｜contentHash ｜ 根据文件内容生成的hash值，内容相同，hash值就相同｜

> 1. 一个代码块可以产出多个文件 main main.js main.css，可是chunk里面那么多文件，取哪一个文件的contentHash来作为最终生成的assets文件名呢？
> 
>  答： assets和文件是一一对应的，main的chunk块会产出两个assets

> 2. output当中的filename和chunkFilename
> 
> 答： filename：是入口文件的名称；chunkFilename：是非入口文件的名称
> 
> 非入口文件有两个来源：
> 1. 代码分割 vendor common，例如说两个chunk块都公用jquery，那么jquery就会单独打包成一个chunk
> 2. 懒加载的方式，import

## 三、 css兼容性

为了浏览器兼容性，有时候我们必须加入 -webkit、-ms、-o、-moz这些前缀

+ Trident内核： -ms，IE浏览器
+ Gecko内核： -moz，FireFox
+ Presto内核：-o，Opera
+ Webkit内核：-webkit，Chrome

npm i postcss-loader postcss-preset-env


```js
// postcss.config.js

let postcssPresetEnv = require('postcss-preset-env')
module.exports = {
    plugins: [postcssPresetEnv()]
}

// webpack.config.js

module.exports = {
    loaders: [
        {
            test: /\.css/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'] 
        },
        {
            test: /\.less/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
        },
    ]
}
``` 

## 四、压缩css，js，html

npm i optimize-css-assets-webpack-plugin terser-webpack-plugin html-webpack-plugin

+ optimize-css-assets-webpack-plugin: 优化和压缩css资源的插件
+ terser-webpack-plugin： 优化和压缩js资源的插件， terserWebpackPlugin是uglifyPLugin的一个替代品，uglifyPLugin不再维护了
+ html-webpack-plugin: 启动html压缩

```js
// webpack.config.js - webpack5写法

const optimizeCssAssetsWebpackPlugin= require('optimize-css-assets-webpack-plugin')
const terserWebpackPlugin = require('terser-webpack-plugin')
const htmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    optimization: {
       minimize: true,
       minimizer: [
            new optimizeCssAssetsWebpackPlugin(),
            new terserWebpackPlugin()
       ]
    },
    plugins: [
        new htmlWebpackPlugin({
            template: './src/index.html',
            minify: {
                collapseWhiteSpace: true, // 空白自符
                removeComments: true, // 注释
            }
        })
    ]
}

// webpack4当中terserWebpackPlugin放在minimizer里面
// optimizeCssAssetsWebpackPlugin是放在plugins里面注入

``` 

优先级：

1. package.json 
2. postcssrc.js
3. postcss.json,posrcsss.yaml,postcss.yml,postcss.js,postcss.cjs
4. postcss.config.js或者postcss.config.cjs

## 五、px自动转化成res

npm i px2rem-loader  lib-flexible

+ px2rem-loader: 将px转换成rem
+ lib-flexible： 动态的计算fontsize值
  

```js
// 动态的计算fontsize值方法一：lib-flexible的写法
$(require('raw-loader!lib-flexible'))

// 动态的计算fontsize值方法二：lib-flexible相当于如下的代码：
let documentEle = document.documentElement
function setUnitRem() {
   documentEle.style.fontSize = document.clinetWidth / 10 + 'px'
}
setUnitRem()
window.addEventListener('resize', setUnitRem)
```

```js
const HtmlWepackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    loaders: [
        {
            test: /\.css/,
            use: [
                MiniCssExtractPlugin.loader, 
                'css-loader', 
                {
                    loader: 'px2rem-loader',
                    options: {
                        remUnit: 75,
                    }
                }
            ]
        },
       
    ]
}
``` 

## 六、 配置多入口

```js
const fs = require('fs')
const { resolve, basename, join }  = require('path')
let pageRoot = resolve(__dirname, 'src', 'pages')
let pages = fs.readdirSync(pageRoot)
let htmlWebpackPlugins = []

let entry = pages.reduce((entry, filename) => {
    let entryName = basename(filename, '.js')
    entry[entryName] = join(pageRoot, filename)
    htmlWebpackPlugins.push(new htmlWebpackPlugin({
        template: './public/index.html',
        fimeName: `${entryName === 'page1' ? 'index' : entryName}.html`,
        chunks: [entryName],
        minify: {
            collapseWhitespace: true,
            removeComments: true,
        }
    }))
    return entry
},{})

module.exports = {
    entry,
    plugins: [
        ...htmlWebpackPlugins
    ]
}

```

## webpack-merge

npm i webpack-merge -D

```js
const base = require('./webpack.config.base')
const { merge } = require('webpack-merge')

module.exports = merge(base, {
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: 'static',
        port: '8090',
        // quiet: false,
        // inline: true,
        // overlay: true,
        // stats: 'errors-only',
        // clientLogLevel: 'silent',
        compress: true,
        hot: true,
        writeToDisk: true,
        open: true,
    },
})
```

## .env的配置

npm i dotenv -D

```js
// .env

NODE_ENV=production

// webpack.config.js
require('dotenv').config()
console.log('process.env.NODE_ENV', process.env.NODE_ENV)
```
