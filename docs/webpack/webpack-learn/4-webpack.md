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





