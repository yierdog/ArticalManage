var role;
var list;
$(document).ready(function () {

    userIsLogin1();

});


function userIsLogin1() {
    $.ajax({
        type: "Post",
        // ��������ҳ��ͷ�����
        url: "../../WebForm1.aspx/userIsLogin",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            currentUser = data.d;
            role = currentUser.role;
            $("#name").html(currentUser.name);
            $("#role").html(currentUser.role);
            lookrole();
        },
        error: function (er) {
        }
    });
}
function lookrole() {


    $.ajax({
        type: "Post",
        // ��������ҳ��ͷ�����
        url: "self.aspx/lookrole",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{'role':'" + role + "'}",
        success: function (data) {
            var por = data.d;
            var persor = por[0].perstr;
            //  alert(persor);
            lookablit(persor)

        },
        error: function (er) {
        }
    });
}
function lookablit(persoe) {

    $.ajax({
        type: "Post",
        // ��������ҳ��ͷ�����
        url: "self.aspx/lookability",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{'id':'" + persoe + "'}",
        success: function (data) {
            list = data.d;

            //ȥ�ո�
            list[0].url = list[0].url.replace(/\s+/g, "");

            var str = '<li class="active" onclick="change(\'' + list[0].url + '\');"><a href = "#" ><i class="icon-dashboard"></i><span class="menu-text"> ' + list[0].title + '</span></a></li > ';

            $("#breadcrumbs").html(list[0].url);
            $("#iframe_page").attr("src", "" + list[0].url + "");
            dyniframesize("iframe_page")
            for (var i = 1; i < list.length; i++) {
                list[i].url == list[0].url.replace(/\s+/g, "");
                str += '<li onclick="change(\'' + list[i].url + '\',' + list[i].id + ');" id=' + list[i].id + '><a id="' + list[i].name + '" ><i class="icon-dashboard"></i><span class="menu-text">' + list[i].title + '</span></a></li > ';
            }

            $("#menu").html(str);


        },
        error: function (er) {
        }
    });
}

function change(url, id) {
    // �Ƴ����в˵���� 'active' ��
    document.querySelectorAll('#menu li').forEach(function (item) {
        item.classList.remove('active');
    });

    // Ϊ��ǰ����Ĳ˵������ 'active' ��
    // JavaScript
    // ��ȡ����Ԫ��
    const container = document.getElementById(id);

    // ���CSS��
    container.classList.add('active');
    $("#iframe_page").attr("src", "" + url + "");
    $("#breadcrumbs").html(url);
    dyniframesize("iframe_page")

}

//iframe���������߶�
function dyniframesize(down) {
    var pTar = null;
    if (document.getElementById) {
        pTar = document.getElementById(down);
    }
    else {
        eval('pTar = ' + down + ';');
    }
    if (pTar && !window.opera) {
        //begin resizing iframe 
        pTar.style.display = "block"
        if (pTar.contentDocument && pTar.contentDocument.body.offsetHeight) {
            //ns6 syntax 
            pTar.height = pTar.contentDocument.body.offsetHeight + 20;
            pTar.width = pTar.contentDocument.body.scrollWidth + 20;
        }
        else if (pTar.Document && pTar.Document.body.scrollHeight) {
            //ie5+ syntax 
            pTar.height = pTar.Document.body.scrollHeight;
            pTar.width = pTar.Document.body.scrollWidth;
        }
    }

}
//�˳���¼
function outt() {
    $.ajax({
        type: "Post",
        // ��������ҳ��ͷ�����
        url: "self.aspx/outLogin",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            currentUser = data.d;
            alert("�˳���¼�ɹ��������µ�¼");
            if (currentUser == null) {
                window.location.href = '../login.html';
            }
        },
        error: function (er) {
        }
    });
}


[WebMethod]
        //��ȡ��Ӧ��ɫȨ��
        public static List < role1 > lookrole(string role)
{
            //���ݿ��ѯ
            uiendEntities5 ef = new uiendEntities5();
            string sql = " select * from dbo.role1 where  name='" + role + "'";
    List < role1 > list = ef.Database.SqlQuery < role1 > (sql).ToList();
    return list;
}
[WebMethod]
        //��ȡ��ӦȨ��
        public static List < ability > lookability(string id)
{
            //���ݿ��ѯ
            uiendEntities5 ef = new uiendEntities5();
            string sql = " select * from dbo.ability where  id in(" + id + ")";
    List < ability > list = ef.Database.SqlQuery < ability > (sql).ToList();
    return list;
}
//�˳���¼
[WebMethod]
        public static User1 outLogin()
{
    HttpContext.Current.Session["User1"] = null;
    if (HttpContext.Current.Request.Cookies["User1"] != null) {
                HttpCookie ck = HttpContext.Current.Request.Cookies["User1"];
        ck.Value = "-1";
        ck.Expires = DateTime.Now.AddDays(-100);
        HttpContext.Current.Response.Cookies.Add(ck);
    }
    return null;

}
    }
}