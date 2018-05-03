
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
    // globalConfig : require("./global.config.js"),//全局配置
    global : require("./global.config.js"),// globalConfig 的简写
    //
    comm : require("./comm/bri.comm.js"), // 无依赖的 功能封装
    convert:require("./comm/bri.convert.js"),//文字转换类功能
    // web: require("./pis.web.comm.js"),// web
    egg :require("./bri.eggjs.js"),//egg框架
    helper: require("./bri.helper.js"), //有依赖的 功能封装
    utils : require("./pis/bri.utils.js"),// bri框架 的特殊功能代码
};
//别名
module.exports.eggjs = require("./bri.eggjs.js");
