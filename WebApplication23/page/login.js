
var currentUser;

$(document).ready(function () {
    UserIsLogin();
    $("#btn_login").click(function () {
        var name = $("#name").val();
        var psw = $("#psw").val();
        var remenberoneweek = $("#remember").prop("checked");
        var jsonName = "{'name':'" + name + "','password':'" + psw + "','remenberoneweek':'" + remenberoneweek + "'}";
        if (name.length == 0 || psw.length == 0) {
            layer.alert("用户名或密码不能为空，请重新输入！");
            return;
        }
        var layerii;
        $.ajax({
            type: "Post",
            url: "../server/ArticleManage.aspx/UserIsValid",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: jsonName,
            beforeSend: function () {
                layerii = layer.load('登录中...');
            },
            success: function (data) {
                layer.close(layerii);
                a = data.d;
                if (a == "true") {
                    window.location.href = "index.html";
                }
                else {
                    layer.alert('登录失败，请检查账户！', 8);
                }
            },
            error: function (err) {
                alert(err);
            }
        });
    });
});



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
                window.location = "index.html";
            }
        },
        error: function (er) {
        }
    });
}