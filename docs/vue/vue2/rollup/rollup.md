# 一、使用rollup搭建开发环境

1. 什么是rollup

rollup是一个javaScript模块打包器，可以将小块代码编译成大块复杂的代码，rollup.js更专注于javaScript类库的打包（开发应用时候使用webpack，开发类库的时候使用rollup），打包出来的代码很简单，体积比较小

2. 

rollup(打包工具) @babel/core（用babel的核心模块） @babel/preset-env（babel的高级语法转换成低级语法） rollup-plugin-babel（rollup和babel关联的桥梁） rollup-plugin-serve（在本地起一个静态服务） cross-env（设置环境变量）