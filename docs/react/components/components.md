# 如何避免生命周期中的坑

如何避免坑？”换种思维思考也就是“为什么会有坑？”在代码编写中，遇到的坑往往会有两种：

+ 一种是在不恰当的时机调用了不合适的代码；

+ 一种是在需要调用时，却忘记了调用。

回到本题，在生命周期中出现的坑，那就一定跟生命周期有关。所以，**通过梳理生命周期，明确周期函数职责，确认什么时候该做什么事儿，以此来避免坑。**

根据破题的思路，我们需要确立讨论的范围：

+ 基于周期的梳理，确认生命周期函数的使用方式；

+ 基于职责的梳理，确认生命周期函数的适用范围。

**以此建立时机与操作的对应关系。**

