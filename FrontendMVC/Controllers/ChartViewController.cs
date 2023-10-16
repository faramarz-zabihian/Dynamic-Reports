using System;
using System.Web.Mvc;
using TestMVC.graphService;

namespace TestMVC.Controllers
{
    public abstract class ChartViewController : Controller
    {
        public abstract string TemplateName { get; }
        //--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
        public abstract string AppName { get; }
        public abstract string UserID { get; }
        public ActionResult Html(string tmpName = "")
        {
            return View();

        }

        // پراکسی برای آزاد کردن منبع سرویس پس از پایان کار
        public ReportBase.ServiceProxyHelper<GraphClient, IGraph> ServiceProxy
        {
            get
            {
                return new ReportBase.ServiceProxyHelper<GraphClient, IGraph>();
            }
        }

        public string GetScripts()
        {
            try
            {
                string methodBase = this.Url.Action(".") + "/";
                using (ServiceProxy)
                {
                    return ServiceProxy.Service.GetScripts().Replace("[METHODBASE]", methodBase);
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        public string GetGraphStyle(GraphModel g)
        {
            try
            {
                using (ServiceProxy)
                {
                    return ServiceProxy.Service.GetGraphStyle(AppName, TemplateName, UserID, g);
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        public string GetStyles()
        {
            try
            {
                using (ServiceProxy)
                {
                    return ServiceProxy.Service.GetStyles();
                }
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        public string GetForm()
        {
            try
            {
                using (ServiceProxy)
                {
                    string siteBase = "http://" + System.Web.HttpContext.Current.Request.Url.Authority;
                    return ServiceProxy.Service.GetForm(siteBase);
                }
                //string siteBase = "http://" + System.Web.HttpContext.Current.Request.Url.Authority;
                //string path = "~/App_Data/ReportGenerator/Index.txt";
                //string relativePath = Server.MapPath(path);
                //if (!System.IO.File.Exists(relativePath))
                //    System.IO.File.Create(relativePath);
                //return System.IO.File.ReadAllText(relativePath).Replace("[SITEBASE]", siteBase);                   
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public JsonResult ListGraph()
        {
            using (ServiceProxy)
            {
                return Json(ServiceProxy.Service.GraphList(AppName, TemplateName, UserID));
            }
        }
        public JsonSoftResult GetColumns()
        {
            using (ServiceProxy)
            {
                return new JsonSoftResult(ServiceProxy.Service.GetColumns(AppName, TemplateName, UserID));
            }
        }

        public JsonResult SaveGraph(GraphModel r, string name, bool genAccess)
        {
            try
            {
                using (ServiceProxy)
                {
                    return Json(ServiceProxy.Service.GraphSave(AppName, TemplateName, UserID, r, name, genAccess));
                }
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        /// <summary>
        public JsonResult DropGraph(string name)
        {
            using (ServiceProxy)
            {
                ServiceProxy.Service.GraphDrop(AppName, TemplateName, UserID, name);
                return Json("Success");
            }
        }
        public JsonSoftResult LoadGraph(string name)
        {
            using (ServiceProxy)
            {
                GraphModel g = ServiceProxy.Service.GraphLoad(AppName, TemplateName, UserID, name);
                return new JsonSoftResult(g);
            }
        }
        public string GetSVG(GraphModel g)
        {
            try
            {
                using (ServiceProxy)
                {
                    return ServiceProxy.Service.GetSVG(AppName, TemplateName, UserID, g);
                }
            }
            catch (Exception x)
            {
                throw;
            }
        }
        public JsonResult DrawingForm(GraphModel g)
        {

            using (ServiceProxy)
            {
                return Json(ServiceProxy.Service.GetDrawingForm(g));
            }
        }
        public JsonResult ListTemplate()
        {
            using (ServiceProxy)
            {
                return Json(ServiceProxy.Service.GetTemplateNames(TemplateName));
            }
        }

    }
}


