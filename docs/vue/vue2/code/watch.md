# watch实现原理

vue当中提供了全局的属性监听的钩子对象 watch，本章节将在内部代码当中实现这一部分的代码，我们先来了解一下watch的写法

1. 直接key，value

```js
  watch: { 'a'(newVal, oldval) { } }
```
2. 写成key和数组的形式

```js
watch: {
    'a': [
        function (newVal, oldval) {}
    ]
}
```
3. 监控当前实例上的方法

```js
methods: { fetch() {} }
watch: { 'a': fetch }
```

4. handler的写法

```js
watch: {
    'a.a': {
        handler: function (newVal, oldVal) {
            console.log('1111', newVal, oldVal)
        },
        immediate: true, 
        sync: true
    }
}
```

此处只针对1、2、4的情况做兼容处理，回顾之前的代码在state当中预留了初始化watch的操作，现在将代码进行补全

**watch监听属性的行为本质上来讲就是对监听属性设置用户Watcher的过程，在属性发生变化的同时调用渲染watcher进行重新渲染，并将两次变化的值作为回调函数的参数，执行该回调函数**

vue对用户提供了 `$watch()` 的对外接口，为了兼容此种情况，现将创建`用户Watcher`的行为统一放在 `$watch` 方法当中

```js
// src/state.js
import Watcher from './observer/watcher.js'

function initWatch(vm) {
   let watch = this.$options.watch

   for (let key in watch) {
       const handler = watch[key] // handler可能是数组、字符串、对象、函数
        if (Array.isArray(handler)) {
            handler.forEach(handle => createWatcher(vm, key, handle))
        } else {
            createWatcher(vm, key, handler)
        }
   }
}

function createWatcher(vm, exprOrFn, handler, options = {}) {
    // 兼容watcher的几种写法的取值
    if (typeof handler === 'object') {
        options = handler
        handler = handler.handler
    }
    if (typeof handler === 'string') {
       handler = vm[handler] // 实例的方法作为handler
    }

    return vm.$watch(exprOrFn, handler, options)
}

export function stateMixin(Vue) {
    let vm = this
    Vue.prototype.$watch = function (exprOrFn, handler, options) {
        // user: true 标识这个watcher实例是由用户行为创建的
        let watcher = new Watcher(vm, exprOrFn, handler, { ...options, user: true })

        if (options.immediate) {
            cb() // 如果是immediate 立刻执行
        }
    }
}
```

我们了解到现存代码当中Watcher实例具有两种形式

- 1. 渲染Watcher，目的在于批量执行 vm._update(vm._render()) 进行属性的批量更新操作
- 2. 用户Watcher，监听data的某一个属性， 当其发生的变化的时候触发更新操作，

两种行为本质上都是触发更新操作，即执行Watcher实例的getter方法，但是传递给Watcher类的 exprOrFn 类型却不相同，第一种情况传递给Watcher类的是一个回调函数，第二种情况则是监听的属性的字符串

所以此处需要对Watcher类进行改造，并保存watch前后的新旧值

```js
class Watcher {
    constructor(vm, exprOrFn, handler, options) {
        this.user = options.user
        this.isWatcher = typeof options === 'boolean'

        if (typeof exprOrFn === 'string') {
            this.getter = function () {
                let obj = vm
                const path = exprOrFn.split(',')
                for(let i = 0; i < path.length; i++) {
                    obj = obj[path[i]]
                }
                return obj
            }

        } else {
            this.getter = exprOrFn
        }
        this.value = this.get() // 默认第一次就会执行
    }
    get() {
        pushTarget(this)
        let result = this.getter()
        popTarget()

        return result
    }

    run() {
        // 当数据触发更新操作时，执行update方法即执行当前run方法
        const newVal = this.get()
        const oldVal = this.value
        this.value = newVal
        if (this.user) {
            this.cb.call(this.vm, newVal, oldVal)
        }
    }
}
```

## 完整代码如下：

