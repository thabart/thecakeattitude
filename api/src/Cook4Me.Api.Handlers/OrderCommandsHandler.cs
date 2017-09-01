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

using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.Core.Bus;
using Cook4Me.Api.Core.Commands.Orders;
using Cook4Me.Api.Core.Events.Orders;
using Cook4Me.Api.Core.Helpers;
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Handlers
{
    public class OrderCommandsHandler : Handles<UpdateOrderCommand>, Handles<RemoveOrderCommand>, Handles<AddOrderLineCommand>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly IEventPublisher _eventPublisher;
        private readonly IOrderPriceCalculatorHelper _orderPriceCalculatorHelper;

        public OrderCommandsHandler(IOrderRepository orderRepository, IProductRepository productRepository, 
            IEventPublisher eventPublisher, IOrderPriceCalculatorHelper orderPriceCalculatorHelper)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _eventPublisher = eventPublisher;
            _orderPriceCalculatorHelper = orderPriceCalculatorHelper;
        }

        // TODO : Update the stock when the order is confirmed.

        public async Task Handle(UpdateOrderCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var order = await _orderRepository.Get(message.Id);
            if (order == null)
            {
                return;
            }

            order.UpdateDateTime = DateTime.UtcNow;
            order.Status = message.Status;
            order.TransportMode = message.TransportMode;
            order.OrderLines = message.OrderLines == null ? new List<OrderAggregateLine>() : message.OrderLines.Select(o =>
                new OrderAggregateLine
                {
                    Id = o.Id,
                    ProductId = o.ProductId,
                    Quantity = o.Quantity
                }
            ).ToList();
            if (order.Status == OrderAggregateStatus.Confirmed)
            {
                await _orderPriceCalculatorHelper.Update(order);
                await _orderRepository.Update(order);
                _eventPublisher.Publish(new OrderConfirmedEvent
                {
                    CommonId = message.CommonId,
                    OrderId = order.Id,
                    Client = order.Subject,
                    Seller = order.SellerId
                });
                return;
            }

            await _orderRepository.Update(order);
            _eventPublisher.Publish(new OrderUpdatedEvent
            {
                OrderId = order.Id,
                CommonId = message.CommonId,
                To = order.Subject
            });
        }

        public async Task Handle(RemoveOrderCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var record = await _orderRepository.Get(message.OrderId);
            if (record == null)
            {
                return;
            }

            await _orderRepository.Remove(record);
            _eventPublisher.Publish(new OrderRemovedEvent
            {
                Id = message.OrderId,
                CommonId = message.CommonId,
                Subject = message.Subject
            });
        }

        public async Task Handle(AddOrderLineCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            string id = null;
            var product = await _productRepository.Get(message.ProductId);
            var orders = await _orderRepository.Search(new SearchOrdersParameter { Shops = new[] { product.ShopId }, Clients = new[] { message.Subject } });
            if (orders.Content.Count() > 1)
            {
                return;
            }

            if (orders.Content.Count() == 1) // Update existing order.
            {
                var order = orders.Content.First();
                var orderLines = order.OrderLines.ToList();
                var orderLine = orderLines.FirstOrDefault(l => l.ProductId == message.ProductId);
                if (orderLine == null)
                {
                    orderLine = new OrderAggregateLine
                    {
                        Id = message.Id,
                        Price = product.NewPrice * message.Quantity,
                        ProductId = message.ProductId,
                        Quantity = message.Quantity
                    };
                    orderLines.Add(orderLine);
                }
                else
                {
                    orderLine.Quantity += message.Quantity;
                    orderLine.Price = orderLine.Quantity * product.NewPrice;
                }

                order.OrderLines = orderLines;
                order.TotalPrice = orderLines.Sum(line => line.Price);
                await _orderRepository.Update(order);
                id = order.Id;
            }
            else // Add new order.
            {
                var newOrder = new OrderAggregate
                {
                    Id = Guid.NewGuid().ToString(),
                    CreateDateTime = DateTime.UtcNow,
                    ShopId = product.ShopId,
                    Subject = message.Subject,
                    Status = OrderAggregateStatus.Created,
                    UpdateDateTime = DateTime.UtcNow,
                    TotalPrice = product.NewPrice * message.Quantity,
                    OrderLines = new[]
                    {
                    new OrderAggregateLine
                    {
                        Id = message.Id,
                        Price = product.NewPrice * message.Quantity,
                        ProductId = product.Id,
                        Quantity = message.Quantity
                    }
                }
                };

                await _orderRepository.Insert(newOrder);
                id = newOrder.Id;
            }

            _eventPublisher.Publish(new OrderAddedEvent
            {
                CommonId = message.CommonId,
                Subject = message.Subject,
                OrderId = id,
                OrderLineId = message.Id
            });
        }
    }
}
