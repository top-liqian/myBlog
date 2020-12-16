const str = '   lala    lala    '

function myTrim(str) {
  return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
}

function myTrim1(str) {
    return str.replace(/[\s\uFEFF\xA0]*/g, '')
}

const result = myTrim(str)

const result1 = myTrim1(str)

console.log('result', result, result1)