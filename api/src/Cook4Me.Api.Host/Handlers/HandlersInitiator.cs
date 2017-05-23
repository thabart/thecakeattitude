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
using Cook4Me.Api.Core.Events.Announcement;
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
        private readonly AnnouncementEventsHandler _announcementEventsHandler;
        private readonly IBus _bus;

        public HandlersInitiator(ShopEventsHandler shopEventsHandler, ProductEventsHandler productEventsHandler, ServiceEventsHandler serviceEventsHandler, AnnouncementEventsHandler announcementEventsHandler, IBus bus)
        {
            _shopEventsHandler = shopEventsHandler;
            _productEventsHandler = productEventsHandler;
            _serviceEventsHandler = serviceEventsHandler;
            _announcementEventsHandler = announcementEventsHandler;
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
                _bus.RegisterHandler<ShopCommentAddedEvent>(_shopEventsHandler.Handle);
                _bus.RegisterHandler<ShopCommentRemovedEvent>(_shopEventsHandler.Handle);
                _bus.RegisterHandler<ShopRemovedEvent>(_shopEventsHandler.Handle);
                _bus.RegisterHandler<ProductCommentAddedEvent>(_productEventsHandler.Handle);
                _bus.RegisterHandler<ProductCommentRemovedEvent>(_productEventsHandler.Handle);
                _bus.RegisterHandler<ProductAddedEvent>(_productEventsHandler.Handle);
                _bus.RegisterHandler<ServiceCommentAddedEvent>(_serviceEventsHandler.Handle);
                _bus.RegisterHandler<ServiceCommentRemovedEvent>(_serviceEventsHandler.Handle);
                _bus.RegisterHandler<AnnouncementAddedEvent>(_announcementEventsHandler.Handle);
                _bus.RegisterHandler<AnnouncementRemovedEvent>(_announcementEventsHandler.Handle);
                _isInitiated = true;
            }
        }
    }
}
