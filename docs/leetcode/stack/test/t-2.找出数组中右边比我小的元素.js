function findRightSmall(arr) {
    let IndexArr = []

    let stack = []

    for (let i = 0; i < arr.length; i++) {
        while(stack.length && arr[stack[stack.length - 1]] > arr[i]) {
            IndexArr[stack[stack.length - 1]] = i
            stack.pop()
        }
        stack.push(i)
    }

    while(stack.length) {
        IndexArr[stack[stack.length - 1]] = -1
        stack.pop()
    }
    return IndexArr
}

const arr = [1,2,4,9,4,0,5]

const result = findRightSmall(arr)

console.log('result', result)