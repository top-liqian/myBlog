/* 
 * loader-runner 是一个独立的运行laoder的模块 
 * 1. 为什么loader的执行顺序是从右到左的，从下到上的
 * 2. 为什么要分成4种laoder？
 *    因为loader的类型不同，执行的顺序不同，loader的配置顺序是分散的，可能是多个配置文件合并而来
 *    在webpack当中通过配置enforce参数来决定laoder的先后执行顺序，post一定后执行，pre一定先执行
 * 
*/ 
let path = require('path')
const fs = require('fs')

let { runLoaders } = require('loader-runner')

const filePath = path.resolve(__dirname, 'src', 'index.js')

// console.log('resource', resource)

// const loaders = [
//     path.resolve(__dirname, 'loaders', 'post-loader1.js'),
//     path.resolve(__dirname, 'loaders', 'post-loader2.js'),
//     path.resolve(__dirname, 'loaders', 'inline-loader1.js'),
//     path.resolve(__dirname, 'loaders', 'inline-loader2.js'),
//     path.resolve(__dirname, 'loaders', 'normal-loader1.js'),
//     path.resolve(__dirname, 'loaders', 'normal-loader2.js'),
//     path.resolve(__dirname, 'loaders', 'pre-loader1.js'),
//     path.resolve(__dirname, 'loaders', 'pre-loader2.js'),

// ]
/**
 * 组装loaders
 */
let resolveLoader = loader => path.resolve(__dirname, 'loaders', loader)
const request = `inline-loader1!inline-loader2!${filePath}`
const parts = request.split('!')
const resource = parts.pop()
let inlineLoader = parts.map(resolveLoader)
let loaders = []
let rules = [
    {
        test: /\.js$/,
        use: ['normal-loader1', 'normal-loader2']
    },
    {
        test: /\.js$/,
        enforce: 'post',
        use: ['post-loader1', 'post-loader2']
    },
    {
        test: /\.js$/,
        enforce: 'pre',
        use: ['pre-loader1', 'pre-loader2']
    }
]
let preLoaders = []
let normalLoaders = []
let postLoaders = []

for(let i = 0; i < rules.length; i++) {
    let rule = rules[i]
    if (rule.test.test(resource)) {
        if(rule.enforce === 'pre') {
            preLoaders.push(...rule.use)
        } else if(rule.enforce === 'post') {
            postLoaders.push(...rule.use)
        } else {
            normalLoaders.push(...rule.use)
        }
    }
}
preLoaders = preLoaders.map(resolveLoader)
normalLoaders = normalLoaders.map(resolveLoader)
postLoaders = postLoaders.map(resolveLoader)
loaders = [...postLoaders, ...inlineLoader, ...normalLoaders, ...preLoaders]
/** 
 * runner-loader的运行机制
 * 1. 首先要读取加载的资源
 * 2. 把资源传递给loader的链条，一一处理，最终得到结果
*/
runLoaders({
    resource, // 要加载和转换的资源路径，可以包含查询字符串，是一个绝对路径
    loaders, // loader的绝对路径的数组
    context: { name: 'liqian' }, // 额外的loader的上下文资源
    readResource: fs.readFile.bind(fs) // 读取文件的方法
}, (err, result) => {
    console.log('err', err)
    console.log('result', result.result)
})