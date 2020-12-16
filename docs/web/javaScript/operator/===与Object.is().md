# === 与 Object.is

一、 严格相等运算符

既判断类型又要判断值，双向相等的情况下才会返回`true`，否则返回`false`

严格相等运算符不会执行类型转换

对对象执行严格相等运算时，对象仅和自身严格相等

```js
  const obj = { name: 'zhangsan' }
  const other = { name: 'zhangsan' }
  obj === obj // true
  obj === other // false
```

处理`NaN`值时，严格相等运算符 `NaN === NaN // false`

处理`+0`和`-0`时，严格相等运算符 `+0 === -0 // true`

`严格相等运算符使用的是严格相等比较算法`

二、 Object.is()

既判断类型又要判断值，双向相等的情况下才会返回`true`，否则返回`false`

严格相等运算符不会执行类型转换

对对象执行严格相等运算时，对象仅和自身严格相等

与`严格相等运算符`主要区别在以下两点：

1. 处理`NaN`值时，`Object.is(NaN, NaN) // true`
2. 处理`+0`和`-0`时，`Object(+0, -0) // false`

`Object.is()使用的是相同值比较算法`
