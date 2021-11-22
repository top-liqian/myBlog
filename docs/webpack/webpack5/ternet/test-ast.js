const core = require('@babel/core')
const types = require('@babel/types')
let babelPluginTransformClasses = require('@babel/plugin-transform-classes')

const sourceCode = `
class Person{
    constructor(name){
        this.name = name
    }
    getName() {
        return this.name
    }
}
`
// babel插件本质是一个对象，它会有一个访问器对象。
let babelPluginTransformClasses2 = {
    // 每个插件都有自己的visitor
    visitor: {
        classDeclaration(nodePath){
            let { node } = nodePath
            let { id } = node // Person的标识符
            let classMethods = node.body.body // 获取原来的方法 一个是constructor，一个是getName
            let body = []
            classMethods.forEach(it => {
                if (it.kind === constructor) { // 创建一个普通函数 
                    let constructorFunction = types.functionDeclaration(null, it.params,it.body, it,generator, it.async)
                    body.push(constructorFunction)
                } else { // 普通函数特殊处理，是要放在原型上的
                    // it.key = getName(方法名)
                    let left = types.memberExpression(types.memberExpression(id, types.identifier('prototype')), it.key )
                    let right = types.functionExpression(id, it.params, it.body,it.generator, it.async)
                    let assignmentExpression = types.assignmentExpression("=", left,right)
                    body.push(assignmentExpression)
                }
            })
            nodePath.replaceWithMultiple(body) // replaceWithMultiple替换成多节点，replaceWith() 替换成单节点
        }
    }
}

let targetCode = code.transform(sourceCode, {
    plugins: [babelPluginTransformClasses2]
}) 

console.log(targetCode)