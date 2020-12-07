#### 1. vue当中有哪些优化手段值得参考

<details>
<summary>展开</summary>

1. 初始化事件时，通过设置标志位_hasHookEvent来判断是否通过哈希表的方法来查找是否有钩子函数，这样做可以减少不必要的开销，优化性能
2. 
</details>

#### 2. vue的初始化函数使用Function实现的类，为什么不用ES6的class

<details>
<summary>展开</summary>

我们从源码当中可以看出来，里面有很多xxxMixin方法的调用，都是将Vue实例当作参数传递进去，并且他们的作用都是在Vue的原型对象上面添加一些方法
Vue 按功能把这些扩展分散到多个模块中去实现，而不是在一个模块里实现所有，这种方式是用 Class 难以实现的。这么做的好处是非常方便代码的维护和管理，这种编程技巧也非常值得我们去学习。
</details>