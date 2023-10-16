"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FSP = void 0;
var FSP;
(function (FSP) {
    var AggregatePosition;
    (function (AggregatePosition) {
        AggregatePosition[AggregatePosition["report"] = 0] = "report";
        AggregatePosition[AggregatePosition["page"] = 1] = "page";
        AggregatePosition[AggregatePosition["group"] = 2] = "group";
    })(AggregatePosition = FSP.AggregatePosition || (FSP.AggregatePosition = {}));
    var AggregateOp;
    (function (AggregateOp) {
        AggregateOp[AggregateOp["sum"] = 0] = "sum";
        AggregateOp[AggregateOp["avg"] = 1] = "avg";
        AggregateOp[AggregateOp["count"] = 2] = "count";
        AggregateOp[AggregateOp["max"] = 3] = "max";
        AggregateOp[AggregateOp["min"] = 4] = "min";
    })(AggregateOp = FSP.AggregateOp || (FSP.AggregateOp = {}));
    var Report = (function () {
        function Report(id) {
            this.name = "";
            this.templateID = null;
            this.columns = [];
            this.orderby = [];
            this.groupby = [];
            this.filters = [];
            this.aggregates = [];
            this.parameters = [];
            this.templateID = id;
        }
        Report.prototype.deleteAggregate = function (rdx) {
            if (rdx >= 0 && rdx <= this.aggregates.length)
                this.aggregates.splice(rdx, 1);
        };
        Report.prototype.deleteGroup = function (name) {
            var gdx = this.getGroupIndex(name);
            if (gdx < 0)
                return;
            var colIndex = this.columnIndex(name);
            if (colIndex < 0)
                return;
            this.groupby.splice(gdx, 1);
        };
        Report.prototype.rearrangeOrders = function () {
            for (var i = 0; i < this.groupby.length; i++) {
                var colName = this.groupby[i].name;
                var odex = this.getOrderIndex(colName);
                this.rePosition(this.orderby, odex, i);
            }
        };
        Report.prototype.addGroup = function (colIndex, ascending, index) {
            var col = this.column(colIndex);
            if (col == null)
                return;
            if (index < 0 || index == undefined)
                index = this.groupby.length;
            var gdx = this.getGroupIndex(col.name);
            if (gdx > -1) {
                this.rePosition(this.groupby, gdx, index);
            }
            else
                this.groupby.splice(index, 0, new Group(this, this.column(colIndex).name, ascending));
            if (this.getOrderIndex(col.name) < 0)
                this.addOrder(colIndex);
            this.rearrangeOrders();
            this.rearrangeColumns();
            return index;
        };
        Report.prototype.column = function (index) {
            return index < 0 || index >= this.columns.length ? null : this.columns[index];
        };
        Report.prototype.columnIndex = function (name) {
            for (var i = 0; i < this.columns.length; i++)
                if (this.columns[i].name == name)
                    return i;
            return -1;
        };
        Report.prototype.getColumnByName = function (name) {
            for (var i = 0; i < this.columns.length; i++)
                if (this.columns[i].name == name)
                    return this.columns[i];
            return null;
        };
        Report.prototype.getOrderIndex = function (name) {
            for (var i = 0; i < this.orderby.length; i++)
                if (this.orderby[i].name == name)
                    return i;
            return -1;
        };
        Report.prototype.getGroupIndex = function (name) {
            var ndx = this.columnIndex(name);
            if (ndx < 0)
                return ndx;
            for (var i = 0; i < this.groupby.length; i++)
                if (this.groupby[i].name == name)
                    return i;
            return -1;
        };
        Report.prototype.getTypeCol = function (name) {
            for (var i = 0; i <= this.columns.length; i++) {
                if (this.columns[i].name == name) {
                    return this.columns[i].type;
                }
            }
        };
        Report.prototype.save = function (name, general) {
            var o = FSP.service.BackendCall("SaveReport", { r: this, name: name, genAccess: general });
            return window.JSON.parse(o);
        };
        Report.prototype.drop = function () {
            FSP.service.BackendCall("DropReport", { templateID: this.templateID, name: this.name });
        };
        Report.prototype.execute = function (fromPage, toPage, pageSize, processor) {
            var xml = window.JSON.parse(FSP.service.GetPageData({ r: this, templateID: this.templateID, FromPage: fromPage, ToPage: toPage, PageSize: pageSize }));
            var xsl = window.JSON.parse(FSP.service.GetTranslator({ r: this, templateID: this.templateID }));
            processor(xml, xsl);
        };
        Report.prototype.deleteParameter = function (name) {
            for (var i = this.parameters.length - 1; i >= 0; i--) {
                if (this.parameters[i].name === name) {
                    this.parameters.splice(i, 1);
                    break;
                }
            }
        };
        Report.prototype.addColumnByTemplate = function (item, index) {
            return this.addColumn(item.name, item.title, item.type, item.width, index);
        };
        Report.prototype.addColumn = function (name, title, type, width, pos) {
            var cdx = this.columnIndex(name);
            if (cdx > -1)
                return cdx;
            if (pos == undefined || pos < 0 || pos > this.columns.length)
                pos = this.columns.length;
            this.columns.splice(pos, 0, new Column(this, name, title == undefined ? name : title, type));
            return pos;
        };
        Report.prototype.deleteColumn = function (name) {
            this.deleteOrder(name);
            this.deleteFilter(name);
            var ndx = this.columnIndex(name);
            if (ndx < 0)
                return;
            this.columns.splice(ndx, 1);
            if (this.mergeIndex >= ndx)
                this.mergeIndex = this.mergeIndex;
            if (this.mergeIndex >= ndx) {
                --this.mergeIndex;
            }
        };
        Report.prototype.addOrder = function (colIndex, index) {
            var col = this.column(colIndex);
            if (col == null)
                return -1;
            var odex = this.getOrderIndex(col.name);
            if (odex > -1) {
                if (index != undefined)
                    this.rePosition(this.orderby, odex, index);
            }
            else {
                index = index !== null && index !== void 0 ? index : this.orderby.length;
                if (index < 0)
                    index = this.orderby.length;
                this.orderby.splice(index, 0, new Order(this, this.column(colIndex).name, false));
            }
            this.rearrangeGroups();
            this.rearrangeColumns();
            this.rearrangeOrders();
            return index;
        };
        Report.prototype.rearrangeGroups = function () {
            var pos = 0;
            for (var i = 0; i < this.orderby.length; i++) {
                var gdx = this.getGroupIndex(this.orderby[i].name);
                if (gdx > -1)
                    this.rePosition(this.groupby, gdx, pos++);
            }
        };
        Report.prototype.rePosition = function (list, fdex, tdex) {
            if (fdex < 0 || tdex < 0 || fdex >= list.length || tdex >= list.length)
                return;
            if (fdex != tdex) {
                var v = list[fdex];
                list.splice(fdex, 1);
                list.splice(tdex, 0, v);
            }
        };
        Report.prototype.rearrangeColumns = function () {
            for (var i = 0; i < this.groupby.length; i++) {
                var colName = this.groupby[i].name;
                var cdex = this.columnIndex(colName);
                this.rePosition(this.columns, cdex, i);
            }
        };
        Report.prototype.deleteOrder = function (name) {
            var ndx = this.getOrderIndex(name);
            if (ndx >= 0) {
                this.deleteGroup(this.orderby[ndx].name);
                this.orderby.splice(ndx, 1);
            }
        };
        Report.prototype.addParamater = function (item, index) {
            var found = false;
            for (var i = 0; i < this.parameters.length; i++) {
                if (this.parameters[i].name == item.name) {
                    found = true;
                }
            }
            if (found) {
                return false;
            }
            this.parameters.push(item);
            return true;
        };
        Report.prototype.addFilter = function (colIndex, operand1, operand2, operator, negate, index) {
            var col = this.column(colIndex);
            if (col == null)
                return;
            if (index == -1 || index == undefined)
                index = this.filters.length;
            this.filters.splice(index, 0, new Filter(this, col.name, operator, operand1, operand2, negate));
            return index;
        };
        Report.prototype.deleteFilter = function (name) {
            for (var i = this.filters.length - 1; i >= 0; i--)
                if (this.filters[i].colName === name) {
                    this.filters.splice(i, 1);
                    break;
                }
        };
        Report.prototype.deleteFilterByRowIndex = function (ndx) {
            if (ndx > -1 && ndx < this.filters.length)
                this.filters.splice(ndx, 1);
        };
        Report.prototype.addAggregate = function (colIndex, type, position) {
            var _a;
            if (type === void 0) { type = AggregateOp.sum; }
            var name = (_a = this.column(colIndex)) === null || _a === void 0 ? void 0 : _a.name;
            this.aggregates.push(new Aggregate(this, type, position, name));
        };
        Report.prototype.copy = function (r) {
            this.name = "";
            this.title = "";
            this.subTitle = "";
            this.printRowNo = false;
            this.printUnderLine = false;
            this.printDate = false;
            this.fontFace = "tahoma";
            this.fontSize = 1;
            this.pageCount = -1;
            this.pageSize = -1;
            this.mergeIndex = -1;
            this.columns = [];
            this.orderby = [];
            this.groupby = [];
            this.filters = [];
            this.aggregates = [];
            this.parameters = [];
            var ShallowCopy = function (original, data) {
                for (var key in original) {
                    if (data.hasOwnProperty(key)) {
                        var t = Object.prototype.toString.call(data[key]);
                        if (!(t === '[object Object]' || t === '[object Array]')) {
                            original[key] = data[key];
                        }
                    }
                }
                return original;
            };
            var copyArray = function (srcList, targetList, cls) {
                for (var index in srcList) {
                    targetList.push(ShallowCopy(new cls(), srcList[index]));
                }
            };
            if (r != undefined && r != null) {
                ShallowCopy(this, r);
                copyArray(r.columns, this.columns, Column);
                copyArray(r.orderby, this.orderby, Order);
                copyArray(r.groupby, this.groupby, Group);
                copyArray(r.aggregates, this.aggregates, Aggregate);
                copyArray(r.filters, this.filters, Filter);
                copyArray(r.parameters, this.parameters, Parameter);
            }
        };
        return Report;
    }());
    FSP.Report = Report;
    var Column = (function () {
        function Column(report, name, title, type, width) {
            this.name = name;
            this.title = title;
            this.report = report;
            this.type = type;
            this.width = width;
        }
        return Column;
    }());
    FSP.Column = Column;
    var Filter = (function () {
        function Filter(report, colName, operator, operand1, operand2, negate) {
            if (operator === void 0) { operator = "<="; }
            if (negate === void 0) { negate = false; }
            this.report = report;
            this.colName = colName;
            this.operand1 = operand1;
            this.operand2 = operand2;
            this.operator = operator;
            this.negate = negate;
        }
        Filter.prototype.getDescription = function () {
            var qoute = function (txt) {
                if (txt == undefined || txt == null) {
                    return "";
                }
                return "\u00B4" + txt + "\u0060";
            };
            var brace = function (txt) {
                return "«" + txt + "»";
            };
            var positive = function (neg) {
                return neg ? " نباشد." : " باشد.";
            };
            var opName = function (op) {
                switch (op) {
                    case "<":
                        return " کوچکتر از ";
                    case "<=":
                        return " کوچکتر یا برابر با ";
                    case ">":
                        return " بزرگتر از ";
                    case ">=":
                        return " بزرگتر یا برابر با ";
                    case "=":
                        return " برابر با ";
                    case "~":
                        return " دربردارنده ";
                    case "()":
                        return " بین ";
                    case "(,)":
                        return " در فهرست ";
                    case "(":
                        return " مانند ";
                    case ")":
                        return " مانند";
                    case "n":
                        return " خالی ";
                    default:
                        return "";
                }
            };
            var col = this.report.getColumnByName(this.colName);
            var des = brace(col.title) + opName(this.operator);
            if (this.operator == "()") {
                des += qoute(this.operand1 + " و " + this.operand2);
            }
            else {
                des += qoute(this.operand1);
            }
            return des + positive(this.negate);
        };
        Filter.prototype.init = function () {
            if (this.type == "Number") {
                this.operator = "=";
                this.operand1 = "0";
            }
            else if (this.type == "DateTime") {
                this.operator = "<=";
                this.operand1 = "...";
            }
            else {
                this.operator = "n";
                this.negate = true;
            }
        };
        return Filter;
    }());
    FSP.Filter = Filter;
    var Aggregate = (function () {
        function Aggregate(report, type, position, colName) {
            this.position = AggregatePosition.report;
            this.report = report;
            this.colName = colName;
            this.setType(type);
            this.setPosition(position);
        }
        Aggregate.prototype.setType = function (type) {
            var colIndex = this.report.columnIndex(this.colName);
            if (colIndex > -1) {
                var col = this.report.column(colIndex);
                this.type = AggregateOp.count;
            }
            else {
                type = AggregateOp.count;
            }
        };
        Aggregate.prototype.setPosition = function (pos) {
            var colIndex = this.report.columnIndex(this.colName);
            if (colIndex > -1) {
                var gdx = this.report.getGroupIndex(this.colName);
                if (gdx >= 0)
                    this.position = pos;
            }
            if (pos != AggregatePosition.group)
                this.position = pos;
            return;
        };
        return Aggregate;
    }());
    FSP.Aggregate = Aggregate;
    var ParamValue = (function () {
        function ParamValue(InputType, Prompt, lookup) {
            this.inputType = InputType;
            this.prompt = Prompt;
            this.lookupReport = lookup;
        }
        return ParamValue;
    }());
    FSP.ParamValue = ParamValue;
    ;
    var Parameter = (function () {
        function Parameter() {
            this.value = new ParamValue("dataEntry", "وارد  کنید", null);
        }
        return Parameter;
    }());
    FSP.Parameter = Parameter;
    var ascendingText = " صعودی است ";
    var descendingText = " نزولی است ";
    var Order = (function () {
        function Order(report, colName, desc) {
            this.report = report;
            this.name = colName;
            this.descending = false;
        }
        Order.prototype.getColumn = function () {
            return this.report.getColumnByName(this.name);
        };
        Order.prototype.getDes = function () {
            var brace = function (txt) {
                return "«" + txt + "»";
            };
            var lblDir = function (dir) {
                switch (dir) {
                    case undefined:
                        return ascendingText;
                    case "":
                        return ascendingText;
                    case false:
                        return ascendingText;
                    case true:
                        return descendingText;
                    default:
                        return "";
                }
            };
            return brace(this.getColumn().title) + lblDir(this.descending);
        };
        return Order;
    }());
    FSP.Order = Order;
    var Group = (function () {
        function Group(report, colName, ascending) {
            this.report = report;
            this.name = colName;
        }
        Group.prototype.getColumn = function () {
            return this.report.getColumnByName(this.name);
        };
        return Group;
    }());
    FSP.Group = Group;
    FSP.service = {
        setBase: function (url) {
            this.baseURL = url;
        },
        getAddress: function (action) {
            return this.baseURL + "/" + action;
        },
        getColumns: function (templateId) {
            var o = this.BackendCall(this.getAddress("getColumns"), { templateID: templateId });
            return window.JSON.parse(o);
        },
        list: function (templateId) {
            var o = this.BackendCall(this.getAddress("ListReport"), { templateID: templateId });
            return JSON.parse(o);
        },
        load: function (templateId, name) {
            var r = this.BackendCall(this.getAddress("LoadReport"), { templateID: templateId, name: name });
            return window.JSON.parse(r);
        },
        listTemplates: function () {
            return window.JSON.parse(this.BackendCall(this.getAddress("listTemplates")));
        },
        GetPageData: function (params) {
            return this.BackendCall(this.getAddress("PageData"), params);
        },
        GetTranslator: function (params) {
            return this.BackendCall(this.getAddress("XSLTranslator"), params);
        },
        JSupport: function () {
            if (navigator.appName == 'Microsoft Internet Explorer')
                return false;
            return true;
        },
        BackendCall: function (address, params) {
            if (this.JSupport())
                return this.JCall(address, params, false);
            else
                this.XCall(address, params);
        },
        XCall: function (address, data) {
            var xhttp;
            if (window.ActiveXObject) {
                xhttp = new ActiveXObject("Msxml2.XMLHTTP");
            }
            else {
                xhttp = new XMLHttpRequest();
            }
            xhttp.open("POST", address, false);
            try {
                xhttp.responseType = "document";
            }
            catch (err) {
            }
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(JSON.stringify(data));
            return xhttp;
        },
        JCall: function (address, parameters, asynchron, succ, fail) {
            if (succ == undefined)
                succ = function (data) {
                };
            if (fail == undefined)
                fail = function (e) {
                    alert('failure :::' + e.responseText);
                };
            if (asynchron == undefined)
                asynchron = true;
            if (parameters == undefined)
                parameters = null;
            var cache = [];
            var removeDups = function (key, value) {
                if (typeof value === "object" && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        return;
                    }
                    cache.push(value);
                }
                return value;
            };
            var resp = $.ajax({
                type: "POST",
                url: address,
                data: JSON.stringify(parameters, removeDups),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: succ,
                error: fail,
                async: asynchron
            }).responseText;
            return resp;
        },
        JDownLoad: function (address, parameters, asynchron) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', address, true);
            xhr.responseType = 'arraybuffer';
            xhr.onload = function () {
                if (this.status === 200) {
                    var filename = "";
                    var disposition = xhr.getResponseHeader('Content-Disposition');
                    if (disposition && disposition.indexOf('attachment') !== -1) {
                        var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                        var matches = filenameRegex.exec(disposition);
                        if (matches != null && matches[1])
                            filename = matches[1].replace(/['"]/g, '');
                    }
                    var type = xhr.getResponseHeader('Content-Type');
                    var blob = new Blob([this.response], { type: type });
                    if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        window.navigator.msSaveBlob(blob, filename);
                    }
                    else {
                        var URL = window.URL || window.webkitURL;
                        var downloadUrl = URL.createObjectURL(blob);
                        if (filename) {
                            var a = document.createElement("a");
                            if (typeof a.download === 'undefined') {
                                window.location.href = downloadUrl;
                            }
                            else {
                                a.href = downloadUrl;
                                a.download = filename;
                                document.body.appendChild(a);
                                a.click();
                            }
                        }
                        else {
                            window.location.href = downloadUrl;
                        }
                        setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100);
                    }
                }
            };
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(parameters));
        },
        decode: function (txt) {
            return txt.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        }
    };
})(FSP || (exports.FSP = FSP = {}));
