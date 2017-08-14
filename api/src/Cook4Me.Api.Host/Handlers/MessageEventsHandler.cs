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

using System;
using System.Threading.Tasks;
using Cook4Me.Api.Core.Bus;
using Cook4Me.Api.Core.Events.Messages;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Hubs;
using System.Linq;
using System.Collections.Generic;

namespace Cook4Me.Api.Host.Handlers
{
    public class MessageEventsHandler : Handles<MessageAddedEvent>
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IResponseBuilder _responseBuilder;

        public MessageEventsHandler(IConnectionManager connectionManager, IResponseBuilder responseBuilder)
        {
            _connectionManager = connectionManager;
            _responseBuilder = responseBuilder;
        }

        public Task Handle(MessageAddedEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<SecuredHub>();
            var lst = new[] { message.To, message.From };
            lst.Distinct();
            var connectionIds = new List<string>();
            foreach (var r in lst)
            {
                connectionIds.AddRange(SecuredHub.Connections.GetConnections(r).ToList());
            }

            notifier.Clients.Clients(connectionIds).messageAdded(_responseBuilder.GetMessageAddedEvent(message));
            return Task.FromResult(0);
        }
    }
}
