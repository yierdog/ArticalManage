var pageSize1 = 5;   // 每页数据条数
var currentPage1 = 1;//当前页数
var totalpage1;    // 总页数
var count1;  // 接收到的所有数据
var index1;   //当前页码
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
function painn(count1) {
    if (count1 / pageSize1 > parseInt(count1 / pageSize1)) {
        totalpage1 = parseInt(count1 / pageSize1) + 1;
    }
    else {
        totalpage1 = parseInt(count1 / pageSize1);
    }
    var tempStr1 = "共" + count1 + "条记录 分" + totalpage1 + "页";
    $("#ulinfo2").html(tempStr1);

    var tempStr1 = '';

    if (ye > totalpage1) {
        ye = totalpage1;
    }


    tempStr1 += '<li id="' + i + '"><a onclick="goup(' + i + ');"><<</a></li>';
    for (i=1; i <= ye; i++) {
        if (i == currentPage1) {
            tempStr1 += '<li id=" ' + i + '" class="active"><a onclick="goPagee(' + i + ',' + pageSize1 + ');">' + i + '</a></li>';
        } else {
            tempStr1 += '<li id="' + i + '"><a onclick="goPagee(' + i + ',' + pageSize1 + ');">' + i + '</a></li>';
        }
    }
    tempStr1 += '<li id="' + i + '"><a onclick="godown(' + i + ');">>></a></li>';
    $("#ulinfo3").html(tempStr1);
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
    goPagee(i);
    painn(count1);
}

function godown(a) {
    ye = a + 7;
    goPagee(a);
    painn(count1);
}

function goPagee(index1) {
    var datao = {
        index1: index1,
        pageSize1: pageSize1
    };
    var dataStr = $.toJSON(datao);
    $.ajax({
        type: "Post",
        url: "../server/ArticleManage.aspx/getauthorData",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        data: dataStr,
        success: function (data) {
            if (data.d != null && data.d != "") {
                articleList = data.d;
                showList(articleList);
            } else {
                $("#ulinfo3").html('<tr><td colspan="12"><h3>无记录</h3></td></tr>');
            }

        },
        error: function (er) {
            alert(er);
        }
    });
}

function showList(articleList) {
    var lis1 = "";
    for (var i = 0; i < articleList.length; i++) {
        lis1 += '<li><dl><dt class="messdt"></dt><dd>' +
            '<a target="_top" href = "articleInfo.html?id=' + articleList[i].ArticleID + '" class="title03 hovercolor" style="width:300px">' + articleList[i].ArticleTitle + '--------- ' + articleList[i].Author + '---' + Test(articleList[i].time) +
            '</a><button style="float:right;margin-left:20px;" onclick="del(' + articleList[i].ArticleID + '); ">删除</button><a style="float:right" href="upda.html?id=' + articleList[i].ArticleID + '">修改</a></dd></dl></li>';
}
    $("#personid").html(lis1);
}


//获取要查询的内容总数
$(document).ready(function () {
    getAuthorcount();
})
function getAuthorcount() {
    //var dataJson = '{"name2":"' + name2 + '"}';
    $.ajax({
        type: "Post", //http通信传参方式
        url: "../server/ArticleManage.aspx/getauthorcount", //服务器端资源
        contentType: "application/json; charset=utf-8", //客户端传值
        dataType: "json", //服务器传值格式
        //data: dataJson,
        //回调函数：
        success: function (data) {
            count1 = data.d;
            painn(count1);
            //加载第一页
            goPagee(1);
        },

        error: function (err) {
            alert(err);
        }
    });
}