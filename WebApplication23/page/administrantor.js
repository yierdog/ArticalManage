
$(document).ready(function () {
    $("#all_artical").click(function () {
        $("#iframe_page_content_container").attr("src", "all_artical.html")
    });
    $("#admin_info").click(function () {
        $("#iframe_page_content_container").attr("src", "adminperson.html")
    });
    $("#update_artical").click(function () {
        $("#iframe_page_content_container").attr("src", "upda.html")
    });
    $("#publish_artical").click(function () {
        $("#iframe_page_content_container").attr("src", "publi.html")
    });
    $("#menu_user").click(function () {
        $("#iframe_page_content_container").attr("src", "user.html")
    });

    Getpsw();
})

$(document).ready(function () {
        $.ajax({
            type: "Post",
            url: "../server/ArticleManage.aspx/Manageuser",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                user = data.d;
                var aStr = "";
                var aStr1 = "";
                for (var i = 0; i < user.length; i++) {

                 aStr1 += '<tr><td class="center"><label><input type="checkbox" class="ace"/><span class="lbl"></span>'+
                     '</label></td><td><a href="#">' + user[i].name + '</a></td><td>' + user[i].role + '</td><td><div class="visible-md visible-lg hidden-sm hidden-xs btn-group"><button class="btn btn-xs btn-danger">'+ 
                     '<i class="icon-trash bigger-120"></i></button></div><div class="visible-xs visible-sm hidden-md hidden-lg">'+
                      '<div class="inline position-relative"><button class="btn btn-minier btn-primary dropdown-toggle" data-toggle="dropdown">'+
                     '<i class="icon-cog icon-only bigger-110"></i></button><ul class="dropdown-menu dropdown-only-icon dropdown-yellow pull-right dropdown-caret dropdown-close">'+
                     '<li><a href="#" class="tooltip-error" data-rel="tooltip" title="Delete"><span class="red"><i class="icon-trash bigger-120"onclick="dele(' + user[i].id + ');"></i></span></a></li></ul></div></div></td></tr>';

                    aStr += '<tr><td><a href="#">' + user[i].name + '</a></td><td>' + user[i].role + '</td></tr > ';
                }
                $("#manageuser1").html(aStr1);
                $("#manageuser").html(aStr);
            },
            error: function (err) {
                alert(err);
            }
        });
});

//删除作者
function dele(id) {

    var objson = "{'id':'" + id + "'}";
    $.ajax({
        type: "Post",
        url: "../server/ArticleManage.aspx/DelAuthor",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: objson,
        success: function (data) {
            var i = data.d;
            if (i > 0) {
                alert("删除成功")
                location.reload();

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

//获取账号信息

function Getpsw() {
    //var dataJson = '{"name":"' + name + '"}';
    $.ajax({
        type: "Post",
        url: "../server/ArticleManage.aspx/Getpsw",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        //data: dataJson,
        success: function (data) {
            var list = data.d;
            var newStr = "";
            for (var i = 0; i < list.length; i++) {
                /*aStr += '<tr><td>"' + list[i].name + '"</td><td>"' + list[i].password + '"</td><td><button class="pwdss" id=' + list[i].id + '>修改</button></td></tr>';*/
                newStr += '<tr><td>' + list[i].name + '</td><td>' + list[i].role + '</td></tr>';

            };
            $("#key").html(newStr);
        },
        error: function (err) {
            alert(err);
        }
    });
}
//修改密码
$(document).ready(function () {
    $("#psw").click(function () {
        var newpwd = $("#newpwd").val();
        var objson = "{'newpwd':'" + newpwd + "'}";
        $.ajax({
            type: "Post",
            url: "../server/ArticleManage.aspx/savepsw",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: objson,
            success: function (data) {
                var i = data.d;
                if (i > 0) {
                    alert("修改成功")
                    window.location.href = "login.html";
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
