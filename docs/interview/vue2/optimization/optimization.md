# vue2.0都做了哪些优化

1. 在`computed`实例化`watcher`的时候传入选项值`option = { lazy: true }`, 只有当再读取 `computed`，再开始计算，`watcher.value`才会保存值而不是初始化就开始计算值了, 节省性能



# 你知道 Vue.js 完整版和运行时版本的区别吗？

完整版：包含编译器和运行时的版本，需要编译器将template模板字符串编译成JavaScript渲染函数的代码，从而实现将html字符串插入到页面的html中实现渲染
运行版：除去编译器之外的所有代码