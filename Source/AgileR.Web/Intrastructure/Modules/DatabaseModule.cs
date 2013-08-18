using System.Data.Entity;
using AgileR.Web.Intrastructure.Data;
using Autofac;
using Autofac.Integration.Mvc;

namespace AgileR.Web.Intrastructure.Modules
{
    public class DatabaseModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            Database.SetInitializer(new DataContextMigatorConfiguration());

            builder.RegisterType<DataContext>()
                .AsSelf()
                .As<IDbContext>()
                .WithParameter("nameOrConnectionString", "DefaultConnection")
                .InstancePerHttpRequest();

        }
    }
}