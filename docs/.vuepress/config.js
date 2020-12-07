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
      { text: 'React', link: '/react/' },
      { text: 'babel', link: '/babel/' },
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
      '/web/': [
        {
          title: 'ES5',
          collapable: true,
          children: [
            { title: '面向对象编程', path: '/web/javaScript/oop/oop' },
            { title: '浏览器事件模型', path: '/web/javaScript/internet/internet' },
            { title: '原型与原型链', path: '/web/javaScript/prototype/prototype' },
            { title: 'new操作符', path: '/web/javaScript/new/new' },
            { title: '继承', path: '/web/javaScript/inherit/inherit' },
            { title: 'js执行上下文&作用域', path: '/web/javaScript/executionContext/executionContext' },
            { title: '闭包', path: '/web/javaScript/closerFunction/closerFunction' },
            { title: 'this', path: '/web/javaScript/this/this' },
          ]
        },
        {
          title: '面试题',
          collapable: true,
          children: [
            {
              title: '手写代码',
              children: [
                { title: 'indexOf', path: '/web/code/originCode/indexOf' },
                { title: '数组扁平化', path: '/web/code/originCode/arrayFlat' },
                { title: '数组去重', path: '/web/code/originCode/arraySet' },
              ],
            },
            {
              title: '编程题',
              children: [
                { title: '1. 实现一个方法，拆解URL参数中queryString', path: '/web/code/programe/queryString' },
                { title: '2. 一个字符串里出现最多的字符是什么，以及出现次数', path: '/web/code/programe/mostCharInStr' },
                { title: '3. 找出字符串中连续出现最多的字符和个数', path: '/web/code/programe/mostChars' },
                { title: '4. 实现一个add方法', path: '/web/code/programe/myAdd' },
                { title: '5. 阿里异步串行编程题：按照以下要求，实现 createFlow 函数', path: '/web/code/programe/createFlow' },
              ],
            },
            {
              title: '输出结果',
              children: [
                { title: '从一道面试题谈谈对EventLoop的理解', path: '/web/code/output/eventloop' },
                { title: '字节：输出以下代码运行结果', path: '/web/code/output/square' },
              ],
            }
          ],
        },
        {
          title: 'ES6',
          collapable: false,
          children: [
            { title: 'promise', path: '/web/es6/promise/promise' },
          ],
        }
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
      '/babel/': [
        {
          title: 'React',
          collapable: true,
          children: [
            { title: '了解babel', path: '/babel/knowBabel/knowBabel' },
            { title: 'babel的运行原理', path: '/babel/basicBabel/basicBabel' },
          ]
        },
      ]
    }
  }
}