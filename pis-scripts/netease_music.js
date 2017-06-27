"use strict"
const sqlite3 = require("sqlite3").verbose();
const request = require("request");
let co = require('co')
let help = require("../pis-comm/promised_help.js")
let fs = require("fs")

/**
 * 网易云音乐下载
 */

//
//sqlite 地址 E:\pis v2.0\music_library.dat   C:\Users\plp\AppData\Local\Netease\CloudMusic\Library\library.dat

//mp3-320   lrc   cover.jpg

var db = new sqlite3.Database("E:/pis v2.0/music_library.dat")

//检查sqlite 中的文件是否都存在
function check_sqlite_file_exits() {
    var cnt = 0;
    db.all("select * from track", function (err, data) {
        for (var i = 0; i < data.length; i++) {
            var isex = fs.existsSync(data[i].file);
            if (!isex) {
                console.log(data[i].file)
            } else {
                cnt = cnt + 1;
            }
        }
        console.log(cnt)

    });
}

//测试网易云 新版APi是

function * test(){


}

