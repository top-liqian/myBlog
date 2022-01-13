class DonePlugin {
    constructor(options) {
        this.options = options
    }
    apply(complier) {
        complier.hooks.done.tap('DonePlugin', () => {
            // console.log('DonePlugin')
        })
    }
}
 
module.exports = DonePlugin