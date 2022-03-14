# 选择排序

选择排序(Selection-sort)是一种简单直观的排序算法。它的工作原理：首先在未排序序列中找到最小（大）元素，存放到排序序列的起始位置，然后，再从剩余未排序元素中继续寻找最小（大）元素，然后放到已排序序列的末尾。以此类推，直到所有元素均排序完毕。

时间复杂度： O(n * n)

空间复杂度: O(1)

是否稳定： 稳定，不管怎么样一直都是O(n * n)

## 具体实现

```js
var arr = [3,4,5,6,1,9,2]

function selectionSort (arr) {
    var len = arr.length
    var minIndex, temp
    console.time('选择排序耗时')

    for(var i = 0; i < len - 1; i++) {
        minIndex = i
        for(var j = i + 1; j < len; j++) {
            if(arr[j] < arr[minIndex]) {
                minIndex = j
            }
        }
        temp = arr[i]
        arr[i] = arr[minIndex]
        arr[minIndex] = temp
    }
    console.timeEnd('选择排序耗时')
    return arr
}

console.log(selectionSort(arr))
```