# pis-node 通用库说明

1. 添加到 node modules : cd pis-node -> npm link 
2. 在目标工程中添加 :  cd pisv2.0 -> npm link pis-node
3. 制作pis-node-ghost 在其它系统中进行修改  //TODO 补充 
   windows  mklink

#说明
bri.comm  常用用代码封装 不依赖于第三方包的
bri.help  常用代码封装   以来第三方包 如 mysql
bri.web.comm.js    public/bri.web.comm.js
bri.convert.js    文字转换类功能

global.config.js 全局加载代码
eggjs     eggjs 框架封装

使用说明
const {global,comm,convert,egg，helper，utils} = require("pis-node").bri;

## 常用第三方库说明
url 系统模块
url-parse  兼容 前后端

js-beautify  格式化模块，支持js,css,html
mongodb
mongoose ODM的mongodb库

js-git     用法不清晰
nodegit    用法清晰，依赖  libstdc++ ， Unsupported platform for fsevents@1.1.3: wanted {"os":"darwin","arch":"any"} (current: {"os":"win32","arch":"ia32"})

body-parser  express 的解析request bodies
cookie-parser express 的解析 Cookie
cheerio html解析类jquery
debug : A tiny JavaScript debugging utility modelled after Node.js core's debugging technique. Works in Node.js and web browsers.

line-reader 

mysql2： fast mysql driver. Implements core protocol, prepared statements, ssl and compression in native JS、

node的偶数版本是稳定版本（长期支持版），奇数版本可以是开发版本，主要用于集成新功能，进行一些修改

Node 模块特分散,同一功能有好多模块可以选择，眼花缭乱

日志
    tracer
    log4js
    bunyan

line-reader  按行读取文本 不活跃，多年未更新
ndir  目录操作，不活跃，多年未更新


nrm 快速npm换源，支持npm,cnpm,taobao等源，可以测试网速

socket.io https://www.npmjs.com/package/socket.io

lodash  具有一致接口、模块化、高性能等特性的 JavaScript 工具库
underscore是一个JS工具库，主要提供了对数组，对象，函数等一些基础工具函数，可以同时在浏览器和NodeJS环境中运行。建议在每个项目中使用。
moment是一个日期工具库，主要提供了对日期的解析，验证，操作和格式化等，如果需要对日期作较多的操作或比较复杂的操作，则它是一个不错的选择，毕竟JS自带的Date功能太弱了。
Connect是一系列的中间件的集合，包括日志，session, cookie, body parser等，它做了大量HTTP相关的基础性的工作，Express框架就依赖它进行工作的。
 
 
vm  vm2 沙箱运行空间

node网络请求
    http  系统库
    
    npm install request  支持https 和重定向
    npm install r2  使用的node-fetch 为2.0 beta版，部分网站在调用clone时候导致内容丢失，要么更换依赖，要么删除 resp.clone() 的clone
    npm install got

    npm install node-fetch
    npm install node-fetch-polyfill

    npm install fetch  (不推荐  github 关注人较少且代码结构不大好)
    npm install fetch-jsonp (不推荐 github 关注人较少且代码结构不大好)
    


html解析
    cheerio，服务端的jquery。 封装了 htmlparser2
    node-jquery  npm install jquery,还是浏览器端的代码，并没有模块化
    jsdom  npm install jsdom   JSDOM内建的解析太过于严格: JSDOM附带的HTML解析不能处理很多当下的大众的网站。
    htmlpaser  https://npm.taobao.org/package/htmlparse
    htmlparser2 https://npm.taobao.org/package/htmlparser2
   
 
项目

grunt 自动化工具，提高前段开发效率，支持less，sass等插件
gulp 自动化工具，与gulp类似，语法更加像js，可以进行开发
Yeoman 快速构建项目，包括angular，aspnet，meanjs等项目
browser-sync 取代LiveReload为新型浏览器自动刷新插件，提高多浏览器开发效率，它自带命令行操作，是前段网页必备良药
JSLint 提高JS代码质量，检查它的错误
JSHint 检查JS错误和潜在的问题
Glue 命令行工具生成CSS

打包

browerify 打包node后端程序成为前段js
webpack 新的打包工具，与browserify各有优劣


## 直接用第三方库
lodash  underscore  moment  工具类
request r2 got  node-fetch   网络
cheerio                     html解析
crypto(系统库 require('crypto').getHashes() getCiphers() )  加密
URSA - RSA public/private key OpenSSL bindings for Node.js

jade 模板

## 数据库连接

mongodb
mongoose
redis
msyql



