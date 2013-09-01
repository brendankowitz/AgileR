using AgileR.Core.Entities;
using Microsoft.AspNet.SignalR;

namespace AgileR.Web.Intrastructure.Signaling
{
    public class TaskBoardHub : Hub
    {
        public void BoardAdded(Board board)
        {
            Clients.Others.BoardAdded(board);
        }

        public void ColumnAdded(int boardId, Column column)
        {
            Clients.Others.ColumnAdded(boardId, column);
        }

        public void TaskAdded(int columnId, Task taskAdded)
        {
            Clients.Others.TaskAdded(columnId, taskAdded);
        }

        public void TaskMoving(int taskId, int x, int y)
        {
            Clients.Others.TaskMoving(taskId, x, y);
        }

        public void TaskMoved(int toColumnId, int taskId)
        {
            Clients.Others.TaskMoved(toColumnId, taskId);
        }

        public void TaskRemoved(int taskId)
        {
            Clients.Others.TaskRemoved(taskId);
        }

        public void ColumnPropertyModified(int columnId, string propertyName, string val)
        {
            Clients.Others.ColumnPropertyModified(columnId, ToPascalCase(propertyName), val);
        }

        public void TaskPropertyModified(int taskId, string propertyName, string val)
        {
            Clients.Others.TaskPropertyModified(taskId, ToPascalCase(propertyName), val);
        }

        public void BoardPropertyModified(int boardId, string propertyName, string val)
        {
            Clients.Others.BoardPropertyModified(boardId, ToPascalCase(propertyName), val);
        }

        private static string ToPascalCase(string propertyName)
        {
            return string.Format("{0}{1}", propertyName.Substring(0, 1).ToLower(), propertyName.Substring(1));
        }
    }
}