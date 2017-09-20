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

using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Core.Results;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using Cook4Me.Api.EF.Extensions;
using System.Threading.Tasks;
using Cook4Me.Api.Core.Aggregates;
using System.Collections.Generic;
using Cook4Me.Api.EF.Models;

namespace Cook4Me.Api.EF.Repositories
{
    internal class OrderRepository : IOrderRepository
    {
        private readonly CookDbContext _context;

        public OrderRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<OrderAggregate> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            IQueryable<Order> orders = _context.Orders
                .Include(c => c.OrderParcel)
                .Include(p => p.OrderLines)
                .Include(p => p.Shop)
                .Include(c => c.OrderPayment);
            var result = await orders.FirstOrDefaultAsync(p => p.Id == id).ConfigureAwait(false);
            if (result == null)
            {
                return null;
            }

            return result.ToAggregate();
        }

        public async Task<bool> Remove(OrderAggregate orderAggregate)
        {
            if (orderAggregate == null)
            {
                throw new ArgumentNullException(nameof(orderAggregate));
            }

            var record = await _context.Orders.FirstOrDefaultAsync(s => s.Id == orderAggregate.Id);
            if (record == null)
            {
                return false;
            }

            try
            {
                _context.Orders.Remove(record);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> Insert(OrderAggregate orderAggregate)
        {
            if (orderAggregate == null)
            {
                throw new ArgumentNullException(nameof(orderAggregate));
            }

            try
            {
                var record = orderAggregate.ToModel();
                _context.Orders.Add(record);
                await _context.SaveChangesAsync().ConfigureAwait(false);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> Update(OrderAggregate orderAggregate)
        {
            if (orderAggregate == null)
            {
                throw new ArgumentNullException(nameof(orderAggregate));
            }

            using (var transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false))
            {
                try
                {
                    var record = await _context.Orders.Include(s => s.OrderLines).FirstOrDefaultAsync(s => s.Id == orderAggregate.Id).ConfigureAwait(false);
                    if (record == null)
                    {
                        return false;
                    }

                    record.Status = (int)orderAggregate.Status;
                    record.Subject = orderAggregate.Subject;
                    record.TotalPrice = orderAggregate.TotalPrice;
                    record.UpdateDateTime = orderAggregate.UpdateDateTime;
                    record.ShopId = orderAggregate.ShopId;
                    record.TransportMode = (int)orderAggregate.TransportMode;
                    record.ShipmentIdentificationNumber = orderAggregate.ShipmentIdentificationNumber;
                    if (orderAggregate.OrderParcel != null)
                    {
                        if (record.OrderParcel == null)
                        {
                            record.OrderParcel = new OrderParcel
                            {
                                Id = orderAggregate.OrderParcel.Id
                            };
                        }

                        record.OrderParcel.BuyerAddressLine = orderAggregate.OrderParcel.BuyerAddressLine;
                        record.OrderParcel.BuyerCity = orderAggregate.OrderParcel.BuyerCity;
                        record.OrderParcel.BuyerCountryCode = orderAggregate.OrderParcel.BuyerCountryCode;
                        record.OrderParcel.BuyerName = orderAggregate.OrderParcel.BuyerName;
                        record.OrderParcel.BuyerPostalCode = orderAggregate.OrderParcel.BuyerPostalCode;
                        record.OrderParcel.EstimatedPrice = orderAggregate.OrderParcel.EstimatedPrice;
                        record.OrderParcel.OrderId = record.Id;
                        record.OrderParcel.ParcelShopAddressLine = orderAggregate.OrderParcel.ParcelShopAddressLine;
                        record.OrderParcel.ParcelShopCity = orderAggregate.OrderParcel.ParcelShopCity;
                        record.OrderParcel.ParcelShopCountryCode = orderAggregate.OrderParcel.ParcelShopCountryCode; ;
                        record.OrderParcel.ParcelShopId = orderAggregate.OrderParcel.ParcelShopId;
                        record.OrderParcel.ParcelShopLatitude = orderAggregate.OrderParcel.ParcelShopLatitude;
                        record.OrderParcel.ParcelShopLongitude = orderAggregate.OrderParcel.ParcelShopLongitude;
                        record.OrderParcel.ParcelShopName = orderAggregate.OrderParcel.ParcelShopName;
                        record.OrderParcel.ParcelShopPostalCode = orderAggregate.OrderParcel.ParcelShopPostalCode;
                        record.OrderParcel.SellerAddressLine = orderAggregate.OrderParcel.SellerAddressLine;
                        record.OrderParcel.SellerCity = orderAggregate.OrderParcel.SellerCity;
                        record.OrderParcel.SellerCountryCode = orderAggregate.OrderParcel.SellerCountryCode;
                        record.OrderParcel.SellerName = orderAggregate.OrderParcel.SellerName;
                        record.OrderParcel.SellerPostalCode = orderAggregate.OrderParcel.SellerPostalCode;
                        record.OrderParcel.Transporter = (int)orderAggregate.OrderParcel.Transporter;
                        record.OrderParcel.UpsServiceCode = (int)orderAggregate.OrderParcel.UpsServiceCode;
                        record.OrderParcel.Weight = orderAggregate.OrderParcel.Weight;
                        record.OrderParcel.Height = orderAggregate.OrderParcel.Height;
                        record.OrderParcel.Width = orderAggregate.OrderParcel.Width;
                        record.OrderParcel.Length = orderAggregate.OrderParcel.Length;
                    }

                    if (orderAggregate.OrderPayment != null)
                    {
                        if (record.OrderPayment == null)
                        {
                            record.OrderPayment = new OrderPayment
                            {
                                Id = orderAggregate.OrderPayment.Id
                            };
                        }

                        record.OrderPayment.OrderId = orderAggregate.OrderPayment.OrderId;
                        record.OrderPayment.PaymentMethod = (int)orderAggregate.OrderPayment.PaymentMethod;
                        record.OrderPayment.Status = (int)orderAggregate.OrderPayment.Status;
                        record.OrderPayment.TransactionId = orderAggregate.OrderPayment.TransactionId;
                        record.OrderPayment.PayerId = orderAggregate.OrderPayment.PayerId;
                        record.OrderPayment.ApprovalUrl = orderAggregate.OrderPayment.ApprovalUrl;
                    }

                    var orderLines = orderAggregate.OrderLines == null ? new List<OrderAggregateLine>() : orderAggregate.OrderLines;
                    var orderIds = orderLines.Select(c => c.Id);
                    var orderLinesToUpdate = record.OrderLines.Where(c => orderIds.Contains(c.Id));
                    var orderLinesToRemove = record.OrderLines.Where(c => !orderIds.Contains(c.Id));
                    var existingOrderIds = record.OrderLines.Select(c => c.Id);
                    var orderLinesToAdd = orderLines.Where(c => !existingOrderIds.Contains(c.Id));
                    foreach (var orderLineToUpdate in orderLinesToUpdate)
                    {
                        var orderLine = orderLines.First(c => c.Id == orderLineToUpdate.Id);
                        orderLineToUpdate.Price = orderLine.Price;
                        orderLineToUpdate.ProductId = orderLine.ProductId;
                        orderLineToUpdate.Quantity = orderLine.Quantity;
                    }

                    foreach (var orderLineToRemove in orderLinesToRemove)
                    {
                        _context.OrderLines.Remove(orderLineToRemove);
                    }

                    foreach (var orderLineToAdd in orderLinesToAdd)
                    {
                        var rec = new OrderLine
                        {
                            Id = orderLineToAdd.Id,
                            Price = orderLineToAdd.Price,
                            ProductId = orderLineToAdd.ProductId,
                            Quantity = orderLineToAdd.Quantity,
                            OrderId = record.Id
                        };
                        _context.OrderLines.Add(rec);
                    }

                    await _context.SaveChangesAsync().ConfigureAwait(false);
                    transaction.Commit();
                    return true;
                }
                catch
                {
                    transaction.Rollback();
                    return false;
                }
            }
        }

        public async Task<SearchOrdersResult> Search(SearchOrdersParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Order> orders = _context.Orders.Include(c => c.OrderParcel).Include(c => c.OrderLines).Include(c => c.Shop).Include(c => c.OrderPayment);
            if (parameter.Clients != null && parameter.Clients.Any())
            {
                orders = orders.Where(s => parameter.Clients.Contains(s.Subject));
            }

            if (parameter.Sellers != null && parameter.Sellers.Any())
            {
                orders = orders.Where(s => s.Shop != null && parameter.Sellers.Contains(s.Shop.Subject));
            }

            if (parameter.Status != null && parameter.Status.Any())
            {
                orders = orders.Where(s => parameter.Status.Contains(s.Status));
            }

            if (parameter.Shops != null && parameter.Shops.Any())
            {
                orders = orders.Where(s => parameter.Shops.Contains(s.ShopId));
            }

            if (parameter.OrderBy != null)
            {
                foreach (var orderBy in parameter.OrderBy)
                {
                    orders = Order(orderBy, "update_datetime", s => s.UpdateDateTime, orders);
                    orders = Order(orderBy, "create_datetime", s => s.CreateDateTime, orders);
                }
            }

            var result = new SearchOrdersResult
            {
                TotalResults = await orders.CountAsync().ConfigureAwait(false),
                StartIndex = parameter.StartIndex
            };

            if (parameter.IsPagingEnabled)
            {
                orders = orders.Skip(parameter.StartIndex).Take(parameter.Count);
            }

            result.Content = await orders.Select(c => c.ToAggregate()).ToListAsync().ConfigureAwait(false);
            return result;
        }

        public async Task<GetOrderStatusResult> GetStatus(GetOrderStatusParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            if (string.IsNullOrWhiteSpace(parameter.Subject))
            {
                throw new ArgumentNullException(nameof(parameter.Subject));
            }

            IQueryable<Models.Order> orders = _context.Orders.Include(c => c.OrderLines);
            var createdOrders = orders.Where(o => o.Status == 0 && o.Subject == parameter.Subject);
            var numberOfOrderCreated = await createdOrders.CountAsync().ConfigureAwait(false);
            var numberOfOrderLinesCreated = await createdOrders.Select(o => o.OrderLines.Count()).SumAsync().ConfigureAwait(false);
            return new GetOrderStatusResult
            {
                NumberOfOrderCreated = numberOfOrderCreated,
                NumberOfOrderLinesCreated = numberOfOrderLinesCreated
            };
        }

        private static IQueryable<Models.Order> Order<TKey>(OrderBy orderBy, string key, Expression<Func<Models.Order, TKey>> keySelector, IQueryable<Models.Order> orders)
        {
            if (string.Equals(orderBy.Target, key, StringComparison.CurrentCultureIgnoreCase))
            {
                if (orderBy.Method == OrderByMethods.Ascending)
                {
                    return orders.OrderBy(keySelector);
                }

                return orders.OrderByDescending(keySelector);
            }

            return orders;
        }
    }
}
