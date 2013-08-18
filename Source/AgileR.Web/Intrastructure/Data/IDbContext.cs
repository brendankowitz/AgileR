using System;
using System.Data;
using System.Data.Entity;

namespace AgileR.Web.Intrastructure.Data
{
    public interface IDbContext : IDisposable
    {
        IDbSet<TEntity> Set<TEntity>() where TEntity : class;
        void Save();
        IDbTransaction BeginTransaction();
    }
}