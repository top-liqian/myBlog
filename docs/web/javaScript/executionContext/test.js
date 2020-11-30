// function a () { 
//     return function b() { 
//         var myname = 'b'; 
//         console.log(myname); // b 
//     } 
// }
// function c() { 
//     var myname = 'c'; 
//     b(); 
// }

// var b = a();

// c();

function a () { 
    return function b() { 
        // var myname = 'b';
        console.log(myname); // 这⾥会报错 
    } 
}

function c() { 
    var myname = 'c'; 
    b(); 
}

var b = a(); 
c(); 