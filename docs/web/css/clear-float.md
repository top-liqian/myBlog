### 清除浮动
> 就是借助某个元素（伪元素或空标签）进行`clear`，或者让父级形成一个BFC来解决float带来的高度坍塌（至于设置父级高度，那就不是高度坍塌了吧）。`overflow: hidden/auto`、`float: left/right`、`display: table`都是让父级形成BFC的办法。当然形成BFC还有其他办法，比如`display: flow-root`创建一个无副作用的BFC。

1.父级div定义  <font color="red">伪类:after + zoom</font> **推荐使用: 万能清除大法**
```css
.div1 { float: left; width: 100px; height: 100px; border: 1px solid #333; }

.c1:after { content: '', display: block; height: 0; visibility: hidden; overflow: hidden; clear: both;} 
/* IE8以上和非IE浏览器才支持:after */
.c1 { zoom: 1 } /* IE 清除大法，解决ie6以及ie7的浮动问题 */
```

2. 结尾处添加空白div清除浮动 **不推荐：多余空白dom**
```css
    .div1 { float: left; width: 100px; height: 100px; border: 1px solid #333; }

    .c1 { height: 0; visibility: hidden; overflow: hidden; clear: both;}
```

3. 父级div定义 height

    原理： 给浮动的元素增加父级div固定高度， 就解决了父级div无法自动获取到高度的问题

    缺点：只适合高度固定的布局，要给出精确的高度，如果高度和父级div不一样时，会产生问题 

    建议：不推荐使用，只建议高度固定的布局时使用

4. 父级div定义 overflow:hidden
```html
<style>
    .div1{background:#000080;border:1px solid red;/*解决代码*/width:98%;overflow:hidden} 
    .div2{background:#800080;border:1px solid red;height:100px;margin-top:10px;width:98%}

    .left{float:left;width:20%;height:200px;background:#DDD} 
    .right{float:right;width:30%;height:80px;background:#DDD} 
</style>
<body>
    <div class="div1"> 
        <div class="left">Left</div> 
        <div class="right">Right</div> 
    </div> 
    <div class="div2"> 
            div2 
    </div>
</body>
```

    原理：必须定义width或zoom:1，同时不能定义height，使用overflow:hidden时，浏览器会自动检查浮动区域的高度 

    缺点：不能和position配合使用，因为超出的尺寸的会被隐藏 

    建议：只推荐没有使用position或对overflow:hidden理解比较深的朋友使用

5. 父级div定义 overflow:auto
```html
    <style>
        .div1{background:#000080;border:1px solid red;/*解决代码*/width:98%;overflow:auto} 
        .div2{background:#800080;border:1px solid red;height:100px;margin-top:10px;width:98%}

        .left{float:left;width:20%;height:200px;background:#DDD} 
        .right{float:right;width:30%;height:80px;background:#DDD} 
    </style>
    <body>
        <div class="div1"> 
            <div class="left">Left</div> 
            <div class="right">Right</div> 
        </div> 
        <div class="div2"> 
                div2 
        </div>
    </body>
```
    原理：必须定义width或zoom:1，同时不能定义height，使用overflow:auto时，浏览器会自动检查浮动区域的高度 

    缺点：内部宽高超过父级div时，会出现滚动条

    建议：不推荐使用，如果你需要出现滚动条或者确保你的代码不会出现滚动条就使用吧