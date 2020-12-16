## 1. 输出以下代码运行结果

```js
1 + "1"

2 * "2"

[1, 2] + [2, 1]

"a" + + "b"
```

```js
11 // + 符号如果存在string则是字符串拼接

4 // * 符号如果左右两侧不是number 则调用Number()转换成number进行相乘

1,22,1 // Javascript中所有对象基本都是先调用valueOf方法，如果不是数值，再调用toString方法

aNaN // 后面的+号被是为一元运算符， 调用Number方法转换出NaN，进行拼接
```

加号作为一元运算符时，其后面的表达式将进行`ToNumber`(参考es规范)的抽象操作

+ true -> 1
+ false -> 0
+ undefined -> NaN
+ null -> 0
+ ’字符串‘ -> 字符串为纯数字时返回转换后的数字（十六进制返回十进制数），否则返回`NaN`
+ 对象 -> 通过T`oPrimitive`拿到基本类型值，然后再进行`ToNumber`操作 `+{valueOf: ()=> 5}  // 5`  `+{} -> NaN`

## 2. 请写出如下代码的打印结果

```js
var name = 'Tom';
(function() {
if (typeof name == 'undefined') {
  name = 'Jack';
  console.log('Goodbye ' + name);
} else {
  console.log('Hello ' + name);
}
})();
```

1. 首先在进入函数作用域当中，获取name属性 
2. 在当前作用域没有找到name 
3. 通过作用域链找到最外层，得到name属性 
4. 执行else的内容，得到Hello Tom

```js
Hello Tom
```

## 3. 请写出如下代码的打印结果

```js
var name = 'Tom';
(function() {
if (typeof name == 'undefined') {
  var name = 'Jack';
  console.log('Goodbye ' + name);
} else {
  console.log('Hello ' + name);
}
})();
```
1. var name = 'Jack'会变量提升至就近function的最上层
2. typeof name == 'undefined'
3. Goodbye Jack

```js
Goodbye Jack
```

## 4. 分别写出如下代码的返回值

```js
String('11') == new String('11');
String('11') === new String('11');
```

```js
String('11') == new String('11').toString() // true
String('11') === new String('11') // 相当于 '11' === {"11"} false
```

## 5. 请写出如下代码的打印结果

```js
function Foo() {
  Foo.a = function() {
   console.log(1)
  }
  this.a = function() {
   console.log(2)
  }
}

Foo.prototype.a = function() {
  console.log(3)
}

Foo.a = function() {
  console.log(4)
}

Foo.a();
let obj = new Foo();
obj.a();
Foo.a();
```

```js
4 2 1
```

## 6. 写出如下代码的打印结果

```js
function changeObjProperty(o) {
  o.siteUrl = "http://www.baidu.com"
  o = new Object()
  o.siteUrl = "http://www.google.com"
} 
let webSite = new Object();
changeObjProperty(webSite);
console.log(webSite.siteUrl);
```

```js
"http://www.baidu.com"

webSite被传进changeObjProperty函数当中，先被赋值"http://www.baidu.com"
后面o又指向了新的地址，被重新赋值，但是函数的行参是值传递，原来的引用还在
所以webSite.siteUrl 访问的是原对象，打印出"http://www.baidu.com"
```

## 7. 输出以下代码运行结果

```js
// example 1
var a = {}, b = '123', c = 123;  
a[b] = 'b';
a[c] = 'c';  
console.log(a[b]);

---------------------
// example 2
var a = {}, b = Symbol('123'), c = Symbol('123');  
a[b] = 'b';
a[c] = 'c';  
console.log(a[b]);

---------------------
// example 3
var a = {}, b = {key:'123'}, c = {key:'456'};  
a[b] = 'b';
a[c] = 'c';  
console.log(a[b]);
```

```js
a = { '123': 'c' }  答案：'c'
a = { Symbol('123'): 'b',  Symbol('123'): 'c' }  答案：'c'
a = { '[object Object]': 'c' }  答案：'c'
```

+ 对象的键名只能是字符串或者Symbol类型
+ 其他类型的都会被转换成字符串
+ 对象转字符串默认会调用toString方法

