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
using Cook4Me.Api.EF.Extensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
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

        public async Task<IEnumerable<TagAggregate>> GetAll()
        {
            return await _context.Tags.Select(c => c.ToAggregate()).ToListAsync().ConfigureAwait(false);
        }

        public async Task<IEnumerable<TagAggregate>> Search(SearchTagsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }
            
            var tags = _context.Tags.Where(c => c.Name.ToLower().Contains(parameter.Name.ToLower()));
            return await tags.Select(c => c.ToAggregate()).ToListAsync().ConfigureAwait(false);
        }
    }
}
