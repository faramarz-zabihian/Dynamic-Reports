function rebuildFilterShow(li, it, divEdit, divShow) {
    //  $(divShow).parentNode().innerHtml = it.getExtension();
    $(divShow).empty();
    var lblmess = document.createElement('label');
    var tit = it.getDescription();
    $(lblmess).append(tit);
    lblmess.setAttribute("style", " overflow: hidden;white-space:nowrap;text-overflow:ellipsis;width:250px;display:inline-block;");
    lblmess.setAttribute("title", tit);
    $(divShow).append(lblmess);

    let a = utility.createLink(() => this.deleteFilter(it.name));

    a.append(
        utility.createImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3UlEQVQ4jaWTIQ7CQBBFR3CYHoLsDBLX3xrug6hAcJjuLJIEiYGA4AAVPUAlYhFtoSUQJnSTbyb5L/N/ZklkP3OZrhlaMTQaVTloIbKfUWe2Gkdyma6Joed/AQw90wRzZGj8BLi71G8ZvnnNfNPO9P4T4BA2RESC3byF+EawmxMROYSNZYNa8jLpIb1Z8jJhaG0BREY4chqW1D3O/IKhB2sHkaE3gV/1AElDytCTEfDKLHmZDOOMi/1aohZvmZ+dOGhh2qC7zmFhdTszbPDPIV0nAC4fc1nloAVN/c4P4mUOIqsUSDsAAAAASUVORK5CYII=", "float:left"));

    divShow.appendChild(a);

    a = utility.createLink(() => editFilter(li, divEdit, divShow));
    a.append(utility.createImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABMElEQVQ4T8WTwU2EQBiF3z9wMh7WCqQDacAFjwZMoIPtQEuwhN0K1Ap2Ds5ZQAughCkBEo+wv5ndMAGZ1U08yJHM+/73v3lDUa40gEuc8jE3pUwvxkcpyhX3vLv5kHfFbwxzttwm5AQIiJjAkQvCoLKSyeMYEGcqBM60deDjvO7wGboAPnxdyFsd5aopt8niOlMrQXgCo7YAgrcg8NWRNZpKJhsztQfCvRgAMzYjB77u0AVuB6IpZFLbyXsxv1QyXVmAEQqIWQYMbt9lunaJjeb7CrMMBCCntg+TB6eTFXpi2wePuT1m23mNBBEQYDNgQDN22iPxdghsOnnmwFWkZabWRLgfxMvs9Xlsf5KBKRII8UAWjIceFHig2nTA/P+xiX+u8r8CTn/OQGvewvgavwDOofJW3QZEkQAAAABJRU5ErkJggg==", "float:left;padding-left:5px"));

    divShow.appendChild(a);
}
function abEnter1() {
    $("#toolbarRep").css("margin-right", "370px");

    $("#toolbarRep").show(500);

}
function abExit1() {
    $("#toolbarRep").hide(500);

}
function abEnter2() {
    $("#toolbarRep").css("margin-right", "610px");
    $("#toolbarRep").css("margin-bottom", "5px");
    $("#toolbarRep").show(500);

}
function abExit2() {
    $("#toolbarRep").hide(500);

}
//----------------------------------------------------------------------------
function getSortItembyIndex(index) {
    var res = undefined;
    for (var j = 0; j < objReport.orderby.length; j++) {
        if (objReport.orderby[j].index == index) {
            res = objReport.orderby[j];
        }
    }
    return res;
}


function rebuildParameterShow(li, it, divEdit, divShow) {
    //   $(divShow).parentNode().innerHtml = it.getExtension();
    $(divShow).empty();
    var lblmess = document.createElement('label');
    var tit = it.name;
    $(lblmess).append(tit);
    lblmess.setAttribute("style", " overflow: hidden;white-space:nowrap;text-overflow:ellipsis;width:250px;display:inline-block;");
    lblmess.setAttribute("title", tit);
    $(divShow).append(lblmess);

    var a = createLink(() => deleteParameter(it.name));
    a.appendChild(createImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3UlEQVQ4jaWTIQ7CQBBFR3CYHoLsDBLX3xrug6hAcJjuLJIEiYGA4AAVPUAlYhFtoSUQJnSTbyb5L/N/ZklkP3OZrhlaMTQaVTloIbKfUWe2Gkdyma6Joed/AQw90wRzZGj8BLi71G8ZvnnNfNPO9P4T4BA2RESC3byF+EawmxMROYSNZYNa8jLpIb1Z8jJhaG0BREY4chqW1D3O/IKhB2sHkaE3gV/1AElDytCTEfDKLHmZDOOMi/1aohZvmZ+dOGhh2qC7zmFhdTszbPDPIV0nAC4fc1nloAVN/c4P4mUOIqsUSDsAAAAASUVORK5CYII=", "float:left"));
    divShow.appendChild(a);

    //  a = createLink("", function () { editFilter(li, divEdit, divShow); });
    // a.appendChild(createImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABMElEQVQ4T8WTwU2EQBiF3z9wMh7WCqQDacAFjwZMoIPtQEuwhN0K1Ap2Ds5ZQAughCkBEo+wv5ndMAGZ1U08yJHM+/73v3lDUa40gEuc8jE3pUwvxkcpyhX3vLv5kHfFbwxzttwm5AQIiJjAkQvCoLKSyeMYEGcqBM60deDjvO7wGboAPnxdyFsd5aopt8niOlMrQXgCo7YAgrcg8NWRNZpKJhsztQfCvRgAMzYjB77u0AVuB6IpZFLbyXsxv1QyXVmAEQqIWQYMbt9lunaJjeb7CrMMBCCntg+TB6eTFXpi2wePuT1m23mNBBEQYDNgQDN22iPxdghsOnnmwFWkZabWRLgfxMvs9Xlsf5KBKRII8UAWjIceFHig2nTA/P+xiX+u8r8CTn/OQGvewvgavwDOofJW3QZEkQAAAABJRU5ErkJggg==", "float:left;padding-left:5px"));
    //  divShow.appendChild(a);
}
function editFilter(li, divEdit, divShow) {
    var jDivEdit = $(divEdit);
    var jDivShow = $(divShow);
    jDivEdit.empty();
    jDivEdit.show();
    drawFilterTools(divEdit, $(li).attr("index"));
    jDivShow.hide();
}

function drawFilterTools(div, index) {
    var obj = getFilterItembyIndex(index);
    var x =
        [
            { val: '>', txt: 'بزرگتر از' },
            { val: '>=', txt: 'بزرگتر مساوی با' },
            { val: '<', txt: 'کوچکتر از' },
            { val: '<=', txt: 'کوچکتر مساوی با' },
            { val: '=', txt: 'برابر با' },
            { val: ')', txt: 'پایان می یابد با' },
            { val: '(', txt: 'شروع می شود با' },
            { val: '~', txt: 'شامل ' },
            { val: '()', txt: 'بین' },
            { val: '(,)', txt: 'میان' },
            { val: 'n', txt: 'خالی' }

        ];

    var opr = document.createElement('select');
    opr.setAttribute('id', 'cmbOperator');

    $(opr).css("width", "70px");
    $(opr).css("vertical-align", "top");
    for (var i = 0; i < x.length; i++) {
        var option = document.createElement('option');
        option.setAttribute('value', x[i].val);
        option.text = x[i].txt;
        opr.appendChild(option);
    }
    var op2;
    var op1;
    var va;
    $(opr).change(function () {
        if ($(opr).val() == "()") {
            $(op2).show();
            $(va).show();
            $(op1).css("width", "50px");
        } else if ($(opr).val() == "n") {
            $(op2).hide();
            $(op1).hide();
            $(va).hide();
        } else {
            $(op1).show();
            $(op1).css("width", "120px");
            $(op2).hide();
            $(va).hide();
        }
    });
    op1 = document.createElement('input');
    op1.setAttribute('type', 'text');
    op1.setAttribute('id', 'txtOperand1');
    $(op1).css("width", "50px");
    $(op1).css("height", "8px");
    $(op1).css("vertical-align", "top");
    $(op1).css("margin-top", "0px");
    $(op1).css("border", "1px solid silver");

    op2 = $('input')
        .attr('type', 'text')
        .attr('id', 'txtOperand2')
        .css("width", "50px")
        .css("height", "8px")
        .css("vertical-align", "top")
        .css("margin-top", "0")
        .css("border", "1px solid silver");

    var negate = document.createElement('input');
    negate.setAttribute('type', 'checkbox');
    negate.setAttribute('id', 'chkNegate');

    var a = utility.createLink(() => saveFilter(this.parentNode));

    a.appendChild(createImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAuklEQVQ4jcWSsQ3CMBBFM0AKRvAIGQDZN8KdpfSMwAhs4BFcUqSgwGeXGYEyJUWKjBGaCFmAbURAnPQKS+fnfzpXinhQxPPCqIivBcaof6iiwwwYRJUo0G4PeAbAIOI7bwsU8UVqbwBPm38J/BGQd9kRJDoDmg85JDqTFHzCFwWabWr+x5Lam2cBsgUKW4Vsc9x7fpMAuSltAZCb1wmQLbR9DRhElrav04JVCch1xdcXFLkuFkwr/sF0AyrBqQuyX9VIAAAAAElFTkSuQmC", "float:left;margin-top:2px;margin-right:0"));
    $(a).css("vertical-align", "top");
    $(a).css("margin-right", "0");
    if (obj != undefined) {
        $(opr).val(obj.operator);
        $(op1).val(obj.operand1);
        $(op2).val(obj.operand2);
        $(negate).prop('checked', obj.negate);
    }
    $(negate).css("vertical-align", "top");
    $(negate).css("margin-top", "4px");
    var divTitle = document.createElement('span');
    $(divTitle).append(obj.title);
    divTitle.setAttribute("style", " overflow: hidden;white-space:nowrap;text-overflow:ellipsis;width:40px;display:inline-block;");
    divTitle.setAttribute("title", obj.title);
    $(div).append(divTitle);

    $(div).append(opr);
    $(div).append(" ");


    $(div).append(op1);
    va = document.createElement('label');
    $(va).append(' و ');
    $(va).css("vertical-align", "top");
    $(va).css("margin-top", "0px");
    $(div).append(va);

    $(div).append(op2);


    $(div).append(" ");
    $(div).append(negate);

    var nabashad = document.createElement('label');
    $(nabashad).append(' نباشد');
    $(nabashad).css("vertical-align", "top");
    $(nabashad).css("margin-top", "0px");
    $(div).append(nabashad);
    $(div).append(a);
    if ($(opr).val() == "n") {
        $(op2).hide();
        $(op1).hide();
        $(va).hide();
    }
}
function saveFilter(divEdit) {
    var jdiv = $(divEdit);
    var li = jdiv.parent();
    var index = li.attr("index");
    var opr1 = jdiv.find("#txtOperand1").val();
    var opr2 = jdiv.find("#txtOperand2").val();
    var chkNegate = jdiv.find("#chkNegate").prop('checked');
    var oprerator = jdiv.find("#cmbOperator").val();
    var i;
    for (i = 0; i < objReport.filters.length; i++)
        if (objReport.filters[i].index == index)
            break;
    if (i < objReport.filters.length) {
        objReport.filters[i].operand1 = opr1;
        objReport.filters[i].operand2 = opr2;
        objReport.filters[i].operator = oprerator;
        objReport.filters[i].negate = chkNegate;
        rebuildFilterShow(li, objReport.filters[i], divEdit, jdiv.prev().get()[0]);
    }
    $(divEdit).hide();
    $(jdiv.prev().get()[0]).show();

    if (opr1.trim().substring(0, 1) == "@" || opr2.trim().substring(0, 1) == "@") {
        if (opr1.trim().length == 1 || opr2.trim().length == 1)
            return false;
        var obj = new ESS.Report.Parameter();
        obj.name = opr1;
        obj.prompt = objReport.filters[index].title;
        obj.inputType = objReport.filters[index].type;
        ESS.Report.UI.addParamater(obj, -1);
    }
};

function getTypeCol(name: string) {
    for (var i = 0; i <= colList.length; i++) {
        if (colList[i].name == name) {
            return colList[i].type;
        }
    }
}
//***********************************************************/ to export
function getFilterItembyIndex(index) {
    var res = undefined;
    for (var j = 0; j < objReport.filters.length; j++) {
        if (objReport.filters[j].index == index) {
            res = objReport.filters[j];
        }
    }
    return res;
}

function drawAggregate() {
    $("#ulAggrigateRep").empty();
    $.each(objReport.aggregates, function (key, it) {
        var ag = findItem(it.name);
        if (ag == null) return false;
        var newCo = $('<li' + " name=" + "'" + ag.name
            + "'" + '>' + ag.title + '<img  onclick="deletItem(' + "'" + ag.name + "'" + ",'aggr'" + ')" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3UlEQVQ4jaWTIQ7CQBBFR3CYHoLsDBLX3xrug6hAcJjuLJIEiYGA4AAVPUAlYhFtoSUQJnSTbyb5L/N/ZklkP3OZrhlaMTQaVTloIbKfUWe2Gkdyma6Joed/AQw90wRzZGj8BLi71G8ZvnnNfNPO9P4T4BA2RESC3byF+EawmxMROYSNZYNa8jLpIb1Z8jJhaG0BREY4chqW1D3O/IKhB2sHkaE3gV/1AElDytCTEfDKLHmZDOOMi/1aohZvmZ+dOGhh2qC7zmFhdTszbPDPIV0nAC4fc1nloAVN/c4P4mUOIqsUSDsAAAAASUVORK5CYII=" style="float:left"/>' +
            '<img onclick="editItem(' + "'" + ag.name + "'" + ",'#ulAggrigateRep'" + ')" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABMElEQVQ4T8WTwU2EQBiF3z9wMh7WCqQDacAFjwZMoIPtQEuwhN0K1Ap2Ds5ZQAughCkBEo+wv5ndMAGZ1U08yJHM+/73v3lDUa40gEuc8jE3pUwvxkcpyhX3vLv5kHfFbwxzttwm5AQIiJjAkQvCoLKSyeMYEGcqBM60deDjvO7wGboAPnxdyFsd5aopt8niOlMrQXgCo7YAgrcg8NWRNZpKJhsztQfCvRgAMzYjB77u0AVuB6IpZFLbyXsxv1QyXVmAEQqIWQYMbt9lunaJjeb7CrMMBCCntg+TB6eTFXpi2wePuT1m23mNBBEQYDNgQDN22iPxdghsOnnmwFWkZabWRLgfxMvs9Xlsf5KBKRII8UAWjIceFHig2nTA/P+xiX+u8r8CTn/OQGvewvgavwDOofJW3QZEkQAAAABJRU5ErkJggg==" style="float:left;padding-left:5px" /></li>');
        newCo.data('tag', ag);
        $('#ulAggrigateRep').append(newCo);
    });
}

function drawFilters() {
    var list = $('#ulFilterRep');
    list.empty();
    $.each(objReport.filters,
        function (key, it: FSP.Filter) {
            var divEdit = document.createElement('div');
            divEdit.setAttribute("style", "width:100%;margin:0;height:20px;");
            $(divEdit).hide();
            var li = tags.Option(it.colName, it.getDescription(), it);
            var divShow = tags.Block()
                .attr("style", "width:100%;margin:0;padding:0;height:20px;");
            li
                .append(divShow)
                .append(divEdit);

            rebuildFilterShow(li, it, divEdit, divShow);
            list.append(li);
        });
}
function drawParameter() {

    var list = $('#ulParameterRep');
    list.empty();
    $.each(objReport.parameters, function (key, it) {
        var divEdit = "";
        //var divEdit = document.createElement('div');
        //divEdit.setAttribute("style", "width:100%;margin:0;height:20px;");
        //$(divEdit).hide();
        var li = tags.Option(it.name, it.title, it, it.index);
        var divShow = document.createElement('div');
        divShow.setAttribute("style", "width:100%;margin:0;padding:0;height:20px;");
        li.appendChild(divShow);
        //li.appendChild(divEdit);
        rebuildParameterShow(li, it, divEdit, divShow);
        list.append(li);
        var disable = true;
        $.each(objReport.filters, function (ky, itm) {
            if (itm.operand1 == it.name) {
                disable = false;
            }
        });
        if (disable) {
            $(li).css("background-color", "#efefef");
        }
    });

}

function saveReport() {
    var reportName = $("#spnReport .custom-combobox input")
        .text();

    objReport.title = $("#txtFirstNameReport")
        .text();

    objReport.fontFace = $("#cmbFontFace")
        .text();

    objReport.fontSize = fontSize;


    if (reportName == null || reportName == "") {

        showMessage("لطفا نام گزارش را وارد کنید .", "Warning");
        return false;
    }
    if (objReport.columns == null || objReport.columns.length == 0) {
        showMessage("لطفا ستون گزارش را وارد کنید .", "Warning");
        return false;
    }
    objReport.name = objReport.save(reportName, false);
    fillComboReport(reportName);
    showMessage("عملیات با موفقیت انجام شد .", "Info");
}
function dropReport() {

    var reportName = combo.text();

    if (reportName == null || reportName == "" || reportName == const_newreport) {

        showMessage("لطفا گزارش را انتخاب کنید .", "Warning");
        return false;
    }

    objReport
        .drop();

    fillComboReport(null);

    objReport = new FSP.Report(objReport.templateID);
    drawColumns();
    drawOrders();
    drawGroupby();
    drawAggregate();
    drawFilters();
    drawParameter();
    showMessage("عملیات با موفقیت انجام شد .", "Info");
}
//******** fill ***********************/
function fillComboReport(selected) {
    combo
        .empty();

    var getReportByTemplate = FSP.service.list(templateId);

    combo
        .append(tags.Option(const_newreport, const_newreport);
    $.each(getReportByTemplate, function (key, item) {
        var option = $('<option>' + item + '</option>');
        combo.append(option);
    });

    if (selected != null)
        combo
            .val(selected);
    else
        $("#spnReport .custom-combobox input")
            .val("");
}

function fillPopuoParam() {
    $('#divWinParam').empty();
    var tblWinParam = document.createElement("table");
    $.each(objReport.parameters, function (key, it) {

        var tr = document.createElement("tr");
        $(tblWinParam).css("width", "350px");
        tblWinParam.appendChild(tr);

        var lbl = document.createElement("label");
        $(lbl).text(it.prompt + " : ");
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
function saveSort(divShow, isDesc) {
    var jdiv = $(divShow);
    var li = jdiv.parent();
    var index = li.attr("index");
    var i;
    for (i = 0; i < objReport.orderby.length; i++) {
        if (objReport.orderby[i].colName index == index)
        break;
    }
    if (i < objReport.orderby.length) {
        objReport.orderby[i].descending = isDesc;
    }
    drawOrders();
};

//***** draw methods ****/
function drawOrders() {
    var list = $("#ulSortRep");
    list.empty();
    $.each(objReport.orderby, function (key, it) {
        var li = tags.Option(it.colName, it.getDes(), it, it.index);

        var divShow = tags.Block()
            .attr('style', "width:100%;margin:0;padding:0;height:20px;")
            .append(
                tags.Label()
                    .append(it.getDes())
                    .attr('title', it.getDes())
                    .attr('style', " overflow: hidden;white-space:nowrap;text-overflow:ellipsis;width:220px;display:inline-block;")
            )
            .append(tags.Link(() => UI.deleteOrder(it.colName))
                .append(
                    tags.Img("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA3UlEQVQ4jaWTIQ7CQBBFR3CYHoLsDBLX3xrug6hAcJjuLJIEiYGA4AAVPUAlYhFtoSUQJnSTbyb5L/N/ZklkP3OZrhlaMTQaVTloIbKfUWe2Gkdyma6Joed/AQw90wRzZGj8BLi71G8ZvnnNfNPO9P4T4BA2RESC3byF+EawmxMROYSNZYNa8jLpIb1Z8jJhaG0BREY4chqW1D3O/IKhB2sHkaE3gV/1AElDytCTEfDKLHmZDOOMi/1aohZvmZ+dOGhh2qC7zmFhdTszbPDPIV0nAC4fc1nloAVN/c4P4mUOIqsUSDsAAAAASUVORK5CYII=", "float:left;margin-top:2px")));

        if (it.descending == false) {
            $(divShow)
                .append(tags.Link(() => saveSort($(this).parentNode, true))
                    .append(
                        tags.Img("data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQ0NC44MTkgNDQ0LjgxOSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDQ0LjgxOSA0NDQuODE5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTQzNC4yNTIsMTg1LjcyMWwtMjEuNDA5LTIxLjQxM2MtNy40MTktNy4wNDItMTYuMDg0LTEwLjU2NC0yNS45NzUtMTAuNTY0Yy0xMC4wOTUsMC0xOC42NTcsMy41MjEtMjUuNywxMC41NjQgICBsLTgzLjkzOCw4My45MzlWNDcuMjU1YzAtOS45LTMuNjIxLTE4LjQ2NC0xMC44NTUtMjUuNjk3Yy03LjIzNC03LjIzMi0xNS43OTctMTAuODUtMjUuNjkzLTEwLjg1aC0zNi41NDUgICBjLTkuODk3LDAtMTguNDY0LDMuNjIxLTI1LjY5MywxMC44NWMtNy4yMzYsNy4yMzMtMTAuODUsMTUuNzk3LTEwLjg1LDI1LjY5N3YyMDAuOTkybC04My45MzktODMuOTM5ICAgYy03LjA0Mi03LjA0Mi0xNS42MDYtMTAuNTY0LTI1LjY5Ny0xMC41NjRjLTkuODk2LDAtMTguNTU5LDMuNTIxLTI1Ljk3OSwxMC41NjRsLTIxLjEyOCwyMS40MTNDMy42MTUsMTkyLjk0OCwwLDIwMS42MTUsMCwyMTEuNyAgIGMwLDEwLjI4MiwzLjYxOSwxOC44NDgsMTAuODQ4LDI1LjY5OGwxODUuODY0LDE4Ni4xNDZjNy4wNDUsNy4wNDYsMTUuNjA5LDEwLjU2NywyNS42OTcsMTAuNTY3ICAgYzkuODk3LDAsMTguNTU4LTMuNTIxLDI1Ljk3Ny0xMC41NjdsMTg1Ljg2NS0xODYuMTQ2YzcuMDQzLTcuMDQzLDEwLjU2Ny0xNS42MDgsMTAuNTY3LTI1LjY5OCAgIEM0NDQuODE5LDIwMS44MDUsNDQxLjI5NSwxOTMuMTQ1LDQzNC4yNTIsMTg1LjcyMXoiIGZpbGw9IiNmZjU3MjIiLz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K", "float:left;margin-left:5px;margin-top:2px"))
                    .attr("id", "cmbDesc")
                    .css("vertical-align", "top")
                    .css("margin-right", "0")
                )
        } else {
            $(divShow).append(
                tags.Link(() => saveSort($(this).parentNode, false))
                    .append(
                        tags.Img("data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQ0NC44MTkgNDQ0LjgxOSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDQ0LjgxOSA0NDQuODE5OyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxnPgoJPHBhdGggZD0iTTQzNC4yNTIsMjA4LjcwOEwyNDguMzg3LDIyLjg0M2MtNy4wNDItNy4wNDMtMTUuNjkzLTEwLjU2NC0yNS45NzctMTAuNTY0Yy0xMC40NjcsMC0xOS4wMzYsMy41MjEtMjUuNjk3LDEwLjU2NCAgIEwxMC44NDgsMjA4LjcwOEMzLjYxNSwyMTUuOTQsMCwyMjQuNjA0LDAsMjM0LjY5MmMwLDkuODk3LDMuNjE5LDE4LjQ1OSwxMC44NDgsMjUuNjkzbDIxLjQxMSwyMS40MDkgICBjNi44NTQsNy4yMzEsMTUuNDIsMTAuODU1LDI1LjY5NywxMC44NTVjMTAuMjc4LDAsMTguODQyLTMuNjI0LDI1LjY5Ny0xMC44NTVsODMuOTM5LTgzLjY1MXYyMDAuOTk4ICAgYzAsOS44OSwzLjU2NywxNy45MzYsMTAuNzA2LDI0LjEyNmM3LjEzOSw2LjE4NCwxNS43NTIsOS4yNzMsMjUuODM3LDkuMjczaDM2LjU0NWMxMC4wODksMCwxOC42OTgtMy4wOSwyNS44MzctOS4yNzMgICBjNy4xMzktNi4xODgsMTAuNzEyLTE0LjIzNiwxMC43MTItMjQuMTI2VjE5OC4xNDRsODMuOTM4LDgzLjY1MWM2Ljg0OCw3LjIzMSwxNS40MTMsMTAuODU1LDI1LjcsMTAuODU1ICAgYzEwLjA4MiwwLDE4Ljc0Ny0zLjYyNCwyNS45NzUtMTAuODU1bDIxLjQwOS0yMS40MDljNy4wNDMtNy40MjYsMTAuNTY3LTE1Ljk4OCwxMC41NjctMjUuNjkzICAgQzQ0NC44MTksMjI0Ljc5NSw0NDEuMjk1LDIxNi4xMzQsNDM0LjI1MiwyMDguNzA4eiIgZmlsbD0iI2ZmNTcyMiIvPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+CjxnPgo8L2c+Cjwvc3ZnPgo=", "float:left;margin-left:5px;margin-top:2px"))
                    .attr("id", "cmbAsc")
                    .css("vertical-align", "top")
                    .css("margin-right", "0")
            )
        }
        list.append(li);
    });
}
function showMessage(message, status) {
    $("#lblHeadMessage").empty();
    if (status == "Info") {
        $("#divMessage").css("background-color", "lightblue");
        $("#lblHeadMessage").append("توجه !");

    }
    if (status == "Warning") {
        $("#divMessage").css("background-color", "lightcoral");
        $("#lblHeadMessage").append("هشدار !");
    }
    $("#lblMessage").empty();
    $("#lblMessage").append(message);
    $('#messageBox').bPopup({
        fadeSpeed: 'slow', //can be a string ('slow'/'fast') or int
        followSpeed: 1500,
        modalClose: false,
        opacity: 0.6,
        positionStyle: 'fixed' //'fixed' or 'absolute'
    });
}