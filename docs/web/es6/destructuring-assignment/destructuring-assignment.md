# 变量的解构赋值

## 数组的解构赋值

1. 模式匹配：只要等号两边结构相同，那么左边的变量就会复制成为后边的值，如果解构不成功，就会被复制成为undefined

```js
let [a, b, c] = [1, 2, 3]
let [d, ...e] = [4, 5, 6]
let [x,y,z] = new Set([1,2,3])
let [foo] = 1; // error
let [foo] = false; // error
let [foo] = NaN; // error
let [foo] = undefined; // error
let [foo] = null; // error
let [foo] = {}; // error
```

2. 解构赋值可以设置默认值

> es6当中使用严格相等运算符（===）来判断一个位置是否有值，如果数组中项 === undefined，那么默认值则会生效

```js
let [name = 'liqian'] = [undefined] // liqian
let [name = 'zhangsan'] = ['liqian'] // liqian
let [name = 'zhangsan'] = [null] // null
```

> 如果默认值是一个表达式，那么这个表达式是惰性求值的，即只有在用到的时候，才会求值。

```js
function setName() { return 'liqian' }
let [name: setName()] = ['zhangsan'] // zhangsan
let [name: setName()] = [undefined] // liqian
```
> 默认值可以赋值其他已经定义好的变量，否则会报错

```js
let [x = 1, y = x] = [2, undefined] // [2, 2]
let [x = 1, y = x] = [1, 2] // [1, 2]
let [x = y, y = 1] = [] // error
```

## 对象的解构赋值

1. 由于数组是有序的，所以在解构赋值时并不用关心解构的顺序问题，而对象是无序的，需要定义相同的变量名才可以解构成功,如果解构失败，变量的值等于undefined

```js
let { name , age, sex } = { name: 'liqian', age: 18 }
console.log('name', name) // liqian
console.log('sex', sex) // undefined
```

2. 对象解构赋值可以定义别名

> 对象的解构赋值的内部机制，是先找到同名属性，然后再赋给对应的变量。真正被赋值的是后者，而不是前者

```js
let { address: a } = { address: '浙江省杭州市' }
console.log('address', a) // 浙江省杭州市
console.log('address', address) // address is not defined
```

3. 对象解构赋值可以嵌套

```js
let school = { math: { teacher: 'wang', student: 23 }}

let { math: { teacher }} = school

console.log('math',teacher ) // 'wang'

let { foo: { bar } } = { baz: 'baz' } //  Cannot read property 'bar' of undefined
```

4. 对象解构赋值可以给默认值同数组解构赋值

### 注意点

1. 如果要将一个声明的变量进行解构赋值，要注意作用域的问题

```js
let a

{ a } = { a: 1 } // error a is not defined

({ a } = { a: 1 }) // a: 1

```

2. 解构赋值允许等号左边的模式之中，不放置任何变量名。因此，可以写出非常古怪的赋值表达式

```js
({} = [true, false]);
({} = 'abc');
({} = []); // 无任何实质性的作用，但是语法上合法
```

## 字符串解构赋值

字符串被转换成类似数组的对象,并且具有length属性

```js
let message = 'hello'
let [a,b,c,d,e,f] = message

let { length: len } = message

console.log('len', len) // 5
```

## 数值和布尔类型的值解构赋值

解构赋值时，会先将右边的值转换成对象类型, undefined和null无法转为对象，所以对它们进行解构赋值，都会报错

```js
let { toString: n } = 123

n === Number.prototype.toString // true

let { toString: b } = true

s === Boolean.prototype.toString // true
```

## 函数参数解构赋值

```js
  function setAge([age]) { return age }
  
  let age = setAge([17]) // 17
  
  function setInformation({ name = 'liqian', age = 18, sex } = {}) { return { name, age, sex }}
  
  let obj = setInformation() // {name: 'liqian', age: 18, sex: undefined }
  
  let obj1 = setInformation({ name: 'zhangsan' }) // {name: 'zhangsan', age: 18 }
  
  function setInfo({x, y} = {x: 0, y:0}){ return { x, y}}
  
  setInfo({}) // undefined undefined
  setInfo({ x: 1 }) // 1 undefined
  setInfo() // 0 0
```

## 圆括号问题

任何模式语句当中都不可以使用圆括号，否则会报错

赋值语句和非模式语句可以使用圆括号

```js
({ name: 1}) = { name: 1} // error

[(name)] = [3] // [3]
```

## 用途

1. 交换变量值 [a, b] = [b ,a]

2. 函数参数定义

3. 函数返回多个值

4. json解析

5. 函数参数给默认值

6. 遍历map解构

```js
let map = new Map()

map.set('first', 1)
map.set('second', 2)

for (let [key, value] of map) {
 console.log(`key: ${key} and value is ${value}`)
}

for(let [, value] of map) { ... }
```

7. 输入模式指定的方法

```js
 let { name } = require('html-webpack-plugin')
```

## 面试题

1. let {toString:x} = 666，x？原因？

首先es6的解构赋值规定了只有=号右边不是数组或者对象将会抓换成对象进行解构赋值，666 是`Number`类型的值，转换成对象的过程会调用基本类型的包装对象了来生成一个对象，解构如下：

```js
   Number(666)
   /*
     {
       constructor: Number(),
       toFixed: toFixed(),
       toString: toSting(),
       valueOf: valueOf(),
     }
   */
```

所以以上解构赋值是成立的，x === Number.prototype.toString

[浏览器逃逸分析](https://juejin.im/post/5b34f757f265da5989594721)
