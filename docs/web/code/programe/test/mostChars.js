// 'abcaakjbb' => { 'a': 2,'b': 2 }
// 'abbkejsbcccwqaa' => { 'c': 3 }

const str = 'abcaakjbb\\\\\\$$$$$$$$$$$'

const str1 = 'abbkejsbcccwqaa我我我我你你你你'

function mostChars(str) {
  if (!str) return {}
  let obj = {}
  let max = 0
  str.replace(/(\s|\S)\1+/g, (str, $1) => {
    if(max < str.length) {
      max = str.length
      obj = {}
      obj[$1] = str.length
    } else if (max === str.length) {
      obj[$1] = str.length
    }
  })
  return obj
}

function mostChars1(str) {
  if (!str) return {}
  let obj = {}, max = 1;
  let prev = '', preNum = 0
  for (let i of str) {
    if (i === prev) {
      preNum = preNum + 1
      if (preNum > max) {
        obj = {}
        obj[i] = preNum
        max = preNum
      } else if (max === preNum){
        obj[i] = max
      }
    } else {
      prev = i
      preNum = 1
    }
  }
  return obj
}

const result = mostChars(str)

const result1 = mostChars1(str1)

console.log(result, result1)