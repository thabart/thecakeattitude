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
using Cook4Me.Api.EF.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.EF.Repositories
{
    internal class DiscountRepository : IDiscountRepository
    {
        private readonly CookDbContext _context;

        public DiscountRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<DiscountAggregate> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            try
            {
                var discount = await _context.Discounts.Include(d => d.Products).FirstOrDefaultAsync(d => d.Id == id).ConfigureAwait(false);
                return discount == null ? null : discount.ToAggregate();
            }
            catch
            {
                return null;
            }
        }

        public async Task<bool> Insert(DiscountAggregate discountAggregate)
        {
            if (discountAggregate == null)
            {
                throw new ArgumentNullException(nameof(discountAggregate));
            }
            
            try
            {
                var record = discountAggregate.ToModel();
                if (discountAggregate.Products != null)
                {
                    var productDiscounts = discountAggregate.Products.Select(p => new ProductDiscount
                    {
                        Id = Guid.NewGuid().ToString(),
                        DiscountId = record.Id,
                        ProductId = p.ProductId,
                        MoneySaved = p.MoneySaved
                    }).ToList();
                    record.Products = productDiscounts;
                }

                _context.Discounts.Add(record);
                await _context.SaveChangesAsync().ConfigureAwait(false);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<SearchDiscountsResult> Search(SearchDiscountsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Discount> discounts = _context.Discounts.Include(c => c.Products);
            if (!string.IsNullOrWhiteSpace(parameter.Subject))
            {
                discounts = discounts.Where(d => d.Subject == parameter.Subject);
            }

            if (parameter.DiscountCodes != null)
            {
                discounts = discounts.Where(d => parameter.DiscountCodes.Contains(d.Code));
            }

            var result = new SearchDiscountsResult
            {
                TotalResults = await discounts.CountAsync().ConfigureAwait(false),
                StartIndex = parameter.StartIndex
            };

            if (parameter.IsPagingEnabled)
            {
                discounts = discounts.Skip(parameter.StartIndex).Take(parameter.Count);
            }

            result.Content = await discounts.Select(c => c.ToAggregate()).ToListAsync().ConfigureAwait(false);
            return result;
        }
    }
}
