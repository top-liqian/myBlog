## 1. ['1', '2', '3'].map(parseInt) what & why ?

```js
const arr = ['1', '2', '3'].map(parseInt)

const arr1 = ['10','10','10','10','10'].map(parseInt);

console.log('arr', arr) // [1, NAN, NAN]

console.log('arr1', arr1) // [10, NAN, 2, 3, 4]
```

**解析：**

parseInt(string, radix), 解析一个字符串参数，并返回一个指定基数的整数 

string是要解析的值，如果不是字符串会先执行toString操作，radix的取值范围在于2-36，

注意： 在radix为 undefined，或者radix为 0 或者没有指定的情况下，JavaScript 作如下处理：

+ 如果字符串 string 以"0x"或者"0X"开头, 则基数是16 (16进制).
+ 如果字符串 string 以"0"开头, 基数是8（八进制）或者10（十进制），ECMAScript 5 规定使用10
+ 如果字符串 string 以其它任何值开头，则基数是10 (十进制)

## 2. 输出下面代码的结果

```js
let unary = fn => val => fn(val)
let parse = unary(parseInt)
console.log(['1.1', '2', '0.3'].map(parse))
```

答案：[1,2,0]

```js
// 上述代码相当于以下代码片段，parseInt只接受了一个参数，所以是取整操作
let unary = (fn) => {
  return (val) => {
    return fn(val)
  }
}

let parse = unary(parseInt)

console.log(['1.1', '2', '0.3'].map(parse))

// [1,2,0]
```


