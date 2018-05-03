"use strict"

let co = require('co')
let fs = require("fs");

/**
 *  依赖第三方库的代码封装
 */


//替换url 中的参数
const url = require("url");
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

//删除级联 文件或文件夹
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


// 从ntp 服务器获取同步时间
const ntpConfig = {
    server: "time1.aliyun.com",
    port: 123,
}
module.exports.ntp = function (callback) { // callback (date,err)
    let ntpClient = require('ntp-client');
    console.log(ntpConfig.server)
    ntpClient.getNetworkTime(ntpConfig.server, ntpConfig.port, function (err, date) {
        if (err) {
            console.error(err);
            return;
        }
        callback(date, err);
        // console.log("Current time : ",date.Date());
        // console.log("Local Date :", new Date());
    });
},

// 从ntp 服务器获取同步时间 同步方法
module.exports.ntpSync = function () {
    let ntpClient = require('ntp-client');
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
//////////////////
// 使用 nodejs v8.0 util.promisify 进行promise
// 以request promise 为学习样例，是用 stealthy-require 遍历所有函数再进行promise化
const util = require('util');


//child_process 执行 native 命令
let child_process = require('child_process');
module.exports.child_exec = util.promisify(child_process.exec);
module.exports.child_exec_old = function (command) {
    return new Promise(function (resolve, reject) {
        child_process.exec(command, function (err, stdout, stderr) {
            if (err) {
                reject(stderr);
            } else {
                resolve(stdout); //会抛出异常
            }
        });

    });
}

const request = require("request");
// request 官方promise方案
// request-promise (uses Bluebird Promises)
// request-promise-native (uses native Promises)
// request-promise-any (uses any-promise Promises)
module.exports.request  = util.promisify(request);// 仅能对单个函数， 并不能递归，要正式使用还是要使用官方的方法
// module.exports.request_get  = util.promisify(request.get);

// 将 网页请求 request进行 promise化(手工)
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

