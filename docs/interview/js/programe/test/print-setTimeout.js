// function print(n){
//     setTimeout(() => {
//       console.log(n);
//     }, Math.floor(Math.random() * 1000));
//   }
//   for(var i = 0; i < 20; i++){
//     print(i);
// }

// function print(n){
//     setTimeout(() => {
//        Promise.resolve(n).then(n => {
//            console.log(n)
//        })
//     }, Math.floor(Math.random() * 1000));
//   }
//   for(var i = 0; i < 20; i++){
//     print(i);
// }

// function print(n){
//     setTimeout(console.log(n), Math.floor(Math.random() * 1000));
// }
// for(var i = 0; i < 20; i++){
//     print(i);
// }

function print(n){
    setTimeout((() => {
      console.log(n);
    })(), Math.floor(Math.random() * 1000));
}
for(var i = 0; i < 20; i++){
    print(i);
}

// function print(n){
//     setTimeout((() => {
//       // console.log(this.i); // 如果不借助call会打印出100次全局变量i，值都为100
//       console.log(n); // 顺序打印出0~99(100个)
//       console.log(99-n); // 倒序打印出99~0(100个)
//     }).call(null, n), Math.floor(Math.random() * 1000));
// }
// for(var i = 0; i < 10; i++) {
// // console.log(i) // 0~99
//     print(i); 
// }