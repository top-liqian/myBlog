# npm/yarn install 原理

主要分为两个部分, 首先，执行 `npm/yarn install`之后，包如何到达项目 `node_modules` 当中。其次，`node_modules` 内部如何`管理依赖`。

执行命令后，首先会构建依赖树，然后针对每个节点下的包，会经历下面四个步骤:

- 1. 将依赖包的版本区间解析为某个具体的版本号
- 2. 下载对应版本依赖的 tar 包到本地离线镜像
- 3. 将依赖从离线镜像解压到本地缓存
- 4. 将依赖从缓存拷贝到当前目录的 node_modules 目录

然后，对应的包就会到达项目的node_modules当中。

# npm1、npm2依赖嵌套设计存在的问题

- 依赖层级太深，会导致文件路径过长的问题，尤其在 window 系统下。

- 大量重复的包被安装，文件体积超级大。比如跟 foo 同级目录下有一个baz，两者都依赖于同一个版本的lodash，那么 lodash 会分别在两者的 node_modules 中被安装，也就是重复安装。

- 模块实例不能共享。比如 React 有一些内部变量，在两个不同包引入的 React 不是同一个模块实例，因此无法共享内部变量，导致一些不可预知的 bug。

从 npm3 开始，包括 yarn，都着手来通过`扁平化依赖`的方式来解决这个问题，所有的依赖都被拍平到node_modules目录下，不再有很深层次的嵌套关系。这样在安装新的包时，根据 node require 机制，会不停往上级的node_modules当中去找，如果找到相同版本的包就不会重新安装，解决了大量包重复安装的问题，而且依赖层级也不会太深。

`扁平化依赖`设计存在的问题

- 依赖结构的不确定性。例如：项目依赖两个包 foo 和 bar，foo依赖base-64@1.0.1，bar依赖base-64@2.0.1，那整体的结构就不确定了，这也是lock文件诞生的原因；

- 扁平化算法本身的复杂性很高，耗时较长；

- 项目中仍然可以非法访问没有声明过依赖的包；

# npm/yarn 潜在的问题

npm/yarn 本身还是存在扁平化算法复杂和package 非法访问的问题，影响性能和安全。