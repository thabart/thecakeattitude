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
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Core.Results;
using Cook4Me.Api.EF.Extensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Cook4Me.Api.EF.Repositories
{
    internal class ClientServiceRepository : IClientServiceRepository
    {
        private readonly CookDbContext _context;

        public ClientServiceRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Delete(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            using (var transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false))
            {
                try
                {
                    var record = await _context.ClientServices.FirstOrDefaultAsync(a => a.Id == id).ConfigureAwait(false);
                    if (record == null)
                    {
                        transaction.Rollback();
                        return false;
                    }

                    _context.ClientServices.Remove(record);
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

        public async Task<bool> Add(ClientServiceAggregate aggregate)
        {
            if (aggregate == null)
            {
                throw new ArgumentNullException(nameof(aggregate));
            }

            using (var transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false))
            {
                try
                {
                    var record = aggregate.ToModel();
                    _context.ClientServices.Add(record);
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

        public async Task<ClientServiceAggregate> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var record = await _context.ClientServices.Include(a => a.Category).FirstOrDefaultAsync(a => a.Id == id).ConfigureAwait(false);
            if (record == null)
            {
                return null;
            }

            return record.ToAggregate();
        }

        public async Task<SearchClientServicesResult> Search(SearchClientServicesParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.ClientService> announcements = _context.ClientServices.Include(c => c.Category);
            if (parameter.CategoryIds != null && parameter.CategoryIds.Any())
            {
                announcements = announcements.Where(s => s.CategoryId == null || parameter.CategoryIds.Contains(s.CategoryId));
            }
            

            if (!string.IsNullOrWhiteSpace(parameter.Name))
            {
                announcements = announcements.Where(s => s.Name.ToLowerInvariant().Contains(parameter.Name.ToLowerInvariant()));
            }

            if (parameter.Subjects != null)
            {
                announcements = announcements.Where(s => parameter.Subjects.Contains(s.Subject));
            }


            if (parameter.NorthEast != null && parameter.SouthWest != null)
            {
                announcements = announcements.Where(s => s.Latitude >= parameter.SouthWest.Latitude && s.Latitude <= parameter.NorthEast.Latitude && s.Longitude >= parameter.SouthWest.Longitude && s.Longitude <= parameter.NorthEast.Longitude);
            }
            
            if (parameter.Orders != null)
            {
                foreach (var orderBy in parameter.Orders)
                {
                    announcements = Order(orderBy, "update_datetime", s => s.UpdateDateTime, announcements);
                    announcements = Order(orderBy, "create_datetime", s => s.UpdateDateTime, announcements);
                    announcements = Order(orderBy, "price", s => s.Price, announcements);
                }
            }

            var result = new SearchClientServicesResult
            {
                TotalResults = await announcements.CountAsync().ConfigureAwait(false),
                StartIndex = parameter.StartIndex
            };

            if (parameter.IsPagingEnabled)
            {
                announcements = announcements.Skip(parameter.StartIndex).Take(parameter.Count);
            }

            result.Content = await announcements.Select(c => c.ToAggregate()).ToListAsync().ConfigureAwait(false);
            return result;
        }

        public async Task<bool> Update(ClientServiceAggregate aggregate)
        {
            if (aggregate == null)
            {
                throw new ArgumentNullException(nameof(aggregate));
            }

            using (var transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false))
            {
                try
                {
                    var record = await _context.ClientServices.FirstOrDefaultAsync(a => a.Id == aggregate.Id);
                    if (record == null)
                    {
                        transaction.Rollback();
                        return false;
                    }

                    record.CategoryId = aggregate.CategoryId;
                    record.Description = aggregate.Description;
                    record.Latitude = aggregate.Latitude;
                    record.Longitude = aggregate.Longitude;
                    record.Name = aggregate.Name;
                    record.Description = aggregate.Description;
                    record.Price = aggregate.Price;
                    record.Subject = aggregate.Subject;
                    record.UpdateDateTime = aggregate.UpdateDateTime;
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

        private static IQueryable<Models.ClientService> Order<TKey>(OrderBy orderBy, string key, Expression<Func<Models.ClientService, TKey>> keySelector, IQueryable<Models.ClientService> shops)
        {
            if (string.Equals(orderBy.Target, key, StringComparison.CurrentCultureIgnoreCase))
            {
                if (orderBy.Method == OrderByMethods.Ascending)
                {
                    return shops.OrderBy(keySelector);
                }

                return shops.OrderByDescending(keySelector);
            }

            return shops;
        }
    }
}
