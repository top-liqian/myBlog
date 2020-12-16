module.exports = {
  title: '晴卿的学习之路',
  description: '高级前端开发工程师的养成之路',
  head: [
    // add jquert and fancybox
    ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.slim.min.js' }],
    ['script', { src: 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.js' }],
    ['link', { rel: 'stylesheet', type: 'text/css', href: 'https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.2/jquery.fancybox.min.css' }]
  ],
  // head: [

  //   ['link', {
  //     rel: 'icon',
  //     href: `/favicon.ico`
  //   }]
  // ],
  dest: './docs/.vuepress/dist',
  ga: '',
  evergreen: true,
  themeConfig: {
    logo: '/home.png',
    nav: [
      { text: 'Web', link: '/web/' },
      { text: 'css', link: '/css/' },
      { text: 'vue', link: '/vue/' },
      { text: 'todo', link: '/todo/' },
      { text: 'React', link: '/react/' },
      { text: 'webpack', link: '/webpack/' },
      { text: 'babel', link: '/babel/' },
      { text: '面试', link: '/interview/' },
      {
        text: 'Languages',
        items: [
          { text: 'Chinese', link: '/language/chinese' },
          { text: 'English', link: '/language/english' }
        ]
      },
      { text: 'External', link: 'https://www.baidu.com' },
    ],
    sidebarDepth: 2,
    sidebar: {
      '/todo/': [
        {
          title: '2', path: '/todo/vue3/2/2'
        }
      ],
      '/web/': [
        {
          title: 'JavaScript-ES5',
          collapable: true,
          children: [
            { title: '面向对象编程', path: '/web/javaScript/oop/oop' },
            { title: '浏览器事件模型', path: '/web/javaScript/internet/internet' },
            { title: '变量', path: '/web/javaScript/variable/variable' },
            { title: '类型转换', path: '/web/javaScript/type-change/type-change' },
            { title: '原型与原型链', path: '/web/javaScript/prototype/prototype' },
            { title: 'new操作符', path: '/web/javaScript/operator/new/new' },
            { title: 'typeof操作符', path: '/web/javaScript/operator/typeof' },
            { title: 'instanceof操作符', path: '/web/javaScript/operator/instanceof' },
            { title: 'indexOf操作符', path: '/web/javaScript/operator/indexOf' },
            { title: '继承', path: '/web/javaScript/inherit/inherit' },
            { title: 'js执行上下文&作用域', path: '/web/javaScript/executionContext/executionContext' },
            { title: '闭包', path: '/web/javaScript/closerFunction/closerFunction' },
            { title: 'this', path: '/web/javaScript/this/this' },
            { title: '箭头函数', path: '/web/javaScript/arrow-function/arrow-function' },
            { title: '数组原生方法', path: '/web/javaScript/array-prototype-code/array-prototype-code' },
          ]
        },
        {
          title: 'JavaScript-ES6',
          collapable: false,
          children: [
            { title: 'let&const', path: '/web/es6/let-const/let-const' },
            { title: '解构赋值', path: '/web/es6/destructuring-assignment/destructuring-assignment' },
            { title: 'promise', path: '/web/es6/promise/promise' },
            { title: 'proxy', path: '/web/es6/proxy/proxy' },
          ],
        },
      ],
      '/vue/': [
        {
          title: 'vue',
          collapable: true,
          children: [
            {
              title: 'vue2',
              collapable: true,
              children: [
                { title: '源码分析之computed', path: '/vue/vue2/computed/computed' },
              ]
            },
            {
              title: 'vue3',
              collapable: true,
              children: [
                { title: '导读 | 一文看懂 Vue.js 3.0 的优化', path: '/vue/vue3/reading-guide/reading-guide' },
              ]
            }
          ]
        },
      ],
      '/react/': [
        {
          title: 'React',
          collapable: true,
          children: [
            { title: '走进react', path: '/react/knowReact/knowReact' },
            { title: '为什么React要用JSX？', path: '/react/jsx/jsx' },
          ]
        },
      ],
      '/css/': [
        {
          title: 'css基础',
          collapable: true,
          children: [
            { title: '深入理解BFC', path: '/css/bfc/bfc' }
          ],
        },
        {
          title: 'css面试',
          collapable: true,
          children: [
            { title: '介绍下 BFC 及其应用', path: '/css/bfc/interview' }
          ],
        },
      ],
      '/webpack/': [
        {
          title: '7天搞定Webpack原理与实践',
          collapable: true,
          children: [
            { title: '如何使用 Webpack 实现模块化打包？', path: '/webpack/webpack-learn/1-webpack' }
          ],
        },
      ],
      '/babel/': [
        {
          title: 'React',
          collapable: true,
          children: [
            { title: '了解babel', path: '/babel/knowBabel/knowBabel' },
            { title: 'babel的运行原理', path: '/babel/basicBabel/basicBabel' },
          ]
        },
      ],
      '/interview/': [
        {
          title: 'JavaScript-常规题目',
          collapable: true,
          children: [
            { title: 'try/catch', path: '/interview/js/common/try-catch' },
            { title: '数组map方法相关题目', path: '/interview/js/common/map/map' },
          ]
        },
        {
          title: 'JavaScript-手写代码',
          collapable: true,
          children: [
            { title: 'indexOf', path: '/interview/js/originCode/indexOf' },
            { title: '数组扁平化', path: '/interview/js/originCode/array/flat' },
            { title: '数组去重', path: '/interview/js/originCode/array/set' },
            { title: '实现数组forEach的源码', path: '/interview/js/originCode/array/forEach' },
            { title: '实现数组reduce的源码', path: '/interview/js/originCode/array/reduce' },
            { title: '实现async/await', path: '/interview/js/originCode/async-await' },
            { title: '实现字符串trim方法', path: '/interview/js/originCode/string/trim' },
            { title: '实现ajax', path: '/interview/js/originCode/http/ajax/ajax' },
            { title: '手动实现jsonp', path: '/interview/js/originCode/http/jsonp/jsonp' },
          ]
        },
        {
          title: 'JavaScript-编程题',
          collapable: true,
          children: [
            { title: '1. 实现一个方法，拆解URL参数中queryString', path: '/interview/js/programe/queryString' },
            { title: '2. 一个字符串里出现最多的字符是什么，以及出现次数', path: '/interview/js/programe/mostCharInStr' },
            { title: '3. 找出字符串中连续出现最多的字符和个数', path: '/interview/js/programe/mostChars' },
            { title: '4. 实现一个add方法', path: '/interview/js/programe/myAdd' },
            { title: '5. 阿里异步串行编程题：按照以下要求，实现 createFlow 函数', path: '/interview/js/programe/createFlow' },
          ],
        },
        {
          title: 'JavaScript-输出结果',
          collapable: true,
          children: [
            { title: '从一道面试题谈谈对EventLoop的理解', path: '/interview/js/output/eventloop' },
            { title: '字节：输出以下代码运行结果', path: '/interview/js/output/square' },
            { title: '常见基础输出问题', path: '/interview/js/output/base' },
          ]
        },
        {
          title: 'Vue2.0-常规题目',
          collapable: true,
          children: [
            { title: 'computed相关的面试题', path: '/interview/vue2/computed/computed' },
          ]
        },
        {
          title: 'Vue3.0-常规题目',
          collapable: true,
          children: [
            { title: 'Vue3.0常规面试题', path: '/interview/vue3/vue3' },
          ]
        },
        {
          title: '浏览器',
          collapable: true,
          children: [
            { title: 'tcp面试题', path: '/interview/internet/tcp/tcp' },
          ]
        },
      ],
    }
  }
}