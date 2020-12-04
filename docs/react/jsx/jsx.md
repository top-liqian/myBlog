# 为什么 React 要用 JSX？

## 为什么采用该技术方案

这一类问题是主考官最爱提的。这类问题其实在考察你的两个方面：

1. 技术广度，深挖知识面涉猎广度，对流行框架的模板方案是否知悉了解；
   
2. 技术方案调研能力。

## 解答技巧

三步走技巧”，即`一句话解释，核心概念，方案对比`的解题思路，来回答面试中`为什么 React 使用 JSX？`这类问题

1. 一句话解释 JSX。首先能一句话说清楚 JSX 到底是什么。

2. 核心概念。JSX 用于解决什么问题？如何使用？

3. 方案对比。与其他的方案对比，说明 React 选用 JSX 的必要性。

## 面试回答

1. JSX是一个javascript的语法扩展，结构类似XML
2. JSX主要用于声明React元素，但是React中并没有强制使用JSX，即使是使用了JSX，也会在构建过程中，通过Bable编译器插件将其编译成为React.createElement。所以JSX更像是React.createElement的一种语法糖
3. 从这里可以看出，React的技术团队并不想引入javascript本身以外的开发体系，而是希望通过合理的关注点分离保持组件开发的纯粹性
4. 与jsx并列的还有模板，模板字符串，JXON三种技术方案，首先是模板，如果使用了模板就要引入相关的模板语法、模板指令等一些概念，是一种不佳的实现方案，其次模板字符串的编写结构会造成多次的内部嵌套，会使整个结构变得复杂，并且优化代码提示也不友好，最后是JXON，同样因为代码提示困难的原因而被放弃。所以 React 最后选用了 JSX，因为 JSX 与其设计思想贴合，不需要引入过多新的概念，对编辑器的代码提示也极为友好。

## Babel 插件如何实现 JSX 到 JS 的编译

它的实现原理是这样的。Babel 读取代码并解析，生成 AST，再将 AST 传入插件层进行转换，在转换时就可以将 JSX 的结构转换为 React.createElement 的函数

```js
module.exports = function (babel) {

  var t = babel.types;

  return {

    name: "custom-jsx-plugin",

    visitor: {

      JSXElement(path) {

        var openingElement = path.node.openingElement;

        var tagName = openingElement.name.name;

        var args = []; 

        args.push(t.stringLiteral(tagName)); 

        var attribs = t.nullLiteral(); 

        args.push(attribs); 

        var reactIdentifier = t.identifier("React"); //object

        var createElementIdentifier = t.identifier("createElement"); 

        var callee = t.memberExpression(reactIdentifier, createElementIdentifier)

        var callExpression = t.callExpression(callee, args);

        callExpression.arguments = callExpression.arguments.concat(path.node.children);

        path.replaceWith(callExpression, path.node); 

      },

    },
  };
};

```