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
    internal class FilterRepository : IFilterRepository
    {
        private readonly CookDbContext _context; 

        public FilterRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<SearchFiltersResult> Search(SearchFiltersParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Filter> filters = _context.Filters;
            if (parameter.Filters != null && parameter.Filters.Any())
            {
                filters = _context.Filters.Where(f => parameter.Filters.Contains(f.Id));
            }

            return new SearchFiltersResult
            {
                Filters = await _context.Filters.Select(f => f.ToAggregate()).ToListAsync().ConfigureAwait(false)
            };
        }
    }
}
