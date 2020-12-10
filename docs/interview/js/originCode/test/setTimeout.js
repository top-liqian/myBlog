var timerArray = [1]
function mySetTimeout(func, time, args) {
  let startTime = 0;
  let timer = timerArray[timerArray.length - 1] + 1
  while(time > startTime) {
    startTime++
  }
  func(args)
  timerArray.push(timer)
  return timer - 1
}

function outNumber() {
  console.log('outNumber', Math.random())
}

function getNumber(num) {
  console.log('getNumber', num)
}

const timer1 = mySetTimeout(outNumber, 1000)

const timer2 = mySetTimeout(getNumber, 1000, 23)

console.log('timer', timer1, timer2)