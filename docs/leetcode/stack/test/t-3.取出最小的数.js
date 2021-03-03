function findSmallSeq (A = [], k) {
    let stack = []

    for (let i = 0; i < A.length; i++) {
        while(
            stack.length && 
            stack[stack.length - 1] > A[i] && 
            (stack.length + (A.length - 1 - i)) >= k
        ) {
            stack.pop()
        }
        stack.push(A[i])
    }
    return stack
}

const nums = [9, 2, 4, 5, 1, 2, 3, 0]

const k = 3

const result = findSmallSeq(nums, k)

console.log('result', result)