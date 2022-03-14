# axios相关面试题


axios在使用的过程中存在的一些弊端

1. 日常使用的注意点：responseType = json 非手动设置
   
如果设置 **Axios responseType** 为 **json** 时，服务端返回的非 **JSON** 格式的响应内容会因为无法解析，**response.data** 为 **null**，对于500的错误，响应内容会丢失，所以不能去配置responseType为json；虽然axios官网文档声明responseType = json，但是其内部的代码底层调用 **XMLHttpRequest** 的 **responseType** 是没有传值的，应该是为了规避这个问题

2. Axios 默认不管 HTTP 响应状态和 responseType 是什么，都会调用默认的 transformResponse

> 应该是为了规避上一个问题，默认提供了一个响应处理函数进行 JSON 解析，但是这会影响性能（500 等响应内容值较多时，会造成页面卡顿）。虽然 transformResponse 可以转换 response，实际接收到的参数是 response.data，所以无法判断具体情况来决定是否进行解析 JSON

3. Axios then 和 catch 是根据 validateStatus 决定的，使用者处理以来较为麻烦

> 理想情况下，使用者希望 then 返回有效的数据，catch 返回各种错误情况：请求被取消、网络异常、网络超时、服务端异常、服务端数据格式错误、业务异常。

4. Axios 默认不处理 content-type 为 application/x-www-form-urlencoded 类型的请求体，使用起来不够方便