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

using Cook4Me.Api.Core.Models;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.EF.Extensions;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Cook4Me.Api.Core.Parameters;

namespace Cook4Me.Api.EF.Repositories
{
    public class ShopRepository : IShopRepository
    {
        private readonly CookDbContext _context;

        public ShopRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Add(Shop shop)
        {
            try
            {
                _context.Shops.Add(shop.ToModel());
                await _context.SaveChangesAsync().ConfigureAwait(false);
                return true;
            }
            catch
            {
                return false;
            }
        }

        public async Task<IEnumerable<Shop>> Get()
        {
            return await _context.Shops.Select(s => s.ToDomain()).ToListAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<Shop>> Search(SearchShopsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            return await _context.Shops.Where(s => s.PlaceId == parameter.Place).Select(s => s.ToDomain()).ToListAsync().ConfigureAwait(false);
        }
    }
}
