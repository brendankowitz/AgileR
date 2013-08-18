using Newtonsoft.Json;

namespace AgileR.Web.Intrastructure.Entities
{
    public class Task
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Index { get; set; }
        [JsonIgnore]
        public virtual Column Column { get; set; }
    }
}