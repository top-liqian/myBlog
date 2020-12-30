// 字符串仅由小写字母和 [] 组成，且字符串不会包含多余的空格。

// 示例一: 'abc' --> { value: 'abc' }

// 示例二：'[abc[bcd[def]]]' --> { value: 'abc', children: {value: 'bcd', children: {value: 'def'}} }


const str1 = 'abc'
const str2 = '[abc[bcd[def]]]'


function normalize(str) {
    let obj = {}
    let flag = null
    const setValue = function (obj = {}, value = '') {
        obj.value = value
        return obj
    }
    str.replace(/([a-z])+/g, ($1) => {
        if (flag !== null) {
            flag.children = {}
        }
        flag = setValue(flag === null ? obj : flag.children, $1)
    })

    return obj
}

// const result1 = normalize(str1)
const result2 = normalize(str2)

console.log('result', result2)