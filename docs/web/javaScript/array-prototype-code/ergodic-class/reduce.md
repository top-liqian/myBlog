# reduce

reduce() 方法对数组中的每个元素执行一个由您提供的reducer函数(升序执行)，将其结果汇总为单个返回值。

# 返回值

函数累计处理的结果

## 注意点

## polyfill

```js
Array.prototype._reduce = function (callback, initialValue) {
    if (typeof callback !== 'function') {
       throw new Error()
    }

    let len = this.length
    let i = 0
    let pre = initialValue
    if (typeof pre === 'undefined') {
        i = 1
        pre = this[0]
    }
    while(i < len) {
        if (i in this) {
            pre = callback(pre, this[ i ], i, this)
        }
        i++
    }
    return pre
}

const sum = [1, 2, 3, 4]._reduce((prev, cur) => {
  return prev + cur;
})

console.log(sum)
```