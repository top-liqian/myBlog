## 1. 如何使类数组使用for...of进行遍历

```js
let iterable = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3
}

for (let i of iterable) {
    console.log('i', i)
}
// 报错 Uncaught TypeError: iterable is not iterable
```

解决办法：

```js
let iterable = {
    0: 'a',
    1: 'b',
    2: 'c',
    length: 3,
    [Symbol.iterator]: Array.prototype[Symbol.iterator]
}

for (let i of iterable) {
    console.log('i', i)
}
```