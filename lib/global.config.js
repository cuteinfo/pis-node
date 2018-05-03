"use strict"

//同时复制一份到 前端 pis.web.comm.js
String.prototype.repeat = function (n) {
    return new Array(n + 1).join(this);
};

// 常规Object 和 JSON 对象 foreach
// Object.keys(src_json).forEach(key => {
//     //console.info(key + ':', result[key])
// })

//TODO  会导致egg 框架启动报错
// if(!Object.prototype.forEach){
//     Object.prototype.forEach = function ( callBack) {
//         //方案1
//         Object.keys(this).forEach(key => {
//             let value = this[key];
//             callBack(key,value);
//         })
//         //方案2
//         // for(var key in this){
//         //     let value = this[key];
//         //     callBack(key,value);
//         // }
//
//     }
// }
// if(!Object.prototype.each){
//     Object.prototype.each = Object.prototype.forEach;
// }



let comm = require("./comm/bri.comm.js");
String.prototype.format = function (args) {
    // 支持的使用方式  index-args 、index-array 、key、 key & index-key
   // .format("{0} {1}" , "arg1","arg2");
   // .format("{0} {1}" , ["arg1","arg2"]); // array
   // .format("{k1} {k2}" , {"k1":"arg1","k2":"arg2"});
   // .format("{1}{k1} {k2}" , {"1":"1-t","k1":"arg1","k2":"arg2"});
    //使用 arguments 应对多个变量的 问题,不使用args
    if (arguments.length <= 0) {
        return this;
    }
    let result  = this;
    let arg_t = arguments;
    if( arguments.length =1  &&
            (  comm.isArray(arguments[0]) || comm.isJson(arguments[0])   )
        ){
        arg_t = arguments[0]
    }
    //处理数字索引替换  this.replace(/\{(\d+)\}/g
    result = this.replace(/\{(\w+)\}/g,
                function (m, i) {
                    return arg_t[i];
                });
    return result;
}

Date.prototype.format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};
// console.log(new Date().format("yyyy-MM-dd"))