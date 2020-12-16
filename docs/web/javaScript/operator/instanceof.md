### 一文带你深入剖析 instanceof 运算符

#### 一. instanceof

1. 引入instanceof

```A instanceof B```的主要用途

+ 用于检测构造函数```B```的 ```prototype``` 属性是否出现在```A```实例对象的原型链上。
+ ```instanceof``` 用于判断引用类型属于哪个已知构造函数的方法

```js

class A {}
var a = new A()

console.log(a instanceof A) // true
console.log(a instanceof Object) // true

```
1. instanceof在继承中承担的角色

```instanceof``` 可以在继承关系中用来判断一个实例是否属于它的父类型

```js
function B () {}
function C () {}

B.prototype = C.prototype
var b = new B ()

console.log(b instanceof B) // true
console.log(b instanceof C) // true
console.log(b instanceof Object) // true

```

####  二、instanceof 的内部实现机制

instanceof 的内部实现机制是：通过判断对象的原型链上是否能找到对象的 ```prototype```，来确定 ```instanceof``` 返回值

```js
  function instance_of (L, R) {
    let prototype = R.prototype
    L = L.__proto__
    while(true) {
      if (L === null) {
        return false
      }

      if (L === prototype) {
        return true
      }

      L = L.__proto__
    }
  }
```
#### 三、instanceof 与 Symbol.hasInstance

Symbol.hasInstance 用于判断某对象是否为某构造器的实例。因此你可以用它自定义 instanceof 操作符在某个类上的行为。

你可实现一个自定义的instanceof 行为，例如：

```js
class MyArray {  
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}
console.log([] instanceof MyArray); // true
```

#### 四、instanceof 与 isPrototypeOf

```A.prototype.isPrototypeOf(B)```：用于检测某一个对象是否在另外一对象的原型链上，针对的对象是```A.prototype```

```B instanceof A```: 针对的是```A```，检测构造函数```A```的 ```prototype``` 属性是否出现在``B```实例对象的原型链上



```js
function Foo() {}

function Bar() {}

function Baz() {}

Bar.prototype = Object.create(Foo.prototype);
Baz.prototype = Object.create(Bar.prototype);

var baz = new Baz();

console.log(Baz.prototype.isPrototypeOf(baz)); // true
console.log(baz instanceof Baz) // true

console.log(Bar.prototype.isPrototypeOf(baz)); // true
console.log(baz instanceof Bar) // true

console.log(Foo.prototype.isPrototypeOf(baz)); // true
console.log(baz instanceof Foo) // true

console.log(Object.prototype.isPrototypeOf(baz)); // true
console.log(baz instanceof Object) // true

```


```js
  Object instanceof Function // true

  Function instanceof Object // true

```




出处 https://juejin.im/post/5d6e5c3d6fb9a06ae0721f5f