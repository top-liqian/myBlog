### 深入理解javascript的执行上下文&作用域

#### 一、执行上下文的概念

执行上下文就是Javascript代码被解析与执行时所在环境的抽象概念，javascript在运行任何代码时都是在执行上下文中运行的

#### 二、执行上下文的类型

1. 全局执行上下文：这是默认的最基础的执行上下文，不在任何函数中的代码都在全局执行上下文中运行，而且一个程序当中只有一个全局执行上下文，全局上下文一共做了两件事儿：

+ 创建一个全局对象，在浏览器当中这个对象就是window
+ 将this指向这个全局对象
  
2. 函数执行上下文：每次执行函数时都会给函数创建一个独立的函数执行上下文，但是只有函数被调用时才会创建，一个程序当中可以有无数个函数执行上下文。

3. eval函数执行上下文：运行在 eval 函数中的代码也获得了自己的执行上下文，但由于 Javascript 开发人员不常用 eval 函数，所以在这里不再讨论。

#### 三、执行栈

1. 执行栈的概念
  
  执行栈，在其他的程序语言当中又叫做调用栈，具有后进先出的特性，在javascript当中用来存储代码在运行过程中所创建的所有执行上下文。

2. JavaScript引擎如何管理执行上下文（执行栈调用过程）

  当javascript引擎首次读取你的脚本时，会创建一个```全局执行上下文```,将其push到执行栈的栈中。每当执行一个函数时，就会创建一个新的函数执行上下文push到执行栈的栈顶，引擎会执行在执行栈顶端的上下文，当一个函数执行下文执行完毕之后，执行栈就会释放当前的函数执行上下文，并将控制权移交到下一个执行上下文，一旦所有代码执行完毕，Javascript 引擎把全局执行上下文从执行栈中移除。

