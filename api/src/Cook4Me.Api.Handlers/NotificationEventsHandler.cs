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

using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.Core.Bus;
using Cook4Me.Api.Core.Events.ClientService;
using Cook4Me.Api.Core.Events.Messages;
using Cook4Me.Api.Core.Events.Notification;
using Cook4Me.Api.Core.Events.Orders;
using Cook4Me.Api.Core.Events.Product;
using Cook4Me.Api.Core.Events.Service;
using Cook4Me.Api.Core.Events.Shop;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Handlers
{
    public class NotificationEventsHandler : Handles<ShopAddedEvent>, Handles<ProductCommentAddedEvent>, Handles<ShopCommentAddedEvent>, 
        Handles<OrderConfirmedEvent>, Handles<OrderReceivedEvent>, Handles<OrderTransactionApprovedEvent>, Handles<OrderLabelPurchasedEvent>,
        Handles<OrderCanceledEvent>
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IShopRepository _shopRepository;
        private readonly IEventPublisher _eventPublisher;

        public NotificationEventsHandler(INotificationRepository notificationRepository, IShopRepository shopRepository, IEventPublisher eventPublisher)
        {
            _notificationRepository = notificationRepository;
            _shopRepository = shopRepository;
            _eventPublisher = eventPublisher;
        }

        public async Task Handle(ShopAddedEvent message) // Notify the owner of the shop.
        {
            var notification = new NotificationAggregate
            {
                Id = Guid.NewGuid().ToString(),
                Content = "create_shop",
                CreatedDateTime = DateTime.UtcNow,
                IsRead = false,
                From = message.Subject,
                To = message.Subject,
                Parameters = new []
                {
                    new NotificationParameter
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = NotificationParameterTypes.ShopId,
                        Value = message.ShopId
                    }
                }
            };
            await _notificationRepository.Add(notification);
            _eventPublisher.Publish(new NotificationAddedEvent
            {
                Id = notification.Id,
                Content = notification.Content,
                IsRead = notification.IsRead,
                From = notification.From,
                To = notification.To
            });
        }

        public async Task Handle(ClientServiceAddedEvent message) // Notify the owner of the shop.
        {
            var notification = new NotificationAggregate
            {
                Id = Guid.NewGuid().ToString(),
                Content = "create_client_service",
                CreatedDateTime = DateTime.UtcNow,
                IsRead = false,
                From = message.Subject,
                To = message.Subject,
                Parameters = new[]
                {
                    new NotificationParameter
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = NotificationParameterTypes.ClientServiceId,
                        Value = message.Id
                    }
                }
            };
            await _notificationRepository.Add(notification);
            _eventPublisher.Publish(new NotificationAddedEvent
            {
                Id = notification.Id,
                Content = notification.Content,
                IsRead = notification.IsRead,
                From = notification.From,
                To = notification.To
            });
        }

        public async Task Handle(ProductCommentAddedEvent message) // Notify the owner of the shop.
        {
            var shop = await _shopRepository.Get(message.ShopId);
            var notification = new NotificationAggregate
            {
                Id = Guid.NewGuid().ToString(),
                Content = "add_product_comment",
                IsRead = false,
                From = message.Subject,
                To = shop.Subject,
                CreatedDateTime = DateTime.UtcNow,
                Parameters = new []
                {
                    new NotificationParameter
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = NotificationParameterTypes.ProductId,
                        Value = message.ProductId
                    }
                }
            };
            
            await _notificationRepository.Add(notification);
            _eventPublisher.Publish(new NotificationAddedEvent
            {
                Id = notification.Id,
                Content = notification.Content,
                IsRead = notification.IsRead,
                From = notification.From,
                To = notification.To
            });
        }

        public async Task Handle(ShopCommentAddedEvent message) // Notify the owner of the shop.
        {
            var shop = await _shopRepository.Get(message.ShopId);
            var notification = new NotificationAggregate
            {
                Id = Guid.NewGuid().ToString(),
                Content = "add_shop_comment",
                IsRead = false,
                From = message.Subject,
                To = shop.Subject,
                CreatedDateTime = DateTime.UtcNow,
                Parameters = new[]
                {
                    new NotificationParameter
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = NotificationParameterTypes.ShopId,
                        Value = message.ShopId
                    }
                }
            };

            await _notificationRepository.Add(notification);
            _eventPublisher.Publish(new NotificationAddedEvent
            {
                Id = notification.Id,
                Content = notification.Content,
                IsRead = notification.IsRead,
                From = notification.From,
                To = notification.To
            });
        }

        public async Task Handle(ServiceCommentAddedEvent message) // Notify the owner of the shop.
        {
            var shop = await _shopRepository.Get(message.ShopId);
            var notification = new NotificationAggregate
            {
                Id = Guid.NewGuid().ToString(),
                Content = "add_service_comment",
                IsRead = false,
                From = message.Subject,
                To = shop.Subject,
                CreatedDateTime = DateTime.UtcNow,
                Parameters = new[]
                {
                    new NotificationParameter
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = NotificationParameterTypes.ServiceId,
                        Value = message.ServiceId
                    }
                }
            };

            await _notificationRepository.Add(notification);
            _eventPublisher.Publish(new NotificationAddedEvent
            {
                Id = notification.Id,
                Content = notification.Content,
                IsRead = notification.IsRead,
                From = notification.From,
                To = notification.To
            });
        }

        public async Task Handle(MessageAddedEvent message) // Notify the "to" that a message has been sent.
        {
            var notification = new NotificationAggregate
            {
                Id = Guid.NewGuid().ToString(),
                Content = "add_message",
                IsRead = false,
                From = message.From,
                To = message.To,
                CreatedDateTime = DateTime.UtcNow,
                Parameters = new[]
                {
                    new NotificationParameter
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = NotificationParameterTypes.MessageId,
                        Value = string.IsNullOrWhiteSpace(message.ParentId) ? message.Id : message.ParentId
                    }
                }
            };

            await _notificationRepository.Add(notification);
            _eventPublisher.Publish(new NotificationAddedEvent
            {
                Id = notification.Id,
                Content = notification.Content,
                IsRead = notification.IsRead,
                From = notification.From,
                To = notification.To
            });
        }

        public async Task Handle(ServiceAddedEvent message)
        {
            var shop = await _shopRepository.Get(message.ShopId);
            var notification = new NotificationAggregate
            {
                Id = Guid.NewGuid().ToString(),
                Content = "add_shop_service",
                CreatedDateTime = DateTime.UtcNow,
                IsRead = false,
                From = shop.Subject,
                To = shop.Subject,
                Parameters = new[]
                {
                    new NotificationParameter
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = NotificationParameterTypes.ShopServiceId,
                        Value = message.Id
                    }
                }
            };
            await _notificationRepository.Add(notification);
            _eventPublisher.Publish(new NotificationAddedEvent
            {
                Id = notification.Id,
                Content = notification.Content,
                IsRead = notification.IsRead,
                From = notification.From,
                To = notification.To
            });
        }

        public async Task Handle(ProductAddedEvent message)
        {
            var shop = await _shopRepository.Get(message.ShopId);
            var notification = new NotificationAggregate
            {
                Id = Guid.NewGuid().ToString(),
                Content = "add_product",
                CreatedDateTime = DateTime.UtcNow,
                IsRead = false,
                From = shop.Subject,
                To = shop.Subject,
                Parameters = new[]
                {
                    new NotificationParameter
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = NotificationParameterTypes.ProductId,
                        Value = message.Id
                    }
                }
            };
            await _notificationRepository.Add(notification);
            _eventPublisher.Publish(new NotificationAddedEvent
            {
                Id = notification.Id,
                Content = notification.Content,
                IsRead = notification.IsRead,
                From = notification.From,
                To = notification.To
            });
        }

        public async Task Handle(OrderConfirmedEvent message)
        {
            var notification = new NotificationAggregate
            {
                Id = Guid.NewGuid().ToString(),
                Content = "confirm_order",
                IsRead = false,
                From = message.Client,
                To = message.Seller,
                CreatedDateTime = DateTime.UtcNow,
                Parameters = new[]
                {
                    new NotificationParameter
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = NotificationParameterTypes.OrderId,
                        Value = message.OrderId
                    }
                }
            };

            await _notificationRepository.Add(notification);
            _eventPublisher.Publish(new NotificationAddedEvent
            {
                Id = notification.Id,
                Content = notification.Content,
                IsRead = notification.IsRead,
                From = notification.From,
                To = notification.To
            });
        }

        public async Task Handle(OrderReceivedEvent message)
        {
            var notification = new NotificationAggregate
            {
                Id = Guid.NewGuid().ToString(),
                Content = "receive_order",
                IsRead = false,
                From = message.Client,
                To = message.Seller,
                CreatedDateTime = DateTime.UtcNow,
                Parameters = new[]
                {
                    new NotificationParameter
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = NotificationParameterTypes.OrderId,
                        Value = message.OrderId
                    }
                }
            };

            await _notificationRepository.Add(notification);
            _eventPublisher.Publish(new NotificationAddedEvent
            {
                Id = notification.Id,
                Content = notification.Content,
                IsRead = notification.IsRead,
                From = notification.From,
                To = notification.To
            });
        }

        public async Task Handle(OrderTransactionApprovedEvent message)
        {
            var notification = new NotificationAggregate
            {
                Id = Guid.NewGuid().ToString(),
                Content = "order_transaction_approved",
                IsRead = false,
                From = message.Subject,
                To = message.SellerId,
                CreatedDateTime = DateTime.UtcNow,
                Parameters = new[]
                {
                    new NotificationParameter
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = NotificationParameterTypes.OrderId,
                        Value = message.OrderId
                    }
                }
            };

            await _notificationRepository.Add(notification);
            _eventPublisher.Publish(new NotificationAddedEvent
            {
                Id = notification.Id,
                Content = notification.Content,
                IsRead = notification.IsRead,
                From = notification.From,
                To = notification.To
            });
        }

        public async Task Handle(OrderLabelPurchasedEvent message)
        {
            var notification = new NotificationAggregate
            {
                Id = Guid.NewGuid().ToString(),
                Content = "order_label_purchased",
                IsRead = false,
                From = message.SellerId,
                To = message.Subject,
                CreatedDateTime = DateTime.UtcNow,
                Parameters = new[]
                {
                    new NotificationParameter
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = NotificationParameterTypes.OrderId,
                        Value = message.OrderId
                    }
                }
            };

            await _notificationRepository.Add(notification);
            _eventPublisher.Publish(new NotificationAddedEvent
            {
                Id = notification.Id,
                Content = notification.Content,
                IsRead = notification.IsRead,
                From = notification.From,
                To = notification.To
            });
        }

        public async Task Handle(OrderCanceledEvent message)
        {
            var notification = new NotificationAggregate
            {
                Id = Guid.NewGuid().ToString(),
                Content = "order_label_canceled",
                IsRead = false,
                From = message.SellerId,
                To = message.Subject,
                CreatedDateTime = DateTime.UtcNow,
                Parameters = new[]
                {
                    new NotificationParameter
                    {
                        Id = Guid.NewGuid().ToString(),
                        Type = NotificationParameterTypes.OrderId,
                        Value = message.OrderId
                    }
                }
            };

            await _notificationRepository.Add(notification);
            _eventPublisher.Publish(new NotificationAddedEvent
            {
                Id = notification.Id,
                Content = notification.Content,
                IsRead = notification.IsRead,
                From = notification.From,
                To = notification.To
            });
        }
    }
}
