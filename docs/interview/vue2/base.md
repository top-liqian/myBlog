## 1. 介绍一下vue的响应式系统

vue是一个mvvm框架，当数据模型data变化时，页面视图会得到响应更新，其原理对data的getter/setter方法进行拦截（Object.defineProperty/proxy），利用发布订阅者模式，在getter方法中进行订阅，在setter方法中发布通知，让所有订阅者完成响应。vue会为数据模型data的每一个属性都新建一个订阅中心作为发布者，对于监听器watcher，计算属性computed、视图渲染template/render三个角色作为订阅者，对于监听器watcher，会直接订阅观察监听的属性，对于计算属性computed和视图渲染template/render，如果内部执行获取了data的某一个属性值，就会执行这个属性的getter方法，然后自动完成对该属性的订阅，当属性被修改的税后，就会执行这个属性的setter方法，从而完成这个属性的发布通知，通知所有的订阅者进行更新

## 2. 介绍一下vue的生命周期

1. beforeCreate：是new Vue()之后触发的第一个钩子，在当前阶段data，methods、computed以及watch上的数据和方法都不能被访问
2. created：在实例创建完成之后发生，当前阶段已经完成了数据监测，也就是可以使用数据、更改数据，在这里修改的数据不会触发updated函数。可以做一些初始数据的获取，在当前阶段无法与DOM进行交互，如果非要想，可以通过vm.$nextTick来访问DOM
3. beforeMount：发生在挂载之前，在这之前template模版已经导入渲染函数编译；而当前虚拟dom已经创建完成，即将开始渲染。在此时如果你想要修改dom不会触发updated
4. mounted：在挂载完成之后发生，在当前阶段，真实的dom挂载完毕，数据完成双向绑定，可以访问到真实的dom节点，使用$refs属性对dom进行操作
5. beforeUpdate：发生在更新之前，也就是响应式数据更新，虚拟dom重新渲染之前被触发，可以在当前阶段更改数据，不会造成重新渲染
6. updated：发生在更新完成之后，当前阶段组件dom已经更新完成
7. beforeDestory：发生在实例销毁之前，在当前阶段实例完全可以被使用，我们可以在这个时候进行收尾工作，如果清除定时器
8. destroyed：发生在实例销毁之后，这个时候只剩下了dom空壳。组件已被拆解，数据绑定被卸除，监听被移出，子实例也统统被销毁

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

## 12. key属性的作用是什么？

在对节点进行diff的过程中，判断是否为相同节点的一个很重要的条件是key是否相等，如果是相同节点，则会尽可能的复用原有的DOM节点。所以key属性是提供给框架在diff的时候使用的，而非开发者。

## 13. SSR有了解吗？原理是什么？

在客户端请求服务器的时候，服务器到数据库中获取到相关的数据，并且在服务器内部将Vue组件渲染成HTML，并且将数据、HTML一并返回给客户端，这个在服务器将数据和组件转化为HTML的过程，叫做服务端渲染SSR。而当客户端拿到服务器渲染的HTML和数据之后，由于数据已经有了，客户端不需要再一次请求数据，而只需要将数据同步到组件或者Vuex内部即可。除了数据意外，HTML也结构已经有了，客户端在渲染组件的时候，也只需要将HTML的DOM节点映射到Virtual DOM即可，不需要重新创建DOM节点，这个将数据和HTML同步的过程，又叫做客户端激活。使用SSR的好处：

+ 有利于SEO：其实就是有利于爬虫来爬你的页面，因为部分页面爬虫是不支持执行JavaScript的，这种不支持执行JavaScript的爬虫抓取到的非SSR的页面会是一个空的HTML页面，而有了SSR以后，这些爬虫就可以获取到完整的HTML结构的数据，进而收录到搜索引擎中。
+ 白屏时间更短：相对于客户端渲染，服务端渲染在浏览器请求URL之后已经得到了一个带有数据的HTML文本，浏览器只需要解析HTML，直接构建DOM树就可以。而客户端渲染，需要先得到一个空的HTML页面，这个时候页面已经进入白屏，之后还需要经过加载并执行 JavaScript、请求后端服务器获取数据、JavaScript 渲染页面几个过程才可以看到最后的页面。特别是在复杂应用中，由于需要加载 JavaScript 脚本，越是复杂的应用，需要加载的 JavaScript 脚本就越多、越大，这会导致应用的首屏加载时间非常长，进而降低了体验感。