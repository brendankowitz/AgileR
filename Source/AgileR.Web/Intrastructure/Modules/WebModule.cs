using System;
using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;

namespace AgileR.Web.Intrastructure.Modules
{
    public class WebModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterControllers(ThisAssembly);
            builder.RegisterApiControllers(ThisAssembly);

            builder.Register<Func<DateTime>>(x => () => DateTime.Now).As<Func<DateTime>>().SingleInstance();
        }
    }
}