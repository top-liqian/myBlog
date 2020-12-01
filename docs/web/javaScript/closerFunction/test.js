
var _name = '11111'
function Person () {
    // var _name = 'xiaowa'
    return {
        getName: function () {
            return _name
        }
    }
}

const person = new Person()

console.log(person._name) // undefined

console.log(person.getName()) // xiaowa

function a () {
    var myname = 'd';
    return function b() { 
        // var myname = 'b'; 
        console.log(myname); // b 
    } 
}
function c() { 
    var myname = 'c'; 
    b(); 
}

var b = a(); 
c();

// function show () { 
//     console.log('this:', this);
// }
// var obj = { 
//     show: show 
// };

// obj.show(); // { show: [Function: show] }

// function show () { 
//     console.log('this:', this); 
// }
// var obj = { 
//     show: function () { 
//         show(); 
//     } 
// };
// obj.show(); // window

var obj = { 
    show: function () { 
        console.log('this:', this); 
    } 
};

(0, obj.show)(); // window