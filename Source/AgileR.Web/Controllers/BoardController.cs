using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Web.Http;
using AgileR.Core.Entities;
using AgileR.Web.Intrastructure.Data;
using AgileR.Web.Models;
using Newtonsoft.Json;

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
        public AgileR.Core.Entities.Task Create(int columnId, AgileR.Core.Entities.Task task)
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

        [HttpPut, ActionName("UpdateColumnProperty")]
        public Column UpdateColumnProperty(int id, ModelPropertyUpdate update)
        {
            var entity = _context.Set<Column>().Single(x => x.Id == id);

            var type = typeof(Column).GetProperty(update.Property, BindingFlags.IgnoreCase | BindingFlags.Instance | BindingFlags.Public);
            type.SetValue(entity, Convert.ChangeType(update.NewValue, type.PropertyType));

            _context.Save();
            return entity;
        }

        [HttpPut, ActionName("UpdateTask")]
        public AgileR.Core.Entities.Task Update(AgileR.Core.Entities.Task update)
        {
            var entity = _context.Set<AgileR.Core.Entities.Task>().Single(x => x.Id == update.Id);
            entity.Title = update.Title;
            entity.Description = update.Description;
            entity.Index = update.Index;
            _context.Save();
            return entity;
        }
    }
}