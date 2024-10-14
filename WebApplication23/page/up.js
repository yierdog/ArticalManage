$(function () {
    var uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        container: document.getElementById('flash_uploader'),
        url: '../server/up.aspx',
        browse_button: 'pickfiles',

        init: {
            PostInit: function () { },
            FilesAdded: function (up, files) {
                uploader.start();
            },
            UploadProgress: function (up, file) {
                $("#progress_info").css("display", "block");//显示状态：block
                $("#progress_info_fileName").html(file.name);//当前上传文件名字
                $("#progress_info_data").attr("data-percent", file.percent + "%");//进度信息
                $("#progress_info_bar").width(file.percent + "%");//进度条宽度，使其与上传进度成正比
            },
            FileUploaded: function (up, file, data) {
                $("#progress_info").css("display", "none");
                $("#progress_info_fileName").html("");
                $("#progress_info_data").attr("data-percent", "0%");
                $("#progress_info_bar").width("0%");
                var files = data.response;
               
                if (files.length > 0) {
                    AddToList(files);
                } else {
                    alert("失败！");
                }
            },
            Error: function (up, err) {
                var f = err.file;
                alert(err);
            }
        }
    });
    uploader.init();
});

var fileList = [];
//将新增附件显示到div
function AddToList(filesStr) {
    var list = $.evalJSON(filesStr);
    fileList.push(list[0]);
    var returnStr = "";
    for (var i = 0; i < list.length; i++) {
        returnStr += "<tr class='row_temp' id='" + list[i].id + "'>";
        returnStr += "<td style='display:none;' class='row_temp_savePath'>" + list[i].uploadpath + "</td>";
        returnStr += "<td class='row_temp_fileName'>" + list[i].file_name + "</td>";
        returnStr += "<td style='width:60px;'><a title='查看' target='_blank' href='../" + list[i].uploadpath + "'><em class=\"icon-zoom-in\">查看</em></a></td>";
        returnStr += "<td style='width:60px;'><a title='删除' onclick='del_affix_temp(\"" + list[i].id + "\");'><em class=\"icon-remove\">删除</em></a></td>";
        returnStr += "</tr>";
    }
    $("#div_affixList").append(returnStr);
    $("#affixList_info").hide();
}

//删除临时附件文件，无数据库记录
function ii() {
    return fileList;
}


function del_affix_temp(id) {
    $.ajax({
        type: "Post",
        url: "../server/up.aspx/Del_affix_temp",//服务器端资源
        contentType: "application/json; charset=utf-8", //客户端传值
        dataType: "json", //服务器传值格式
        data: '{"id":"' + id + '"}',
        success: function (data) {
            if (data.d == "true") {
                alert("文件已删除");
                remove_row_info(id);
            }
        },
        error: function (er) {
            alert("ArticleManage.aspx/del_affix_temp");
        }
    });
}
//从div中删除附件信息
function remove_row_info(id) {
    $("#" + id).remove();
}

