using Newtonsoft.Json;
using System.Xml.Serialization;

namespace ReportBase
{

    [XmlType(TypeName = "col")]
    public class ReportTemplateColumn : AbsReportTemplateColumn
    {
    }
    public abstract class AbsReportTemplateColumn
    {
        [XmlElement(ElementName = "name")]
        [JsonProperty("name")]
        public string Name { get; set; }

        [XmlElement(ElementName = "title")]
        [JsonProperty("title")]
        public string Title { get; set; }

        [XmlElement(ElementName = "type")]
        [JsonProperty("type")]
        public string Type { get; set; }

        [XmlElement(ElementName = "width")]
        [JsonProperty("width")]
        public int Width { get; set; }
    }
}
