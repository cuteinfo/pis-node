"use strict"

let co = require('co')
let fs = require("fs");
const cheerio = require("cheerio");
//转码
const he = require('he');
const iconv = require("iconv-lite");
const child_process = require("child_process")
const util = require("util");
const request = require("request");
/**
 *  依赖第三方库的代码封装
 */

/**
 * exec的同步化封装
 * 无法用 util.promisify(child_process.exec) child_process.exec
 * @param command
 * @param option
 * @returns {Promise}
 */
// exec必须用以下方法才不会导致乱码  先用binary来存储输出的文本，再用iconv来以cp936解析。
// windows 输出内容默认编码是gbk
// exec 必须命令全部执行完才显示结果，spawn则是流式
//spawn只能运行指定的程序，参数需要在列表中给出，而exec可以直接运行复杂的命令。
let exec = function (command, option) {
    return new Promise(function (resolve, reject) {
        child_process.exec(command, option, function (err, stdout, stderr) {
            if (err) {
                reject(err);
            } else {
                resolve([stdout, stderr]);// 返回数组
            }
        });
    })
}
module.exports.exec = exec;

/**
 * spawn 的同步化封装
 * @param command
 * @param args
 * @param encoding
 * @param callbackstream
 */
//和exec的一个区别是spawn通过流的方式发数据传给主进程，
//从而实现了多进程之间的数据交换。这个功能的直接用应用场景就是“系统监控"
//TODO 完善返回stream
let spawn = function (command, args, encoding, callbackstream) {
    let cmd = child_process.spawn(command, args);
    cmd.stderr.on('data', function (data) {
        process.stdout.write(iconv.decode(data, encoding || "gbk"))
    });
    cmd.stdout.on('data', function (data) {
        //console.log(data);
        // process.stdout.write(iconv.decode(data,encoding||"gbk"))
    });
    cmd.on('close', (code) => {
        console.log(`child process spawn exited with code ${code}`);
    });
}
module.exports.spawn = spawn;
// 多命令链接执行demo ps ax | grep ssh
// const { spawn } = require('child_process');
// const ps = spawn('ps', ['ax']);
// const grep = spawn('grep', ['ssh']);
// ps.stdout.on('data', (data) => {
//     grep.stdin.write(data);
// });
// ps.stderr.on('data', (data) => {
//     console.log(`ps stderr: ${data}`);
// });
// ps.on('close', (code) => {
//     if (code !== 0) {
//         console.log(`ps process exited with code ${code}`);
//     }
//     grep.stdin.end();
// });
// grep.stdout.on('data', (data) => {
//     console.log(data.toString());
// });
// grep.stderr.on('data', (data) => {
//     console.log(`grep stderr: ${data}`);
// });
// grep.on('close', (code) => {
//     if (code !== 0) {
//         console.log(`grep process exited with code ${code}`);
//     }
// });



//系统库
const url = require("url");
/**
 * 替换url 中的参数
 * @param oldUrl
 * @param paramKey
 * @param newValue
 */
module.exports.replaceParam = function(oldUrl,paramKey,newValue){
    var u ;
    if(oldUrl instanceof  url.Url){
        u = oldUrl;
    }else{
        u = url.parse(oldUrl);
    }
    const searchParams = new url.URLSearchParams(rs.search);
    searchParams.set(paramKey,newValue);
    u.search = searchParams.toString();
    return u.format()
}



//TODO ntp服务器改为可配置
const ntpConfig = {
    server: "time1.aliyun.com",
    port: 123,
}
let ntpClient = require('ntp-client');
/**
 *  callback 从ntp 服务器获取同步时间
 */
module.exports.ntp = function (callback) { // callback (date,err)
    ntpClient.getNetworkTime(ntpConfig.server, ntpConfig.port, function (err, date) {
        if (err) {
            console.error(err);
            return;
        }
        callback(date, err);
        // console.log("Current time : ",date.Date());
        // console.log("Local Date :", new Date());
    });
}

/**
 * 从ntp 服务器获取同步时间 同步方法
 * @returns {Promise}
 */
module.exports.ntpSync = function () {
    return new Promise(function (resolve, reject) {
        ntpClient.getNetworkTime(ntpConfig.server, ntpConfig.port, function (err, date) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            resolve(date);
        });
    });
}
////////// 过时 @Deprecated ////////

/**
 * @Deprecated
 * request 网络请求进行 promise化
 * @param url
 * @param options
 * @returns {Promise}
 */
module.exports.request_old= function (url, options) { // { url: url,method: "POST",json: true, headers: {"content-type": "application/json", }, body: JSON.stringify(requestData) }
    options =  options || [];
    return new Promise(function (resolve, reject) {
        request(url, options, function (error, response, body) {
            if (!error) {
                if (response.statusCode == 200) {
                    resolve(body, response);
                } else {
                    reject(response.statusCode);
                }
            } else {
                reject(error, response);
            }
        });
    });
}

