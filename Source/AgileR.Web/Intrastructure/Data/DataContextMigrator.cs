using System.Data.Entity;
using System.Data.Entity.Migrations;

namespace AgileR.Web.Intrastructure.Data
{
    public class DataContextMigatorConfiguration : MigrateDatabaseToLatestVersion<DataContext, DataContextMigrator>
    {
    }

    public class DataContextMigrator : DbMigrationsConfiguration<DataContext>
    {
        public DataContextMigrator()
        {
            AutomaticMigrationDataLossAllowed = true;
            AutomaticMigrationsEnabled = true;
        }
    }
}