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
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.EF.Extensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.EF.Repositories
{
    internal class ShopCategoryRepository : IShopCategoryRepository
    {
        private readonly CookDbContext _context;

        public ShopCategoryRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<ShopCategoryAggregate> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var result = await _context.Categories.Include(c => c.Children).FirstOrDefaultAsync(c => c.Id == id).ConfigureAwait(false);
            if (result == null)
            {
                return null;
            }

            return result.ToAggregate();
        }

        public async Task<IEnumerable<ShopCategoryAggregate>> GetAll()
        {
            return await _context.Categories.Include(c => c.Children).Select(c => c.ToAggregate()).ToListAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<ShopCategoryAggregate>> Search(SearchCategoriesParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            var categories = _context.Categories.Include(c => c.Children).Where(c => c.ParentId == parameter.ParentId);
            return await categories.Select(c => c.ToAggregate()).ToListAsync().ConfigureAwait(false);
        }
    }
}
