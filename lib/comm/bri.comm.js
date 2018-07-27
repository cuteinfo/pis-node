"use strict"

/**
 * 不依赖第三方库的代码
 */
const fs = require("fs");
const util = require("util")


////////////////////通用///////////////////////////////////////

/**
 * 获取模块的变量和函数列表
 * @param exports
 * @returns {{all: Array, funcs: Array, strs: Array}}
 */
module.exports.module_info = function (exports) {
    //获取列表数组
    let all = Object.keys(exports);
    //区分函数和变量
    let funcs = [];
    let strs = [];
    for (let key in  exports) {
        let v = exports[key];

        if (typeof v === "function") {
            funcs.push(key);
        } else {
            strs.push(key);
        }
    }
    return {all: all, funcs: funcs, strs: strs};

}


/**
 * 同步的等待sleep 官方封装
 * @param millseconds
 * @returns {Promise}
 */
module.exports.sleep = util.promisify(setTimeout);
/**
 * 同步的等待sleep 自定义 promise方法
 * @param millseconds
 * @returns {Promise}
 */
module.exports.timeoutAsync = async function (millseconds) {
    return new Promise(function (resolve, reject) {
        setTimeout(function (args) {
            resolve(args);
        }, millseconds);
    });
}


/**
 *  Nodejs 计数器
 * @type {exports.counter}
 */
module.exports.counter = class {
    constructor() {
        this.data = this.data || {};
    }

    get(key) {
        return this.data[key] || 0;
    }
    out() {
        return this.data;
    }

    put(key, value) {
        this.data[key] = value || 0;
    }

    add(key, value) {
        this.data[key] = this.get(key) + (value || 0);
    }

}

/**
 * 从文件(JSON)读取cookie
 * @param file
 * @param enccoding
 * @returns {string}
 */
module.exports.readCookies = function (file,enccoding) {
    enccoding = enccoding ||"utf-8"
    let cookies = JSON.parse(fs.readFileSync(file, enccoding));
    let cookie_str = "";
    for (let i = 0; i < cookies.length; i++) {
        cookie_str = cookie_str + ";" + cookies[i].name + "=" + cookies[i].value;
    }
    return cookie_str;
}


/**
 * API-DATA 简化 并美化
 * @param src_json
 * @param empty_value  是否将value内容清空仅显示结构 false /true ,若为数字表示仅显示前N位字符串
 * @returns {string}
 */
let mini_api_result_format = function (src, mini_config,format_config) {
    format_config = format_config || {"replace":"-","space":2 }
    let json_data = min_api_result(src, mini_config);
    return JSON.stringify(json_data,format_config.replace,format_config.space);
}
module.exports.mini_api_result_format = mini_api_result_format;

/**
 * API-DATA 简化  返回JSON格式数据
 * @param src
 * @param mini_config
 * @returns {*}
 */
//TODO 改为非递归
let min_api_result = function (src, mini_config) {
    // api result min
    // let result = JSON.parse(fs.readFileSync("./pis_api_result.txt", "utf-8"));
    //这种方式无法把其它参数传入
    // Object.keys(src_json).forEach( (key) => {
    let src_json = src;
    if(typeof (src) =="string"){
        src_json = JSON.parse(src);
    }
    mini_config = mini_config || false;


    let keys = Object.keys(src_json);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        let value = src_json[key];
        if (Array.isArray(value) && value.length > 0) {
            let rs = min_api_result(value[0], mini_config)
            src_json[key] = [rs];
        } else if (exports.isJson(value)) {
            src_json[key] = min_api_result(value, mini_config);
        } else {// value 置为空 或进行精简
            if(!!!mini_config){
                src_json[key] = "";
            }else if (typeof (mini_config)=="number" && typeof( src_json[key])=="string" ){
                src_json[key] = src_json[key].substr(0,mini_config);
            }
        }
    }
    return src_json;
}
module.exports.min_api_result = min_api_result;



/**
 * 去掉转移字符或特殊字符
 * @param s
 */
