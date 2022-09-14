# 编码解码

`编码(encode)`、`解码(decode)`、`代码(code)`是什么？

代码：是用来表示事物的记号，它可以是`数字`、`字母`、`特殊符号(如$)`或它们之间的组合来表示。

编码：是信息从一种形式转换成另一种形式的过程。目的是便于计算机分析和处理

解码：是编码的逆过程。

程序就是由若干的代码组成，代码的表示形式如下：

```tsx
var code = '123'
```

上面这段代码，经过编码之后，得到：

```tsx
'\x76\x61\x72\x20\x63\x6F\x64\x65\x20\x3D\x20\x27\x31\x32\x33\x27'
```

其中，`\x76`就是对应的十六进制，也可以写成`0x76`或`0X76`，换算成十进制就是`118`，对应到ASCII表上就是字母`"v”`。依次类推。这里可以通过JavaScript的`String.fromCharCode`来方便计算出某个十进制对应的是哪个字符。比如：`String.fromCharCode(97)`就是`”a”`。

这个`ASCII(American Standard Code for Information Interchange)`就是美国信息交换标准代码，作用就是显示现代英语和其他欧洲语言。到目前为止，总共定义了128个字符。二进制`0b01111111`就等于128，分为`低四位(1111)`和`高四位(0111)`，比如二进制`0b00110000`就表示字符`”0”`。从下图可以看出：

1. 前`32位(0 ~ 31)`都是不可打印字符；所谓不可打印就是没法在屏幕上显示
2. 后`96位(32 ~ 127)`都是打印字符；

![Untitled](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/690d2dec-3c00-4356-9ccd-330e7680df7d/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220913%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220913T064854Z&X-Amz-Expires=86400&X-Amz-Signature=24c98508b9e7a6b33ef842fabbbd6bf8b609e7dab26e64f5b15734840045776e&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22Untitled.png%22&x-id=GetObject)

为什么要编码、解码？

方便信息的交换和传递

如何编码、解码？

在Nodejs中，通过`Buffer.from`来编码，通过`buffer.toString(encodeType)`来解码，其中encodeType可以是`utf8`、`ascii`、`base64`等

```jsx
// 编码
const bf = Buffer.from("hello **中国**")
console.log(bf) // <Buffer 68 65 6c 6c 6f 20 **e4 b8 ad** **e5 9b bd**>

// 解码
const content = bf.toString("utf-8")
console.log(content) // "hello 中国"
```

Buffer用来处理二进制内容，比较适合流式处理。如上看到的`<Buffer 68 65 6c 6c 6f 20 e4 b8 ad e5 9b bd>`，其中的68就是以十六进制表示二进制，因为二进制展示不便于阅读，且占空间比较多。

被转换字符在ASCII码表里：

十六进制的68转二进制：`0x68` ⇒ `0b1101000`。

十六进制的68转十进制：`0x68` ⇒ `104`，还在ASCII码表范围`(0 ~ 127)`内，故可以直接从里面查找对应字符，为`“h”`。

被转换字符不在ASCII码表里，比如：

十六进制的e4转二进制：`0xe4` ⇒ `11100100`。

十六进制的e4转十进制：`0xe4` ⇒ `228`，228已经超过ASCII码表范围，那该如何处理呢？

注意到上面黑色粗体加下划线的字符，一个`中`字是由3个字节编码`(e4 b8 ad)`的，并且首字节是以`e`打头的，这3个字节组合起来`(e4b8ad)`就代表了一个汉字。猜测：也就是相当于告诉解码器，遇到e打头的字节就知道是要解析汉字了，当遇到下一个e打头的字节时表明一个汉字的字节就是2个e之间且包括第一个e的范围。

---

编码的类型

1. UTF-8：是针对Unicode的`可变长度`字符编码
2. UTF-16：采用2个字节进行字符编码
3. Unicode：万国码。宽字节字符集，对每个字符固定使用2个字节即16位表示
4. base64

怎么知道一个文件是UTF-8还是UTF-16编码？

- 文件开头有 `EF BB BF` 表示UTF-8编码
- 文件开头有 `FE FF` 表示UTF-16编码

Tips：Mac中可以通过`file -I {fileName}`查看文件编码类型

```bash
file -I hello.txt
# 输出：hello.txt: text/plain; charset=utf-8
```

做了个文件编码小测验，新建`hello.txt`文件：

1. 当文件内容只有英文字符时，命令行执行`file -I hello.txt`，得到：`hello.txt: text/plain; charset=us-ascii`

```
Hello, my name is Peter, nice to meet you!
```

1. 当文件内容是中英混搭时，命令行执行`file -I hello.txt`，得到：`hello.txt: text/plain; charset=utf-8`

```
Hello, my name is 爱生豪威尔，很高兴认识大家！
```

综上可得，文件的编码类型会根据内容动态调整，保证编码的内存占用最少。

文本文件和二进制文件

- 文本文件：文件内容都是采用ASCII字符组成，也叫ASCII码文件
- 二进制文件：文件内容存在非ASCII字符

比如数5678，ASCII码表示为`00110101 00110110 00110111 00111000`，十进制码表示为5678，共占用`4个字节(4 x 8 = 32位)`