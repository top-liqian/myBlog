const every = (arr, fn) => {
    let result = false
    for(let value of arr) {
      result = fn(value)
      if (result) break;
    }
    return result
  }
  
  let arr = [9,12,14]
  let r = every(arr, v => v > 10)
  console.log(r)