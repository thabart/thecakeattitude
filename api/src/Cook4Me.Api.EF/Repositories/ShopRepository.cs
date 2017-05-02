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

using Cook4Me.Api.Core.Models;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.EF.Extensions;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Cook4Me.Api.Core.Parameters;
using System.Linq.Expressions;
using Cook4Me.Api.Core.Results;

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
                .Include(c => c.Comments)
                .Include(c => c.Filters)
                .Include(c => c.ProductCategories)
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
                .Include(c => c.ShopTags)
                .Include(c => c.Comments)
                .Include(c => c.Filters)
                .Include(c => c.ProductCategories)
                .FirstOrDefaultAsync(s => s.Id == id).ConfigureAwait(false);
            if (shop == null)
            {
                return null;
            }

            return shop.ToDomain();
        }

        public async Task<SearchShopsResult> Search(SearchShopsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Shop> shops = _context.Shops.Include(c => c.Category)
                .Include(c => c.PaymentMethods)
                .Include(c => c.ShopTags)
                .Include(c => c.Comments)
                .Include(c => c.Filters)
                .Include(c => c.ProductCategories);
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

            if (parameter.OrderBy != null)
            {
                foreach(var orderBy in parameter.OrderBy)
                {
                    shops = Order(orderBy, "update_datetime", s => s.UpdateDateTime, shops);
                    shops = Order(orderBy, "create_datetime", s => s.UpdateDateTime, shops);
                    shops = Order(orderBy, "nb_comments", s => s.Comments.Count(), shops);
                    shops = Order(orderBy, "total_score", s => s.TotalScore, shops);
                    shops = Order(orderBy, "average_score", s => s.AverageScore, shops);
                }
            }

            var result = new SearchShopsResult
            {
                TotalResults = await shops.CountAsync().ConfigureAwait(false),
                StartIndex = parameter.StartIndex
            };

            if (parameter.IsPagingEnabled)
            {
                shops = shops.Skip(parameter.StartIndex).Take(parameter.Count);
            }

            result.Content = await shops.Select(c => c.ToDomain()).ToListAsync().ConfigureAwait(false);
            return result;
        }

        private static IQueryable<Models.Shop> Order<TKey>(OrderBy orderBy, string key, Expression<Func<Models.Shop, TKey>> keySelector, IQueryable<Models.Shop> shops)
        {
            if (string.Equals(orderBy.Target, key, StringComparison.CurrentCultureIgnoreCase))
            {
                if (orderBy.Method == OrderByMethods.Ascending)
                {
                   return shops.OrderBy(keySelector);
                }

                return  shops.OrderByDescending(keySelector);
            }

            return shops;
        }

        public async Task<bool> Update(Shop shop)
        {
            if (shop == null)
            {
                throw new ArgumentNullException(nameof(shop));
            }

            using (var transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false))
            {
                try
                {
                    var record = await _context.Shops.FirstOrDefaultAsync(s => s.Id == shop.Id).ConfigureAwait(false);
                    if (record == null)
                    {
                        return false;
                    }

                    record.BannerImage = shop.BannerImage;
                    record.CategoryId = shop.CategoryId;
                    record.Country = shop.Country;
                    record.Description = shop.Description;
                    record.GooglePlaceId = shop.GooglePlaceId;
                    record.Latitude = shop.Latitude;
                    record.Locality = shop.Locality;
                    record.Longitude = shop.Longitude;
                    record.MapName = shop.MapName;
                    record.Name = shop.Name;
                    record.PostalCode = shop.PostalCode;
                    record.ProfileImage = shop.ProfileImage;
                    record.ShopRelativePath = shop.ShopRelativePath;
                    record.StreetAddress = shop.StreetAddress;
                    record.Subject = shop.Subject;
                    record.TotalScore = shop.TotalScore;
                    record.AverageScore = shop.AverageScore;
                    record.UpdateDateTime = shop.UpdateDateTime;
                    await _context.SaveChangesAsync().ConfigureAwait(false);
                    transaction.Commit();
                    return true;
                }
                catch
                {
                    transaction.Rollback();
                    return false;
                }
            }
        }
    }
}
