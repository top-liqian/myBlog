# 1. 一个字符串里出现最多的字符是什么，以及出现次数?

```js
// 方法1: 遍历

const str = 'nsjdhfowjn               cpoqkwwaaa'

function maxCharInStr (str) {
  let temp = str.split('')
  let obj = new Map()
  let name = ''
  let max = 0

  temp.forEach(el => {
    const getValueTime = obj.get(el)
    const value = getValueTime ? getValueTime + 1 : 1
    max = max > value ? max : value
    name = max > value ? name : el
    obj.set(el, value)
  })
  
  return { name, max }
}

const char = maxCharInStr(str)

console.log(char)

// 方法2: 正则， 缺点只能匹配数字和字母
function maxCharInStr1 (str) {
  const temp = str.split('').sort().join()
  const reg = /(\w)\1+/g
  let name = ''
  let max = 0
  temp.replace(reg, function($0, $1) {
    max = $0.length > max ? $0.length : max
    name = $0.length > max ? $1 : name
  })

  return { name, max }
}

const char1 = maxCharInStr1(str)

console.log(char1)

```