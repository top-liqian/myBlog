# webpack5开发环境配置

## 一、webpack-dev-server - 其实就是一个express服务器 

1. webpack4与webpack5之间的区别

配置启动`webpack-dev-server`的时候 `webpack4`使用`webpack-dev-server`命令，`webpack5`使用`webpack serve`命令

```js
// webpack4
"scripts": {
    "dev": "webpack-dev-server",
}
// webpack5
"scripts": {
    "dev": "webpack serve",
}
```

2. 为什么启动webpack-dev-server并没有在output目录下面看到打包文件？

webpack-dev-server为了提高打包性能，采用的是`内存文件系统`即`memory-fs`，如果想看到打包之后的文件写入硬盘，需要指定`writeToDisk`选项为`true`

3. 为什么存在contentBase？

默认情况下webpack-dev-server会读取打包之后的目录即output目录，contentBase指定的目录为静态资源目录即通过`/目录名`可以访问到的目录，主要是提供多种静态目录而已, 读取文件的优先级为`output目录 > contentBase指定的目录`

4. webpack有两种用法：

+ webpakc-dev-server
+ webpack-dev-middleware：
    1. 会返回一个express中间件，启动webpack的编译，生成a.hash.js等。
    2. 它会返回一个中间件，当接收到客户端对这些文件的访问的请求时，就会吧文件内容返回

```js
let express = require('express')
let app = express()
const webpack = require('webpack')
const webpackOptions = require('./webpack/config')
let webpackDevMiddleware = require('webpack-dev-middleware')
webpackOptions.mode = 'development'
const complier = webpack(webpackOptions)
app.use(webpackDevMiddleware(complier, {}))
app.listen(9000)
```
`webpakc-dev-server`和`webpack-dev-middleware`两者之间的差别：
1. webpakc-dev-server 的好处是相对简单，直接安装依赖之后执行命令即可
2. webpack-dev-middleware的好处是可以在即有的express代码的基础之上添加`webpakc-dev-server`的功能，同时利用express来根据需要添加的功能，如mock平台，代理API请求等等，比如说在express原有的代码基础之上添加打包功能 

**wepack-dev-server的配置项**

1. contentbase - devServer会启动一个静态资源服务器，把一个文件夹作为静态根目录

```js
devServer: {
    contentbase: resolve(__dirname, "public")
}
```

2. compress - 是否压缩

3. port - 端口号

4. writeToDisk - 是否将打包后的文件写入硬盘

> 面试题：多个path的区别是什么？
> 
> 答： 
> 1. output -> path： 绝对路径，打包之后的文件写入的目录
> 2. output -> publicPath: 静态目录文件位置，当你打包后的文件插入到html当中之后的src怎么写，publicPath + fileName，此配置可以是上线之后cdn的文件路径，也就是上次之后你想把你的静态资源放在什么位置，即线上的访问目录
> 3. devServer -> contentBase: 用于配置额外的静态文件目录，不需要打包的静态资源也需要访问就走整个路径
> 4. **devServer -> publicPath**：可以看作是devServer对生成目录dist设置的虚拟目录，devServer首先会在devServer设置的pubilcPath进行取值，如果它没有设置，就取output.publicPath的值作为虚拟目录，如果它也没有设置，就取默认值 '/'。
> **output.publicPath**不仅影响虚拟目录的取值，也影响利用**html-webpack-plugin**生成的**index.html当中js，css，img**等资源的引用路径，会自动在资源路径面前加上**output.publicPath**的值，一般情况下，**devServer.publicPath**和**output.publicPath**的值要保持一致，否则会出现资源找不到的现象发生



## 二、less&sass

css-loader 用来处理@import和url()
style-loader 用来将css插入到dom当中去

处理less语言需要使用 less-loader
处理sass语言需要使用 node-sass sass-loader

## 三、处理图片image

安装 file-loader url-loader html-loader


在webpack使用图片的三种方式

1. 放在静态文件根目录当中，通过HLML的img标签直接引入，需要配置**devServer的contentBase**

2. 使用import 或者 require 引入，会返回一个图片的新路径

+ file-loader 会读取import或者require文件，然后将文件copy到dist目录并且重命名转换成JS模块，新的名字来自options当中的name, 如果options当中的esMoudle设置成true，那么require返回是一个对象（es6模块），取值需要是**取对象的.default属性**，设置成false则返回文件的路径就可以直接使用

```js
{
    test: /\.(png|jgp|jpeg|bmp)$/,
    use: [{
        loader: 'file-loader',
        options: {
            name: '[hash:5].[ext]',
            esModule: false,
        }
    }],
    exclude: /node_modules/, // 排除 node_modules 目录
}
```

