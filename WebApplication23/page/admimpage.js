var pageSize1 = 5;   // ÿҳ��������
var currentPage1 = 1;//��ǰҳ��
var totalpage1;    // ��ҳ��
var count1;  // ���յ�����������
var index1;   //��ǰҳ��
var i = 1;
var ye = 8;
//ʱ��ת��
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

//����ҳ��
function painn(count1) {
    if (count1 / pageSize1 > parseInt(count1 / pageSize1)) {
        totalpage1 = parseInt(count1 / pageSize1) + 1;
    }
    else {
        totalpage1 = parseInt(count1 / pageSize1);
    }
    var tempStr1 = "��" + count1 + "����¼ ��" + totalpage1 + "ҳ";
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
                $("#ulinfo3").html('<tr><td colspan="12"><h3>�޼�¼</h3></td></tr>');
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
            '</a><button style="float:right;margin-left:20px;" onclick="del(' + articleList[i].ArticleID + '); ">ɾ��</button><a style="float:right" href="upda.html?id=' + articleList[i].ArticleID + '">�޸�</a></dd></dl></li>';
}
    $("#personid").html(lis1);
}


//��ȡҪ��ѯ����������
$(document).ready(function () {
    getAuthorcount();
})
function getAuthorcount() {
    //var dataJson = '{"name2":"' + name2 + '"}';
    $.ajax({
        type: "Post", //httpͨ�Ŵ��η�ʽ
        url: "../server/ArticleManage.aspx/getauthorcount", //����������Դ
        contentType: "application/json; charset=utf-8", //�ͻ��˴�ֵ
        dataType: "json", //��������ֵ��ʽ
        //data: dataJson,
        //�ص�������
        success: function (data) {
            count1 = data.d;
            painn(count1);
            //���ص�һҳ
            goPagee(1);
        },

        error: function (err) {
            alert(err);
        }
    });
}