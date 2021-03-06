---
layout: article
title: 全栈课程04&05 通信与数据交互
categories: [大前端]
tags: [其他, 全栈课程]
---

# 数据交互

## 目前主流方式

1. 表单: 最基本、最简单（`http`所有的数据交互其实都是表单）
2. `ajax`: 不用刷新，最常用，在服务器配合下也可以跨域
3. `jsonp`: 较老的跨域方法，安全性太差，逐渐淡出
4. `websocket`: 相对`ajax`性能比较高

对于服务器来说，是区分不了表单、`ajax`、`jsonp`，除非是人为标记。

## 表单

### 属性

- `action`，提交地址
- `method`，提交方法
    * `GET`,
    * `POST`,
    * `PUT`,
    * `HEADER`,
    * `DELETE`
    * 甚至自定义
- 表单项的`name`必须使用，后端获取数据的`key`；可以重复，此时服务器获得的是数组
- `submit`提交按钮

### 提交方法

- `GET`,数据放在`url`中
    * 容量有限
    * 能被用户看见（仅限于表单中的`GET`）
    * 有缓存
    * 利于分享和收藏（可以放在书签中）
- `POST`，数据在请求体中
    * 容量大，但是过大（比如几个G的视频）也要使用其他方式
    * 用户不可见
    * 不缓存
    * 没法分享和收藏

注意：`GET`和`POST`安全性完全一样，真正的安全方式`https`。

`POST`请求时两种`Content-Type`: `multipart/form-data`(文件上传时，在`form`标签中设定)、`application/x-www-form-urlencoded`

### 表单校验

绑定表单的`submit`事件

### 表单重复提交

- 开始提交时，禁用提交按钮
- 提交完成（成功/失败），重新启用提交按钮

## ajax

- 依赖于`XMLHttpRequest`对象，它本身是不兼容`IE6`的
- `IE6`的`ajax`：`ActiveObject`

### XMLHttpRequest

- 连接，`xhr.open(method, url, isAsync)`，`isAsync`是否异步
    * 同步：串行（在很多浏览器中`ajax`的同步已被废弃）
    * 异步：并行
- 发送，`xhr.send()`
- 接收，`xhr.onreadystatechange`，`xhr.readystate`
    * 0 初始化，刚刚创建
    * 1 已连接
    * 2 已发送
    * 3 已接收（头部）
    * 4 已接收（body），此时需要查看`xhr.status`（`http`状态码）
- 结果数据
    * `xhr.responseText`，文本数据
    * `xhr.responseXML`，以`XML`返回的数据

#### get

```javascript
let xhr = new XMLHttpRequest();
xhr.open('get', './index.php?a=3&b=2',true);
xhr.onreadystatechange = () => {
    if(xhr.readyState===4){
        if(xhr.status>=200 && xhr.status<300 || xhr.status===304){
            console.log('成功：'+xhr.responseText);
        }else{
            console.log('失败：'+xhr.status);
        }
    }
};
xhr.send();
```

#### post

```javascript
let xhr = new XMLHttpRequest();
xhr.open('post','./2.php', true);
xhr.onreadystatechange = ()=>{
    if(xhr.readyState === 4){
        if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
            console.log(xhr.responseText);
        }else{
            console.log('failed to load data');
        }
    }
};
xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
xhr.send('a=2&b=3');
```
#### 封装

以下是一个利用`XMLHttpRequest`对`ajax`进行手工封装的尝试：

```javascript
/**
 * @param {ajax请求选项} options 
 * 可能选项包括：url,type,data,datatype,success,error
 * 默认参数：请求方式: get，请求参数：{}，数据类型： text
 */
function ajax(options){
    // 不兼容IE6

    // 默认GET请求、普通文本、无参数
    options = options || {};
    options.data= options.data || {};
    options.type = options.type || 'GET';
    options.dataType = options.dataType || 'text';

    // 将查询参数对象转为查询字符串
    let dataArr = [];
    for(let name in options.data){
        dataArr.push(`${encodeURIComponent(name)}=${encodeURIComponent(options.data[name])}`);
    }
    let dataStr = dataArr.join('&');

    // 新建xhr对象并open
    let xhr = new XMLHttpRequest();
    if(options.type.toLowerCase() === 'get'){
        xhr.open('get', options.url+'?'+dataStr, true);
    }else if(options.type.toLowerCase() === 'post'){
        xhr.open('post', options.url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    }

    // 绑定返回响应时间
    xhr.onreadystatechange = ()=>{
        if(xhr.readyState === 4){
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304){
                let data;
                switch(options.dataType.toLowerCase()){
                    case 'json':
                        if(window.JSON && JSON.parse){
                            data = JSON.parse(xhr.responseText);
                        }else{
                            data = eval('('+xhr.responseText+')');
                        }
                        break;
                    case 'xml':
                        data = xhr.responseXML;
                        break;
                    default:
                        data = xhr.responseText;
                        break;
                };
                options.success && options.success(data);
            }else{
                options.error && options.error();
            }
        }
    };

    // 发送
    xhr.send(options.type.toLowerCase() === 'post' ? dataStr : null);

}
```

