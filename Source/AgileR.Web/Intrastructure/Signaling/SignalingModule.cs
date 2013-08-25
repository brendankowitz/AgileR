using Autofac;
using Microsoft.AspNet.SignalR;

namespace AgileR.Web.Intrastructure.Signaling
{
    public class SignalingModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.Register(x => new TaskBoardHubBroadcast(GlobalHost.ConnectionManager.GetHubContext<TaskBoardHub>()))
                   .AsSelf()
                   .SingleInstance();
        }
    }
}