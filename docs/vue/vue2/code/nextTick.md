# nextTick的实现

我们在实际操作data属性值时，大概率会操作很多次，比如说一个数组的push操作，可能是频繁进行的，按照之前的只要data属性发生变化就会触发vue的渲染wacther进行重新渲染更新dom会造成大量的性能消耗，所以vue当中提出批处理的方案，将一批操作data属性的操作异步集中一次性处理，我们知道更新操作调用的实际上是Watcher实例上面的update方法，所以我们在Watcher实例里面对其进行封装改造；

```js
// src/observer/watcher.js
import { nextTick } from "../utils"
class Watcher {
   update() {
       queueWatcher(this) // 暂存
   }
}

let queue = []
let has = {}
let pending = false

function flushShedulerQueue () {
    queue.forEach(wacther => {
        wacther.run()
        wacther.cb()
    })
    queue = []
    has = {}
    pending = false 
}

function queueWatcher(watcher) {
    // 区分不同的watcher采用的是wacther的唯一id判定方法
    let id = watcher.id
    if (has[id] == null) {
        queue.push(watcher)
        has[id] = true

        if (!pending) {
            nextTick(flushShedulerQueue)
            pending = true
        }
    }
}
```
因此引出 `nextTick`的概念，在`nextTick`方法当中实现`批处理`操作，由于更新操作是异步批量进行的当然也在全局提供`Vue.$nextTick()`方法可以使用户在操作完`data`的属性之后拿到`最新的`值

```js
// src/index.js

import { stateMixin } from './state'

stateMixin(Vue)

// src/state.js

export function stateMixin(Vue) {
    Vue.prototype.$nextTick = function (cb) {
       nextTick(cb)
    }
}
```

nextTick方法当中的参数就是要执行的操作（即回调函数），这里存在两种情况

- vue内部的渲染wacther的更新操作
- 用户手动调用Vue.$nextTick()传递归来的回调函数

这里就存在一个顺序问题，vue内部的更新操作一定是要在用户的操作行为之前，这样才能保证用户操作的时候拿到的是最新的数据以及el

这里就需要队列来保证执行顺序

```js
// src/utils.js
let callbacks = []
let pending = false

let timerFunc

function flushCallbacks() {
    while(callbacks.length) {
        const cb = callbacks.pop()
        cb()
    }
    pending = false
}

if (Promise) {
    timerFunc = () => {
        Promise.resolve.then(flushCallbacks)
    }
} else if (MutationObserver) {
    let observer = new MutationObserver(flushCallbacks)
    let textNode = document.createTextNode(1) // 创建一个文本节点
    observer.observe(textNode, { characterData: true }) // 观测文本节点的内容
    timerFunc = () => {
        textNode.textContent = 2 // 文本节点内容改成2
    }
} else if (setImmediate) {
   timerFunc = () => {
        setImmediate(flushCallbacks)
    }
} else {
    setTimeout(flushCallbacks)
}

export function nextTick(cb) {
    callbacks.push(cb)

    if (!pending) {
        timerFunc() // 这个方法是异步方法，做了兼容处理
        pending = true
    }
}
```

## 完整代码如下：

```js
// src/index.js

import { initMixin } from './init'
import  { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vnode/index'
import { initGlobalApi } from './global-api/index'
import { stateMixin } from './state'
function Vue (options) {
  this._init(options) // 入口初始化操作
}

// 原型方法:
// 写一个个插件进行对原型的扩展，方便管理
initMixin(Vue) // 初始化init

lifecycleMixin(Vue) // _update 区别于vue的原始生命周期created等等，这里的声明周期指的是组件的更新等，混合生命周期 -》 渲染

renderMixin(Vue) // _render

stateMixin(Vue)

// 静态方法: Vue.component Vue.directive Vue.extend Vue.mixin

initGlobalApi(Vue)

// 初始化方法
export default Vue
```

