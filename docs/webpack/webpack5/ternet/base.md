# 预备知识

## 一、Symbol.toStringTag

Symbol.toStringTag是一个内置的Symbol属性，通常作为对象的键值使用，对应的属性值应该是字符串类型，这个字符串用来表示对对象的自定义类型标签

通常只有内置的Object.prototype.toString 才会读到这个标签并且把它包含在自己的返回值里面

```js
let people = { name: 'zns' }

console.log(Object.prototype.toString.call(people)) // [object 人]

Object.defineProperty(people, Symbol.toStringTag, {
    value: '人'
})

console.log(Object.prototype.toString.call(people)) // [object 人]

```

## 二、Object.defineProperty

重新定义对象的属性

```js
let obj = {}

Object.defineProperty(obj,'age', {
    value: '18',
    writable: true,
    enumerable: true
})

console.log(obj)

```