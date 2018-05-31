
// module.exports = require("./lib")
//module.exports={
//    pis_bri_comm_hello:function () {
//        return "hello hello_pis_bri function ";
//    }
//
//}
//// module.exports.pis = require("./pis");
// module.exports.comm = require("./comm")

//example:
// let pis = reqiure("pis-node");
// pis.pis.comm.chg2Num()
// pis.pis.help.restful()
module.exports.bri = {
    // globalConfig : require("./global.js"),//全局配置
    global : require("./global.js"),// globalConfig 的简写
    //
    comm : require("./comm/bri.comm.js"), // 无第三方依赖的 功能封装
    convert:require("./comm/bri.convert.js"),//文字转换类功能

    helper: require("./pis/bri.helper.js"), //有第三方依赖的 功能封装
    db_utils : require("./pis/pis_db_utils.js"), // 数据库操作封装和同步化

    html_encoder : require("./pis/html_encoder.js"),
    http : require("./pis/http_utils.js"),

    bri_tmp : require("./pis/bri_temp.js"),// 【临时】bri框架 的特殊功能代码


    web: require("./web/bri.web.comm.js"),// web
    egg :require("./web/bri.eggjs.js"),//egg框架

};
//别名
module.exports.eggjs = require("./web/bri.eggjs.js");
