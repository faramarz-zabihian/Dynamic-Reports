"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setServiceURL = exports.initDesigner = void 0;
var Report_js_1 = require("./Report.js");
var IMG_EDT_DEL_STYLE = "float:left;padding-left:5px";
var IMAGE_SIZE_10 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAB80lEQVR42mVSO2hUQRQ9Z94zWVkMgoRUKpoUrsHOStxNIVYmebsgdn5jL/gBG5s0FhFMJUEjAcUiiJp1dwtFBTFgEwtBMMVa2NhZKCYxyc69nreIgg5c5s2978w599xhOWshOroroSGQOjsW62MoV5t4szCKfxcPj7cYASfQJ9CgQGudGJeLPduw2lnpgv8DVaqtovYVxTlhbyra0fw0wQ8Q82I9w0it9Qfw+skxUIkkP7j7nJSdNMe61F5VajpBIXFfjwx/WTpuYHn8KbTtSQJf5Tk49oJ8Bm6OrbFtvbG0P9BPSNSAw99F2CPJa+YXHAXx3I2XSR+VD8PRrfIlzC3vwsRb1YcU3xSDqk2xXGulkn4dwS7Jjn0ODtPtsfSeSth3v8MfE8r3m9lSCLwtozY5ktV3OpOXhA+pr7uOoBrO6nsm+urFhMUbUpFJ3oaY+tX3J1ayxhEGNkWbyvZguaXMfeF79XxL/cwi+LzMmQzOh9p7qQFeIzkp0APFvCA7SDsvww6Zc1oXHJe3LwCboYd7HrCVlVpzQbce1HSrdCyBHdXTMwx+R/Zf0bx2S8EFcbclc7tkfBRTo+SCS0Kbnj+OqFpakL0H4Pb5ZwzfC1u8JDO+SnkB9ERMDZgFdAeYv0Hh6Kn+0UFNbcSAnvR3rfuGgF8DQuGMePH2lwAAAABJRU5ErkJggg==";
var IMAGE_SIZE_14 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABdElEQVR42q1SQVLCQBCcQU5eDC+QH8AHgHBUYrl5AfAC4QXqC4wvEF7AWkX0SALe0RcYXiAnbuw4s7CIWlahmKrUzqYnPd29i7Dng/9KUFVxhEClFXDQTvRJ9iuCWhiTqw1Rd6KDaGeCinpQOaSB2zPT/XjQUDsTVNWwh4hNLmf8HluQDguJrs8/hsQtXGMGTPqkz5INAcuXxiND0M4hRK6e6EbPVyOPYDHiceXt6WLTEvgqLhPC1E01uOgxcE5E/bEOWlZhGCe8zImQMaOsWoIMN+kjXLDzl3QQlEUqq7gDonmqg8JqyGORZTfX+cws7jKohcNnLkvyA2+l9pzcJZl6HvIZwXIKyN+/hijMhOb1p5SJ4JaAshzijVP4yXJFDTsr0DZfb52Pz/Jq4pMl99nipTtaGyou3mybhCONDKYM+ttH5nwawnBzR0gsUtHZEQLNq8fpRhN9qh2BTJHTEMyQueKr7SFSZ02SiMJvV/kvz94E7z8Nrz04hLX2AAAAAElFTkSuQmCC";
var IMAGE_SIZE_08 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAABeUlEQVR42k1QPUibURQ9532pJFLaUkTqWKRrF6FDS2LjJhaSiJObuHTSugtCpWNBwbEgLoIgRPTLZB1SF4cOdXAIVAQRF4fSwcQS372eL3bwPR68d9/5uedytNZAwdtoowC4A6COgyGgWZ/Aw8X3tbQHvkb/rMCvVFoT+CIDR5EpWkY+3PlgLFUbCLDHhnAFWF7fCwKsUAbR9OK96q02i5U0M50mfF1ij9zZBDtleF7KeBqIMWH/3ODfDxYnUwTDthxfO/GLjoqFv8OJD3QM3aOsVYk/l2Kdb6caz3JdP1HlIJLLNGuJMIMQNhz+RSLnApcC5T5a2StL8UB9/tbHsRJNKeg3N/sakmRL81FA9Kk+rIDpoi7Lsmll4Rk4CPNLCXyX2xzdngDJuME2Waymp1LNg/GNe9KWyrzCLom4KupHuu9LbEhnhKVa+lkT+plL4m6MOY2ULxjiJ3Nuq9eXIr6T4RnJgQwsVyKX3PI/2AXu1e63YvZGQtwB43qiYgrK7HsAAAAASUVORK5CYII=";
var IMG_ITEM_DEL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3UlEQVQ4jaWTIQ7CQBBFR3CYHoLsDBLX3xrug6hAcJjuLJIEiYGA4AAVPUAlYhFtoSUQJnSTbyb5L/N/ZklkP3OZrhlaMTQaVTloIbKfUWe2Gkdyma6Joed/AQw90wRzZGj8BLi71G8ZvnnNfNPO9P4T4BA2RESC3byF+EawmxMROYSNZYNa8jLpIb1Z8jJhaG0BREY4chqW1D3O/IKhB2sHkaE3gV/1AElDytCTEfDKLHmZDOOMi/1aohZvmZ+dOGhh2qC7zmFhdTszbPDPIV0nAC4fc1nloAVN/c4P4mUOIqsUSDsAAAAASUVORK5CYII=";
var IMG_ITEM_EDT = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABMElEQVQ4T8WTwU2EQBiF3z9wMh7WCqQDacAFjwZMoIPtQEuwhN0K1Ap2Ds5ZQAughCkBEo+wv5ndMAGZ1U08yJHM+/73v3lDUa40gEuc8jE3pUwvxkcpyhX3vLv5kHfFbwxzttwm5AQIiJjAkQvCoLKSyeMYEGcqBM60deDjvO7wGboAPnxdyFsd5aopt8niOlMrQXgCo7YAgrcg8NWRNZpKJhsztQfCvRgAMzYjB77u0AVuB6IpZFLbyXsxv1QyXVmAEQqIWQYMbt9lunaJjeb7CrMMBCCntg+TB6eTFXpi2wePuT1m23mNBBEQYDNgQDN22iPxdghsOnnmwFWkZabWRLgfxMvs9Xlsf5KBKRII8UAWjIceFHig2nTA/P+xiX+u8r8CTn/OQGvewvgavwDOofJW3QZEkQAAAABJRU5ErkJggg==";
var ID_SELECTED_LIST = "#ulColRep";
var ID_ORDERBY_LIST = '#ulSortRep';
var ID_GROUP_BY_LIST = "#ulGroupByRep";
var ID_AGGREGATE_LIST = "#ulAggrigateRep";
var ID_EXECUTE = '#btnExceReport';
var ID_RESULT = "#result";
var ID_PAGE_SIZE = "#dllCountRowPage";
var ID_PAGENO = "#txtPageNumber";
var ID_NEXT_PAGE = "#nextPage";
var ID_GO_TO_PAGE = "#btnGoToPage";
var ID_PREV_PAGE = "#prePage";
var ID_REPORT_COMBO = "#combobox";
var ID_TMPLATE_COL_LIST = '#ulSource';
var ID_TMPLATE_COL_LIST_OPTION = '#ulSource li';
var ID_GET_PDF = "#btnGetPdf";
var ID_GET_XLS = "#btnGetXlsx";
var ID_GET_WRD = "#btnGetDoc";
var ID_REPORT_POPUP = "#windoPopup";
var ID_BTN_CLOSE = "#btnClosePopup";
var const_newreport = "« " + "گزارش جدید" + " »";
var DEFAULT_PAGESIZE = 30;
var draggable_opts = {
    helper: "clone",
    opacity: 0.75,
    revert: 'invalid',
    tolerance: 'pointer',
    drag: function (event, ui) {
        ui.helper.css("width", "270px");
        ui.helper.css("background-color", "silver");
    }
};
var combo = $(ID_REPORT_COMBO)
    .combobox();
