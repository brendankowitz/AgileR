using System.Collections.Generic;

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
        public virtual Board Board { get; set; }
    }
}