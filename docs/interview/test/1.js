// 方法1：
function mostCharInStr(str) {
  let arr = str.split('')
  let obj = new Map()
  let max = 0
  let char = ''
  arr.forEach(el => { 
    const getKeyTime = obj.get(el)
    const value = getKeyTime ? getKeyTime + 1 : 1
    max = value > max ? value : max
    char = value > max ? el : char
    obj.set(el, value)
  })
  console.log('char', obj)
  return { name: char, num: max}
}

const b = mostCharInStr('du  hosc  sjc')

console.log('b', b)

// 方法2：缺点不能匹配空格

function  mostCharInStr1(str) {
  let temp = str.split('').sort().join('')
  let reg = /(\w)\1+/g
  let value = ''
  let num = 0
  temp.replace(reg, function($0, $1, $2){
    if (num < $0.length) {
      num = $0.length
      value = $1
    };
  });
  return {num, value}
}

let str = 'dsfshkg    farea    sfd'
console.log(mostCharInStr1(str))