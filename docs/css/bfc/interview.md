# 介绍下 BFC 及其应用

解答： 

**1. 介绍bfc**

bfc（block formatting context），块级格式化上下文，用来决定块盒子的布局及浮动相互影响范围的独立渲染区域，让处在bfc的内部元素与外部元素相互隔离，使内外部元素定位不相互影响。

**2. BFC的效果，换句话说块级格式化上下文布局的特性**

+ 计算BFC的高度时，考虑BFC所包含的所有元素，连浮动元素也参与计算，解决浮动元素造成的父元素高度塌陷
+ 处在块级格式化上下文的元素会垂直进行排列
+ BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素
+ 处在块级格式化上下文的元素之间会相互影响，margin会重叠
+ 每个元素margin box的左边与容器的border box左边相接触（即BFC内部的元素margin不会传递给父级）


**3. bfc的产生过程**

+ 1、根元素
+ 2、弹性盒子，即`display: flex;display: inline-flex;`
+ 3、行内块盒子，即`display: inline-block;`
+ 4、绝对定位为absolute或者fixed的元素，即`position: absolute; position: fixed;`
+ 5、表格单元格，即`display: table-cell;display: table-caption;`
+ 6、`float`值不为`none`
+ 7、`overflow`值不为`visible`

**4. bfc的应用**

+ 解决浮动元素造成的父元素高度塌陷
+ 自适应两栏布局
+ 可以包含浮动元素 —— 清除内部浮动(清除浮动的原理是两个 div都位于同一个 BFC 区域之中)