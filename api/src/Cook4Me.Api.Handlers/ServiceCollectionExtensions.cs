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
using Cook4Me.Api.Core.Commands.Shop;
using Cook4Me.Api.Core.Repositories;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Cook4Me.Api.Handlers
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddHandlers(this IServiceCollection serviceCollection)
        {
            if (serviceCollection == null)
            {
                throw new ArgumentNullException(nameof(serviceCollection));
            }

            var bus = new FakeBus();
            serviceCollection.AddSingleton(typeof(IEventPublisher), bus);
            serviceCollection.AddSingleton(typeof(ICommandSender), bus);
            var provider = serviceCollection.BuildServiceProvider();
            var handler = new ShopHandler(provider.GetService<IShopRepository>());
            bus.RegisterHandler<AddShopCommand>(handler.Handle);
            bus.RegisterHandler<AddShopCommentCommand>(handler.Handle);
            bus.RegisterHandler<RemoveShopCommentCommand>(handler.Handle);
            return serviceCollection;
        }
    }
}
