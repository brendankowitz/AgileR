using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using AgileR.Web.Intrastructure.Data;
using AgileR.Web.Intrastructure.Entities;

namespace AgileR.Web.Controllers
{
    public class BoardController : ApiController
    {
        private readonly IDbContext _context;

        public BoardController(IDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IEnumerable<Board> Boards()
        {
            return _context.Set<Board>()
                .Include(x => x.Columns)
                .Include("Columns.Tasks")
                .ToArray();
        }

        [HttpPost]
        public Board Create(Board board)
        {
            _context.Set<Board>()
                .Attach(board);
            _context.Save();
            return board;
        }

        [HttpPut]
        public Board Update(Board update)
        {
            _context.Set<Board>()
                .Attach(update);
            _context.Save();
            return update;
        }
    }
}