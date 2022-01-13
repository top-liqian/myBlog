function binarySearch(arr, x) {
    let left = 0
    let right = arr.length - 1
    let mid
    while(left <= right) {
        mid = Math.floor((right + left) / 2)
        if (arr[mid] === x) return mid
        if (arr[mid] > x) right = mid - 1
        else left = mid + 1
    }
    return -1
}