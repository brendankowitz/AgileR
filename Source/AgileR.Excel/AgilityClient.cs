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

        public void Dispose()
        {
            if (_hubConnection != null)
                _hubConnection.Stop();
        }
    }
}