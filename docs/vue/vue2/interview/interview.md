# vue相关的面试题

1. vue实例方法中的this，使用的时候可以二次更改它的指向吗？ 

> 不能，因为在初始化initMethods的时候就已经进行了this的绑定
> 
> vm[key] = typeof methods[key] !== 'function' ? noop : bind(methods[key], vm)
> 
> bind方法多次绑定只能第一次绑定的this生效，所以不能更改它的指向

2. Object.freezn()的原理

> 将属性的conficonfigurable设置成false，这样在进行响应式属性处理的时候就会跳过
> 源码语句：if(property && property.conficonfigurable === false) return

3. vue如何调试

> 1. 在命令行当中输入 vue inspect > config.js 可以得到入口文件 
> 2. 入口文件是vue.runtime.esm.js
> 3. 想调试哪里就调试哪里就可以了