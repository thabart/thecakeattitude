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
using Cook4Me.Api.Core.Helpers;
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Handlers
{
    public class OrderCommandsHandler : Handles<UpdateOrderCommand>, Handles<RemoveOrderCommand>, Handles<AddOrderLineCommand>,
        Handles<AcceptOrderTransactionCommand>
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
            if (order.Status == OrderAggregateStatus.Received)
            {
                await _orderRepository.Update(order);
                _eventPublisher.Publish(new OrderReceivedEvent
                {
                    CommonId = message.CommonId,
                    OrderId = order.Id,
                    Client = order.Subject,
                    Seller = order.SellerId
                });
                return;
            }
            else if (order.Status == OrderAggregateStatus.Confirmed)
            {
                order.TransportMode = message.TransportMode;
                if (message.OrderParcel != null)
                {
                    order.OrderParcel = new OrderAggregateParcel
                    {
                        BuyerAddressLine = message.OrderParcel.BuyerAddressLine,
                        BuyerCity = message.OrderParcel.BuyerCity,
                        BuyerCountryCode = message.OrderParcel.BuyerCountryCode,
                        BuyerName = message.OrderParcel.BuyerName,
                        BuyerPostalCode = message.OrderParcel.BuyerPostalCode,
                        EstimatedPrice = message.OrderParcel.EstimatedPrice,
                        Id = Guid.NewGuid().ToString(),
                        OrderId = message.Id,
                        ParcelShopAddressLine = message.OrderParcel.ParcelShopAddressLine,
                        ParcelShopCity = message.OrderParcel.ParcelShopCity,
                        ParcelShopCountryCode = message.OrderParcel.ParcelShopCountryCode,
                        ParcelShopId = message.OrderParcel.ParcelShopId,
                        ParcelShopLatitude = message.OrderParcel.ParcelShopLatitude,
                        ParcelShopLongitude = message.OrderParcel.ParcelShopLongitude,
                        ParcelShopName = message.OrderParcel.ParcelShopName,
                        ParcelShopPostalCode = message.OrderParcel.ParcelShopPostalCode,
                        SellerAddressLine = message.OrderParcel.SellerAddressLine,
                        SellerCity = message.OrderParcel.SellerCity,
                        SellerCountryCode = message.OrderParcel.SellerCountryCode,
                        SellerName = message.OrderParcel.SellerName,
                        SellerPostalCode = message.OrderParcel.SellerPostalCode,
                        Transporter = message.OrderParcel.Transporter,
                        UpsServiceCode = message.OrderParcel.UpsServiceCode
                    };
                }

                if (message.PaymentOrder != null)
                {
                    order.OrderPayment = new OrderAggregatePayment
                    {
                        Id = Guid.NewGuid().ToString(),
                        OrderId = order.Id,
                        PaymentMethod = message.PaymentOrder.PaymentMethod,
                        Status = OrderPaymentStatus.Created,
                        TransactionId = message.PaymentOrder.TransactionId,
                        ApprovalUrl = message.PaymentOrder.ApprovalUrl
                    };
                }
                
                await _orderPriceCalculatorHelper.Update(order);
                await _orderRepository.Update(order);
                if (order.OrderLines != null)
                {
                    await UpdateProductStock(order, false);
                }

                _eventPublisher.Publish(new OrderConfirmedEvent
                {
                    CommonId = message.CommonId,
                    OrderId = order.Id,
                    Client = order.Subject,
                    Seller = order.SellerId
                });
                return;
            }

            order.OrderLines = message.OrderLines == null ? new List<OrderAggregateLine>() : message.OrderLines.Select(o =>
                new OrderAggregateLine
                {
                    Id = o.Id,
                    ProductId = o.ProductId,
                    Quantity = o.Quantity
                }
            ).ToList();
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

            if (record.Status == OrderAggregateStatus.Confirmed)
            {
                await UpdateProductStock(record, true);
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
            var orders = await _orderRepository.Search(new SearchOrdersParameter
            {
                Shops = new[] { product.ShopId },
                Clients = new[] { message.Subject },
                Status =  new[] { (int)OrderAggregateStatus.Created }
            });
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

        public async Task Handle(AcceptOrderTransactionCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var order = await _orderRepository.Get(message.OrderId);
            if (order == null)
            {
                return;
            }

            order.OrderPayment.Status = OrderPaymentStatus.Approved;
            order.OrderPayment.PayerId = message.PayerId;
            await _orderRepository.Update(order);
            _eventPublisher.Publish(new OrderTransactionApprovedEvent
            {
                OrderId = message.OrderId,
                Subject = order.Subject
            });
        }

        private async Task UpdateProductStock(OrderAggregate order, bool addQuantity)
        {
            if (order.OrderLines == null || !order.OrderLines.Any())
            {
                return;
            }

            var products = await _productRepository.Search(new SearchProductsParameter
            {
                ProductIds = order.OrderLines.Select(o => o.ProductId),
                IsPagingEnabled = false
            });
            if (products.Content != null)
            {
                foreach (var orderLine in order.OrderLines)
                {
                    var product = products.Content.FirstOrDefault(c => c.Id == orderLine.ProductId);
                    if (product == null)
                    {
                        continue;
                    }

                    if (product.AvailableInStock.HasValue) // Update the available stock.
                    {
                        if (addQuantity)
                        {
                            product.AvailableInStock = product.AvailableInStock + orderLine.Quantity;
                        }
                        else
                        {
                            product.AvailableInStock = product.AvailableInStock - orderLine.Quantity;
                        }

                        await _productRepository.Update(product);
                    }
                }
            }
        }
    }
}
