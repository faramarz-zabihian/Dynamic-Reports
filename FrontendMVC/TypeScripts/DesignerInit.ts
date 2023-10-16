//import * as $ from "jquery";
///<reference types="jquery" /> 
import { FSP } from "./Report.js"

declare global {
    interface JQuery {
        bPopup(v: any);
        bPopup();
        droppable(any);
        sortable(any);
        sortable();
        draggable(any);
        selectable(any);
        combobox();
    }
}

// constants
const IMG_EDT_DEL_STYLE = "float:left;padding-left:5px";
const IMAGE_SIZE_10: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAB80lEQVR42mVSO2hUQRQ9Z94zWVkMgoRUKpoUrsHOStxNIVYmebsgdn5jL/gBG5s0FhFMJUEjAcUiiJp1dwtFBTFgEwtBMMVa2NhZKCYxyc69nreIgg5c5s2978w599xhOWshOroroSGQOjsW62MoV5t4szCKfxcPj7cYASfQJ9CgQGudGJeLPduw2lnpgv8DVaqtovYVxTlhbyra0fw0wQ8Q82I9w0it9Qfw+skxUIkkP7j7nJSdNMe61F5VajpBIXFfjwx/WTpuYHn8KbTtSQJf5Tk49oJ8Bm6OrbFtvbG0P9BPSNSAw99F2CPJa+YXHAXx3I2XSR+VD8PRrfIlzC3vwsRb1YcU3xSDqk2xXGulkn4dwS7Jjn0ODtPtsfSeSth3v8MfE8r3m9lSCLwtozY5ktV3OpOXhA+pr7uOoBrO6nsm+urFhMUbUpFJ3oaY+tX3J1ayxhEGNkWbyvZguaXMfeF79XxL/cwi+LzMmQzOh9p7qQFeIzkp0APFvCA7SDsvww6Zc1oXHJe3LwCboYd7HrCVlVpzQbce1HSrdCyBHdXTMwx+R/Zf0bx2S8EFcbclc7tkfBRTo+SCS0Kbnj+OqFpakL0H4Pb5ZwzfC1u8JDO+SnkB9ERMDZgFdAeYv0Hh6Kn+0UFNbcSAnvR3rfuGgF8DQuGMePH2lwAAAABJRU5ErkJggg==";
const IMAGE_SIZE_14: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABdElEQVR42q1SQVLCQBCcQU5eDC+QH8AHgHBUYrl5AfAC4QXqC4wvEF7AWkX0SALe0RcYXiAnbuw4s7CIWlahmKrUzqYnPd29i7Dng/9KUFVxhEClFXDQTvRJ9iuCWhiTqw1Rd6KDaGeCinpQOaSB2zPT/XjQUDsTVNWwh4hNLmf8HluQDguJrs8/hsQtXGMGTPqkz5INAcuXxiND0M4hRK6e6EbPVyOPYDHiceXt6WLTEvgqLhPC1E01uOgxcE5E/bEOWlZhGCe8zImQMaOsWoIMN+kjXLDzl3QQlEUqq7gDonmqg8JqyGORZTfX+cws7jKohcNnLkvyA2+l9pzcJZl6HvIZwXIKyN+/hijMhOb1p5SJ4JaAshzijVP4yXJFDTsr0DZfb52Pz/Jq4pMl99nipTtaGyou3mybhCONDKYM+ttH5nwawnBzR0gsUtHZEQLNq8fpRhN9qh2BTJHTEMyQueKr7SFSZ02SiMJvV/kvz94E7z8Nrz04hLX2AAAAAElFTkSuQmCC";
const IMAGE_SIZE_08: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAABeUlEQVR42k1QPUibURQ9532pJFLaUkTqWKRrF6FDS2LjJhaSiJObuHTSugtCpWNBwbEgLoIgRPTLZB1SF4cOdXAIVAQRF4fSwcQS372eL3bwPR68d9/5uedytNZAwdtoowC4A6COgyGgWZ/Aw8X3tbQHvkb/rMCvVFoT+CIDR5EpWkY+3PlgLFUbCLDHhnAFWF7fCwKsUAbR9OK96q02i5U0M50mfF1ij9zZBDtleF7KeBqIMWH/3ODfDxYnUwTDthxfO/GLjoqFv8OJD3QM3aOsVYk/l2Kdb6caz3JdP1HlIJLLNGuJMIMQNhz+RSLnApcC5T5a2StL8UB9/tbHsRJNKeg3N/sakmRL81FA9Kk+rIDpoi7Lsmll4Rk4CPNLCXyX2xzdngDJuME2Waymp1LNg/GNe9KWyrzCLom4KupHuu9LbEhnhKVa+lkT+plL4m6MOY2ULxjiJ3Nuq9eXIr6T4RnJgQwsVyKX3PI/2AXu1e63YvZGQtwB43qiYgrK7HsAAAAASUVORK5CYII=";
const IMG_ITEM_DEL: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3UlEQVQ4jaWTIQ7CQBBFR3CYHoLsDBLX3xrug6hAcJjuLJIEiYGA4AAVPUAlYhFtoSUQJnSTbyb5L/N/ZklkP3OZrhlaMTQaVTloIbKfUWe2Gkdyma6Joed/AQw90wRzZGj8BLi71G8ZvnnNfNPO9P4T4BA2RESC3byF+EawmxMROYSNZYNa8jLpIb1Z8jJhaG0BREY4chqW1D3O/IKhB2sHkaE3gV/1AElDytCTEfDKLHmZDOOMi/1aohZvmZ+dOGhh2qC7zmFhdTszbPDPIV0nAC4fc1nloAVN/c4P4mUOIqsUSDsAAAAASUVORK5CYII=";
const IMG_ITEM_EDT: string = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABMElEQVQ4T8WTwU2EQBiF3z9wMh7WCqQDacAFjwZMoIPtQEuwhN0K1Ap2Ds5ZQAughCkBEo+wv5ndMAGZ1U08yJHM+/73v3lDUa40gEuc8jE3pUwvxkcpyhX3vLv5kHfFbwxzttwm5AQIiJjAkQvCoLKSyeMYEGcqBM60deDjvO7wGboAPnxdyFsd5aopt8niOlMrQXgCo7YAgrcg8NWRNZpKJhsztQfCvRgAMzYjB77u0AVuB6IpZFLbyXsxv1QyXVmAEQqIWQYMbt9lunaJjeb7CrMMBCCntg+TB6eTFXpi2wePuT1m23mNBBEQYDNgQDN22iPxdghsOnnmwFWkZabWRLgfxMvs9Xlsf5KBKRII8UAWjIceFHig2nTA/P+xiX+u8r8CTn/OQGvewvgavwDOofJW3QZEkQAAAABJRU5ErkJggg==";

