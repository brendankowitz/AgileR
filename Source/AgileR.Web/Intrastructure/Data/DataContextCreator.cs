using System.Data.Entity;

namespace AgileR.Web.Intrastructure.Data
{
    public class DataContextCreator : DropCreateDatabaseIfModelChanges<DataContext>
    {
        protected override void Seed(DataContext context)
        {
            
        }
    }
}