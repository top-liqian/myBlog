# 玩转 Webpack 中的 TreeShaking 与 sideEffects 特性

Webpack 的 Tree-shaking 特性在生产模式下会自动开启，Tree-shaking 并不是指 Webpack 中的某一个配置选项，而是一组功能搭配使用过后实现的效果，这组功能在生产模式下都会自动启用，所以使用生产模式打包就会有 Tree-shaking 的效果。

## 开启 Tree Shaking

`Webpack` 的配置文件使用`optimization`配置项，这个属性用来集中配置` Webpack` 内置`优化`功能，它的值也是一个`对象`

1. usedExports - 输出结果中只导出外部使用了的成员

```js
module.exports = {
  // ... 其他配置项
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true
  }
}
```

2. minimize - 压缩代码

```js
module.exports = {
  // ... 其他配置项
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    // 压缩输出结果
    minimize: true
  }
}
}
```

3. concatenateModules又称Scope Hoisting（作用域提升） - 尽可能合并每一个模块到一个函数中

普通打包只是将一个模块最终放入一个单独的函数中，如果我们的模块很多，就意味着在输出结果中会有很多的模块函数。

concatenateModules配置的作用就是尽可能将所有模块合并到一起输出到一个函数中，这样既提升了运行效率，又减少了代码的体积。

```js
module.exports = {
  // ... 其他配置项
  optimization: {
    // 模块只导出被使用的成员
    usedExports: true,
    // 尽可能合并每一个模块到一个函数中
    concatenateModules: true,
    // 压缩输出结果
    minimize: true
  }
}
```

## babel-loader导致的tree-shaking 失败

早期的`webpack`由于配置了`babel-loader`会导致webpack的`tree-shaking` 失败的主要原因是：

`tree-shaking`是基于`ES Modules`的方式来组织的模块化，但是`babel-loader`的早期版本会在`loader`处理时候将`ES Modules`转换成`CommonJS` 的方式所以会导致`tree-shaking`失效

但是在最新版本的`babel-loader（8.x）`里面就没有出现这样的问题，是因为：

`babel-loader `模块的源码，我们发现它已经在 `injectCaller` 函数中标识了当前环境支持 `ES Modules`。所使用的 `@babal/preset-env` 模块源码，在这个模块中，根据环境标识自动禁用了对 `ES Modules` 的转换插件，所以经过 `babel-loader` 处理后的代码默认仍然是 `ES Modules`，那 `Webpack` 最终打包得到的还是 `ES Modules` 代码，`Tree-shaking` 自然也就可以正常工作了

```js
// ./webpack.config.js
module.exports = {
  mode: 'none',
  entry: './src/main.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
                [
                    '@babel/preset-env', 
                    // { modules: 'commonjs' }
                    { modules: false }
                ]
            ]
          }
        }
      }
    ]
  },
  optimization: {
    usedExports: true
  }
}
```

## sideEffect根据配置标识代码是否具有副作用，从而提供更大的压缩空间

`Webpack 4` 中新增了一个 `sideEffects` 特性，它允许我们通过配置标识我们的代码是否有`副作用`，从而提供更大的`压缩空间`。

> 模块的副作用指的就是模块执行的时候除了导出成员，是否还做了其他的事情

`sideEffects` 特性跟 `Tree-shaking` 没什么关系

一些导出的模块成员并没有被使用的情况下，通过开启`usedExports`是可以在最后的打包出来的代码中不被导出，但是一旦组件导出成员存在`副作用代码`开启`usedExports`就导致最终 `Tree-shaking` 过后，这些模块并不会被完全移除。

所以`Tree-shaking` 只能移除没有用到的代码成员，而想要完整移除没有用到的模块，那就需要开启 `sideEffects` 特性了

```js
// ./webpack.config.js
module.exports = {
    optimization: {
       usedExports: true,
       sideEffects: true,
    }
}

// package.json
{
   "sideEffects": false
}
```

如果一些模块的副作用代码是需要进行保留的，例如

在 JS 中直接载入的 CSS 模块属于副作用模块

基于原型的扩展方式 es6-promise，这种模块都属于典型的副作用模块

需要在package.json当中配置sideEffects即可

