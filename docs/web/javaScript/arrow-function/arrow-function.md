### 详解箭头函数和普通函数的区别以及箭头函数的注意事项、不适用场景


#### 普通函数和箭头函数的区别：

1. 箭头函数没有prototype，导致箭头函数没有this

```js
   var a = () => {}
   console.log(a.prototype) // undefined
```

2. 箭头函数的this继承自```定义时```外层第一个普通函数的this

```js
   var fooObj = { name: 'liqian' }
   var barObj = { name: 'lisan' }
   function foo () {
     a()
   }
   function bar () {
      a = () => {
        console.log('this', this, this.name) // { name: 'lisan' } lisan
      }
   }
   bar.call(barObj)
   foo.call(fooObj)
```

+ 箭头函数指向的是定义时所在的外层的第一个普通函数的this，与运行位置没有关系
+ 被继承的普通函数的this发生改变，那箭头函数的this也会发生改变

3. 不能直接修改箭头函数的this值
 
> 可以通过修改被继承的外层的第一个普通函数的this指向间接的改变箭头函数的this

4. 箭头函数外层没有普通函数，如论是在严格模式还是非严格模式下，this都指向```window```（全局对象），区别普通函数，this在严格模式下指向```undefined```

5. 箭头函数的```this```指向全局```window```对象，使用```arguments```会报错，未定义```arguments```
6. 箭头函数的```this```指向```普通函数```时，```arguments```继承自```普通函数```

> 如何来获取箭头函数不定数量的参数呢？答案是：ES6的rest参数（```...```扩展符）
>> rest参数的用法区别于arguments
>> 1. ```箭头函数```与```普通函数```都能用
>> 2. 更加灵活，参数的长度可以自由设定
>> 3. 可读性强
>> 4. rest参数是一个```真实的数组```，可以使用数组的方法，而arguments是```伪数组```，直接使用数组的方法会报错
>> rest参数有两点需要注意：
>> 1. rest参数必须是最后一位参数
>> 2. 函数的length属性不好用

```js
  (function(...a) {}).length  // 0
  (function(a, ...b) {}).length  // 1
```

 
7. 箭头函数没有```constructor```，所以不能作为构造函数使用```new```操作符创建实例

```js
let a = () => {};
let b = new  a(); // a is not a constructor
```

8. 箭头函数不支持es6的```new.target```
   
  > new.target是ES6新引入的属性，普通函数如果通过new调用，new.target会返回该函数的引用。此属性主要：用于确定构造函数是否为new调用的

  (1) 箭头函数的this指向全局对象window，使用```new.target```会报错

  ```js
    var obj = () => {
      console.log(new.target)
    }
    new obj() // new.target expression is not allowed here
  ```
  (2) 箭头函数的this指向普通函数，```new.target```就会指向普通函数的引用

  ```js
    function obj () {
      var a = () => {
        console.log(new.target)
      }
      a()
    }
    new obj() // obj {}
  ```
9. 箭头函数的传参不允许命名重复，但是普通函数支持
  
```js
  var a = (a, a) => {
    console.log('a', a) // Duplicate parameter name not allowed in this context
  }
  var b = function (a, a) {
    console.log('a', a, arguments) // 不会报错
  }
  a(1,2) 
  b(1,2)
```
10. 箭头函数与普通函数相比语法更简洁优雅



#### 箭头函数的注意事项及不适用场景

1. 一条语句返回对象字面量，需要加括号，或者直接写成多条语句的return形式
  
```js
  var a = () => ({ name: 'liqian' })
  var b = () => {
    return {
      name: 'zhangsan'
    }
  }
```
2. 箭头函数在参数和箭头之间不能换行！
3. 箭头函数的解析顺序相对靠前
4. 不适用场景：箭头函数的this意外指向和代码的可读性。


[详解箭头函数和普通函数的区别以及箭头函数的注意事项、不适用场景](https://juejin.im/post/5c76972af265da2dc4538b64)