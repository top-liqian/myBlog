# code-合并声明周期

合并生命周期本质上是实现vue内部的合并策略，我们在书写vue的过程当中，常常使用全局的静态方法`Vue.mixin`来定义额外的公用的生命周期，data，methods等vue的配置信息，在声明vue实例的过程当中也会定义生命周期，data，methods等配置，这就涉及到相同的配置进行合并的问题；

1. 首先在全局注册静态方法`Vue.mixin`，将全局的`options` 与 实例化获得的`options`作为参数赋值给`mergeOptions`方法
2. 在`mergeOptions`方法当中，由于`options`是一个对象，所以需要遍历每一项进行合并，抽离公共的合并方法`mergeField`, 并在`mergeField`方法当中将合并好的配置项赋值给this.options并返回
3. 对于不用的配置项来讲，合并策略并不相同，所以我们在外部分别定义相关的合并策略方法，此处定义变量`strats`来存储这些策略方法，例如`data`则写成`strats.data = function (parentVal, childVal) {}`，所以针对生命周期则是定义`mergeHook`方法进行合并，规则如下：
   
```js
childVal 
    ? parentVal
        ? parentVal.concat(childVal)
        : [childVal]
    : parentVal
```

4. 在vue的源码当中获得配置项通常是通过`Vue.$options`进行获取，所以最终的合并的结果也是要赋值给`Vue.$options`；
5. 生命周期的运行是存在一定的顺序的，所以需要在适当的时机执行`callHook`方法

```js
export function callHook(vm, hook) {
    const handlers = vm.$options[hook]; // vm.$options.created

    if (handlers) {
        for(let i = 0; i< handlers.length; i++) {
            handlers[i].call(vm)
        }
    }
}
```

实操代码如下：首先对于Vue当中存在的静态方法统一在初始化阶段进行注册

```js
/* src/index.js */
import { initMixin } from './init'
import  { lifecycleMixin } from './lifecycle'
import { renderMixin } from './vnode/index'
import { initGlobalApi } from './global-api/index'
function Vue (options) {
  this._init(options) // 入口初始化操作
}

// 原型方法:
initMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

// 静态方法: Vue.component Vue.directive Vue.extend Vue.mixin
initGlobalApi(Vue)

// 初始化方法
export default Vue
```

下面完成`initGlobalApi`内部实现的代码

```js
/* src/global-api/index.js */

import { mergeOptions } from '../utils'
export function initGlobalApi(Vue) {
    Vue.options = {}

    Vue.mixin = function (mixin) {
       this.options = mergeOptions(this.options, mixin)
    }

}
```

抽离公共的合并策略方法到utils里面

```js
// src/utils.js

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

export const mergeOptions = function (parent, child) {
    const options = {}

    // 父亲有，儿子没有
    for(let key in parent) {
        mergeField(key)
    }
   
    // 儿子有，父亲没有
    for(let key in child) {
        if (!parent.hasOwnProperty(key)) {
            mergeField(key)
        }
    }
    
    function mergeField(key) {
       this.options = strats[key](parent[key], child[key])
    }
    
    
    return options
}
```

此时我们就完成了生命周期的合并，由于生命周期是具有执行顺序的，需要在适当的时机进行注入执行

```js
// src/init.js

import { initState } from './state'
import { compileToFunctions } from './complier/index.js'
import { mountComponent, callHook } from './lifecycle'
import { mergeOptions } from './utils'
export function initMixin(Vue) {
    // 初始化方法
    Vue.prototype._init = function (options) {
      const vm = this
      // 1. 先进行合并，不能直接使用Vue.options，使用父子组件的vm.constructor指向不同
      vm.$options = mergeOptions(vm.constructor.options, options) // 需要将用户自定义的options和全局的options做合并
      
      // 2. 执行生命周期beforeCreate
      callHook(vm, 'beforeCreate' )

      // 3. 初始化状态
      initState(vm) 

      // 4. 执行生命周期 created
      callHook(vm, 'created' )
      
      if(vm.$options.el) {
         vm.$mount(vm.$options.el) 
      }
    }

    Vue.prototype.$mount = function (el) {
        // ...
        mountComponent(vm, el)
    }
}

// 

```

```js
// src/lifecycle.js

import { patch } from './vnode/patch'

export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        patch(vm.$el, vnode)
    }
}

export function mountComponent(vm, el) {
   
    callHook(vm, 'beforeMount' )
    vm._update(vm._render())
    callHook(vm, 'mounted' )
    
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook]; // vm.$options.created

    if (handlers) {
        for(let i = 0; i< handlers.length; i++) {
            handlers[i].call(vm)
        }
    }
}
```