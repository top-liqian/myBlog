const reverse = array => array.reverse()
const getFirst = array => array[0]
function compose(f,g) {
    return function (value) {
        return f(g(value))
    }
}

const last = compose(getFirst, reverse)
console.log(last([1,2,3,4]))

// function flowRight(...args) {
//     let result
//     return function middleFunction(v) {
//         if (args.length) {
//             const func = args.pop()
//             result = func(v)
//             middleFunction(result)
//         }
//         return result
//     }
// }

// function flowRight(...args) {
//     return function (value) {
//         return args.reverse().reduce((acc,fn) => {
//             return fn(acc)
//         }, value)
//     }
// }


const lastToo = flowRight(getFirst, reverse)

// console.log(lastToo)
const result = lastToo([1,2])
console.log('111', result)