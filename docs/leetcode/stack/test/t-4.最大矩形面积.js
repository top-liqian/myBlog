function MaxRectangularArea(A = []) {
    let stack = []
    let maxArea
    let maxIndex

    for(let i = 0; i < A.length; i++) {
        if (stack.length === 0) {
            stack.push(A[i])
            maxIndex = A[i]
            maxArea = stack.length * 
        } else {

        }
    }
}

const arr = [8,5,6,1,7,4,3,2]

const result = MaxRectangularArea(arr)

console.log('result', result)