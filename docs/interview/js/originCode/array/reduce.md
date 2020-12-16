# 手动实现Array.prototype.reduce

```js
  Array.prototype.reduce = function (callbackfn, initalValue) {
    if (this == null) {
      throw new TypeError("Cannot read property 'map' of null or undefined");
    }
    if (typeof callbackfn !== 'function') {
      throw new TypeError(callbackfn + ' is not a function')
    }
    let O = Object(this)
    let len = O.length >>> 0
    let k=0, accumulator

    if (initalValue) {
      accumulator = initalValue
    } else {
      if (len === 0) {
        throw new TypeError('Reduce of empty array with no initial value');
      }
      let flag = false
      while(!flag && (k < len)) {
        flag = k in O
        if (flag) {
          accumulator = O[k]
        }
        k++
      }
    }

    while(k< len) {
      if (k in O) {
        let cru = O[k]
        accumulator = callbackfn.call(undefined, accumulator, cru, k, O)
      }
      k++
    }
    return accumulator
  }
```