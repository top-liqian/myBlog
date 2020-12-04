#### vue源码解读从入口开始

首先找到vue的package.json

可以看到在package.json当中 scripts 的 dev 也就是vue项目运行npm run dev时所要执行的语句

```rollup -w -c scripts/config.js --environment TARGET:web-full-dev```

-w 代表监听

-c 代表改变路径

其中最关键的两个字段为```scripts/config.js``` 和 ```web-full-dev```

此时我们跳转到```scripts/config.js```，全局搜索可以看到

```js
    const aliases = require('./alias') // 重新定义了路径
    'web-full-dev': {
        entry: resolve('web/entry-runtime-with-compiler.js'), // 入口文件为web/entry-runtime-with-compiler.js
        dest: resolve('dist/vue.js'),
        format: 'umd',
        env: 'development',
        alias: { he: './entity-decoder' },
        banner
    },
```
此时我们在跳转到```web/entry-runtime-with-compiler.js```

import Vue from './runtime/index'

此时我们在跳转到```web/runtime/index```

import Vue from 'core/index'

此时我们在跳转到```core/index```

import Vue from './instance/index'

此时我们在跳转到```instance/index```

可以可以找到整个项目的初始入口，定义Vue的初始方法

```js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```