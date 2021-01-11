## 1. vue3.0较vue2.x有什么改变

主要从源码、性能以及一些新的API这三个方面进行来优化。

从源码管理方面

首先引入monorepo进行源码管理使得模块拆分更细化，职责划分更明确，模块之间的依赖关系也更加明确，开发人员也更容易阅读、理解和更改所有模块源码，提高代码的可维护性。

并且相较于flow，vue3.0采用typescript进行类型分析，在编码期间可以更加精准的类型检查，避免一些因类型问题导致的错误的产生。

其次从性能方面

+ 引入 tree-shaking 的技术并且移除一些冷门的 feature来优化静态资源的体积，减少打包体积。
+ 采用es6语法的Proxy API替代Object.defineProperty来解决Object.defineProperty存在的问题， 即检测对象属性的添加和删除以及对多嵌套对象的监听造成的性能消耗问题；
+ 耗时相对较多的 patch 阶段的优化在于通过编译阶段对静态模板的分析，编译生成了 Block tree，将 vnode 更新性能由与模版整体大小相关提升为与动态内容的数量相关

最后提供Composition API优化逻辑组织以及逻辑复用，使开发过程中数据来源清晰可见。

## 2. proxy对比于Object.defineProperty的优势

1. Object.defineProperty只能监听到对象属性的读取和写入，而Proxy除读写外还可以监听对象中属性的删除，对对象当中方法的调用等等
2. Object.defineProperty监视数组的变化，基本要依靠重写数组方法，proxy可以直接监视数组的变化

## 3. 对象支持什么类型的键？

1. 字符串
2. ES6新增支持Symbol类型

## 4. 如何创建两个相同的Symbol值

使用Symbol内置的静态方法for，即`Symbol.for('foo') === Symbol.for('foo') => true`，Symbol.for这个方法维护了一个全局的注册表，为字符串和Symbol提供了一个对应关系。需要注意的是，在内部维护的是字符串和Symbol的关系，那也就是说如参数不是字符串，会转换为字符串。

## 5. app对象内部具有mount方法，但是在createApp函数当中进行重写的原因是什么？

主要是因为`vue.js`不仅仅是为web平台进行服务，它的目标是支持`跨平台渲染`，而`createApp`函数内部的`app.mount(rootContainer, isHydrate)`方法提供了一个标准化的可跨平台的组件渲染流程，即先创建`vnode`，然后渲染`vnode`。其中`rootContainer`可以是一个dom对象（web平台）也可以是其他的类型值（weex和小程序），所以这里面的代码的执行逻辑都是跟平台无关的，因此我们需要在`createApp`外部补充`mount`方法来完善在web平台下面的渲染逻辑。这么做的目的是既能让用户在使用 API 时可以更加灵活，也兼容了 Vue.js 2.x 的写法，比如 app.mount 的第一个参数就同时支持选择器字符串和 DOM 对象两种类型。

## 6. 为什么一定要设计 vnode 这样的数据结构呢？

+ 抽象，引入 `vnode`，可以把渲染过程抽象化，从而使得组件的抽象能力也得到提升
+ 跨平台，因为 `patch vnode` 的过程不同平台可以有自己的实现，基于 `vnode` 再做`服务端渲染`、`Weex 平台`、`小程序平台`的渲染都变得容易了很多。

## 7. vnode 的性能和手动操作原生 DOM的性能哪一个好

不一定，主要取决于`体量`，首先这种基于`vnode`实现的`mvvm`框架，在每次进行`render to vnode`的过程中，渲染组件会有一定的`javascript`耗时，特别是大组件，比如一个 1000 * 10 的 Table 组件，render to vnode 的过程会遍历 1000 * 10 次去创建内部 cell vnode，整个耗时就会变得比较长，加上`patch vnode`的过程中也会有一定的耗时，当我们去更新组件的时候就会出现卡顿的感觉，虽然 `diff` 算法在减少 `DOM`操作方面足够优秀，但最终还是免不了操作 `DOM`，所以说性能并不是 `vnode` 的优势。

## 8. 为什么要新增Composition API，它能解决什么问题？ 

Vue2.0中，随着功能的增加，组件变得越来越复杂，越来越难维护，而难以维护的根本原因是Vue的API设计迫使开发者使用watch，computed，methods选项组织代码，而不是实际的业务逻辑。另外Vue2.0缺少一种较为简洁的低成本的机制来完成逻辑复用，虽然可以minxis完成逻辑复用，但是当mixin变多的时候，会使得难以找到对应的data、computed或者method来源于哪个mixin，使得类型推断难以进行。所以Composition API的出现，主要是也是为了解决Option API带来的问题，第一个是代码组织问题，Compostion API可以让开发者根据业务逻辑组织自己的代码，让代码具备更好的可读性和可扩展性，也就是说当下一个开发者接触这一段不是他自己写的代码时，他可以更好的利用代码的组织反推出实际的业务逻辑，或者根据业务逻辑更好的理解代码。第二个是实现代码的逻辑提取与复用，当然mixin也可以实现逻辑提取与复用，但是像前面所说的，多个mixin作用在同一个组件时，很难看出property是来源于哪个mixin，来源不清楚，另外，多个mixin的property存在变量命名冲突的风险。而Composition API刚好解决了这两个问题。

## 9. 都说Composition API与React Hook很像，说说区别

从React Hook的实现角度看，React Hook是根据useState调用的顺序来确定下一次重渲染时的state是来源于哪个useState，所以出现了以下限制

+ 不能在循环、条件、嵌套函数中调用Hook
+ 必须确保总是在你的React函数的顶层调用Hook
+ useEffect、useMemo等函数必须手动确定依赖关系

而Composition API是基于Vue的响应式系统实现的，与React Hook的相比

+ 声明在setup函数内，一次组件实例化只调用一次setup，而React Hook每次重渲染都需要调用Hook，使得React的GC比Vue更有压力，性能也相对于Vue来说也较慢
+ Compositon API的调用不需要顾虑调用顺序，也可以在循环、条件、嵌套函数中使用
+ 响应式系统自动实现了依赖收集，进而组件的部分的性能优化由Vue内部自己完成，而React Hook需要手动传入依赖，而且必须必须保证依赖的顺序，让useEffect、useMemo等函数正确的捕获依赖变量，否则会由于依赖不正确使得组件性能下降。

虽然Compositon API看起来比React Hook好用，但是其设计思想也是借鉴React Hook的。