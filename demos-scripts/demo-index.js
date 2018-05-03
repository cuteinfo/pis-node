"use strict"


// null表示"没有对象"，即该处不应该有值。
Number(null)== 0  ; //true

// undefined表示"缺少值"，就是此处应该有一个值，但是还没有定义。
Number(undefined) == NaN; // true

typeof (row.billCode)!="undefined" ;  //此变量未有定义 代码中根本没有此变量
row.billCode === undefined ;  //此变量有，但通过函数没有传值

// # jQuery

//## jQuery easyui
// easyui datagrid 使用 class 方式渲染，则 无法配置 on 事件,data-option 中配置时间也不可以，只能通过js 进行关联
//html中select只读设置

var $DisSelects = $("select[disabled='disabled']");//获取所有被禁用的select
$DisSelects.attr("disabled", false); //处理之前, 全部打开
$("#form1").submit();                //提交
$DisSelects.attr("disabled", true);  //处理完成, 全部禁用

// easyui 函数的调用方式不够简洁，实现起来别扭，且手写代码太多
$("#employee").combogrid("setValues");
$("#employee").combogrid.methods;

//TODO easyui 中的alert/confirm 更改为 阻塞模式 可使用promise /yield 来解决？

// 链式回调
$.ajax("test.html")
    .done(function(){ alert("哈哈，成功了！"); })
    .fail(function(){ alert("出错啦！"); });


// 为一个请求制定多个回调函数
// 为多个请求制定一个回调函数
// 如果都成功了，就运行done()指定的回调函数
$.when($.ajax("test1.html"), $.ajax("test2.html"))
    .done(function(){ alert("哈哈，成功了！"); })
    .fail(function(){ alert("出错啦！"); });

$.fn.sfMsg = $.extends($.message);

$.sf.alert("标题","内容").then(function(){
    //other things to do

});

$.messager.confirm('系统消息','确认申请付款吗?',function(r){
    if(r){

    }
});
$.messager.alert('系统消息',"审核失败",'success');


// jQuery easyui  的form("load",url)  方法 默认 是 异步方法
// 也可以加载本地数据
$('#ff').form('load',{
    name:'name2',
    email:'mymail@gmail.com',
    subject:'subject2',
    message:'message2',
    language:5
});