```js
// package.json
{
   "sideEffects": [
       "./src/extend.js",
       "*.css"
    ]
}
```

# 生产环境下 Webpack 构建结果该如何优化？

## Code Splitting分块打包

`All in One` 的方式并不合理，更为合理的方案是把打包的结果按照一定的规则分离到多个 `bundle` 中，然后根据应用的运行需要`按需加载`。这样就可以降低`启动成本`，提高响应速度。

`Web` 应用中的资源受环境所限，太大不行，太碎更不行。因为我们开发过程中划分模块的颗粒度一般都会非常的细，很多时候一个模块只是提供了一个小工具函数，并不能形成一个完整的功能单元。

如果我们不将这些资源模块打包，直接按照开发过程中划分的模块颗粒度进行加载，那么运行一个小小的功能，就需要加载非常多的资源模块。

`Code Splitting` 通过把项目中的资源模块按照我们设计的规则打包到不同的 `bundle` 中，从而降低应用的启动成本，提高响应速度。

`Webpack` 实现分包的方式主要有两种：

+ 根据业务不同配置`多个打包入口`，输出多个打包结果；
+ 结合 `ES Modules` 的动态导入`（Dynamic Imports）`特性，按需加载模块。

### 1、多入口打包

多入口打包一般适用于传统的多页应用程序，最常见的划分规则就是一个页面对应一个打包入口，对于不同页面间公用的部分，再提取到公共的结果中。

1. 配置多entry
2. 配置输出目录name占位
3. HtmlWebpackPlugin配置多个，并且通过chunks指定使用具体某个bundle
4. 提取公共模块optimization: { splitChunks: { chunks: 'all' }}

```js
// ./webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: {
    index: './src/index.js',
    album: './src/album.js'
  },
  output: {
    filename: '[name].bundle.js' // [name] 是入口名称
  },
  // ... 其他配置
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/index.html',
      filename: 'index.html',
      chunks: ['index'] // 指定使用 index.bundle.js
    }),
    new HtmlWebpackPlugin({
      title: 'Multi Entry',
      template: './src/album.html',
      filename: 'album.html',
      chunks: ['album'] // 指定使用 album.bundle.js
    })
  ],
  optimization: {
    splitChunks: {
      // 自动提取所有公共模块到单独 bundle
      chunks: 'all'
    }
  }
}
```

### 2、动态导入

Code Splitting 更常见的实现方式还是结合 ES Modules 的动态导入特性，从而实现按需加载。

按需加载，指的是在应用运行过程中，需要某个资源模块时，才去加载这个模块。这种方式极大地降低了应用启动时需要加载的资源体积，提高了应用的响应速度，同时也节省了带宽和流量。

Webpack 中支持使用`动态导入`的方式实现模块的`按需加载`，而且所有动态导入的模块都会被自动提取到单独的 `bundle` 中，从而实现分包。

我们可以通过代码中的逻辑去控制需不需要加载某个模块，或者什么时候加载某个模块。而且我们分包的目的中，很重要的一点就是让模块实现按需加载，从而提高应用的响应速度。

`import` 关键字作为函数调用。当以这种方式使用时，`import` 函数返回一个` Promise `对象。这就是 `ES Modules` 标准中的 `Dynamic Imports`。

```js
import('./album/album').then(({ default: album }) => {
   mainElement.appendChild(album())
})
```

整个过程我们无需额外配置任何地方，只需要按照 ES Modules 动态导入的方式去导入模块就可以了，Webpack 内部会自动处理分包和按需加载

使用的是 Vue.js 之类的 SPA 开发框架的话，那你项目中路由映射的组件就可以通过这种动态导入的方式实现按需加载，从而实现分包

### 3、魔法注释，给按需加载的模块起名字

```js
import(/* webpackChunkName: 'album' */'./album/album').then(({ default: album }) => {
   mainElement.appendChild(album())
})
```

魔法注释还有个特殊用途：如果你的 chunkName 相同的话，那相同的 chunkName 最终就会被打包到一起，例如我们这里可以把这两个 chunkName 都设置为 components，然后再次运行打包，那此时这两个模块都会被打包到一个文件中
