
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


function add () {
    const numberList = Array.from(arguments);
  
    // 进一步收集剩余参数
    const calculate = function() {
      numberList.push(...arguments);
      return calculate;
    }
  
    // 利用 toString 隐式转换，最后执行时进行转换
    calculate.toString = function() {
      return numberList.reduce((a, b) => a + b, 0);
    }
  
    return calculate;
}
  
const ass = add(1)(2)(3)

// 实现一个 add 方法，使计算结果能够满足以下预期
console.log(ass); // 6
console.log(add(1, 2, 3)(4)); // 10;
console.log(add(1)(2)(3)(4)(5)); // 15;

console.log(111)
const match = reg => (str => str.match(reg))
const haveSpace = match(/\s+/g)
const _filter = func => (arr => arr.filter(func))
console.log(_filter(haveSpace)(['helloword', 'hello word']))