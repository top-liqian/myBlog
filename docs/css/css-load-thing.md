### css渲染会造成阻塞吗

#### css 对dom结构的阻塞

`css加载不会对dom得解析造成任何影响`

`css会阻塞dom得渲染`

原因： 

其实我觉得，这可能也是浏览器的一种优化机制。

因为你加载css的时候，可能会修改下面DOM节点的样式，如果css加载不阻塞DOM树渲染的话，那么当css加载完之后，DOM树可能又得重新重绘或者回流了，这就造成了一些没有必要的损耗。所以我干脆就先把DOM树的结构先解析完，把可以做的工作做完，然后等你css加载完之后，在根据最终的样式来渲染DOM树，这种做法性能方面确实会比较好一点。

#### css 对js的阻塞

`css加载会阻塞后面js语句的执行`

#### 原理解析

webkit渲染过程：

![](http://localhost:3000/public/webkit-render-tree.png "")

gecko渲染过程：

![](http://localhost:3000/public/gecko-render-tree.png "")

从渲染机制上来看

1. dom的解析与css的解析是并行的操作，互不影响，所以css的加载不会影响dom的解析

2. dom解析出dom树后，css解析出css树后，结合形成render tree进行渲染与绘制，

   由于Render Tree是依赖于DOM Tree和CSSOM Tree的，所以他必须等待到CSSOM Tree构建完成，也就是CSS资源加载完成(或者CSS资源加载失败)后，才能开始渲染

   所以css会阻塞dom得渲染

3. 由于js可能会操作之前的Dom节点和css样式，因此浏览器会维持html中css和js的顺序。因此，样式表会在后面的js执行前先加载执行完毕。所以css会阻塞后面js的执行。

#### 提高css加载速度

1. 使用CDN(因为CDN会根据你的网络状况，替你挑选最近的一个具有缓存内容的节点为你提供资源，因此可以减少加载时间)

2. 对css进行压缩(可以用很多打包工具，比如webpack,gulp等，也可以通过开启gzip压缩)

3. 合理的使用缓存(设置cache-control,expires,以及E-tag都是不错的，不过要注意一个问题，就是文件更新后，你要避免缓存而带来的影响。其中一个解决防范是在文件名字后面加一个版本号)

4. 减少http请求数，将多个css文件合并，或者是干脆直接写成内联样式(内联样式的一个缺点就是不能缓存)

#### DOMContentLoaded与onload

onload： 就是等待页面的所有资源都加载完成才会触发，这些资源包括css、js、图片视频等

DOMContentLoaded： 当页面的内容解析完成后，则触发该事件

如果页面中`同时存在css和js`，`并且存在js在css后面`，则DOMContentLoaded事件会在`css加载完`后才执行。

其他情况下，`DOMContentLoaded都不会等待css加载`，并且DOMContentLoaded事件也不会等待图片、视频等其他资源加载。

出处：
[css加载会造成阻塞吗](https://segmentfault.com/a/1190000018130499)