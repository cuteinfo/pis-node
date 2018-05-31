
// html encoder/decoder 
// 1. 利用浏览器dom进行hacker方法
// 2. 利用node下dom解析工具进行hacker
// 3. 使用字典映射进行转换  npm install entities
const cheerio = require("cheerio");
const entities = require("entities");

/**
 * 仅能在浏览器中使用
 * 利用浏览器dom进行hacker方法
 * @type {{encode: browser_convert.encode, decode: browser_convert.decode}}
 */
let browser_convert = {//
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

/**
 *  利用node下dom解析工具进行hacker
 * @type {{encode: cheerio_dom_parse.encode, decode: cheerio_dom_parse.decode}}
 */
let cheerio_dom_parse = { // 需依赖安装 cheerio/htmlparser 等dom库/html解析库

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


/**
 *  使用字典映射进行转换 使用第三方库 entities
 * @type {{encode: entities_convert.encode, decode: entities_convert.decode}}
 */
let entities_convert = {// 需要安装依赖 entities  encodeXML decodeXML
    encode : function(html){// cheerio 中tag 不能以_开头
        return entities.encodeHTML;
    },
    decode : function(html){
        return entities.decodeHTML(html);
    }

}


// 根据不同环境选用不同的方法
module.exports = function( type ){
    type = type || "entities";// browser cheerio_dom
    let all = { "browser":browser_convert ,"cheerio_dom":cheerio_dom_parse ,"entities":entities_convert }
    let convert  = all[ type ];
    convert = convert || entities_convert;
    // if(isBrowser){
    //     type = browser;
    // }
    return {
        encode : convert.encode,
        decode : convert.decode,
    };
}




















