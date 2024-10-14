
var pageSize = 10;   // 每页数据条数
var currentPage = 3;//当前页数
var totalpage;    // 总页数
var count;  // 接收到的所有数据
var index;   //当前页码
var i = 1;
var ye = 8;
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
        url: "../server/ArticleManage.aspx/getnewsData",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: dataStr,
        success: function (data) {
            if (data.d != null && data.d != "") {
                articleList = data.d;
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
    for (var i = 0; i < list.length; i++) {
        aStr += '<li><dl><dt class="messdt"></dt><dd>' +
            '<a  class="title03 hovercolor" href = "articleInfo.html?id=' + articleList[i].ArticleID + '" >' + articleList[i].ArticleTitle + '-----' + Test(articleList[i].time) + '</a>' +
            '<span class="title04 gray">2023-12-24</span></dd></dl></li>';
    }
    $("#coor").html(aStr);
}


//查询新闻中心总数
$(document).ready(function () {
    getnewsArticlecount();
})
function getnewsArticlecount() {
    $.ajax({
        type: "Post", //http通信传参方式
        url: "../server/ArticleManage.aspx/getnewsArticleListcount", //服务器端资源
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