+ url-loader: 是对file-loader的一种增强，(内部是使用file-loader实现的)相较于file-loader多了一个limit参数，如果文件体积小于limit，就转成Base64内嵌到HTML当中,如果大于limit就转交给file-loader处理，其余的功能和file-loader一致

```js
{
    test: /\.(png|jgp|jpeg|bmp)$/,
    use: [{
        loader: 'file-loader',
        options: {
            name: '[hash:5].[ext]',
            esModule: false,
            limit: 8*1024
        }
    }],
    exclude: /node_modules/, // 排除 node_modules 目录
}
```
1. 可以在css中通过url引入，利用css-loader进行处理
2. 在HTML当中使用img标签，设置相对路径，需要使用html-loader进行解析处理

```js
{
    test: /\.html)$/,
    use: ['html-loader'],
    exclude: /node_modules/, // 排除 node_modules 目录
}
```

## 四、JS兼容性，转义ES6/ES7/JSX

安装依赖 babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/polyfill

+ babel-loader 转换器，使用babel和webpack转译JavsScript文件
+ @babel/core： babel编译的核心包
+ @babel/preset-env： 为每一个环境的预设，只能转换JS语法
+ @babel/preset-react：react插件的babel预设
+ @babel/polyfill：提供ES2015+环境的polyfill
+ @babel/plugin-proposal-decorators: 把类和对象装饰器编译成ES5
+ @babel/plugin-proposal-class-proproperites： 转译静态类属性以及使用属性初始值化语法声明的属性

babel其实是一个编译javasrcipt的平台，可以把ES6/ES7和react的JSX转换成ES2015

babel默认只转换新的javaScript语法，而不转换新的API，比如Iterator，Genrator，Set，Maps，Proxy，Reflect，Symbol，Promise等全局对象，以及一些在全局对象上的方法（比如Obejct.assign）都不会进行转码

比如说ES6在Array对象上面新增加了一个Array.form方法，babel就不会转译这个代码，必须使用babel-polyfill来进行转换，babel-polyfill它是通过向全局对象或者内置对象的prototype上面增加方法来进行实现的

@babel/preset-env: 为每一个环境预设，默认支持语法转化，需要开启useBuiltIns才能转换具体的API和实例方法

+ 语法：箭头函数
+ API：promise
+ 实例方法： String.prototype.includes
所以需要配置presets的options选项

1. useBuiltIns: 
   + false: 不对polyfill做操作，如果引入了@babel/babel/polyfill，则无视配置的浏览器兼容，那就是全部引入
   + entry： 根据配置的浏览器进行兼容，引入浏览器不兼容的polyfill，需要在入口手动增加 **import '@babel/polyfill'**,会自动根据browserslist替换成浏览器不兼容的所有的polyfill，这里需要指定corejs的版本，如果corejs的版本是3，需要在入口手动替换上述的语句增加 **import 'core-js/stable' import 'regenerator-runtime/runtime'**
   + 'usage' -> babel在转译的过程中就不需要把整个pollyfiles都引入进来，**按需加载**你使用的pollyfiles，减少包的体积
2. corejs: { version: 3 } -> 给低版本浏览器提供接口的库，例如说promise，map，set，使用babel的核心包的版本 2不支持Array.property.flat,3支持，在babel当中如果设置成false或者没有设置，则是默认使用corejs中的库，而且是全局引入，侵入了全局的变量
3. targets: { chrome: '60' } ->  兼容的浏览器版本

babel-runtime：为了解决全局污染的问题，提供了单独的一个包babel-runtime用来单独编译模块的工具函数

简单说，babel-runtime 更像是一种按需加载的实现，比如说你哪里需要promise。你就手动的在文件的头部进行引入 ` require Promise from '@babel-runtime/core-js/promise'`

@babel/plugins-transform-runtime: 可以手动的帮我们手动避免引入import，而是内部做了公有方法的抽离，在我们使用API的时候，自动帮我们import babel-runtimebabel-runtime里面的polyfill（内部引入了babel-runtime）

+ 当我们使用aasync/await，自动引入babel-runtime/babel-runtime/regenerator
+ ES的静态事件和内置对象，自动引入babel-runtime/core-js
+ 移除内联的babel helps并且替换使用babel-runtime/helps

```js
module: {
    rules: [
       {
            test: /\.jsx?$/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', {
                            useBuiltIns: 'usage', // 按需加载polyfill - 处理promise等es6语法
                            corejs: { version: 3 }, // 使用babel的核心包的版本 2不支持Array.property.flat,3支持
                            targets: { // 兼容的浏览器版本
                                chrome: '60',
                                firefox: '60',
                                ie: '9',
                                safari: '10',
                                edge: '10'
                            }
                        }],
                        '@babel/preset-react',
                    ],
                    plugins: [
                        ["@babel/plugin-proposal-decorators", { legacy: true }],
                        ["@babel/plugin-proposal-class-properties", { loose: false }]
                    ]
                }
            }],
       }
    ]
}
```
> 面试题1: legacy 和 loose 参数代表了什么？
> 
> 答：
> 
> "@babel/plugin-proposal-decorators"插件要配置在"@babel/plugin-proposal-class-properties"之前，内部内部机制决定的
> 
> legacy: true使用的的是旧的stage = 1的装饰器语法和行为
> 
> loose: true 决定了类的属性怎么进行编译。true编译成赋值表达式的形式，false编译成Object.definedProperty的形式