const ID_SELECTED_LIST: string = "#ulColRep";
const ID_ORDERBY_LIST: string = '#ulSortRep';
const ID_GROUP_BY_LIST: string = "#ulGroupByRep";
const ID_AGGREGATE_LIST: string = "#ulAggrigateRep";
const ID_EXECUTE: string = '#btnExceReport';
const ID_RESULT: string = "#result";
/////////
const ID_PAGE_SIZE: string = "#dllCountRowPage";
const ID_PAGENO: string = "#txtPageNumber";
const ID_NEXT_PAGE: string = "#nextPage"
const ID_GO_TO_PAGE: string = "#btnGoToPage";
const ID_PREV_PAGE: string = "#prePage";

const ID_REPORT_COMBO: string = "#combobox";

const ID_TMPLATE_COL_LIST: string = '#ulSource';
const ID_TMPLATE_COL_LIST_OPTION: string = '#ulSource li';
const ID_GET_PDF: string = "#btnGetPdf";
const ID_GET_XLS: string = "#btnGetXlsx";
const ID_GET_WRD: string = "#btnGetDoc";

const ID_REPORT_POPUP: string = "#windoPopup";
const ID_BTN_CLOSE: string = "#btnClosePopup";
const const_newreport = "« " + "گزارش جدید" + " »";
const DEFAULT_PAGESIZE: number = 30;

