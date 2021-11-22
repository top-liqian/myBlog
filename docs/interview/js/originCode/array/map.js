const map = function (arr, fn) {
    let results = []
    for(let value of arr) {
        results.push(fn(value))
    }
    return results
}

let arr = [1,2,3,4]
arr = map(arr, v => v*v)

console.log(arr)