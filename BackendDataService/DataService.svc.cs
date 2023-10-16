using Newtonsoft.Json;
using ReportBase;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Drawing;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.Text;
using System.Web;
using System.Web.Caching;
using System.Web.Hosting;
using System.Xml;
using System.Xml.Linq;
using System.Xml.Serialization;
using System.Xml.Xsl;

//todo:
//full report support
//aggregate on page
//paging support on full report
//max/min on non numeric fields
//pdf,rtf,excel exports

namespace WcfReportService
{


    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class DataService : IReportServiceContract
    {
        private const string DReportGroupName = "_report";


        //a brief list of report templates under an application
        public NameDescription[] GetTemplateNames(string app)
        {
            try
            {
                ReportConnectionModel rcm = GetTemplates(app);
                if (rcm != null)
                    return rcm.Templates.Select(t => new NameDescription { Name = t.Name, Description = t.Title }).ToArray();
            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
            }
            return new NameDescription[] { };
        }

        //list of executable reports saved under a template Name
        public List<NameDescription> ReportList(string app, string template, string userID)
        {
            return new List<NameDescription> { };
            /*try
                
                using (var db = new dbDataContext())
                    return ReportList(app, template, userID, db);
            }
            catch (Exception ex)
            {
                //   ExceptionPolicy.HandleException(ex, "General");
                return new List<string>();
            }*/
        }

        private List<string> ReportList(string app, string template, string userID, dbDataContext db)
        {

            try
            {
                return (
                        from rp in db.ReportMakerInfos
                        where
                               rp.AppLicationName == app
                            && rp.BasicTemplateName.Trim() == template.Trim()
                            && ((rp.IsGeneral == 1) || (rp.UserId == userID))
                        select rp.ReportName
                        ).ToList();


            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
                return new List<string>();
            }

        }

        private ReportMakerInfo GetReport(string app, string template, string UserID, dbDataContext db, string reportName)
        {
            try
            {
                ReportMakerInfo rep =
                     (from rp in db.ReportMakerInfos
                      where
                             rp.AppLicationName == app
                          && rp.BasicTemplateName == template
                          && (rp.UserId == UserID || rp.IsGeneral == 1)
                          && rp.ReportName == reportName
                      select rp
                     ).FirstOrDefault();
                return rep;
            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
                return new ReportMakerInfo();
            }

        }

        private string GetUniqueName(string app, string template, string UserID, dbDataContext db, string reportName)
        {
            try
            {
                string rep = reportName;
                int num = 1;
                List<string> names = ReportList(app, template, UserID, db);
                while (names.Where(r => r == rep).Count() > 0)
                    rep = reportName + num++.ToString();
                return rep;
            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
                return null;
            }

        }


        // saves a user made report
        public string ReportSave(string app, string template, string UserID, ReportModel r, string name, bool genAccess)
        {
            ReportMakerInfo sr;

            if (string.IsNullOrWhiteSpace(name))
                name = r.Name;
            if (string.IsNullOrWhiteSpace(r.Name) || string.IsNullOrWhiteSpace(app) ||
                string.IsNullOrWhiteSpace(template) || string.IsNullOrWhiteSpace(UserID))
                return "بی نام";
            ReportConnectionModel.Template tem = GetTemplate(app, template);
            if (tem == null)
                return null;
            name = CleanString(name);
            r = ValidateModel(r, tem, false);

            try
            {
                using (dbDataContext db = new dbDataContext())
                {
                    if (!string.IsNullOrEmpty(r.Name))
                    {
                        sr = GetReport(app, template, UserID, db, r.Name);
                        if (sr != null)
                            ReportDrop(app, template, UserID, r.Name);
                    }
                }
                using (dbDataContext db = new dbDataContext())
                {
                    r.Name = GetUniqueName(app, template, UserID, db, name);
                    sr = new ReportMakerInfo
                    {
                        AppLicationName = app,
                        BasicTemplateName = template,
                        UserId = UserID,
                        ReportName = r.Name
                    };
                    db.ReportMakerInfos.InsertOnSubmit(sr);

                    MemoryStream ms = new MemoryStream();
                    XmlWriter xw = new XmlTextWriter(ms, Encoding.UTF8);
                    XmlSerializer ser = new XmlSerializer(typeof(ReportModel));

                    ser.Serialize(xw, r);
                    xw.Close();
                    ms = new MemoryStream(ms.ToArray());
                    TextReader xr = new StreamReader(ms);
                    //string def = xr.ReadToEnd();
                    //xr.Close();
                    XElement xe = XElement.Load(xr);
                    sr.ReportContent = xe;
                    // sr.ReportContent.SetValue(def);
                    sr.IsGeneral = genAccess ? 1 : 0;
                    db.SubmitChanges();
                }
            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
                return null;
            }
            return r.Name;
        }

        // remove a user made report
        public bool ReportDrop(string app, string templateName, string UserID, string reportName)
        {
            try
            {
                dbDataContext db = new dbDataContext();
                ReportMakerInfo[] rep =
                db.ReportMakerInfos.Where(r =>
                           r.AppLicationName == app
                        && r.BasicTemplateName == templateName
                        && r.UserId == UserID
                        && r.ReportName == reportName).ToArray();
                if (rep.Length > 0)
                {
                    db.ReportMakerInfos.DeleteOnSubmit(rep[0]);
                    db.SubmitChanges();
                    return true;
                }
                // drop eport from database table
                return true;
            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
                return false;
            }
        }

        private string CleanString(string name)
        {
            try
            {
                return name.Replace("<", "").Replace(">", "").Replace("«", "").Replace("»", "").Trim();
            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
                return null;
            }
        }

        // find and return a user made report
        public ReportModel ReportLoad(string app, string template, string UserID, string name)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(app) || string.IsNullOrWhiteSpace(template) ||
                    string.IsNullOrWhiteSpace(name))
                    return new ReportModel() { Name = "بی نام" };
                name = CleanString(name);
                using (dbDataContext db = new dbDataContext())
                {
                    ReportMakerInfo r = GetReport(app, template, UserID, db, name.Replace('\n', '\0'));
                    if (r == null)
                        return new ReportModel() { Name = name };
                    ReportConnectionModel.Template tem = GetTemplate(app, template);
                    if (tem == null)
                        return new ReportModel() { Name = name };

                    XmlSerializer ser = new XmlSerializer(typeof(ReportModel));
                    StringBuilder sb = new StringBuilder();
                    TextReader tr = new StringReader(r.ReportContent.ToString());
                    ReportModel rp = (ReportModel)ser.Deserialize(tr);
                    rp = ValidateModel(rp, tem, false);
                    foreach (ReportModel.FilterColumn f in rp.Filters)
                        f.Title = tem.GetColumnByName(f.Name).Title;
                    // in case these two are different
                    rp.Name = name;
                    return rp;
                }
            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
                return new ReportModel();
            }

        }

        // returns a template's definition columns
        [ServiceKnownType(typeof(ReportBase.ReportModel.Column))]
        public List<ReportTemplateColumn> GetColumns(string app, string template, string UserID)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(app) || string.IsNullOrWhiteSpace(template))
                    return new List<ReportTemplateColumn>();

                ReportConnectionModel.Template tp = GetTemplate(app, template);

                if (tp == null)
                    return new List<ReportTemplateColumn>();

                return tp.Columns.Select(
                        r => new ReportTemplateColumn { Name = r.Name, Title = r.Title, Type = r.Type, Width = r.Width })?.ToList();
            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
                return new List<ReportTemplateColumn>();
            }
        }

        private ReportConnectionModel.Template GetTemplate(string app, string template)
        {
            ReportConnectionModel rcm = GetTemplates(app);
            if (rcm != null)
                return rcm.Templates.Where(r => r.Name == template).FirstOrDefault();
            return null;
        }


        private String GetLocalPath(string path = "/")
        {
            try
            {
                return HostingEnvironment.MapPath(path);
            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
                return null;
            }
        }

        // read template definitions and return list of app's  templates
        private ReportConnectionModel GetTemplates(String app)
        {
            ReportConnectionModel cm = null;
            if (string.IsNullOrEmpty(app))
                return cm;

            app = app.Replace(".", "_").Replace("\\", "_").Replace("/", "_");
            string rp_def_file = GetLocalPath(String.Format(@"~/Query/{0}.JSON", app));

            if (!File.Exists(rp_def_file))
                return null;

            if (!(HttpContext.Current.Cache[app] is ReportConnectionModel.Template[]))
            {
                cm = HttpContext.Current.Cache[rp_def_file] as ReportConnectionModel;
                if (cm == null) // why?
                {
                    try
                    {
                        var serializer = JsonSerializer.Create(new JsonSerializerSettings
                        {
                            Formatting = Newtonsoft.Json.Formatting.Indented,
                            NullValueHandling = NullValueHandling.Ignore,
                        }
                        );
                        JsonReader reader = new JsonTextReader(new StreamReader(rp_def_file));
                        cm = serializer.Deserialize<ReportConnectionModel>(reader);
                        reader.Close();
                        cm.Templates.ForEach(x => x.ConnectionName = cm.Name);

                        //put it into cache
                        HttpContext.Current.Cache.Insert(rp_def_file, cm, new CacheDependency(rp_def_file));
                    }
                    catch (Exception ex)
                    {
                        return null;
                    }
                }
            }
            return cm;
        }

        // generates an html report, used for debugging purposes
        private MemoryStream GetHtml(string app, string TemplateName, string UserID, ReportModel rep, int FromPage,
            int ToPage, int PageSize, bool includeStyle = false)
        {
            try
            {
                string xml = DataPage(app, TemplateName, UserID, rep, FromPage, ToPage, PageSize);
                if (xml == null)
                    return null;
                string xsl = XSLTranslator(app, TemplateName, rep, includeStyle);
                StringReader xsl_string_reader = new StringReader(xsl);
                XmlReader xsl_style_reader = new XmlTextReader(xsl_string_reader);

                StringReader xml_string_reader = new StringReader(xml);
                XmlReader xml_data_reader = new XmlTextReader(xml_string_reader);

                XslCompiledTransform xslt = new XslCompiledTransform();
                xslt.Load(xsl_style_reader);
                MemoryStream html_output_stream = new MemoryStream();
                XmlTextWriter xml_output_writer = new XmlTextWriter(html_output_stream, Encoding.UTF8);
                xslt.Transform(xml_data_reader, xml_output_writer);
                html_output_stream.Seek(0, SeekOrigin.Begin);
#if DEBUG
                FileStream fs = new FileStream(GetLocalPath("~/mydata.html"), FileMode.Create, FileAccess.Write);
                html_output_stream.WriteTo(fs);
                fs.Close();
#endif
                html_output_stream.Seek(0, SeekOrigin.Begin);
                return html_output_stream;
            }
            catch (Exception ex)
            {
                ///ExceptionPolicy.HandleException(ex, "General");
                return null;
            }

        }


        /*
                public byte[] Excel(string app, string TemplateName, string UserID, ReportModel rep, int FromPage, int ToPage,
             int PageSize)
                {
                    ExcelFile file;

                    SpreadsheetInfo.SetLicense("ETZW-AT28-33Q6-1HAS");
                    try
                    {
                        ReportConnectionModel.Template tem = GetTemplate(app, TemplateName);
                        rep = ValidateModel(rep, tem);
                        // can removeIInvalidCols the groups and aggregates and add the to columns, maintain order by groups and finally execute datapage or
                        // alternatively can execute datapage and translate resulting xml to the final stage 

                        Dictionary<string, ReportConnectionModel.Column> dic =
                             rep.Groupby.Where(r => !r.ISReportGroup).Select(r => tem.GetColumnByName(r.Name))
                             .Union(rep.Columns.Select(r => tem.GetColumnByName(r.Name))).ToDictionary(r => r.Name);

                        string data = DataPage(app, TemplateName, UserID, rep, FromPage, ToPage, PageSize);
                        if (data == null)
                            return null;
                        StringReader sr = new StringReader(data); // stream of  string data
                        XmlTextReader xDataReader = new XmlTextReader(sr);
                        XslCompiledTransform xslt = new XslCompiledTransform();
                        StringBuilder sb = new StringBuilder();
                        sb.Append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>")
                          .Append("<xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\">")
                          .Append("<xsl:report_def method=\"xml\" version=\"1.0\" encoding=\"UTF-8\" indent=\"yes\"/>")
                          .Append("<xsl:template match=\"_report\">")
                          .Append("<_report>")
                          .Append(" <xsl:apply-templates select=\"//_r\"/>")
                          .Append("</_report>")
                          .Append("</xsl:template>")
                          .Append("<xsl:template match=\"_r\">")
                          .Append("<_>");

                        for (int i = 1; i < rep.Groupby.Count; i++)
                        {
                            sb.AppendFormat("<{0}>", rep.Groupby[i].Name)
                              .AppendFormat("<xsl:value-of select=\"ancestor::{0}/@{0}\"/>", rep.Groupby[i].Name)
                              .AppendFormat("</{0}>", rep.Groupby[i].Name);
                        }
                        for (int i = 0; i < rep.Columns.Count; i++)
                        {
                            if (rep.Columns[i].MergeGroupPosition > 0)
                                continue;
                            sb.AppendFormat("<{0}>", rep.Columns[i].Name)
                              .AppendFormat("<xsl:value-of select=\"{0}\"/>", rep.Columns[i].Name)
                              .AppendFormat("</{0}>", rep.Columns[i].Name);
                        }
                        sb.Append("</_>");
                        sb.Append("</xsl:template>");
                        sb.Append("</xsl:stylesheet>");

        #if DEBUG
                        //File.WriteAllText(GetLocalPath("/excel.xslt"), sb.ToString());
        #endif
                        TextReader tr = new StringReader(sb.ToString());
                        XmlTextReader stylesheet_reader = new XmlTextReader(tr);
                        xslt.Load(stylesheet_reader);

                        Stream ms_out = new MemoryStream();
                        XmlTextWriter x_dataout = new XmlTextWriter(ms_out, Encoding.UTF8);
                        xslt.Transform(xDataReader, x_dataout);
                        ms_out.Seek(0, SeekOrigin.Begin);
                        file = new ExcelFile();
                        ExcelWorksheet sheet = file.Worksheets.Add(rep.Name);
                        sheet.DefaultColumnWidth = 300 * 20;
                        sheet.ViewOptions.ShowColumnsFromRightToLeft = true;

                        string[] cols = dic.Keys.ToArray();

                        CellRange cells = sheet.Cells;

                        int start_row = 0;
                        int data_col = 2;
                        int data_row = start_row + 2;

                        cells.GetSubrangeAbsolute(start_row, data_col, start_row, data_col + cols.Length - 1).Merged = true;
                        cells[start_row, data_col].Value = rep.Title;
                        cells[start_row, data_col].Style.Font.Name = rep.FontFace;
                        cells[start_row, data_col].Style.Font.Size = 22 * 20;
                        cells[start_row, data_col].Style.Font.Color = SpreadsheetColor.FromName(ColorName.DarkBlue);
                        cells[start_row, data_col].Style.Font.Weight = ExcelFont.BoldWeight;
                        cells[start_row, data_col].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                        cells[start_row, data_col].Row.Height = 26 * 20;

                        int row_count = 0;

                        using (XmlTextReader reader = new XmlTextReader(ms_out))
                        {
                            //  reader.MoveToContent();
                            int col = 0;
                            reader.MoveToContent();
                            while (reader.Read())
                            {
                                if (reader.NodeType != XmlNodeType.Element)
                                    continue;

                                //if (reader.Name == "_")
                                //{
                                //    // start of row? go increment counter and reset column no
                                //    col = 0;
                                //    row_count++;
                                //    continue;
                                //}

                                if (reader.Name == "_" || reader.Name == "_report")
                                    continue;

                                if (col % cols.Length == 0)
                                {
                                    // start of row? go increment counter and reset column no
                                    col = 0;
                                    row_count++;
                                }
                                col++;

                                if (reader.IsEmptyElement)
                                    continue;

                                reader.Read();
                                if (reader.NodeType == XmlNodeType.Text)
                                {
                                    cells[data_row + row_count - 1, data_col + col - 1].Value = reader.Value;

                                }

                            }
                        }

                        int mergeCol;
                        int merges_count = rep.Groupby.Count - 1; // excluding reportGroup


                        int[] MergeStarts = new int[merges_count]; // to columns merge
                        int[] MergeEnds = new int[merges_count];
                        string[] MergeValues = new string[merges_count];


                        Func<ExcelCell, string> toString = cell => cell.Value == null ? "" : cell.Value.ToString();


                        for (int i = 0; i < merges_count; i++)
                        {
                            MergeStarts[i] = data_row;
                            MergeValues[i] = toString(cells[data_row, data_col + i]);
                        }

                        for (int i = 0; i < row_count; i++)
                        {
                            mergeCol = 0;
                            while (mergeCol < merges_count)
                            {
                                if (toString(cells[data_row + i, data_col + mergeCol]) != MergeValues[mergeCol])
                                {
                                    for (int j = mergeCol; j < merges_count - 1; j++)
                                    {
                                        MergeEnds[j] = data_row + i - 1;
                                        CellRange range = sheet.Cells.GetSubrange(cells[MergeStarts[j], data_col + j].Name, cells[MergeEnds[j], data_col + j].Name);
                                        range.Merged = true;
                                        range.Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                                        MergeValues[j] = toString(cells[data_row + i, data_col + j]);
                                        MergeStarts[j] = data_row + i;
                                    }
                                    break;
                                }
                                mergeCol = mergeCol + 1;
                            }
                        }

                        for (int j = 0; j < merges_count - 1; j++)
                        {
                            CellRange range = sheet.Cells.GetSubrange(cells[MergeStarts[j], data_col + j].Name, cells[data_row + row_count - 1, data_col + j].Name);
                            range.Merged = true;
                            range.Style.VerticalAlignment = VerticalAlignmentStyle.Center;
                        }

                        CellRange rng = sheet.Cells.GetSubrange(
                                cells[start_row, data_col].Name,
                                cells[data_row + row_count - 1, data_col + cols.Length - 1].Name
                        );
                        rng.Style.Borders.SetBorders(GemBox.Spreadsheet.MultipleBorders.Outside | GemBox.Spreadsheet.MultipleBorders.Vertical, SpreadsheetColor.FromName(ColorName.DarkBlue), LineStyle.Dashed);

                        rng = sheet.Cells.GetSubrange(
                                cells[start_row + 1, data_col].Name,
                                cells[start_row + 1, data_col + cols.Length - 1].Name
                        );
                        rng.Style.Font.Name = rep.FontFace;
                        rng.Style.FillPattern.SetSolid(SpreadsheetColor.FromArgb(224, 224, 224));

                        rng = sheet.Cells.GetSubrange(
                        cells[data_row, data_col].Name,
                        cells[data_row + row_count - 1, data_col + cols.Length - 1].Name
                        );
                        rng.Style.FillPattern.SetSolid(SpreadsheetColor.FromArgb(240, 240, 240));

                        for (int i = 0; i < cols.Length; i++)
                        {
                            ReportConnectionModel.Column dc = dic[cols[i]];
                            cells[start_row + 1, data_col + i].Value = dc.Title;
                            cells[start_row + 1, data_col + i].Style.HorizontalAlignment = HorizontalAlignmentStyle.Center;
                            cells[start_row + 1, data_col + i].Style.Font.Weight = ExcelFont.BoldWeight;
                            cells[start_row + 1, data_col + i].Style.FillPattern.SetSolid(SpreadsheetColor.FromArgb(192, 192, 192));

                            if (dc.Width != 0)
                                sheet.Columns[data_col + i].Width = dc.Width * 300;

                            ReportModel.Column cc = rep.Columns.Where(r => r.Name == cols[i]).FirstOrDefault();
                            if (cc != null)
                            {
                                CellRange rng1 = cells.GetSubrange(cells[data_row, data_col + i].Name, cells[data_row + row_count - 1, data_col + i].Name);
                                if (cc.Type.ToLower() == "number")
                                    rng1.Style.NumberFormat = "@";

                                if (!string.IsNullOrWhiteSpace(cc.FontFace))
                                    rng1.Style.Font.Name = cc.FontFace;
                            }
                        }

                        MemoryStream report_def = new MemoryStream();
                        file.Save(report_def, GemBox.Spreadsheet.SaveOptions.XlsDefault);
                        return report_def.ToArray();
                    }
                    catch (Exception ex)
                    {
                        ExceptionPolicy.HandleException(ex, "General");
                    }
                    return new byte[0];
                }

                public byte[] Pdf(string app, string TemplateName, string UserID, ReportModel rep, int FromPage, int ToPage,
                    int PageSize)
                {
                    try
                    {
                        MemoryStream html_output_stream = GetHtml(app, TemplateName, UserID, rep, FromPage, ToPage, PageSize);
                        ComponentInfo.SetLicense("DTZX-HTZ5-B7Q6-2GA6");
                        DocumentModel doc = DocumentModel.Load(html_output_stream, GemBox.Document.LoadOptions.HtmlDefault);
                        FormatDocument(doc);

                        MemoryStream response = new MemoryStream();
                        doc.Save(response, GemBox.Document.PdfSaveOptions.PdfDefault);
                        return response.ToArray();
                    }
                    catch (Exception ex)
                    {
                        ExceptionPolicy.HandleException(ex, "General");
                    }
                    return new byte[0];
                }*/
        /*
                private void FormatDocument(DocumentModel doc)
                {
                    try
                    {
                        doc.DefaultCharacterFormat.RightToLeft = true;
                        doc.DefaultParagraphFormat.RightToLeft = true;
                        List<Element> list =
                            doc.Document.GetChildElements(true)
                                .Where(r => r.GetType().Equals(typeof(GemBox.Document.Tables.Table)))
                                .ToList();
                        if (list.Count > 0)
                            foreach (GemBox.Document.Tables.Table t in list)
                            {
                                t.TableFormat.PreferredWidth = new GemBox.Document.Tables.TableWidth(100,
                                    GemBox.Document.Tables.TableWidthUnit.Percentage);
                                t.TableFormat.Alignment = HorizontalAlignment.Right;
                            }
                    }
                    catch (Exception ex)
                    {
                        ExceptionPolicy.HandleException(ex, "General");
                    }
                }

                public byte[] Docx(string app, string TemplateName, string UserID, ReportModel rep, int FromPage, int ToPage,
                    int PageSize)
                {
                    try
                    {
                        MemoryStream html_output_stream = GetHtml(app, TemplateName, UserID, rep, FromPage, ToPage, PageSize,
                            true);
                        ComponentInfo.SetLicense("DTZX-HTZ5-B7Q6-2GA6");
                        DocumentModel doc = DocumentModel.Load(html_output_stream, GemBox.Document.LoadOptions.HtmlDefault);
                        FormatDocument(doc);
                        MemoryStream response = new MemoryStream();
                        doc.Save(response, GemBox.Document.SaveOptions.DocxDefault);
                        return response.ToArray();
                    }
                    catch (Exception ex)
                    {
                        ExceptionPolicy.HandleException(ex, "General");
                    }
                    return new byte[0];
                }
        */

        public String DataPage(string app, string TemplateName, string UserID, ReportModel rep, int FromPage, int ToPage,
            int PageSize)
        {
            //WebOperationContext.Current.OutgoingResponse.ContentType = "text/xml";
            DbCommand cmd = null;

            try
            {
                string emptyData = "<_report></_report>";

                if (string.IsNullOrWhiteSpace(app) || string.IsNullOrWhiteSpace(TemplateName) || rep == null)
                    return emptyData;

                ReportConnectionModel.Template tem = GetTemplate(app, TemplateName);

                if (tem == null)
                    return emptyData;

                rep = ValidateModel(rep, tem);
                if (rep.Columns.Count == 0 && rep.Groupby.Count == 0)
                    return emptyData;


                // extract sql data columns that should come into sql statement
                // extract grouped columns
                List<String> select = rep.Columns.Select(r => r.Name)
                                                   .Union(
                                                        rep.Groupby.Select(r => r.Name)
                                                    )
                                                   .Distinct()
                                                   .ToList();

                bool distinct = false;                //todo: this is a temporary hack
                if (rep.mergeIndex != null && (rep.mergeIndex + 1) >= rep.Columns.Count) // all column are in merge state
                    distinct = true;

                string distinctClause = distinct ? "distinct" : "";
                string orderbyColumns = string.Join(",", rep.Orderby.Select(o => $"[{o.Name}] {(o.Descending ? "desc" : "")}"));
                string selectClause = string.Join(",", select.Select(cName => $"{tem.GetColumnByName(cName).Expression ?? cName} as [{cName}]"));
                string orderbyClause = rep.Orderby.Count > 0 ? $"order by {orderbyColumns}" : "";
                string filterExpression = GetFilterExpr(rep, tem, out string filterDesc);
                string whereClause = rep.Filters.Count() > 0 || !string.IsNullOrWhiteSpace(filterExpression) ? $"where {filterExpression}" : "";
                // select {selected columns} from { * or column names} {where clause} {order by clause}                
                string statement = $"select {distinctClause} {selectClause} from ({tem.Command.SQL}) q {whereClause} {orderbyClause}";

                // groups and related aggregations, adding a group for report aggregations
                rep.Groupby.Insert(0, new ReportModel.Group { Name = DReportGroupName, ISReportGroup = true });

                //List<string> merged_column_names = rep
                //                                .Columns
                //                                .Where(r => r.MergeGroupPosition > 0)
                //                                .Select(r => r.Name).ToList();

                grpAggregate[] grp_ordinals =
                    (
                    from g in rep.Groupby
                    join ag in (
                                    from g in rep.Groupby
                                    from agr in rep.Aggregates
                                    where agr.positions.Any(r => r == g.Name)
                                    select new { g.Name, AggregateName = agr.Name, AggregateType = agr.Type }
                                ) on g.Name equals ag.Name into g_ag

                    select new grpAggregate
                    {
                        KeyName = g.Name,
                        Col = tem.GetColumnByName(g.Name),
                        IsReportGroup = g.ISReportGroup,
                        items = g_ag.Select(r => new AggregateItem { AggregateName = r.AggregateName, AggregateType = r.AggregateType }).ToArray()

                    }
                    )
                    .ToArray();

                for (int i = 0; i < grp_ordinals.Length; i++)
                    for (int j = 0; j < grp_ordinals[i].items.Length; j++)
                        grp_ordinals[i].items[j].MergingGroup = grp_ordinals
                            .Where(go => go.KeyName == grp_ordinals[i].items[j].AggregateName)
                            .FirstOrDefault();


                if (FromPage < 1)
                    FromPage = 1;

                if (ToPage < FromPage)
                    ToPage = FromPage;

                int from_page_recNo = PageSize * (FromPage - 1) + 1;
                int last_page_recNo = PageSize * (ToPage);
                int recNo = 1;

                // connect to database and extract the data
                // todo: attach to mdf or connect to an access file
                string connectionName = tem.ConnectionName;
                DbProviderFactory factory =
                    DbProviderFactories.GetFactory(ConfigurationManager.ConnectionStrings[connectionName].ProviderName);
                DbDataReader dr = null;
                using (cmd = factory.CreateCommand())
                {
                    cmd = factory.CreateCommand();
                    cmd.Connection = factory.CreateConnection();
                    cmd.Connection.ConnectionString = ConfigurationManager.ConnectionStrings[connectionName].ConnectionString;
                    cmd.CommandText = statement;
                    cmd.CommandType = CommandType.Text;
                    cmd.Connection.Open();
                    dr = cmd.ExecuteReader();

                    // get column ordinals from database
                    for (int i = 0; i < grp_ordinals.Length; i++)
                    {
                        if (!grp_ordinals[i].IsReportGroup)
                            grp_ordinals[i].KeyOrdinal = dr.GetOrdinal(grp_ordinals[i].KeyName);

                        for (int j = 0; j < grp_ordinals[i].items.Length; j++)
                            grp_ordinals[i].items[j].AggregateOrdinal = dr.GetOrdinal(grp_ordinals[i].items[j].AggregateName);
                    }

                    column[] col_ordinals =
                        select.Select(
                            name =>
                                new column
                                {
                                    Name = name,
                                    Ordinal = dr.GetOrdinal(name),
                                    Group = false,
                                    Column = tem.GetColumnByName(name)
                                }).ToArray();

                    foreach (var col in col_ordinals)
                    {
                        grpAggregate g = grp_ordinals.Where(grp => grp.KeyName == col.Name).FirstOrDefault();
                        if (g != null)
                            col.Group = true;
                    }



                    // write to memory as XML;
                    MemoryStream dataFile = new MemoryStream();
                    XmlWriterSettings xws = new XmlWriterSettings { Indent = true, Encoding = Encoding.UTF8 };

                    XmlWriter xtw = XmlTextWriter.Create(dataFile, xws);
                    xtw.WriteProcessingInstruction("xml", "version=\"1.0\" encoding=\"UTF-8\"");

                    // loop through records 
                    recNo = 0;
                    int written_record = 0;
                    void recordWriter()
                    {
                        xtw.WriteStartElement("_r");
                        written_record++;
                        if (rep.PrintRowNo)
                            xtw.WriteAttributeString("n", recNo.ToString());
                        for (int i = 0; i < col_ordinals.Length; i++)
                        {
                            if (!col_ordinals[i].Group)
                                xtw.WriteElementString(col_ordinals[i].Name, GetFormatattedString(dr.GetValue(col_ordinals[i].Ordinal), col_ordinals[i].Column));
                        }
                        xtw.WriteEndElement();
                    }

                    if (dr.Read())
                    {
                        RecordState state = RecordState.None;
                        while (!state.HasFlag(RecordState.DataSourceEnd) && !state.HasFlag(RecordState.Exception))
                        {
                            state = ProcessGroups(grp_ordinals.ToArray(), 0, xtw, dr, recordWriter, ref recNo, PageSize,
                                from_page_recNo, last_page_recNo, () => { });
                        }

                    }
                    if (written_record == 0)
                        xtw.WriteElementString(DReportGroupName, null);

                    dr.Close();
                    dr = null;
                    cmd.Connection.Close();
                    cmd.Connection = null;
                    xtw.Flush();
                    dataFile = new MemoryStream(dataFile.ToArray());
                    dataFile.Seek(0, SeekOrigin.Begin);
                    StreamReader sr = new StreamReader(dataFile);
                    string data = sr.ReadToEnd();
                    dataFile.Close();
                    sr.Close();
                    xtw.Close();
#if DEBUG
                    String localPath = GetLocalPath(@"~/mydata.xml");
                    File.WriteAllText(localPath, data);
#endif
                    return data;
                }
            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
                //dr?.Close();
                cmd.Connection?.Close();

                return null;
            }

        }

        private string GetFormatattedString(object value, ReportConnectionModel.Column col)
        {
            try
            {
                if (value == DBNull.Value || value == null)
                    return null;

                if (col == null) // _report
                    return value.ToString();

                if (!string.IsNullOrWhiteSpace(col.Format))
                    return string.Format(col.Format, value);
                switch (col.Type.ToLower())
                {
                    case "string":
                    case "url":

                        return value.ToString();

                    case "date":
                        if (value is DateTime time)
                        {
                            return time.ToString("yyyy/MM/dd");
                        }
                        return value.ToString();

                    case "time":
                        if (value is DateTime time1)
                        {
                            return time1.ToString("HH:mm");
                        }

                        return value.ToString();
                    case "datetime":
                        if (value is DateTime time2)
                        {
                            return time2.ToString("yyyy/MM/dd HH:mm");
                        }
                        return value.ToString();

                    case "shamsidatetime":
                        if (value is DateTime time3)
                        {
                            return new FSP.ShamsiDate(time3).ToLongDateString;
                        }

                        return value.ToString();

                    case "shamsidate":
                        if (value is DateTime time4)
                        {
                            return new FSP.ShamsiDate(time4).ToString();
                        }
                        return value.ToString();
                    case "shamsistring":
                        return value.ToString();

                    default:
                        return value.ToString();
                }
            }
            catch (Exception ex)
            {

                //ExceptionPolicy.HandleException(ex, "General");
                return null;
            }

        }

        private string CleanOperands(string operand)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(operand))
                    return null;
                return
                    operand.Replace(";", "")
                        .Replace("\"", "")
                        .Replace("'", "")
                        .Replace("[", "")
                        .Replace("]", "")
                        .Replace("\\", "");
            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
                return null;
            }

        }

        private bool IsNumeric(string s)
        {
            return s.Trim().All(c => char.IsDigit(c) || c == '.' || c == '-' || c == '+');
        }

        public string GetFilterExpr(ReportModel r, ReportConnectionModel.Template tem, out string description)
        {
            try
            {
                string expr = "";
                string filterRowDescription = "";

                string CheckAndFormatOperand(string op1, string colType)
                {
                    DateTime? date = null;
                    colType = colType.ToLower();
                    if (string.IsNullOrWhiteSpace(op1))
                        return null;

                    if (
                        (new string[] { "date", "datetime", "shamsidate", "time", "shamsistring" }).Any(
                            rec => rec == colType))
                    {

                        switch (op1)
                        {
                            case "اکنون":
                                date = DateTime.Now;
                                break;
                            case "امروز":
                                date = DateTime.Now.Date;
                                break;

                            case "دیروز":
                                date = DateTime.Now.AddDays(-1).Date;
                                break;

                            case "فردا":
                                date = DateTime.Now.AddDays(1).Date;
                                break;

                            case "ماه پیش":
                                break;

                            case "این ماه":
                                break;

                            case "ماه آینده":
                                break;

                            case "پارسال":
                                break;

                            case "پیارسال":
                                break;

                            case "امسال":
                                break;

                            case "سال آینده":
                                break;
                            default:
                                break;
                        }
                    }
                    switch (colType)
                    {
                        case "shamsidate":
                            date = new FSP.ShamsiDate(op1).DateTime;
                            return "'" + date.Value.ToString("yyyy/MM/dd") + "'";

                        case "shamsistring":
                            //todo: check to see if op1 format is correct
                            return string.Format("'{0}'", op1);

                        case "date":
                        case "datetime":
                            DateTime myDate;
                            if (!DateTime.TryParse(op1, out myDate))
                                return null;
                            date = myDate;
                            return "'" + date.Value.ToString("yyyy/MM/dd") + "'";
                        case "number":
                            return IsNumeric(op1) ? op1 : null;
                        case "string":
                        case "url":
                            return "N'" + op1.Trim() + "'";
                        default:
                            return null;
                    }
                }

                foreach (ReportModel.FilterColumn f in r.Filters)
                {


                    if (!string.IsNullOrWhiteSpace(filterRowDescription))
                        filterRowDescription += " و ";
                    ReportConnectionModel.Column col = tem.GetColumnByName(f.Name);

                    string col_expr = col.Expression;
                    f.Operand1 = CleanOperands(f.Operand1);
                    f.Operand2 = CleanOperands(f.Operand2);
                    if (col.Type == "Number")
                    {
                        if (f.Operand1 == null)
                            f.Operand1 = "0";

                        if (f.Operand2 == null)
                            f.Operand2 = "0";
                    }



                    switch (col.Type.ToLower())
                    {
                        case "shamsidate":
                        case "date":

                            col_expr = string.Format("CONVERT(VARCHAR(10), {0}, 111)", col_expr);
                            // in tr-sql converts date to yyyymmdd
                            break;

                        case "datetime":
                            col_expr =
                                string.Format(" Convert( varchar, {0}, 112) + ' '+ left( cast( ({0}) as time(0)),5) ",
                                    col_expr);
                            break;

                        case "time":
                            col_expr = string.Format("left( cast( ({0}) as time(0)),5) ", col_expr);
                            break;

                        case "string":
                        case "url":
                            col_expr = string.Format("{0}", col_expr);
                            break;

                        default:
                            col_expr = col.Expression;
                            break;
                    }
                    ;
                    
                    string filterRow = "";
                    string f_op1;
                    string f_op2;
                    switch (f.Operator)
                    {
                        case ">":
                        case "<":
                        case "=":
                        case "<=":
                        case ">=":
                            f_op1 = CheckAndFormatOperand(f.Operand1, col.Type);
                            if (string.IsNullOrWhiteSpace(f_op1))
                                continue;
                            filterRow = string.Format(" {0}  {1} {2}", col_expr, f.Operator, f_op1);
                            filterRowDescription += string.Format("«{0}» {1} {2}", col.Title, OpName(f.Operator),
                                f.Operand1);
                            break;

                        case "()": // between
                            f_op1 = CheckAndFormatOperand(f.Operand1, col.Type);
                            f_op2 = CheckAndFormatOperand(f.Operand2, col.Type);

                            if (string.IsNullOrWhiteSpace(f_op1) || string.IsNullOrWhiteSpace(f_op2))
                                continue;
                            f_op1.Replace("N'", "").Replace("'", "");
                            f_op2.Replace("N'", "").Replace("'", "");
                            filterRow = string.Format(" {0}  {1} {2} {4} {3}", col.Expression, "between", f_op1, f_op2,
                                "and");
                            filterRowDescription += string.Format("«{0}» {1} {2} {4} {3}", col.Title, OpName(f.Operator),
                                f.Operand1, f.Operand2, "و");
                            break;

                        case "(,)": // in list
                            // this has apparent errors for numbers and strings both
                            if (f.Operand1 == null)
                                continue;

                            string[] values = f.Operand1.Split(',');
                            if (values.Length == 0)
                                continue;

                            f_op1 = "";
                            string operandf = "";
                            for (int i = 0; i < values.Length; i++)
                            {
                                if (!string.IsNullOrEmpty(f_op1))
                                {
                                    f_op1 += " , ";
                                    operandf += " و ";
                                }
                                string op = CheckAndFormatOperand(values[i], col.Type);
                                f_op1 += op;
                                operandf += op;
                            }
                            filterRow = string.Format(" {0}  {1} ({2})", col.Expression, "in", f_op1);
                            filterRowDescription += string.Format("«{0}» {1} ({2})", col.Title, "در فهرست",
                                operandf.Replace("N'", "'"));
                            break;

                        case "~": // contains
                            f_op1 = CheckAndFormatOperand(f.Operand1, col.Type);
                            if (f_op1 == null)
                                continue;
                            f_op1 = f_op1.Replace("N'", "").Replace("'", "");
                            filterRow = string.Format(" {0} like N'%{1}%'", col_expr, f_op1);
                            filterRowDescription += string.Format("«{0}» {1}  ”{2}“ ", col.Title, "دربرگیرنده",
                                f.Operand1);
                            break;

                        case ")": // ends with 
                            f_op1 = CheckAndFormatOperand(f.Operand1, col.Type);
                            if (f_op1 == null)
                                continue;
                            f_op1 = f_op1.Replace("N'", "").Replace("'", "");
                            filterRow = string.Format(" {0} like N'%{1}'", col_expr, f_op1);
                            filterRowDescription += string.Format("«{0}» {1} '...{2}'", col.Title,
                                f.Operand1.Replace("N'", "'"), "مانند");
                            break;

                        case "(": // starts with
                            f_op1 = CheckAndFormatOperand(f.Operand1, col.Type);
                            if (f_op1 == null)
                                continue;
                            f_op1 = f_op1.Replace("N'", "").Replace("'", "");
                            filterRow = string.Format("{0} like N'{1}%'", col_expr, f_op1);
                            filterRowDescription += string.Format("«{0}» {1} ”{2}...“", col.Title, "مانند ", f.Operand1);
                            break;

                        case "n": // null
                            filterRow = String.Format("{0} is null", col_expr);
                            filterRowDescription += String.Format("«{0}» خالی ", col.Title);
                            break;
                        default:
                            continue;
                    }
                    if (!string.IsNullOrWhiteSpace(expr))
                        expr += " and ";
                    expr += string.Format(" {0}({1})", f.Negate ? "not" : "", filterRow);
                    filterRowDescription += f.Negate ? "  .نباشد  " : " .باشد  ";
                }

                description = filterRowDescription;
                return expr;
            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
                description = null;
                return null;
            }
        }

        private string OpName(string op)
        {
            switch (op)
            {
                case ">":
                    return "بزرگتر از";
                case "<":
                    return "کوچکتراز ";
                case "=":
                    return "برابر با";
                case "<=":
                    return "کوچکتر یا برابر با";
                case ">=":
                    return "بزرگتر یا برابر با";
                case "()":
                    return " بین دو مقدار ";
            }
            return "";

        }

        private enum RecordScope
        {
            BeforePage = 0,
            PageStart = 1,
            InPage = 2,
            PageEnd = 4,
            AfterPage = 8
        }

        private enum RecordState
        {
            None = 0,
            RecordPrinted = 1,
            DataSourceEnd = 2,
            Exception = 4
        }

        private RecordState ProcessGroups(
                    grpAggregate[] groups, int index, XmlWriter xtw,
                    DbDataReader dr, Action writeRecord,
                    ref int recNo, int pageSize, int fromPageRecNo, int toPageRecNo, Action groupHeadTagWriter)
        {
            RecordState recordState;
            bool hasRecord = false;
            Action currTagWriter = null;
            grpAggregate g = null;
            //bool terminate = false;
            try
            {
                g = groups[index];
                g.Reset = false;
                if (g.IsReportGroup)
                    g.KeyValue = g.KeyName;
                else
                    g.KeyValue = dr.IsDBNull(g.KeyOrdinal)
                        ? null
                        : GetFormatattedString(dr.GetValue(g.KeyOrdinal), g.Col);

                currTagWriter = () =>
                {
                    groupHeadTagWriter();
                    xtw.WriteStartElement(g.KeyName.Trim());
                    if (g.Col != null)
                        xtw.WriteAttributeString(g.Col.Name, GetFormatattedString(g.KeyValue, g.Col));
                };

                recordState = RecordState.None;
                if (index < groups.Length - 1)
                {
                    while (true)
                    {
                        recordState |= ProcessGroups(groups, index + 1, xtw, dr, writeRecord, ref recNo, pageSize, fromPageRecNo, toPageRecNo, currTagWriter);
                        if (recordState.HasFlag(RecordState.Exception))
                            break;

                        if (recordState.HasFlag(RecordState.DataSourceEnd))
                            break;
                        else if (recordState.HasFlag(RecordState.RecordPrinted))
                            currTagWriter = () => { };

                        if (g.Reset)
                        {
                            hasRecord = true;
                            break;
                        }
                    }
                }

                else
                {
                    do
                    {
                        AggregateOnGroup(groups, dr);

                        if (g != null && g.Reset)
                        {
                            hasRecord = true;
                            break;
                        }
                        recNo++;
                        RecordScope pageScope;
                        if (recNo < fromPageRecNo)
                            pageScope = RecordScope.BeforePage;
                        else if (recNo > toPageRecNo)
                            pageScope = RecordScope.AfterPage;
                        else if (recNo % pageSize == 0)
                            pageScope = RecordScope.PageEnd | RecordScope.InPage;
                        else if (recNo % pageSize == 1)
                            pageScope = RecordScope.PageStart | RecordScope.InPage;
                        else
                            pageScope = RecordScope.InPage;

                        int pageNo = (recNo - 1) / pageSize + 1;
                        if (pageScope.HasFlag(RecordScope.InPage))
                        {
                            if (currTagWriter != null)
                            {
                                currTagWriter();
                                currTagWriter = null;
                            }
                            if (pageScope.HasFlag(RecordScope.PageStart))
                                xtw.WriteElementString("_ps", pageNo.ToString());
                            writeRecord();
                            recordState |= RecordState.RecordPrinted;
                            if (pageScope.HasFlag(RecordScope.PageEnd))
                                xtw.WriteElementString("_pe", pageNo.ToString());

                        }
                        else if (pageScope == RecordScope.AfterPage)
                        {
                            // if there is not any open groups but _report
                            grpAggregate[] topperAggs =
                                groups.Where((r, ndx) => ndx <= index && r.items.Count() > 0).ToArray();
                            if (topperAggs.Length == 0) // if there is no aggregation on top groups
                                break;
                            if (topperAggs.All(r => r.Reset))
                                break;
                        }
                    } while (hasRecord = dr.Read());
                }
                if (!hasRecord)
                    recordState |= RecordState.DataSourceEnd;

                if (recordState.HasFlag(RecordState.RecordPrinted))
                {
                    // write group aggregations
                    List<string> grpAggList = g.items.Select(r => r.AggregateType).Distinct().ToList();
                    foreach (string aggrType in grpAggList)
                    {
                        List<AggregateItem> lst = g.items.Where(r => r.AggregateType == aggrType).ToList();
                        if (lst.Count() > 0)
                        {
                            // <sum> 
                            //  <field1>value</field1>
                            //  <field2>value</field2>
                            // </sum>
                            xtw.WriteStartElement(aggrType);
                            foreach (AggregateItem item in lst)
                            {
                                Number agrval = new Number(0);

                                if (g.Reset)
                                    agrval = item.LastValue;
                                else
                                    agrval = item.AggregateValue;

                                if (agrval != null)
                                    xtw.WriteElementString(item.AggregateName, agrval.Value.ToString());
                            }
                            xtw.WriteEndElement();
                        }
                    }
                    int count = 0;
                    if (g.Reset)
                        count = g.LastRowCount;
                    else
                        count = g.RowCount;

                    xtw.WriteElementString("_c", count.ToString());
                    xtw.WriteEndElement(); // group end
                }

                return recordState;
            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
                return RecordState.Exception;
            }
        }

        private void AggregateOnGroup(grpAggregate[] groups, IDataReader dr)
        {
            try
            {
                for (int i = 0; i < groups.Count(); i++)
                {
                    grpAggregate g = groups[i];
                    // agrregation resets when groups change
                    String kValue;
                    if (!g.IsReportGroup)
                        kValue = dr.IsDBNull(g.KeyOrdinal)
                            ? null
                            : GetFormatattedString(dr.GetValue(g.KeyOrdinal), g.Col);
                    else
                        kValue = g.KeyName;

                    if (g.KeyValue != kValue)
                    {
                        for (int j = i; j < groups.Count(); j++)
                        {
                            groups[j].Reset = true;
                            groups[j].RowCount = 0;
                            for (int k = 0; k < groups[j].items.Count(); k++)
                            {
                                AggregateItem agi = groups[j].items[k];
                                agi.LastValue = groups[j].items[k].AggregateValue;
                                agi.AggregateValue = 0;
                            }
                        }
                        // since this procedure will be reexecuted on the current record
                        return;
                    }
                }
                for (int i = 0; i < groups.Count(); i++)
                {
                    grpAggregate g = groups[i];
                    g.RowCount++;
                    // for each group, calculate group aggregates ( sun, min, ... )
                    for (int k = 0; k < g.items.Count(); k++)
                    {
                        AggregateItem agi = g.items[k];
                        if (agi.MergingGroup != null)
                            if (agi.MergingGroup.RowCount != 0)
                                continue;
                        Type _type = dr.GetFieldType(agi.AggregateOrdinal);
                        if (!Number.IsNumericType(_type))
                            continue;

                        switch (agi.AggregateType.ToLower())
                        {
                            case "sum":
                                agi.AggregateValue = new Number(_type, dr.GetValue(agi.AggregateOrdinal)) +
                                                     new Number(agi.AggregateValue);
                                break;
                            case "count":
                                if (agi.AggregateValue == null)
                                    agi.AggregateValue = 1;
                                else
                                    agi.AggregateValue = agi.AggregateValue + 1;
                                break;
                            case "min":

                                break;
                            case "max":
                                break;
                        }
                    }
                }
            }
            catch (Exception ex)
            {

                //ExceptionPolicy.HandleException(ex, "General");
            }


        }

        public string XSLTranslator(string app, string template, ReportModel report, bool includeStyle = false)
        {

            if (string.IsNullOrWhiteSpace(app) || string.IsNullOrWhiteSpace(template))
                return null;
            if (report == null)
                return null;

            String localPath = GetLocalPath("~/");
            XslCompiledTransform xslt;

            string genXsl = HttpContext.Current.Cache["xsl"] as string;
            xslt = (XslCompiledTransform)HttpContext.Current.Cache["xslCompiled"];
            XmlTextReader xr = null;
            if (String.IsNullOrEmpty(genXsl) || xslt == null)
            {
                genXsl = GetFile("Generator.xslt");
                xslt = new XslCompiledTransform();
                xr = new XmlTextReader(new StringReader(genXsl));
                xslt.Load(xr);
                xr.Close();
                HttpContext.Current.Cache["xslCompiled"] = xslt; ;
            }

            String xsl;
            ReportConnectionModel.Template tem = GetTemplate(app, template);
            if (tem == null)
                return "-1";
            report = ValidateModel(report, tem);

            string filter = GetFilterExpr(report, tem, out string filterDesc);
            report.SubTitle = filterDesc;

            MemoryStream ms_report = new MemoryStream();
            XmlWriter xw = new XmlTextWriter(ms_report, Encoding.UTF8);
            XmlSerializer ser = new XmlSerializer(typeof(ReportModel));
            ser.Serialize(xw, report);
            xw.Flush();
#if DEBUG
            // dump ms_report
            FileStream fs = new FileStream(localPath + "myreport.xml", FileMode.Create, FileAccess.Write);
            ms_report.WriteTo(fs);
            xw.Close(); // closes ms_report too
            fs.Close();
            ms_report = new MemoryStream(ms_report.ToArray());
#else
            ms_report.Seek(0, SeekOrigin.Begin);
#endif
            try
            {
                xr = new XmlTextReader(ms_report);
                using (MemoryStream ms_transform = new MemoryStream())
                {
                    XsltArgumentList argList = new XsltArgumentList();

                    if (includeStyle)
                    {
                        StreamReader sr = new StreamReader(GetLocalPath("~/Scripts/rpReport.css"));
                        argList.AddParam("style", "", sr.ReadToEnd());
                        sr.Close();
                    }
                    xslt.Transform(xr, argList, ms_transform);
                    ms_transform.Seek(0, SeekOrigin.Begin);
                    TextReader tr = new StreamReader(ms_transform);
                    xsl = tr.ReadToEnd();
                    tr.Close();
                    tr.Dispose();
                    ms_transform.Close();
                }
            }
            catch (Exception ex)
            {
                //ExceptionPolicy.HandleException(ex, "General");
                return "-2";
            }
#if DEBUG
            File.WriteAllText(localPath + @"\myData.xsl", xsl);
#endif
            return xsl.Replace("\n", "").Replace("\r", "").Replace("\t", " ").Replace("  ", " ");
        }
        public ReportModel ValidateModel(ReportModel rep, ReportConnectionModel.Template tmpl, bool modify = true)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(rep.Name))
                    rep.Name = "گزارش جدید";

                // افزودن ستونهایی که در همردیف کردن آمده اند به گروه بندی
                if (modify)
                    if (rep.mergeIndex != null)
                        if (rep.mergeIndex > -1)
                            for (int i = 0; i < rep.mergeIndex + 1 && i < rep.Columns.Count; i++)
                                if (rep.Groupby.Where(g => g.Name == rep.Columns[i].Name).FirstOrDefault() == null)
                                    rep.Groupby.Add(new ReportModel.Group { GroupMerge = true, Name = rep.Columns[i].Name, Title = rep.Columns[i].Title });

                // removeIInvalidCols invalid columns from the model
                void removeIInvalidCols<T>(List<T> list, Func<T, string> getKey)
                {
                    for (int i = list.Count - 1; i >= 0; i--)
                        if (tmpl.GetColumnByName(getKey(list[i])) == null)
                            list.RemoveAt(i);
                }

                removeIInvalidCols(rep.Columns, c => c.Name);
                removeIInvalidCols(rep.Orderby, o => o.Name);
                removeIInvalidCols(rep.Groupby, g => g.Name);
                removeIInvalidCols(rep.Aggregates, a => a.Name);
                removeIInvalidCols(rep.Filters, f => f.Name);

                // remove duplicates
                void removeDuplicates<T>(List<T> list, Func<T, string> getKey)
                {
                    Predicate<ReportBase.ReportModel.Column> match = c => true;
                    for (int i = 0; i < list.Count; i++)
                    {
                        var name = getKey(list[i]);
                        while (true)
                        {
                            int index = list.FindIndex(i + 1, c => getKey(c) == name);
                            if (index < 0)
                                break;
                            list.RemoveAt(index);
                        }
                    }
                }
                removeDuplicates(rep.Columns, c => c.Name);
                removeDuplicates(rep.Orderby, c => c.Name);
                removeDuplicates(rep.Groupby, c => c.Name);


                foreach (ReportModel.Column c in rep.Columns)
                {
                    ReportConnectionModel.Column col = tmpl.GetColumnByName(c.Name);
                    c.Type = col.Type;
                    if (c.Title == null)
                        c.Title = col.Title;
                }
                for (int i = rep.Aggregates.Count - 1; i >= 0; i--)
                {
                    ReportModel.Aggregate ag = rep.Aggregates[i];
                    if (ag.positions == null)
                        ag.positions = new string[] { DReportGroupName }.ToList();
                    List<string> positions = ag.positions.Where(p => p == DReportGroupName || p == "_page").ToList();

                    removeIInvalidCols<string>(ag.positions, p => p);
                    ag.positions.AddRange(positions);

                    if (ag.positions.Count == 0)
                        ag.positions.Add("report");
                }

                // هر چیزی که در گروه است بایستی حتما در ابتدای ترتیب ها باشد
                List<ReportBase.ReportModel.Order> orderList = new List<ReportBase.ReportModel.Order>();
                for (int i = 0; i < rep.Groupby.Count; i++)
                {
                    ReportBase.ReportModel.Group g = rep.Groupby[i];
                    if (g.Name == DReportGroupName)
                        continue;
                    ReportBase.ReportModel.Order order = rep.Orderby.Where(o => o.Name == g.Name).FirstOrDefault();
                    if (order != null)
                        rep.Orderby.Remove(order);
                    orderList.Add(new ReportModel.Order { Name = g.Name, Descending = false });
                }
                orderList.AddRange(rep.Orderby.ToList());
                rep.Orderby.Clear();
                rep.Orderby.AddRange(orderList);
                // هر چیزی که در گروه ها است بایستی از ستونهای انتخابی در آید
                for (int i = rep.Groupby.Count - 1; i >= 0; i--)
                {
                    ReportBase.ReportModel.Group g = rep.Groupby[i];
                    if (string.IsNullOrEmpty(g.Title))
                        g.Title = tmpl.Columns.Where(r => r.Name == g.Name).First().Title;

                    ReportBase.ReportModel.Column col = rep.Columns.Where(c => c.Name == g.Name).FirstOrDefault();
                    if (col != null)
                    {
                        if (modify)
                            col.MergeGroupPosition = rep.Groupby.Count - i;
                        // به غیر از ستونهایی همردیف شده
                        if (g.GroupMerge)
                            continue;

                        if (!string.IsNullOrEmpty(col.Title))
                            g.Title = col.Title;
                        rep.Columns.Remove(col);
                    }
                }
                return rep;
            }

            catch (Exception ex)
            {

                //ExceptionPolicy.HandleException(ex, "General");
                return new ReportModel();
            }

        }

