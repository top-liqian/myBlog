Array.prototype._pop = function () {
    const len = this.length
    if(len === 0) {
       return undefined
    }
    const result = this[len - 1]
    this.length = len - 1
    return result
}

let arr = [ 1, 2 ]
let arr2 = []

console.log(arr._pop(), arr) // 2 [1]
console.log(arr2._pop(), arr2) // undefined []