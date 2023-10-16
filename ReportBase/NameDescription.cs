using Newtonsoft.Json;

namespace ReportBase
{
    public class NameDescription
    {
        [JsonProperty("name")]
        public string Name { get; set; }
        [JsonProperty("title")]
        public string Description { get; set; }
        public string App { get; set; }
    }
}