```js
// src/state.js
import { observe } from './observer/index.js'
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

function initWatch(vm) {}


export function stateMixin(Vue) {
    Vue.prototype.$nextTick = function (cb) {
       nextTick(cb)
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
        this.id = id++ // wather的唯一标识
        this.deps = [] // wadcther记录有多少dep依赖他
        this.depsId = new Set()
        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
        }
 
        this.get() // 默认会调用get方法
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
        this.getter() // 调用exprOrFn - vm._update(vm_render()) - 渲染页面取值（执行了get方法） - 调用rendder方法， with(vm) {}
        popTarget()
    }
    run() {
        this.get() // 渲染逻辑
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
        watcher.cb()
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

```js
// src/utils.js
// 代理
export function proxy(vm, data, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[data][key]
        },
        set(newValue) {
            vm[data][key] = newValue
        }
    })
}

export function defineProperty(target, key, value) {
    Object.defineProperty(target, key, {
        enumerable: false,
        configurable: false,
        value,
    })
}
export const LIFECYCLE_HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestory',
    'destoryed'
]

// 定义策略模式
const strats = {}

strats.data = function (parentVal, childVal) {
    return childVal // 这里应该有合并策略，暂时先不考虑
}

strats.computed = function () {}

function mergeHook (parentVal, childVal) { // 生命周期合并
    if(childVal) {
        if (parentVal) {
            return parentVal.concat(childVal) // 父亲儿子需要拼接
        } else {
            return [childVal] // 儿子需要转换成数组
        }
    } else {
        return parentVal // 不合并了，采用父亲的
    }
} 

LIFECYCLE_HOOKS.forEach(hook => {
    strats[hook] = mergeHook
})
export function mergeOptions(parent, child){
    // 遍历父亲，可能父亲有， 儿子没有
    const options = {}

    for(let key in parent) { // 父亲和儿子都有在这里就已经处理了
        mergeFiled(key)
    }
    // 儿子有父亲没有

    for(let key in child) { 
        if (!parent.hasOwnProperty(key)){
            mergeFiled(key)
        } 
    }

    function mergeFiled(key) { // 合并字段
        // 根据key不同的策略进行合并
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key])
        } else {
            // todo默认合并，暂时先不处理，临时方案
            options[key] = child[key]
        }
    }
    
    return options
}

let callbacks = []
let pending = false

function flushCallbacks () {
    while(callbacks.length) {
        let cb = callbacks.pop()
        cb()
    }
    // callbacks.forEach(cb => cb()) // 让nextTick中传入的方法依次执行
    pending = false // 标识已经执行完毕
    // callbacks = []
}

let timerFunc
// 兼容处理
if (Promise) {
    timerFunc = () => {
        Promise.resolve().then(flushCallbacks) // 异步处理更新
    }
} else if (MutationObserver) { // 可以监控dom的变化，监控完毕之后异步更新
    let observer = new MutationObserver(flushCallbacks)
    let textNode = document.createTextNode(1) // 创建一个文本节点
    observer.observe(textNode, { characterData: true }) // 观测文本节点的内容
    timerFunc = () => {
        textNode.textContent = 2 // 文本节点内容改成2
    }
} else if (setImmediate) {
    timerFunc = () => {
        setImmediate(flushCallbacks)
    }
} else {
    setTimeout(flushCallbacks)
}


export function nextTick(cb) {
//   console.log('cb', cb)
  // cb 存在两种方式，一种是更新数据时候调用的方法，还有一种是用户直接手动调用vm.$nextTick,默认我们要先更改数据在去执行用户手动添加的cb
  callbacks.push(cb)
  // vue3里面的nextTiock的原理就是使用的promise.then 没有做兼容性处理
  //   Promise.resolve().then()
  // 此处仍然做vue2的处理

  // 因为内部会调用nextTick，用户也会调用，但是异步只需要一次
  if (!pending) {
    timerFunc() // 这个方法是异步方法，做了兼容处理
    pending = true
  }
  
}
```