### 剖析Vuex的本质

先抛出一个问题，Vue项目当中是怎么引入Vuex的？

1. 安装Vuex，并在vue项目当中引入 `import Vuex from 'vuex'`
2. 先`var store = new Vuex.Store({...})`,再把`store`作为参数的一个属性值，`new Vue({store})`
3. 通过`Vue.use(Vuex)`使得每个组件都可以拥有`store`实例

**从这个引入过程我们可以发现什么？**

我们是通过`new Vuex.Store({...})`获得一个实例对象`store`，也就是说我们引进的`Vuex`中有一个store的类作为`Vuex`对象的一个属性。

因为是通过`import`进行引入的，所以`vuex`实质上是导出一个对象的引用

所以初步可以假设为

```js
  class Store {

  }

  let Vuex = {
    Store
  }

  export default Vuex
```

我们还使用了`Vue.use()`,而`Vue.use`的一个原则就是执行对象的`install`这个方法

所以，我们可以再一步 假设`Vuex`还有`install`这个方法。

```js
  class Store {

  }

  let install = function () {}

  let Vuex = {
    Store,
    install,
  }

  export default Vuex
```

截止到现在，我们已经将Vuex的大致框架书写出来了，我们现在接着往下走

### 分析Vue.use

Vue.use(plugin)

**(1) 参数**

plugin： object ｜ Function

**(2) 用法**

安装Vue.js插件。如果插件是一个对象，必须提供install方法。如果插件是一个函数，它会被作为install方法。调用install方法时，会将Vue作为参数传入。install方法被同一个插件多次调用时，插件也只会被安装一次。

**(3) 作用**

注册插件，此时只需要调用install方法并将Vue作为参数传入即可。但在细节上有两部分逻辑要处理：

1、插件的类型，可以是install方法，也可以是一个包含install方法的对象。

2、插件只能被安装一次，保证插件列表中不能有重复的插件。

**(4) 实现**

```js
  Vue.use = function (plugin) {
    const installedPlugins = (this._installedPlugins || this._installedPlugins = [])

    if (installedPlugins.indexof(plugin) > -1) {
      return this
    }

    const args = toArray(arguments, 1)
    args.unshift(this)

    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function'){
      plugin.apply(null, plugin, args)
    }

    installedPlugins.push(plugin);
    return this
  }
```
+ 1、在Vue.js上新增了use方法，并接收一个参数plugin。
+ 2、首先判断插件是不是已经别注册过，如果被注册过，则直接终止方法执行，此时只需要使用indexOf方法即可。
+ 3、toArray方法我们在就是将类数组转成真正的数组。使用toArray方法得到arguments。除了第一个参数之外，剩余的所有参数将得到的列表赋值给args，然后将Vue添加到args列表的最前面。这样做的目的是保证install方法被执行时第一个参数是Vue，其余参数是注册插件时传入的参数。
+ 4、由于plugin参数支持对象和函数类型，所以通过判断plugin.install和plugin哪个是函数，即可知用户使用哪种方式祖册的插件，然后执行用户编写的插件并将args作为参数传入。
+ 5、最后，将插件添加到installedPlugins中，保证相同的插件不会反复被注册。(~~让我想起了曾经面试官问我为什么插件不会被重新加载！！！哭唧唧，现在总算明白了)

### 完善install方法



```js
  let install = function (Vue) {
    Vue.mixin({
      beforeCreate () {
        if (this.$options && this.$options.store) { // 根组件
          this.$store = this.$options.store
        } else {
          this.$store = this.$parent && this.$parent.$store // 子组件
        }
      }
    })
  }
```

