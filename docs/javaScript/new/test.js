Object.prototype.name = 'object'

function Player() {
    this.name = 'aaa'
}

Player.prototype.name = 'prototype'

const white = new Player()

// white.name = 'white'   
console.log(white.name)