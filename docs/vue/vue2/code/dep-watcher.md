
# 属性依赖更新

前面讲到的vue对data对象的属性都通过`Object.defineProperty`进行了拦截，当渲染过程中使用到了data的属性值就会触发属性的`get/set`方法，将数据渲染到页面上主要是依据 `vm._update(vm._render())`方法，如下：

```js
// src/lifecycle.js
export function mountComponent(vm, el) {
    // 保存起来，将虚拟dom渲染成真实dom的时候会使用到
    vm.$el = el 

    callHook(vm, 'beforeMount' )
    // 调用render方法去渲染el属性
    // 先调用render方法创建虚拟节点，再将虚拟节点渲染到页面上
    vm._update(vm._render())

    callHook(vm, 'mounted' )
}
```

现在我们将渲染的方法封装一下形成一个渲染watcher，为后续自动更新属性值做准备，此处的改造同上述代码没有任何区别，仅仅将wacther进行封装而已，是为了后续更新操作做准备

```js
// src/lifecycle.js
export function mountComponent(vm, el) {
    // 保存起来，将虚拟dom渲染成真实dom的时候会使用到
    vm.$el = el 

    callHook(vm, 'beforeMount' )

    let updateComponent = () => {
        vm._update(vm._render())
    }

    let watcher = new Watcher(vm, updateComponent, () => {
        callHook(vm, 'beforeUpdate' )
    }, true )

    callHook(vm, 'mounted' )
}

// src/observer/watcher.js
let id = 0
class Watcher{
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm // vue实例
        this.exprOrFn = exprOrFn // 操作，此处代指 vm._update(vm._render())
        this.cb = cb // 回调函数
        this.options = options // 配置项
        this.id = id++ // 一个组件只有一个watcher，保持wacther的唯一性
        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
        }
        this.get()
    }
    get() {
        this.getter()
    }
}
```

在index.html当中，当我们修改`data`的属性值，对应的页面上也会相当的发生变化，这就是`vue`的数据观察者-订阅者模式，此处我们就需要为`data`的每一个属性都设置一个`dep`去订阅这个属性，当渲染流程使用到这个属性的时候，就为这个属性设置`渲染watcher`并收集到订阅者的队列当中，然后统一的进行渲染更新；

`订阅者Dep`与`观察者Watcher`之间是`多对多`的关系, 在一个组件当中存在一个`watcher`，`data`对象当中属性的个数决定了这个组件具有多少个`dep`，`dep`当中存放着所有在渲染过程中使用到的属性的`渲染wacther`，在每一个`渲染watcher`当中也存放了对应需要更改的`dep`，即`实现双向记忆`，让wacther记住dep的同时让dep也记住watcher，这样当多次调用属性的get方法时，我们可以通过去重的方式来保证wacther只对应一个dep

```js
// src/observer/watcher.js
import { pushTarget, popTarget } from "./dep"
let id = 0
class Watcher{
    constructor(vm, exprOrFn, cb, options) {
        this.vm = vm // vue实例
        this.exprOrFn = exprOrFn // 操作，此处代指 vm._update(vm._render())
        this.cb = cb // 回调函数
        this.options = options // 配置项
        this.id = id++ // 一个组件只有一个watcher，保持wacther的唯一性
        this.deps = [] // watcher记录有多少个dep依赖他
        this.depIds = new Set() // 去重操作
        if (typeof exprOrFn === 'function') {
            this.getter = exprOrFn
        }
        this.get()
    }
    get() { 
        pushTarget(this)
        this.getter()
        popTarget()
    },
    addDep(dep) {
        let id = dep.id
        if (!this.depIds.has(id)) {
            this.deps.push(dep)
            this.depIds.add(id)
            dep.addSub(this) // 双向添加，为后续操作做准备
        } 
    }
    update() {
        this.get()
    }
}

export default Watcher

// src/observer/dep.js
let id = 0;
class Dep{
    constructor() {
        this.subs = []
        this.id = id++
    }
    depend() {
        // 我们希望 watcher 可以存放dep, 实现双向记忆，让wacther记住dep的同时让dep也记住watcher
        Dep.target.addSub(this)
    },
    addSub(wacther) { // 添加wacther操作
        this.subs.push(wacther)
    }
    notify() { // 执行更新操作
        this.subs.forEach(wacther => wacther.update())
    }
}

Dep.target = null

export function pushTarget(watcher) {
  Dep.target = watcher
}

export function popTarget(watcher) {
  Dep.target = null
}

export default Dep

// src/observer/index.js

import Dep from './dep.js'

// 完全递归
function defineReactive (data, key, value) {
    let childDep = observer(value)

    let dep = new Dep()

    Object.defineProperty(data, key, {
        get() { // 依赖收集
            if(Dep.target) { // 让这个属性记住这个wacther
                dep.depend()
                // ...
            }
            return value
        },
        set(newValue) { // 依赖更新
            if (newValue === value) return
            observe(newValue) // 如果用户设置成对象，继续进行监测
            value = newValue 
            dep.notify() // 依赖更新
        }
    })
}
```


## 对数组的更新处理流程

1. 当我们获取arr值的时候，我们会调用get方法，我们希望让当前数组记住这个渲染watcher
2. 所以我们给所有的对象都增加一个dep实例
```js
class Observer {
    constructor(value) {
        this.dep = new Dep() 
        // ...
    }
}
```
3. 当页面对arr进行取值的时候，我们就让数组的dep记住这个watcher