#if DEBUG
        // utility function
        private string ConvertImageToBase64String(string imageUrl)
        {
            string imagepath = GetLocalPath(imageUrl);
            string fileType = Path.GetExtension(imageUrl).Replace(".", "");
            try
            {
                using (Image image = Image.FromFile(imagepath))
                {
                    using (MemoryStream memoryStream = new MemoryStream())
                    {
                        // Convert Image to byte[]
                        image.Save(memoryStream, image.RawFormat);
                        byte[] imageBytes = memoryStream.ToArray();

                        // Convert byte[] to Base64 String
                        string base64String = Convert.ToBase64String(imageBytes);
                        return string.Format("data:image/{0};base64,{1}", fileType, base64String);
                    }
                }
            }
            catch { return ""; }
        }
#endif
        private string GetFile(string name)
        {
            try
            {
                string content = (string)HttpContext.Current.Cache[name];
                if (HttpContext.Current.Cache[name] == null)
                {
                    string path = GetLocalPath($"~/Scripts/{name}");
                    content = File.ReadAllText(path);
                    HttpContext.Current.Cache.Insert(name, content, new CacheDependency(path));
                }
                return content;
            }
            catch (Exception ex)
            {
                //                ExceptionPolicy.HandleException(ex, "General");
                return null;
            }

        }
    }

}