> 面试题2：为什么安装了babel-loader之后，还要安装@babel/core和@babel/preset-env
> 
> 答： 因为babel-loader是一个转换器，内部调用babel-core进行转译将得到的ES5代码返回
> 
> @babel/core本身只是提供一个过程管理的功能，把源代码转换成抽象语法树，进行遍历和生成，它本身也不知道具体要转换什么语法以及语法如何转换
> 
> @babel/preset-env: 具体要转换什么语法以及语法如何转换，preset-env只能转换部分ES6语法，对于promise，map，set等语法需要特殊的配置处理
> 
> 整个的过程如下：
> 1. @babel/core先将ES6转换成ES6语法树
> 2. @babel/preset-env将ES6语法树转换成ES5语法树
> 3. @babel/core在将ES5语法树转换成ES5语法代码
> 4. babel-loader将ES5语法代码返回

```js
let babelCore = require('@babel/core')
let presetEnv = require('@babel/preset-env')
function loader(source) {
    return babelCore.transfrom(source, {
        presets: [
            presetEnv
        ]
    })
}
module.exports = loader
```

> 最佳实践？
> 
> babel-runtime打出来的包会比较大，所以适合在组件和类库项目中使用，而babel-polyfill适合在业务项目中使用，打包出来的文件比较小
> 
> 比如说Array上面新增加一个方法a：
> 
> babel-polyfill是在原来的Array.prototype上面增加一个属性a
> 
> babel-runtime则是重新构建出来一个Array里面包含a


## 五、eslint

npm install eslint eslint-loader  babel-eslint -D

eslint要在代码编译前进行检查修复，可以使用规范airbnb

```js
{
    test: /\.jsx?$/,
    use: 'eslint-loader',
    enforce: 'pre', // 强制指定顺序
    options: { fix: true }, // 自动修复
    include: require(__dirname, 'src'),
},
{
    test: /\.jsx?$/,
    use: [{}]
}
```

## 六、sourcemap：devtool配置项

sourcemap是为了解决开发代码与实际运行的代码不一致时帮助我们debug到原始代码的技术
webpack通过配置devtool来自动给我们生成sourcemap文件，.map是一种对应源文件和编译文件的方法

+ source-map： 原始代码，有最好的sourcemap质量，但是代码体积大会很慢
+ eval-source-map：原始代码，拥有最高的质量和最低的性能
+ cheap-module-eval-souce-map： 转换代码
+ cheap-eval-source-map： 转换代码
+ eval:生成代码，每个模块都会被eval执行，并且存在@sourceURL，带eval的构建模式能cache sourcemap（即能被缓存）
+ cheap-source-map： 转换代码，（行内）生成的sourcemap，不包括列，从loader生成的sourcemap没有被使用
+ cheap-module-source-map： 原始代码，（只有行内）生成的sourcemap，不包括列，每行都从loader生成的sourcemap进行映射

上面描述的配置项是以下几个选项的任意组合

+ eval： 用eval进行包裹代码
+ source-map：产生.map文件
+ cheap：不包含列的信息，也不包含loader的sourcemap
+ module：不包含列的信息，但是包含loader的sourcemap
+ inline：将.map作为DataUrl内嵌，不单独生成.map文件

组合规范：

（inline/eval/hidden）-（nosource）-（cheap）-（module）-source-map

代码调试：npm i source-map-dev-tool-plugin file-manage-plugin

> 最佳实践？
> 
> 在开发环境：我们的诉求时快（eval），信息全（module）并且此时代码没有被压缩，我们并不需要知道每一列的信息（cheap），所以比较推荐`cheap-module-eval-source-map`，要想速度快 -> eval-cheap-source-map，调试的更友好 -> cheap-module-source-map，折中的方式就是eval-source-map
> 
> 在生产环境：我们并不希望别人可以看见我们的源代码（未编译过的代码），所以我们不应该提供sourcemap给浏览器，但是我们有需要sourcemap来定位我们的错误，所以这个时候我们设置成为`devtool: hidden-source-map`
> 一方面生成sourcemap文件以提供给错误收集工具比如说sentry，另一个方面又不会为bundle添加引用注释，以避免浏览器尽心使用

