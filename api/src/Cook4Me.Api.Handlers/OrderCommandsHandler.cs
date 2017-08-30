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
using Cook4Me.Api.Core.Commands.Orders;
using Cook4Me.Api.Core.Events.Orders;
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Handlers
{
    public class OrderCommandsHandler : Handles<UpdateOrderCommand>
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly IEventPublisher _eventPublisher;

        public OrderCommandsHandler(IOrderRepository orderRepository, IProductRepository productRepository, IEventPublisher eventPublisher)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _eventPublisher = eventPublisher;
        }

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
            var orderLines = message.OrderLines == null ? new List<OrderAggregateLine>() : message.OrderLines.Select(o =>
                new OrderAggregateLine
                {
                    Id = o.Id,
                    ProductId = o.ProductId,
                    Quantity = o.Quantity
                }
            ).ToList();
            order.TotalPrice = 0;
            if (orderLines != null && orderLines.Any())
            {
                var productIds = orderLines.Select(line => line.ProductId);
                var products = await _productRepository.Search(new SearchProductsParameter
                {
                    ProductIds = productIds,
                    ShopIds = new [] { order.ShopId }
                });
                if (products.Content.Count() != productIds.Count())
                {
                    return;
                }

                foreach(var orderLine in orderLines)
                {
                    var product = products.Content.First(p => p.Id == orderLine.ProductId);
                    orderLine.Price = product.Price * orderLine.Quantity;
                }

                order.OrderLines = orderLines;
                order.TotalPrice = orderLines.Sum(line => line.Price);
            }

            await _orderRepository.Update(order);
            _eventPublisher.Publish(new OrderUpdatedEvent
            {
                OrderId = order.Id,
                CommonId = message.CommonId,
                To = order.Subject
            });
        }
    }
}
