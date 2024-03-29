## 1. 介绍一下vue的响应式系统

vue内部借鉴了mvvm框架的思想，当数据模型data变化时，页面视图会得到响应更新，其原理对data的getter/setter方法进行拦截（Object.defineProperty/proxy），利用发布订阅者模式，在getter方法中进行订阅，在setter方法中发布通知，让所有订阅者完成响应。vue会为数据模型data的每一个属性都新建一个订阅中心作为发布者，对于监听器watcher，计算属性computed、视图渲染template/render三个角色作为订阅者，对于监听器watcher，会直接订阅观察监听的属性，对于计算属性computed和视图渲染template/render，如果内部执行获取了data的某一个属性值，就会执行这个属性的getter方法，然后自动完成对该属性的订阅，当属性被修改的税后，就会执行这个属性的setter方法，从而完成这个属性的发布通知，通知所有的订阅者进行更新

源码对应；在initData函数当中初始化用户传入的数据，内部通过new Observer来对属性进行观测，调用walk方法对对象进行处理，本质是调用了 defineReactive 来循环对象属性定义响应式变化

## 2. 介绍一下vue的生命周期

1. beforeCreate：是new Vue()之后触发的第一个钩子，在当前阶段data，methods、computed以及watch上的数据和方法都不能被访问
2. created：在实例创建完成之后发生，当前阶段已经完成了数据监测，也就是可以使用数据、更改数据，在这里修改的数据不会触发updated函数。可以做一些初始数据的获取，在当前阶段无法与DOM进行交互，如果非要想，可以通过vm.$nextTick来访问DOM
3. beforeMount：发生在挂载之前，在这之前template模版已经导入渲染函数编译；而当前虚拟dom已经创建完成，即将开始渲染。在此时如果你想要修改dom不会触发updated
4. mounted：在挂载完成之后发生，在当前阶段，真实的dom挂载完毕，数据完成双向绑定，可以访问到真实的dom节点，使用$refs属性对dom进行操作
5. beforeUpdate：发生在更新之前，也就是响应式数据更新，虚拟dom重新渲染之前被触发，可以在当前阶段更改数据，不会造成重新渲染
6. updated：发生在更新完成之后，当前阶段组件dom已经更新完成
7. beforeDestory：发生在实例销毁之前，在当前阶段实例完全可以被使用，我们可以在这个时候进行收尾工作，如果清除定时器
8. destroyed：发生在实例销毁之后，这个时候只剩下了dom空壳。组件已被拆解，数据绑定被卸除，监听被移出，子实例也统统被销毁

如果使用组件的keep-alive功能时，增加两个周期：

+ activated在keep-alive组件激活时调用；

+ deactivated在keep-alive组件停用时调用。

`<keep-alive>`包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。`<keep-alive>`是一个抽象组件，它自身不会渲染一个DOM元素，也不会出现在父组件链中。

## 3、为什么组件的data必须是一个函数

一个组件可能在很多地方使用，也就是会创建很多个实例，如果data是一个对象的话，对象是引用类型，一个实例修改了data会影响到其他实例，所以data必须使用函数，形成自己的作用域，为每一个实例创建一个属于自己的data，使其同一个组件的不同实例互不影响。

## 4、组件之间是怎么通信的

1. 父子组件通信

## 5、vue事件绑定原理

每一个vue实例都是一个`event bus`，当子组件被创建的时候，父组件将事件传递给子组件，子组件初始化的时候会有一个`$on`方法将事件注册到内部，在需要的时候使用`$emit`触发函数，而对于原生`native`事件，使用`addEventListener`绑定在真实的`dom`元素上面

## 6. slot是什么？有什么作用？原理是什么？

slot又名插槽，是vue的内容分发机制，组件内部的模版引擎使用slot元素作为承载分发内容的出口。插槽作为子组件的一个模版元素标签，而这一个标签时候显示，以及怎么显示是由父组件进行决定的。slot又分为三类，默认插槽，具名插槽以及作用域插槽

+ 默认插槽：当slot没有指定name属性值得时候一个默认显示插槽，一个组件只有一个匿名插槽
+ 具名插槽：带有具体名字的插槽，也就是一个带有name属性值的slot，一个组件可以出现多个具名插槽
+ 作用域插槽：默认插槽、具名插槽的一个变体，可以是匿名插槽，也可以是具名插槽，该插槽的不同点是在子组件渲染作用域插槽时，可以将子组件内部的数据传递给父组件，让父组件根据子组件的传递过来的数据决定如何渲染插槽

