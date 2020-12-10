var arr = [
    [1, 2, 3], 
    [4, 5, 6, 
        [7, 8, 9, 
            [10, 11, 12, 
                [13, 14]
            ]
        ]
    ]
]

function flattenDeep (arr) {
  return Array.isArray(arr)
   ? arr.reduce((acc, cru) => [...acc, ...flattenDeep(cru)], [])
   : [arr]
}

const result = flattenDeep(arr)

console.log(result)

function flat(arr, depth = 1) {
    return depth > 0
        ? arr.reduce((acc, cur) => {
        if(Array.isArray(cur)) {
            return [...acc, ...flat(cur, depth-1)]
        }
        return [...acc, cur]
    } , [])
      : arr
}

const result1 = flat(arr, 1)

console.log(result1)

const result2 = flat(arr, Infinity)

console.log(result2)

function flatStack(arr) {
  const result = []
  const stack = [...arr]
  while(stack.length !== 0) {
    const val = stack.pop()
    if (Array.isArray(val)) {
        stack.push(...val)
    } else {
        result.unshift(val)
    }
  }
  return result
}

const result3 = flatStack(arr)

console.log('result3', result3)