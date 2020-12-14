# vue2.0都做了哪些优化

1. 在`computed`实例化`watcher`的时候传入选项值`option = { lazy: true }`, 只有当再读取 `computed`，再开始计算，`watcher.value`才会保存值而不是初始化就开始计算值了, 节省性能
2. 