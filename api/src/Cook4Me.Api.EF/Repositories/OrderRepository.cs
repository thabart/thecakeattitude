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

            IQueryable<Models.Order> orders = _context.Orders.Include(c => c.OrderLines);
            if (parameter.Subjects != null && parameter.Subjects.Any())
            {
                orders = orders.Where(s => parameter.Subjects.Contains(s.Subject));
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
