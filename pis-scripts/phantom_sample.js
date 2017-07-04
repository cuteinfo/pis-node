var webpage = require('webpage').create();
var fs = require('fs');


/**
 * phantomjs 可以做两件事,一是对文件操作，二是访问网络
 *保存数据有两种方式:
 * 1.把你抓取的数据结构化保存到文件里，然后用另外的程序去读文件并保存到数据库中
 * 2.做一个保存数据的web url形式的接口（可以是只能内部访问的），然后在程序中用访问url的形式发送数据进行保存。
 *
 */

phantom.outputEncoding="GBK";//控制台打印乱码的问题
//var wasSuccessful = phantom.injectJs('lib/utils.js');


phantom.onError = function(msg, trace) { //被 page.onError处理
    var msgStack = ['PHANTOM ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function(t) {
            msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function +')' : ''));
        });
    }
    console.error(msgStack.join('\n'));
    phantom.exit(1);
};
// phantom.addCookie({
//     'name': 'Added-Cookie-Name',
//     'value': 'Added-Cookie-Value',
//     'domain': '.google.com'
// });
webpage.onResourceReceived = function(response) {
    // console.log(response.url);//TODO 获取验证码
};

webpage.settings ={
    loadImages:true,
    // userAgent:"",
    // resourceTimeout:10000,

}
webpage.customHeaders={} ;//请求时在http请求头部添加额外信息
// var ua = page.evaluate(function () {
//     return document.getElementById('myagent').innerText;
// });
//window === this
// 如果使用web page模块打开页面，则请不要在此window对象下进行任何DOM相关的操作，
// 因为这个window并不是page对象内的window。如果想要执行dom相关操作，请参阅 page.evaluate()部分。
//page.uploadFile(selector, file)

//phantom.injectJs(filename) 引入外部js

//调用外部命令
// spawn(command, [args], [options])
// execFile(cmd, args, opts, cb)

//发起网络请求

// var page = require('webpage').create(),
//     server = 'http://posttestserver.com/post.php?dump',
//     data = 'universe=expanding&answer=42';
//
// page.open(server, 'post', data, function (status) {
//     if (status !== 'success') {
//         console.log('Unable to post!');
//     } else {
//         console.log(page.content);
//     }
//     phantom.exit();
// });



//文件读写
file = fs.open("main.js", 'a');
file.write("123");
file.close();
fs.write(path, content, mode/opts)

webpage.onUrlChanged = function (url) {
    console.log("redirect:",url);
    var cookies = JSON.stringify(webpage.cookies );

    //this.render('weibo-content.jpeg', {format: 'jpeg', quality: '100'});//此处不起作用,可能是只有在open中才有当前页的概念，在open中用 setTimeOut处理
    //console.log(cookies);//cookies
    fs.write("./cookies1.txt",cookies);
}
// webpage.open('https://passport.weibo.cn/signin/login', function (status) {
webpage.open('http://weibo.com/login.php', function (status) {

    //引入jquery
    // page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
    // });
    webpage.render('weibo-login.jpeg', {format: 'jpeg', quality: '100'});
    if (status !== 'success') {
        console.log('Unable to access network');
    } else {
        console.log("else");
        //console.log(webpage.content);

        // evaluateAsync
        //evaluate(function(args){},[args]);
        var js = webpage.evaluate(function() {
            console.log(document.title);//内部的打印方法无法执行
            //weibo.com
            document.querySelector("#loginname").value="collectdocu@126.com";
            document.querySelector("input[type=password]").value="Plp!@#8BoPVv";
            document.querySelector(".login_btn").querySelector("a").click()


            //weibo.cn
            // document.querySelector("#loginName").value="collectdocu@126.com";
            // document.querySelector("#loginPassword").value="Plp!@#8BoPVv";
            // document.querySelector("#loginAction").click();

        });
        console.log("logining...");
        //console.log(document.title); //在外部也无法打印，而且会阻塞 应该是报错并停止执行了 JSON.parse也是
        console.log(webpage.cookies );//cookies
        console.log(JSON);
        try{
            //console.log(JSON.parse(webpage.cookies ));//cookies
            var cookies = JSON.stringify(webpage.cookies );
            console.log(cookies);//cookies
            fs.write("./cookies.txt",cookies,function(err){
                if(err) throw err;
                console.log('cookie 写入成功');//此处cookie不正确，需要等待页面跳转后的才是登录成功的
            });
        }catch (e){
            console.log("eerroorr",e);
        }
        setTimeout(function () {
            webpage.render('weibo.jpeg', {format: 'jpeg', quality: '100'});
        }, 3000);



    }


    // webpage.close();//关闭网页
    // phantom.exit();//退出phantomjs命令行
});