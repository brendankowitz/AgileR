using AgileR.Web.Intrastructure.Entities;
using Microsoft.AspNet.SignalR;

namespace AgileR.Web.Intrastructure.Signaling
{
    public class TaskBoardHub : Hub
    {
        public void BoardAdded(Board board)
        {
            Clients.AllExcept(Context.ConnectionId).BoardAdded(board);
        }

        public void ColumnAdded(int boardId, Column column)
        {
            Clients.AllExcept(Context.ConnectionId).ColumnAdded(boardId, column);
        }

        public void TaskAdded(int columnId, Task taskAdded)
        {
            Clients.AllExcept(Context.ConnectionId).TaskAdded(columnId, taskAdded);
        }

        public void TaskMoving(int taskId, int x, int y)
        {
            Clients.AllExcept(Context.ConnectionId).TaskMoving(taskId, x, y);
        }

        public void TaskMoved(int toColumnId, int taskId)
        {
            Clients.AllExcept(Context.ConnectionId).TaskMoved(toColumnId, taskId);
        }

        public void ColumnPropertyModified(int columnId, string propertyName, string val)
        {
            Clients.AllExcept(Context.ConnectionId).ColumnPropertyModified(columnId, ToPascalCase(propertyName), val);
        }

        public void TaskPropertyModified(int taskId, string propertyName, string val)
        {
            Clients.AllExcept(Context.ConnectionId).TaskPropertyModified(taskId, ToPascalCase(propertyName), val);
        }

        public void BoardPropertyModified(int boardId, string propertyName, string val)
        {
            Clients.AllExcept(Context.ConnectionId).BoardPropertyModified(boardId, ToPascalCase(propertyName), val);
        }

        private static string ToPascalCase(string propertyName)
        {
            return string.Format("{0}{1}", propertyName.Substring(0, 1).ToLower(), propertyName.Substring(1));
        }
    }
}