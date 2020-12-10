// let unary = fn => val => fn(val)
// let parse = unary(parseInt)
// console.log(['1.1', '2', '0.3'].map(parse))

let unary = (fn) => {
    return (val) => {
        console.log(val)
        return fn(val)
    }
}

let parse = unary(parseInt)

console.log(['1.1', '2', '0.3'].map(parse))