using Microsoft.AspNet.SignalR;

namespace AgileR.Web.Intrastructure.Signaling
{
    public class TaskBoardHubBroadcast
    {
        private readonly IHubContext _toartHubContext;

        public TaskBoardHubBroadcast(IHubContext toartHubContext)
        {
            _toartHubContext = toartHubContext;
        }

        
    }
}