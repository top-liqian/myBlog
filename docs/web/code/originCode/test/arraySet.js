var arr = [1, 2, 2, 3]

const unique = arr => [...new Set(arr)]

const unique1 = arr => {
    return arr.reduce((pre, cru, index, arr) => {
        if (!pre.includes(cru)) pre.push(cru)
        return pre
    }, [])
}

const unique2 = arr => arr.filter((el, index, array) => array.indexOf(el) === index)

const unique3 = arr => {
    let array = []
    const str = arr.sort().join('')
    str.replace(/(\s|\S)/g, (_, $1) => { 
        if (!array.includes($1)) array.push($1) 
    })
    return array
}

const unique4 = arr => {
    let obj = {}
    let array = []
    for (let i = 0; i < arr.length; i++) {
        if (!(arr[i] in obj)) array.push(arr[i])
        obj[arr[i]] = arr[i]
    }
    return array
}

const unique6 = arr => {
    arr.sort()
    let i = 0
    let j = 1
    while(i < arr.length) {
        if (arr[i+1] !== arr[i]) {
            arr[j] = arr[i+1]
            j += 1
        }
        i += 1
    }
    return arr.slice(0, j-1)
}

const result1 = unique(arr)

const result2 = unique1(arr)

const result3 = unique2(arr)

const result4 = unique3(arr)

const result5 = unique4(arr)

const result6 = unique6(arr)

console.log(result1, result2, result3, result4, result5, result6) // [1,2,3]