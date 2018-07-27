"use strict"
const fs = require("fs");
const got = require('got');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const util = require("util");
const child_process = require("child_process");
const FormData = require('form-data');

const helper = require("./bri.helper.js")
const comm = require("../comm/bri.comm.js")

// 1. got 封装(curl命令行 wget命令行) 、2. cheerio封装

/** 、
 * 浏览器常用 User-Agent
 * @type {{chrome: string, firfox: string, wechat_pc: string, wechat_iphone: string, wechat_android: string}}
 */
let UA = {
    "chrome": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.87 Safari/537.36",
    "firfox": "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:57.0) Gecko/20100101 Firefox/57.0",//"Mozilla/5.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0",
    "wechat_pc": "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36 MicroMessenger/6.5.2.501 NetType/WIFI WindowsWechat QBCore/3.43.373.400 QQBrowser/9.0.2524.400",
    "wechat_iphone": "Mozilla/5.0 (iPhone; CPU iPhone OS 5_1 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Mobile/9B176 MicroMessenger/4.3.2",
    "wechat_android": "Mozilla/5.0 (Linux; U; Android 2.3.6; zh-cn; GT-S5660 Build/GINGERBREAD) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1 MicroMessenger/4.5.255",

};
module.exports.UA = UA;

/**
 * 获取页面302跳转后地址
 * @param url
 * @returns {Promise.<void>}
 */
//  got.head("https://pan.baidu.com/s/1S0XTRuAMNuQtCqvFnDzSwQ").then(function (data) {
//     console.log(data.url);// 302 地址
// });
let pgot302 = async function (url) {
    let res = await got.head(url)
    return res.url;
}
module.exports.pgot302 = pgot302;

// form.append('my_file', fs.createReadStream('/foo/bar.jpg'));

let got_default = {
    headers: {
        'User-Agent': UA.chrome,
        cookie: '',
        body: new FormData()
    }
};
module.exports.got_default = got_default;

/**
 * got + curl 统一 封装
 * @param url
 * @param options
 * @param type
 * @returns {Promise.<*>}
 */
// 1.统一返回/流式返回
// 2.async/callback模式
// 3. curl的接口化，乱码处理，结果解析后返回got标准格式
let pgot = async function (url, options, type) {
    type = type || "got";
    options = options || {};
    options.type = options.type || "get";
    let out_encoding = options.encoding || "utf-8";
    if (options.stream) {
        pgot_steam(url, options, type);
    }
    if (type == "curl") {
        // let curl = "curl  -X{} -I -k --user-agent {} {}"
        let curl = "curl  -X%s   -k %s %s --compressed";
        let method = (options.type || "get").toUpperCase();
        let addtion = "";
        if (options.method && options.method.toUpperCase() == "HEAD") {
            addtion = addtion + " -I  -w %{url_effective} -L "
        }
        if (options.headers) {
            if (options.headers.cookie) {
                addtion += util.format("  --cookie %s ", options.headers.cookie)
            }
            if (options.headers['user-agent']) {
                addtion += util.format(" --user-agent %s ", options.headers['user-agent']);
            }
            if (options.headers.body) {//表单和文件 TODO --data FormData

            }
        }
        let command = util.format(curl, method, addtion, url);
        let out = await  helper.exec(command, {encoding: 'binary'});
        return iconv.decode(new Buffer(out[0], "binary"), out_encoding);//不加 binary 有小错误但不影响使用
    } else {//got 或 其它值
      
        return await got(url, options);
    }
}
/**
 * TODO 流式数据处理
 * @param url
 * @param options
 * @param type
 */
let pgot_steam = function (url, options, type) {

}


//常用方法进行再次封装
const methods = ['get', 'post', 'put', 'patch', 'head', 'delete'];
pgot.stream = pgot_steam;
for (const method of methods) {
    pgot[method] = (url, options, type) => pgot(url, {...options, method}, type);
    pgot.stream[method] = (url, options) => pgot_steam(url, {...options, method}, type);
}
module.exports.pgot = pgot;


//2. cheerio 封装
// cheerio本身默认是转实体的
// cheerio.load(html,{decodeEntities: false}); 加个参数
let cheerio_default = {
    decodeEntities: false,
    lowerCaseTags: false,
    lowerCaseAttributeNames: false,
    ignoreWhitespace: false,
    xmlMode: false,
    recognizeCDATA: true,
    recognizeSelfClosing: true
};
module.exports.cheerio_default = cheerio_default;

module.exports.cheerio_default = cheerio_default;

/**
 * 输出 demo api 结果简化
 * @param api_urls  array api地址
 * @param outfile  输出文件地址
 * @param http_config
 * @returns {Promise.<void>}
 */
let gen_api_data = async function (api_urls,outfile,http_config) {// http_config cookie:cookie_str
    //清空原文件
    // let data_file = outfile || __filename+"_data.js" ;//当前文件名
    // require.main.filename 调用方文件名
    let data_file = outfile || require.main.filename.replace(".js","")+"_data.js" ;
    http_config = http_config ||{};
    fs.writeFileSync(data_file, "\r\n", {encoding: "utf-8"});
    for (let url of api_urls) {
        fs.writeFileSync(data_file, `//${url}\r\n`, {encoding: "utf-8", flag: 'a'});
        let res = await  pgot(url, {
            headers: {
                'user-agent': UA.chrome,
                cookie: http_config.cookie,
            }
        })
        let result = comm.mini_api_result_format(res.body, 10);
        fs.writeFileSync(data_file, "data = ", {encoding: "utf-8", flag: 'a'})
        fs.writeFileSync(data_file, result, {encoding: "utf-8", flag: 'a'});
        fs.writeFileSync(data_file, "\r\n", {encoding: "utf-8", flag: 'a'});
    }

}

module.exports.gen_api_data = gen_api_data;