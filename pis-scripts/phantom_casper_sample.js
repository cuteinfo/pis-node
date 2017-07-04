


/**
 * 使用方法
 * 1. casperjs sample.js
 * 2. node casperjs.js sample.js (window下不可)
 * 3. phantomjs casperjs.js sample.js
 */

// var casper = require('casper').create();
var casper = require('casper').create({
    verbose: true,
    logLevel: "debug",
    exitOnError:true,
    ignoreSslErrors:true,
    viewportSize:{width: 1920, height:1080 }
    // clientScripts:  [
    //     'includes/jquery.js',	  // These two scripts will be injected in remote
    //     'includes/underscore.js'   // DOM on every request
    // ],
    // pageSettings: {
    //     loadImages:  false,		// The WebPage instance used by Casper will
    //     loadPlugins: false		 // use these settings
    // },
});
/**
*
*执行 casperjs sample.js 后 需要稍等一会儿就，因为是后台起线程
 * 后台也是调用的phantomjs 或 slimerjs ,只能引入fs 模块
*/

/**
 * casperjs 可以做两件事,一是对文件操作，二是访问网络
 *保存数据有两种方式:
 * 1.把你抓取的数据结构化保存到文件里，然后用另外的程序去读文件并保存到数据库中
 * 2.做一个保存数据的web url形式的接口（可以是只能内部访问的），然后在程序中用访问url的形式发送数据进行保存。
 *
 */

//API  http://docs.casperjs.org/en/latest/modules/index.html
var fs = require("fs");


phantom.outputEncoding="GBK";//控制台打印乱码的问题

// 实例 微博登录并打印cookie


//发起网络请求
// casper.open('http://some.testserver.com/post.php', {
//     method: 'post',
//     data:   {
//         'title': 'Plop',
//         'body':  'Wow.'
//     }
// });
// data = this.evaluate(function(wsurl) {
//     return JSON.parse(__utils__.sendAJAX(wsurl, 'GET', null, false));
// }, {wsurl: wsurl});

// Casper ships with a few client-side utilities which are injected in the remote DOM environment, and accessible from there through the __utils__ object instance of the ClientUtils class from the clientutils module:
// casper.evaluate(function() {
//     __utils__.echo("Hello World!");
// });

var captureConfig={
    // top: 100,
    // left: 100,
    // idth: 500,
    // height: 400


};
captureConfig = { width: 1920, height: 1080 };


//TODO  运行结束为什么都是返回空白页 [debug] [phantom] url changed to "about:blank"
// page.viewportSize = {
//     width: 1920,
//     height: 1080
// };
casper.start("http://weibo.com/login.php",function(){
    this.capture("login0.jpg", undefined, {
        format: 'jpg',
        quality: 75
    });
    console.log(this.getCurrentUrl());
});
// casper.thenEvaluate(function(args) {
//     this.echo("then set values");//不会打印
//     console.log("then set values");//不会打印
//     //document.querySelector('input[name="username"]').setAttribute('value', "collectdocu@126.com");
//     document.querySelector('input[name="username"]').value="collectdocu@126.com";
//     document.querySelector('input[name="password"]').value= "Plp!@#8BoPVv";
//     this.capture("login1.png");//不会截图
//     document.querySelector('a[ node-type="submitBtn"]').click();
// }, 'nothing');
casper.then(function(){
    this.evaluate(function(){
        document.querySelector('input[name="username"]').value="collectdocu@126.com";
        document.querySelector('input[name="password"]').value= "Plp!@#8BoPVv";
        //document.querySelector('a[ node-type="submitBtn"]').submit();
    });
    this.scrollToBottom();
    this.capture("login1.jpg",undefined,captureConfig);
})
casper.then(function(){
    this.click("a[ node-type=submitBtn]");//这样才可以，evaluate中貌似不可以
    // this.evaluate(function(){
    //     document.querySelector('a[ node-type="submitBtn"]').submit();
    // });
    this.echo("then infos");
   // this.capture("login2.png");
    // this.echo(JSON.stringify(phantom.cookies));

});
// casper.waitFor(function check() {
//     return this.evaluate(function() {
//         return document.querySelectorAll('ul.your-list li').length > 2;
//     });
// }
casper.wait(3000, function() {
    this.echo("waiting for longin");
});
casper.then(function(){
    //微博首页截屏出来的四角 有弯曲、登录页布局有问题，和css有关系？
    //修改 option 中 viewportSize 效果有改善
    this.capture("login2-1.jpg",undefined,captureConfig);
    this.capture("login2.jpg",{
        top: 100,
        left: 100,
        width: 1600,
        height: 800
    },captureConfig);
    // console.log(this.captureBase64('jpg', {
    //     top: 0,
    //     left: 0,
    //     width: 1920,
    //     height: 1200
    // }));
});
casper.thenOpen("http://news.baidu.com",function(){
    this.capture("baidu-index.jpg",undefined,captureConfig);
    this.download(url, 'google_company.html');
});
//
// var links = [
//     'http://google.com/',
//     'http://yahoo.com/',
//     'http://bing.com/'
// ];
//
// casper.start().each(links, function(self, link) {
//     self.thenOpen(link, function() {
//         this.echo(this.getTitle());
//     });
// });

