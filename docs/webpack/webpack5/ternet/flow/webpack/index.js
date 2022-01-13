const Compiler = require('./compiler')
function webpack(options) {
   // 1. 初始化参数，将配置文件和shell脚本读取并且合并配置项得到最后的配置项
   const shellConfig = {}
   // process.env.slice(2).reduce((shellConfig, item) => {
   //      let [key, value] = item.split('=') // item = --mode=development
   //      shellConfig[key.slice(2)] = value // key = --mode, value = development
   //      return shellConfig
   // }, {})
   // 得到最终的配置对象
   let finalOptions = Object.assign(options, shellConfig) // 等价于 { ...options, shellConfig  }

   // 2. 用上一部得到的参数创建compiler对象
   let compiler = new Compiler(finalOptions)

   // 3. 加载所有的配置插件
   if (finalOptions.plugins && Array.isArray(finalOptions.plugins)) {
      // 刚一开始的时候就会执行所有插件实例的apply方法，并传递compiler实例
      for(let plugin of finalOptions.plugins) {
         plugin.apply(compiler) // 此处内部执行了对象的run方法开始编译
      }
   }
   return compiler
}

module.exports = webpack