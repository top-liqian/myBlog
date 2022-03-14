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