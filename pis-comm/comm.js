"use strict"

String.prototype.repeat = function (n) {
    return new Array(n + 1).join(this);
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
}


//常用函数
module.exports = {
    chg2Num: function (num) { //空白或无效字符串转换为数字
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
    },
    xround: function xround(x, radix) {//精确到 radix 小数位 ,radix 可为负数

        return Math.round(x * Math.pow(10, radix)) / Math.pow(10, radix);
    }

};