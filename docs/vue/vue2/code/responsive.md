# 手写vue响应式数据源码

创建一个vue的实例一般采用声明一个Vue实例并且传入相关的配置项的方式：

```html
<!-- public/index.html -->
<script src="/dist/umd/vue.js"></script>
<script>
    let vm = new Vue({
        el: '#app',
        data() {
            return {
                arr: [1,2,3],
                school: { name: 'liqian'},
                b: [1, 2, 3, { a: 1 }]
            }
        }
    })
</script>      
```

所以我们需要声明一个Vue的构造函数，创建构造函数的方具有两种，封装`class类`或者`创建构造函数`，由于vue是一个大集合，并不可能所有的代码都放在一个文件当中，而是需要按需按功能将其代码块进行封装抽离，所以在此处采用`创建构造函数`，并利用`闭包函数`以及`原型链`的特性对Vue进行封装。

所以在`src`文件夹下面创建`index.js`文件作为整个项目的`入口文件`，并在构造函数当中进行初始化操作，在此处将一个个对原型的拓展方法都进行整体的抽离所以创建。

```js
/* src/index.js */
import { initMixin } from './init'

function Vue (options) {
  this._init(options) // 入口初始化操作
}

// 写一个个插件进行对原型的扩展，方便管理
initMixin(Vue) // 初始化init
```

从源码层次可以看出，`initMixin`方法主要的功能如下：

1. 创建vue实例的过程当中会传进来很多配置信息，将这些配置信息赋值给`vm.$options`，使其可以直接通过`vm.$options`调用
2. 初始化状态，在这个函数当中对vue的很多状态都进行了处理，按照props，methods，data，computed， watch的顺序进行处理，vue的核心特性对与响应式的处理就在此处开始

所以在`src`文件夹下面创建`init.js`文件主要用来书写初始化方法

```js
/* src/init.js */

export function initMixin(Vue) {
    // 初始化方法
    Vue.prototype._init = function (options) {
        const vm = this
        vm.$options = options
        // vue 核心特性 响应式数据原理

        // 初始化状态（将数据做一个初始化的劫持，当我改变数据时应该更新视图）
        // vue组件中有很多的状态 data props watch computed
        initState(vm)
    }
}
```

并创建`state.js`文件抽离`initState`方法

```js
/* src/state.js */
import { observe } from './observer/index.js'

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
    observe(data)
}
```

此处重点介绍initData方法，也就是数据响应式处理，在`initData`函数当中首先判断data的类型，如果传进来的data是一个function，那么就在当前的作用域下面执行整个函数，那么返回的对象就在当前作用域下面，如果返回的data是一个对象，那就直接使用，并做一层代理，可以在`index.html`里面使用`vm.属性名`进行调用即当我们去vm上面取属性值时，将属性的取值代理到vm._data，并对数据进行劫持，在此处将数据劫持封装成一个单独的函数进行调用，即observe，并将data作为参数传入

创建observer文件夹用来集中存放响应式的相关代码，并创建index.js文件用来书写observe函数，此时书写响应式的相关源码

1. 首先我们看`observe`函数，主要实现三个功能，第一：将特殊情况进行返回，`基本数据类型`和`null`是不需要监听，所以直接返回即可； 第二：判断对象是否被监听过，通过对象上定义的特殊的属性`__ob__`，如果被监测过就返回不进行检测，好处在于防止被重复观测； 第三对于引用类型的值需要单独进行处理，所以将处理响应式的代码用class类进行封装，这样只要返回实例即可；
2. 封装的`Observer类`的constructor函数主要实现了第一： 定义要监听对象的`__ob__`属性； 第二：分类型对数组以及对象进行分别的监听；
3. 抽离对象函数`defineReactive`；
4. 抽离数组的监听函数`arrayMethods`；
   
```js
/* observer/index.js */
import { arrayMethods } from './array.js'

class Observer {
    constructor(value) {
        // 判断一个对象是否被观测过， 看他有没有__ob__属性, 主要是将Observer赋值给this，在array里面可以使用observeArray
        defineProperty(value, '__ob__', this)
        // 此处监听分为两种情况，一种是对数组的监听一种是对对象的监听
        // 由于我们平时的编程习惯并不会对数组下标进行直接操作，如果将数组下标每一个值都设置数据拦截监听，那无疑是对资源的浪费
        // 重写数组的方法 push pop shifit unshift splice sort reverse
        // 进行函数劫持、切片编程
        if (Array.isArray(value)) {
            // 确定arrayMethods方法的this值
            value.__proto__ = arrayMethods
            // 观测数组倆面的对象
            this.observeArray(value)
        } else {
            // 使用defineProperty重新定义属性
            this.walk(value)
        }
    }
    observeArray(data) {
       data.forEach(val => arrayMethods(val))
    }
    walk(data) {
        const keys = Object.keys(data)
        keys.forEach(key => defineReactive(data, key, data[key]))
    }
}

function defineReactive(data, key, value) {
    // 反复进行监听
    observe(value)
    Object.defineProperty(data, key, {
        get() {
           return value
        },
        set(newValue) {
            if (newValue === value) return
            // 如果重新复制的值是一个对象，要对这个对象也设置监听
            observe(newValue)
            value = newValue
        } 
    })
}

export function observe(data) {
    if (data === null || typeof data !== 'object') return

    if (data.__ob__) return data  // 好处： 防止被重复观测

    return new Observer(data)
}
```

下面我们重点来写抽离数组的监听函数`arrayMethods`

```js
/* observer/array.js */

let oldArrayProtoMethods = Array.prototype

export let arrayMethods = Object.create(oldArrayProtoMethods)

const methods = [
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
        console.log('数组被调用了')
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
        return result
    } 
})
```