### Array.prototype.map
```js
  Array.prototype.map = function (callbackfn, thisArg) {
    // 异常处理
    if (this == null) {
      throw new TypeError("Cannot read property 'map' of null or undefined");
    }
    if (typeof callbackfn !== 'function') {
      throw new TypeError(callbackfn + ' is not a function')
    }
    // 将数组转换成类数组
    let O = Object(this)
    // 获得数组长度
    let len = O.length >>> 0
    // 可选项 callbackfn 函数执行时的 this 值赋值给T
    let T = thisArg
    // 创建同长度新数组作为返回
    let A = new Array(len)
    // 新数组索引
    let k = 0
    // 依次执行callbackfn函数
    while (k < len) {
      if (k in O) {
        let cur = O[k]
        let mappedValue = callbackfn.call(T, cur, k, O)
        A[k] = mappedValue
      }
      k++
    }
    // 返回执行过后的数组
    return A
  }
```

  map 并不会修改原数组，不过也不是绝对的，如果你在 callbackfn 中修改了原数组，那还是会改变。那问题来了，修改后会影响到 map 自身的执行吗？
  答案是会的！不过得区分以下几种情况。

  + 原数组新增元素：因为 map 第一次执行时 length 已经确定了，所以不影响

    + 原数组修改元素：传递给 callbackfn 的元素是 map 遍历到它们那一瞬间的值，所以可能受影响

    + 修改当前索引之前的元素，不受影响

    + 修改当前索引之后的元素，受影响


  + 原数组删除元素：被删除的元素无法被访问到，所以可能受影响

  + 删除当前索引之前的元素，已经访问过了，所以不受影响

  + 删除当前索引之后的元素，受影响

### Array.prototype.filter
```js
  Array.prototype.filter = function (callbackfn, thisArg) {
    if (this == null) {
      throw new TypeError("Cannot read property 'map' of null or undefined");
    }
    if (typeof callbackfn !== 'function') {
      throw new TypeError(callbackfn + ' is not a function')
    }
    let O = Object(this)
    let len = O.length >>> 0
    let T = thisArg
    let A = new Array(len)
    let k = 0
    // 较map方法新增to
    let to = 0
    while(k < len){
      if (k in O) {
        let cru = O[k]
        if (callbackfn.call(T, cru, k, O)) { // filter方法过滤，使callbackfn函数返回值为true的数组项作为新数组的项返回
          A[to++] = cru
        }
      }
      k++
    }
    // 修改要返回数组的长度
    A.length = to 
    return A
  }
```

### Array.prototype.reduce
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
### Array.prototype.forEach
```js
  Array.prototype.forEach = function (callbackfn, thisArg) {
    // 异常处理
    if (this == null) {
      throw new TypeError("Cannot read property 'map' of null or undefined");
    }
    if (typeof callbackfn !== 'function') {
      throw new TypeError(callbackfn + ' is not a function')
    }
    // 将数组转换成类数组
    let O = Object(this)
    // 获得数组长度
    let len = O.length >>> 0
    // 可选项 callbackfn 函数执行时的 this 值赋值给T
    let T = thisArg
    // 新数组索引
    let k = 0
    // 依次执行callbackfn函数
    while (k < len) {
      if (k in O) {
        let cur = O[k]
        callbackfn.call(T, cur, k, O)
      }
      k++
    }
  }
```