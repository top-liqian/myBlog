function debounce(fn, wait = 50, immediate) {
    let timer = null
    return function(...args) {
        if (timer) clearTimeout(timer)
        if (immediate && !timer) {
            fn.apply(this, args)
        }
        timer = setTimeout(() => {
            fn.apply(this, args)
        }, wait)
    }
}
const betterFn = debounce(() => { console.log('防抖') }, 1000, true)

const btn = document.getElementById('btn')

btn.addEventListener('click', betterFn)