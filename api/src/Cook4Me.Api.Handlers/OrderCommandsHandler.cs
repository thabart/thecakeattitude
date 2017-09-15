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
using Paypal.Client;
using Paypal.Client.Common;
using Paypal.Client.Params;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Handlers
{
    public class OrderCommandsHandler : Handles<UpdateOrderCommand>, Handles<RemoveOrderCommand>, Handles<AddOrderLineCommand>
    {
        // TODO : Move those data to a common class.
        private const string _clientId = "AQsgq7UBKVB0aTLI3k-2VRP1q1iFK9qsb8t29QJIMC6M_JWejo6mgylGmSLb3fLmaSVPsHCpwBvk5Lxt";
        private const string _clientSecret = "EA930i2soWpP_XywC1CELPSIDLZxTmiNHvVJuI0qhWna6v_hXSPpATlxSArZJQWBS1pw_e9gOqbf0git";

        private const string _approvalUrl = "approval_url";

        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly IEventPublisher _eventPublisher;
        private readonly IOrderPriceCalculatorHelper _orderPriceCalculatorHelper;
        private readonly IPaypalClient _paypalClient;
        private readonly IPaypalOauthClient _paypalOauthClient;

        public OrderCommandsHandler(IOrderRepository orderRepository, IProductRepository productRepository, 
            IEventPublisher eventPublisher, IOrderPriceCalculatorHelper orderPriceCalculatorHelper, IPaypalClient paypalClient,
            IPaypalOauthClient paypalOauthClient)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _eventPublisher = eventPublisher;
            _orderPriceCalculatorHelper = orderPriceCalculatorHelper;
            _paypalClient = paypalClient;
            _paypalOauthClient = paypalOauthClient;
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
                        Transporter = message.OrderParcel.Transporter
                    };
                }
                await _orderPriceCalculatorHelper.Update(order);
                await _orderRepository.Update(order);
                if (order.TransportMode == OrderTransportModes.Packet) // Purchase the packet (create PAYPAL transaction).
                {
                    var token = await _paypalOauthClient.GetAccessToken(_clientId, _clientSecret,
                        new PaypalOauthClientOptions
                        {
                            ApplicationMode = PaypalApplicationModes.sandbox
                        });
                    var products = await _productRepository.Search(new SearchProductsParameter
                    {
                        ProductIds = order.OrderLines.Select(o => o.ProductId),
                        IsPagingEnabled = false
                    });
                    var items = order.OrderLines.Select(o =>
                    {
                        var product = products.Content.First(p => p.Id == o.ProductId);
                        return new PaypalItem
                        {
                            Name = product.Name,
                            Description = product.Description,
                            Currency = "EUR",
                            Quantity = o.Quantity,
                            Price = product.Price
                        };
                    });
                    var res = await _paypalClient.CreatePayment(new CreatePaymentParameter
                    {
                        AccessToken = token.AccessToken,
                        Intent = IntentPayments.authorize,
                        Payer = new PaypalPayer
                        {
                            PaymentMethod = PaypalPaymentMethods.Paypal,
                            Email = "habarthierry-facilitator@hotmail.fr" // TODO : Retrieve this email.
                        },
                        Transactions = new []
                        {
                            new PaymentTransaction
                            {
                               Currency = "EUR", // TODO : Calculate the estimated price.
                               Total = 4 + items.Sum(i => i.Price * i.Quantity),
                               Shipping = 4,
                               SubTotal = items.Sum(i => i.Price * i.Quantity),
                               Items = items,
                               Payee = new PaypalPayee
                               {
                                   Email = "habarthierry@first-receiver.fr" // TODO : Retrieve this EMAIL.
                               }
                            }
                        },
                        CancelUrl = "http://localhost:3000/cancel",
                        ReturnUrl = "http://localhost:3000/accept"
                    });
                    _eventPublisher.Publish(new OrderPurchasedEvent
                    {
                        Buyer = order.Subject,
                        CommonId = message.CommonId,
                        ApprovalUrl = res.Links.First(l => l.Rel == _approvalUrl).Href,
                        PaymentId = res.Id
                    });
                    return;
                }

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
