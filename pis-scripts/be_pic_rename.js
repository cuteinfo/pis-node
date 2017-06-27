"strict"

let fs = require("fs");


function deal_be_fold(destFold) {


    var foldList = fs.readdirSync(destFold, "utf-8");
    foldList.forEach(function (fold) {
        // console.log(fold);
        let stat = fs.statSync(destFold + "/" + fold);
        if (stat.isDirectory()) {
            let path = destFold + "/" + fold;
            var files = fs.readdirSync(path, "utf-8");
            files.forEach(function (file) {
                let fst = fs.statSync(path + "/" + file);
                if (fst.isFile()) {
                    fs.renameSync(path + "/" + file, destFold + "/" + fold + file);
                }

            })
        }


    });
}

//process是一个全局对象，argv返回的是一组包含命令行参数的数组。
//第一项为”node”，第二项为执行的js的完整路径，后面是附加在命令行后的参数
var arguments = process.argv.splice(2);
console.log(typeof(arguments));//竟然是object类型的
arguments.forEach(function(val, index, array) {
   // console.log(index + ': ' + val);
   // console.log(array)
   // console.log(array[index])
});

if (arguments.length == 0 || arguments[0] == null) {
    console.log("请输入文件夹名")
} else {
    
    deal_be_fold(arguments[0]);
}
//文件名 为 外层     
//输入文件名 --> be.NO.128 -->001.jpg 002.jpg



//readdirSync
// fs.readdir("K:/【复件bak 实用/be-pic-待整理",function(err, files) {
//     //simple
//     console.log(files);
//
// });
// fs.stat("C:/a",function(err, stat){
//     if(err){
//         console.log("文件不存在！");
//     }else{
//         console.log("是否文件："+stat.isFile());
//         console.log("是否文件夹："+stat.isDirectory());
//     }
// });
// 其它状态函数：
// stats.isFile()
// stats.isDirectory()
// stats.isBlockDevice()
// stats.isCharacterDevice()
// stats.isSymbolicLink() (只针对 fs.lstat() 有效)
// stats.isFIFO()
// stats.isSocket()]


