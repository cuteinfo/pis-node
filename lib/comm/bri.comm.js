"use strict"

/**
 * 不依赖第三方库的代码
 */

//不换行输出到 console
module.exports.print = function (str) {
    process.stdout.write(str);
}

// 检测对象是否为 array
module.exports.isArray = function(obj) {
    //es5之前 旧方案http://blog.csdn.net/u011686226/article/details/52278197
    // return Object.prototype.toString.call(obj) === '[object Array]';
    // return Array.isArray(obj);// ES5
    if (!Array.isArray) {
        return Object.prototype.toString.call(obj) == '[object Array]';
    }else {
        return  Array.isArray(obj);
    }

}

//监测是否json对象 Object 都可以通过
module.exports.isJson = function( obj ){
    var isjson = typeof(obj) == "object"
         && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" // [object Null] [object Undefined] [object String] [object Number] [object Boolean]
          && !obj.length;
    return isjson;
}
//检测对象是否为 json字符串
module.exports.isJsonStr = function( str ){
    //JSON.parse(new Object())//throw exception
    //JSON.parse的例外
    // JSON.parse('123'); // 123
    // JSON.parse('{}'); // {}
    // JSON.parse('true'); // true
    // JSON.parse('"foo"'); // "foo"
    // JSON.parse('[1, 5, "false"]'); // [1, 5, "false"]
    // JSON.parse('null'); // null
    // 如果JSON.parse能够转换成功；并且字符串中包含 { 时，那么这个字符串就是JSON格式的字符串。
    if (typeof str == 'string') {
        try {
            var obj=JSON.parse(str);
            if(str.indexOf('{')>-1){
                return true;
            }else{
                return false;
            }
        } catch(e) {
            console.log(e);
            return false;
        }
    }
    return false;
}
//空白或无效字符串转换为数字
module.exports.chg2Num = function (num) {
    if (typeof(num) == "undefined" || num == "-" || num == "") {
        return 0;
    } else if (typeof (num) == "number") {
        return num;
    } else {
        //去除 % ?
        if (num.indexOf("%") > 0) {
            num = Number(num.substring(0, num.indexOf("%")));
        }
        let tNum = Number(num);
        if (!isNaN(tNum)) {
            return tNum;
        } else {
            return 0;
        }
    }
}
//精确到 radix 小数位 ,radix 可为负数
module.exports.xround = function xround(x, radix) {
    return Math.round(x * Math.pow(10, radix)) / Math.pow(10, radix);
}


///////////// @Deprecated ////////////////////////

//@Deprecated  使用系统库 url.resolve(from, to)
// 合并url 路径， 多个/ \ 转换为 /，排除https://  http://
module.exports.url_concat = function () {
    // console.log(arguments);
    let result = Array.prototype.join.call(arguments,"/");
    let re = new RegExp(/[\\/]{1,}/g);// 排除 https:// http:// js 不支持后瞻
    let rs =  result.replace(re,"/").replace("http:/","http://").replace("https:/","https://");
    return rs;
}


//@Deprecated  使用系统库 url.parse(url,true).query.key
//获取url中的参数
module.exports.getUrlParam = function (name, thisWin) { //thisWin 默认当前窗口，如果传入父窗口则使用父窗口
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var win = thisWin || window;
    var r = win.location.search.substr(1).match(reg);
    if (r !== null) return unescape(r[2]);
    return null;
}

//@Deprecated  使用系统库  new url.URLSearchParams(rs.search) => set  => url.format
// demo 参见 bir.helper.js  replaceParam(oldUrl,paramKey,newValue);
//替换url中的查询参数
module.exports.replaceUrlParam = function (oldUrl, paramName, replaceWith) {
    // http://10.1.1.1/test?id=1&pre_page=2&page=3
    //var re = eval('/(' + paramName + '=)([^&]*)/gi');
    //var re = eval('/([?&]' + paramName + '=)([^&]*)/gi');//修改后防止出现 pre_page 和 page 分不清的问题
    var re = new RegExp('([\\?&]' + paramName + '=)([^&]*)');
    var nUrl = oldUrl.replace(re, "$1" + replaceWith);// "$1" param 前边是  & 还是 ?  $1 ="&page=3" ,$2 = "3"
    return nUrl;
}

