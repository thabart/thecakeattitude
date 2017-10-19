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
using Cook4Me.Api.Core.Events.Product;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Hubs;

namespace Cook4Me.Api.Host.Handlers
{
    public class ProductEventsHandler : Handles<ProductCommentAddedEvent>, Handles<ProductCommentRemovedEvent>, Handles<ProductAddedEvent>, Handles<ProductUpdatedEvent>
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IResponseBuilder _responseBuilder;

        public ProductEventsHandler(IConnectionManager connectionManager, IResponseBuilder responseBuilder)
        {
            _connectionManager = connectionManager;
            _responseBuilder = responseBuilder;
        }

        public Task Handle(ProductAddedEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<Notifier>();
            notifier.Clients.All.productAdded(_responseBuilder.GetProductAddedEvent(message));
            return Task.FromResult(0);
        }

        public Task Handle(ProductUpdatedEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<Notifier>();
            notifier.Clients.All.productUpdated(_responseBuilder.GetProductUpdatedEvent(message));
            return Task.FromResult(0);
        }

        public Task Handle(ProductCommentAddedEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<Notifier>();
            notifier.Clients.All.productCommentAdded(_responseBuilder.GetProductCommentAddedEvent(message));
            return Task.FromResult(0);
        }

        public Task Handle(ProductCommentRemovedEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<Notifier>();
            notifier.Clients.All.productCommentRemoved(_responseBuilder.GetProductCommentRemovedEvent(message));
            return Task.FromResult(0);
        }
    }
}
