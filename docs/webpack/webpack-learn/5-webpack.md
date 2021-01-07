# webpack & roolup.js & Parcel技术选型

##  roolup.js

Rollup 是一款 ES Modules 打包器。它也可以将项目中散落的细小模块打包为整块代码，从而使得这些划分的模块可以更好地运行在浏览器环境或者 Node.js 环境。

它的初衷只是希望能够提供一个高效的 ES Modules 打包器，充分利用 ES Modules 的各项特性，构建出结构扁平，性能出众的类库。

特性：

1. Rollup 打包结果惊人的简洁，基本上就跟我们手写的代码一样
2. Rollup 默认会自动开启 Tree-shaking 优化输出结果
3. Rollup 会额外处理配置文件，所以在 rollup.config.js 中我们可以直接使用 ES Modules 标准
4. Rollup 的唯一的扩展方式就是插件去处理一些额外的资源类型
5. Rollup 默认只能够按照文件路径的方式加载本地的模块文件，对于 node_modules 目录中的第三方模块，并不能像 Webpack 一样，直接通过模块名称直接导入；Rollup 给出了一个 @rollup/plugin-node-resolve 插件就可以在代码中直接使用模块名称导入模块了
6. 使用@rollup/plugin-commonjs加载CommonJS 模块
7. Rollup 的最新版本中已经开始支持代码拆分了（Code Splitting）

优势：

1. 输出结果更加扁平，执行效率更高；
2. 自动移除未引用代码；
3. 打包结果依然完全可读。

缺点也同样明显：

1. 加载非 ESM 的第三方模块比较复杂；
2. 因为模块最终都被打包到全局中，所以无法实现 HMR；
3. 浏览器环境中，代码拆分功能必须使用 Require.js 这样的 AMD 库。


Rollup.js适用的场景：开发一个 JavaScript 框架或者库
webpack适用的场景：开发的是一个应用程序，需要大量引用第三方模块，同时还需要 HMR 提升开发体验，而且应用过大就必须要分包

## Parcel

Parcel 是一款完全零配置的前端打包器，它提供了 “傻瓜式” 的使用体验，我们只需了解它提供的几个简单的命令，就可以直接使用它去构建我们的前端应用程序了。

特性：

1. 打包应用的同时开启一个服务器
2. 支持自动刷新这样的功能
3. 提供模块热替换
4. 自动安装依赖
5. Parcel 同样支持加载其他类型的资源模块，而且相比于其他的打包器，在 Parcel 中加载其他类型的资源模块同样是零配置的
6. Parcel 同样支持直接使用动态导入，内部也会自动处理代码拆分
7. 生产模式打包使用的是多进程同时工作，充分发挥了多核 CPU 的性能，构建速度极快

优点：

1. 真正做到了完全零配置，对项目没有任何的侵入；
2. 自动安装依赖，开发过程更专注；
3. 构建速度更快，因为内部使用了多进程同时工作，能够充分发挥多核 CPU 的效率。