# 从浏览器地址栏输入url到请求返回发生了什么?

1. 首先会进行 url 解析，根据 dns 系统进行 ip 查找

**为什么url要解析（也就是编码）？**

因为网络标准规定了URL只能是字母和数字，还有一些其他的特殊字符（-_.~ ! * ' ( ) ; : @ & = + $ , / ? # [ ]，如果不进行转义会出现歧义，如果说 `?key=value=value`就会出现歧义

**url编码的规则是什么？**

url编码只是简单的在特殊字符的各个字节前加上%；比如`name1=va&lu=e1`,对其进行编码后就变成`name1=va%26lu%3De1`,这样服务端会把紧跟在`%`后的字节当成普通的字节，就是不会把它当成各个参数或键值对的分隔符