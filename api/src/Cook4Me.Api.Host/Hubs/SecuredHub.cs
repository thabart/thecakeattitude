#region copyright
// Copyright 2017 Habart Thierry
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//     http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
#endregion

using Cook4Me.Api.Host.Extensions;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.SignalR.Hubs;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Hubs
{
    [HubName("secured")]
    [Authorize]
    public class SecuredHub : Hub
    {
        public readonly static ConnectionMapping<string> Connections = new ConnectionMapping<string>();
        
        public override Task OnConnected()
        {
            var user = Context.User as ClaimsPrincipal;
            if (user == null)
            {
                return Task.FromResult(0);
            }

            var subject = user.GetSubject();
            if (string.IsNullOrWhiteSpace(subject))
            {
                return Task.FromResult(0);
            }

            Connections.Add(subject, Context.ConnectionId);
            return base.OnConnected();
        }

        public override Task OnDisconnected(bool stopCalled)
        {
            var user = Context.User as ClaimsPrincipal;
            if (user == null)
            {
                return Task.FromResult(0);
            }

            var subject = user.GetSubject();
            if (string.IsNullOrWhiteSpace(subject))
            {
                return Task.FromResult(0);
            }

            Connections.Remove(subject, Context.ConnectionId);
            return base.OnDisconnected(stopCalled);
        }

        public override Task OnReconnected()
        {
            var user = Context.User as ClaimsPrincipal;
            if (user == null)
            {
                return Task.FromResult(0);
            }

            var subject = user.GetSubject();
            if (!Connections.GetConnections(subject).Contains(Context.ConnectionId))
            {
                Connections.Add(subject, Context.ConnectionId);
            }

            return base.OnReconnected();
        }
    }
}
