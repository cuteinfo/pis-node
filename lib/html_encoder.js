
// html encoder/decoder 
// 1. 利用浏览器dom进行hacker方法
// 2. 利用node下dom解析工具进行hacker
// 3. 使用字典映射进行转换  npm install entities


var browser = {//仅能在浏览器中使用

    encode : function(html){
        var tmp_tag = document.createElement('_no_use_tag_');
        tmp_tag.appendChild( document.createTextNode( html ) );
        return  tmp_tag.innerHTML;// 或 appendChild.parentNode
    },
    decode : function(html){
        var tmp_tag = document.createElement('_no_use_tag_');
        tmp_tag.innerHTML = html;
        return tmp_tag.textContent;
    }

};

const cheerio = require("cheerio");
var dom = { // 需依赖安装 cheerio/htmlparser 等dom库/html解析库

    encode : function(html){// cheerio 中tag 不能以_开头
        $ = cheerio.load("<no_use_tag></no_use_tag>");
        $("no_use_tag").text(html);
        return $("no_use_tag").html();
    },
    decode : function(html){
        $ = cheerio.load("<no_use_tag></no_use_tag>");
        $("no_use_tag").html(html);
        return $("no_use_tag").text();
    }

};


const entities = require("entities");
const deHtml = entities.decodeHTML;
var dic = {// 需要安装依赖 entities  encodeXML decodeXML
    encode : function(html){// cheerio 中tag 不能以_开头
        return entities.encodeHTML;
    },
    decode : function(html){
        return entities.decodeHTML(html);
    }

}

//TODO 总方法
// 根据不同环境选用不同的方法
module.exports = function(){
    var type;
    if(isBrowser){
        type = browser;
    }else if(entities){
        type = dic;
    }else if(cheerio){
        type = dom;
    }else {
        throw e;
    }
    return {
        encode : type.encode,
        decode : type.decode,
    };



}




















