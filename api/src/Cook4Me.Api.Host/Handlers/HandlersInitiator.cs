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
using Cook4Me.Api.Core.Events.ClientService;
using Cook4Me.Api.Core.Events.Messages;
using Cook4Me.Api.Core.Events.Notification;
using Cook4Me.Api.Core.Events.Orders;
using Cook4Me.Api.Core.Events.Product;
using Cook4Me.Api.Core.Events.Service;
using Cook4Me.Api.Core.Events.Shop;
using System;

namespace Cook4Me.Api.Host.Handlers
{
    public interface IHandlersInitiator
    {
        void Init();
    }

    public class HandlersInitiator : IHandlersInitiator
    {
        private static  bool _isInitiated = false;
        private static object obj = new Object();
        private readonly ShopEventsHandler _shopEventsHandler;
        private readonly ProductEventsHandler _productEventsHandler;
        private readonly ServiceEventsHandler _serviceEventsHandler;
        private readonly ClientServiceEventsHandler _clientServiceEventsHandler;
        private readonly NotificationEventsHandler _notificationEventsHandler;
        private readonly MessageEventsHandler _messageEventsHandler;
        private readonly OrderEventsHandler _orderEventsHandler;
        private readonly IBus _bus;

        public HandlersInitiator(ShopEventsHandler shopEventsHandler, ProductEventsHandler productEventsHandler, 
            ServiceEventsHandler serviceEventsHandler, ClientServiceEventsHandler clientServiceEventsHandlers,
            NotificationEventsHandler notificationEventsHandler, MessageEventsHandler messageEventsHandler,
            OrderEventsHandler orderEventsHandler, IBus bus)
        {
            _shopEventsHandler = shopEventsHandler;
            _productEventsHandler = productEventsHandler;
            _serviceEventsHandler = serviceEventsHandler;
            _clientServiceEventsHandler = clientServiceEventsHandlers;
            _notificationEventsHandler = notificationEventsHandler;
            _messageEventsHandler = messageEventsHandler;
            _orderEventsHandler = orderEventsHandler;
            _bus = bus;
        }

        public void Init()
        {
            lock (obj)
            {
                if (_isInitiated)
                {
                    return;
                }

                _bus.RegisterHandler<ShopAddedEvent>(_shopEventsHandler.Handle);
                _bus.RegisterHandler<ShopUpdatedEvent>(_shopEventsHandler.Handle);
                _bus.RegisterHandler<ShopCommentAddedEvent>(_shopEventsHandler.Handle);
                _bus.RegisterHandler<ShopCommentRemovedEvent>(_shopEventsHandler.Handle);
                _bus.RegisterHandler<ShopRemovedEvent>(_shopEventsHandler.Handle);
                _bus.RegisterHandler<ProductCommentAddedEvent>(_productEventsHandler.Handle);
                _bus.RegisterHandler<ProductCommentRemovedEvent>(_productEventsHandler.Handle);
                _bus.RegisterHandler<ProductAddedEvent>(_productEventsHandler.Handle);
                _bus.RegisterHandler<ProductUpdatedEvent>(_productEventsHandler.Handle);
                _bus.RegisterHandler<ServiceCommentAddedEvent>(_serviceEventsHandler.Handle);
                _bus.RegisterHandler<ServiceCommentRemovedEvent>(_serviceEventsHandler.Handle);
                _bus.RegisterHandler<ServiceAddedEvent>(_serviceEventsHandler.Handle);
                _bus.RegisterHandler<ServiceUpdatedEvent>(_serviceEventsHandler.Handle);
                _bus.RegisterHandler<ClientServiceAddedEvent>(_clientServiceEventsHandler.Handle);
                _bus.RegisterHandler<ClientServiceRemovedEvent>(_clientServiceEventsHandler.Handle);
                _bus.RegisterHandler<NotificationUpdatedEvent>(_notificationEventsHandler.Handle);
                _bus.RegisterHandler<NotificationAddedEvent>(_notificationEventsHandler.Handle);
                _bus.RegisterHandler<MessageAddedEvent>(_messageEventsHandler.Handle);
                _bus.RegisterHandler<OrderUpdatedEvent>(_orderEventsHandler.Handle);
                _bus.RegisterHandler<OrderRemovedEvent>(_orderEventsHandler.Handle);
                _bus.RegisterHandler<OrderAddedEvent>(_orderEventsHandler.Handle);
                _bus.RegisterHandler<OrderConfirmedEvent>(_orderEventsHandler.Handle);
                _bus.RegisterHandler<OrderReceivedEvent>(_orderEventsHandler.Handle);
                _bus.RegisterHandler<OrderTransactionApprovedEvent>(_orderEventsHandler.Handle);
                _bus.RegisterHandler<OrderLabelPurchasedEvent>(_orderEventsHandler.Handle);
                _bus.RegisterHandler<OrderCanceledEvent>(_orderEventsHandler.Handle);
                _isInitiated = true;
            }
        }
    }
}
