# 如何让你的模块支持热替换（HMR）机制？

webpack-dev-server的自动更新页面还是会导致页面状态丢失问题，更好的办法自然是能够实现在页面不刷新的情况下，代码也可以及时的更新到浏览器的页面中，重新执行，避免页面状态丢失

模块热更新（HMR）是我们可以在应用运行过程中，实时的去替换应用的某一个模块，而应用的运行状态不会因此而发生改变。

HMR 已经集成在了 webpack 模块中了，在运行 webpack-dev-server 命令时，通过 --hot 参数去开启这个特性。

也可以通过配置来进行配置

+ 首先需要将 devServer 对象中的 hot 属性设置为 true；
+ 然后需要载入一个插件，这个插件是 webpack 内置的一个插件，所以我们先导入 webpack 模块，有了这个模块过后，这里使用的是一个叫作 HotModuleReplacementPlugin 的插件。

```js
const webpack = require('webpack')
module.exports = {
  // ...
  devServer: {
    // 开启 HMR 特性，如果资源不支持 HMR 会 fallback 到 live reloading
    hot: true
    // 只使用 HMR，不会 fallback 到 live reloading
    // hotOnly: true
  },
  plugins: [
    // ...
    // HMR 特性所需要的插件
    new webpack.HotModuleReplacementPlugin()
  ]
}
```
**面试题：hot & hotOnly的区别**

> hot 方式，如果热替换失败就会自动回退使用自动刷新
> hotOnly 的情况下如果热替换失败并不会使用自动刷新

配置完成过后，样式文件的修改生效了，但是对于js脚本文件内容的修改并没有任何作用

**面试题：为什么样式文件的修改实现了局部刷新**

> 是因为样式文件都是经过Loader处理的，在style-loader中就已经自动处理过了样式文件，所以不需要我们额外在进行手动处理

**面试题： 为什么js脚本文件修改不能实现局部刷新**

> 我们编写的js脚本文件是没有任何规律的，webpack面对这些毫无规律的js模块，根本不知道该怎么处理更新后的模块，也就无法实现一个可以通用所有情况的模块替换方法

**面试题：为什么vue-cli 或者 create-react-app 这种框架脚手架工具JavaScript 代码照样可以热替换**

> 这是因为你使用的是框架，使用框架开发时，我们项目中的每个文件就有了规律，例如 React 中要求每个模块导出的必须是一个函数或者类，那这样就可以有通用的替换办法，所以这些工具内部都已经帮你实现了通用的替换操作，自然就不需要手动处理了

**面试题：那怎么通过webpack手动处理这些js脚本文件？**

> 需要自己手动通过代码来处理，当 JavaScript 模块更新过后，该如何将更新后的模块替换到页面中

## HMR APIs

通过 module.hot.accept 实现JavaScript 模块热替换

```js
// ./main.js

import createEditor from './editor'

const editor = createEditor()

document.body.appendChild(editor)

// ... 原本的业务代码

// HMR --------------------------------

let lastEditor = editor

module.hot.accept('./editor', () => {

  // 当 editor.js 更新，自动执行此函数

  // 临时记录更新前编辑器内容

  const value = lastEditor.innerHTML

  // 移除更新前的元素

  document.body.removeChild(lastEditor)

  // 创建新的编辑器

  // 此时 createEditor 已经是更新过后的函数了

  lastEditor = createEditor()

  // 还原编辑器内容

  lastEditor.innerHTML = value

  // 追加到页面

  document.body.appendChild(lastEditor)

})

```

**面试题：使用 Webpack 的 HMR 特性遇到的问题？**

> 1. 配置 hot：true 的情况下如果处理热替换的代码（处理函数）中有错误，不易发现；解决办法使用 hotOnly：true
> 2. 对于使用了 HMR API 的代码，如果我们在没有开启 HMR 功能的情况下运行 Webpack 打包，此时运行环境中就会报出 Cannot read property 'accept' of undefined 的错误；原因是 module.hot 是 HMR 插件提供的成员，没有开启这个插件，自然也就没有这个对象；解决办法也很简单，与我们在业务代码中判断 API 兼容一样，我们先判断是否存在这个对象，然后再去使用就可以了

**面试题：HMR我们在代码中写了很多与业务功能本身无关的代码，会不会对生产环境有影响？**

> 当我们将热替换特性关闭，并且移除掉了 HotModuleReplacementPlugin 插件，在看打包之后的代码，之前我们编写的处理热替换的代码都被移除掉了，只剩下一个 if (false) 的空判断，这种没有意义的判断，在压缩过后也会自动去掉，所以根本不会对生产环境有任何影响