var objReport;
var templateId;
var fontSize = 8;
var yPos;
var tags = {
    Link: function (onclick) {
        return $('<a>')
            .on(onclick);
    },
    Option: function (name, text, data, index) {
        return $('<li>')
            .attr('name', name)
            .text(text)
            .attr('index', index)
            .data('tag', data);
    },
    Img: function (src, style) {
        return $('<img>')
            .attr('src', src)
            .attr('style', style);
    },
    Block: function () {
        return $('<div>');
    },
    Label: function () {
        return $('<lable>');
    }
};
function drawColumnStack(list) {
    var srcCols = $(ID_TMPLATE_COL_LIST)
        .empty();
    $.each(list, function (index, item) {
        return srcCols
            .append(tags.Option(item.name, item.title, item)
            .draggable(draggable_opts));
    });
}
function drawColumns() {
    $(ID_SELECTED_LIST)
        .empty();
    if (objReport.columns.length == 0)
        hilightMerge(-1);
    $.each(objReport.columns, function (key, it) {
        $(ID_SELECTED_LIST).append(tags.Option(it.name, it.title, it)
            .append(tags.Img(IMG_ITEM_DEL, IMG_EDT_DEL_STYLE)
            .on('click', function (e) { return UI.deleteColumn(it.name); }))
            .append(tags.Img(IMG_ITEM_EDT, IMG_EDT_DEL_STYLE)
            .on('click', function (e) { return editColumn(it.name); }))
            .droppable({
            accept: '#merge',
            tolerance: 'pointer',
            drop: function () {
                objReport.mergeIndex = objReport.columnIndex(it.name);
                hilightMerge(objReport.mergeIndex);
            }
        }));
        if (objReport.mergeIndex != -1) {
            hilightMerge(objReport.mergeIndex);
        }
    });
}
function getInTemplateItem(name) {
    for (var i = 0; i < colList.length; i++)
        if (colList[i].name == name)
            return colList[i];
    return null;
}
function drawOrderBy() {
    $(ID_ORDERBY_LIST)
        .empty();
    $.each(objReport.orderby, function (key, it) {
        var tem = getInTemplateItem(it.name);
        if (tem == null)
            return false;
        $(ID_ORDERBY_LIST)
            .append(tags.Option(tem.name, tem.title)
            .append(tags.Img(IMG_ITEM_DEL, IMG_EDT_DEL_STYLE)
            .on('click', function (e) { return UI.deleteOrder(tem.name); }))
            .append(tags.Img(IMG_ITEM_EDT, IMG_EDT_DEL_STYLE)
            .on('click', function (e) { return HighlightOrder(tem.name); }))
            .data('tag', tem));
    });
}
function drawGroupby() {
    $(ID_GROUP_BY_LIST)
        .empty();
    $.each(objReport.groupby, function (key, it) {
        var col = objReport.getColumnByName(it.name);
        if (col == null)
            return false;
        var del = tags
            .Img(IMG_ITEM_DEL, IMG_EDT_DEL_STYLE)
            .on('click', function (e) { return UI.deleteGroup(col.name); });
        var edt = tags
            .Img(IMG_ITEM_EDT, IMG_EDT_DEL_STYLE);
        var op = tags.Option(col.name, col.title, col)
            .append(del)
            .append(edt)
            .on('click', function (e) { return editItem(col.name, ID_GROUP_BY_LIST); })
            .data('tag', col);
        $(ID_GROUP_BY_LIST).append(op);
    });
}
function HighlightOrder(name) {
    $(ID_ORDERBY_LIST)
        .find("li")
        .removeClass("selected");
    $(ID_ORDERBY_LIST)
        .find("li[name='" + name + "']")
        .addClass("selected");
}
function editColumn(name) {
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
function editItem(name, ul) {
    var li = $(ul)
        .find("li");
    li.removeClass("selected");
    var selected = $(ul)
        .find("li[name='" + name + "']")
        .addClass("selected");
    if (ul == 'ID_COLUMNS_LIST') {
    }
}
function hilightMerge(index) {
    var _this = this;
    var realIndex = index;
    var pos;
    index = index + 1;
    $(ID_SELECTED_LIST)
        .find('li')
        .each(function (itm) {
        if (index != 0) {
            $(_this)
                .css("background-color", "#FFE7CE");
            index--;
        }
        else {
            $(_this)
                .css("background-color", "");
        }
        if (itm == realIndex) {
            $(_this)
                .css("background-color", "#FFD7AC");
            pos = $(_this)
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
}
function fillPopuoParam() {
    $('#divWinParam').empty();
    var tblWinParam = document.createElement("table");
    $.each(objReport.parameters, function (key, it) {
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
function serachOfCol() {
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
var colList;
function showPopup() {
    $(ID_REPORT_POPUP)
        .bPopup({
        fadeSpeed: 'slow',
        followSpeed: 1500,
        modalClose: false,
        opacity: 0.6,
        undefined: undefined,
        positionStyle: 'fixed'
    });
}
function setPageNo(pn) {
    if (pn < 1)
        pn = 1;
    $(ID_PAGENO)
        .val(pn);
}
function getPageNo() {
    var num = toNumber($(ID_PAGENO)
        .val());
    if (num == undefined)
        return 1;
    return num;
}
function getPageSize() {
    var pageSize = toNumber($(ID_PAGE_SIZE)
        .val());
    if (pageSize == undefined || pageSize < 5 || pageSize > 100) {
        pageSize = DEFAULT_PAGESIZE;
        $(ID_PAGE_SIZE)
            .val(DEFAULT_PAGESIZE);
    }
    return pageSize;
}
function xslProcessor(xml, xsl) {
    $(ID_RESULT)
        .xslt(xml, xsl);
}
function setPageSize(ps) {
    if (ps > 100)
        ps = 100;
    if (ps < 0)
        ps = DEFAULT_PAGESIZE;
    $(ID_PAGE_SIZE)
        .val(ps);
}
function toNumber(val) {
    if (typeof val == "number")
        return val;
    var v = Number(val);
    if (isNaN(v))
        return undefined;
    return v;
}
function initHandlers() {
    var _this = this;
    $(ID_PAGE_SIZE)
        .on('change', function (e) { return setPageNo(1); });
    $(ID_PREV_PAGE)
        .on('click', function () {
        setPageNo(getPageNo() - 1);
        objReport
            .execute(getPageNo(), getPageNo(), getPageSize(), xslProcessor);
    });
    $(ID_BTN_CLOSE)
        .on('click', function (event) {
        $(ID_REPORT_POPUP).bPopup().close();
    });
    $("#btnCancelParameter")
        .on('click', function () { return $('#winParam')
        .bPopup()
        .close(); });
    $("#btnOkParameter").on('click', function () {
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
        .on('click', function (e) {
        showPopup();
        objReport
            .execute(getPageNo(), getPageNo(), getPageSize(), xslProcessor);
    });
    $(ID_GET_PDF)
        .on('click', function (e) { return UI.getPdf(); });
    $(ID_GET_XLS)
        .on('click', function (e) { return UI.getExcel(); });
    $(ID_GET_WRD)
        .on('click', function () { return UI.getDoc(objReport); });
    $(ID_NEXT_PAGE)
        .on('click', function () {
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
        opacity: 0.65,
        stop: function () {
            var offset = $(this)
                .offset();
            yPos = offset.top;
        }
    };
    $("#merge")
        .draggable(drg)
        .draggable({ axis: "y" })
        .draggable({ containment: "#selectedColumns" });
    $("#chkPageNumber")
        .on('click', function (e) { return objReport.pageCount = $("#chkPageNumber").prop('checked'); });
    $("#chkDate")
        .on('click', function (e) { return objReport.printDate = $("#chkDate").prop('checked'); });
    $("#chkRowNumber")
        .on('click', function (e) { return objReport.printRowNo = $("#chkRowNumber").prop('checked'); });
    $("#chkUnderLine").on('click', function (e) { return objReport.printUnderLine = $("#chkUnderLine").prop('checked'); });
    $("#txtSearchCol")
        .on('keyup', function (e) {
        var $this = $(_this);
        var delay = 1000;
        clearTimeout($this.data('timer'));
        $this.data('timer', setTimeout(function () {
            $this.removeData('timer');
            serachOfCol();
        }, delay));
    });
    $(ID_EXECUTE)
        .on('click', function () {
        $(ID_RESULT)
            .empty();
        if (objReport.parameters.length != 0) {
            fillPopuoParam();
        }
        else {
            showPopup();
            objReport
                .execute(getPageNo(), getPageNo(), getPageSize(), xslProcessor);
        }
    });
    $('.divColRep')
        .droppable({
        accept: ID_TMPLATE_COL_LIST_OPTION,
        tolerance: 'pointer',
        drop: function (event, ui) {
            var d = ui.draggable.data('tag');
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
        .sortable({
        update: function (event, ui) {
            UI.addColumn(ui.item.data('tag'), ui.item.index());
        }
    });
    $('.divSortRep')
        .droppable({
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
        .sortable({
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
        .sortable({
        update: function (event, ui) {
            UI.addGroupBy(ui.item.data('tag'), ui.item.index());
        }
    });
    $('.divAggrigateRep')
        .droppable({
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
var UI = {
    redrawAll: function () {
        drawColumns();
        drawOrderBy();
        drawGroupby();
    },
    addColumn: function (item, index) {
        var colIndex = objReport.columnIndex(item.name);
        if (colIndex >= 0)
            return colIndex;
        colIndex = objReport.addColumnByTemplate(item, 1);
        drawColumns();
        return colIndex;
    },
    addOrderBy: function (item, index) {
        var colIndex = UI.addColumn(item, index);
        objReport.addOrder(colIndex, index);
        UI.redrawAll();
        return colIndex;
    },
    addGroupBy: function (item, index) {
        var colIndex = UI.addOrderBy(item);
        objReport.addGroup(colIndex, true, index);
        UI.redrawAll();
    },
    deleteColumn: function (name) {
        UI.deleteOrder(name);
        objReport.deleteColumn(name);
        hilightMerge(objReport.mergeIndex);
        drawColumns();
    },
    deleteOrder: function (name) {
        UI.deleteGroup(name);
        objReport.deleteOrder(name);
        drawOrderBy();
    },
    deleteGroup: function (name) {
        objReport.deleteGroup(name);
        drawGroupby();
    },
    addAggregate: function (item, index) {
        var cdex = objReport.addColumn(item.name, item.title, item.type, item.width);
        objReport.addAggregate(cdex, Report_js_1.FSP.AggregateOp.count, Report_js_1.FSP.AggregatePosition.report);
        drawColumns();
        drawAggregate();
    },
    deleteAggregate: function (rdx) {
        objReport.deleteAggregate(rdx);
        drawAggregate();
    },
    addFilter: function (item, filter, index) {
        var cdex = objReport.columnIndex(item.name);
        if (cdex < 0)
            cdex = objReport.addColumnByTemplate(item);
        objReport.addFilter(cdex, filter.operand1, filter.operand2, filter.operator, filter.negate, index);
        drawFilters();
    },
    deleteFilter: function (name) {
        objReport.deleteFilter(name);
        drawFilters();
    },
    addParamater: function (item, index) {
        objReport.addParamater(item, index);
        drawParameter();
    },
    deleteParameter: function (name) {
        objReport.deleteParameter(name);
        drawParameter();
    },
    getExcel: function () {
        Report_js_1.FSP.service.JDownLoad("GetExcel", { r: objReport }, true);
    },
    getDoc: function (r) {
        Report_js_1.FSP.service.JDownLoad("GetDoc", { r: objReport }, true);
    },
    getPdf: function () {
        Report_js_1.FSP.service.JDownLoad("GetPdf", { r: objReport }, true);
    }
};
function initDesigner(id) {
    templateId = id;
    objReport = new Report_js_1.FSP.Report(templateId);
    colList = Report_js_1.FSP.service.getColumns(templateId);
    drawColumnStack(colList);
    $(ID_REPORT_POPUP)
        .css("width", "90%")
        .css("height", "700px");
    setPageNo(1);
    setPageSize(DEFAULT_PAGESIZE);
    initHandlers();
}
exports.initDesigner = initDesigner;
function setServiceURL(url) {
    Report_js_1.FSP.service.setBase(url);
}
exports.setServiceURL = setServiceURL;
function drawAggregate() {
    $(ID_AGGREGATE_LIST)
        .empty();
    $.each(objReport.aggregates, function (key, it) {
        var ag = getInTemplateItem(it.colName);
        if (ag == null)
            return false;
        if (ag == null)
            return false;
        $(ID_AGGREGATE_LIST).append(tags.Option(ag.name, ag.title, ag)
            .append(tags.Img(IMG_ITEM_DEL, IMG_EDT_DEL_STYLE)
            .on('click', function (e) { return editItem(ag.name, 'aggregate'); }))
            .append(tags.Img(IMG_ITEM_EDT, IMG_EDT_DEL_STYLE)
            .on('click', function (e) { return editItem(ag.name, 'aggregate'); }))
            .data(ag));
    });
}
function drawFilters() { }
;
function drawParameter() { }
;
