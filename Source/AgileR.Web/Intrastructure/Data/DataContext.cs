using System.Data;
using System.Data.Common;
using System.Data.Entity;
using AgileR.Core.Entities;

namespace AgileR.Web.Intrastructure.Data
{
    public class DataContext : DbContext, IDbContext
    {
        public DataContext(string nameOrConnectionString)
            : base(nameOrConnectionString)
        {
        }

        public DataContext()
            : this("DefaultConnection")
        {
            
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            var boardModel = modelBuilder.Entity<Board>();
            boardModel.HasKey(x => x.Id);
            boardModel.HasMany(x => x.Columns).WithRequired(x => x.Board);

            var columnModel = modelBuilder.Entity<Column>();
            columnModel.HasKey(x => x.Id);
            columnModel.HasMany(x => x.Tasks).WithRequired(x => x.Column);

            var taskModel = modelBuilder.Entity<Task>();
            taskModel.HasKey(x => x.Id);
            
            base.OnModelCreating(modelBuilder);
        }

        IDbSet<TEntity> IDbContext.Set<TEntity>()
        {
            return Set<TEntity>();
        }

        public void Save()
        {
            SaveChanges();
        }

        public IDbTransaction BeginTransaction()
        {
            return Database.Connection.BeginTransaction();
        }
    }
}