## 数组扁平化

<div style="color: red;">ES5的方式1: arr.some + concat</div>

```js
  var arr = [[1,2,3], [4,5,6, [7,8,9, [10, 11, 12,, [13,14]]]]]

  while(arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
```
<div style="font-weight: 600;margin-bottom:20px;">优点：可以完美的还原数组，对于[1,,2]也可以处理</div>
<div style="font-weight: 600;margin-bottom:20px;">缺点：性能不高</div>

<div style="color: red;">ES5的方式2: 正则</div>

```js
  var arr = [[1,2,3], [4,5,6, [7,8,9, [10, 11, 12, [13,14]]]]]
  arr = JSON.stringify(arr).replace(/\[|\]/g, '').split(',')
```
<div style="font-weight: 600;margin-bottom:20px;">优点：性能好</div>
<div style="font-weight: 600;margin-bottom:20px;">缺点：对于[1,,2]会处理成[1, null, 2]</div>

<div style="color: red;">ES6的方式</div>

```js
  var arr = [[1,2,3], [4,5,6, [7,8,9, [10, 11, 12, [13,14]]]]]
  arr.flat(Infinity)
```

<div style="font-weight: 600;margin-bottom:20px;">优点：语法简便</div>
<div style="font-weight: 600;margin-bottom:20px;">缺点：对于[1,,2]会处理成[1, 2]</div>


## 手动实现数组的flat函数

方法1: some + 扩展运算符

```js

```