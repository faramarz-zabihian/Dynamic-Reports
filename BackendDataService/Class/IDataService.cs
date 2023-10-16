using ReportBase;
using System;
using System.Collections.Generic;
using System.ServiceModel;
using System.ServiceModel.Web;

[ServiceContract(Namespace = "")]
public interface IReportServiceContract
{
    [OperationContract]
    [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Xml)]
    NameDescription[] GetTemplateNames(String app);
   
    [OperationContract]
    [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
    
    List<NameDescription> ReportList(string AppName, string TemplateName, string UserID);

    [OperationContract]
    [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]

    List<ReportTemplateColumn> GetColumns(string AppName, string TemplateName, string UserID);

    [OperationContract]
    [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
    string ReportSave(string AppName, string TemplateName, string UserID, ReportModel r, string newName, bool genAccess);

    [OperationContract]
    [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
    bool ReportDrop(string AppName, string TemplateName, string UserID, string name);

    [OperationContract]
    [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
    ReportModel ReportLoad(string AppName, string TemplateName, string UserID, string name);

    [OperationContract]
    [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
    string DataPage(string AppName, string TemplateName, string UserID, ReportModel r, int FromPage, int ToPage, int PageSize);
    /*
       [OperationContract]
       [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Xml)]
       byte []Excel(string app, string TemplateName, string UserID, ReportModel rep, int FromPage, int ToPage, int PageSize);

       [OperationContract]
       byte[] Docx(string app, string TemplateName, string UserID, ReportModel rep, int FromPage, int ToPage, int PageSize);

       [OperationContract]
       byte[] Pdf(string app, string TemplateName, string UserID, ReportModel rep, int FromPage, int ToPage, int PageSize);
   */
    [OperationContract]
    [WebInvoke(Method = "POST", BodyStyle = WebMessageBodyStyle.Wrapped, ResponseFormat = WebMessageFormat.Json)]
    string XSLTranslator(string AppName, string TemplateName, ReportModel r, bool includeStyle = false);
}