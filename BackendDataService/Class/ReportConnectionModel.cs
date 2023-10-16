using Newtonsoft.Json;
using ReportBase;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Xml.Serialization;
[System.Xml.Serialization.XmlTypeAttribute(AnonymousType = true)]
[System.Xml.Serialization.XmlRootAttribute(Namespace = "", ElementName = "connection", IsNullable = false)]
public partial class ReportConnectionModel
{
    public ReportConnectionModel()
    {
    }
    [XmlElement(ElementName = "name")]
    public string Name { get; set; }

    [XmlArray(ElementName = "templates")]

    public List<Template> Templates { get; set; }

    [XmlType(TypeName = "template")]
    [JsonObject(MemberSerialization.OptOut)]

    public class Template
    {
        [XmlIgnore]
        [JsonIgnore]
        internal string ConnectionName { get; set; }

        [XmlElement(ElementName = "name")]
        public string Name { get; set; }

        [XmlIgnore]
        public string Title { get; set; }
        

        [XmlElement(ElementName = "command")]
        public Query Command { get; set; }

        [XmlArray(ElementName = "cols")]
        public List<Column> Columns { get; set; }
        private Dictionary<string, Column> ColumnsSet
        {
            get
            {
                if (_dict == null)
                {
                    _dict = new System.Collections.Generic.Dictionary<string, Column>();
                    foreach (Column c in Columns)
                        _dict.Add(c.Name.ToLower(), c);
                }
                return _dict;
            }
        }
        Dictionary<string, Column> _dict = null;
        public Column GetColumnByName(string name)
        {
            name = name.ToLower();
            if (ColumnsSet.ContainsKey(name))
                return ColumnsSet[name];
            return null;
        }
    }
    [XmlType(TypeName = "query")]
    public class Query
    {
        [XmlElement(ElementName = "sql")]
        public string SQL { get; set; }

        [XmlElement(ElementName = "type")]
        public string Type { get; set; }

        [XmlArray(ElementName = "parameters")]
        public List<ReportModel.Parameter> Parameters;

    }


    [DataContract(Name = "TemplateColumn")]
    [XmlType(TypeName = "col")]
    public partial class Column : AbsReportTemplateColumn
    {
        [JsonProperty("expr")]
        [XmlElement(ElementName = "expr")]
        public string Expression { get; set; }
        
        [XmlElement(ElementName = "format")]
        public string Format { get; set; }
    }

}
