# 如何使用 Webpack Dev Server 提高本地开发效率？

webpack-dev-server 提供了一个开发服务器，并且将自动编译和自动刷新浏览器等一系列对开发友好的功能全部集成在了一起

运行 webpack-dev-server 这个命令时，它内部会启动一个 HTTP Server，为打包的结果提供静态文件服务，并且自动使用 Webpack 打包我们的应用，然后监听源代码的变化，一旦文件发生变化，它会立即重新打包

webpack-dev-server为了提高工作效率。它并没有将打包结果写入磁盘中，而是暂时存放在了内存当中，内部的HTTP Server也是从内存读取这些文件的，这样一来，就会减少很多不必要的磁盘读写操作，大大提高了整体的构建效率

## 一、webpack-dev-server 的常用功能

1. 静态资源访问 - contentBase

webpack-dev-server 默认会将构建结果和输出文件全部作为开发服务器的资源文件，也就是说，只要通过webpack打包就能够输出的文件都可以直接被访问到，但是有一些没有被打包的静态资源文件也需要做为开发服务器的资源被访问，那就需要配置webpack-dev-server

```js
module.exports = {
  devServer: {
    contentBase: 'public'
  }
}
```

区别于`copy-webpack-plugin`，开发阶段打包构建会很频繁不需要将copy的文件每一次都执行这个插件，打包开销会比较大，构建的速度也会降低，所以通常在开发阶段配置`webpack-dev-serve`r的`contentBase`即可

2. proxy代理解决跨域请求的问题
   
```js
module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://api.github.com'
      }
    }
  }
}
``` 

## 二、Webpack 中 SourceMap 配置的最佳实践

source map：映射转换后的代码与代码之间的关系。一段转换后的代码，通过转换过程中生成的source map文件就可以逆向解析得到对应的源代码