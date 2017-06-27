
let fs  = require("fs");

let exec = require('child_process').exec;

//__dirname

var cookies_s = "";

var data = fs.readFileSync("cookies.txt",'utf8',function (err, data) {
     if(err) {
        console.log(err)
      }
   
});
 var cookies=JSON.parse(data);
     //console.log(cookies);
     for(var i in cookies){
        cookies_s = cookies_s+cookies[i].name+"="+cookies[i].value+";";
}

console.log(cookies_s);

var weiboContent = "世界上都会死请#学习学习啊#11213QQQ12312！哈哈ffsdfsdaf11";

var command = 'curl "http://weibo.com/aj/mblog/add?ajwvr=6&__rnd=1489371845620" -c "./cookie.txt" -H "Cookie:'+cookies_s+'" -H "Origin: http://weibo.com" -H "Accept-Encoding: gzip, deflate" -H "Accept-Language: zh-CN,zh;q=0.8,en;q=0.6" -H "User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.152 Safari/537.36" -H "Content-Type: application/x-www-form-urlencoded" -H "Accept: */*" -H "Referer: http://weibo.com/?topnav=1&wvr=6&mod=logo" -H "X-Requested-With: XMLHttpRequest" -H "Connection: keep-alive" -H "DNT: 1" --data "location=v6_content_home&text='+encodeURIComponent(weiboContent)+'&appkey=&style_type=1&pic_id=&pdetail=&rank=0&rankid=&module=stissue&pub_source=main_&pub_type=dialog&_t=0" --compressed ' ;

console.log(command);

 var child = exec(command, function(err, stdout, stderr) {
  if (err) throw err;
  var rs = JSON.parse(stdout);
if(rs.code=='100000'){
console.log(发送成功);
}
   console.log(stdout);//code=100000
});