### http状态码
 
 - 1xx，消息
 - 2xx，成功
 - 3xx，重定向
    * 301，永久重定向——浏览器永远不会再次请求老地址，不轻易用
    * 302，临时重定向——一次性，浏览器下次还会请求老地址
    * 304，`not modified`，缓存，告诉客户端本地的缓存未被修改可直接用
 - 4xx，请求错误（客户端）
 - 5xx，服务端错误
 - 6xx往后，扩展

#### 重定向与转发

- 重定向：给浏览器的命令，让其向另一个地址发送请求，地址会改变
- 转发：在服务器内部，把请求交给另一个模块处理，对客户端是不可见的，地址不变

### XML

`XML`早于`HTML`，也是由标签构成，但是没有固定的标签名，比`json`浪费空间。

## jsonp

- 逐渐淡出，用于跨域
- 有安全性问题（过于开放，接口很容易能被他方调用）

## ajax CORS跨域

## websocket

## formData

## 比较

### ajax和表单比较

- 表单更稳定些（特别是在用户网络差的时候）
- `ajax`，用户体验好些
- 和场景也相关

### ajax与websocket比较

- `ajax`: 性能低，单向通信，跨域麻烦
- `websocket`: 性能高，双向通信（双工），默认可以跨域

# 跨域

- 浏览器同源策略初衷：安全，避免`XSS`(Cross Origin Scripts)，跨站脚本攻击
- 为什么需要跨域
    * 一个公司的多个（比如新旧）网站
    * 使用第三方数据交互
- 目前跨域方法
    * 表单，比如表单方式的网银支付
    * `ajax`，麻烦
    * `jsonp`，简单但不安全
    * `websocket`，新兴，并还没有广泛支持；但是如果真的需要，也可以让其在低版本浏览器上运行

# 网络

## OSI

`OSI`模型，即开放式通信系统互联参考模型(Open System Interconnection,OSI/RM,Open Systems Interconnection Reference Model)，是国际标准化组织(`ISO`)提出的一个试图使各种计算机在世界范围内互连为网络的标准框架，简称`OSI`。该模型有七层（参考模型），实际用的是五层。

### 七层参考模型

1. 物理层，物理学家、材料工程关注：材料、电压
2. 链路层，内网寻址，`ARP`、`ICMP`
3. 网络层，外网寻址，`IP`
4. 传输层，通信稳定性，`TCP`
5. 表现层，（统一各种网络的结构）
6. 会话层，（让服务器记录以往访问状态）但是实际中都是无状态通信
7. 应用层，应用细节，`HTTP`（基于`TCP`）、`FTP`、`SMTP`、`POP3`

### 实际计算机网络的五层

1. 物理层
2. 链路层
3. 网络层
4. 传输层
5. 应用层

### 两个协议

- `TCP`，传输控制协议，（应用：文件下载、聊天、游戏），`socket`就是该协议
    * 保证到达
    * 保证质量
    * 保证顺序
- `UDP`，用户数据报协议，（应用：对延迟要求高，对错误不敏感，如直播、视频电话）
    * 不保证到达
    * 不保证质量
    * 不保证顺序


## http协议

### 连接过程

- 客户端与服务器连接：三次握手，客户端连接请求、服务器接受、客户端发送请求
- 请求与返回消息，`request`和`response`
    * 消息头部（首部），<=32k
    * 消息体（内容），<=1G
- `GET`请求的数据是放在头部，所以容量很受限，而`POST`则可以发送大量数据

### http与https

- `http`，容易被窃听
- `https`，安全

### 版本

- `http1.0`，一次性链接
- `http1.1`，保持链接，从而导致性能很大的提示
- `http2.0`，目前是草案，还没有彻底定稿
    * 强制`https`
    * 自带双向通信
    * 多路复用

# 外话

## 安全性

- 系统级安全性，个人难以解决
- 代码安全性，程序员需要关注的，重要来源——蠢，懒，不重视

## 单点登录

OAuth，指多个客户端（比如淘宝、阿里云等）采用同一个验证服务器来进行登录验证。

## RESTful

不是接口、不是标准，是一种风格、习惯；根据请求`method`和`url`共同决定接口访问的实际效果。

## 数据提交常用Content-Type

- `text/plain`，纯文本
- `application/x-www-form-urlencoded`，`urlencoded`是指`key=value&key=value`形式（简单数据）
- `multipart/form-data`，用定界符分割各个数据（文件上传）


