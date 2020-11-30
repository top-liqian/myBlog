function Person () {
    var _name = 'xiaowa'
    return {
        getName: function () {
            return _name
        }
    }
}

const person = new Person()

console.log(person._name) // undefined

console.log(person.getName()) // xiaowa