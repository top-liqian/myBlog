// function throttle (fun, wait = 50) {
//   let previous = 0
//   return function (...args) {
//     let currentTime = +new Date() 
//       if (currentTime - previous > wait) {
//         previous = currentTime
//         fun.apply(this, args)
//       }
//   }
// }

// const betterFn = throttle(() => {
//   console.log('fn 函数执行了')
// }, 5000)

// setInterval(betterFn, 10)

function throttlePlus(fn, wait = 50) {
  // previous 是上一次执行 fn 的时间
  // timer 是定时器
  let previous = 0, timer = null
  
  // 将 throttle 处理结果当作函数返回
  return function (...args) {
    
    // 获取当前时间，转换成时间戳，单位毫秒
    let now = +new Date()
    // debugger
    // ------ 新增部分 start ------ 
    // 判断上次触发的时间和本次触发的时间差是否小于时间间隔
    if (now - previous < wait) {
    	 // 如果小于，则为本次触发操作设立一个新的定时器
       // 定时器时间结束后执行函数 fn 
       if (timer) clearTimeout(timer)
       timer = setTimeout(() => {
          previous = now
        	fn.apply(this, args)
        }, wait)
    // ------ 新增部分 end ------ 
      
    } else {
       // 第一次执行
       // 或者时间间隔超出了设定的时间间隔，执行函数 fn
       previous = now
       fn.apply(this, args)
    }
  }
}

const betterFn = throttlePlus(() => { console.log('防抖') }, 5000)

const btn = document.getElementById('btn')

btn.addEventListener('click', betterFn)
