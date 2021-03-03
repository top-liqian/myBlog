// 栈中存储内容 + 递归解法

function solution(fishSize = [], fishDirection = [])  {
   if (fishSize.length === 0) return 0

   if (fishDirection.length === 0) return fishSize.length

   let stack = []

   function compareFish(i) {
        if (stack.length === 0) {
            stack.push({ stackTopSize: fishSize[i], stackTopDir: fishDirection[i] })
            return
        }
        let { stackTopSize, stackTopDir } = stack[stack.length - 1]
        if (stackTopDir === fishDirection[i]) {
            stack.push({ stackTopSize: fishSize[i], stackTopDir: fishDirection[i] })
        } else {
            if (stackTopSize < fishSize[i]) {
                stack.pop()
                compareFish(i)
            }
        }  
   }

    for (let i = 0; i < fishSize.length; i++) {
        compareFish(i)
    }

    return stack.length
}

// 栈中存储内容的索引，利用while循环
function solution(fishSize = [], fishDirection = [])  {

    if (fishSize.length === 0) return 0

    if (fishDirection.length === 0) return fishSize.length

    let stack = []

    for (let i = 0; i < fishSize.length; i++) {
        let curFishSize = fishSize[i]
        let curFishDir = fishDirection[i]

        let hasEat = false

        while(stack.length && curFishDir !== fishDirection[stack[stack.length - 1]]) {
            if (fishSize[stack[stack.length - 1]] > curFishSize) {
                hasEat = true;
                break;
            }
            stack.pop()
        }

        if (!hasEat) {
            stack.push(i)
        }
    }

    return stack.length
}

const size = [4, 2, 5, 3, 1] // [4, 3, 2, 1, 5]

const dir = [1, 1, 0, 0, 0] // [0, 1, 0, 0, 0];

const fish = solution(size, dir)

console.log('fish', fish)