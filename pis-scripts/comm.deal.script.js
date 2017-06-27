let fs = require("fs");


//按行读取文件 readline 或者文件比较小的话，可以使用split 或 regex
let readline = require("readline");

//1 实行逐行读取文本

var read_line = readline.createInterface({
    input: fs.createReadStream("F:/kaiyan_wget20170526.bat"),
    output: process.stdout
});
read_line.on("line",function ( line ) {
    console.log("=="+line);
})

//2 使用readline 进行命令行交互
function cccccccccc() {

    var read_cli = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    read_cli.question("请输入姓名:", function (answer) {
        console.log("你好:" + answer);
        read_cli.close();
    });

    read_cli.on("close", function () {
        process.exit(0);
    })

}