```js
// src/state.js
import { observe } from './observer/index.js'
import Watcher from './observer/watcher.js'
import { nextTick, proxy } from './utils.js'

export function initState(vm) { // vm.$options
  const opts = vm.$options
    // 初始化具有优先级 按照如下的顺序
    if (opts.props) {
        initProps(vm)
    }
    if (opts.methods) {
        initMethods(vm)
    }
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
}

function initProps(vm) {}

function initMethods(vm) {}

function initData(vm) { // 数据初始化
    let data = vm.$options.data
    
    vm._data = data = typeof data === 'function'
        ? data.call(vm)
        : data
    
    // 当我们去vm上面取属性值时，将属性的取值代理到vm._data
    for(let key in data) {
        proxy(vm, '_data', key)
    }

    // 数据劫持方案 对象Object.defineProperty
    // 数组 单独处理的
    observe(data) // 让这个对象重新定义set和get

}

function initComputed(vm) {}

function initWatch(vm) {
    let watch = vm.$options.watch
    for (let key in watch) {
        const handler = watch[key] // handler可能是数组、字符串、对象、函数

        if(Array.isArray(handler)) { // 数组
            handler.forEach(handle => {
                createWatcher(vm, key, handle)
            })
        } else {
            createWatcher(vm, key, handler) // 字符串、对象、函数
        }
    }
}

function createWatcher(vm, exprOrFn, handler, options = {}) { // options 用来标识是用户
    if (typeof handler === 'object') {
        options = handler
        handler = handler.handler; // 是一个函数
    }

    if (typeof handler === 'string') {
        handler = vm[handler] // 实例的方法作为handler
    }
    // key handler 用户传入的选项
    return vm.$watch(exprOrFn, handler, options)
}


export function stateMixin(Vue) {
    Vue.prototype.$nextTick = function (cb) {
       nextTick(cb)
    }

    Vue.prototype.$watch = function (exprOrFn, cb, options) {
        // console.log('exprOrFn, handler, options', exprOrFn, handler, options)
        // 数据应该依赖这个watcher,数据变化后应该让wacther从新执行
        let vm = this
        let watcher = new Watcher(vm, exprOrFn, cb, {...options, user: true});

        if (options.immediate) {
            cb() // 如果是immediate 立刻执行
        }
    }
}
```

```js
// src/observer/watcher.js
import { nextTick } from "../utils"
import { pushTarget, popTarget } from "./dep"

let id = 0 // 每一个组件只有一个watcher，id用来表示watcher
class Watcher {
    // vm - 实例
    // exprOrFn - vm._update(vm_render())
    // ob, options
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm
        this.exprOrFn = exprOrFn
        this.cb = cb
        this.options = options
        this.user = options.user // 用户watcher
        this.isWatcher = typeof options === 'boolean' // 渲染watcher
        this.id = id++ // wather的唯一标识
        this.deps = [] // wadcther记录有多少dep依赖他
        this.depsId = new Set()
        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
        } else { // 字符串
            this.getter = function() { // exprOrFn 可能是一个是一个字符串a
                // 当去当前实例上取值时，才会去触发依赖收集
                let path = exprOrFn.split('.') // [a, a,a,a]
                let obj = vm

                for (let i = 0; i < path.length; i++) {
                    obj = obj[path[i]]
                }
                return obj
            }
        }
        // 默认会先调用一次get方法，进行取值，将结果保留下来
        this.value = this.get() // 默认会调用get方法
    }
    addDep(dep) {
        let id = dep.id
        // 去重操作
        if (!this.depsId.has(id)) {
            this.deps.push(dep)
            this.depsId.add(id)
            dep.addSub(this)
        }
    }
    get() {
        // Dep.taregt = wacther
        pushTarget(this) // this - 当前wacther的实例
        let result = this.getter() // 调用exprOrFn - vm._update(vm_render()) - 渲染页面取值（执行了get方法） - 调用rendder方法， with(vm) {}
        popTarget()

        return result
    }
    run() {
        let newValue = this.get() // 渲染逻辑
        let oldValue = this.value
        this.value = newValue
        if (this.user) {
            this.cb.call(this.vm, newValue, oldValue)
        }
    }
    update() {
        // 批处理，不是每次都调用get方法，get方法会重新渲染页面
        // 把当前的wacther的get方法缓存起来
        queueWatcher(this) // 暂存
        // this.get() // 重新渲染
    }
}
let queue = [] // 将需要更新的wacther存在一个队列当中，稍后让watcher来执行
let has = {}
let pending = false

function flushShedulerQueue() {
    queue.forEach(watcher => {
        watcher.run()
        watcher.isWatcher && watcher.cb()
    })
    queue = [] // 清空watcher队列为了下次使用
    has = {} // 晴空标识的id
    pending = false
}

function queueWatcher(watcher) {
    // console.log(wacther.id)
    // 相同的wacther就不存储来
    const id = watcher.id // 对watcher进行去重
    if (has[id] == null) {
        queue.push(watcher) // 将wacther存在队列当中
        has[id] = true
        if (!pending) { // 如果还没有清空队列，就不要在开定时器了
            // 等待所有同步代码执行完毕之后在执行
            // setTimeout(() => {
            //     queue.forEach(watcher => watcher.run())
            //     queue = [] // 清空watcher队列为了下次使用
            //     has = {} // 晴空标识的id
            //     pending = false
            // }, 0)
            nextTick(flushShedulerQueue)
            pending = true
        }
    }
}

export default Watcher
```