


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
    viewportSize:{width: 1920, height:1080 },
    onError:function(casper,msg,strace){
        console.log("error",msg);
    },
    waitTimeout:100*60*1000 ,
    //stepTimeout:2*60*1000,
    //onStepTimeout:function(){},
    onStepComplete:function(){
        this.capture("error/step/git-"+new Date().getTime()+".jpg", undefined, {
               format: 'jpg',
               quality: 75
        });
    },
    retryTimeout:1000 //检查时间1s
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


casper.start("http://localhost:3000/user/login?redirect_to=",function(){
    // this.capture("login0.jpg", undefined, {
    //     format: 'jpg',
    //     quality: 75
    // });
    console.log(this.getCurrentUrl());
});

casper.then(function(){
    this.evaluate(function(){
        document.querySelector('input[name="user_name"]').value="plp";
        document.querySelector('input[name="password"]').value= "cpp1988";
        document.querySelector('button.button').click();
    });
    // this.scrollToBottom();
    // this.capture("login1.jpg",undefined,captureConfig);
})
casper.wait(3000, function() {
    this.echo("waiting for login");
});

// var gitStarInfos =[{"url":"https://github.com/huacnlee/quora","name":"quora","desc":"Quora.com like project with Ruby on Rails (不再维护)"}];

//{url:"https://github.com/JetBrains/kotlin",name:"kotlin",desc:"The Kotlin Programming Language"},


//var content = fs.read('E:/github-stars-20170629.txt');
var content = fs.read('E:/github-stars-20170629.txt');

var gitStarInfos =JSON.parse(content);


// casper.wait(15000, function() {
//     this.capture("git-1.jpg", undefined, {
//         format: 'jpg',
//         quality: 75
//     });
// });

casper.each(gitStarInfos,function(self, info) {
    casper.thenOpen("http://localhost:3000/repo/migrate").then(function(){
        this.fill('form.form', {
            'clone_addr':   'https://github.com/ghosert/cmd-editor',// info.url https://github.com/ghosert/cmd-editor
            'repo_name':   info.name,
            'description': info.desc,
            'mirror':true
        }, true);
        //this.click("input[name='mirror']");
        //this.click('button.button');
        // this.capture("git-0.jpg", undefined, {
        //     format: 'jpg',
        //     quality: 75
        // });
        this.echo(new Date()+"填写表单==========================="+this.step);
         //fs.write("F:/casper.steps",this.steps+"\r\n", 'a');
    });

    //casper.on("navigation.requested")  page.resource.requested
   casper.waitFor(function _condition(){// 监测提交表单是否有错误提示，有则跳过下一步，没有则等待提交结果
        if (this.exists('div.message')) {
            return true;
        }else{
            return false;// continue next wait
        }
    },function _then(){
         this.echo(new Date()+"migrate提示报错==========================="+this.step,"error");
         //this.temp.nexwait=false; //报错 undefined object
        this.bypass( 1);
        return "next wait";

    },function _onTimeOut(){
         //this.temp.nexwait=true; 
         this.echo(new Date()+"第一次wait超时=============="+this.step+":"+this.getCurrentUrl());
        return "no wait";
    },10*1000);
  
  /**
      console.log("waitFor result:",result);
    var result = casper.wait(10*1000,function(){
        if (this.exists('.message')) {
            this.echo('提交报错',"error");
            this.capture("error/git-"+new Date().getTime()+".jpg", undefined, {
                format: 'jpg',
               quality: 75
            });
            return false;
        }else{
            return true;   
            });
     }//end else
       
    });**/

    var reg = new RegExp(info.name);//放在此处也不合适
  

    //是否可通过casper进行全局变量的传递
    //this.bypass(2);

    //wait for url 
    casper.waitFor(function _conditon(){
        
        //this.echo( Array.prototype.slice.call(arguments//参数里没有上个wait中传递的函数
        if(reg.test( this.getCurrentUrl() )){
            this.echo("==========second wait==================="+this.step);
            this.echo(new Date()+"checking for url redirect:"+this.getCurrentUrl() );
            return true;
        }else {
            return false;
        }

    },function _then(){
        this.echo(new Date()+"-----step:"+this.step+"--complete:"+info.url)
        this.echo( Array.prototype.slice.call(arguments));
        var gitinfo = "git clone --mirror "+info.url +"  "+ info.name+".git";
        fs.write("git.repo.text",gitinfo+"\r\n", 'a');
    },function _onTimeOut(){
        this.echo(new Date()+"------step:"+this.step+"-migrate error :"+info.url)
         fs.write("git.repo.error.txt",info.url+"\r\n", 'a');
         this.echo( Array.prototype.slice.call(arguments));
    },2*60*1000);//2min


/**
    casper.waitForUrl(new RegExp(info.name),function() {
         this.echo("-------complete:"+info.url);
         this.echo(arguments);
    },function(){//time out
         this.echo("-------step timeout"+info.url)
         this.echo(arguments);
         fs.write("F:/casper.error",info.url+"\r\n", 'a');
    },2*60*1000);//2min

**/


   // if(result){//TODO 起不起作用 在函数执行前就已经打印了，必须通过promise 返回才可以
   //console.log("if result inner");
         
        /***
         casper.wait(100*1000,function(){//wait 内部的wait 都不起作用
              console.log("current url ..",this.getCurrentUrl());
              this.capture("error/git2-"+new Date().getTime()+".jpg", undefined, {
                   format: 'jpg',
                   quality: 75
               });
               if(reg.test(this.getCurrentUrl())){
                    console.log("complete..................");
               }

          });

   
    //casper.waitForSelector(".message");//TODO 没有 wait不到后怎么处理的函数
    //var reg = new RegExp(info.name)
    //try{ 在promise中不起作用的
       /** casper.waitForUrl(reg,function() {
            this.echo("complete:"+info.url);
        },function(){//time out
            this.echo("step timeout"+info.url+" & continue","error")
            fs.write("F:/casper.error",info.url+"\r\n", 'a');
        },800000);**/
    
});
casper.run();