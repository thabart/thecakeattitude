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
using Cook4Me.Api.Core.Models;
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
    internal class MapRepository : IMapRepository
    {
        private readonly CookDbContext _context;

        public MapRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<ShopMap> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var result = await _context.Maps.FirstOrDefaultAsync(c => c.MapName == id).ConfigureAwait(false);
            if (result == null)
            {
                return null;
            }

            return result.ToAggregate();
        }

        public async Task<IEnumerable<ShopMap>> GetAll()
        {
            return await _context.Maps.Select(c => c.ToAggregate()).ToListAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<ShopMap>> Search(SearchMapsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }


            var maps = _context.Maps.Where(c => c.CategoryId == parameter.CategoryId);
            return await maps.Select(c => c.ToAggregate()).ToListAsync().ConfigureAwait(false);
        }
    }
}
