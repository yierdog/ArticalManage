//const { post } = require("jquery");

var currentUser;
var name
var Test;
var role;
var privilege;
var password1;
//判断用户
function Useruser() {
    $("#info").click(function () {
        var name = $("#info").text();
        if (name == '登录') {
            window.location.href = "login.html";
        } else {
            var objson = '{"name":"' + name + '"}';
            $.ajax({
                type: "Post",
                // 方法所在页面和方法名
                url: "../server/ArticleManage.aspx/Useruser",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: objson,
                success: function (data) {
                    Userrole = data.d;
                    //var role = Userrole[0].role;
/*                    for (var i = 0; i < Userrole.length; i++) {
                        if (Userrole[i].role == 'administrator') {
                            window.location.href = "admin.html";
                        }
                        else if (Userrole[i].role == 'author') {
                            window.location.href = "personal.html";
                        }
                        else if (Userrole[i].role == 'user') {
                            window.location.href = "read.html";
                        }
                    }*/
                    window.location.href = "admin.html";
                    localStorage.setItem("role", Userrole[i].role);
                    /*localStorage.setItem("role",role);*/
                },
                error: function (er) {
                }
            });
        }
    });
}

//获取权限并显示
function lookprivilege(privilege) {
    var dataJson = '{"id":"' + privilege + '"}'; 
    $.ajax({
        type: "Post",
        // 方法所在页面和方法名
        url: "../server/ArticleManage.aspx/lookprivilege",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: dataJson,
        success: function (data) {
            list = data.d;

            //去空格
            list[0].url = list[0].url.replace(/\s+/g, "");

            /*var str = '<li class="active" onclick="change(\'' + list[0].url + '\');"><a href = "#" ><i class="icon-dashboard"></i><span class="menu-text"> ' + list[0].title + '</span></a></li > ';*/
            var str = '<dt> 栏目中心 </dt>'
            $("#nowposition").html(list[0].url);
            $("#iframe_page_content_container").attr("src", "" + list[0].url + "");
            //dyniframesize("iframe_page")
            for (var i = 0; i < list.length; i++) {
                list[i].url == list[0].url.replace(/\s+/g, ""); //是否与第一个 URL(list[0].url) 相同，正则表达式替换掉所有连续的空白字符
                /*str += '<li onclick="change(\'' + list[i].url + '\',' + list[i].id + ');" id=' + list[i].id + '><a id="' + list[i].name + '" ><i class="icon-dashboard"></i><span class="menu-text">' + list[i].title + '</span></a></li > ';
*/
                str += '<dd class="cur" onclick="change(\'' + list[i].url + '\',' + list[i].id + ');" id=' + list[i].id + '><a id="">' + list[i].title + '</a></dd>';
            }

            $("#menu").html(str);


        },
        error: function (er) {
        }
    });
}

function change(url, id) {
    // 移除所有菜单项的 'active' 类
    document.querySelectorAll('#menu dd').forEach(function (item) {
        item.classList.remove('active');
    });

    // 为当前点击的菜单项添加 'active' 类
    // JavaScript
    // 获取容器元素
    const container = document.getElementById(id);

    // 添加CSS类
    container.classList.add('active');
    $("#iframe_page_content_container").attr("src", "" + url + "");
    $("#nowposition").html(url);
    //dyniframesize("iframe_page")

}



//退出
function Userisout() {
    $("#exit").click(function () {
        $.ajax({
            type: "Post",
            // 方法所在页面和方法名
            url: "../server/ArticleManage.aspx/Userisout",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                var a = data.d;
                if (a == "true") {
                    window.location = "login.html";
                }
            },
                error: function (er) {
                    console.log(er);
                }
            
        });
    });
};



function UserIsLogin() {
    $.ajax({
        type: "Post",
        // 方法所在页面和方法名
        url: "../server/ArticleManage.aspx/UserIsLogin",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            currentUser = data.d;
            if (currentUser != null) {
                $("#info").html(currentUser.name);
                role = currentUser.role;
                privilege = currentUser.privilege;
                lookprivilege(privilege);
                /*window.location.href = "admin.html";*/
                /*getArticleLi(currentUser.name);*/
                //Getpsw(currentUser.name);//个人信息
                //getAuthorcount(currentUser.name);
            }
        },
        error: function (er) {
        }
    });
}

/*
//遍历到作者的co

function getArticleLi(name) {

    var dataJson = '{"name":"' + name + '"}';
    $.ajax({
        type: "Post", //http通信传参方式
        url: "../server/ArticleManage.aspx/ArticleListAuthor", //服务器端资源
        contentType: "application/json; charset=utf-8", //客户端传值
        dataType: "json", //服务器传值格式
        //回调函数：
        data: dataJson,
        success: function (data) {
            articleList = data.d;
            var lis = '';
            for (var i = 0; i < articleList.length; i++) {

                lis += '<li><dl><dt class="messdt"></dt><dd>'+
                    '<a href = "articleInfo.html?id=' + articleList[i].ArticleID + '" class="title03 hovercolor" style="width:300px">' + articleList[i].ArticleTitle + '--------- ' + articleList[i].Author + '---'+ Test(articleList[i].time) +
                    '</a><button style="float:right;margin-left:20px;" onclick="del(' + articleList[i].ArticleID + '); ">删除</button><a style="float:right" href="upda.html?id=' + articleList[i].ArticleID + '">修改</a></dd></dl></li>';

            }
            *//*$("#co1").html(lis);*//*
            $("#personid").html(lis);
        },

        error: function (err) {
            alert(err);
        }
    });
};*/

$(document).ready(function () {
    UserIsLogin();
    Useruser();
    Userisout();

});

//搜索框的地址传参，查询后跳转页面
$(document).ready(function () {
    $("#oi").click(function () {
        var oo = $('#oo').val();
        $("#oi").attr("href", "search.html?search=" + oo);
    })
})

