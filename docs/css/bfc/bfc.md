# 深入理解BFC

在了解BFC机制之前我们首先来了解一个视觉格式化模型

## 视觉格式化模型

视觉格式化模型（view formatting model）用来处理文档并将它显示在视觉媒体上的机制

视觉格式化模型定义了盒模型的概念，盒主要包括了块盒，行内盒，匿名盒（没有名字不能被选择器选中的盒）以及一些实验性的盒（未来可能添加到规范中），css当中使用```display```属性来控制

### 1. 块盒

块盒具有以下的特性

+ 当元素的CSS属性display为block，list-item或 table时，它是块级元素 block-level；
+ 视觉上呈现为块，竖直排列；
+ 块级盒参与(块格式化上下文)；
+ 每个块级元素至少生成一个块级盒，称为主要块级盒(principal block-level box)。一些元素，比如<li>，生成额外的盒来放置项目符号，不过多数元素只生成一个主要块级盒。

### 2. 行内盒（inline box）

+ 当元素的CSS属性display的计算值为inline，inline-block或inline-table时，称它为行内级元素；
+ 视觉上它将内容与其它行内级元素排列为多行；典型的如段落内容，有文本(可以有多种格式譬如着重)，或图片，都是行内级元素；
+ 行内级元素生成行内级盒(inline-level boxes)，参与行内格式化上下文(inline formatting context)。同时参与生成行内格式化上下文的行内级盒称为行内盒(inline boxes)。所有display:inline的非替换元素生成的盒是行内盒；
+ 不参与生成行内格式化上下文的行内级盒称为原子行内级盒(atomic inline-level boxes)。这些盒由可替换行内元素，或 display 值为 inline-block 或 inline-table 的元素生成，不能拆分成多个盒；

### 3. 匿名盒（anonymous box）

匿名盒也有份匿名块盒与匿名行内盒，因为匿名盒没有名字，不能利用选择器来选择它们，所以它们的所有属性都为inherit或初始默认值；

如下面例子，会创键匿名块盒来包含毗邻的行内级盒：

```js

    <div>
      Some inline text
      <p>followed by a paragraph</p>
      followed by more inline text.
    </div>

```

## 三个定位方案

在定位的时候，浏览器就会根据元素的盒类型和上下文对这些元素进行定位，可以说盒就是定位的基本单位。定位时，有三种定位方案，分别是常规流，浮动以及绝对定位。

### 1. 常规流(Normal flow)

+ 在常规流中，盒一个接着一个排列;
+ 在块级格式化上下文里面， 它们竖着排列；
+ 在行内格式化上下文里面， 它们横着排列;
+ 当position为static或relative，并且float为none时会触发常规流；
+ 对于静态定位(static positioning)，position: static，盒的位置是常规流布局里的位置；
+ 于相对定位(relative positioning)，position: relative，盒偏移位置由这些属性定义top，bottom，leftandright。即使有偏移，仍然保留原有的位置，其它常规流不能占用这个位置。

### 2. 浮动(Floats)

+ 盒称为浮动盒(floating boxes)；
+ 它位于当前行的开头或末尾
+ 这导致常规流环绕在它的周边，除非设置 clear 属性；

### 3. 绝对定位(Absolute positioning)

+ 绝对定位方案，盒从常规流中被移除，不影响常规流的布局；
+ 它的定位相对于它的包含块，相关CSS属性：top，bottom，left及right；
+ 如果元素的属性position为absolute或fixed，它是绝对定位元素；
+ 对于position: absolute，元素定位将相对于最近的一个relative、fixed或absolute的父元素，如果没有则相对于body；


## BFC机制

### 1. 什么是BFC格式化上下文

BFC，(block formatting context)块级格式化上下文布局，用于决定块盒子的布局及浮动相互影响范围的一个独立的渲染区域，让处在BFC内部的元素与外部的元素相隔离，使内外部元素定位不相互影响。

### 2. 形成bfc的原因

+ 根元素或其它包含它的元素；
+ 浮动 ```float```值不为```none```
+ 绝对定位元素 ```position```的值是```absolute```，```fixed```
+ 行内块inline-blocks```display```值为```inline-block```
+ 表格单元格```display```值为```table-cell, table-caption```
+ ```overflow```的值不为```visible```
+ 弹性盒 flex boxes (元素的display: flex或inline-flex)；
  
### 3. BFC的范围

BFC的范围在MDN中是这样描述的。

一个BFC包含创建该上下文元素的所有子元素，但不包括创建了新BFC的子元素的内部元素

```js

<div id='div_1' class='BFC'>
    <div id='div_2'>
        <div id='div_3'></div>
        <div id='div_4'></div>
    </div>
    <div id='div_5' class='BFC'>
        <div id='div_6'></div>
        <div id='div_7'></div>
    </div>
</div>

```

这段代码表示，#div_1创建了一个块格式上下文，这个上下文包括了#div_2、#div_3、#div_4、#div_5。即#div_2中的子元素也属于#div_1所创建的BFC。但由于#div_5创建了新的BFC，所以#div_6和#div_7就被排除在外层的BFC之外。

这从另一方角度说明，一个元素不能同时存在于两个BFC中

### 4. BFC的效果

BFC的最显著的效果就是建立一个隔离的空间，断绝空间内外元素间相互的作用。然而，BFC还有更多的特性：

简单归纳一下：

+ 内部的盒会在垂直方向一个接一个排列（可以看作BFC中有一个的常规流）；
+ 处于同一个BFC中的元素相互影响，可能会发生margin collapse；
+ 每个元素的margin box的左边，与容器块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此；
+ BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素，反之亦然；
+ 计算BFC的高度时，考虑BFC所包含的所有元素，连浮动元素也参与计算；
+ 浮动盒区域不叠加到BFC上；

### 5. 格式化上下文布局与普通文档流布局区别

普通文档流布局：

+ 浮动的元素是不计算进父级高度的
+ 非浮动的元素会覆盖浮动元素的位置
+ margin会传递给父级
+ 两个相邻元素的```上下margin```会重叠

格式化上下文布局

+ 浮动的元素是计算进父级高度的
+ 非浮动的元素不会覆盖浮动元素的位置
+ margin不会传递给父级
+ 属于同一个bfc的两个相邻元素的上下```margin```会重叠


### 6. 实际应用场景

+ 阻止margin重叠
+ 可以包含浮动元素 —— 清除内部浮动(清除浮动的原理是两个 div都位于同一个 BFC 区域之中)
+ 可以阻止元素被浮动元素覆盖
+ 自适应两栏布局