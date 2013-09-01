using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using AgileR.Core.Entities;
using Microsoft.AspNet.SignalR.Client.Hubs;
using Task = System.Threading.Tasks.Task;
using System.Net;
using Newtonsoft.Json;

namespace AgileR.ExcelApp
{
    public class AgilityClient : IDisposable
    {
        readonly List<Action<int, string, string>> _columnPropertyModified = new List<Action<int, string, string>>();
        readonly List<Action<int, string, string>> _taskPropertyModified = new List<Action<int, string, string>>();
        readonly List<Action<int, int>> _taskMoved = new List<Action<int, int>>();

        private readonly HubConnection _hubConnection;
        private readonly IHubProxy _hubProxy;
        private readonly string _host;

        public AgilityClient(string host)
        {
            _host = host;
            _hubConnection = new HubConnection(_host);
            _hubProxy = _hubConnection.CreateHubProxy("TaskBoardHub");
        }

        public async Task Start()
        {
            _hubProxy.On<int, string, string>("ColumnPropertyModified", ColumnPropertyModified);
            _hubProxy.On<int, string, string>("TaskPropertyModified", TaskPropertyModified);
            _hubProxy.On<int, int>("TaskMoved", TaskMoved);

            await _hubConnection.Start();
        }

        public async Task<Board[]> Boards()
        {
            var request = (HttpWebRequest)WebRequest.Create(string.Format("{0}api/board/boards", _host));
            request.Accept = "application/json";

            using(var resp = await request.GetResponseAsync())
            using (var response = new StreamReader(resp.GetResponseStream()))
            {
                var content = await response.ReadToEndAsync();
                return await JsonConvert.DeserializeObjectAsync<Board[]>(content);
            }
        }

        private void ColumnPropertyModified(int columnId, string propertyId, string newValue)
        {
            _columnPropertyModified.ForEach(x => x(columnId, propertyId, newValue));
        }

        public void SendColumnPropertyModified(int columnId, string propertyName, string newValue)
        {
            _hubProxy.Invoke("ColumnPropertyModified", columnId, propertyName, newValue);
        }

        public void RegisterColumnPropertyModified(Action<int, string, string> action)
        {
            _columnPropertyModified.Add(action);
        }

        private void TaskPropertyModified(int columnId, string propertyId, string newValue)
        {
            _taskPropertyModified.ForEach(x => x(columnId, propertyId, newValue));
        }

        public void SendTaskPropertyModified(int columnId, string propertyName, string newValue)
        {
            _hubProxy.Invoke("TaskPropertyModified", columnId, propertyName, newValue);
        }

        public void RegisterTaskPropertyModified(Action<int, string, string> action)
        {
            _taskPropertyModified.Add(action);
        }

        private void TaskMoved(int taskId, int toColumnId)
        {
            _taskMoved.ForEach(x => x(taskId, toColumnId));
        }

        public void SendTaskPropertyModified(int taskId, int toColumnId)
        {
            _hubProxy.Invoke("TaskMoved", taskId, toColumnId);
        }

        public void RegisterTaskMoved(Action<int,int> action)
        {
            _taskMoved.Add(action);
        }

        public void Dispose()
        {
            if (_hubConnection != null)
                _hubConnection.Stop();
        }
    }
}