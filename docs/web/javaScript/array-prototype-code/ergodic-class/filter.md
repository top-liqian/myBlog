# filter

filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素。

## 返回值

一个新的、由通过测试的元素组成的数组，如果没有任何数组元素通过测试，则返回空数组。

## 关注点

1. filter会为每一个元素执行一次callback函数，并使所有callback函数返回值为true的元素重新组建数组并返回
2. callback 只会在已经赋值的索引上被调用，对于那些已经被删除或者从未被赋值的索引不会被调用。那些没有通过 callback 测试的元素会被跳过，不会被包含在新数组中。
3. filter 不会改变原数组，它返回过滤后的新数组。
4. 如果为 filter 提供一个 thisArg 参数，则它会被作为 callback 被调用时的 this 值。否则，callback 的 this 值在非严格模式下将是全局对象，严格模式下为 undefined。
5. filter 遍历的元素范围在第一次调用 callback 之前就已经确定了。在调用 filter 之后被添加到数组中的元素不会被 filter 遍历到。如果已经存在的元素被改变了，则他们传入 callback 的值是 filter 遍历到它们那一刻的值。被删除或从来未被赋值的元素不会被遍历到。

## polyfill

```js
Array.prototype._filter = function (callback, thisArgs) {
    if (typeof callback !== 'function') {
       throw new Error()
    }

    let len = this.length
    let i = 0
    let result = []
    while(i < len) {
        if (i in this && callback.call(thisArgs, this[i], i, this)) {
            result.push(this[i])
        }
        i++
    }
    return result
}
// 索引为5的位置，没有初始化值，不会被遍历
let arr = [ 0, 1, 2, -3, 4,, 5 ]
// 删除掉最后一个元素
delete arr[6]
// 过滤出大于0的值
let filterArr = arr._filter((it) => it > 0)

console.log(filterArr) // [ 1, 2, 4 ]

```