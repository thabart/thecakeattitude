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
                var record = shop.ToModel();
                var tags = new List<Models.ShopTag>();
                if (shop.Tags != null && shop.Tags.Any())
                {
                    var tagNames = shop.Tags;
                    var connectedTags = _context.Tags.Where(t => tagNames.Any(tn => t.Name == tn));
                    foreach(var connectedTag in connectedTags)
                    {
                        tags.Add(new Models.ShopTag
                        {
                            Id = Guid.NewGuid().ToString(),
                            TagName = connectedTag.Name,
                            ShopId = shop.Id
                        });
                    }

                    var connectedTagNames = (await connectedTags.Select(t => t.Name).ToListAsync().ConfigureAwait(false));
                    foreach (var notExistingTagName in tagNames.Where(tn => !connectedTagNames.Contains(tn)))
                    {
                        var newTag = new Models.Tag
                        {
                            Name = notExistingTagName,
                            Description = notExistingTagName
                        };
                        _context.Tags.Add(newTag);
                        tags.Add(new Models.ShopTag
                        {
                            Id = Guid.NewGuid().ToString(),
                            TagName = notExistingTagName,
                            ShopId = shop.Id,
                            Tag = newTag
                        });
                    }
                }

                record.ShopTags = tags;
                _context.Shops.Add(record);
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
            return await _context.Shops.Include(c => c.Category)
                .Include(c => c.PaymentMethods)
                .Include(c => c.ShopTags)
                .Select(s => s.ToDomain()).ToListAsync().ConfigureAwait(false);
        }

        public async Task<Shop> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var shop = await _context.Shops.Include(c => c.Category)
                .Include(c => c.PaymentMethods)
                .Include(c => c.ShopTags).FirstOrDefaultAsync(s => s.Id == id).ConfigureAwait(false);
            if (shop == null)
            {
                return null;
            }

            return shop.ToDomain();
        }

        public async Task<IEnumerable<Shop>> Search(SearchShopsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Shop> shops = _context.Shops.Include(c => c.Category)
                .Include(c => c.PaymentMethods)
                .Include(c => c.ShopTags);
            if (!string.IsNullOrWhiteSpace(parameter.CategoryId))
            {
                shops = shops.Where(s => s.CategoryId == parameter.CategoryId);
            }

            if (!string.IsNullOrWhiteSpace(parameter.Subject))
            {
                shops = shops.Where(s => s.Subject == parameter.Subject);
            }

            if (!string.IsNullOrWhiteSpace(parameter.PlaceId))
            {
                shops = shops.Where(s => s.PlaceId == parameter.PlaceId);
            }

            if (parameter.NorthEast != null && parameter.SouthWest != null)
            {
                shops = shops.Where(s => s.Latitude >= parameter.SouthWest.Latitude && s.Latitude <= parameter.NorthEast.Latitude && s.Longitude >= parameter.SouthWest.Longitude && s.Longitude <= parameter.NorthEast.Longitude);
            }

            return await shops.Select(s => s.ToDomain()).ToListAsync().ConfigureAwait(false);
        }
    }
}