实现原理：当子组件cm实例化之后，获取到父组件传入的slot标签的内容，存档在vm.$slot当中，默认插槽是vm.$slot.default，具名插槽为vm.$slot.xxx，xxx是插槽名称，当组件执行渲染函数时，遇到slot标签，使用$slot中的内容进行替换，此时可以为插槽传递数据，若存在数据，则可以称该插槽为作用域插槽

## 7. vue模版渲染的原理是什么？

vue中的模板template无法被浏览器解析并渲染，因为这不属于浏览器的标准，不是正确的HTML语法，所有需要将template转化成一个JavaScript函数，这样浏览器就可以执行这一个函数并渲染出对应的HTML元素，就可以让视图跑起来了，这一个转化的过程，就成为模板编译。模板编译又分三个阶段，解析parse，优化optimize，生成generate，最终生成可执行函数render。

+ parse阶段：使用大量的正则表达式对template字符串进行解析，将标签、指令、属性等转化为抽象语法树AST。

+ optimize阶段：遍历AST，找到其中的一些静态节点并进行标记，方便在页面重渲染的时候进行diff比较时，直接跳过这一些静态节点，优化runtime的性能。

+ generate阶段：将最终的AST转化为render函数字符串。

## 8. template预编译是什么？

对于 Vue 组件来说，模板编译只会在组件实例化的时候编译一次，生成渲染函数之后在也不会进行编译。因此，编译对组件的 runtime 是一种性能损耗。而模板编译的目的仅仅是将template转化为render function，这个过程，正好可以在项目构建的过程中完成，这样可以让实际组件在 runtime 时直接跳过模板渲染，进而提升性能，这个在项目构建的编译template的过程，就是预编译。

## 9. template和jsx的有什么分别？

对于 runtime 来说，只需要保证组件存在 render 函数即可，而我们有了预编译之后，我们只需要保证构建过程中生成 render 函数就可以。在 webpack 中，我们使用vue-loader编译.vue文件，内部依赖的vue-template-compiler模块，在 webpack 构建过程中，将template预编译成 render 函数。与 react 类似，在添加了jsx的语法糖解析器babel-plugin-transform-vue-jsx之后，就可以直接手写render函数。所以，template和jsx的都是render的一种表现形式，不同的是：JSX相对于template而言，具有更高的灵活性，在复杂的组件中，更具有优势，而 template 虽然显得有些呆滞。但是 template 在代码结构上更符合视图与逻辑分离的习惯，更简单、更直观、更好维护。

## 10. 说一下什么是Virtual DOM？

Virtual DOM 是 DOM 节点在 JavaScript 中的一种抽象数据结构，之所以需要虚拟DOM，是因为浏览器中操作DOM的代价比较昂贵，频繁操作DOM会产生性能问题。虚拟DOM的作用是在每一次响应式数据发生变化引起页面重渲染时，Vue对比更新前后的虚拟DOM，匹配找出尽可能少的需要更新的真实DOM，从而达到提升性能的目的。

## 11. 介绍一下vue的diff算法？

在新老虚拟dom对比时

+ 首先，对比节点本身，判断是否为同一节点，如果不为同一节点，则删除该节点重新创建节点进行替换
+ 如果为相同节点，进行patchVnode，判断如何对该节点的子节点进行处理，先判断一方有子节点一方没有子节点的情况(如果新的children没有子节点，将旧的子节点移除)
+ 比较如果都有子节点，则进行updateChildren，判断如何对这些新老节点的子节点进行操作（diff核心）。
+ 匹配时，找到相同的子节点，递归比较子节点

在diff中，只对同层的子节点进行比较，放弃跨级的节点比较，使得时间复杂从O(n^3)降低值O(n)，也就是说，只有当新旧children都为多个子节点时才需要用核心的Diff算法进行同层级比较。

## 12. v-for当中的key属性的作用是什么？

在对节点进行diff的过程中，判断是否为相同节点的一个很重要的条件是key是否相等，如果是相同节点，则会尽可能的复用原有的DOM节点。所以key属性是提供给框架在diff的时候使用的，而非开发者。

## 13. SSR有了解吗？原理是什么？

在客户端请求服务器的时候，服务器到数据库中获取到相关的数据，并且在服务器内部将Vue组件渲染成HTML，并且将数据、HTML一并返回给客户端，这个在服务器将数据和组件转化为HTML的过程，叫做服务端渲染SSR。而当客户端拿到服务器渲染的HTML和数据之后，由于数据已经有了，客户端不需要再一次请求数据，而只需要将数据同步到组件或者Vuex内部即可。除了数据意外，HTML也结构已经有了，客户端在渲染组件的时候，也只需要将HTML的DOM节点映射到Virtual DOM即可，不需要重新创建DOM节点，这个将数据和HTML同步的过程，又叫做客户端激活。使用SSR的好处：

