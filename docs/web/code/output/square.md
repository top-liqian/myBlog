# 字节：输出以下代码运行结果，为什么？如果希望每隔 1s 输出一个结果，应该如何改造？注意不可改动 square 方法

```js
const list = [1, 2, 3]
const square = num => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(num * num)
    }, 1000)
  })
}

function test() {
  list.forEach(async x=> {
    const res = await square(x)
    console.log(res)
  })
}

test()
```

**输出结果：**`1,4,9 同时输出`

**原因**：使用 promise 或 async 函数作为 forEach() 等类似方法的 callback 参数并不会等待异步的执行，而是变成了while循环的同步操作

**解决办法**：一个简单的 for 循环；for…of / for…in 循环；利用 promise 的链式调用

**解法一：for 循环**

```js
async function test() {
  for (let x = 0; x < list.length; x++) {
    const res = await square(x)
    console.log(res)
  }
}
```

**解法二：for…in / for…of**

```js
async function test() {
  for(let x in list) {
    const res = await square(list[x])
    console.log(res)
  }
}

async function test() {
  for(let x of list) {
    const res = await square(x)
    console.log(res)
  }
}
```

**解法三：利用 promise 的链式调用**

```js
function test() {
    let promise = Promise.resolve()
    list.forEach(x=> {
        promise = promise.then(() => square(x)).then(console.log)
    })
}
test()
```