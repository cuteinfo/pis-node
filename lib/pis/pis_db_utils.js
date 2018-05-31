"use strict"

//
const sqlite3 = require("sqlite3").verbose();
const _mysql = require("mysql");

const fs = require("fs");
const http = require("./http_utils.js")

//TODO 根据操作系统不同配置 具体项目中自行设置(暂时 pis-spider 中进行了临时封装)
// const global_config = require("../global_config.js");
// let baseFold = global_config.sqlite.baseFold || "./";
// let all_sqlite_files = {
//     "memory": ":memory:",//内存数据库
//     "pis": utils_t.file_concat(baseFold, "pis-v2-sqlite.db"),
//     "vedio": utils_t.file_concat(baseFold, "pis-v2-vedio.db"),
//     "words": utils_t.file_concat(baseFold, "pis-v2-words.db"),
//     "snap": utils_t.file_concat(baseFold, "pis-v2-snap.db"),
//     "res": utils_t.file_concat(baseFold, "pis-v2-res.db"),
//     "article": utils_t.file_concat(baseFold, "pis-v2-article.db"),
// };
// module.exports.sqlite_map_files ={};// default


/**
 *  进一步封装sqlite3 (同步和异步)
 * @param db_path
 * @param isAsync
 * @returns {*}
 */
let sqlite_db = function (db_path, isAsync) {
    db_path = db_path || ":memory:";
    let db = new sqlite3.Database(db_path);
    if (typeof(isAsync) == "undefined" || isAsync) {
        return new exports.sqlite(db);
    } else {
        return db;
    }
}
module.exports.sqlite_db = sqlite_db;


/**
 * sqlite 驱动promise化  用class 实现
 * @type {exports.sqlite}
 */
//API 地址 https://github.com/mapbox/node-sqlite3/wiki/API
module.exports.sqlite = class {
    constructor(db) {
        if (db instanceof sqlite3.Database) {
            this.db = db;
        } else if (typeof  db == "string") {
            this.db = new sqlite3.Database(db);
        } else {
            console.log("new sqlite error");
        }

    }
    //静态函数
    static utils() {

    }
    async all(sql, params, db) {
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
    }

    async run(sql, params, db) {
        db = db || this.db;
        params = params || [];
        return new Promise(function (resolve, reject) {
            db.run(sql, params, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
    //return first row
    async get(sql, params, db) {
        db = db || this.db;
        params = params || [];
        return new Promise(function (resolve, reject) {
            db.get(sql, params, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async each(sql, params, db, rowcallback) {//sql, [param, ...], [row callback], [complete]
        db = db || this.db;
        params = params || [];
        rowcallback = rowcallback || function () {
        };
        return new Promise(function (resolve, reject) {
            db.each(sql, params, rowcallback, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async exec(sql, db) {
        db = db || this.db;
        return new Promise(function (resolve, reject) {
            db.exec(sql, function (error, result) {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }

    async prepare(sql, params, db) {//sql, [param, ...], [row callback], [complete]
        db = db || this.db;
        params = params || [];
        return new Promise(function (resolve, reject) {
            db.prepare(sql, params, function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve(null);
                }
            });
        });
    }

};



/**
 * mysql 驱动promise化/
 * TODO 完善pool
 * @type {exports.mysql}
 */
module.exports.mysql = class {
    constructor(conn) {
        this.conn = conn;
    }

    pool() {
        var pool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'test'
        });
        pool.getConnection(function (err, connection) {


        });
        //释放连接
        conn.release();
    }

    connect(config) {
        let default_config = {
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'test'
        };
        this.conn = _mysql.createConnection(config || default_config);
        this.conn.connect();
    }

    //query  delete update 都可使用
    query(sql, params) {
        let conn =  this.conn;
        return new Promise(function (resolve, reject) {
            conn.query(sql, params, function (error, rs) {
                if (error) {
                    reject(error);
                } else {
                    resolve(rs);
                }
            });
        });
    }

    //关闭连接
    end() {
        this.conn.end(function (err) {

        });
    }

}

