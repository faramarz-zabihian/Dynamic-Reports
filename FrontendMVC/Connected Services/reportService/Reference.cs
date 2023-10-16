﻿//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated by a tool.
//     Runtime Version:4.0.30319.42000
//
//     Changes to this file may cause incorrect behavior and will be lost if
//     the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace TestMVC.reportService {
    
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    [System.ServiceModel.ServiceContractAttribute(Namespace="", ConfigurationName="reportService.IReportServiceContract")]
    public interface IReportServiceContract {
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/GetTemplateNames", ReplyAction="urn:IReportServiceContract/GetTemplateNamesResponse")]
        ReportBase.NameDescription[] GetTemplateNames(string app);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/GetTemplateNames", ReplyAction="urn:IReportServiceContract/GetTemplateNamesResponse")]
        System.Threading.Tasks.Task<ReportBase.NameDescription[]> GetTemplateNamesAsync(string app);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/ReportList", ReplyAction="urn:IReportServiceContract/ReportListResponse")]
        ReportBase.NameDescription[] ReportList(string AppName, string TemplateName, string UserID);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/ReportList", ReplyAction="urn:IReportServiceContract/ReportListResponse")]
        System.Threading.Tasks.Task<ReportBase.NameDescription[]> ReportListAsync(string AppName, string TemplateName, string UserID);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/GetColumns", ReplyAction="urn:IReportServiceContract/GetColumnsResponse")]
        ReportBase.ReportTemplateColumn[] GetColumns(string AppName, string TemplateName, string UserID);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/GetColumns", ReplyAction="urn:IReportServiceContract/GetColumnsResponse")]
        System.Threading.Tasks.Task<ReportBase.ReportTemplateColumn[]> GetColumnsAsync(string AppName, string TemplateName, string UserID);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/ReportSave", ReplyAction="urn:IReportServiceContract/ReportSaveResponse")]
        string ReportSave(string AppName, string TemplateName, string UserID, ReportBase.ReportModel r, string newName, bool genAccess);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/ReportSave", ReplyAction="urn:IReportServiceContract/ReportSaveResponse")]
        System.Threading.Tasks.Task<string> ReportSaveAsync(string AppName, string TemplateName, string UserID, ReportBase.ReportModel r, string newName, bool genAccess);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/ReportDrop", ReplyAction="urn:IReportServiceContract/ReportDropResponse")]
        bool ReportDrop(string AppName, string TemplateName, string UserID, string name);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/ReportDrop", ReplyAction="urn:IReportServiceContract/ReportDropResponse")]
        System.Threading.Tasks.Task<bool> ReportDropAsync(string AppName, string TemplateName, string UserID, string name);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/ReportLoad", ReplyAction="urn:IReportServiceContract/ReportLoadResponse")]
        ReportBase.ReportModel ReportLoad(string AppName, string TemplateName, string UserID, string name);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/ReportLoad", ReplyAction="urn:IReportServiceContract/ReportLoadResponse")]
        System.Threading.Tasks.Task<ReportBase.ReportModel> ReportLoadAsync(string AppName, string TemplateName, string UserID, string name);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/DataPage", ReplyAction="urn:IReportServiceContract/DataPageResponse")]
        string DataPage(string AppName, string TemplateName, string UserID, ReportBase.ReportModel r, int FromPage, int ToPage, int PageSize);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/DataPage", ReplyAction="urn:IReportServiceContract/DataPageResponse")]
        System.Threading.Tasks.Task<string> DataPageAsync(string AppName, string TemplateName, string UserID, ReportBase.ReportModel r, int FromPage, int ToPage, int PageSize);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/XSLTranslator", ReplyAction="urn:IReportServiceContract/XSLTranslatorResponse")]
        string XSLTranslator(string AppName, string TemplateName, ReportBase.ReportModel r, bool includeStyle);
        
        [System.ServiceModel.OperationContractAttribute(Action="urn:IReportServiceContract/XSLTranslator", ReplyAction="urn:IReportServiceContract/XSLTranslatorResponse")]
        System.Threading.Tasks.Task<string> XSLTranslatorAsync(string AppName, string TemplateName, ReportBase.ReportModel r, bool includeStyle);
    }
    
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public interface IReportServiceContractChannel : TestMVC.reportService.IReportServiceContract, System.ServiceModel.IClientChannel {
    }
    
    [System.Diagnostics.DebuggerStepThroughAttribute()]
    [System.CodeDom.Compiler.GeneratedCodeAttribute("System.ServiceModel", "4.0.0.0")]
    public partial class ReportServiceContractClient : System.ServiceModel.ClientBase<TestMVC.reportService.IReportServiceContract>, TestMVC.reportService.IReportServiceContract {
        
        public ReportServiceContractClient() {
        }
        
        public ReportServiceContractClient(string endpointConfigurationName) : 
                base(endpointConfigurationName) {
        }
        
        public ReportServiceContractClient(string endpointConfigurationName, string remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public ReportServiceContractClient(string endpointConfigurationName, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(endpointConfigurationName, remoteAddress) {
        }
        
        public ReportServiceContractClient(System.ServiceModel.Channels.Binding binding, System.ServiceModel.EndpointAddress remoteAddress) : 
                base(binding, remoteAddress) {
        }
        
        public ReportBase.NameDescription[] GetTemplateNames(string app) {
            return base.Channel.GetTemplateNames(app);
        }
        
        public System.Threading.Tasks.Task<ReportBase.NameDescription[]> GetTemplateNamesAsync(string app) {
            return base.Channel.GetTemplateNamesAsync(app);
        }
        
        public ReportBase.NameDescription[] ReportList(string AppName, string TemplateName, string UserID) {
            return base.Channel.ReportList(AppName, TemplateName, UserID);
        }
        
        public System.Threading.Tasks.Task<ReportBase.NameDescription[]> ReportListAsync(string AppName, string TemplateName, string UserID) {
            return base.Channel.ReportListAsync(AppName, TemplateName, UserID);
        }
        
        public ReportBase.ReportTemplateColumn[] GetColumns(string AppName, string TemplateName, string UserID) {
            return base.Channel.GetColumns(AppName, TemplateName, UserID);
        }
        
        public System.Threading.Tasks.Task<ReportBase.ReportTemplateColumn[]> GetColumnsAsync(string AppName, string TemplateName, string UserID) {
            return base.Channel.GetColumnsAsync(AppName, TemplateName, UserID);
        }
        
        public string ReportSave(string AppName, string TemplateName, string UserID, ReportBase.ReportModel r, string newName, bool genAccess) {
            return base.Channel.ReportSave(AppName, TemplateName, UserID, r, newName, genAccess);
        }
        
        public System.Threading.Tasks.Task<string> ReportSaveAsync(string AppName, string TemplateName, string UserID, ReportBase.ReportModel r, string newName, bool genAccess) {
            return base.Channel.ReportSaveAsync(AppName, TemplateName, UserID, r, newName, genAccess);
        }
        
        public bool ReportDrop(string AppName, string TemplateName, string UserID, string name) {
            return base.Channel.ReportDrop(AppName, TemplateName, UserID, name);
        }
        
        public System.Threading.Tasks.Task<bool> ReportDropAsync(string AppName, string TemplateName, string UserID, string name) {
            return base.Channel.ReportDropAsync(AppName, TemplateName, UserID, name);
        }
        
        public ReportBase.ReportModel ReportLoad(string AppName, string TemplateName, string UserID, string name) {
            return base.Channel.ReportLoad(AppName, TemplateName, UserID, name);
        }
        
        public System.Threading.Tasks.Task<ReportBase.ReportModel> ReportLoadAsync(string AppName, string TemplateName, string UserID, string name) {
            return base.Channel.ReportLoadAsync(AppName, TemplateName, UserID, name);
        }
        
        public string DataPage(string AppName, string TemplateName, string UserID, ReportBase.ReportModel r, int FromPage, int ToPage, int PageSize) {
            return base.Channel.DataPage(AppName, TemplateName, UserID, r, FromPage, ToPage, PageSize);
        }
        
        public System.Threading.Tasks.Task<string> DataPageAsync(string AppName, string TemplateName, string UserID, ReportBase.ReportModel r, int FromPage, int ToPage, int PageSize) {
            return base.Channel.DataPageAsync(AppName, TemplateName, UserID, r, FromPage, ToPage, PageSize);
        }
        
        public string XSLTranslator(string AppName, string TemplateName, ReportBase.ReportModel r, bool includeStyle) {
            return base.Channel.XSLTranslator(AppName, TemplateName, r, includeStyle);
        }
        
        public System.Threading.Tasks.Task<string> XSLTranslatorAsync(string AppName, string TemplateName, ReportBase.ReportModel r, bool includeStyle) {
            return base.Channel.XSLTranslatorAsync(AppName, TemplateName, r, includeStyle);
        }
    }
}