var draggable_opts = {
    //connectToSortable: "#ulColRep",
    helper: "clone",
    opacity: 0.75,
    revert: 'invalid',
    tolerance: 'pointer',
    drag: function (event, ui) {
        ui.helper.css("width", "270px");
        ui.helper.css("background-color", "silver");
    }
}

let combo = $(ID_REPORT_COMBO)
    .combobox()

var objReport: FSP.Report;
let templateId: string;
var fontSize = 8;
var yPos;

let tags =
{
    Link: (onclick): JQuery =>
        $('<a>')
            .on(onclick),

    Option: (name: string, text: string, data?: object, index?: string): JQuery =>
        $('<li>')
            .attr('name', name)
            .text(text)
            .attr('index', index)
            .data('tag', data),

    Img: (src, style): JQuery =>
        $('<img>')
            .attr('src', src)
            .attr('style', style),

    Block: (): JQuery =>
        $('<div>'),

    Label: (): JQuery =>
        $('<lable>')
}
///////////////////////
function drawColumnStack(list: FSP.ITemplateColumn[]): void {
    let srcCols = $(ID_TMPLATE_COL_LIST)
        .empty();
    $.each(list,
        (index: number, item: FSP.Column) =>
            srcCols
                .append(
                    tags.Option(item.name, item.title, item)
                        .draggable(draggable_opts))
    )
}

function drawColumns(): void {

    $(ID_SELECTED_LIST)
        .empty();

    if (objReport.columns.length == 0)
        hilightMerge(-1);
    $.each(objReport.columns, function (key: number, it: FSP.ITemplateColumn) {
        $(ID_SELECTED_LIST).append(
            tags.Option(it.name, it.title, it)
                .append(
                    tags.Img(IMG_ITEM_DEL, IMG_EDT_DEL_STYLE)
                        .on('click', (e) => UI.deleteColumn(it.name))
                )
                .append(
                    tags.Img(IMG_ITEM_EDT, IMG_EDT_DEL_STYLE)
                        .on('click', (e) => editColumn(it.name))
                )
                .droppable({
                    accept: '#merge',
                    tolerance: 'pointer',
                    drop: function () {
                        objReport.mergeIndex = objReport.columnIndex(it.name);
                        hilightMerge(objReport.mergeIndex);
                    }
                })
        );
        if (objReport.mergeIndex != -1) {
            hilightMerge(objReport.mergeIndex);
        }
    });

}

function getInTemplateItem(name: string) {
    for (var i = 0; i < colList.length; i++)
        if (colList[i].name == name)
            return colList[i];
    return null;
}
function drawOrderBy() {
    $(ID_ORDERBY_LIST)
        .empty();

    $.each(objReport.orderby, (key: number, it: FSP.Order) => {

        var tem = getInTemplateItem(it.name);
        if (tem == null)
            return false;

        $(ID_ORDERBY_LIST)
            .append(
                tags.Option(tem.name, tem.title)
                    .append(
                        tags.Img(IMG_ITEM_DEL, IMG_EDT_DEL_STYLE)
                            .on('click', (e) => UI.deleteOrder(tem.name))
                    )
                    .append(
                        tags.Img(IMG_ITEM_EDT, IMG_EDT_DEL_STYLE)
                            .on('click', (e) => HighlightOrder(tem.name))
                    )
                    .data('tag', tem));
    });
}
function drawGroupby(): void {

    $(ID_GROUP_BY_LIST)
        .empty();
    $.each(objReport.groupby, (key: number, it: FSP.Group) => {
        let col = objReport.getColumnByName(it.name);
        if (col == null)
            return false;

        let del = tags
            .Img(IMG_ITEM_DEL, IMG_EDT_DEL_STYLE)
            .on('click', (e) => UI.deleteGroup(col.name))

        let edt = tags
            .Img(IMG_ITEM_EDT, IMG_EDT_DEL_STYLE);

        let op = tags.Option(col.name, col.title, col)

            .append(del)
            .append(edt)
            .on('click', (e) => editItem(col.name, ID_GROUP_BY_LIST))
            .data('tag', col);

        $(ID_GROUP_BY_LIST).append(op);
    });
}
function HighlightOrder(name: string): void {
    $(ID_ORDERBY_LIST)
        .find("li")
        .removeClass("selected");

    $(ID_ORDERBY_LIST)
        .find("li[name='" + name + "']")
        .addClass("selected");
}
function editColumn(name): void {
    $(ID_SELECTED_LIST)
        .find("li")
        .removeClass("selected");

    var selected = $(ID_SELECTED_LIST)
        .find("li[name='" + name + "']")
        .addClass("selected");

    if (selected.hasClass('selected'))
        $("#toolbarColRep").show(1000);
    else
        $("#toolbarColRep").hide(1000);
}

