## 1. 请用一句话描述 try catch 能捕获到哪些 JS 异常?

能捕捉到的异常，必须是线程执行已经进入```try catch``` 但 ```try catch``` 未执行完的时候抛出来的。
相对于外部``` try catch```，```Promise``` 没有异常！事实上，Promise 的异常都是由``` reject ```和``` Promise.prototype.catch``` 来捕获，不管是同步还是异步。
**核心原因**是因为 Promise 在执行回调中都用` try catch `包裹起来了，其中所有的异常都被内部捕获到了，并未往上抛异常。

## 2. 