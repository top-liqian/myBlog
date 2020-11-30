### let & const

#### es5实现let源码

```js
  (function () {
    var a = 1
  })()
```

#### es5实现const源码

```js
  function _const (key, value) {
    Object.defineProperty(window, key, { value, writable: false })
  }
  // 测试

  _const(obj, 1)

  console.log(obj)
```