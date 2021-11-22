# Promise

## 概念

直接使用传统的回调函数的方式去完成复杂的异步流程，就会出现函数嵌套的问题，就会陷入回调函数地狱的问题，CommonJs社区提出了Promise的规范，目的在于用一种更合理更强大的解决方案，在ES2015中被标准化，成为语言规范。

所谓Promise，就是一个对象，用来解决异步任务的结束过后成功还是失败，就像是内部对外部的一种承诺待定状态（pending），最后有可能成功（fulfilled），也有可能失败（rejected），无论是成功还是失败，都存在一定的反应即任务自动执行，一旦明确了结果就不能在改变了

## 使用案例 - 封装一个ajax

```js
function ajax (url) {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest()
    xhr.open('GET', url)
    xhr.responseType = 'json'
    xhr.onload = () => {
        if (this.status === 200) {
            resolve(this.response)
        } else {
            reject(new Error(this.statusText))
        }
    }
    xhr.send()
  })
} 
ajax('/api/send').then(res => {
    console.log('res', res)
}, error => {
    console.log('error', error)
})
```

## 常见误区

Promise的本质是使用回调函数定义的异步任务结束之后所需要执行的任务，通过then方法传递回去的

promise在使用的过程中经常会出现回调嵌套的存在，我们正常应该利用promise的链式调用尽可能的保证异步任务的扁平化

## 异常处理

promise的异常处理由两种形式，一种是作为promise的reject函数进行接收，另外一种形式就是利用promise的catch函数进行捕获

```js
var promise = new Promise((resolve, reject) => {
   reject(new Error('error'))
})

promise.then(
    () => {},
    error => { 
        console.log('reject函数进行捕获', error)
    })

promise.catch(error => {
    console.log('catch方法进行捕获', error)}
)
```

两种捕获方式的区别在于：
+ reject处理的异常只针对当前返回的promise的状态进行处理，而不处理回调函数当中新产生的Promise的异常状态
+ catch相当于给全局的Promise注册的错误捕获，catch之所以可以处理当前返回的promise的状态的异常是因为链式调用的特点，由于异常没有被处理才会被catch捕获，如果存在reject函数，优先级高于catch；catch进行整体Promise返回的错误状态的捕获，

Promise存在的异常会一直向后传递，直至被捕获

```js
var promise = new Promise((resolve, reject) => {
   reject(new Error('error'))
})

promise
.then(() => {}, error => { 
    new Promise((resolve, reject) => {
       reject(new Error('第二个异常信息'))
    })
    console.log('error1', error)
})
.catch(error => console.log('error2', error))

// error1 Error: error
// Error: 第二个异常信息
```

## 静态方法

1. Promise.resolve

```js
// 本质在于内部实现了thenable的对象
Promise.resolve({
    then: function(onFullfiled, onRejected) {
      onFullfiled('foo')
    }
})
.then(function (value) {
    console.log(value)
})
```

2. Promise.reject

## Promise 并行执行 

1. Promise.all - 全部的任务都完成，整个Promise也会进入相应的状态
2. Promise.race - 只要有任何一个任务完成，整个Promise也会进入相应的状态