//demo 例子
//console.log("start ...");
// var links = ['http://www.baidu.com','http://www.sogou.com','http://www.sina.com.cn']
// casper.start('http://www.baidu.com', function() {
//     //this.echo(this.getTitle());
//     fs.write("F:/test.content.text", this.getTitle()+"\r\n", 'a');
// });



// casper.start('http://www.google.fr/', function() {
//     this.capture('google.png', {
//         top: 100,
//         left: 100,
//         width: 500,
//         height: 400
//     });
// });
// casper.start('http://www.google.fr/', function() {
//     this.echo(this.getHTML());
// });
//
// casper.start('http://www.google.fr/', function() {
//     this.echo('Page title is: ' + this.evaluate(function() {
//             return document.title;
//         }), 'INFO'); // Will be printed in green on the console
// });
// casper.evaluate(function(username, password) {
//     document.querySelector('#username').value = username;
//     document.querySelector('#password').value = password;
//     document.querySelector('#submit').click();
// }, 'sheldon.cooper', 'b4z1ng4');
//
// casper.thenEvaluate(function(term) {
//     document.querySelector('input[name="q"]').setAttribute('value', term);
//     document.querySelector('form[name="f"]').submit();
// }, 'CasperJS');
//
// casper.then(function() {
//     // Click on 1st result link
//     this.click('h3.r a');
// });
// casper.then(function() {
//     // Click on 1st result link
//     this.click('h3.r a',10,10);
// });
// casper.then(function() {
//     // Click on 1st result link
//     this.click('h3.r a',"50%","50%");
// });
//
// casper.then(function() {
//     console.log('clicked ok, new location is ' + this.getCurrentUrl());
// });
//
//
//
// String.prototype.cnStringToAscii = function() {//汉字转换ascii
//     return escape(this).replace(/%u/g, '\&#x');
// };
// String.asciiToCnString = function(asciiChars) {//ascii转换成汉字
//     return String.charCodeToCnString(asciiChars, /(\&#x)(\w{4})/gi);
// };
// for(var i=0;i<links.length;i++){
//     var link = links[i];
//     console.log(link);
//     console.log(i);
//     casper.thenOpen(link, function() {
//         fs.write("F:/test.content.text", this.getTitle()+"\r\n", 'a');
//         console.log(this.getTitle());
//         // this.echo(this.getTitle());
//         // this.echo(this.getContent());
//     });
// }
// casper.thenOpen('http://weibo.com', function() {
//     this.echo(this.getTitle());
// });

//console.log("end ...");
casper.run();