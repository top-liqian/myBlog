var paragraph = 'The quick brown fox jumps over the lazy dog. If the dog barked, was it really lazy?'
var searchTerm = 'dog'

function _sIndexOf(str, searchValue, fromIndex) {
   const reg = new RegExp(`${searchValue}`, 'ig')
   reg.lastIndex = fromIndex
   const result = reg.exec(str)
   console.log(typeof result)
   return result ? result.index : -1
}

console.log(_sIndexOf(paragraph, searchTerm))
// 40
console.log(paragraph.indexOf(searchTerm));
// 40
// 测试二：设置 fromIndex
console.log(_sIndexOf(paragraph, searchTerm, 41))
// 52
console.log(paragraph.indexOf(searchTerm, 41));

function _aIndexOf(arr, searchValue, fromIndex = 0) {
  for(let i = fromIndex; i < arr.length; i++) {
    if(arr[i] === searchValue) return i
  }
  return -1
}

// 测试
var beasts = ['ant', 'bison', 'camel', 'duck', 'bison']
// 测试一：不设置 fromIndex
console.log(_aIndexOf(beasts, 'bison'))
// 1
console.log(beasts.indexOf('bison'))
// 1
// 测试二：设置 fromIndex
console.log(_aIndexOf(beasts, 'bison', 2))
// 4
console.log(beasts.indexOf('bison', 2))


function _indexOf(items, item, fromIndex = 0) {
  const iaArray = Array.isArray(items)
  const isString = Object.prototype.toString.call(items) === '[object String]'
  if (!iaArray && !isString) throw new Error('error')
  if (iaArray) return _aIndexOf(items, item, fromIndex)
  else return _sIndexOf(items, item, fromIndex)
}

// 测试
var beasts = ['ant', 'bison', 'camel', 'duck', 'bison']
// 测试一：不设置 fromIndex
console.log(_indexOf(beasts, 'bison'))
// 1
console.log(beasts.indexOf('bison'))
// 1
// 测试二：设置 fromIndex
console.log(_indexOf(beasts, 'bison', 2))
// 4
console.log(beasts.indexOf('bison', 2))