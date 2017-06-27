var casper = require('casper').create();


/**
 * 使用方法
 * 1. casperjs sample.js
 * 2. node casperjs.js sample.js (window下不可)
 * 3. phantomjs casperjs.js sample.js
 */


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


var fs = require("fs");


phantom.outputEncoding="GBK";//控制台打印乱码的问题
//console.log("start ...");
var links = ['http://www.baidu.com','http://www.sogou.com','http://www.sina.com.cn']
casper.start('http://www.baidu.com', function() {
    //this.echo(this.getTitle());
    fs.write("F:/test.content.text", this.getTitle()+"\r\n", 'a');
});
String.prototype.cnStringToAscii = function() {//汉字转换ascii
    return escape(this).replace(/%u/g, '\&#x');
};
String.asciiToCnString = function(asciiChars) {//ascii转换成汉字
    return String.charCodeToCnString(asciiChars, /(\&#x)(\w{4})/gi);
};
for(var i=0;i<links.length;i++){
    var link = links[i];
    console.log(link);
    console.log(i);
    casper.thenOpen(link, function() {
        fs.write("F:/test.content.text", this.getTitle()+"\r\n", 'a');
        console.log(this.getTitle());
        // this.echo(this.getTitle());
        // this.echo(this.getContent());
    });
}
// casper.thenOpen('http://weibo.com', function() {
//     this.echo(this.getTitle());
// });

//console.log("end ...");
casper.run();