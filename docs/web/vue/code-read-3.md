### new Vue发生了什么?

vue的核心思想其实就是```数据驱动```, 所谓数据驱动，就是视图由数据驱动生成，相比于传统的使用jquery等前端库，直接操作DOM，大大提高了开发效率，代码简洁易维护。

#### _init()

在上一篇文章中，我们介绍了```Vue构造函数```是定义在```src/core/instance/index.js```中的:

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' && !(this instanceof Vue)) {
    // Vue是一个构造函数，应该使用“new”关键字调用
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```
我们剋看到这里调用了```_init()```方法, ```_init```定义在```src/core/instance/init.js```中

```js
Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // a uid
    vm._uid = uid++

    [1]
    let startTag, endTag
    /* istanbul ignore if */
    // 1. 性能追踪
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    
    // 2. 
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    [2]
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
```

```[1]```和```[2]```之间的代码主要是进行了```性能追踪```，参考官网:

![](http://localhost:3000/public/vue-3.png)

performance是2.2.0新增的，主要是为了进行性能跟踪，设置为true 以在浏览器开发工具的性能/时间线中启用对组件初始化，编译，渲染，打补丁的性能追踪，只适用于开发环境和支持```performance.mark``` API的浏览器上

#### 