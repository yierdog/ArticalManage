
var pageSize = 10;   // 每页数据条数
var currentPage = 3;//当前页数
var totalpage;    // 总页数
var count;  // 接收到的所有数据
var index;   //当前页码
var i = 1;
var ye = 8;
var filenameid;
var currentUser;
var ss;
var id;

//时间转换
function formatDate(dt) {
    var year = dt.getFullYear();
    var month = dt.getMonth() + 1;
    if (parseInt(month) < 10) {
        month = '0' + month;
    }
    return year + "-" + month;
}
function Test(time) {
    var t = time.slice(6, 19)
    var NewDtime = new Date(parseInt(t));
    return formatDate(NewDtime);
}

//绘制页码
function pain(count) {
    if (count / pageSize > parseInt(count / pageSize)) {
        totalpage = parseInt(count / pageSize) + 1;
    }
    else {
        totalpage = parseInt(count / pageSize);
    }
    var tempStr1 = "共" + count + "条记录 分" + totalpage + "页";
    $("#ulinfo").html(tempStr1);

    var tempStr = '';

    if (ye > totalpage) {
        ye = totalpage;
    }


    tempStr += '<li id="' + i + '"><a onclick="goup(' + i + ');"><<</a></li>';
    for (i; i <= ye; i++) {
            if (i == currentPage) {
                tempStr += '<li id=" ' + i + '" class="active"><a onclick="goPage(' + i + ',' + pageSize + ');">' + i + '</a></li>';
            } else {
                tempStr += '<li id="' + i + '"><a onclick="goPage(' + i + ',' + pageSize + ');">' + i + '</a></li>';
        }
    }
    tempStr += '<li id="' + i + '"><a onclick="godown(' + i + ');">>></a></li>';
    $("#ulinfo1").html(tempStr);
}

function goup(a) {
    if (a <= 1) {
        a = 1;
        ye = 8;
        i = 1;
    } else {
        ye = a - 1;
        i = ye - 7;
    }
    goPage(i);
    pain(count);
}

function godown(a) {
    ye = a + 7;
    goPage(a);
    pain(count);
}

function goPage(index) {
    var datao = {
        index: index,
        pageSize: pageSize
    };
    var dataStr = $.toJSON(datao);
    $.ajax({
        type: "Post",
        url: "../server/ArticleManage.aspx/getArticleListData",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: dataStr,
        success: function (data) {
            if (data.d != null && data.d != "") {
                articleList = data.d;
                filenameid = articleList.filename; 
                ShowList(articleList);
            } else {
                $("#ulinfo1").html('<tr><td colspan="12"><h3>无记录</h3></td></tr>');
            }

        },
        error: function (er) {
            alert(er);
        }
    });
}
function ShowList(list) {
    var aStr = "";
    var aStr1 = "";
    for (var i = 0; i < list.length; i++) {
        aStr += '<li><dl><dt class="messdt"id=iag></dt><dd>' +
            '<a  class="title03 hovercolor" href = "articleInfo.html?id=' + list[i].ArticleID + '" >' + list[i].ArticleTitle + '--------- ' + list[i].Author + '---' + Test(list[i].time) +
            ' </a ></dd></dl></li>'
        aStr1 += '<li><dl><dt class="messdt"></dt><dd>' +
            '<a target="_top"href = "articleInfo.html?id=' + list[i].ArticleID + '" class="title03 hovercolor" style="width:300px">' + list[i].ArticleTitle + '--------- ' + list[i].Author + '---' + Test(list[i].time) +
            '</a><button style="float:right;margin:20px" onclick="del(' + list[i].ArticleID + '); ">删除</button><a style="float:right" href="upda.html?id=' + list[i].ArticleID + '">修改</a></dd></dl></li>';
    }
    $("#coo").html(aStr);
    $("#cool").html(aStr1); //管理员中心
}


