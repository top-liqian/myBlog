(() => {
    // 存放着所有的模块定义，包括懒加载的或者说异步加载过来的模块定义
    var modules = ({})
    var cache = {}
    // 在require的时候只会取modules里面的模块定义，所以需要将异步加载过来的模块定义合并到modules里面
    function require(moduleId) {
        if(cache[moduleId]) {
           return cache[moduleId]
        }
        var module = cache[moduleId] = {
            exports: {}
        }
        modules[moduleId].call(module.exports, module, module.exports, require)
        return module.exports
    }
    // 无论是commomjs还是es module最后都编译成为了commonjs，
    // 如果原来是es module的话就把这个exports传递给r方法尽心处理一下，标记他是object module并且标记它是es module，以后就可以通过这个属性来判断是不是一个es module
    require.r = (exports) => {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'module' })
        Object.defineProperty(exports, '__esModule', { value: true })
    }
    // 给exports批量定义属性
    require.d = (exports, definition) => {
        for(let key in definition) {
            Object.defineProperty(exports, key, { enumerable: true, value: definition[key]() })
        }
    }
    require.n = (exports) => {
        return exports && exports.__esModule ? () => exports.default : () => exports
    }
    require.f = {}
    require.e = (chunkId) => {
        let promise = []
        require.j.f(chunkId, promise)
        return Promise.all(promise) // 等所有的promise都成功之后，就会加载require.bind(require, './src/hello.js')
    }
    let installedChunks = { // 用来储存已经安装的代码块，main表示代码块的名字，0表示已经就绪
        main: 0,
    }
    let installChunkData;
    // 通过jsonp异步加载chunkId，也就是hello这个代码块
    require.j.f = (chunkId, promises) => {
        let promise = new Promise((resolve, reject) => {
            installChunkData = installedChunks[chunkId] = [resolve, reject]
        })
        promises.push(promise)
        var url = require.p + require.u(chunkId) // 获取路径hello.main.js
        require.l(url)
    }
    require.p = '' // 配置文件配置的静态文件防伪路径
    require.u = (chunkId) => { // 参数是代码块的名字，返回值就是这个代码的文件名
        return chunkId + 'main.js' // hello.main.js
    }
    // 创建script标签，添加到head当中加载：http://192.168.8.93:18080/hello.main.js
    require.l = (url) => {
        let script = document.createElement('script')
        script.src = url
        document.head.appendChild(script) // 一旦添加到head当中了，浏览器会立刻发起请求
    }
    var webpackJsonPCallback = ([chunkIds, moreMoudles]) => {
        let resolves = chunkIds.map(chunkId => {
            installedChunks[chunkId] = 0
            return installedChunks[chunkId][0]
        })
        for(let moduleId in moreMoudles) {
            modules[moduleId] = moreMoudles[moduleId]
        }
        resolves.forEach(resolve => resolve())
    }
    var chunkLoadingGlobal = window['webapck5'] = []
    chunkLoadingGlobal.push = webpackJsonPCallback // 重写window['webapck5']的push方法

    (() => {
        require.e('hello').then(require.bind(require, './src/hello.js')).then(res => {
            console.log(res.default)
        })
    })()
})()

// hello.main.js

// (window['webpack5'] = (window['webpack5'] || []).push([['hello'], {
//     "./src/hello.js": 
//       ((module, exports, require) => {
//         require.r(exports)
//         require.d(exports, {
//             "default: () => __WEBPACK_DEFAULT_EXPORT__
//         });
//         const __WEBPACK_DEFAULT_EXPORT__ = ('hello');
//       })
// }])