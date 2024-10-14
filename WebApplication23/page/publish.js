
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

 
    $("#btn_save").click(function () {
        var title = $("#title").val();
        var content = $("#content").val();
        //var Author = $("#info").text();
        var ty = $("#ty").val();
        if ($("#img").attr("src").split(",")[1]) {
            var base64 = $("#img").attr("src").split(",")[1];
        }
        else {
            var base64 = '';
        }

        var fileList = ii();
        var affix_ids = "";
        for (var i = 0; i < fileList.length; i++) {
            affix_ids += "'" + fileList[i].id + "',";
        }
        var oo = {
            title: title,
            content: content,
            //Author: Author,
            ty: ty,
            time: time,
            affix_ids: affix_ids,
            base64: base64
        }
        saveInfo(oo);
    });
});

function saveInfo(oo) {
    var dataJson = $.toJSON(oo);

    $.ajax({
        type: "Post", //http通信传参方式
        url: "../server/ArticleManage.aspx/NewArticle", //服务器端资源
        contentType: "application/json; charset=utf-8", //客户端传值
        dataType: "json", //服务器传值格式
        data: dataJson,
        //回调函数：
        success: function (data) {
            var i = data.d;
            if (i > 0) {
                alert("发布成功！");
                location.reload();
            } else {
                alert("发布失败！");
            }
        },
        error: function (err) {
            alert(err);
        }
    });
}

$(document).ready(function () {
    $("#fujian").change(function () {
        if (!this.files.length) return; //如果未点击图片，退出函数
        var reader = new FileReader();  //读取文件内容
        reader.readAsDataURL(this.files[0]); //DataURL网页上显示图片
        reader.onload = function (e) {
            $("#img").attr("src", this.result);
        };
    });
})

    //上传图片
        $("#upload").click(function () {
            var base64 = $("#img").attr("src").split(",")[1];
            var jsonBase64 = '{"base64Str":"' + base64 + '"}';
            $.ajax({
                type: "Post", //http通信传参方式
                url: "../server/up.aspx/imgupload", //服务器端资源
                contentType: "application/json; charset=utf-8", //客户端传值
                dataType: "json", //服务器传值格式
                data: jsonBase64,
                //回调函数：
                success: function (data) {
                    alert("上传文件成功！")
                },
                error: function (err) {
                    alert(err);
                }
            });
        })