## 1. active-class是哪个组件的属性?

它是vue-router模块的router-link组件的属性

## 2. 如何定义vue-router的动态路由?

在静态路由名称前面添加冒号，如设置id动态路由参数，为路由对象的path属性设置/:id

## 3. 如何获取传过来的动态参数

在组件中，使用$router对象的params.id，如$route.params.id

## 4. vue-router有哪几种导航的钩子

+ 全局导航钩子，beforeEach,beforeResolve,afterEach，作用是跳转前进行判断拦截；
+ 组件内的钩子；beforeRouteEnter，beforeRouteUpdate，beforeRouteLeave
+ 单独路由独享组件; beforeEnter

他们都具有共同的参数

+ from：当前导航正要离开的路由；
+ to：即将要进入的目标路由对象；
+ next：一定要用这个函数才能到达下一个路由，如果不用就会遭到拦截。