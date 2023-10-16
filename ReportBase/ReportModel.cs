using Newtonsoft.Json;
using System.Collections.Generic;
using System.Xml.Serialization;

// JsonPropery for serializing json input/output
// xmlattribute for serializing to/from data structures
// datamember for webservice output
namespace ReportBase
{
    [XmlRoot(ElementName = "report")]
    public class ReportModel
    {
        public ReportModel()
        {
            _columns = new List<Column>();
            _groupby = new List<Group>();
            _aggregates = new List<Aggregate>();
            _filters = new List<FilterColumn>();
            _orderby = new List<Order>();
            _parameters = new List<Parameter>();
        }

        [JsonProperty("name")]
        [XmlElement(ElementName = "name")]
        public string Name { get; set; }

        [JsonProperty("title")]
        [XmlElement(ElementName = "title")]

        public string Title { get; set; }

        [JsonProperty("subTitle")]
        [XmlElement(ElementName = "subTitle")]

        public string SubTitle { get; set; }

        [JsonProperty("pageSize")]
        [XmlElement(ElementName = "pageSize")]
        public string PageSize { get; set; }

        [JsonProperty("pageCount")]
        [XmlElement(ElementName = "pageCount")]
        public string PageCount { get; set; }

        [JsonProperty("currentPage")]
        [XmlElement(ElementName = "currentPage")]
        public string CurrentPage { get; set; }

        [JsonProperty("fontFace")]
        [XmlElement(ElementName = "fontFace")]
        public string FontFace { get { return _fontFace ?? "B Nazanin"; } set { _fontFace = value; } }
        string _fontFace;

        [XmlElement(ElementName = "fontSize")]
        [JsonProperty("fontSize")]
        public int FontSize { get { return font_size; } set { font_size = value % 3; } }
        int font_size = 0;

        [XmlElement(ElementName = "printRowNo")]
        [JsonProperty("printRowNo")]
        public bool PrintRowNo { get; set; }

        [XmlElement(ElementName = "mergeIndex")]
        [JsonProperty("mergeIndex")]
        public int? mergeIndex { get; set; }

        [XmlElement(ElementName = "printDate")]
        [JsonProperty("printDate")]
        public bool PrintDate { get; set; }

        [XmlElement(ElementName = "printUnderLine")]
        [JsonProperty("printUnderLine")]
        public bool PrintUnderLine { get; set; }

        [XmlArray(ElementName = "columns")]
        [JsonProperty("columns")]
        public List<Column> Columns { get { return _columns; } }
        private List<Column> _columns;

        [XmlArray(ElementName = "orderby")]
        [JsonProperty("orderby")]
        public List<Order> Orderby { get { return _orderby; } }
        List<Order> _orderby;

        [XmlArray(ElementName = "groupby")]
        [JsonProperty("groupby")]

        public List<Group> Groupby { get { return _groupby; } }
        private List<Group> _groupby;

        [XmlArray(ElementName = "aggregates")]
        [JsonProperty("aggregates")]
        public List<Aggregate> Aggregates { get { return _aggregates; } }
        List<Aggregate> _aggregates;

        [XmlArray(ElementName = "filters")]
        [JsonProperty("filters")]
        public List<FilterColumn> Filters { get { return _filters; } }
        List<FilterColumn> _filters;

        [XmlArray(ElementName = "parameters")]
        [JsonProperty("parameters")]
        public List<Parameter> Parameters { get { return _parameters; } }
        List<Parameter> _parameters;
        public class Parameter
        {
            [XmlElement(ElementName = "name")]
            [JsonProperty("name")]
            public string Name { get; set; }

            [XmlElement(ElementName = "inputType")]
            [JsonProperty("inputType")]
            public string inputType { get; set; }

            [XmlElement(ElementName = "prompt")]
            [JsonProperty("prompt")]
            public string prompt { get; set; }

            [XmlElement(ElementName = "value")]
            [JsonProperty("value")]
            public string Value { get; set; }

        }

        [XmlType(TypeName = "column")]
        [JsonObject(MemberSerialization.OptOut)]
        public class Column
        {
            [XmlElement(ElementName = "name")]
            [JsonProperty("name")]
            public string Name { get; set; }

            [XmlElement(ElementName = "type")]
            [JsonIgnore]
            public string Type { get; set; }

            [XmlElement(ElementName = "title")]
            [JsonProperty("title")]
            public string Title { get; set; }

            [XmlElement(ElementName = "displayOrder")]
            [JsonProperty("index")]
            public int DisplayOrder { get; set; }

            [JsonProperty("fontFace")]
            [XmlElement(ElementName = "fontFace")]
            public string FontFace { get; set; }

            [XmlElement(ElementName = "fontSize")]
            [JsonProperty("fontSize")]
            public int FontSize { get; set; }

            [XmlElement(ElementName = "alignment")]
            [JsonProperty("alignment")]
            public string Alignment { get; set; }

            [XmlElement(ElementName = "mergepos")]
            [JsonIgnore]
            public int MergeGroupPosition { get; set; }

        }

        [XmlType(TypeName = "order")]
        [JsonObject(MemberSerialization.OptOut)]
        public class Order
        {
            [JsonProperty("name")]
            public string Name { get; set; }

            [XmlElement(ElementName = "Descending")]
            [JsonProperty("descending")]
            public bool Descending { get; set; }
        }

        [XmlType(TypeName = "group")]
        [JsonObject(MemberSerialization.OptOut)]
        public class Group
        {
            [XmlElement(ElementName = "name")]
            [JsonProperty("name")]
            public string Name { get; set; }

            [XmlElement(ElementName = "title")]
            [JsonProperty("title")]
            public string Title { get; set; }

            [XmlElement(ElementName = "pageBreak")]
            [JsonProperty("pageBreak")]
            public bool PageBreak { get; set; }

            [XmlIgnore]
            [JsonIgnore]
            public bool ISReportGroup { get { return _isReportGroup; } set { _isReportGroup = value; } }
            bool _isReportGroup = false;

            [XmlElement(ElementName = "merge")]
            [JsonIgnore]
            public bool GroupMerge { get; set; }
        }

        [XmlType(TypeName = "aggregate")]
        [JsonObject(MemberSerialization.OptOut)]
        public class Aggregate
        {
            [JsonProperty("name")]
            [XmlElement(ElementName = "name")]
            public string Name { get; set; }

            [XmlElement(ElementName = "type")]
            [JsonProperty("type")]
            public string Type { get; set; }

            [XmlArrayItem(ElementName = "position")]
            [JsonProperty("positions")]
            public List<string> positions { get; set; }
        }
        public class FilterColumn
        {
            [JsonProperty("name")]
            [XmlElement(ElementName = "name")]
            public string Name { get; set; }

            [JsonProperty("title")]
            [XmlIgnore]
            public string Title { get; set; }

            [JsonProperty("operand1")]
            [XmlElement(ElementName = "operand1")]
            public string Operand1 { get; set; }

            [JsonProperty("operand2")]
            [XmlElement(ElementName = "operand2")]
            public string Operand2 { get; set; }

            [JsonProperty("operator")]
            [XmlElement(ElementName = "operator")]
            public string Operator { get; set; }

            [JsonProperty("negate")]
            [XmlElement(ElementName = "negate")]
            public bool Negate { get; set; }
        }
    }
}