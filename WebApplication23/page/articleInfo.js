
var article;
var title;
var time;
var did;
var role;
//获取地址栏参数
function getQueryStringByName(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

$(document).ready(function () {
    var id = getQueryStringByName("id");
    getArticleInfoByID(id);
})

function getArticleInfoByID(id) {
    var dataJson = '{"id":"' + id + '"}';
    $.ajax({
        type: "Post", //http通信传参方式
        url: "../server/ArticleManage.aspx/getArticleInfoByID", //服务器端资源
        contentType: "application/json; charset=utf-8", //客户端传值
        dataType: "json", //服务器传值格式
        data: dataJson,
        //回调函数：
        success: function (data) {
            article = data.d;
            $("#title").html(article.ArticleTitle);
            $("#author").html(article.Author);
            $("#time").html(article.time);
            $("#content").html(article.ArticleContent);
            //$("#fileid").html(article.filename);
            getArticle(article.ArticleTitle);
            getfilename(article.filename);
        },
        error: function (err) {
            alert(err);
        }
    });
} 

//显示附件信息
function getfilename(filename) {
    var dataJson = '{"filename":"' + filename + '"}';
    $.ajax({
        type: "Post", //http通信传参方式
        url: "../server/up.aspx/Get_filename_id", //服务器端资源
        contentType: "application/json; charset=utf-8", //客户端传值
        dataType: "json", //服务器传值格式
        data: dataJson,
        //回调函数：
        success: function (data) {
            fileList = data.d;
            var returnStr = "";
            var returnStr1 = "";
            //returnStr1 = "<img style:\" width:600px; heigth:300px\" src='../" + fileList[0].uploadpath + "'></br>";
            //$("#ima").html(returnStr1); //显示封面
            for (var i = 0; i < fileList.length; i++) {
                returnStr += "<a href='../" + fileList[i].uploadpath + "'>" + fileList[i].file_name + "</a></br>";
            }
            $("#fileid").html(returnStr);
        },
        error: function (err) {
            alert(err);
        }
    });
} 

// 评论
$(document).ready(function () {
    $("#openspeek").click(function () {
        $("#dialogs").toggle();
    });
});
// 评论弹窗关闭
function diacloses() {
    document.getElementById("dialogs").style.display = "none";
}

$(document).ready(function () {
    //判断是否在前面加0
    function getNow(s) {
        return s < 10 ? '0' + s : s;
    }
    var myDate = new Date();
    var year = myDate.getFullYear();        //获取当前年
    var month = myDate.getMonth() + 1;   //获取当前月
    var date = myDate.getDate();            //获取当前日
    var h = myDate.getHours();              //获取当前小时数(0-23)
    var m = myDate.getMinutes();          //获取当前分钟数(0-59)
    var s = myDate.getSeconds();
    var time = year + '-' + getNow(month) + "-" + getNow(date) + " " + getNow(h) + ':' + getNow(m) + ":" + getNow(s);
    $("#diacloses2").click(function () {
        var name = $("#info").text();
        var title = $("#title").text();
        var ttt = $("#dialogtext").val();
        var te = time;
        var to = time;
        answer(to);
        comment(name, title, ttt, te);

    });
})
function comment(name, title,ttt,te) {
    if (name == '登录') {
        window.location.href = "login.html";
    } else {
        var dataJson = '{"name":"' + name + '","title":"' + title + '","ttt":"' + ttt + '","te":"' + te + '"}';
    }
    $.ajax({
        type: "Post", //http通信传参方式
        url: "../server/ArticleManage.aspx/comment", //服务器端资源
        contentType: "application/json; charset=utf-8", //客户端传值
        dataType: "json", //服务器传值格式
        data: dataJson,
        //回调函数：
        success: function (data) {
            var i = data.d;
            if (i > 0) {
                alert("评论成功！");
                $("#but").click(); //自动点击
                $('#dialogtext').val('');// 跳出弹窗后清空文本内容 
                /*window.location = "articleInfo.html"*/
                //$("#demo1").html(con);
            } else {
                alert("评论失败！");

            }
        },
        error: function (err) {

            console.log(err);
        }
    });
}

//遍历评论

function getArticle(title) {
    $("#but").click(function () {
        var dataJson = '{"title":"' + title + '"}';
        $.ajax({
            type: "Post", //http通信传参方式
            url: "../server/ArticleManage.aspx/ArticleListti", //服务器端资源
            contentType: "application/json; charset=utf-8", //客户端传值
            dataType: "json", //服务器传值格式
            //回调函数：
            data: dataJson,
            success: function (data) {
                taking = data.d;
                var lis = "";
                for (var i = 0; i < taking.length; i++) {
                    lis += "<li style='line-height:1.5rem;font-weight: bold;font-size:15px'>" + taking[i].cont + '-----------------' + taking[i].comment_author +'----'+ taking[i].time +
                        '<button style="float:right;" onclick="dele(' + taking[i].id + '); ">删除</button>' +
                        '<button style = "float:right" onclick="answer(' + taking[i].id + '); ">回复</button >' +
                        '<button style="float:right;" id="check" onclick="check(' + taking[i].id + '); ">查看回复</button >' +
                        "</li>";
                }
                $("#demo6").html(lis);
               //answer(taking[i].id);
                //$("#but").click(); //自动点击
               // $('#dialogtext').val('');// 跳出弹窗后清空文本内容 
            },

            error: function (err) {
                alert(err);
            }
        });
    });
};

//删除评论

//var role = localStorage.getItem("role");
function dele(id) {
    var name = $("#info").text();
    if (name != '12345678910') {
        alert("您没有删除权限！")
    } else {
    var objson = "{'id':'" + id + "'}";
    $.ajax({
        type: "Post",
        url: "../server/ArticleManage.aspx/Dele",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: objson,
        success: function (data) {
            var i = data.d;
            if (i > 0) {
                alert("删除成功")
                $("#but").click(); //自动点击
            }
            else {
                alert("删除失败")
            }
        },
        error: function (err) {
            alert(err);
        }
    });
    }
}

//回复评论
function answer(did) {
    var author = $("#author").text();
    var name = $("#info").text();
    if (name == '登录') {
        window.location.href = "login.html";
    } else {
        if (name == "12345678910" || name == author) {
            $("#dialogs").toggle();
            $(this).click(function () {
                document.getElementById("dialogtext").style.display = "block";
                //document.getElementById("dialogs").style.display = "block";
            });
            function getNow(s) {
                return s < 10 ? '0' + s : s;
            }
            var myDate = new Date();
            var year = myDate.getFullYear();        //获取当前年
            var month = myDate.getMonth() + 1;   //获取当前月
            var date = myDate.getDate();            //获取当前日
            var h = myDate.getHours();              //获取当前小时数(0-23)
            var m = myDate.getMinutes();          //获取当前分钟数(0-59)
            var s = myDate.getSeconds();
            var time = year + '-' + getNow(month) + "-" + getNow(date) + " " + getNow(h) + ':' + getNow(m) + ":" + getNow(s);

            $("#diacloses0").click(function () {
                var answe = $("#dialogtext").val();
                var to = time;
                var dataJson = '{"name":"' + name + '","answe":"' + answe + '","to":"' + to + '","did":"' + did + '"}';
                $.ajax({
                    type: "Post", //http通信传参方式
                    url: "../server/ArticleManage.aspx/Answer", //服务器端资源
                    contentType: "application/json; charset=utf-8", //客户端传值
                    dataType: "json", //服务器传值格式
                    data: dataJson,
                    //回调函数：
                    success: function (data) {
                        var i = data.d;
                        if (i > 0) {
                            alert("回复成功！");
                        }
                        else {
                            alert("回复失败！");
                        }
                      $('#dialogtext').val('');// 跳出弹窗后清空文本内容 
                    },
                    error: function (err) {
                        alert(err);
                    }
                });
            });

        } else {
            alert("您没有回复权限！")
        }
    }
}
function check(id) {
    $("#dialogs").toggle();
        var dataJson = '{"id":"' + id + '"}';
        $.ajax({
            type: "Post", //http通信传参方式
            url: "../server/ArticleManage.aspx/Blid", //服务器端资源
            contentType: "application/json; charset=utf-8", //客户端传值
            dataType: "json", //服务器传值格式
            //回调函数：
            data: dataJson,
            success: function (data) {
                answer = data.d;
                var lis = "";
                for (var i = 0; i < answer.length; i++) {
                    lis +=answer[i].contment +'-'+ answer[i].comment_author +'-'+ answer[i].time;
                }
                $("#dialogtext").html(lis);
                // $('#dialogtext').val('');// 跳出弹窗后清空文本内容 
            },

            error: function (err) {
                alert(err);
            }
        });
};



