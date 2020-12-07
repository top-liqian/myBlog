# 实现一个方法，拆解URL参数中queryString

入参格式参考：

```js
  const url = 'http://sample.com/?a=1&b=2&c=xx&d=2#hash';
```

出参格式参考：

```js
  const result = { a: '1', b: '2', c: 'xx', d: '' };
  // 拆解URL参数中queryString，返回一个 key - value 形式的 object
```

代码如下：

```js
  const url = 'http://sample.com/?a=1&b=2&c=xx&d=2#hash';
  // 方法1: 通过URLSearchParams方法拆解
  function queryString(string) {
    const url = new URL(string)
    const search = new URLSearchParams(url.search)
    const obj = {}
    search.forEach((v, k) => { obj[k] = v })
    return obj
  }

  const result = queryString(url)

  console.log(result)
  
  // 方法1: 通过正则方法拆解
  function queryString1(string) {
    const url = new URL(string)
    const obj = {}
    url.search.replace(/([^?&=]+)=([^&]+)/g, (_, k, v) => {
      console.log(_, k, v) 
      obj[k] = v 
    })
    return obj
  }

  const result1 = queryString1(url)

  console.log(result)
```