+ 有利于SEO：其实就是有利于爬虫来爬你的页面，因为部分页面爬虫是不支持执行JavaScript的，这种不支持执行JavaScript的爬虫抓取到的非SSR的页面会是一个空的HTML页面，而有了SSR以后，这些爬虫就可以获取到完整的HTML结构的数据，进而收录到搜索引擎中。
+ 白屏时间更短：相对于客户端渲染，服务端渲染在浏览器请求URL之后已经得到了一个带有数据的HTML文本，浏览器只需要解析HTML，直接构建DOM树就可以。而客户端渲染，需要先得到一个空的HTML页面，这个时候页面已经进入白屏，之后还需要经过加载并执行 JavaScript、请求后端服务器获取数据、JavaScript 渲染页面几个过程才可以看到最后的页面。特别是在复杂应用中，由于需要加载 JavaScript 脚本，越是复杂的应用，需要加载的 JavaScript 脚本就越多、越大，这会导致应用的首屏加载时间非常长，进而降低了体验感。

## 14. v-model 是做什么的？（待补充）

v-model是一条指令，实现数据双向绑定

数据双向绑定的原理：

vue.js使用es5提供的属性特性功能，结合发布者-订阅者模式，通过Object.defineProperty()为各个属性定义get,set特性方法，在数据发送改变时给订阅者发布消息，触发相应的监听回调。

## 15. vue.js中标签如何绑定事件

v-on/@语法糖

## 16. 在vue中说说你知道的自定义指令

自定义指令两种：
1. 一种`全局自定义指令`，vue.js对象提供了`directive`方法，可以用来自定义指令，directive方法接收两个参数，一个是`指令名称`，另一个是`函数`；
2. 第二种是`局部自定义指令`，通过组件的`directives`属性定义。

指令定义对象可以提供如下几个钩子函数:
1. bind：只调用一次，指令第一次绑定到元素时调用 bind(el, bindings, vnode, oldVode)
2. inserted：被绑定元素插入父节点时调用 inserted(el)
3. update：所在组件的 VNode 更新时调用,组件更新前状态 update(el)
4. componentUpdated：所在组件的 VNode 更新时调用,组件更新后的状态
5. unbind：只调用一次，指令与元素解绑时调用。

## 17. vue.js中常用的4种指令

+ v-if判断对象是否隐藏；

+ v-for循环渲染；

+ v-bind绑定一个属性（可以简写为：）

+ v-model实现数据双向绑定（支持.trim .number修饰符）
  
其他存在的一些指令

+ v-once 渲染一次（可以用作优化，但是使用的频率很少）
  
+ v-html 将字符串转换成dom插入到标签当中（可能会导致xss攻击问题，并且覆盖子元素）
  
+ v-show不满足是dom隐藏（不可以使用在template标签上面）
+ v-on 可以简写成@给元素绑定事件（常用修饰符.stop .prevent .self .once .passive）

## 18. v-show指令和v-if指令的区别

它们都是条件渲染指令，不同的是:

+ v-show的值无论是true或false元素都会存在于html页面中，只是切换的当前的dom的显示和隐藏
+ v-if的值为true时，元素才会存在于html页面中。否则不会渲染当前指令所在节点的dom元素

源码对应为：

```js
with(this) { 
   return (true) ? _c('div', _l((3), function (i) { return _c('span', [_v("hello")]) }), 0) : _e() 
}
```

## 19. 在vue.js中如何实现路由嵌套

路由嵌套会将其他组件渲染到该组件内，而不是使整个页面跳转到router-view定义组件渲染的位置，要进行页面跳转，要将页面渲染到根组件内。首先实例化根组件，在根组件中定义组件渲染容器，然后，挂载路由，当切换路由时，将会切换整个页面。

## 20. 什么情况下会产生片段实例?

## 21. 什么是数据的丢失?

如果在初始化时没有定义数据，之后更新的数据是无法触发页面渲染更新的，这部分数据是丢失的数据，这种现象叫数据的丢失。

## 22. vue是mvvm框架吗

不是，内部只是借鉴了mvvm的思想，vue的核心思想在于数据变化视图会更新，视图更新数据会被影响，而mvvm是不能跳过数据直接去更新视图，vue里面的$ref可以直接去更新dom不严格符合mvvm的思想，所以vue不是严格的mvvm框架

