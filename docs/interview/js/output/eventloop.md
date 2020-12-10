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

# 2. 