3. 执行上下文是如何被创建的

  执行上下文分为两个部分，创建过程和执行过程

  ##### （1）创建过程

    在任意的 JavaScript 代码被执行前，执行上下文处于创建阶段。

    创建阶段，指函数被调⽤但还未执⾏任何代码时，此时创建了⼀个拥有3个属性的对象：

    ```js
        executionContext = { 
          scopeChain: {}, // 创建作⽤域链（scope chain） 
          variableObject: {}, // 初始化变量、函数、形参 
          this: {} // 指定this 
        }
    ```
    
    在创建阶段中总共发生了三件事情：

   + 1、确定this值，也就是this bouding
     
     在全局执行上下文中， this指向了全局对象，在浏览器中的this指向了全局对象window

     在函数执行上下文中，this值取决于函数的调用方式，如果它是被一个对象所调用，this就指向了这个对象。否则this就被设置为全局对象或者是undefined

   + 2、词法环境（LexicalEnvironment）组件被创建
     
      词法环境es6的文档将其定义为：词法环境是一种规范类型，基于ecmascript代码的词法嵌套结构来定义标识符与特定变量和函数之间的关联关系。词法环境由环境记录与可能为空引用的外部词法环境组成。

      简而言之：词法环境就是一个包含```标识符---变量映射```的结构(此处标识符---变量或者函数的名称，变量---对实际对象的引用或原始值的引用)，在词法环境中由两个组成部分
       
       - 环境记录： 存储变量或函数声明的实际位置
       - 对外部环境的引用意味着它可以访问其外部词法环境
      
      词法环境由两种类型

      - 全局环境：（在全局执行上下文中）是一个```没有外部环境的词法环境```。全局环境的外部环境引用为 ```null```。它拥有一个全局对象（window 对象）及其关联的方法和属性（例如数组方法）以及任何用户自定义的全局变量，this 的值指向这个全局对象。
  
      - 函数环境：用户在函数中定义的变量被存储在```环境记录```中。对外部环境的引用可以是全局环境，也可以是包含内部函数的外部函数环境。
      
        注意： 对于```函数环境```而言，```环境记录``` 还包含了一个 ```arguments``` 对象，该对象包含了索引和传递给函数的参数之间的映射以及传递给函数的参数的长度（数量）。例如，下面函数的 arguments 对象如下所示：

        ```js
        function foo(a, b) {  
           var c = a + b;  
        }  
        foo(2, 3);

        // arguments 对象  
        Arguments: {0: 2, 1: 3, length: 2},
        ```
        ```环境记录``` 同样有两种类型（如下所示）：
        - 声明性环境变量：存储变量，函数和参数，一个函数环境包含声明性环境变量
        - 对象环境变量：用于定义在全局执行上下文中出现的变量和函数的关联。全局环境包含对象环境记录。
     
        抽象地说，词法环境在伪代码中看起来像这样：
        ```js
        GlobalExectionContext = {  
            LexicalEnvironment: {  
                EnvironmentRecord: {  
                  Type: "Object",  
                  // 标识符绑定在这里 
                  outer: <null>  
                }  
            }
        }

        FunctionExectionContext = {  
            LexicalEnvironment: {  
               EnvironmentRecord: {  
                   Type: "Declarative",  
                   // 标识符绑定在这里 
                   outer: <Global or outer function environment reference>  
               } 
           } 
         }
        ```
   + 3、语法环境（VariableEnvironment）组件被创建

       它也是一个词法环境，其 EnvironmentRecord 包含了由 VariableStatements 在此执行上下文创建的绑定。

       如上所述，变量环境也是一个词法环境，因此它具有上面定义的词法环境的所有属性。

       在 ES6 中，LexicalEnvironment 组件和 VariableEnvironment 组件的区别在于前者用于存储函数声明和变量```（ let 和 const ）```绑定，而后者仅用于存储变量```（ var ）```绑定。

       让我们结合一些代码示例来理解上述概念

       ```js
         let a = 20;  
         const b = 30;  
         var c;

        function multiply(e, f) {  
          var g = 20;  
          return e * f * g;  
        }

        c = multiply(20, 30);
         
       ```  
      执行上下文如下所示：

      ```js
        GlobalExectionContext = {

           ThisBinding: <Global Object>,

           LexicalEnvironment: {  
             EnvironmentRecord: {  
               Type: "Object",  
               // 标识符绑定在这里  
               a: < uninitialized >,  
               b: < uninitialized >,  
               multiply: < func >  
             }  
             outer: <null>  
           },

           VariableEnvironment: {  
             EnvironmentRecord: {  
               Type: "Object",  
               // 标识符绑定在这里  
               c: undefined,  
             }  
             outer: <null>  
           }  
        }

       FunctionExectionContext = {  
          
         ThisBinding: <Global Object>,

         LexicalEnvironment: {  
           EnvironmentRecord: {  
             Type: "Declarative",  
             // 标识符绑定在这里  
             Arguments: {0: 20, 1: 30, length: 2},  
           },  
           outer: <GlobalLexicalEnvironment>  
         },

         VariableEnvironment: {  
           EnvironmentRecord: {  
             Type: "Declarative",  
             // 标识符绑定在这里  
             g: undefined  
           },  
           outer: <GlobalLexicalEnvironment>  
         }  
       }
      ```
      你可能已经注意到了 ```let``` 和 ```const``` 定义的变量没有任何与之关联的值，被标识为``` < uninitialized >```但 var 定义的变量设置为 ```undefined```。

      这是因为在创建阶段，代码会被扫描并解析变量和函数声明，其中函数声明存储在环境中，而变量在 var 的情况下会被设置为 undefined,在 let 和 const 的情况下保持未初始化（）

      这就是为什么你可以在声明之前访问 var 定义的变量（尽管是 undefined ），但如果在声明之前访问 let 和 const 定义的变量就会提示引用错误的原因。
      
      这就是我们所谓的变量提升。

   ##### （2）执行过程

   代码执⾏阶段主要的⼯作是：1、分配变量、函数的引⽤，赋值。2、执⾏代码。

   注： 在执行阶段，如果 Javascript 引擎在源代码中声明的实际位置找不到 let 变量的值，那么将为其分配 undefined 值。

#### 四、作⽤域

##### 作⽤域

js中有全局作⽤域、函数作⽤域，es6中⼜增加了块级作⽤域。作⽤域的最⼤⽤途就是隔离变量或函 数，并控制他们的⽣命周期。作⽤域是在函数执⾏上下⽂创建时定义好的，不是函数执⾏时定义的。

##### 作⽤域链

当⼀个块或函数嵌套在另⼀个块或函数中时，就发⽣了作⽤域的嵌套。在当前函数中如果js引擎⽆法找 到某个变量，就会往上⼀级嵌套的作⽤域中去寻找，直到找到该变量或抵达全局作⽤域，这样的链式 关系就称为作⽤域链(Scope Chain)

```js
function a () { 
    return function b() { 
        var myname = 'b'; 
        console.log(myname); // b 
    } 
}
function c() { 
    var myname = 'c'; 
    b(); 
}

var b = a();

c();

// 此时具有两条函数作用域链为：
// b函数作用域链 myname = 'b' -> window
// c函数的作用域链 myname = 'c' -> window

// 所以输出b

// 去掉函数b中的myname声明后 
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

// 此时具有两条函数作用域链为：
// b函数作用域链 window
// c函数的作用域链 myname = 'c' -> window

// myname is not defined



```