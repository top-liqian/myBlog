// const { SyncHook } = require('tabaple')

class SyncHook {
    constructor(args = []) {
        this.args = args
        this.taps = []
    }
    tap(name, fn) {
        this.taps.push(fn)
    }
    call() {
        const args = Array.prototype.slice.call(arguments, 0, this.args.length)
        this.taps.forEach(tap => tap(...args))
    }
}

module.exports = SyncHook