function editItem(name, ul): void {
    var li = $(ul)
        .find("li");
    li.removeClass("selected");

    //var selected = $(ul).find("li[name=" + "'" + name + "'" + "][index=" + "'" + index + "'" + "]");

    var selected = $(ul)
        .find("li[name='" + name + "']")
        .addClass("selected");

    if (ul == 'ID_COLUMNS_LIST') {

    }
}
//Functions--------------------------------------------------------------------------------------Functions
function hilightMerge(index): void {

    var realIndex = index;
    var pos;
    index = index + 1;
    $(ID_SELECTED_LIST)
        .find('li')
        .each(
            (itm) => {
                if (index != 0) {
                    $(this)
                        .css("background-color", "#FFE7CE");
                    index--;
                } else {
                    $(this)
                        .css("background-color", "");
                }
                if (itm == realIndex) {
                    $(this)
                        .css("background-color", "#FFD7AC");
                    pos = $(this)
                        .offset()
                        .top;

                    $('#merge')
                        .offset({ top: pos + 3 });
                }
            });
    if (realIndex == -1) {
        $("#merge")
            .css('top', 0);
        return;
    }
    //if (isEdit) {
    //    if (realIndex == (-1))
    //        $("#merge").css('top', 0);
    //    else
    //        $('#merge').offset({ top: pos+3 });
    //}
}
function fillPopuoParam() {
    $('#divWinParam').empty();
    var tblWinParam = document.createElement("table");
    $.each(objReport.parameters, function (key, it: FSP.Parameter) {

        var tr = document.createElement("tr");
        $(tblWinParam).css("width", "350px");
        tblWinParam.appendChild(tr);

        var lbl = document.createElement("label");
        $(lbl).text(it.value.prompt + " : ");
        var td1 = document.createElement("td");
        td1.appendChild(lbl);
        tr.setAttribute('id', it.name);
        tr.appendChild(td1);

        var td2 = document.createElement("td");
        tr.appendChild(td2);
        var inp = document.createElement('input');
        inp.setAttribute('type', 'text');
        $(inp).css("width", "150px");
        td2.appendChild(inp);
        $('#divWinParam').append(tblWinParam);
        var disable = true;
        $.each(objReport.filters, function (ky, itm) {
            if (itm.operand1 == it.name) {
                disable = false;
            }
        });
        if (disable) {
            $(tblWinParam).find(tr).remove();

        }
    });
    $('#winParam').bPopup({
        fadeSpeed: 'slow',
        followSpeed: 1500,
        modalClose: false,
        opacity: 0.6,
        positionStyle: 'fixed'
    });
}

function serachOfCol(): void {
    var txtSearch = $("#txtSearchCol")
        .val().toString();

    var search = new RegExp(txtSearch, "i");
    var s = $(ID_TMPLATE_COL_LIST_OPTION);
    for (var i = 0; i < s.length; i++) {
        if (!search.test(s[i].innerText))
            $(s[i]).hide();
        else
            $(s[i]).show();
    }
}

