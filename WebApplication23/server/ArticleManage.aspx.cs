﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI.WebControls;
using System.Web.Services;
using WebApplication23;
using System.Data.SqlClient;
using System.IO;
using Newtonsoft.Json;
using Microsoft.Azure.Cosmos.Linq;

namespace WebApplication23.server
{
    public partial class ArticleManage : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {

        }
        //用户验证
        [WebMethod]
        public static user_table UserIsLogin()
        {
            user_table currentUser;
            if (HttpContext.Current.Session["userInfo"] != null)
            {
                currentUser = HttpContext.Current.Session["userInfo"] as user_table;
                return currentUser;
            }
            else if (HttpContext.Current.Request.Cookies["userInfo"] != null)
            {
                return GetUserUnitRegionInfoFromCookie();
            }
            else
            {
                return null;
            }
        }
        [WebMethod]
        //cookie状态检查
        public static user_table GetUserUnitRegionInfoFromCookie()
        {
            if (HttpContext.Current.Request.Cookies["userInfo"] != null)
            {
                if (HttpContext.Current.Request.Cookies["userInfo"].Value == "-1")
                    return null;

                user_table u = new user_table();
                string id = HttpContext.Current.Request.Cookies["userInfo"].Value;
                int Id = int.Parse(id);
                //List<user_table> users;
                user_table user;

                using (finalEntities1 entity = new finalEntities1())
                {
                    //users = entity.user_table.Where(a => a.Id == Id).ToList(); 
                    string sql = " select * from user_table where id=" + Id;
                    List<user_table> list = entity.Database.SqlQuery<user_table>(sql).ToList();
                    if (list.Count() > 0)
                    {
                        user = list[0];
                        HttpContext.Current.Session["userInfo"] = user;
                        return u;
                    }
                    return null;
                }
            }
            return null;
        }
        //分户
        [WebMethod]
        public static List<user_table> Useruser(string name)
        {
            finalEntities1 ef = new finalEntities1();
            string sql = "select * from user_table where name = '" + name + "'";
            List<user_table> list = ef.Database.SqlQuery<user_table>(sql).ToList();
            return list;
        }

