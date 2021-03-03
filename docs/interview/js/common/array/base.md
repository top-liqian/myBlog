## 1. 数组里面有10万个数据，取第一个元素和第10万个元素的时间相差多少?

几乎没有时间相差，数组是在计算机内存空间中分配一段连续的内存空间，并会记录下索引为`0`的内存地址。

当需要访问索引为`10万`的数据，计算机会进行计算，先找到索引为`0`的内存地址，在此基础上 `+ 10万` 即可以拿到索引为`10万`的数据

时间复杂度为常数级别： `O(1)`，这点计算时间对于内存来讲相当于没有，所以几乎没有时间相差

## 2. 数组的神奇变化

```js
var arr1 = "john".split('');
var arr2 = arr1.reverse();
var arr3 = "jones".split('');
arr2.push(arr3);
console.log("array 1: length=" + arr1.length + " last=" + arr1.slice(-1));
console.log("array 2: length=" + arr2.length + " last=" + arr2.slice(-1));
``` 
答案：

array 1: length=5 last=[j,o,n,e,s] 

array 2: length=5 last=[j,o,n,e,s]

数组的`reverse`方法会影响原数组，普通的`arr2 = arr1`是浅复制，所以`arr1`和`arr2`的值是一样的