let colList: FSP.Column[]

function showPopup(): void {
    $(ID_REPORT_POPUP)
        .bPopup(
            {
                fadeSpeed: 'slow', //can be a string ('slow'/'fast') or int
                followSpeed: 1500,
                modalClose: false,
                opacity: 0.6, undefined,
                positionStyle: 'fixed' //'fixed' or 'absolute'
            });
}

//*******************************/
// functions        
function setPageNo(pn: number): void {
    if (pn < 1)
        pn = 1;
    $(ID_PAGENO)
        .val(pn)
}
function getPageNo(): number | undefined {
    let num = toNumber($(ID_PAGENO)
        .val());
    if (num == undefined)
        return 1;
    return num;
}

function getPageSize(): number {
    let pageSize = toNumber(
        $(ID_PAGE_SIZE)
            .val()
    );
    if (pageSize == undefined || pageSize < 5 || pageSize > 100) {
        pageSize = DEFAULT_PAGESIZE;
        $(ID_PAGE_SIZE)
            .val(DEFAULT_PAGESIZE);
    }
    return pageSize;
}
function xslProcessor(xml: string, xsl: string): void {
    $(ID_RESULT)
        .xslt(xml, xsl);
}

function setPageSize(ps: number): void {
    if (ps > 100)
        ps = 100;
    if (ps < 0)
        ps = DEFAULT_PAGESIZE;
    $(ID_PAGE_SIZE)
        .val(ps);
}

function toNumber(val: any): number | undefined {
    if (typeof val == "number")
        return val;
    let v = Number(val);
    if (isNaN(v))
        return undefined;
    return v
}

//*******************************/