module.exports.removeEscape = function (s) {
    // 去掉转义字符
    s = s.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');
    // 去掉特殊字符
    s = s.replace(/[\@\#\$\%\^\&\*\{\}\:\"\L\<\>\?]/g, '');
}


/**
 * 网址特殊字符移除
 * @param url
 * @param replace
 * @returns {XML|string|*|void}
 */
//  : /  ? # & TODO 是否可转为全角字符
module.exports.rename_url = function (url, replace) {
    return url.replace(/[://?#&]/g, replace || "_");
}


/**
 * 文件是否存在提供的目录s 中
 * @param fname
 * @param suffixs []
 * @param dirs []
 * @returns {Array}
 *  exists_in_folds("1.mp4",[""],"D:/");
 *  exists_in_folds("1",[".mp4",".txt"],"D:/");
 */
module.exports.exists_in_folds = function (fname, suffixs, dirs) {
    suffixs = suffixs || [""];
    if(suffixs.length<=0){
        suffixs =[""]
    }
    let files = [];
    for (let i = 0; i < dirs.length; i++) {
        let dir = dirs[i];
        for (let j = 0; j < suffixs.length; j++) {
            let suffix = suffixs[j];
            let f = dir + "\\" + fname + suffix;
            let exist = fs.existsSync(f);
            if (exist) {
                files.push(f);
            }
        }
    }
    return files;
}

/**
 * 删除级联 文件或文件夹
 * @param path
 */
module.exports.rm = function  (path){
    var stat = fs.statSync(path);
    if(stat.isFile()){
        fs.unlinkSync(path);//直接删除 不到回收站
    }else{
        var list = fs.readdirSync(path);
        list.forEach(function(file){
            rm(path+"/"+file);
        });
        fs.rmdirSync(path);
    }
}


/**
 *文件路径合并 / \ 处理
 * @param fold
 * @param path
 * @returns {string}
 */
//TODO  ..  .的处理(后续)
module.exports.file_concat = function (fold, ...path) {
    let mfile = fold;
    if (path || path.length > 0) {
        for (let i = 0; i < path.length; i++) {
            mfile = mfile + "/" + path[i];
        }
    }
    return mfile.replace(/[\\/]{2,}/g, "/")// 去除中间多余分隔符
    .replace(/[\\/]{1,}$/g, "");// 结尾多余分隔符
}


//全角字符 【枚举】
let FULL_CHAR = "！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～";
module.exports.FULL_CHAR = FULL_CHAR;

// win 下 文件名不能用的特殊字符
let NO_CHAR_WIN = "\\/:*?\"<>|";
module.exports.NO_CHAR_WIN = NO_CHAR_WIN;
// url 中的特殊字符(转移字符)
let CHAR_URL = "/?#&"
module.exports.CHAR_URL = CHAR_URL;



/**
 * 升级版 rename 仅保留 ANSI标准字符和 中文 //日 韩
 * @param name
 * @param replace
 */
module.exports.rename_simple = function (name, replace) {
    // 0000-007F：C0控制符及基本拉丁文 (C0 Control and Basic Latin)
// 中文范围 4E00-9FBF：CJK 统一表意符号 (CJK Unified Ideographs)
    let reg = new RegExp(/[^\u0000-\u007F\u4E00-\u9FBF]/g);
// let reg1 = new RegExp(/[^\u0000-\u007F]/g); //英语和基础字符
// let reg2 = new RegExp(/[^\u4E00-\u9FBF]/g);//中文

    name.replace(reg, replace || " ");
    return module.exports.rename(name);
}


//TODO 后续可考虑替代字符，如转为url encoder 之类的
/**
 *  重命名为适应Windows文件的名字
 * @param name
 * @param replace
 * @returns {*}
 */

//windows 被保留的设备名不能被用来作为文件 名：
// CON, PRN, AUX, NUL, COM1, COM2, COM3, COM4, COM5, COM6, COM7, COM8, COM9, LPT1, LPT2, LPT3, LPT4, LPT5, LPT6, LPT7, LPT8,  LPT9。
// 这些保留设备名不能后跟任何一个扩展名
//是否是正确windows名字的正则表示
// let regx = new RegExp("(?!((^(con)$)|^(con)/..*|(^(prn)$)|^(prn)/..*|(^(aux)$)|^(aux)/..*|(^(nul)$)|^(nul)/..*|(^(com)[1-9]$)|^(com)[1-9]/..*|(^(lpt)[1-9]$)|^(lpt)[1-9]/..*)|^/s+|.*/s$)(^[^/////:/*/?/\"/</>/|]{1,255}$)","i");
module.exports.rename_win = function (name, replace) {
    name = (name || "");
    replace = replace || "";
    // 匹配其中不合格的字母
    let not_names = ["con", "prn", "aux", "nul", "com1", "com2", "com3", "com4", "com5", "com6", "com7", "com8", "com9", "lpt1", "lpt2", "lpt3", "lpt4", "lpt5", "lpt6", "lpt7", "lpt8", "lpt9"];
    if (new Set(not_names).has(name.toLowerCase())) {
        return replace;
    }
    let regx = new RegExp("[/\\\\:*?<>|\"\\s]+", "gi");
    return name.replace(regx, replace)
}


/**
 * 不换行输出到 console
 * @param str
 */
module.exports.print = function (str) {
    process.stdout.write(str);
}

/**
 * 检测对象是否为 array
 * @param obj
 * @returns {boolean}
 */
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

/**
 * 检测是否json对象 Object 都可以通过
 * @param obj
 * @returns {boolean}
 */
module.exports.isJson = function( obj ){
    var isjson = typeof(obj) == "object"
         && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" // [object Null] [object Undefined] [object String] [object Number] [object Boolean]
          && !obj.length;
    return isjson;
}

/**
 * 检测对象是否为 json字符串
 * @param str
 * @returns {boolean}
 */
//JSON.parse(new Object())//throw exception
//JSON.parse的例外
// JSON.parse('123'); // 123
// JSON.parse('{}'); // {}
// JSON.parse('true'); // true
// JSON.parse('"foo"'); // "foo"
// JSON.parse('[1, 5, "false"]'); // [1, 5, "false"]
// JSON.parse('null'); // null
module.exports.isJsonStr = function( str ){
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

/**
 * 空白或无效字符串转换为数字
 * @param num
 * @returns {*}
 */
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
/**
 * 精确到 radix 小数位 ,radix 可为负数
 * @param x
 * @param radix
 * @returns {number}
 */
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

