"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadPdf = exports.downloadDoc = exports.download = exports.plainReport = exports.GroupedReport = exports.FilteredReport = exports.listTemplates = exports.listReports = exports.generateSample = exports.setServiceURL = void 0;
var Report_js_1 = require("./Report.js");
function setServiceURL(url) {
    Report_js_1.FSP.service.setBase(url);
}
exports.setServiceURL = setServiceURL;
function generateSample(templateId) {
    var cols = Report_js_1.FSP.service.getColumns(templateId);
    var r = new Report_js_1.FSP.Report(templateId);
    r.name = templateId;
    for (var i = 0; i < cols.length; i++)
        r.addColumnByTemplate(cols[i]);
    r.execute(1, 1, 20, processeor);
}
exports.generateSample = generateSample;
var renderHTML = function (xml, xsl) {
    $("result").xslt(xml, xsl);
};
function listReports(id) {
    var list = Report_js_1.FSP.service.list(id);
    for (var i = 0; i < list.length; i++) {
        var sp = $("<span/>").val(list[i].title).on('click', function (e) {
            var r = Report_js_1.FSP.service.load(id, list[i].title);
            r.execute(1, 1, 30, renderHTML);
        });
        $("#reports").append(sp).append($("br"));
    }
}
exports.listReports = listReports;
function listTemplates() {
    var list = Report_js_1.FSP.service.listTemplates();
    $("#templates").val("German");
    var _loop_1 = function (i) {
        var bt = $("input")
            .attr("type", "button")
            .val("create report")
            .on('click', function (e) { return plainReport(list[i].name); });
        var sp = $("span").val(list[i].title).append(bt).on('click', function (e) {
            Report_js_1.FSP.service.list(list[i].name);
        });
        $("#templates").append(sp).append($("<br/>"));
    };
    for (var i = 0; i < list.length; i++) {
        _loop_1(i);
    }
}
exports.listTemplates = listTemplates;
var processeor = function (xml, xsl) {
    $('#' + "result").xslt(xml, xsl);
};
function getReport(templateID) {
    var r = new Report_js_1.FSP.Report(templateID);
    r.templateID = templateID;
    r.name = "test";
    var ti = r.addColumn("Topic", "موضوع", "str");
    r.addColumn("Topic", "موضوع", "str");
    r.addColumn("Desc", "شرح", "str");
    r.addColumn("Date", "تاریخ", "str");
    return r;
}
function FilteredReport(id) {
    var r = getReport(id);
    r.addGroup(r.columnIndex("Topic"));
    r.execute(1, 1, 100, renderHTML);
}
exports.FilteredReport = FilteredReport;
function GroupedReport(id) {
    var r = getReport(id);
    r.addGroup(r.columnIndex("Topic"));
    r.addFilter(r.columnIndex("Topic"), "1393/01/01", null, "<", false);
    r.execute(1, 1, 100, renderHTML);
}
exports.GroupedReport = GroupedReport;
function plainReport(id) {
    var r = getReport(id);
    r.execute(1, 1, 100, renderHTML);
}
exports.plainReport = plainReport;
function download(r) {
    if (r == null)
        return;
    Report_js_1.FSP.service.JDownLoad("GetExcel", { r: r }, null);
}
exports.download = download;
function downloadDoc(r) {
    if (r == null) {
        alert('execute a report first');
        return;
    }
    Report_js_1.FSP.service.JDownLoad("GetDoc", { r: r }, null);
}
exports.downloadDoc = downloadDoc;
function downloadPdf(r) {
    if (r == null) {
        alert('execute a report first');
        return;
    }
    Report_js_1.FSP.service.JDownLoad("GetPdf", { "r": r }, null);
}
exports.downloadPdf = downloadPdf;
