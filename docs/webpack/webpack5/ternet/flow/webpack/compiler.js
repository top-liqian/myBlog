let SyncHook = require('../tapable')
const path = require('path')
const fs = require('fs')
const types = require('@babel/types')
const parser = require('@babel/parser') // 源代码转换成AST抽象语法树
const traverse = require('@babel/traverse').default // 遍历语法树
const generator = require('@babel/generator').default // 把语法树重新生成代码

// path.sep 不同操作系统之下的路径分隔符；posix代表全部统一为Unix格式的/，不加posix是根据系统来的
function toUnixPath(filePath) {
    return filePath.replace(/\\/g, path.posix.sep) // path.posix.sep 等价于 '/'
}

let baseDir = toUnixPath(process.cwd()) // 根目录

class Compiler {
    constructor(options) {
        this.options = options
        this.hooks = {
            run: new SyncHook(), // 会在开始编译的时候执行
            done: new SyncHook(), // 会在结束编译的时候执行
        }
        this.modules = [] // 这里存放所有的模块
        this.chunks = [] // 这里存放着chunk代码块，webpack5的话是Set集合
        this.assets = {} // 输出列表，存放将要输出的文件
        this.files = [] // 表示本次编译所有产出的文件名
    }
    run() {
        this.hooks.run.call() // 4. 当调用run方法这个函数的时候就会调用run的这个钩子，进而执行他的回掉函数
        // console.log('中间编译')
        // 5. 根据配置文件中的entry找到入口文件，得到entry的绝对路径
        const entry = toUnixPath(path.join(this.options.context, this.options.entry))
        // console.log(entry)
        // 6. 从入口文件出发，调用所有配置的loader对模块进行编译
        let entryMoudle = this.buildModule(entry)
        console.log('entryMoudle', entryMoudle)
        this.modules.push(entryMoudle) // 存放入口文件
        console.log('this.modules', this.modules)
        // 7. 再找出该模块依赖的模块，在递归本步骤直到所有的入口依赖文件都经过了本步骤的处理
        entryMoudle.dependencies.forEach(dependence => {
            let dependenceModule = this.buildModule(dependence)
            this.modules.push(dependenceModule)
        })
        // 8. 在把每个Chunk转化成一个单独的文件加入到输出列表
        let chunk = { name: 'main', entryMoudle, modules: this.modules }
        this.chunks.push(chunk)
        this.chunks.forEach(chunk => {
            this.assets[chunk.name + '.js'] = getSource(chunk) // key: 文件名 value: 打包之后的源代码
        })
        // 9. 在确定好输出内容之后，根据配置确定输出的路径和文件名，把文件内容写入文件系统
        this.files = Object.keys(this.assets)
        let targetFile = path.join(this.options.output.path, this.options.output.filename)
        for(let file in this.files) {
            fs.writeFileSync(targetFile, this.assets[file])
        }
        this.hooks.done.call()
    }
    /**
     *  编译模块 1. 读取文件内容
     * @param {*} modulePath 
     */
    buildModule = (modulePath) => {
        let originSourceCode = fs.readFileSync(modulePath, 'utf8')
        let targetSoureceCode = originSourceCode
        let rules = this.options.module.rules
        let loaders = []

        for(let i = 0; i< rules.length; i++) {
            if(rules[i].test.test(modulePath)) {
                loaders = [...loaders, ...rules[i].use]
            }
        }
        for(let i=loaders.length - 1; i>= 0; i--) {
            let loader = loaders[i]
            targetSoureceCode = require(loader)(targetSoureceCode)
        }
        // console.log('originSourceCode', originSourceCode)
        // console.log('targetSoureceCode', targetSoureceCode)
        // 现在我们已经得到转换之后的代码 es6 => es5
        // 7. 再找出该模块依赖的模块，在递归本步骤直到所有的入口依赖文件都经过了本步骤的处理
        const moduleId = './' + path.posix.relative(baseDir, modulePath)
        let module = { id: moduleId, dependencies: [] }
        let astTree = parser.parse(targetSoureceCode, { sourceType: 'module' }) // parse的第二个参数，sourceType有两种形式，一种是module，一种是script
        traverse(astTree, {
            CallExpression: ({ node }) =>{
                if (node.callee.name === 'require') {
                    // 要解决两个问题，1. 相对路径./title(路径是相对与当前模块的)要转换成绝对路径
                    let moduleName = node.arguments[0].value; 
                    console.log('moduleName', moduleName)
                    let dirname =  path.posix.dirname(moduleName) // 获取路径所在的目录
                    let depModulePath 
                    if(path.isAbsolute(dirname)) { // 判断当前是否是绝对路径
                        depModulePath = moduleName
                    } else {
                        depModulePath = path.join(dirname, moduleName)
                    }
                    let extensions = this.options.resolve.extensions
                    console.log(depModulePath, extensions, moduleName, dirname)
                    // 挨个尝试后缀名的文件是否存在
                    // depModulePath = tryExtensions(depModulePath, extensions, moduleName, dirname)
                    // 模块id的问题，每一个模块打包之后都有一个模块ID，
                    // 相对路径 baseDir = /a/b/c depModulePath = /a/b => relative = c
                    let depModuleId = './' + path.posix.relative(baseDir, depModulePath) // ./src/title.js
                    // 修改抽象语法书
                    console.log('depModuleId', depModuleId)
                    node.arguments = [types.stringLiteral(depModuleId)]
                    module.dependencies.push(depModulePath)
                }
            }
        })
        console.log('module1', module)
        // 根据新的语法树生成新的代码块
        let { code } = generator(astTree)
        module._source = code // 转换后的代码 module， moduleId, dependencies, _source
        console.log('module', module)
        return module
    }
}

function tryExtensions(modulePath, extensions, originModulePath, moduleContext) {
    console.log('extensions', extensions)
    for(let i = 0; i < extensions.length; i++) {
        const path = modulePath + extensions[i]
        // console.log('path', path)
        if(fs.existsSync(path)) return path
    }
    throw new Error(`${originModulePath} is not find in ${moduleContext}`)
}

function getSource() {
    return 'hello'
}
module.exports = Compiler