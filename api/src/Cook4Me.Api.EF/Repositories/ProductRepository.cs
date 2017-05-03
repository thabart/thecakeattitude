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
using Cook4Me.Api.EF.Extensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.EF.Repositories
{
    internal class ProductRepository : IProductRepository
    {
        private readonly CookDbContext _context;

        public ProductRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<SearchProductsResult> Search(SearchProductsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Product> products = _context.Products
                .Include(p => p.Images)
                .Include(p => p.Tags)
                .Include(p => p.Filters).ThenInclude(p => p.FilterValue).ThenInclude(p => p.Filter);
            if (!string.IsNullOrWhiteSpace(parameter.ShopId))
            {
                products = products.Where(p => p.ShopId == parameter.ShopId);
            }

            if (parameter.Filters != null)
            {
                foreach(var filter in parameter.Filters)
                {
                    products = products.Where(p => p.Filters.Any(f => f.FilterValue.Content == filter.Value && f.FilterValue.FilterId == filter.Id));
                }
            }

            var result = new SearchProductsResult();
            products = products
                .OrderByDescending(c => c.UpdateDateTime);
            if (parameter.IsPagingEnabled)
            {
                products = products.Skip(parameter.StartIndex).Take(parameter.Count);
            }

            result.Content = await products.Select(p => p.ToDomain()).ToListAsync().ConfigureAwait(false);
            return result;
        }
    }
}
