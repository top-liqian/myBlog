## 1. computed 什么时候初始化

在`vue`创建实例的时候会初始化各种选项，其中initState方法中会初始化`props、methods、data、computed、以及watch`，其中`initComputed`就是初始化`computed`

## 2. computed 的缓存是怎么做的

通过控制`watcher`实例对象的`dirty`属性做到的，`dirty`属性默认值是`false`，`computed`将 `lazy` 赋值给 `dirty`，就是给一个初始值，让`watcher`控制缓存的任务开始，如果 `computed` 依赖的数据变化，`dirty` 会变成`true`，调用 `evalute` 重新计算，然后更新缓存值 `watcher.value`。

如果computed的数据`A`调用了data的数据`B`，即`A依赖B`，那么就会`B`会收集到`A`的`watcher`，当`B`发生改变了，就会通知`A`进行更新，即调用 `A-watcher.update`，当通知 `computed` 更新的时候，就只是把 `dirty` 设置为 `true`，从而读取 `comptued` 时，便会调用 `evalute` 重新计算。

## 3. computed是怎么可以直接使用实例访问到的

在defineComputed函数当中通过`Object.defineProperty(target, key, sharedPropertyDefinition)`将computed的所有属性都定义在了vm上面，所以可以直接使用实例访问到的

## 4. computed是怎样进行计算的

computed在初始化watcher实例时，并没有计算值，`watcher.value = undefined`，只有调用了`computed`的属性时，控制`watcher`实例对象的`dirty`设置为true才会发生计算。在计算的过程中，computed-watcher.evaluted 被调用，进而 computed-watcher.get 被调用，Dep.target 被设置为 computed-watcher，旧值 页面 watcher 被缓存起来。computed 计算会读取 data，此时 data 就收集到 computed-watcher，同时 computed-watcher 也会保存到 data 的依赖收集器 dep。computed 计算完毕，释放Dep.target，并且Dep.target 恢复上一个watcher（页面watcher），返回value的更新值

## 5. computed 的 月老身份的来源

1. 页面更新，读取 computed 的时候，Dep.target 会设置为 页面 watcher。

2. computed 被读取，createComputedGetter 包装的函数触发，第一次会进行计算

3. computed-watcher.evaluted 被调用，进而 computed-watcher.get 被调用，Dep.target 被设置为 computed-watcher，旧值 页面 watcher 被缓存起来。

computed 计算会读取 data，此时 data 就收集到 computed-watcher

同时 computed-watcher 也会保存到 data 的依赖收集器 dep（用于下一步）。

computed 计算完毕，释放Dep.target，并且Dep.target 恢复上一个watcher（页面watcher）

4. 手动 watcher.depend， 让 data 再收集一次 Dep.target，于是 data 又收集到 恢复了的页面watcher

从而使得页面A与数据C关联上


## 5. computed与watch的区别

computed本质上就是一个watcher，与watch最大的区别就在于computed会将计算属性进行缓存，第一次不计算，只有被调用时才会计算

