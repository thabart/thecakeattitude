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
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Cook4Me.Api.EF.Repositories
{
    internal class TagRepository : ITagRepository
    {
        private readonly CookDbContext _context;

        public TagRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<TagAggregate> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var tag = await _context.Tags.FirstOrDefaultAsync(t => t.Name == id).ConfigureAwait(false);
            if (tag == null)
            {
                return null;
            }

            return tag.ToAggregate();
        }

        public async Task<IEnumerable<TagAggregate>> GetAll()
        {
            return await _context.Tags.Select(c => c.ToAggregate()).ToListAsync().ConfigureAwait(false);
        }

        public async Task<SearchTagsResult> Search(SearchTagsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Tag> tags = _context.Tags.Include(t => t.ProductTags)
                .Include(t => t.ServiceTags)
                .Include(t => t.ShopTags);
            if(parameter.Names != null)
            {
                var names = parameter.Names.Where(n => !string.IsNullOrWhiteSpace(n)).Select(n => n.ToLower());
                if (names.Any())
                {
                    tags = _context.Tags.Where(c => names.Any(n => c.Name.ToLower().Contains(n)));
                }
            }

            var result = new SearchTagsResult
            {
                TotalResults = await tags.CountAsync().ConfigureAwait(false),
                StartIndex = parameter.StartIndex
            };

            if (parameter.Orders != null)
            {
                foreach (var order in parameter.Orders)
                {
                    tags = Order(order, "update_datetime", s => s.UpdateDateTime, tags);
                    tags = Order(order, "create_datetime", s => s.CreateDateTime, tags);
                    if (order.Target == "product_occurrence")
                    {
                        if (order.Method == OrderByMethods.Ascending)
                        {
                            tags = tags.OrderBy(t => t.ProductTags.Count());
                        }
                        else
                        {
                            tags = tags.OrderByDescending(t => t.ProductTags.Count());
                        }
                    }

                    if (order.Target == "shop_occurrence")
                    {
                        if (order.Method == OrderByMethods.Ascending)
                        {
                            tags = tags.OrderBy(t => t.ShopTags.Count());
                        }
                        else
                        {
                            tags = tags.OrderByDescending(t => t.ShopTags.Count());
                        }
                    }

                    if (order.Target == "service_occurrence")
                    {
                        if (order.Method == OrderByMethods.Ascending)
                        {
                            tags = tags.OrderBy(t => t.ServiceTags.Count());
                        }
                        else
                        {
                            tags = tags.OrderByDescending(t => t.ServiceTags.Count());
                        }
                    }
                }
            }

            if (parameter.IsPagingEnabled)
            {
                tags = tags.Skip(parameter.StartIndex).Take(parameter.Count);
            }

            result.Content = await tags.Select(p => p.ToAggregate()).ToListAsync().ConfigureAwait(false);
            return result;
        }

        private static IQueryable<Models.Tag> Order<TKey>(OrderBy orderBy, string key, Expression<Func<Models.Tag, TKey>> keySelector, IQueryable<Models.Tag> tags)
        {
            if (string.Equals(orderBy.Target, key, StringComparison.CurrentCultureIgnoreCase))
            {
                if (orderBy.Method == OrderByMethods.Ascending)
                {
                    return tags.OrderBy(keySelector);
                }

                return tags.OrderByDescending(keySelector);
            }

            return tags;
        }
    }
}