## 23. 在初始化状态的时候按照什么样的顺序

props -> methods -> data -> computed -> watch

## 24. 在数据监听时为什么要单独处理数组类型

因为我们开发过程当中很少对数组索引进行操作，为了性能考虑不对数组的索引进行拦截，而是通过函数拦截的方式重写来数组的方法

vue将data当中的数组，进行了原型链的重写，指向了自己定义的数组原型方法，这样档调用数组的api的时候，可以通知依赖更新，本质还是调用数组的原来的方法，但是可以在其内部手动调用更新方法 ob.dep.notify来实现手动更新，如果数组内部的元素依然是一个引用类型的属性，那将会对他再次监控


## 25. vue渲染流程

1. 初始化数据
2. 将模版进行编译生成ast
3. 将ast转换成render函数
4. 执行render函数创建虚拟dom
5. 生成真是的dom
6. 渲染在页面上

## 26. 请说一下响应式数据的理解？

+ Vue内部会递归的去循环vue中的data属性,会给每个属性都增加getter和setter，当属性值变化时会更新视图
+ 重写了数组中的方法，当调用数组方法时会触发更新,也会对数组中的数据(对象类型)进行了监控
  
**通过以上两点可以发现Vue中的缺陷:**

+ 对象默认只监控自带的属性，新增的属性响应式不生效 (层级过深，性能差)
+ 数组通过索引进行修改 或者 修改数组的长度，响应式不生效
  
为了解决以上问题，vue提供来额外的API：

```js
vm.$set(vm.arr,0,100); // 修改数组内部使用的是splice方法 
vm.$set(vm.address,'number','6-301'); // 新增属性通过内部会将属性定义成响应式数据        
vm.$delete(vm.arr,0);  // 删除索引，属性
```

为了解决以上的问题，Vue3.0使用Proxy来进行解决

```js
let obj = {
    name: { name: 'liqian' },
    arr: ['1', '2', '3']
}
let handler = {
    get (target, key) {
        if(typeof target[key] === 'object' && target[key] !== null) {
            return new Proxy(target[key], handler)
        }
        return Reflect.get(target, key)
    },
    set(target, key, value) {
        let oldValue = target[key]
        if (!oldValue) {
            console.log('新增属性')
        } else if(oldValue !== value) {
            console.log('修改属性')
        }
        return Reflect.set(target, key, value)
    }
}
let proxy = new Proxy(obj, handler)
```

## 27. 什么是库，什么是框架

+ 库是将代码集合成一个产品，我们调用库中的方法来实现自己的功能
+ 框架是为了解决一类问题而开发的产品，框架是我们在指定的位置编写好代码，框架帮我们调用

## 28. MVC和MVVM的区别？

+ 传统的MVC指的是，用户操作会请求服务器端的路由，路由会调用对应的控制器来处理，控制器会获取数据，将结果返回给前端，页面重新渲染

+  MVVM：传统的前端会将数据手动渲染在页面上，MVVM模式不需要用户手动手机DOM元素，而是直接将数据绑定到viewModel上面，会自动渲染数据到页面当中，试图变化会通知viewModel层更新数据，viewModel就是我们MVVM模式当中的桥梁，Vue并不是严格意义上面的MVVM模型，严格的MVVM模式是不允许view和model直接通信的，只能通过viewModel来进行通信

## 29. vue模版当中的优先级？

render > template > el

## 30. v-for和v-if连用的问题

v-for会比v-if的优先级高一些，如果连用的话会把v-if给每一个元素都添加一下，会造成性能问题（使用计算属性优化）

```js
with(this) { 
  return _l((3), function (i) { return (false) ? _c('div', [_v("hello")]) : _e() }) 
}
```

## 31. 实现一个v-lazy自定义插件

## 32. vue为什么采用异步渲染？

vue的数据更新是采用组件级别的更新策略，如果同一个组件内部的数据多个变化，如果不采用异步更新的策略，那么每次更新数据，视图都会跟着一起更新，消耗性能，vue会讲同一个组件的watcher的更新过滤在一起，在合适的时机一起更新

主要操作是：dep.notify()通知watcher进行数据更新，然后依次调用watcher的update方法，

通过queueWatcher方法将多个属性依赖的相同的watcher整合成一个（每一个watcher都有一个id，相同id的整合在一起，主要是预防多次更新）

最后通过nextTick方法异步清空watcher队列

vue会在数据更新了之后，再去异步更新视图，提高了性能。

## watch、computed、methods的原理？