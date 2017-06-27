var webpage = require('webpage').create();
var fs = require('fs');


/**
 * phantomjs 可以做两件事,一是对文件操作，二是访问网络
 *保存数据有两种方式:
 * 1.把你抓取的数据结构化保存到文件里，然后用另外的程序去读文件并保存到数据库中
 * 2.做一个保存数据的web url形式的接口（可以是只能内部访问的），然后在程序中用访问url的形式发送数据进行保存。
 *
 */

phantom.outputEncoding="GBK";//控制台打印乱码的问题