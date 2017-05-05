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
using Cook4Me.Api.Core.Events.Shop;
using Cook4Me.Api.Host.Hubs;
using Microsoft.AspNetCore.SignalR.Infrastructure;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Handlers
{
    public class ShopEventsHandler : Handles<ShopAddedEvent>
    {
        private readonly IConnectionManager _connectionManager;

        public ShopEventsHandler(IConnectionManager connectionManager)
        {
            _connectionManager = connectionManager;
        }

        public Task Handle(ShopAddedEvent message)
        {
            var notifier = _connectionManager.GetHubContext<Notifier>();
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            notifier.Clients.All.shopAdded(message);
            return Task.FromResult(0);
        }
    }
}
