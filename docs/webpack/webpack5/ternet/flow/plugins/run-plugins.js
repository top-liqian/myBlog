class RunPlugin {
    constructor(options) {
        this.options = options
    }
    apply(complier) {
        complier.hooks.run.tap('RunPlugin', () => {
            // console.log('RunPlugin')
        })
    }
}
 
module.exports = RunPlugin