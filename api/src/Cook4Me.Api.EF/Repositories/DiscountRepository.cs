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
using System.Threading.Tasks;
using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.EF.Extensions;

namespace Cook4Me.Api.EF.Repositories
{
    internal class DiscountRepository : IDiscountRepository
    {
        private readonly CookDbContext _context;

        public DiscountRepository(CookDbContext context)
        {
            _context = context;
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
                _context.Discounts.Add(record);
                await _context.SaveChangesAsync().ConfigureAwait(false);
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
