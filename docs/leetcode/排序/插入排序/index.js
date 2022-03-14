var a = [3,4,5,6,1,9,2]

function insertSort(arr) {
    if(Object.prototype.toString.call(arr).slice(8, -1) === 'Array') {
        console.time('插入排序耗时：');
        for(var i = 1; i < arr.length; i++) {
            var key = arr[i]
            var j = i - 1
            while(j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j]
                j--
            }
            arr[j + 1] = key
        }
        console.timeEnd('插入排序耗时：');
        return arr
    } else {
        new Error('array is not an Array!')
    }
}

console.log(insertSort(a))


function insertSort2(arr) {
    for(var i = 1; i < arr.length; i++) {
        var key = arr[i]
        var j = i - 1
        while(j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]
            j--
        }
        arr[j + 1] = key
    }
    return arr
}

console.log('2', insertSort2(a))