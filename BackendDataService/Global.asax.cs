//using Microsoft.Practices.EnterpriseLibrary.Logging;
using System;

namespace WcfReportService
{
    public class Global : System.Web.HttpApplication
    {

        protected void Application_Start(object sender, EventArgs e)
        {
            //IConfigurationSource configurationSource = ConfigurationSourceFactory.Create();
            //LogWriterFactory logWriterFactory = new LogWriterFactory(configurationSource);
            //Logger.SetLogWriter(logWriterFactory.Create());

            //ExceptionPolicyFactory exceptionFactory = new ExceptionPolicyFactory(configurationSource);
            //ExceptionManager manager = exceptionFactory.CreateManager();

            //ExceptionPolicy.SetExceptionManager(manager);

        }

        protected void Session_Start(object sender, EventArgs e)
        {

        }

        protected void Application_BeginRequest(object sender, EventArgs e)
        {

        }

        protected void Application_AuthenticateRequest(object sender, EventArgs e)
        {

        }

        protected void Application_Error(object sender, EventArgs e)
        {

        }

        protected void Session_End(object sender, EventArgs e)
        {

        }

        protected void Application_End(object sender, EventArgs e)
        {

        }
    }
}