## 七、打包第三方类库

1. 直接引入 `improt _ from 'lodash'`，痛点：引入麻烦
2. 插件引入 ，优点：不需要手动引入 缺点： 不能全局使用（即在index.html使用），webpack把它打包到js上下文上面去了
   ```js
    const webpack = require('webpack')
    { 
        plugins: [ 
            new webpack.ProvidePlugin({
                _: lodash,
            })
        ]
    }
   ```
3. expose-loader：在全局引入

   ```js
    loaders: [
        {
            test: require.resolve('lodash'),
            loader: 'expose-loader',
            options: {
                exposes: {
                    globalName: '_',
                    override: true,
                }
            }
        },
    ]
   ```
4. cdn外链引入的方式，在index.html当中手动插入，并且配置webpack的externals选项，缺点： 需要手动引入cdn的包的地址，不管代码里面用不用，都会引入
5. 安装插件 npm i html-webpack-externals-plugin（外链插件）优点：代码需要require时第三方外链就引入，不需要就不引入，webpack5当中已经废除了dll，现阶段使用html-webpack-externals-plugin
   ```js
        const htmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

        plugins: [
            new htmlWebpackExternalsPlugin({
                externals: [
                    {
                       module: 'lodash',
                       entry: 'http://cdn....',
                       global: '_'
                    }
                ]
            })
        ]
   ```

## 八、设置环境变量和全局变量

### mode的参数决定模块内的process.env.MODE_ENV,此处的process是浏览器模拟出来的，不知真正意义上的进程process

+ development：开启debug工具、运行时打印详细的错误信息、更加快速的增量编译构建，
+ production：各种优化性能工具，包括构建结果优化、webpack运行性能优化

开发环境：
1. 需要生成sourcemap文件
2. 需要打印debug信息
3. 需要live reload或者hot reload

生产环境
1. 分离css文件
2. 压缩代码
3. 压缩图片

### 区分环境的配置

1. --mode：用来生成`模块内部`的process.env.NODE_ENV, 在webpack的配置文件中读取不到（即打包过程），但是在浏览器内部可以读取的变量（即运行中）

2. 使用webpack内置的参数设置变量(`node环境)`，`webpack --env=product`，此时给webpack文件中导出的函数参数了，但是在浏览器内部`不可以`读取的变量（即运行中）,也不影响mode参数
   ```js
    // package.json

    "scripts": {
       "test": "echo \"Error: no test specified\" && exit 1",
       "dev": "webpack serve --config config/webpack.config.dev.js --env=product"
    },
    // config/webpack.config.dev.js
    module.exports = (env) => {
      console.log(env) // { product: true }
      return {
        mode: '',
        devtool: ''
      }
    }
   ```
3. 使用跨环境设置变量 cross-env插件，`npm i cross-env`，给webpack配置文件`node环境`当中传递参数，不影响mode，也不影响env
   ```js
   // config/webpack.config.dev.js
   const env = process.env.NODE_ENV
   console.log(env) // 'production'
   ```

4. 设置`模块内部`全局变量使用插件 `new webpack.DefinePlugin({ Version: JSON.stringify('1.0.0.1') })`，webpack在代码运行时读取的浏览器变量，在编译的过程中就已经替换成相对应的值了

> 定义的全局变量在尽享转换的过程中会进行表达式计算，所以new webpack.DefinePlugin({ num: '1+2' }) 得到的全局变量是 num = 3
> 
> 在其他地方进行引入全局变量的时候包一层eval函数进行执行，所以即使定义的全局变量返回的是字符串"true"，那经过eval函数执行就变形boolean类型的true了

## 九、watch - 热更新

1. 通过命令行进行穿参数 --watch
2. 通过在配置文件当中

```js
module.exports = {
    watch: true,
    watchOptions: {
        ignored: /node_modules/, // 不监听那些文件夹
        eggregateTimeout: 300, // 延迟毫秒数
        poll: 1000, // 1s轮询文件系统1000次，数字越大越精细，数字越小越延迟
    }
}
```

## 十、copy-webpack-plugin -- copy文件

```js
const copyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
    plugins: [
       new copyWebpackPlugin({
           pattens: {
               from: path.resolve(__dirname, 'src/document'),
               to: path.resolve(__dirname, 'dist/document'),
           }
       })
    ]
}
```

## clean-webpack-plugin - 清空文件夹

npm i  clean-webpack-plugin -D
```js
const { cleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
    plugins: [
       new cleanWebpackPlugin({
           cleanOnceBeforeBuildPatterns: ["**/*"] // glob匹配模式， *可以匹配任意字符，但不包括路径分隔符，**可以匹配任意字符，包括路径分隔符
       })
    ]
}
```

## 跨域代理 - proxy

```js
const { cleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.8.903:18080',
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
}