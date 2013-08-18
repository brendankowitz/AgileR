using System;
using System.IO;
using System.Reflection;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;

namespace AgileR.Web
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);

            var builder = new ContainerBuilder();
            builder.RegisterModule<AutofacWebTypesModule>();
            builder.RegisterAssemblyModules(Assembly.GetExecutingAssembly());
            var container = builder.Build();

            var autofacDependencyResolver = new AutofacDependencyResolver(container);
            DependencyResolver.SetResolver(autofacDependencyResolver);
            var resolver = new AutofacWebApiDependencyResolver(container);
            GlobalConfiguration.Configuration.DependencyResolver = resolver;

            GlobalConfiguration.Configuration.IncludeErrorDetailPolicy =
                IncludeErrorDetailPolicy.Always;

            // Uncomment the following line of code to enable query support for actions with an IQueryable or IQueryable<T> return type.
            // To avoid processing unexpected or malicious queries, use the validation settings on QueryableAttribute to validate incoming queries.
            // For more information, visit http://go.microsoft.com/fwlink/?LinkId=279712.
            GlobalConfiguration.Configuration.EnableQuerySupport();

            // To disable tracing in your application, please comment out or remove the following line of code
            // For more information, refer to: http://www.asp.net/web-api
            GlobalConfiguration.Configuration.EnableSystemDiagnosticsTracing();
        }

        public static DateTime LastModified
        {
            get
            {
                var webAssembly = Assembly.GetExecutingAssembly();
                var fileInfo = new FileInfo(webAssembly.Location);
                var utc = fileInfo.LastWriteTimeUtc;
                return new DateTime(utc.Year, utc.Month, utc.Day, utc.Hour, utc.Minute, utc.Second, 0, DateTimeKind.Utc);
            }
        }

        public static string Version
        {
            get
            {
                var webAssembly = Assembly.GetExecutingAssembly();
                var version = webAssembly.GetName().Version;
                return string.Format("{0}.{1}.{2}", version.Major, version.Minor, version.Revision);
            }
        }
    }
}