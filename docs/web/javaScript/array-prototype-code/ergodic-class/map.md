# 手写map源码

map方法创建一个新数组，其结果是原数组的每一项都执行一次给定的function函数后的返回值

## 关注点

1. map 方法会给原数组中的每个元素都按顺序调用一次  callback 函数。callback 每次执行后的返回值（包括 undefined）组合起来形成一个新数组
2. callback 函数只会在有值的索引上被调用
3. 那些从来没被赋过值或者使用 delete 删除的索引则不会被调用。
4. 如果 thisArg 参数提供给map，则会被用作回调函数的this值。否则undefined会被用作回调函数的this值。
5. map 不修改调用它的原数组本身（当然可以在 callback 执行时改变原数组）
6. map 方法处理数组元素的范围是在 callback 方法第一次调用之前就已经确定了。调用map方法之后追加的数组元素不会被callback访问。如果存在的数组元素改变了，那么传给callback的值是map访问该元素时的值。在map函数调用后但在访问该元素前，该元素被删除的话，则无法被访问到

```js
Array.prototype._map = function (func, thisArg) {
    if (typeof func !== 'function') {
        throw new Error()
    }
    let len = this.length
    let i = 0
    let result = []

    while(i < len) {
        if (i in this) {
            result.push(func.call(thisArg, this[i], i, this))
        }
        i++
    }
    return result
}
```