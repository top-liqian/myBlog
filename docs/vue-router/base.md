# 一、前端路由router原理以及表现

核心都是改变url，但是不刷新页面，不向服务器发送请求

## 1. hash路由

`url`的`hash`都是以`#`开头的，当`hash`改变时，页面不会因此刷新，浏览器也不会向服务器发送请求

特点： 兼容性好，但是写法丑陋，对于后端路由来说不区分`#`后面的内容

更改hash以及hashChange事件

```js
location.hash = '#/news'
location.replace('#/detail') // 替换当前的记录
// 浏览器会生成一条记录， 点击回退按钮会回到原始url

// 监听hash的变化，显示不同的内容

window.addEventListener('hashChange', function () {})
```

## 2. history路由

