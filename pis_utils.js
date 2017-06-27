


//计算时间　用60进制的思想，TODO 修改为通用方法
function calc(date){

    var h = date.getHours();
    var m = date.getMinutes();
    var mmm = date.getTime();
    var hm = h*60+m;
    //console.log(hm);
    //console.log(hm >=(9*60+25) && h<=(11*60+30 +5));
    //console.log(hm >=(13*60) && h<=(15*60+5));
    if (
         (hm >=(9*60+25) && hm<=(11*60+30 +5))
         ||
         (hm >=(13*60) && hm<=(15*60+5))

     ){
        return true;
    }else {
        return false;
    }
}


//pis-comm
    //0. 包括一些基本用法的demo 等
    //1. 原生
    //2. jQuery 下的


//(function(window){//TODO 增加闭包 类似jquery ，通用方法都用 pis. 获取
  
url 解析  ?  &  #  多个解析为数组，参考下 eggjs代码，
koajs 中的讨论 https://github.com/koajs/qs/issues/5
https://github.com/eggjs/egg/blob/61f890766066c51a60a5382eb9167358e584c2f8/app/extend/request.js

//获取url中的参数
function getUrlParam(name,thisWin){ //thisWin 默认当前窗口，如果传入父窗口则使用父窗口
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var win = thisWin|| window;
        var r = win.location.search.substr(1).match(reg);
        if (r !== null) return unescape(r[2]);
        return null;
}

//替换url中的查询参数
function replaceUrlParam(oldUrl, paramName, replaceWith) {
       // http://10.1.1.1/test?id=1&pre_page=2&page=3
      //var re = eval('/(' + paramName + '=)([^&]*)/gi');
      //var re = eval('/([?&]' + paramName + '=)([^&]*)/gi');//修改后防止出现 pre_page 和 page 分不清的问题
       var re =  new RegExp('([\\?&]' + paramName + '=)([^&]*)');
        var nUrl = oldUrl.replace(re, "$1"+replaceWith);// "$1" param 前边是  & 还是 ?  $1 ="&page=3" ,$2 = "3"
        return nUrl;
}
//精简
function replaceUrlParam(oldUrl, paramName, replaceWith) {
    var re =  new RegExp('([\\?&]' + paramName + '=)([^&]*)');
    var nUrl = oldUrl.replace(re, "$1"+replaceWith);
    return nUrl;
}




//})(window); //end闭包

