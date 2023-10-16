using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace TestMVC.Controllers
{
    public static class HtmlRequestHelper
    {
        public static string KeyValue(this UrlHelper htmlHelper, string key)
        {
            var routeValues = HttpContext.Current.Request.RequestContext.RouteData.Values;

            if (routeValues.ContainsKey(key))
                return (string)routeValues[key];
            else if (HttpContext.Current.Request.QueryString.AllKeys.Contains(key))
                return HttpContext.Current.Request.QueryString[key];

            return string.Empty;
        }

        public static string ControllerName(this UrlHelper htmlHelper)
        {
            var routeValues = HttpContext.Current.Request.RequestContext.RouteData.Values;

            if (routeValues.ContainsKey("controller"))
                return (string)routeValues["controller"];

            return string.Empty;
        }

        public static string ActionName(this UrlHelper htmlHelper)
        {
            var routeValues = HttpContext.Current.Request.RequestContext.RouteData.Values;

            if (routeValues.ContainsKey("action"))
                return (string)routeValues["action"];

            return string.Empty;
        }
    }
}