"use strict"

/**
 *  仅当前系统(pis v2 默认的一些工具)
 */

/**
 * 生成website的快捷方式 ，win 版本在Mac下也可访问
 * @param url
 * @param title
 * @param fold
 * @param ostype
 */
module.exports.website_shortcut = function (url, title, fold, ostype) {
    ostype = ostype || "win";
    fold = fold || "./";
    title = title || "快捷方式";
    let filename_win = `${title}.url`;//文件名不能用  快捷 两字
    filename_win = this.file_concat(fold, filename_win);
    let content_win = `[InternetShortcut]\r\nURL=${url}`
    let filename_mac = `${title}.webloc`;//文件名不能用  快捷 两字
    filename_mac = this.file_concat(fold, filename_mac);
    let content_mac = `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd"><plist version="1.0"><dict><key>URL</key><string>${url}</string></dict></plist>`;
    if (ostype == "win") {
        fs.writeFileSync(filename_win, iconv.encode(content_win, "GBK"));
    }
    if (ostype == "mac") {
        fs.writeFileSync(filename_mac, content_mac);
    }
};


/**
 * 用于自定义的数据库字段注释，方便提取信息
 *  bri格式转换( 当前 只解析最外层
 *  例: 表名(注释){附加信息}[meta信息]
 *  特殊符号内不嵌套 ，非特殊符号之间文本不解析
 *  每种特殊符号只出现一次(后续解决)
 * @param str
 */
// todo 按层次解析
var bri_format = function (str) { //
    //eg. () {} [] ... 左右之间的位移关系 （）{}【】
    //  (（ 括号没有全角半角，只有中文英文
    var idx1 = str.search(/[({\[]/);
    var rs = {};
    rs["0"] = str.substring(0, idx1);
    rs["()"] = format_pairs(str, "()");
    rs["{}"] = format_pairs(str, "{}");
    rs["[]"] = format_pairs(str, "[]");
    return rs;
}

module.exports.bri_format = bri_format;
// var rs = bri_format("表名(注释)111{附加信息}222[meta信息]");
// console.log(rs["0"],rs["[]"])


/**
 * 计算时间 　用60进制的思想 精确到 秒
 * @param date
 * @param begin
 * @param end
 * @returns {boolean}
 */
module.exports.calcDate = function (date, begin, end) {
    if (begin > end) {//进行对换
        let tmp = begin;
        begin = end;
        end = tmp;
    }
    return (date >= begin) && (date <= end);

}

/**
 * 判断 时间是否在起始时间内 24小时
 * @param date
 * @param beginArr
 * @param endArr
 * @returns {boolean}
 */
module.exports.calcDate2 = function (date, beginArr, endArr) { // [9,25,0]
    let h = date.getHours();
    let m = date.getMinutes();
    let mmm = date.getTime();
    let hmm = (h * 60 + m) * 60 + mmm;

    let begin = ( beginArr[0] * 60 + beginArr[1] ) * 60 + beginArr[2];
    let end = ( endArr[0] * 60 + endArr[1] ) * 60 + endArr[2];

    if (hmm >= begin && hmm <= end) {
        return true;
    } else {
        return false;
    }
}
/**
 * 检查时间(时分秒) 是否在日内交易时间段
 * @param date
 * @returns {boolean}
 */
module.exports.calStockDate = function (date) {
    let beginArray = [9, 25, 0];
    let endArray = [11, 30, 0];
    let s1 = module.exports.calcDate2(date, beginArray, endArray);
    beginArray = [13, 0, 0];
    endArray = [15, 0, 0];
    let s2 = module.exports.calcDate2(date, beginArray, endArray);
    return s1 || s2;

}