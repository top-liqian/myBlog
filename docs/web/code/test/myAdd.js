function myAdd(...args) {
    const _add = function (...args1) {
      return myAdd(...args, ...args1)
    }
    _add.value = () => args.reduce((pre,cru) => pre + cru)
    return _add
}

const result = myAdd(1)(2,3)(4).value()  

console.log('result', result)