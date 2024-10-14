

   $(document).ready(function () {
    $("#but_add").click(function () {
        var name = $("#na").val();
        var password = $("#ps").val();
        var role = $("#rol").val();
        if (role == 'author') {
            privilege = "2, 3, 4";
        } else {
            privilege = "1, 2, 3, 4, 5";
        }
         var objson = "{'name':'" + name + "','password':'" + password + "','role':'" + role + "','privilege':'" + privilege + "'}";
        $.ajax({
            type: "Post",
            url: "../server/ArticleManage.aspx/Add_stud",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: objson,
            success: function (data) {
                var i = data.d;
                if (i > 0) {
                    alert("注册成功")
                    window.location = "login.html";
                }
                else {
                    alert("注册失败")
                }
            },
            error: function (err) {
                alert(err);
            }
        });
    });
    });