using System.Collections.Generic;
using Newtonsoft.Json;

namespace AgileR.Web.Intrastructure.Entities
{
    public class Column
    {
        public Column()
        {
            Tasks = new List<Task>();
        }

        public int Id { get; set; }
        public string Title { get; set; }
        public int Index { get; set; }
        public virtual IList<Task> Tasks { get; set; }
        [JsonIgnore]
        public virtual Board Board { get; set; }
    }
}