        //获取权限
        [WebMethod]
        //获取对应权限
        public static List<menus> lookprivilege(string id)
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string sql = "select * from menus where  id in(" + id + ")";
            List<menus> list = ef.Database.SqlQuery<menus>(sql).ToList();
            return list;
        }
        //登录
        /*        [WebMethod]
                public static string UserIsValid(string name, string password)
                {
                    finalEntities1 entity = new finalEntities1();
                    string sql = "select * from user_table where name='" + name + "'and password='" + password + "'";
                    List<user_table> list = entity.Database.SqlQuery<user_table>(sql).ToList();
                    if (list.Count > 0)
                    {
                        HttpContext.Current.Session["userInfo"] = list[0];
                        if (remenberoneweek)
                    SaveUserUnitRegionInfoToCookie(list.id.ToString());
                        return "true";
                    }
                    else
                    {
                        return "false";
                    }
                }*/

        [WebMethod]
        public static string UserIsValid(string name, string password, Boolean remenberoneweek)
        {
            //string sql = "";
            string pwd = md5(password);

            string sql = "select * from user_table where name=@p1 and password=@p2";

            List<user_table> users;
            user_table user;

            using (finalEntities1 entity = new finalEntities1())
            {
                users = entity.Database.SqlQuery<user_table>(sql,
                   new SqlParameter { ParameterName = "p1", Value = name },
                   new SqlParameter { ParameterName = "p2", Value = pwd }).ToList();
            }

            if (users.Count() > 0)
            {
                //int i = 0, j = 0;
                user = users[0];
                HttpContext.Current.Session["userInfo"] = user;
                if (remenberoneweek)
                    SaveUserUbitRegionInfoToCookie(user.id.ToString());
                return "true";
            }
            else
            {
                return "false";
            }
        }

        [WebMethod]
        public static void SaveUserUbitRegionInfoToCookie(string id)
        {
            HttpCookie ck = new HttpCookie("userInfo", id);
            ck.Expires = DateTime.Now.AddDays(7);
            HttpContext.Current.Response.Cookies.Add(ck);
        }

        [WebMethod]
        private static string md5(string str)
        {
            return System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(str, "MD5").ToLower();
        }



        [WebMethod]
        //退出登录
        public static string Userisout()
        {
            if (HttpContext.Current.Session["userInfo"] != null)
            {
                user_table currentUser = HttpContext.Current.Session["userInfo"] as user_table;
                HttpContext.Current.Session["userInfo"] = null;
                if (HttpContext.Current.Request.Cookies["userInfo"] != null)
                {
                    HttpCookie ck = HttpContext.Current.Request.Cookies["userInfo"];
                    ck.Value = "-1";
                    ck.Expires = DateTime.Now.AddDays(-100);
                    HttpContext.Current.Response.Cookies.Add(ck);
                }
            }
            return "true";
        }


        //注册
        [WebMethod]
        public static int Add_stud(string name, string password, string role,string privilege)
        {
            string pwd = md5(password);
            finalEntities1 entity = new finalEntities1();
            string sql = @"
insert into user_table
(name,password,role,privilege) 
values ('" + name + "','" + pwd + "','" + role + "','" + privilege + "')";
            int i = entity.Database.ExecuteSqlCommand(sql);
            return i;
        }

        //新闻中心
        [WebMethod]
        public static List<code1> getnews()
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string sql = "set rowcount 5 select * from code1 where type = '新闻中心' order by ArticleID desc";
            List<code1> list = ef.Database.SqlQuery<code1>(sql).ToList();
            //vs2012+
            //List<Articles> list = ef.Database.SqlQuery<Articles>(sql).ToList();
            return list;
        }
        //文章热点
        [WebMethod]
        public static List<code1> getarticles()
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string sql = "set rowcount 10 select * from code1 where type = '文章热点' order by ArticleID desc";
            List<code1> list = ef.Database.SqlQuery<code1>(sql).ToList();
            //vs2012+
            //List<Articles> list = ef.Database.SqlQuery<Articles>(sql).ToList();
            return list;
        }
        //文艺文学
        [WebMethod]
        public static List<code1> getart()
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string sql = "set rowcount 10 select * from code1 where type = '文艺文学' order by ArticleID desc";
            List<code1> list = ef.Database.SqlQuery<code1>(sql).ToList();
            //vs2012+
            //List<Articles> list = ef.Database.SqlQuery<Articles>(sql).ToList();
            return list;
        }

        //获取内容总数
        [WebMethod]
        public static int getArticleListcount()
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string sql = "select count(*) from code1";
            //string sql = "select * from code1 order by ArticleID desc";
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            int counts = ef.Database.SqlQuery<int>(sql).First();
            return counts;
        }

        [WebMethod]
        public static List<code1> getArticleListData(int index, int pageSize)
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            string sql = @"select ArticleID, ArticleTitle,'' ArticleContent, Author, type,time,'' filename,''image
from(
select *, ROW_NUMBER() over(order by ArticleID desc) as row
from code1) as r
where row>= @p1 and row<= @p2";
            List<code1> list = ef.Database.SqlQuery<code1>(sql,
            new SqlParameter { ParameterName = "p1", Value = (index - 1) * pageSize + 1 },
            new SqlParameter { ParameterName = "p2", Value = index * pageSize }).ToList();
            return list;
        }

        //获取新闻中心总数
        [WebMethod]
        public static int getnewsArticleListcount()
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string sql = "select count(*) from code1 where type='新闻中心'";
            //string sql = "select * from code1 order by ArticleID desc";
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            int counts = ef.Database.SqlQuery<int>(sql).First();
            return counts;
        }
        [WebMethod]
        public static List<code1> getnewsData(int index, int pageSize)
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            string sql = @"select ArticleID, ArticleTitle,'' ArticleContent, Author, type,time,'' filename,''image
from(
select *, ROW_NUMBER() over(order by ArticleID desc) as row
from code1 where type='新闻中心') as r
where row>= @p1 and row<= @p2";
            List<code1> list = ef.Database.SqlQuery<code1>(sql,
            new SqlParameter { ParameterName = "p1", Value = (index - 1) * pageSize + 1 },
            new SqlParameter { ParameterName = "p2", Value = index * pageSize }).ToList();
            return list;
        }

        //获取文艺文学总数
        [WebMethod]
        public static int getartArticleListcount()
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string sql = "select count(*) from code1 where type='文艺文学'";
            //string sql = "select * from code1 order by ArticleID desc";
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            int counts = ef.Database.SqlQuery<int>(sql).First();
            return counts;
        }
        [WebMethod]
        public static List<code1> getartData(int index, int pageSize)
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            string sql = @"select ArticleID, ArticleTitle,'' ArticleContent, Author, type,time,''filename,''image
from(
select *, ROW_NUMBER() over(order by ArticleID desc) as row
from code1 where type='文艺文学') as r
where row>= @p1 and row<= @p2";
            List<code1> list = ef.Database.SqlQuery<code1>(sql,
            new SqlParameter { ParameterName = "p1", Value = (index - 1) * pageSize + 1 },
            new SqlParameter { ParameterName = "p2", Value = index * pageSize }).ToList();
            return list;
        }


        //获取文章热点总数
        [WebMethod]
        public static int GetarticalArticleListcount()
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string sql = "select count(*) from code1 where type='文章热点'";
            //string sql = "select * from code1 order by ArticleID desc";
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            int counts = ef.Database.SqlQuery<int>(sql).First();
            return counts;
        }
        [WebMethod]
        public static List<code1> GetarticallData(int index, int pageSize)
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            string sql = @"select ArticleID, ArticleTitle,'' ArticleContent, Author, type,time,''filename,''image
from(
select *, ROW_NUMBER() over(order by ArticleID desc) as row
from code1 where type='文章热点') as r
where row>= @p1 and row<= @p2";
            List<code1> list = ef.Database.SqlQuery<code1>(sql,
            new SqlParameter { ParameterName = "p1", Value = (index - 1) * pageSize + 1 },
            new SqlParameter { ParameterName = "p2", Value = index * pageSize }).ToList();
            return list;
        }


        //管理员中心
        [WebMethod]
        public static List<code1> Getadmin()
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string sql = "set rowcount 5 select * from code1 order by ArticleID desc";
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            List<code1> list = ef.Database.SqlQuery<code1>(sql).ToList();
            //vs2012+
            //List<Articles> list = ef.Database.SqlQuery<Articles>(sql).ToList();
            return list;
        }

        [WebMethod]
        public static code1 getArticleInfoByID(string id)
        {
            int ID = int.Parse(id);
            //数据库查询
            finalEntities1 ef = new finalEntities1();

            /*  string str = " select * from dbo.Articles where ArticleID=" + id;
              artical model = ef.ExecuteStoreQuery<artical>(str).First();*/
            code1 model = ef.code1.Where(a => a.ArticleID == ID).First();

            return model;
        }

        /*[WebMethod]
        public static int delArticleById(string id)
        {
            int ID = int.Parse(id);
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            code model = ef.code.Where(a => a.ArticleID == ID).First();
            ef.DeleteObject(model);
            int i = ef.SaveChanges();

            //sql
            //string sql = " delete from Articles where id="+id;
            ////vs2012+
            ////int i = ef.Database.ExecuteStoreCommand(str);
            //int i = ef.ExecuteStoreCommand(str);

            return i;
        }*/

        //查询数据库（修改）
        [WebMethod]
        public static List<code1> Update(string ArticleID)
        {
            finalEntities1 ef = new finalEntities1();
            string sql = "select * from code1 where ArticleID = '" + ArticleID + "'";
            List<code1> list = ef.Database.SqlQuery<code1>(sql).ToList();
            return list;
        }
        //修改
        [WebMethod]
        public static int saveArticle(string id, string ti, string con, string t)
        {
            finalEntities1 ef = new finalEntities1();
            string sql = @"update code1 set ArticleTitle = '" + ti + "', ArticleContent = '" + con + "', type = '" + t + "' where ArticleID = '" + id + "'";
            int i = ef.Database.ExecuteSqlCommand(sql);
            return i;
        }

        /*[WebMethod]
        public static int saveArticle(string id, string ti, string con, string t)
        {
            int ID = int.Parse(id);
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            code model = ef.code.Where(a => a.ArticleID == ID).First();
            *//*model.ArticleID = id;*//*
            model.ArticleTitle = ti;
            model.ArticleContent = con;
            *//*model.Author = au;*//*
            model.type = t;
            int i = ef.SaveChanges();
            return i;
        }*/



        //发布
        [WebMethod]

        public static int NewArticle(string title, string content, string ty, string time, string affix_ids,string base64)
        {
            user_table d = UserIsLogin();
            int i = 0;
            //数据库查询
            using (finalEntities1 ef = new finalEntities1())
            {
                code1 m = new code1();
                m.ArticleTitle = title;
                m.ArticleContent = content;
                m.Author = d.name;
                m.type = ty;
                m.time = DateTime.Parse(time);
                m.filename = affix_ids.TrimEnd(',');
                m.image = base64;
                ef.code1.Add(m);
                i = ef.SaveChanges();
            }


            //finalEntities1 ef = new finalEntities1();
            //string str = " Insert into code1 (ArticleTitle, ArticleContent, Author,type,time,filename) values('" + title + "','" + content + "','" + Author + "','" + ty + "','" + time + "','" + affix_ids.TrimEnd(',') + "')";
            //int i = ef.Database.ExecuteSqlCommand(str);
            return i;

        }

        //按作者查询
        [WebMethod]
        public static List<code1> ArticleListAuthor(string name)
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string sql = " set rowcount 5 select * from code1 where Author = '" + name + "' order by ArticleID desc ";
            //select* from code1 where Author = '" + name + "'
            List<code1> list = ef.Database.SqlQuery<code1>(sql).ToList();
            //vs2012+
            //List<Articles> list = ef.Database.SqlQuery<Articles>(sql).ToList();
            return list;
        }

        [WebMethod]
        //删除
        public static int Del(string ArticleID)
        {
            finalEntities1 ef = new finalEntities1();
            string sql = @"
delete from code1 where
ArticleID = '" + ArticleID + "' ";
            int i = ef.Database.ExecuteSqlCommand(sql);
            return i;
        }

        /*        //搜索
                [WebMethod]
                public static List<code1> Er(string title2)
                {
                    finalEntities1 ef = new finalEntities1();
                    string sql = "select * from code1 where ArticleTitle like '%" + title2 + "%'";
                    List<code1> list = ef.Database.SqlQuery<code1>(sql).ToList();
                    return list;
                }*/

        //搜索总数
        [WebMethod]
        public static int getER(string title2)
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string sql = "select count(*) from code1 where ArticleTitle like '%" + title2 + "%'";
            //string sql = "select * from code1 order by ArticleID desc";
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            int counts = ef.Database.SqlQuery<int>(sql).First();
            return counts;
        }
        [WebMethod]
        public static List<code1> getsearch(int index, int pageSize, string title2)
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            string sql = @"select ArticleID, ArticleTitle,'' ArticleContent, Author, type,time,''filename
from(
select *, ROW_NUMBER() over(order by ArticleID desc) as row
from code1 where ArticleTitle like '%" + title2 + "%')as r where row>= @p1 and row<= @p2";
            List<code1> list = ef.Database.SqlQuery<code1>(sql,
            new SqlParameter { ParameterName = "p1", Value = (index - 1) * pageSize + 1 },
            new SqlParameter { ParameterName = "p2", Value = index * pageSize }).ToList();
            return list;
        }


        //评论
        [WebMethod]
        public static int comment(string ttt, string name, string title, string te)
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string str = "insert into taking (cont,comment_author,title,time) values('" + ttt + "','" + name + "','" + title + "','" + te + "')";
            ////增 删 改 
            ////vs2012+
            int i = ef.Database.ExecuteSqlCommand(str);
            //int i = ef.ExecuteStoreCommand(str);

            return i;
        }

        //遍历评论
        [WebMethod]
        public static List<taking> ArticleListti(string title)
        {
            finalEntities1 ef = new finalEntities1();
            string sql = "select * from taking where title = '" + title + "'";
            List<taking> list = ef.Database.SqlQuery<taking>(sql).ToList();
            return list;
        }
        //删除评论
        [WebMethod]
        public static int Dele(string id)
        {
            finalEntities1 ef = new finalEntities1();
            string sql = @"
delete from taking where
id = '" + id + "' ";
            int i = ef.Database.ExecuteSqlCommand(sql);
            return i;
        }

        //回复评论
        [WebMethod]
        public static int Answer(string answe, string name, string to, string did)
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string str = "insert into answer (contment,comment_author,time,comment_id) values('" + answe + "','" + name + "','" + to + "','" + did + "')";
            ////增 删 改 
            ////vs2012+
            int i = ef.Database.ExecuteSqlCommand(str);
            //int i = ef.ExecuteStoreCommand(str);

            return i;
        }

        //遍历回复评论
        [WebMethod]
        public static List<answer> Blid(string id)
        {
            finalEntities1 ef = new finalEntities1();
            string sql = "select * from answer where comment_id = '" + id + "'";
            List<answer> list = ef.Database.SqlQuery<answer>(sql).ToList();
            return list;
        }

        [WebMethod]
        public static List<code1> ArticleListArticleID(string ArticleID)
        {
            finalEntities1 ef = new finalEntities1();
            string sql = "select * from code1 where ArticleID = '" + ArticleID + "'";
            List<code1> list = ef.Database.SqlQuery<code1>(sql).ToList();
            return list;
        }

        /*public static int ArticleListArticleID(string ArticleID)
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string str = "select * from code where ArticleID = '" + ArticleID + "'";
            ////增 删 改 
            ////vs2012+
            int i = ef.Database.ExecuteSqlCommand(str);
            //int i = ef.ExecuteStoreCommand(str);

            return i;
        }*/


        //用户管理
        [WebMethod]
        public static List<user_table> Manageuser()
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            string sql = "select * from user_table order by id desc";
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            List<user_table> list = ef.Database.SqlQuery<user_table>(sql).ToList();
            return list;
        }

        //删除用户
        [WebMethod]
        public static int DelAuthor(string id)
        {
            finalEntities1 ef = new finalEntities1();
            string sql = "delete from user_table where id = '"+id+"'";
            int i = ef.Database.ExecuteSqlCommand(sql);
            return i;
        }

        //个人信息
        [WebMethod]
        public static List<user_table> Getpsw()
        {
            //数据库查询
            user_table c = UserIsLogin();
            finalEntities1 ef = new finalEntities1();
            string sql = "select * from user_table where name = '" + c.name + "'";
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            List<user_table> list = ef.Database.SqlQuery<user_table>(sql).ToList();
            return list;
        }
        //修改密码
        [WebMethod]
        public static int savepsw(string newpwd)
        {
            user_table a = UserIsLogin();
            string pwd = md5(newpwd);
            finalEntities1 ef = new finalEntities1();
            string sql = @"update user_table set password = '" + pwd + "' where id = '" + a.id +"'";
            int i = ef.Database.ExecuteSqlCommand(sql);
            return i;
        }

        //获取作者总数
        [WebMethod]
        public static int getauthorcount()
        {
            //数据库查询
            user_table b = UserIsLogin();
            finalEntities1 ef = new finalEntities1();
            string sql = "select count(*) from code1 where Author = '" + b.name + "'";
            //string sql = "select * from code1 order by ArticleID desc";
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            int counts = ef.Database.SqlQuery<int>(sql).First();
            return counts;
        }

        [WebMethod]
        public static List<code1> getauthorData(int index1, int pageSize1)
        {
            //数据库查询
            finalEntities1 ef = new finalEntities1();
            //string sql = " select ArticleID, ArticleTitle, ArticleContent, Author, type from code1 ";
            string sql = @"select ArticleID, ArticleTitle,'' ArticleContent, Author, type,time,'' filename,''image
from(
select *, ROW_NUMBER() over(order by ArticleID desc) as row
from code1) as r
where row>= @p1 and row<= @p2";
            List<code1> list = ef.Database.SqlQuery<code1>(sql,
            new SqlParameter { ParameterName = "p1", Value = (index1 - 1) * pageSize1 + 1 },
            new SqlParameter { ParameterName = "p2", Value = index1 * pageSize1 }).ToList();
            return list;
        }
        public class Article_simple
        {
            public int ArticleID { get; set; }

        }




    }
}