function initHandlers() {

    //todo:
    /*combo = $("#combobox")
        .combobox()
        .on("comboboxselect",
            (event, ui) => {
                if ($("#combobox").text() == const_newreport)
                    objReport.name = const_newreport;
                else {
                    objReport = FSP.service.load(templateId, ui.item.textContent);
                    for (let i = 0; i < objReport.filters.length; i++)
                        objReport.filters[i].index = i; // ?

                    $("#chkPageNumber")
                        .prop('checked', objReport.pageCount);

                    $("#chkDate")
                        .prop('checked', objReport.printDate);

                    $("#chkRowNumber")
                        .prop('checked', objReport.printRowNo);

                    $("#chkUnderLine")
                        .prop('checked', objReport.printUnderLine);

                    $("#txtFirstNameReport")
                        .prop('checked', objReport.title);

                    $("#cmbFontFace")
                        .val(objReport.fontFace);

                    var size = objReport.fontSize;

                    let img_size = $("#imgResize");
                    switch (size) {
                        case 10:
                            img_size
                                .attr("src", IMAGE_SIZE_10)
                                .attr("class", "2");
                            break;

                        case 14:
                            img_size
                                .attr("src", IMAGE_SIZE_14)
                                .attr("class", "3");
                            break;

                        default:
                            img_size
                                .attr("src", IMAGE_SIZE_08);
                            img_size
                                .attr("class", "1");
                            break;
                    }

                    drawColumns();
                    hilightMerge(objReport.mergeIndex);
                    drawOrderBy();
                    drawGroupby();
                    drawAggregate();
                    drawFilters();
                    drawParameter();
                }
            });*/
    $(ID_PAGE_SIZE)
        .on('change', e => setPageNo(1))

    $(ID_PREV_PAGE)
        .on('click', () => {
            setPageNo(getPageNo() - 1);
            objReport
                .execute(getPageNo(), getPageNo(), getPageSize(), xslProcessor);
        });


    $(ID_BTN_CLOSE)
        .on('click', function (event) {
            $(ID_REPORT_POPUP).bPopup().close();
        });

    $("#btnCancelParameter")
        .on('click',
            () => $('#winParam')
                .bPopup()
                .close())

    $("#btnOkParameter").on('click', () => {
        $("#divWinParam > table > tr").each(function () {
            var inp = $(this).find("input").val();
            var trId = this.id;
            $.each(objReport.filters, function (key, itm) {
                if (itm.operand1 == trId) {
                    itm.operand1 = inp;

                }
            });
        });

        showPopup();
        objReport
            .execute(getPageNo(), getPageNo(), getPageSize(), xslProcessor);
    });

    $('#ulParameterRep').selectable({

        selected: function (event, ui) {
            $("#toolbarParameterRep").show(1000);

        },
        unselected: function (event, ui) {

            $("#toolbarParameterRep").hide(1000);
        }
    });

    $(ID_GO_TO_PAGE)
        .on('click', (e) => {
            showPopup();
            objReport
                .execute(getPageNo(), getPageNo(), getPageSize(), xslProcessor);
        });


    $(ID_GET_PDF)
        .on('click', e => UI.getPdf());
    $(ID_GET_XLS)
        .on('click', e => UI.getExcel())
    $(ID_GET_WRD)
        .on('click', () => UI.getDoc(objReport));


    $(ID_NEXT_PAGE)
        .on('click', () => {
            setPageNo(getPageNo() + 1);
            objReport
                .execute(getPageNo(), getPageNo(), getPageSize(), xslProcessor);
        });


    $("#tdMerge")
        .droppable({
            accept: '#merge',
            tolerance: 'pointer',
            drop: function () {
                objReport.mergeIndex = -1;
                hilightMerge(objReport.mergeIndex);
            }
        });

    var drg = {
        //connectToSortable: "ul Option",
        //helper: "clone",
        opacity: 0.65,
        //revert: 'invalid',
        //tolerance: 'pointer',
        stop: function () {
            var offset = $(this)
                .offset();
            yPos = offset.top;
        }
    }

    $("#merge")
        .draggable(drg)
        .draggable({ axis: "y" })
        .draggable(
            { containment: "#selectedColumns" }
        );

    $("#chkPageNumber")
        .on('click', (e) => objReport.pageCount = $("#chkPageNumber").prop('checked'))

    $("#chkDate")
        .on('click', (e) => objReport.printDate = $("#chkDate").prop('checked'));

    $("#chkRowNumber")
        .on('click', (e) => objReport.printRowNo = $("#chkRowNumber").prop('checked'));

    $("#chkUnderLine").on('click',
        (e) => objReport.printUnderLine = $("#chkUnderLine").prop('checked'));

    $("#txtSearchCol")
        .on('keyup', (e) => {
            let $this = $(this);
            var delay = 1000;
            clearTimeout($this.data('timer'));
            $this.data('timer', setTimeout(function () {
                $this.removeData('timer');
                serachOfCol();
            }, delay));
        });

    //todo:

    $(ID_EXECUTE)
        .on('click', () => {
            $(ID_RESULT)
                .empty()

            if (objReport.parameters.length != 0) {
                fillPopuoParam();
            } else {
                showPopup();
                objReport
                    .execute(getPageNo(), getPageNo(), getPageSize(), xslProcessor);
            }
        });

    $('.divColRep')
        .droppable(
            {
                accept: ID_TMPLATE_COL_LIST_OPTION,
                tolerance: 'pointer',
                drop: function (event, ui) {
                    let d = ui.draggable.data('tag');
                    UI.addColumn(d, -1);
                    $(this).css("background-color", "");
                },
                over: function () {
                    $(this).css("background-color", "rgb(232,247,237)");
                },
                out: function () {
                    $(this).css("background-color", "");
                },
            });

    $(ID_SELECTED_LIST)
        .sortable(
            {
                update: function (event, ui) {
                    UI.addColumn(ui.item.data('tag'), ui.item.index());
                }
            });

    $('.divSortRep')
        .droppable(
            {
                accept: '#ulSource li',
                tolerance: 'pointer',
                drop: function (event, ui) {
                    UI.addOrderBy(ui.draggable.data('tag'), -1);
                    $(this).css("background-color", "");
                },
                over: function () {
                    $(this).css("background-color", "rgb(232,247,237)");
                },
                out: function () {
                    $(this).css("background-color", "");
                },
            });

    $("#ulSortRep")
        .sortable(
            {
                update: function (event, ui) {
                    UI.addOrderBy(ui.item.data('tag'), ui.item.index());
                }
            });

    $('.divGroupByRep')
        .droppable({
            accept: '#ulSource li',
            tolerance: 'pointer',
            drop: function (event, ui) {
                UI.addGroupBy(ui.draggable.data('tag'), -1);
                $(this).css("background-color", "");
            },
            over: function () {
                $(this).css("background-color", "rgb(232,247,237)");
            },
            out: function () {
                $(this).css("background-color", "");
            },
        });

    $("#ulGroupByRep")
        .sortable(
            {
                update: function (event, ui) {
                    UI.addGroupBy(ui.item.data('tag'), ui.item.index());
                }
            });

    $('.divAggrigateRep')
        .droppable(
            {
                accept: '#ulSource li',
                tolerance: 'pointer',
                drop: function (event, ui) {
                    UI.addAggregate(ui.draggable.data('tag'), -1);
                    $(this).css("background-color", "");
                },
                over: function () {
                    $(this).css("background-color", "rgb(232,247,237)");
                },
                out: function () {
                    $(this).css("background-color", "");
                },
            });

    $(ID_AGGREGATE_LIST)
        .sortable({
            update: function (event, ui) {
                UI.addAggregate(ui.item.data('tag'), ui.item.index());
            }
        });


    //todo:
    //$('.divFilterRep')
    //    .droppable(
    //        {
    //            accept: '#ulSource li',
    //            tolerance: 'pointer',
    //            drop: function (event, ui) {
    //                UI.addFilter(ui.draggable.data('tag'), -1);
    //                $(this).css("background-color", "");
    //            },
    //            over: function () {
    //                $(this).css("background-color", "rgb(232,247,237)");
    //            },
    //            out: function () {
    //                $(this).css("background-color", "");
    //            },
    //        });

    //Selectable
    $(ID_SELECTED_LIST).selectable({

        selected: function (event, ui) {
            $("#toolbarColRep").show(1000);

        },
        unselected: function (event, ui) {

            $("#toolbarColRep").hide(1000);
        }
    });


    $('#ulSortRep').selectable({

        selected: function (event, ui) {
            $("#toolbarSortRep").show(1000);

        },
        unselected: function (event, ui) {

            $("#toolbarSortRep").hide(1000);
        }
    });
    $('#ulGroupByRep').selectable({

        selected: function (event, ui) {
            $("#toolbarGroupByRep").show(1000);

        },
        unselected: function (event, ui) {

            $("#toolbarGroupByRep").hide(1000);
        }
    });

    $(ID_AGGREGATE_LIST).selectable({

        selected: function (event, ui) {
            $("#toolbarAggrigateRep").show(1000);

        },
        unselected: function (event, ui) {

            $("#toolbarAggrigateRep").hide(1000);
        }
    });
    $('#ulIfRep').selectable({

        selected: function (event, ui) {
            $("#toolbarIfRep").show(1000);

        },
        unselected: function (event, ui) {

            $("#toolbarIfRep").hide(1000);
        }
    });
}

