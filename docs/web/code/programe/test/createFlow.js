const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const subFlow = createFlow([() => delay(1000).then(() => console.log("c"))])

function createFlow(effects = []) {
  const queue = [...effects.flat()]
  const run = async function(cb) {
    for(let task of queue) {
      if(task.isFlow) {
        await task.run()
      } else {
        await task()
      }
    }
    if(cb) cb()
  }
  return {
    run,
    isFlow: true
  }
}


createFlow([
    () => console.log("a"),
    () => console.log("b"),
    subFlow,
    [() => delay(1000).then(() => console.log("d")), () => console.log("e")],
  ]).run(() => {
    console.log("done");
  });