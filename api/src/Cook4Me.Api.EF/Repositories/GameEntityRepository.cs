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

using System;
using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.Core.Repositories;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Cook4Me.Api.EF.Extensions;
using System.Collections.Generic;
using System.Linq;

namespace Cook4Me.Api.EF.Repositories
{
    internal class GameEntityRepository : IGameEntityRepository
    {
        private readonly CookDbContext _context;

        public GameEntityRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<GameEntityAggregate> Get(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
            {
                throw new ArgumentNullException(nameof(name));
            }

            var result = await _context.GameEntities.FirstOrDefaultAsync(g => g.Name == name).ConfigureAwait(false);
            if (result == null)
            {
                return null;
            }


            return result.ToAggregate();
        }

        public async Task<IEnumerable<GameEntityAggregate>> GetAll()
        {
            return await _context.GameEntities.Select(g => g.ToAggregate()).ToListAsync().ConfigureAwait(false);
        }
    }
}
