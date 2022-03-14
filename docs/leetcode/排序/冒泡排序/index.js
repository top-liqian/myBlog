var arr = [3,4,5,6,1,9,2]

function bubbleSort(arr) {
    console.time('冒泡排序耗时');
    for(let i = 0; i < arr.length; i++) {
        for(let j = i + 1; j < arr.length; j++) {
            if(arr[i] > arr[j]) {
                let mid = arr[j]
                arr[j] = arr[i]
                arr[i] = mid
            }
        }
    }
    console.timeEnd('冒泡排序耗时');
    return arr
}

var bubbleSortArray = bubbleSort(arr)

console.log('bubbleSortArray', bubbleSortArray)

function bubbleSort2(arr) {
    console.time('1.改进后冒泡排序耗时');
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
     console.timeEnd('1.改进后冒泡排序耗时');
     return arr;
}

console.log('bubbleSort2', bubbleSort2(arr))

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