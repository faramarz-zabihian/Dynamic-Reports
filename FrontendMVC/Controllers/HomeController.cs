using ReportBase;
using ReportGenerator.Controllers;
using System.Configuration;
using System.Web.Mvc;


namespace TestMVC.Controllers
{
    public class HomeController : ReportBaseController
    {
        string application_code; 
        protected override string AppName => application_code;
        public override string UserID { get { return "1"; } }
        public HomeController() => application_code = ConfigurationManager.AppSettings["templateApplication"];

        // JavaScript endpoints 
        public JsonSoftResult ListTemplates() => new JsonSoftResult(TemplatesList());
        public JsonSoftResult ListReport(string templateID) => new JsonSoftResult(ReportList(templateID));
        public JsonSoftResult GetColumns(string templateID) => new JsonSoftResult(GetTemplateColumns(templateID));
        public JsonSoftResult SaveReport(ReportBase.ReportModel r, string templateID, string name, bool genAccess) => new JsonSoftResult(ReportSave(r, templateID, name, genAccess));
        public JsonSoftResult DropReport(string name, string templateID) => new JsonSoftResult(ReportDrop(name, templateID) ? "Success" : "Failed");
        public JsonSoftResult PageData(ReportBase.ReportModel r, string templateID, int FromPage, int ToPage, int PageSize) => new JsonSoftResult(GetDataPage(r, templateID, FromPage, ToPage, PageSize));
        public JsonSoftResult LoadReport(string name, string templateID) => new JsonSoftResult(ReportLoad(name, templateID));
        public JsonSoftResult XSLTranslator(ReportBase.ReportModel r, string templateID) => new JsonSoftResult(GetXSLTranslator(r, templateID));

        // views
        public ActionResult Index(string returnUrl, string templateName)
        {
            ViewBag.ReturnUrl = returnUrl;
            return View();
        }
        public class MyModel
        { 
            public string TemplateId { get; set; }
            public ReportTemplateColumn[] ReportColumns { get; set; }
        }
        public ActionResult Designer(string templateID, string returnUrl)
        {
            ViewBag.ReturnUrl = returnUrl;
            // find columns related to this template
            // and pass it to the scripts in the page
            
            ReportTemplateColumn[] tmc = GetTemplateColumns(templateID);

            return View("Designer", new MyModel { TemplateId = templateID, ReportColumns = tmc});
        }
    }
}