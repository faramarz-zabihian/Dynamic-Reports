export namespace FSP {
    export interface IProcessor {
        (xml, xsl): void;
    }
    export enum AggregatePosition {
        report,
        page,
        group,
    }
    export enum AggregateOp {
        sum,
        avg,
        count,
        max,
        min
    }

    declare var jsxml: any;
    interface JX {
        xslt(xml: string, xsl: string): string;
    }
    export interface ITemplateColumn {
        name: string;
        title: string;
        type: string;
        width: number
    }
    interface IDataPageParams {
        r: Report;
        templateID: string;
        FromPage: number;
        ToPage: number;
        PageSize: number
    }
    interface IXSLTranslateParams {
        r: Report;
        templateID: string;
    }
    interface INameDescription {
        name: string;
        title: string;
    }
    interface IBackendService {
        //report related
        decode(txt: string): string;
        getAddress: (action: string) => string;
        getColumns: (templateId: string) => Column[];
        list: (templateId: string) => INameDescription[];
        load(templateId: string, name: string): Report;
        listTemplates(): INameDescription[];
        GetPageData: (params: IDataPageParams) => string;
        GetTranslator: (params: IXSLTranslateParams) => string;
        // pure
        setBase(url: string);
        BackendCall: (address: string, params: any) => string;
        JSupport: () => boolean;
        XCall: (address: string, data: any) => XMLHttpRequest;
        JCall: (address: string, parameters: any, asynchron: boolean, succ?: (data: any) => void, fail?: (e: any) => void) => any;
        JDownLoad: (address: string, parameters: any, asynchron: boolean) => void;
    }
    export class Report {
        constructor(id: string) {
            this.templateID = id;
        }
        deleteAggregate(rdx: number) {
            if (rdx >= 0 && rdx <= this.aggregates.length)
                this.aggregates.splice(rdx, 1);
        }

        //todo: delete aggregates based on name
        deleteGroup(name: string) {
            let gdx = this.getGroupIndex(name);
            if (gdx < 0) // !exist
                return;
            let colIndex = this.columnIndex(name);
            if (colIndex < 0) //!!
                return;
            //this.deleteAggregates(name);
            this.groupby.splice(gdx, 1);
        }
        rearrangeOrders(): void {
            for (var i = 0; i < this.groupby.length; i++) {
                let colName = this.groupby[i].name;
                let odex = this.getOrderIndex(colName);
                this.rePosition<Order>(this.orderby, odex, i);
                //    let order = this.orderby[odex];
                //    this.orderby.splice(odex, 1);
                //    this.orderby.splice(i, 0, order);
            }
        }
        addGroup(colIndex: number, ascending?: boolean, index?: number): number {
            let col = this.column(colIndex);
            if (col == null)
                return;

            if (index < 0 || index == undefined)
                index = this.groupby.length;

            let gdx = this.getGroupIndex(col.name); // exists!
            if (gdx > -1) // found
            {
                this.rePosition(this.groupby, gdx, index);
                //if (gdx == index)// no need to change
                //    return gdx;
                // reposition  group

                //this.groupby.splice(gdx, 1);
                //this.groupby.splice(index, 0, g);
            } else
                this.groupby.splice(index, 0, new Group(this, this.column(colIndex).name, ascending));

            if (this.getOrderIndex(col.name) < 0) // fulfill a prerequisite
                this.addOrder(colIndex)

            // group addition or rearrange causes an order rearrange
            this.rearrangeOrders();
            this.rearrangeColumns();
            return index;
        }
        name: string = "";
        title: string;
        subTitle: string;
        printRowNo: boolean;
        printUnderLine: boolean;
        printDate: boolean;
        fontFace: string;
        fontSize: number;
        pageCount: number;
        pageSize: number;
        mergeIndex: number;
        templateID = null;
        columns: Column[] = [];
        orderby: Order[] = [];
        groupby: Group[] = [];
        filters: Filter[] = [];
        aggregates: Aggregate[] = [];
        parameters: Parameter[] = [];


        column(index: number): Column {
            return index < 0 || index >= this.columns.length ? null : this.columns[index]
        }

        columnIndex(name: string): number {
            for (var i = 0; i < this.columns.length; i++)
                if (this.columns[i].name == name)
                    return i;
            return -1;
        }
        getColumnByName(name: string): Column | null {
            for (var i = 0; i < this.columns.length; i++)
                if (this.columns[i].name == name)
                    return this.columns[i];
            return null;
        }
        getOrderIndex(name: string) {
            for (var i = 0; i < this.orderby.length; i++)
                if (this.orderby[i].name == name)
                    return i;
            return -1;
        }
        getGroupIndex(name: string): number {
            let ndx = this.columnIndex(name);
            if (ndx < 0)
                return ndx;

            for (var i = 0; i < this.groupby.length; i++)
                if (this.groupby[i].name == name)
                    return i;
            return -1;
        }
        getTypeCol(name: string) {
            for (var i = 0; i <= this.columns.length; i++) {
                if (this.columns[i].name == name) {
                    return this.columns[i].type;
                }
            }
        }

        save(name: string, general: any): any {
            const o = service.BackendCall("SaveReport", { r: this, name: name, genAccess: general });
            return window.JSON.parse(o);
        }

        drop(): void {
            service.BackendCall("DropReport", { templateID: this.templateID, name: this.name });
        }

        // executes report and produces html to be displayed
        execute(fromPage: number, toPage: number, pageSize: number, processor: IProcessor): void {
            const xml = window.JSON.parse(service.GetPageData({ r: this, templateID: this.templateID, FromPage: fromPage, ToPage: toPage, PageSize: pageSize }));
            const xsl = window.JSON.parse(service.GetTranslator({ r: this, templateID: this.templateID }));
            processor(xml, xsl);
        }

        deleteParameter(name: string): void {
            for (let i = this.parameters.length - 1; i >= 0; i--) {
                if (this.parameters[i].name === name) {
                    this.parameters.splice(i, 1);
                    break;
                }
            }
        }
        addColumnByTemplate(item: ITemplateColumn, index?: number | undefined): number {
            return this.addColumn(item.name, item.title, item.type, item.width, index);
        }

        addColumn(name: string, title: string | undefined, type: string, width?: number, pos?: number | undefined): number {
            const cdx = this.columnIndex(name);
            if (cdx > -1) // exists!
                return cdx;

            if (pos == undefined || pos < 0 || pos > this.columns.length) // invalid position
                pos = this.columns.length;

            this.columns.splice(pos, 0, new Column(this, name, title == undefined ? name : title, type));
            return pos;
        }

        deleteColumn(name: string): void {
            this.deleteOrder(name);
            this.deleteFilter(name);

            let ndx = this.columnIndex(name);
            if (ndx < 0) //does not exist!
                return;

            this.columns.splice(ndx, 1);
            if (this.mergeIndex >= ndx)
                this.mergeIndex = this.mergeIndex

            if (this.mergeIndex >= ndx) {
                --this.mergeIndex;
            }
        }

        addOrder(colIndex: number, index?: number): number {
            let col = this.column(colIndex);
            if (col == null)
                return -1;

            let odex = this.getOrderIndex(col.name);
            if (odex > -1) {
                if (index != undefined)
                    this.rePosition(this.orderby, odex, index);
            }
            else {
                index = index ?? this.orderby.length;
                if (index < 0)
                    index = this.orderby.length;

                this.orderby.splice(index, 0, new Order(this, this.column(colIndex).name, false));
            }

            this.rearrangeGroups(); // groups may need a rearrangement as well
            this.rearrangeColumns(); // rearranging groups necesiates column rearrangement            
            this.rearrangeOrders(); // if groups can not be rearranged, orders should accord with them
            return index;
        }

        // based on orderBy priorities rearranges groups 
        rearrangeGroups(): void {
            let pos = 0;
            for (let i = 0; i < this.orderby.length; i++) {
                let gdx = this.getGroupIndex(this.orderby[i].name);
                if (gdx > -1)
                    this.rePosition<Group>(this.groupby, gdx, pos++);
            }
        }
        // reposition an element within an array
        private rePosition<T>(list: T[], fdex: number, tdex: number): void {
            if (fdex < 0 || tdex < 0 || fdex >= list.length || tdex >= list.length)
                return;

            if (fdex != tdex) {
                let v = list[fdex];
                list.splice(fdex, 1);
                list.splice(tdex, 0, v);
            }
        }
        // based on groupBy priorities rearranges groups 
        rearrangeColumns(): void {
            for (var i = 0; i < this.groupby.length; i++) {
                let colName = this.groupby[i].name;
                let cdex = this.columnIndex(colName);
                this.rePosition<Column>(this.columns, cdex, i);
                //let col = this.columns[cdex];
                //this.columns.splice(cdex, 1);
                //this.columns.splice(i, 0, col);
            }
        }
        // deletes an order by column
        deleteOrder(name: string): void {
            let ndx = this.getOrderIndex(name);
            if (ndx >= 0) {
                this.deleteGroup(this.orderby[ndx].name);
                this.orderby.splice(ndx, 1);
            }
        }

        //adds a run time report parameter to report
        addParamater(item: Parameter, index: number): boolean {
            let foud = false;
            for (let i = 0; i < this.parameters.length; i++) {
                if (this.parameters[i].name == item.name) {
                    foud = true;
                }
            }
            if (foud) {
                return false;
            }
            this.parameters.push(item);
        }

        addFilter(colIndex: number, operand1: any, operand2: any, operator: string, negate: boolean, index?: number): number {
            let col = this.column(colIndex);
            if (col == null)
                return;
            if (index == -1 || index == undefined)
                index = this.filters.length;

            this.filters.splice(index, 0, new Filter(this, col.name, operator, operand1, operand2, negate));
            return index;

        }
        // removes all filters on the coluumn name
        deleteFilter(name: string): void {
            //let cdex = this.columnIndex(name);
            for (let i = this.filters.length - 1; i >= 0; i--)
                if (this.filters[i].colName === name) {
                    this.filters.splice(i, 1);
                    break;
                }
        }
        // removes all filters on the coluumn name
        deleteFilterByRowIndex(ndx: number): void {
            if (ndx > -1 && ndx < this.filters.length)
                this.filters.splice(ndx, 1);
        }

        //todo: complete the addAggregate
        // aggregate field type should be checked (for sum/avg ...)
        // aggregate redundancy should be checked
        addAggregate(colIndex: number, type: AggregateOp = AggregateOp.sum, position: AggregatePosition) {
            let name = this.column(colIndex)?.name;
            this.aggregates.push(new Aggregate(this, type, position, name));
        }
        copy(r?: Report) {
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

            const ShallowCopy = function (original: any, data: any): any {
                for (const key in original) {
                    if (data.hasOwnProperty(key)) {
                        const t = Object.prototype.toString.call(data[key]);
                        if (!(t === '[object Object]' || t === '[object Array]')) {
                            original[key] = data[key];
                        }
                    }
                }
                return original;
            };

            const copyArray = function (srcList: any[], targetList: any[], cls: any): void {
                for (const index in srcList) {
                    targetList.push(ShallowCopy(new cls(), srcList[index]));
                }
            };

            if (r != undefined && r != null) {
                ShallowCopy(this, r);
                copyArray(r.columns, this.columns, Column);
                copyArray(r.orderby, this.orderby, Order);
                copyArray(r.groupby, this.groupby, Group);
                copyArray(r.aggregates, this.aggregates, Aggregate);
                /*     for (let i = 0; i < r.aggregates.length; i++) {
                         this.aggregates.positions = [];
                         for (let j = 0; j < r.aggregates[i].positions.length; j++) {
                             this.aggregates[i].positions.push(r.aggregates[i].positions[j]);
                         }
                     }*/
                copyArray(r.filters, this.filters, Filter);
                copyArray(r.parameters, this.parameters, Parameter);
            }
        }
    }
    export class Column {
        name: string;
        title: string;
        report: Report;
        type: string;
        width: number;
        constructor(report: Report, name: string, title: string | undefined, type?: string, width?: number) {
            this.name = name;
            this.title = title;
            this.report = report;
            this.type = type;
            this.width = width;
        }
    }
    export class Filter {
        readonly report: Report;
        readonly colName: string;
        readonly type: string
        operand1: string;
        operand2: string;
        operator: string;
        negate: boolean;
        constructor(report: Report, colName: string, operator: string = "<=", operand1: string, operand2: string, negate = false) {
            this.report = report;
            this.colName = colName;
            this.operand1 = operand1;
            this.operand2 = operand2
            this.operator = operator;
            this.negate = negate;
        }

        getDescription(): string {
            const qoute = function (txt: string): string {
                if (txt == undefined || txt == null) {
                    return "";
                }
                return "\u00B4" + txt + "\u0060";
            };
            const brace = function (txt: string): string {
                return "«" + txt + "»";
            };
            const positive = function (neg: boolean): string {
                return neg ? " نباشد." : " باشد.";
            };

            const opName = function (op: string): string {
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
            let col = this.report.getColumnByName(this.colName);
            let des = brace(col.title) + opName(this.operator);
            if (this.operator == "()") {
                des += qoute(this.operand1 + " و " + this.operand2);
            } else {
                des += qoute(this.operand1);
            }
            return des + positive(this.negate);
        }

        init(): void {
            if (this.type == "Number") {
                this.operator = "=";
                this.operand1 = "0";
            } else if (this.type == "DateTime") {
                this.operator = "<=";
                this.operand1 = "...";
            } else {
                this.operator = "n";
                this.negate = true;
            }
        }
    }

    export class Aggregate {
        private report: Report;
        private name: string;
        private type: AggregateOp;
        private position: AggregatePosition = AggregatePosition.report;
        constructor(report: Report, type: AggregateOp, position, colName: string) {
            this.report = report;
            this.name = colName;
            this.setType(type);
            this.setPosition(position);
        }
        setType(type: AggregateOp) {
            let colIndex = this.report.columnIndex(this.name);
            if (colIndex > -1) {
                let col = this.report.column(colIndex);
                // only numeric columns can have numeric aggregation types { sum, avg }
                //todo: check column type
                this.type = AggregateOp.count;
            }
            else {
                type = AggregateOp.count;
                this.name = null;
            }
        }
        setPosition(pos: AggregatePosition) {
            let colIndex = this.report.columnIndex(this.name);
            if (colIndex > -1) { // column is for real
                let gdx = this.report.getGroupIndex(this.name);
                if (gdx >= 0) // is there any grouping on the column
                    this.position = pos; // any position is acceptable
            }
            // error in name, emtpy column, or an existing name but no grouping on that name
            if (pos != AggregatePosition.group)
                this.position = pos;
            return;
        }
    }
    export class ParamValue {
        inputType: string;
        prompt: string;
        lookupReport: any;
        constructor(InputType: string, Prompt: string, lookup: any) {
            this.inputType = InputType;
            this.prompt = Prompt;
            this.lookupReport = lookup;
        }
    };
    export class Parameter {
        name: string;
        title: string;
        value = new ParamValue("dataEntry", "وارد  کنید", null);
    }

    const ascendingText: string = " صعودی است ";
    const descendingText: string = " نزولی است ";

    export class Order {
        public readonly name: string;
        public descending: boolean;
        private report: Report;
        getColumn(): Column {
            return this.report.getColumnByName(this.name);
        }

        constructor(report: Report, colName: string, desc: boolean | undefined) {
            this.report = report;
            this.name = colName;
            this.descending = false;
        }
        getDes(): string {
            const brace = function (txt: string): string {
                return "«" + txt + "»";
            };
            const lblDir = (dir: boolean | undefined | string): string => {
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
        }
    }
    export class Group {
        public readonly name;
        private report: Report;
        getColumn(): Column {
            return this.report.getColumnByName(this.name);
        }
        constructor(report: Report, colName: string, ascending?: boolean) {
            this.report = report;
            this.name = colName;
        }
    }

    /////////////////////////////////////////////////////////////////
    export var service: IBackendService = {
        setBase(url: string): void {
            this.baseURL = url;
        },
        // builds an endpoint address from target service
        getAddress: function (action: string): string {
            return this.baseURL + "/" + action;
        },
        // gets colums of a report template
        getColumns(templateId: string): any[] {
            var o: string = this.BackendCall(this.getAddress("getColumns"), { templateID: templateId });
            return window.JSON.parse(o);
        },

        // lists saved reports defined under a template name
        list(templateId: string): INameDescription[] {
            const o: string = this.BackendCall(this.getAddress("ListReport"), { templateID: templateId });
            return JSON.parse(o);
        },

        // loads a named report defined under a template name
        load(templateId: string, name: string): Report {
            const r: string = this.BackendCall(this.getAddress("LoadReport"), { templateID: templateId, name });
            return window.JSON.parse(r);
        },
        listTemplates(): INameDescription[] {
            return window.JSON.parse(this.BackendCall(this.getAddress("listTemplates")));
        },
        // 
        GetPageData(params: any): string {
            return this.BackendCall(this.getAddress("PageData"), params);
        },

        GetTranslator(params: any): string {
            return this.BackendCall(this.getAddress("XSLTranslator"), params);
        },
        JSupport() {
            if (navigator.appName == 'Microsoft Internet Explorer')
                return false;
            return true;
        },

        BackendCall(address: string, params: any) {
            if (this.JSupport())
                return this.JCall(address, params, false);
            else
                this.XCall(address, params);
        },

        XCall(address: string, data: any): XMLHttpRequest {
            let xhttp: XMLHttpRequest;

            if (window.ActiveXObject) {
                xhttp = new ActiveXObject("Msxml2.XMLHTTP");
            } else {
                xhttp = new XMLHttpRequest();
            }
            xhttp.open("POST", address, false);
            try {
                xhttp.responseType = "document";
            } catch (err) {
                // Handle error
            }
            xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhttp.send(JSON.stringify(data));
            return xhttp;
        },
        JCall(address: string, parameters: any, asynchron: boolean, succ: (data: any) => void, fail: (e: any) => void): string {
            if (succ == undefined)
                succ = function (data: any) {
                };

            if (fail == undefined)
                fail = function (e: any) {
                    alert('failure :::' + e.responseText);
                };

            if (asynchron == undefined)
                asynchron = true;
            if (parameters == undefined)
                parameters = null;

            let cache = []
            let removeDups = function (key, value) {
                if (typeof value === "object" && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        // Circular reference found, discard key
                        return;
                    }
                    // Store value in our collection
                    cache.push(value);
                }
                return value;
            };
            var resp: string = $.ajax({
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

        JDownLoad(address, parameters, asynchron) {
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
                        if (matches != null && matches[1]) filename = matches[1].replace(/['"]/g, '');
                    }
                    var type = xhr.getResponseHeader('Content-Type');

                    var blob = new Blob([this.response], { type: type });
                    if (typeof window.navigator.msSaveBlob !== 'undefined') {
                        // IE workaround for "HTML7007: One or more blob URLs were revoked by closing the blob for which they were created. These URLs will no longer resolve as the data backing the URL has been freed."
                        window.navigator.msSaveBlob(blob, filename);
                    } else {
                        var URL = window.URL || window.webkitURL;
                        var downloadUrl = URL.createObjectURL(blob);

                        if (filename) {
                            // use HTML5 a[download] attribute to specify filename
                            var a = document.createElement("a");
                            // safari doesn't support this yet
                            if (typeof a.download === 'undefined') {
                                window.location.href = downloadUrl;
                            } else {
                                a.href = downloadUrl;
                                a.download = filename;
                                document.body.appendChild(a);
                                a.click();
                            }
                        } else {
                            window.location.href = downloadUrl;
                        }
                        setTimeout(function () { URL.revokeObjectURL(downloadUrl); }, 100); // cleanup
                    }
                }
            };
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(parameters));
        },
        decode(txt: string): string {
            return txt.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        }
    }
}
declare global {
    interface Navigator {
        msSaveBlob?: (blob: any, defaultName?: string) => boolean
    }
}

export { }


