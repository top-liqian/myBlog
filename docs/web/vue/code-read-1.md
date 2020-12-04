### vue入门篇

#### vue之目录结构

![](http://localhost:3000/public/vue-1.png)

#### 目录 --- compiler

```
 ├── compiler    # 模板解析相关    
   ├── codegen       # 代码生成，把 AST（抽象语法树）转换为 render 函数    
   ├── directives    # 转换为 render 函数前要执行的指令    ├── parser        # 把模板解析为 AST
```

```compiler```主要是存放```vue.js```项目的所有编译相关的代码，将模版编译为render函数

在```Vue```中使用```render```函数来进行构建```VNode```，但是往往在开发过程中是使用```template```进行书写的```HTML```，所以需要将```template```编译成为```render```函数

#### 目录 --- core

![](http://localhost:3000/public/vue-2.png)

```
 ├── core    # 核心代码相关    
   ├── components    # 全局通用组件 keep-alive
   ├── global-api    # 全局的api，即vue对象上面的extend， mixin，use等
   ├── instance      # vue实例化的相关代码，如初始化，事件，渲染，生命周期等
   ├── observer      # 响应式数据修改代码
   ├── util          # 工具函数
   ├── vdom          # 虚拟dom相关代码
```

```core```下面主要实现了```vue```的核心代码，主要包括内置组件，全局的api，组件实例化，响应式修改数据，工具函数以及虚拟dom实现等

#### 目录 --- platforms

```
├── platforms   # 平台相关代码    
  ├── web           # web 平台        
    ├── compiler        # 编译时相关        
    ├── runtime         # 运行时相关        
    ├── server          # 服务端渲染相关        
    ├── util            # 工具函数    
  ├── weex          # 配合 weex 运行在 native 平台
```
```vue```作为跨平台的框架，即可以运行在```web```端，也可以配合```weex```运行在移动端

```platforms```是```vue```的入口，目录下的两个文件就是代表了两种平台的入口打包文件

#### 目录 --- server

服务器端渲染对应的代码，这也就意味这着这是运行在服务器端node代码，而不是运行在浏览器端的代码

#### 目录 --- sfc

```sfc```只有一个文件就是```parse.js```，就是一个解析器，将```.vue```文件解析成```js对象```

#### 目录 --- shared

shared主要定义了常量和工具函数，供其他部分使用


#### vue之打包构建工具```Rollup```

```vuejs```源码采用```Rollup```进行打包，webpack和Rollup都是打包构建工具

```webpack```的打包范围更全面，可以将```js， css，图片```等文件打包成一个个的```boudle```块并按需加载，由于功能的强大性导致打包出来的文件也是```体积```比较大，比较适合```应用```打包构建

Rollup只处理```js```文件并不对其他静态资源进行处理，打包出来的文件体积较小，因此 ```Rollup``` 更适用于像类库这种只有 js 代码的项目构建。所以大部分类库例如``` Vue，React，Angular ```等都采用 ```Rollup ```来打包。

#### vue之构建脚本```package.json```

通常基于npm托管的项目都会有一个package.js的文件，它是对项目的描述文件，是一个标准的json文件

下面介绍一个```package.json```当中重要的字段

#### main/moudle

```json
  {
    "main": "dist/vue.runtime.common.js",
    "module": "dist/vue.runtime.esm.js"
  }
```
此处构建出来的是```vue runtime```版本，都放在```dist```目录下，一个是```CommonJS```模块，一个是```ES Module```模块

#### script

script字段定义了npm的执行脚本，其中将```src``` 下的源码构建出各种版本的 ```Vue``` 后存放在 ```dist``` 目录的相关脚本是下面这三条

```js
{  
    "build": "node scripts/build.js",  
    "build:ssr": "npm run build -- web-runtime-cjs,web-server-renderer",  
    "build:weex": "npm run build -- weex",
}
```

可以看到，后面两条命令都是基于第一条加上不同的参数。简单来讲：

+ build 构建 web 平台相关
  
+ build:ssr 构建服务端渲染相关
  
+ build:weex 构建的是 weex 平台相关

这三条命令都是运行 ```scripts``` 目录下的 ```build.js``` 文件。接下来一起来看下 ```build.js``` 文件里的内容。

#### vue之构建过程

build.js 文件代码基本结构如下：

```js
// scripts/build.js
// 引入所需模块
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const rollup = require('rollup')
const terser = require('terser')
// 检查是否存在dist目录，不存在则创建dist目录
if (!fs.existsSync('dist')) {  
    fs.mkdirSync('dist')}
    [1]
    let builds = require('./config').getAllBuilds()
    [2]
    // filter builds via command line arg
    if (process.argv[2]) {  
        const filters = process.argv[2].split(',')  
        builds = builds.filter(b => {    
            return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)  })
     } else {  
        // filter out weex builds by default  
        builds = builds.filter(b => {    
            return b.output.file.indexOf('weex') === -1  
        })
    }
    build(builds)
    // build函数声明
    function build (builds) {  }
```
上述代码 标号 ```[1]``` 处引入并调用了 ```config.js``` 文件中的 ```getAllBuilds``` 函数，先来看看这个函数在 ```config.js``` 是如何定义的：

```js
if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET)
} else {
  exports.getBuild = genConfig
  // 这里 getAllBuilds 函数的处理是取出 builds 对象的所有属性组成的数组在 genConfig 函数处理后返回。
  // 了解完 builds 对象后，我们知道在 getAllBuilds 函数中 builds 对象每个属性都执行了 genConfig 函数，来看看 genConfig 函数是怎么处理的：
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig)
}
```
这里 ```getAllBuilds``` 函数的处理是取出``` builds ```对象的所有属性组成的数组在 ```genConfig``` 函数处理后返回。```builds``` 对象的定义如下所示：

```js
const builds = {
  // Runtime only (CommonJS). Used by bundlers e.g. Webpack & Browserify
  'web-runtime-cjs-dev': {
    entry: resolve('web/entry-runtime.js'), // 入口文件 =》 都使用了resolve函数，转移到当前页面的resolve函数
    dest: resolve('dist/vue.runtime.common.dev.js'), // 目标文件：打包好之后的文件
    format: 'cjs', // 构建出来的 Vue 的各种格式（如 CommonJS，ESModule 等）
    env: 'development', // 环境
    banner
  },
}
```

我们可以看到这部分都是根据不同环境以及平台构建出来的不同的```Vue```的各种形式配置（可以看到， builds 对象中是一个个结构相似的对象，从这些对象的名称和属性可以判断出，这些对象对应编译不同 ```Vue``` 版本的配置。）

配置对象里面的 ```format``` 表示构建出来的 ```Vue``` 的各种格式（如 ```CommonJS，ESModule``` 等）。 ```entry``` 代表入口文件，```dest``` 代表目标文件。这两个属性都是调用 ```resolve``` 这个方法并传入一个路径参数。```resolve``` 函数是这样定义的：

```js

const aliases = require('./alias')
// resolve函数应用在builds对象定义里面引入路径，
// 这里 resolve 函数又引用了 aliases。aliases 存放在 alias.js中，来看看 aliases 怎么定义的：跳转到aliases文件
const resolve = p => {
  const base = p.split('/')[0]
  if (aliases[base]) {
    return path.resolve(aliases[base], p.slice(base.length + 1))
  } else {
    return path.resolve(__dirname, '../', p)
  }
}

```
这里 resolve 函数又引用了 aliases。aliases 存放在 alias.js中，来看看 aliases 怎么定义的：跳转到```aliases文件```

```js
// 1. 按需引用
const path = require('path')

// 2. 真实路径与别名之间的一种映射
// 3. path.resolve(__dirname, '../', p) __dirname代表着当前路径，后面的两个字段从后向前拼装成的路径../${p}是指相对于=当前路径的上一层路径的p
const resolve = p => path.resolve(__dirname, '../', p)
// 重新定义路径
module.exports = {
  vue: resolve('src/platforms/web/entry-runtime-with-compiler'),
  compiler: resolve('src/compiler'),
  core: resolve('src/core'),
  shared: resolve('src/shared'),
  web: resolve('src/platforms/web'),
  weex: resolve('src/platforms/weex'),
  server: resolve('src/server'),
  sfc: resolve('src/sfc')
}

```

其实```aliases文件```只要是别名与真实路径的对应的映射

举个例子，比如 ```builds``` 对象中的 ```web-full-dev```，它的 ```entry``` 值为 ```web/entry-runtime-with-compiler.js```。调用 ```resolve``` 后会先提取出 ```web``` 这个别名，到 ```alias``` 对象去找，而``` web ```别名对应的真实路径是 ```../src/platforms/web``` ，与文件名 ```entry-runtime-with-compiler.js``` 拼接后得到了文件的完整真实路径 ```../src/platforms/web/entry-runtime-with-compiler.js```。
由于 ```web-full-de ```的 ```dest ```的别名部分 ```dist``` 并没有出现在 ```alias``` 对象中，所以会走 ```resolve``` 的 ```else``` 逻辑，直接返回路径 ```../dist/vue.js```。

了解完 ```builds``` 对象后，我们知道在 ```getAllBuilds``` 函数中 ```builds``` 对象每个属性都执行了 ```genConfig``` 函数，来看看 ```genConfig``` 函数是怎么处理的：

```js
// genConfig函数， 这个函数的功能是把 builds 里面的配置对象转换为一个 Rollup对应需要的配置对象。
function genConfig (name) {
  const opts = builds[name]
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [
      flow(),
      alias(Object.assign({}, aliases, opts.alias))
    ].concat(opts.plugins || []),
    output: {
      file: opts.dest,
      format: opts.format,
      banner: opts.banner,
      name: opts.moduleName || 'Vue'
    },
    onwarn: (msg, warn) => {
      if (!/Circular/.test(msg)) {
        warn(msg)
      }
    }
  }

  // built-in vars
  const vars = {
    __WEEX__: !!opts.weex,
    __WEEX_VERSION__: weexVersion,
    __VERSION__: version
  }
  // feature flags
  Object.keys(featureFlags).forEach(key => {
    vars[`process.env.${key}`] = featureFlags[key]
  })
  // build-specific env
  if (opts.env) {
    vars['process.env.NODE_ENV'] = JSON.stringify(opts.env)
  }
  config.plugins.push(replace(vars))

  if (opts.transpile !== false) {
    config.plugins.push(buble())
  }

  Object.defineProperty(config, '_name', {
    enumerable: false,
    value: name
  })

  return config
}
```

这个函数的功能是把 ```builds``` 里面的配置对象转换为一个 ```Rollup```对应需要的配置对象。

以上就是 ```build.js``` 中 标号```[1]```处代码的执行流程。

然后来到 标号 ```[2]``` 处，代码如下：

```js
// 4. 所以这里通过判断是否有额外命令行参数来判断命令是哪条，并对 builds 数组做对应的过滤处理，把不需要的 Rollup 配置项过滤掉。
// 比如说如果命令是 npm run build 说明是构建 web 版本，对应代码的 else 逻辑，就是把与 web 不相关的 weex 过滤掉。
// filter builds via command line arg
if (process.argv[2]) {
  const filters = process.argv[2].split(',')
  builds = builds.filter(b => {
    return filters.some(f => b.output.file.indexOf(f) > -1 || b._name.indexOf(f) > -1)
  })
} else {
  // filter out weex builds by default
  builds = builds.filter(b => {
    return b.output.file.indexOf('weex') === -1
  })
}
```
所以这里通过判断是否有额外命令行参数来判断命令是哪条，并对 builds 数组做对应的过滤处理，把不需要的 Rollup 配置项过滤掉。

比如说如果命令是 ```npm run build ```说明是构建``` web``` 版本，对应代码的 ```else ```逻辑，就是把与``` web``` 不相关的``` weex``` 过滤掉。

```builds``` 数组处理完后就调用 ```build ```函数进行构建，来看看 ```build``` 函数的代码：

```js
build(builds)

// 6. build函数
// build 函数其实就是让 builds 数组每一项都执行 buildEntry 这个函数
function build (builds) {
  let built = 0
  const total = builds.length
  const next = () => {
    buildEntry(builds[built]).then(() => {
      built++
      if (built < total) {
        next()
      }
    }).catch(logError)
  }

  next()
}

```

```build``` 函数其实就是让 ```builds ```数组每一项都执行 ```buildEntry``` 这个函数

```js
// buildEntry函数
// 这里 buildEntry 函数调用了 rollup.rollup 进行编译，最终得到一个结果 output，
// 然后判断这个 output 是否是生产版本来决定是否压缩，然后调用 write 函数。

function buildEntry (config) {
  const output = config.output
  const { file, banner } = output
  const isProd = /(min|prod)\.js$/.test(file) // 判断是否是生产环境
  return rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then(({ output: [{ code }] }) => {
      if (isProd) {
        const minified = (banner ? banner + '\n' : '') + terser.minify(code, {
          toplevel: true,
          output: {
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        }).code
        return write(file, minified, true)
      } else {
        return write(file, code)
      }
    })
}
```

这里 ```buildEntry``` 函数调用了 ```rollup.rollup``` 进行编译，最终得到一个结果``` output```，然后判断这个 ```output ```是否是生产版本来决定是否压缩，然后调用``` write ```函数。```write ```函数代码如下：

```js
// write函数
// write 函数的作用就是调用 fs.writeFile 生成对应的 js 文件放在 dist 目录下。
function write (dest, code, zip) {
  return new Promise((resolve, reject) => {
    function report (extra) {
      console.log(blue(path.relative(process.cwd(), dest)) + ' ' + getSize(code) + (extra || ''))
      resolve()
    }

    fs.writeFile(dest, code, err => {
      if (err) return reject(err)
      if (zip) {
        zlib.gzip(code, (err, zipped) => {
          if (err) return reject(err)
          report(' (gzipped: ' + getSize(zipped) + ')')
        })
      } else {
        report()
      }
    })
  })
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

```

```write``` 函数的作用就是调用 ```fs.writeFile``` 生成对应的``` js``` 文件放在``` dist ```目录下。

以上就是通过 ```rollup``` 编译 ```Vue``` 的基本过程。