//获取要查询的内容总数
$(document).ready(function () {
    getArticlecount();
})
function getArticlecount() {
    $.ajax({
        type: "Post", //http通信传参方式
        url: "../server/ArticleManage.aspx/getArticleListcount", //服务器端资源
        contentType: "application/json; charset=utf-8", //客户端传值
        dataType: "json", //服务器传值格式
        //回调函数：
        success: function (data) {
            count = data.d;
            pain(count);
            //加载第一页
            goPage(1);
        },
        
        error: function (err) {
            alert(err);
        }
    });
}

//获取封面
function image(filenameid) {
    var dataJson = '{"filenameid":"' + filenameid + '"}';
    $.ajax({
        type: "Post", //http通信传参方式
        url: "../server/up.aspx/Get_filename_id", //服务器端资源
        contentType: "application/json; charset=utf-8", //客户端传值
        dataType: "json", //服务器传值格式
        data: dataJson,
        //回调函数：
        success: function (data) {
            fileList = data.d;
            var returnStr1 = "";
            returnStr1 = "<img style:\" width:200px; heigth:200px\" src='../" + fileList[0].uploadpath + "'></br>";
            $("#iag").html(returnStr1); //显示封面
        },
        error: function (err) {
            alert(err);
        }
    });
} 

//管理员中心删除
function del(ArticleID) {
    alert(ArticleID);

    var objson = "{'ArticleID':'" + ArticleID + "'}";
    $.ajax({
        type: "Post",
        url: "../server/ArticleManage.aspx/Del",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: objson,
        success: function (data) {
            var i = data.d;
            if (i > 0) {
                alert("删除成功")
                window.location = "all_artical.html";

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

//管理员中心修改
//获取地址栏参数
function getQueryStringByName(name) {
    var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

$(document).ready(function () {
    var ArticleID = getQueryStringByName("id");
    update(ArticleID);
    id = ArticleID;
})
function update(ArticleID) {
    var objson = "{'ArticleID':'" + ArticleID + "'}";
    $.ajax({
        type: "Post",
        url: "../server/ArticleManage.aspx/Update",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: objson,
        success: function (data) {
            var articleList = data.d;
            for (var i = 0; i < articleList.length; i++) {
                $("#ti").val(articleList[i].ArticleTitle);
                $("#con").val(articleList[i].ArticleContent);
                $("#t").val(articleList[i].type);
            }
        },
        error: function (err) {
            alert(err);
        }
    });
}
/*function update(ArticleID) {
    alert(ArticleID);
    console.log(ss)
    for (var i = 0; i < ss.length; i++) {
        if (ss[i].ArticleID == ArticleID) {
            var articleList = ss[i];
            $("#id").val(articleList.ArticleID);
            $("#ti").val(articleList.ArticleTitle);
            $("#con").val(articleList.ArticleContent);
            $("#t").val(articleList.type);
            $("#au").val(articleList.Author);
        };
    }
}*/
$(document).ready(function () {
    $("#save").click(function () {
        var ti = $("#ti").val();
        var con = $("#con").val();
        var t = $("#t").val();
        var objson = "{'id':'" + id + "','ti':'" + ti + "','con':'" + con + "','t':'" + t + "'}";
        $.ajax({
            type: "Post",
            url: "../server/ArticleManage.aspx/saveArticle",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: objson,
            success: function (data) {
                var i = data.d;
                if (i > 0) {
                    alert("修改成功")
                    window.location = "all_artical.html";
                }
                else {
                    alert("修改失败")
                }
            },
            error: function (err) {
                alert(err);
            }
        });
    });
});








$(document).ready(function () {
    getnews();  //新闻中心
    getarticles(); //文章热点
    getart(); // 文艺文学
})
//新闻中心
function getnews() {
    $.ajax({
        type: "Post", //http通信传参方式
        url: "../server/ArticleManage.aspx/getnews", //服务器端资源
        contentType: "application/json; charset=utf-8", //客户端传值
        dataType: "json", //服务器传值格式
        //回调函数：
        success: function (data) {
            articleList = data.d;
            var aStr = "";
            var aStr1 = "";
            for (var i = 0; i < articleList.length; i++) {
                aStr += '<li class="cur li01"><dl><dt class="datedt"><span class="date01">2023-12 </span><span class="date02">24 </span></dt><dd>' +
                    '<a class="title01" href = "articleInfo.html?id=' + articleList[i].ArticleID + '" ><i></i>' + articleList[i].ArticleTitle + '</a> ' +
                    '<p class="title02">' + articleList[i].ArticleContent + '-------' + Test(articleList[i].time) +
                    '</p></dd></dl></li>';
            }
            $("#articleList_container").html(aStr);//新闻中心
        },
        error: function (err) {
            alert(err);
        }
    });
}
//文章热点
function getarticles() {
    $.ajax({
        type: "Post", //http通信传参方式
        url: "../server/ArticleManage.aspx/getarticles", //服务器端资源
        contentType: "application/json; charset=utf-8", //客户端传值
        dataType: "json", //服务器传值格式
        //回调函数：
        success: function (data) {
            articleList = data.d;
            filename = articleList.filename;
            var aStr = "";
            for (var i = 0; i < articleList.length; i++) {
                if (articleList[i].image) {
                    articleList[i].image = "data:image/png;base64," + articleList[i].image
                    aStr += '<li><dl><dt><img style="width:40px;height:35px" src="' + articleList[i].image + '"/></dt><dd>' +
                        '<a class="title03" href = "articleInfo.html?id=' + articleList[i].ArticleID + '" >' + articleList[i].ArticleTitle + '-----' + Test(articleList[i].time) + '</a> <span class="title04">' +
                        '</span></dd></dl></li>';
                }
                else {
                    articleList[i].image ="data:image/png;base64,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" 
                aStr += '<li><dl><dt><img style="width:40px;height:35px" src="' + articleList[i].image +'"/></dt><dd>' +
                   '<a class="title03" href = "articleInfo.html?id=' + articleList[i].ArticleID + '" >'+ articleList[i].ArticleTitle + '-----' + Test(articleList[i].time) + '</a> <span class="title04">' +
                    '</span></dd></dl></li>';
                }
               
            }
            $("#articleList_con").html(aStr);//文章热点
        },
        error: function (err) {
            alert(err);
        }
    });
}

//文艺文学
function getart() {
    $.ajax({
        type: "Post", //http通信传参方式
        url: "../server/ArticleManage.aspx/getart", //服务器端资源
        contentType: "application/json; charset=utf-8", //客户端传值
        dataType: "json", //服务器传值格式
        //回调函数：
        success: function (data) {
            articleList = data.d;
            var aStr = "";
            for (var i = 0; i < articleList.length; i++) {
                if (articleList[i].image) {
                    articleList[i].image = "data:image/png;base64," + articleList[i].image
                    aStr += '<li><dl><dt><img style="width:40px;height:35px" src="' + articleList[i].image + '"/></dt><dd>' +
                        '<a class="title03" href = "articleInfo.html?id=' + articleList[i].ArticleID + '" >' + articleList[i].ArticleTitle + '-----' + Test(articleList[i].time) + '</a> <span class="title04">' +
                        '</span></dd></dl></li>';
                }
                else {
                    articleList[i].image = "data:image/png;base64,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"
                    aStr += '<li><dl><dt><img style="width:40px;height:35px" src="' + articleList[i].image + '"/></dt><dd>' +
                        '<a class="title03" href = "articleInfo.html?id=' + articleList[i].ArticleID + '" >' + articleList[i].ArticleTitle + '-----' + Test(articleList[i].time) + '</a> <span class="title04">' +
                        '</span></dd></dl></li>';
                }

            }
            $("#articleList_cont").html(aStr);//文艺文学
        },
        error: function (err) {
            alert(err);
        }
    });
}