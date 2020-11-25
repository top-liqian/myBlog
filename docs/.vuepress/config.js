module.exports = {
  title: '晴卿的学习之路',
  description: '高级前端开发工程师的养成之路',
  head: [
    ['link', {
      rel: 'icon',
      href: `/favicon.ico`
    }]
  ],
  dest: './docs/.vuepress/dist',
  ga: '',
  evergreen: true,
  themeConfig: {
    logo: '/home.png',
    nav: [
      { text: 'CSS', link: '/css/' },
      { text: 'JavaScript', link: '/javaScript/' },
      { text: 'node', link: '/node/' },
      { text: 'http', link: '/http/' },
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
      '/javaScript/': [{
        title: 'javascript',
        collapable: true,
        children: [
          { title: '原型与原型链', path: '/javaScript/prototype/prototype' },
          { title: 'new操作符', path: '/javaScript/new/new' },
          { title: '继承', path: '/javaScript/inherit/inherit' },
        ]
      }]
    }
  }
}