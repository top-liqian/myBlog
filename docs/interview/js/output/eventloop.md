# 1. 以下输出顺序多少 (setTimeout 与 promise 顺序)

```js
setTimeout(() => console.log(0))
new Promise((resolve) => {
  console.log(1)
  resolve(2)
  console.log(3)
}).then(o => console.log(o))

new Promise(resolve => {
  console.log(4)
  resolve(5)
}).then(o => console.log(o)).then(() => console.log(6))
```

答案：1 3 4 2 5 6 0

# 2. 输出以下代码执行结果

```js
function wait() {
  return new Promise(resolve =>
    setTimeout(resolve, 10 * 1000)
  )
}

async function main() {
  console.time();
  const x = wait();
  const y = wait();
  const z = wait();
  await x;
  await y;
  await z;
  console.timeEnd();
}
main();
```

new Promise(xx)相当于同步任务, 会立即执行

所以: x,y,z 三个任务是几乎同时开始的, 最后的时间依然是10*1000ms (比这稍微大一点点, 超出部分在1x1000ms之内)

