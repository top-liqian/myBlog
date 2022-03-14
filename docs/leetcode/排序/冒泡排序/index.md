# 冒泡排序

冒泡排序原理在于挨个排序，从数组的第一个元素跟所有的元素相比，如果大就沉到数组尾，直到所有的数组都是有序的

时间复杂度： 最好的情况下：O(n) 最快的情况下：O(n * n)

空间复杂度: O(1)

是否稳定： 稳定

## 解法一、常规操作，双重循环

```js
var arr = [3,4,5,6,1,9,2]

function bubbleSort(arr) {
    console.time('改进后冒泡排序耗时');
    for(let i = 0; i < arr.length; i++) {
        for(let j = i + 1; j < arr.length; j++) {
            if(arr[i] > arr[j]) {
                let mid = arr[j]
                arr[j] = arr[i]
                arr[i] = mid
            }
        }
    }
    console.timeEnd('改进后冒泡排序耗时');
    return arr
}

var bubbleSortArray = bubbleSort(arr)
```

## 解法二、设置一标志性变量pos

pos用于记录每趟排序中最后一次进行交换的位置。由于pos位置之后的记录均已交换到位,故在进行下一趟排序时只要扫描到pos位置即可

```js
var arr = [3,4,5,6,1,9,2]

function bubbleSort2(arr) {
    console.time('改进后冒泡排序耗时');
    var i = arr.length-1;  //初始时,最后位置保持不变
    while ( i> 0) {
        var pos= 0; //每趟开始时,无记录交换
        for (var j= 0; j< i; j++)
            if (arr[j]> arr[j+1]) {
                pos= j; //记录交换的位置
                var tmp = arr[j]; arr[j]=arr[j+1];arr[j+1]=tmp;
            }
        i= pos; //为下一趟排序作准备
     }
     console.timeEnd('改进后冒泡排序耗时');
     return arr;
}

console.log('bubbleSort2', bubbleSort2(arr))
```

## 解法三、正向反向两次查找

传统冒泡排序中每一趟排序操作只能找到一个最大值或最小值,我们考虑利用在每趟排序中进行正向和反向两遍冒泡的方法一次可以得到两个最终值(最大者和最小者) , 从而使排序趟数几乎减少了一半

```js
var arr = [3,4,5,6,1,9,2]

function bubbleSort3(arr) {
    console.time('2.改进后冒泡排序耗时');
    var low = 0
    var high = arr.length-1;

    while (low < high) {
        for (var j= low; j< high; j++) { // 正向找到最大的
            if (arr[j]> arr[j+1]) {
                pos= j; //记录交换的位置
                var tmp = arr[j]; arr[j]=arr[j+1];arr[j+1]=tmp;
            }
            --high
        }
        for(var j = high; j > low; --j) { // 反向找最小的
            if (arr[j] < arr[j-1]) {
                pos= j; //记录交换的位置
                var tmp = arr[j]; arr[j]=arr[j-1];arr[j-1]=tmp;
            }
            ++low
        }
     }
     console.timeEnd('2.改进后冒泡排序耗时');
     return arr;
}

console.log('bubbleSort3', bubbleSort3(arr))
```