"use strict"

//
const readline = require("readline");


//line reader 的用法
function readline_demo() {
    let ref_all = [];
    let ref_module = [];
    let ref_local = [];
    // let content = fs.readFileSync(__filename,"utf-8");
    let line_read = readline.createInterface({
        input: fs.createReadStream(__filename),
        terminal: true
    });
    line_read.on("line", (line) => {
        line = line.trim();
        if (line.indexOf("endinginging...") > 0) {
            line_read.close();
        }
        if (line.indexOf("//") == 0 || line.indexOf("*") == 0 || line == "") {//无效行

        } else if (line.indexOf("const") >= 0 || line.indexOf("var") >= 0) {
            let vari = line.split("=")[0].replace(/(const)|(var)/, "");
            if (line.indexOf("/") > 0) {//本地变量
                ref_local.push(vari.trim());
            } else {//node_module
                ref_module.push(vari.trim());
            }
            ref_all.push(vari.trim());
        }
    });
    line_read.on("close", function () {
        console.log("module.exports = {" + ref_all.join(",") + "};")
        console.log("module.exports.nodem = {" + ref_module.join(",") + "};")
        console.log("module.exports.local = {" + ref_local.join(",") + "};")
        console.log("// 引用代码")
        console.log("//const pis_import = require('../utils/pis_import.js')");
        console.log("//const {" + ref_all.join(",") + "} = pis_import;")
        console.log("//const {" + ref_module.join(",") + "} = pis_import;")
        console.log("//const {" + ref_local.join(",") + "} = pis_import;")
    });

}