//import * as $ from "jquery";
/// <reference types="jquery" />
import { FSP } from "./Report.js"

declare global {
    interface JQuery {
        xslt(xml, xsl);
    }
}
export function setServiceURL(url: string) {
    FSP.service.setBase(url);
}

export function generateSample(templateId): void {
    var cols = FSP.service.getColumns(templateId);
    var r = new FSP.Report(templateId);
    r.name = templateId;
    for (var i = 0; i < cols.length; i++)
        r.addColumnByTemplate(cols[i]);

    r.execute(1, 1, 20, processeor);
}

let renderHTML = (xml, xsl) => {
    $("result").xslt(xml, xsl);
}
export function listReports(id) {
    let list = FSP.service.list(id);
    for (var i = 0; i < list.length; i++) {
        let sp = $("<span/>").val(list[i].title).on('click', function (e) {
            let r = FSP.service.load(id, list[i].title);
            r.execute(1, 1, 30, renderHTML);
        })
        $("#reports").append(sp).append($("br"));        
    }
}
export function listTemplates() {
    var list = FSP.service.listTemplates();
    //document.getElementById("templates").innerHTML = "German";
    $("#templates").val("German");
    for (let i = 0; i < list.length; i++) {
        let bt = $("input")
            .attr("type", "button")
            .val("create report")
            .on('click', e => plainReport(list[i].name));
        let sp = $("span").val(list[i].title).append(bt).on('click', function (e) {
                FSP.service.list(list[i].name);
            });
        $("#templates").append(sp).append($("<br/>"))
    }
}

let processeor = (xml, xsl) => {
    $('#' + "result").xslt(xml, xsl)
}

function getReport(templateID): FSP.Report {
    var r = new FSP.Report(templateID);
    r.templateID = templateID;
    r.name = "test";
    let ti = r.addColumn("Topic", "موضوع", "str");
    r.addColumn("Topic", "موضوع", "str");
    r.addColumn("Desc", "شرح", "str");
    r.addColumn("Date", "تاریخ", "str");
    return r;
}
export function FilteredReport(id) {
    let r = getReport(id);    
    r.addGroup(r.columnIndex("Topic")) // todo:// apply builder   
    r.execute(1, 1, 100, renderHTML);
}
export function GroupedReport(id) {    
    let r = getReport(id);
    r.addGroup(r.columnIndex("Topic")) // todo:// apply builder       
    r.addFilter(r.columnIndex("Topic"), "1393/01/01", null, "<", false);
    r.execute(1, 1, 100, renderHTML);
}
export function plainReport(id) {
    let r = getReport(id);    
    r.execute(1, 1, 100, renderHTML);
}
export function download(r: FSP.Report): void {
    if (r == null)
        return;
    FSP.service.JDownLoad("GetExcel", { r }, null);
}
export function downloadDoc(r: FSP.Report): void {
    if (r == null) {
        alert('execute a report first');
        return;
    }
    FSP.service.JDownLoad("GetDoc", { r }, null);
}
export function downloadPdf(r: FSP.Report): void {
    if (r == null) {
        alert('execute a report first');
        return;
    }
    FSP.service.JDownLoad("GetPdf", { "r": r }, null);
}