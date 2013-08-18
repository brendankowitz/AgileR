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

        [HttpGet]
        public Board Board(int id)
        {
            return _context.Set<Board>()
                .Include(x => x.Columns)
                .Include("Columns.Tasks")
                .Single(x => x.Id == id);
        }

        [HttpPost]
        public Board Create(Board board)
        {
            _context.Set<Board>()
                .Add(board);
            _context.Save();
            return board;
        }

        [HttpPost, ActionName("CreateColumn")]
        public Column Create(int boardId, Column column)
        {
            var board = _context.Set<Board>().Single(x => x.Id == boardId);
            board.Columns.Add(column);
            _context.Save();
            return column;
        }

        [HttpPost, ActionName("CreateTask")]
        public Task Create(int columnId, Task task)
        {
            var column = _context.Set<Column>().Single(x => x.Id == columnId);
            column.Tasks.Add(task);
            _context.Save();
            return task;
        }

        [HttpPut]
        public Board Update(Board update)
        {
            var entity = _context.Set<Board>().Single(x => x.Id == update.Id);
            entity.Title = update.Title;
            _context.Save();
            return update;
        }

        [HttpPut, ActionName("UpdateColumn")]
        public Column Update(Column update)
        {
            var entity = _context.Set<Column>().Single(x => x.Id == update.Id);
            entity.Title = update.Title;
            entity.Index = update.Index;
            _context.Save();
            return entity;
        }

        [HttpPut, ActionName("UpdateTask")]
        public Task Update(Task update)
        {
            var entity = _context.Set<Task>().Single(x => x.Id == update.Id);
            entity.Title = update.Title;
            entity.Description = update.Description;
            entity.Index = update.Index;
            _context.Save();
            return entity;
        }
    }
}