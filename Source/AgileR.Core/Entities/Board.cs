using System.Collections.Generic;

namespace AgileR.Core.Entities
{
    public class Board
    {
        public Board()
        {
            Columns = new List<Column>();
        }

        public int Id { get; set; }
        public string Slug { get; set; }
        public string Title { get; set; }
        public virtual IList<Column> Columns { get; set; }

    }
}