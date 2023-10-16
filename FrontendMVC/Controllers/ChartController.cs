using System.Web.Mvc;

namespace TestMVC.Controllers
{
    public class ChartController : ChartViewController
    {
        public override string TemplateName { get { return "EstatePropertyExpertResult"; } }
        public override string AppName { get { return "amlak"; } }
        public override string UserID { get { return "1"; } }
        public ActionResult Index(string returnUrl)
        {
            //ConnectionStringSettings css = ConfigurationManager.ConnectionStrings["ExcelCon"];
            //DbProviderFactory factory = DbProviderFactories.GetFactory(css.ProviderName);
            //System.Data.OleDb.OleDbConnection c = new System.Data.OleDb.OleDbConnection(css.ConnectionString);

            //DbConnection cn = factory.CreateConnection();
            //cn.ConnectionString = css.ConnectionString;

            ////c.ConnectionString = css.ConnectionString;
            //cn.Open();

            //DbCommand cmd = cn.CreateCommand();
            //cmd.CommandText = "select [نماینده] from  [Sheet1$]";
            //DbDataReader dr = cmd.ExecuteReader(); 
            //while (dr.Read()) ;
            //dr.Close();
            //c.Close();

            ////DbCommand cmd = cn.CreateCommand();
            ////cmd.CommandText = "SELECT * FROM sys.Tables";

            //System.Data.OleDb.OleDbConnection con = new System.Data.OleDb.OleDbConnection();
            //con.ConnectionString = 
            //ViewBag.ReturnUrl = returnUrl;
            return View();
        }
    }
}
