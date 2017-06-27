"use strict"
const sqlite3 = require("sqlite3").verbose();
const request = require("request");
let co = require('co')

/**
 * 将常用方法转换为 用promise封装，方便进行调用
 *
 * **/

// -1 comm promise化
    //有没有可能设计通用的方法实现回调函数的promise化
//[取消] 因为js 函数没有固定的scheme ，参数等可以任意变化，无法获取‘反射信息’
var  promised = function(pfunc,args){

    return new Promise(function(resolve, reject){
        pfunc(resolve,reject,args);
    });
}

//不可以
// func(arg1,arg2,...,callback)
var promise_comm =  function(pfunc,args0){
    
    return new Promise(function(resolve,reject){
        pfunc(args0,function(){
            var result = arguments;
            //判断是否成功

        });
    });


}


//demo
/**
var req = promised(function(resolve, reject,args){
    request(args[0],args[2],function(error,response,body){
            resolve();
    });
},
url,options);
**/



//1. require("fs"); fs中有 对应的 Sync后缀方法，可直接使用，
// TODO 可参考实现的方式


// 2. 将 网页请求 request进行 promise化
var request_help = function (url, options) {
    options = []||options;
    return new Promise(function (resolve, reject) {
        request(url, options, function (error, response, body) {
            console.log(response.statusCode);
            if (!error ) {
                if(response.statusCode == 200){
                    resolve(body, response);
                }else {
                    reject(response.statusCode);
                }

            } else {
                reject(error, response);
            }
        });
    });
}
module.exports.request_help = request_help;
//3.   sqlite3 all/run/ / 进行 promise化
//TODO 后续将各方法再绑定到 sqlite函数上，使用更加方便
//TODO  'bind', 'get',  'each',   'map',  'reset',  'finalize'
//TODO 参考 ali-redis
var sqlite3_help = (function (db) {
    //两种方法
    // return {all:function(){}};
    // this.func = function(){}
    return {
        all: function (sql, params, db) {
            db = db || this.db;
            params = params || [];
            return new Promise(function (resolve, reject) {
                db.all(sql, params, function (error, result) {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
        },
        run: function (sql, params, db) {
            db = db || this.db;
            params = params || [];
            return new Promise(function (resolve, reject) {
                db.run(sql, params, function (error, result) {
                    // console.log(error);
                    // console.log(result);
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                });
            });
        },
        get: function () {
            console.log("todo")
        },
        each: function () {
            console.log("todo")
        },

    };//end return


})();
// module.exports.sqlite3_help = sqlite3_help();// 而不是sqlite3 ,这样就不必单独给sqlite3_help 下每个函数单独设置module.export ，但调用时候则需要先将方法初始化
module.exports.sqlite3_help = sqlite3_help;
// module.exports.sqlite3_help.all = sqlite3_help().all;
// module.exports.sqlite3_help.run = sqlite3_help().run;


///////////////////////////////////////////////////////////
//4. mysql 驱动promise化

var mysql_help =  (function (conn) {
    return {
        query: function (sql,params) {
            return new Promise(function (resolve,reject) {
                conn.query(sql,params,function (error,rs) {
                    if(error){
                        reject(error);
                    }else{
                        resolve(rs);
                    }
                });
            });
        }

    };
})()
module.exports.mysql_help = mysql_help;