// =======================================================================
let UI = {
    redrawAll() {
        drawColumns();
        drawOrderBy();
        drawGroupby();
    },
    addColumn: (item: FSP.ITemplateColumn, index: number | undefined): number => {
        let colIndex = objReport.columnIndex(item.name);
        if (colIndex >= 0)
            return colIndex;
        colIndex = objReport.addColumnByTemplate(item, 1);
        drawColumns();
        return colIndex;
    }
    ,
    addOrderBy: (item: FSP.ITemplateColumn, index?: number): number => {
        let colIndex = UI.addColumn(item, index); // add and redraw if it does not exists
        objReport.addOrder(colIndex, index);
        UI.redrawAll()
        return colIndex;
    },
    addGroupBy: (item: FSP.ITemplateColumn, index: number): void => {
        let colIndex = UI.addOrderBy(item); // check/add and redraw orders        
        objReport.addGroup(colIndex, true, index);
        UI.redrawAll();
    },
    deleteColumn: (name: string): void => {
        UI.deleteOrder(name);  // delete from orders and redraw orderBy
        objReport.deleteColumn(name);
        hilightMerge(objReport.mergeIndex);
        drawColumns(); // redraw columns
    },

    deleteOrder: (name: string): void => {
        UI.deleteGroup(name); // delete from groupBy
        objReport.deleteOrder(name);
        drawOrderBy();
    },
    deleteGroup: (name: string): void => {
        objReport.deleteGroup(name);
        drawGroupby();
    },

    addAggregate: (item: FSP.ITemplateColumn, index: number | undefined): void => {
        // make sure the column is in selected column list
        let cdex = objReport.addColumn(item.name, item.title, item.type, item.width);
        // type of field should be checked (must be numeric to sum or calculate average)
        objReport.addAggregate(cdex, FSP.AggregateOp.count, FSP.AggregatePosition.report);
        drawColumns();
        drawAggregate();
    },
    //todo: various forms of delete should be developed
    deleteAggregate: (rdx: number): void => {
        objReport.deleteAggregate(rdx);
        drawAggregate();
    },
    addFilter: (
        item: FSP.ITemplateColumn,
        filter: { operand1: string, operand2: string, operator: string, negate: boolean, type: string }, index: number
    ): void => {
        let cdex = objReport.columnIndex(item.name);
        if (cdex < 0)
            cdex = objReport.addColumnByTemplate(item);

        objReport.addFilter(cdex, filter.operand1, filter.operand2, filter.operator, filter.negate, index);
        drawFilters();
    },
    deleteFilter: (name: string): void => {
        objReport.deleteFilter(name);
        drawFilters();
    },
    addParamater: (item: FSP.Parameter, index: number): void => {
        objReport.addParamater(item, index);
        drawParameter();
    },
    deleteParameter: (name: string): void => {
        objReport.deleteParameter(name);
        drawParameter();
    },
    getExcel: () => {
        FSP.service.JDownLoad("GetExcel", { r: objReport }, true);
    },
    getDoc: (r: FSP.Report): void => {
        FSP.service.JDownLoad("GetDoc", { r: objReport }, true);
    },
    getPdf: (): void => {
        FSP.service.JDownLoad("GetPdf", { r: objReport }, true);
    }
}
// ========================================================================
export function initDesigner(id: string): void {
    templateId = id;
    objReport = new FSP.Report(templateId);
    colList = FSP.service.getColumns(templateId);
    drawColumnStack(colList);
    $(ID_REPORT_POPUP)
        .css("width", "90%")
        .css("height", "700px");

    setPageNo(1);
    setPageSize(DEFAULT_PAGESIZE);
    initHandlers();
}
export function setServiceURL(url: string): void {
    FSP.service.setBase(url);
}

function drawAggregate() {

    $(ID_AGGREGATE_LIST)
        .empty();
    $.each(objReport.aggregates, (key: number, it: FSP.Aggregate) => {
        let ag = getInTemplateItem(it.colName);
        if (ag == null)
            return false;

        if (ag == null)
            return false;

        $(ID_AGGREGATE_LIST).append(
            tags.Option(ag.name, ag.title, ag)
                .append(
                    tags.Img(IMG_ITEM_DEL, IMG_EDT_DEL_STYLE)
                        .on('click', (e) => editItem(ag.name, 'aggregate'))
                )
                .append(
                    tags.Img(IMG_ITEM_EDT, IMG_EDT_DEL_STYLE)
                        .on('click', (e) => editItem(ag.name, 'aggregate'))
                )
                .data(ag))
    }
    );
}
function drawFilters(): void { };
function drawParameter(): void { };

