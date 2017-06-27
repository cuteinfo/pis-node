"use strict"

let mysql  = reqiure("mysql");


var mysql  = require('mysql');  //调用MySQL模块

//创建一个connection
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    port: '4406',
});

//创建一个connection
connection.connect(function(err){
    if(err){
        console.log('[query] - :'+err);
        return;
    }
    console.log('[connection connect]  succeed!');
});

//执行SQL语句
connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
    if (err) {
        console.log('[query] - :'+err);
        return;
    }
    console.log('The solution is: ', rows[0].solution);
});
//关闭connection
connection.end(function(err){
    if(err){
        return;
    }
    console.log('[connection end] succeed!');
});

