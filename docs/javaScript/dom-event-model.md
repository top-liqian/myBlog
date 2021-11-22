# 

## 事件流

当一个事件发生时，捕获过程跟冒泡过程总是先后发生，跟是否监听毫无关联

捕获是计算机的处理事件的逻辑，而冒泡是人类处理事件的逻辑

## 事件处理程序

1. 注册事件 addEventListener 用法

```js
// 两种写法
target.addEventListener(type, listener, useCapture = false)

target.addEventListener(type, listener, options = {
    once: true, // 只执行一次
    passive: true, // 承诺事件监听不会调用preventDefault,这有助于性能
    useCapture: true, // true - 捕获，false - 冒泡
})
```
2. 删除绑定的事件 removeEventListener

```js
target.removeEventListener(type, listener, useCapture = false)

target.removeEventListener(type, listener, options)
```

在移除的过程当中listener不能是一个匿名函数，否则移除不了, 只能提出来进行书写，如下：

```js
const handle = e => {
    console.log('e', e)
}

target.addEventListener(type, handle, useCapture = false)

target.removeEventListener(type, handle, useCapture = false)
```
**addEventListener第三个参数不填写默认是冒泡事件**

**react与vue的绑定onclick事件默认是冒泡事件，捕获事件使用onClickCapture**

## 常见的面试题目

1. 什么是事件传播？
2. 什么是事件冒泡
3. 什么是事件捕获
4. event.stopPropagation() 和 event.stopImmediate