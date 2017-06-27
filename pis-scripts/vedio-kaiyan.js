const sqlite3 = require("sqlite3").verbose();
const request = require("request");
let co = require('co')
let help = require("../pis-comm/promised_help.js")
let fs = require("fs")
let util = require("util")
let Crypto = require('crypto');
let lineReader = require('line-reader');

var db = new sqlite3.Database("E:/pis v2.0/pis-sqlite.db", function () {
    db.serialize(function () {
        //status =0 仅采集信息， 1 已经生成wget
        // vedio url 格式当前是一样的
        //wget -c "http://baobab.kaiyanapp.com/api/v1/playUrl?vid=%s&editionType=default&source=ucloud"   -O    %s.mp4
        db.run("CREATE TABLE if not exists kaiyanvedio (id,status,vedio_url,from_url,content)");
    });
});
var end_id = 25000;
function * deal_kaiyan_vedio_info(from_id) {
    var start = from_id || 1;
    console.log(start);

    var rs_max = yield  help.sqlite3_help.all("select max(id) as id from kaiyanvedio", [], db);
    if (rs_max && rs_max.length > 0 && rs_max[0].id) {
        start = rs_max[0].id;
    }
    //TODO 判断 id 是否已经在在数据库中(未传入from_id的情况下)
    var ids = yield   help.sqlite3_help.all("select id as id from kaiyanvedio where id>=?", [from_id], db);

    console.log(rs_max)
    for (let i = start; i < end_id; i++) {
        try {
            if(ids.indexOf(i)>=0){
                continue;//跳过
            }

            var rs_data = yield help.request_help("http://baobab.kaiyanapp.com/api/v1/video/" + i);
            var j_data = JSON.parse(rs_data);
            console.log(typeof (j_data));
            console.log(j_data.id)
            console.log(j_data.playUrl)
            yield  help.sqlite3_help.run("insert into kaiyanvedio(id,status,vedio_url,from_url,content) values (?,?,?,?,?) "
                , [j_data.id, 0, j_data.playUrl, "", rs_data], db);

        } catch (er) {
            console.log("error", i, er);
        }
    }
    db.close();
}
//TODO 判断是否已经获取信息   状态判断

// 12999 历史下载到
// co(deal_kaiyan_vedio_info(12999));//12999  23694

var gen_wget = function *(id) {
    // var file = fs.readFileSync("F:/kaiyan_wget.txt",{ encoding: "utf-8", flag: 'w' });
    var vedios = yield  help.sqlite3_help.all("select id,vedio_url from kaiyanvedio where id >= ? and status =0 ", [id], db);
    for (var i = 0; i < vedios.length; i++) {
        var vid = vedios[i].id;
        var vedio_url = vedios[i].vedio_url;
        fs.writeFileSync("F:/kaiyan_wget20170526.txt",
            util.format('wget -c "%s"   -O    %s.mp4\r\n',vedio_url, vid),
            {encoding: "utf-8", flag: 'a'});
        fs.writeFileSync("F:/kaiyan_20170526.txt",
            vid + '.mp4\r\n',
            {encoding: "utf-8", flag: 'a'});

    }

    yield  help.sqlite3_help.run("update kaiyanvedio set status =1 where id >=?", [id], db);


}
co(gen_wget(1));

function * deal_his_vedio_status(file_path){
    var file = fs.readFileSync(file_path,"utf-8");
    var lines = file.split("\r\n");
    console.log(lines.length)
    for(var i=0;i<lines.length;i++){
        var id = lines[i].split(".")[0];

        //需要转为数字类型才可以，否则不生效
        console.log(typeof (id))
        id= +id;
        console.log(typeof (id))
        console.log(id)
        yield help.sqlite3_help.run("update kaiyanvedio set status =1 where id =? ", [id], db);
    }

    //方法2
    // lineReader.eachLine(file_path, function(line, last) {
    //     var id = line.split(".")[0];
    //     console.log(id);
    //     help.sqlite3_help.run("update kaiyanvedio set status =1 where id =?", [id], db);
    //     // if (/* done */) {
    //     //     return false; // stop reading
    //     // }
    // });
}
// co(deal_his_vedio_status("F:/开眼视频vedio/已经下载或采集信息 .txt"))

function* fn() {
    var response = yield  reqp("http://baobab.kaiyanapp.com/api/v1/video/22000");
    // console.log(response);
    yield run_lite("insert into  kaiyanvedio(id) values (?)", [100], db);

    let result1 = yield  all_lite("select max(id) as id from kaiyanvedio", [], db);
    console.log(result1);

}






