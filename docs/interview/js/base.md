## 1. 正则匹配问题

```js
const reg = /a/g

console.log('first', reg.test('ab')) // true

console.log('second', reg.test('ab')) // false

// 第二次false的原因在于第一次正则匹配之后，会改变reg的lastIndex，未匹配之前lastIndex = 0，第一次匹配之后lastIndex = 1，所以从字符b开始寻找，所以会返回false

reg.lastIndex = 0

console.log('third', reg.test('ab')) // true
```

## 2. 巧用with

```js
let obj = { a: 1, b: 2 }
with(obj) {
  console.log(a, b)
}
// 1, 2
// with括号里面的就是函数内部的作用域
```