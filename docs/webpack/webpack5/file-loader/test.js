/* 
   loader.raw = true的话loader得到的是一个二进制的Buffer
   loader.raw = false 得到的是一个utf8字符串
*/

function loader (source) {
   // 1. 生成文件名
   let fileName = '3563.png'
   // 2. 像输出目录写进一个文件
   this.emitFile(fileName)
   // 3. 返回一个JS脚本
   return `module.exports = ${fileName}`
}

loader.raw = true
module.exports = loader