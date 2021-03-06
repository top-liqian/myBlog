# ⾯向对象编程

## 什么是⾯向对象编程？

⾯向对象是⼀种编程思想，经常被拿来和⾯向过程⽐较。

其实说的简单点，⾯向过程关注的重点是动词，是分析出解决问题需要的步骤，然后编写函数实现每个步骤，最
后依次调⽤函数。

⽽⾯向对象关注的重点是主谓，是把构成问题的事物拆解为各个对象，⽽拆解出对象的⽬的也
不是为了实现某个步骤，⽽是为了描述这个事物在当前问题中的各种⾏为。

## ⾯向对象的特点是什么？

1. 封装：让使⽤对象的⼈不考虑内部实现，只考虑功能使⽤ 把内部的代码保护起来，只留出⼀些 api 接⼝供⽤户使⽤
2. 继承：就是为了代码的复⽤，从⽗类上继承出⼀些⽅法和属性，⼦类也有⾃⼰的⼀些属性
3. 多态：是不同对象作⽤于同⼀操作产⽣不同的效果。多态的思想实际上是把“想做什么”和“谁去做“分开

⽐如下棋的过程:

+ ⾯向过程是这样的：开局 -> ⽩⽅下棋 -> 棋盘展示 -> 检查胜负 -> ⿊⽅下棋 -> 棋盘展示 -> 检查胜负 -> 循环
+ ⾯向对象是这样的：棋盘.开局 -> 选⼿.下棋 -> 棋盘.重新展示 -> 棋盘.检查胜负 -> 选⼿.下棋 -> 棋盘.重新展示 -> 棋盘.检查胜负

## 什么时候适合使⽤⾯向对象

可以看出来，在⽐较复杂的问题⾯前，或者参与⽅较多的时候，⾯向对象的编程思想可以很好
的简化问题，并且能够更好的扩展和维护。

⽽在⽐较简单的问题⾯前，⾯向对象和⾯向过程其实差异并不明显，也可以⼀步⼀步地按照步
骤来调⽤。