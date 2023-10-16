using ReportBase;
using System;
using System.CodeDom;
using System.Web.Mvc;
using TestMVC;
using TestMVC.reportService;
using static TestMVC.Controllers.HomeController;

namespace ReportGenerator.Controllers
{
    public abstract class ReportBaseController : Controller
    {
        //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        protected abstract string AppName { get; }
        public abstract string UserID { get; }
        // پراکسی برای آزاد کردن منبع سرویس پس از پایان کار
        private ServiceProxyHelper<ReportServiceContractClient, IReportServiceContract> proxy
        {
            get
            {
                return new ReportBase.ServiceProxyHelper<ReportServiceContractClient, IReportServiceContract>();
            }
        }

        public NameDescription[] TemplatesList()
        {
            using (proxy)
            {
                return proxy.Service.GetTemplateNames(AppName);
            }
        }
        public NameDescription[] ReportList(string templateID)
        {
            using (proxy)
            {
                return proxy.Service.ReportList(AppName, templateID, UserID);
            }
        }
        public FileContentResult GetExcel(ReportBase.ReportModel r)
        {
            try
            {
                using (proxy)
                {
                    /*
                                        FileContentResult o = new FileContentResult(proxy.Service.Excel(AppName, TemplateName, UserID, r, 1, 9999, 20), MimeType.Xls);
                                        o.FileDownloadName = r.Name + ".xls";
                                        return o;*/
                    return null;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        protected FileContentResult GetDoc(ReportBase.ReportModel r)
        {
            try
            {
                using (proxy)
                {
                    /*
                                        var o = new FileContentResult(proxy.Service.Docx(AppName, TemplateName, UserID, r, 1, 9999, 20), MimeType.Doc);
                                        o.FileDownloadName = r.Name + ".doc";
                                        return o;*/
                    return null;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        protected FileContentResult GetPdf(ReportBase.ReportModel r)
        {
            try
            {
                using (proxy)
                {

                    //var o = new FileContentResult(proxy.Service.Pdf(AppName, TemplateName, UserID, r, 1, 9999, 20), MimeType.Pdf);
                    //o.FileDownloadName = r.Name + ".pdf";
                    //return o;
                    return null;
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        protected string ReportSave(ReportBase.ReportModel r, string templateID, string name, bool genAccess)
        {         
            try
            {
                using (proxy)
                {
                    return proxy.Service.ReportSave(AppName, templateID, UserID, r, name, genAccess);
                }
            }
            catch (Exception ex)
            {
                return "error saving report";
            }
        }

        /// <summary>
        protected bool ReportDrop(string name, string templateID)
        {
            using (proxy)
            {
                return proxy.Service.ReportDrop(AppName, templateID, UserID, name);
            }
        }
        protected ReportModel ReportLoad(string name, string templateID)
        {            
            using (proxy)
            {
                return proxy.Service.ReportLoad(AppName, templateID, UserID, name);
            }
        }
        protected string GetDataPage(ReportBase.ReportModel r, string templateID, int FromPage, int ToPage, int PageSize)
        {
            if (r.Columns.Count == 0)
                return null;
            using (proxy)
            {                
                var d = proxy.Service.DataPage(AppName, templateID, UserID, r, FromPage, ToPage, PageSize);
                return d;
            }
        }
        protected string GetXSLTranslator(ReportBase.ReportModel r, string templateID)
        {
            using (proxy)
            {
                return proxy.Service.XSLTranslator(AppName, templateID, r, false);
            }
        }
        public ReportTemplateColumn[] GetTemplateColumns(string templateID)
        {
            using (proxy)
            {
                return proxy.Service.GetColumns(AppName, templateID, UserID);
            }
        }
    }
    //abstract class MimeType
    //{
    //    public static string Doc { get { return "application/msword"; } }
    //    public static string DocX { get { return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"; } }
    //    public static string Xls { get { return "application/vnd.ms-excel"; } }
    //    public static string Xlsx { get { return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; } }
    //    public static string Pdf { get { return "application/pdf"; } }
    //}
}
