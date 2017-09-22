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
using Cook4Me.Api.Core.Commands.ClientService;
using Cook4Me.Api.Core.Commands.Messages;
using Cook4Me.Api.Core.Commands.Notifications;
using Cook4Me.Api.Core.Commands.Orders;
using Cook4Me.Api.Core.Commands.Product;
using Cook4Me.Api.Core.Commands.Service;
using Cook4Me.Api.Core.Commands.Shop;
using Cook4Me.Api.Core.Commands.Ups;
using Cook4Me.Api.Core.Events.ClientService;
using Cook4Me.Api.Core.Events.Messages;
using Cook4Me.Api.Core.Events.Orders;
using Cook4Me.Api.Core.Events.Product;
using Cook4Me.Api.Core.Events.Service;
using Cook4Me.Api.Core.Events.Shop;
using Cook4Me.Api.Core.Helpers;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Common;
using Microsoft.Extensions.DependencyInjection;
using Paypal.Client;
using System;
using Ups.Client;

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
            serviceCollection.AddSingleton(typeof(IBus), bus);
            var provider = serviceCollection.BuildServiceProvider();
            var shopCommandHandler = new ShopCommandsHandler(provider.GetService<IShopRepository>(), bus);
            var productCommandHandler = new ProductCommandsHandler(provider.GetService<IProductRepository>(), bus);
            var serviceCommandHandler = new ServiceCommandsHandler(provider.GetService<IServiceRepository>(), bus);
            var clientServiceCommandHandler = new ClientServiceCommandsHandler(provider.GetService<IClientServiceRepository>(), bus);
            var notificationCommandHandler = new NotificationCommandsHandler(provider.GetService<INotificationRepository>(), bus);
            var messageCommandsHandler = new MessageCommandsHandler(provider.GetService<IMessageRepository>(), bus);
            var orderCommandsHandler = new OrderCommandsHandler(provider.GetService<IOrderRepository>(), provider.GetService<IProductRepository>(), bus, provider.GetService<IOrderPriceCalculatorHelper>());
            var notificationEventsHandler = new NotificationEventsHandler(provider.GetService<INotificationRepository>(), provider.GetService<IShopRepository>(), bus);
            var upsCommandsHandler = new UpsCommandsHandler(provider.GetService<IEventPublisher>(), provider.GetService<IUpsClient>());
            bus.RegisterHandler<AddShopCommand>(shopCommandHandler.Handle);
            bus.RegisterHandler<AddShopCommentCommand>(shopCommandHandler.Handle);
            bus.RegisterHandler<RemoveShopCommentCommand>(shopCommandHandler.Handle);
            bus.RegisterHandler<RemoveShopCommand>(shopCommandHandler.Handle);
            bus.RegisterHandler<UpdateShopCommand>(shopCommandHandler.Handle);
            bus.RegisterHandler<AddProductCommentCommand>(productCommandHandler.Handle);
            bus.RegisterHandler<RemoveProductCommentCommand>(productCommandHandler.Handle);
            bus.RegisterHandler<AddProductCommand>(productCommandHandler.Handle);
            bus.RegisterHandler<AddServiceCommentCommand>(serviceCommandHandler.Handle);
            bus.RegisterHandler<AddServiceCommand>(serviceCommandHandler.Handle);
            bus.RegisterHandler<RemoveServiceCommentCommand>(serviceCommandHandler.Handle);
            bus.RegisterHandler<AddClientServiceCommand>(clientServiceCommandHandler.Handle);
            bus.RegisterHandler<RemoveClientServiceCommand>(clientServiceCommandHandler.Handle);
            bus.RegisterHandler<UpdateNotificationCommand>(notificationCommandHandler.Handle);
            bus.RegisterHandler<AddMessageCommand>(messageCommandsHandler.Handle);
            bus.RegisterHandler<UpdateOrderCommand>(orderCommandsHandler.Handle);
            bus.RegisterHandler<RemoveOrderCommand>(orderCommandsHandler.Handle);
            bus.RegisterHandler<AddOrderLineCommand>(orderCommandsHandler.Handle);
            bus.RegisterHandler<ConfirmOrderLabelPurchaseCommand>(orderCommandsHandler.Handle);
            bus.RegisterHandler<CancelOrderCommand>(orderCommandsHandler.Handle);
            bus.RegisterHandler<AcceptOrderTransactionCommand>(orderCommandsHandler.Handle);
            bus.RegisterHandler<BuyUpsLabelCommand>(upsCommandsHandler.Handle);
            bus.RegisterHandler<ShopAddedEvent>(notificationEventsHandler.Handle);
            bus.RegisterHandler<ProductCommentAddedEvent>(notificationEventsHandler.Handle);
            bus.RegisterHandler<ShopCommentAddedEvent>(notificationEventsHandler.Handle);
            bus.RegisterHandler<ServiceCommentAddedEvent>(notificationEventsHandler.Handle);
            bus.RegisterHandler<MessageAddedEvent>(notificationEventsHandler.Handle);
            bus.RegisterHandler<ClientServiceAddedEvent>(notificationEventsHandler.Handle);
            bus.RegisterHandler<ServiceAddedEvent>(notificationEventsHandler.Handle);
            bus.RegisterHandler<ProductAddedEvent>(notificationEventsHandler.Handle);
            bus.RegisterHandler<OrderConfirmedEvent>(notificationEventsHandler.Handle);
            bus.RegisterHandler<OrderReceivedEvent>(notificationEventsHandler.Handle);
            bus.RegisterHandler<OrderTransactionApprovedEvent>(notificationEventsHandler.Handle);
            bus.RegisterHandler<OrderLabelPurchasedEvent>(notificationEventsHandler.Handle);
            return serviceCollection;
        }
    }
}
