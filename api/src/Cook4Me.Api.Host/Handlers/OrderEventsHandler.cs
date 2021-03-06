﻿#region copyright
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
using Cook4Me.Api.Core.Events.Orders;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Hubs;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using Microsoft.EntityFrameworkCore.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Handlers
{
    public class OrderEventsHandler : Handles<OrderUpdatedEvent>, Handles<OrderRemovedEvent>, Handles<OrderAddedEvent>, Handles<OrderConfirmedEvent>, 
        Handles<OrderReceivedEvent>, Handles<OrderTransactionApprovedEvent>, Handles<OrderLabelPurchasedEvent>, Handles<OrderCanceledEvent>
    {
        private readonly IConnectionManager _connectionManager;
        private readonly IResponseBuilder _responseBuilder;

        public OrderEventsHandler(IConnectionManager connectionManager, IResponseBuilder responseBuilder)
        {
            _connectionManager = connectionManager;
            _responseBuilder = responseBuilder;
        }

        public Task Handle(OrderTransactionApprovedEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<SecuredHub>();
            var lst = new[] { message.Subject, message.SellerId };
            lst.Distinct();
            var connectionIds = new List<string>();
            foreach (var r in lst)
            {
                connectionIds.AddRange(SecuredHub.Connections.GetConnections(r).ToList());
            }

            notifier.Clients.Clients(connectionIds).orderTransactionApproved(_responseBuilder.GetOrderTransactionApproved(message));
            return Task.FromResult(0);
        }

        public Task Handle(OrderCanceledEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<SecuredHub>();
            var lst = new[] { message.SellerId, message.Subject };
            lst.Distinct();
            var connectionIds = new List<string>();
            foreach (var r in lst)
            {
                connectionIds.AddRange(SecuredHub.Connections.GetConnections(r).ToList());
            }

            notifier.Clients.Clients(connectionIds).orderCanceled(_responseBuilder.GetOrderCanceled(message));
            return Task.FromResult(0);
        }

        public Task Handle(OrderLabelPurchasedEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<SecuredHub>();
            var lst = new[] { message.Subject, message.SellerId };
            lst.Distinct();
            var connectionIds = new List<string>();
            foreach (var r in lst)
            {
                connectionIds.AddRange(SecuredHub.Connections.GetConnections(r).ToList());
            }

            notifier.Clients.Clients(connectionIds).orderLabelPurchased(_responseBuilder.GetOrderLabelPurchased(message));
            return Task.FromResult(0);
        }

        public Task Handle(OrderReceivedEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<SecuredHub>();
            var lst = new[] { message.Client, message.Seller };
            lst.Distinct();
            var connectionIds = new List<string>();
            foreach (var r in lst)
            {
                connectionIds.AddRange(SecuredHub.Connections.GetConnections(r).ToList());
            }

            notifier.Clients.Clients(connectionIds).orderReceived(_responseBuilder.GetOrderReceivedEvent(message));
            return Task.FromResult(0);
        }

        public Task Handle(OrderAddedEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<SecuredHub>();
            var lst = new[] { message.Subject };
            lst.Distinct();
            var connectionIds = new List<string>();
            foreach (var r in lst)
            {
                connectionIds.AddRange(SecuredHub.Connections.GetConnections(r).ToList());
            }

            notifier.Clients.Clients(connectionIds).orderAdded(_responseBuilder.GetOrderAddedEvent(message));
            return Task.FromResult(0);
        }

        public Task Handle(OrderConfirmedEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<SecuredHub>();
            var lst = new[] { message.Client };
            lst.Distinct();
            var connectionIds = new List<string>();
            foreach (var r in lst)
            {
                connectionIds.AddRange(SecuredHub.Connections.GetConnections(r).ToList());
            }

            notifier.Clients.Clients(connectionIds).orderConfirmed(_responseBuilder.GetOrderConfirmeddEvent(message));
            return Task.FromResult(0);
        }

        public Task Handle(OrderRemovedEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<SecuredHub>();
            var lst = new[] { message.Subject };
            lst.Distinct();
            var connectionIds = new List<string>();
            foreach (var r in lst)
            {
                connectionIds.AddRange(SecuredHub.Connections.GetConnections(r).ToList());
            }

            notifier.Clients.Clients(connectionIds).orderRemoved(_responseBuilder.GetOrderRemovedEvent(message));
            return Task.FromResult(0);
        }

        public Task Handle(OrderUpdatedEvent message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notifier = _connectionManager.GetHubContext<SecuredHub>();
            var lst = new[] { message.To };
            lst.Distinct();
            var connectionIds = new List<string>();
            foreach (var r in lst)
            {
                connectionIds.AddRange(SecuredHub.Connections.GetConnections(r).ToList());
            }

            notifier.Clients.Clients(connectionIds).orderUpdated(_responseBuilder.GetOrderUpdatedEvent(message));
            return Task.FromResult(0);
        }
    }
}
