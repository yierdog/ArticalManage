using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using System.Web.Services;
using System.Web.UI;
using System.Web.UI.WebControls;
using WebApplication2.server;

namespace WebApplication23.server
{
    public partial class WebForm1 : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {


            //上传附件
                string root = AppDomain.CurrentDomain.BaseDirectory;
                string path = "Temp/";
                if (!Directory.Exists(root + path)) //判断给定的路径上是否存在该目录
                {
                    Directory.CreateDirectory(root + path); //不存在则创建该目录
                }
                System.Web.HttpPostedFile postedFile = Request.Files[0];//获取客户端上载文件的集合
                string filename = Path.GetFileName(postedFile.FileName);//获取客户端上传文件的名称及其后缀

                string newFileName = GetSecond() + "_" + filename; //时间戳

                string fileNamePath = root + path + newFileName; //将块文件和临时文件夹路径绑定
                postedFile.SaveAs(fileNamePath); //保存上载文件内容
                //附件信息写入数据库
                List<filename> fileList = new List<filename>();
                filename file = new filename();
                file.id = Guid.NewGuid().ToString();
                file.file_name = filename;
                file.newfilename = newFileName;
                file.uploadpath = path + newFileName;

            //SaveAffixInfo(file.id, file.file_name, file.uploadpath, file.newfilename);
            fileList.Add(file);

                int saveCount = SaveAffixInfo(file.id, file.file_name, file.newfilename, file.uploadpath);
                if (saveCount > 0)
                {
                    string returnStr = JsonConvert.SerializeObject(fileList);
                    Response.Write(returnStr);
                }
                else
                {
                    Response.Write("false");
                }
            

        }
        //上传图片
        [WebMethod]
        public static string imgupload(string base64Str)
        {
            return "true";
        }
        [WebMethod]
        public string GetSecond()
        {
            return string.Format("{0:HHmmssffff}", DateTime.Now);
        }
        [WebMethod]
        public int SaveAffixInfo(string id, string filename, string newfilename,string uploadpath)
        {


            finalEntities1 ef = new finalEntities1();
            string str = "insert into filename (id,file_name,newfilename,uploadpath) values('" + id + "','" + filename + "','" + newfilename + "','" + uploadpath + "')";

            int i = ef.Database.ExecuteSqlCommand(str);


            return i;

        }

        //删除附件del_affix_temp
        [WebMethod]
        public static string Del_affix_temp(string id)
        {


            finalEntities1 ef = new finalEntities1();
            string sql = @"
            delete from filename where
            id = '" + id + "' ";
            int i = ef.Database.ExecuteSqlCommand(sql);

            if (i > 0)
                return "true";
            else
                return "false";

        }
        //附件显示
        [WebMethod]
        public static List<filename> Get_filename_id(string filename) {

            finalEntities1 ef = new finalEntities1();
            string sql = @"select * from filename where id in ("+ filename +")";
            List<filename> list = ef.Database.SqlQuery<filename>(sql).ToList();
            return list;
        }

        
    }
}