```js
function defineReactive (data, key, value) {
    // 获取到数组 / 对象对应的dep
    let childDep = observe(value)

    let dep = new Dep() // 每一个属性都有一个dep

    Object.defineProperty(data, key, {
        get() { // 依赖收集
            if(Dep.target) { // 让这个 属性记住这个wacther
                dep.depend()
                if(childDep) {
                    // 默认给数组增加了一个dep属性，当对数组这个对象进行取值的时候
                    childDep.dep.depend() // 数组存起来了渲染过程
                }
            }
            return value
        },
        set(newValue) { // 依赖更新
            // ...
        }
    })
}
```

4. 当我们更新数组的时候即调用数组的push，shift等方法时，找到数组对应的watcher来进行更新

```js
// src/observer/array.js
methods.forEach(method => {
    arrayMethods[method] = function (...args) { // this 就是observe里面的value
        // ...
        let ob = this.__ob__ // 此处ob就是observer实例，observer实例上面具有dep实例
        // ...
        if (inserted) ob.observeArray(inserted) // 给数组新增的值也要尽心监测
        ob.dep.notify() // 通知数组更新
        return result
    }
})
```

## 面试题：

1. vue数据更新对于对象 a: { name: '123' } 的监听，在没有给a.name赋值的情况下，为什么可以监听成功？

答案： 因为如果是对象数据类型，在渲染的过程中会做一个处理JSON.stringfy()操作，会将对象转换成字符串，转换的过程当中触发了get操作，所以会触发相应的wacther

2. 通过更新数组索引和长度会造成data的更新吗？

答案： 不会

## 整体全部代码

```js
// src/observer/watcher.js
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
    update() {
        this.get() // 重新渲染
    }
}

export default Watcher
```

```js
// src/observer/index.js

import { arrayMethods } from './array.js'
import { defineProperty } from '../utils.js'
import Dep from './dep.js'
class Observer {
    constructor(value) {
        this.dep = new Dep() // data = {}, 给这个对象增加了一个dep， value = []
        // 判断一个对象是否被观测过， 看他有没有__ob__属性, 主要是将Observer赋值给this，在array里面可以使用observeArray
        defineProperty(value, '__ob__', this)
        if (Array.isArray(value)) {
           // 重写数组的方法 push pop shifit unshift splice sort reverse
           // 进行函数劫持、切片编程
           value.__proto__ = arrayMethods
           // 观测数组倆面的对象
           this.observeArray(value) // 数组中普通类型是不做观测的
        } else {
            // 使用defineProperty重新定义属性
            this.walk(value)
        }
    }
    observeArray(value) {
        value.forEach(val => observe(val))
    }
    walk(data) {
        let keys = Object.keys(data) // 获取对象的key
        keys.forEach(key => {
            defineReactive(data, key, data[key]) // Vue.util.defineReactive
        })
    }
}

// 完全递归
function defineReactive (data, key, value) {
    // 获取到数组对应的dep
    let childDep = observe(value)

    let dep = new Dep() // 每一个属性都有一个dep

    // 当页面取值时，说明这个值用来渲染了，将这watcher和这个属性对应起来
    Object.defineProperty(data, key, {
        get() { // 依赖收集
            // console.log('取值')
            if(Dep.target) { // 让这个 属性记住这个wacther
                dep.depend()
                if(typeof childDep === 'object') {
                    // 默认给数组增加了一个dep属性，当对数组这个对象进行取值的时候
                    childDep.dep.depend() // 数组存起来了渲染过程
                }
            }
            return value
        },
        set(newValue) { // 依赖更新
            // 为什么不能直接data[key] = newValue
            // 答： 陷入死循环了，直接设置data[key]会再一次触发set函数
            // console.log('设置值', newValue)
            if (newValue === value) return
            observe(newValue) // 如果用户设置成对象，继续进行监测
            value = newValue 
            dep.notify()
        }
    })
}


export function observe (data) {
    // typeof null === 'object'
    if (typeof data !== 'object' || data === null)  return

    if (data.__ob__) return data // 好处： 防止被重复观测
      
    return new Observer(data)
}
```

```js
// src/observer/dep.js
let id = 0
class Dep {
    constructor() {
        this.subs = []
        this.id = id++
    }
    depend() {
        // 我们希望 watcher 可以存放dep
        Dep.target.addDep(this) // 实现双向记忆，让wacther记住dep的同时让dep也记住watcher
        // this.subs.push(Dep.target) // dep存放wacther
    }
    addSub(wacther) {
        this.subs.push(wacther)
    }
    notify() {
        this.subs.forEach(wacther => wacther.update())
    }
}

Dep.target = null

export function pushTarget(wacther) {
    Dep.target = wacther // 保留wacther
}

export function popTarget() {
    Dep.target = null // 将变量删除掉
}
export default Dep

```

```js
// 拿到数组原来的方法
let oldArrayProtoMethods = Array.prototype

// 继承一下 arrayMethods.__proto__ = oldArrayProtoMethods

export let arrayMethods = Object.create(oldArrayProtoMethods)

let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

methods.forEach(method => {
    arrayMethods[method] = function (...args) { // this 就是observe里面的value
        // 当调用数组我们劫持后的这7个方法，页面应该更新
        // 我们要知道数组怎么更新，对应哪个dep
        const result = oldArrayProtoMethods[method].apply(this, args)
        let inserted
        let ob = this.__ob__
        switch(method) {
            case 'push':
            case 'unshift': // 这两个方法追加的内容有可能是对象，应该被再次劫持
                inserted = args
                break;
            case 'splice': // vue.$set原理 
                inserted = args.slice(2) // arr.splice(0, 1, {a: 1})
            default: 
                break;
        }
        if (inserted) ob.observeArray(inserted) // 给数组新增的值也要尽心监测
        ob.dep.notify() // 通知数组更新
        return result
    }
})
```