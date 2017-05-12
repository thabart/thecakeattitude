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

using Cook4Me.Api.Core.Bus;
using Cook4Me.Api.Core.Events.Service;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Hubs;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Handlers
{
    public class ServiceEventsHandler : Handles<ServiceCommentAddedEvent>, Handles<ServiceCommentRemovedEvent>
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IResponseBuilder _responseBuilder;

        public ServiceEventsHandler(IConnectionManager connectionManager, IResponseBuilder responseBuilder)
        {
            _connectionManager = connectionManager;
            _responseBuilder = responseBuilder;
        }

        public Task Handle(ServiceCommentRemovedEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<Notifier>();
            notifier.Clients.All.serviceCommentRemoved(_responseBuilder.GetServiceCommentRemovedEvent(message));
            return Task.FromResult(0);
        }

        public Task Handle(ServiceCommentAddedEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<Notifier>();
            notifier.Clients.All.serviceCommentAdded(_responseBuilder.GetServiceCommentAddedEvent(message));
            return Task.FromResult(0);
        }
    }
}
