# 手动实现Array.prototype.splice

## Array.prototype.splice语法

Array.prototype.splice(start, deleteCount, item1, item2, ...)

1. start: 操作开始的位置

+ start > 0 & start < array.length && start = start
+ start > array.length && start = array.length
+ start < 0 && Math.abs(start) < array.length && start = array.length - Math.abs(start)
+ Math.abs(start) > length && start = 0

2. deleteCount: 要移除的数组元素的个数

+ deleteCount = 0 || deleteCount < 0, 不删除任何元素，如果存在item1则新增一个item
+ deleteCount被省略 || deleteCount >= array.length - start， 删除start 以及start之后的所有的item
+ deleteCount < array.length - start, 对应删除deleteCount个元素

3. item1, item2, ...: 要新增加的元素


## 源码

```js
```