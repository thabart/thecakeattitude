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
using Cook4Me.Api.Core.Results;
using Cook4Me.Api.EF.Extensions;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace Cook4Me.Api.EF.Repositories
{
    public class ShopRepository : IShopRepository
    {
        private readonly CookDbContext _context;

        public ShopRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<bool> Add(ShopAggregate shop)
        {
            try
            {
                var record = shop.ToModel();
                var tags = new List<Models.ShopTag>();
                var filters = new List<Models.Filter>();
                var productCategories = new List<Models.ProductCategory>();
                if (shop.TagNames != null && shop.TagNames.Any()) // Add tags
                {
                    var tagNames = shop.TagNames;
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

                if (shop.ShopFilters != null)
                {
                    foreach(var shopFilter in shop.ShopFilters)
                    {
                        filters.Add(new Models.Filter
                        {
                            Id = shopFilter.Id,
                            Name = shopFilter.Name,
                            ShopId = shop.Id,
                            Values = shopFilter.Values == null ? new List<Models.FilterValue>() : shopFilter.Values.Select(v => new Models.FilterValue
                            {
                                Id = v.Id,
                                Content = v.Content,
                                CreateDateTime = v.CreateDateTime,
                                UpdateDateTime = v.UpdateDateTime,
                                FilterId = shopFilter.Id
                            }).ToList()
                        });
                    }
                }

                if (shop.ProductCategories != null)
                {
                    foreach(var productCategory in shop.ProductCategories)
                    {
                        productCategories.Add(new Models.ProductCategory
                        {
                            Id = productCategory.Id,
                            Description = productCategory.Description,
                            Name = productCategory.Name,
                            ShopId = shop.Id,
                            CreateDateTime = productCategory.CreateDateTime,
                            UpdateDateTime = productCategory.UpdateDateTime
                        });
                    }
                }

                record.ProductCategories = productCategories;
                record.Filters = filters;
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

        public async Task<IEnumerable<ShopAggregate>> Get()
        {
            return await _context.Shops.Include(c => c.Category)
                .Include(c => c.PaymentMethods)
                .Include(c => c.ShopTags)
                .Include(c => c.ShopMap)
                .Include(c => c.CategoryMap)
                .Include(c => c.Comments)
                .Include(c => c.Filters).ThenInclude(f => f.Values)
                .Include(c => c.ProductCategories)
                .Select(s => s.ToAggregate()).ToListAsync().ConfigureAwait(false);
        }

        public async Task<ShopAggregate> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var shop = await _context.Shops.Include(c => c.Category)
                .Include(c => c.PaymentMethods)
                .Include(c => c.ShopTags)
                .Include(c => c.Comments)
                .Include(c => c.ShopMap)
                .Include(c => c.CategoryMap)
                .Include(c => c.Filters).ThenInclude(f => f.Values)
                .Include(c => c.ProductCategories)
                .FirstOrDefaultAsync(s => s.Id == id).ConfigureAwait(false);
            if (shop == null)
            {
                return null;
            }

            return shop.ToAggregate();
        }

        public async Task<bool> Update(ShopAggregate shop)
        {
            if (shop == null)
            {
                throw new ArgumentNullException(nameof(shop));
            }

            using (var transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false))
            {
                try
                {
                    var record = await _context.Shops
                        .Include(s => s.Comments)
                        .Include(s => s.PaymentMethods)
                        .Include(c => c.ShopMap)
                        .Include(c => c.CategoryMap)
                        .Include(s => s.ProductCategories)
                        .Include(s => s.ShopTags)
                        .Include(s => s.Filters).ThenInclude(f => f.Values)
                        .FirstOrDefaultAsync(s => s.Id == shop.Id).ConfigureAwait(false);
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
                    record.CategoryMapName = shop.CategoryMapName;
                    record.Name = shop.Name;
                    record.PostalCode = shop.PostalCode;
                    record.ProfileImage = shop.ProfileImage;
                    record.StreetAddress = shop.StreetAddress;
                    record.Subject = shop.Subject;
                    record.TotalScore = shop.TotalScore;
                    record.AverageScore = shop.AverageScore;
                    record.UpdateDateTime = shop.UpdateDateTime;

                    var tags = new List<Models.ShopTag>(); // Update tags.
                    var shopTags = shop.TagNames == null ? new List<string>() : shop.TagNames;
                    var tagNames = shop.TagNames;
                    var connectedTags = _context.Tags.Where(t => tagNames.Any(tn => t.Name == tn));
                    foreach (var connectedTag in connectedTags)
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
                    record.ShopTags = tags; 

                    var paymentMethods = shop.ShopPaymentMethods == null ? new List<ShopPaymentMethod>() : shop.ShopPaymentMethods; // Update payment methods.
                    var paymentMethodIds = paymentMethods.Select(p => p.Id);
                    var paymentsToUpdate = record.PaymentMethods.Where(c => paymentMethodIds.Contains(c.Id));
                    var paymentsToRemove = record.PaymentMethods.Where(c => !paymentMethodIds.Contains(c.Id));
                    var existingPaymentIds = record.PaymentMethods.Select(c => c.Id);
                    var paymentsToAdd = paymentMethods.Where(c => !existingPaymentIds.Contains(c.Id));
                    foreach (var paymentToUpdate in paymentsToUpdate)
                    {
                        var payment = paymentMethods.First(c => c.Id == paymentToUpdate.Id);
                        paymentToUpdate.Method = (int)payment.Method;
                        paymentToUpdate.Iban = payment.Iban;
                        paymentToUpdate.PaypalAccount = payment.PaypalAccount;
                    }

                    foreach (var paymentToRemove in paymentsToRemove)
                    {
                        _context.PaymentMethods.Remove(paymentToRemove);
                    }

                    foreach (var paymentToAdd in paymentsToAdd)
                    {
                        var rec = new Models.PaymentMethod
                        {
                            Id = paymentToAdd.Id,
                            Iban = paymentToAdd.Iban,
                            Method = (int)paymentToAdd.Method,
                            ShopId = shop.Id,
                            PaypalAccount = paymentToAdd.PaypalAccount
                        };
                        _context.PaymentMethods.Add(rec);
                    }

                    var productCategories = shop.ProductCategories == null ? new List<ShopProductCategory>() : shop.ProductCategories;
                    var productCategoryIds = productCategories.Select(p => p.Id);
                    var productCategoriesToUpdate = record.ProductCategories.Where(c => productCategoryIds.Contains(c.Id));
                    var productCategoriesToRemove = record.ProductCategories.Where(c => !productCategoryIds.Contains(c.Id));
                    var existingCategoryIds = record.ProductCategories.Select(c => c.Id);
                    var productCategoriesToAdd = productCategories.Where(c => !existingCategoryIds.Contains(c.Id));
                    foreach(var productCategoryToUpdate in productCategoriesToUpdate)
                    {
                        var productCategory = productCategories.First(p => p.Id == productCategoryToUpdate.Id);
                        productCategoryToUpdate.Name = productCategory.Name;
                        productCategoryToUpdate.UpdateDateTime = productCategory.UpdateDateTime;
                        productCategoryToUpdate.Description = productCategory.Description;
                        productCategoryToUpdate.ShopSectionName = productCategory.ShopSectionName;
                    }

                    foreach(var productCategoryToRemove in productCategoriesToRemove)
                    {
                        _context.ProductCategories.Remove(productCategoryToRemove);
                    }

                    foreach(var productCategoryToAdd in productCategoriesToAdd)
                    {
                        var rec = new Models.ProductCategory
                        {
                            Id = productCategoryToAdd.Id,
                            Description = productCategoryToAdd.Description,
                            Name = productCategoryToAdd.Name,
                            CreateDateTime = productCategoryToAdd.CreateDateTime,
                            UpdateDateTime = productCategoryToAdd.UpdateDateTime,
                            ShopId = shop.Id,
                            ShopSectionName = productCategoryToAdd.ShopSectionName
                        };
                        _context.ProductCategories.Add(rec);
                    }

                    var filters = shop.ShopFilters == null ? new List<ShopFilter>() : shop.ShopFilters; // Update filters.
                    var filterIds = filters.Select(c => c.Id);
                    var filtersToUpdate = record.Filters.Where(c => filterIds.Contains(c.Id));
                    var filtersToRemove = record.Filters.Where(c => !filterIds.Contains(c.Id));
                    var existingFilterIds = record.Filters.Select(c => c.Id);
                    var filtersToAdd = filters.Where(c => !existingFilterIds.Contains(c.Id));
                    foreach (var filterToUpdate in filtersToUpdate)
                    {
                        var filter = filters.First(c => c.Id == filterToUpdate.Id);
                        filterToUpdate.Name = filter.Name;
                        var filterValues = filter.Values == null ? new List<ShopFilterValue>() : filter.Values;
                        var filterValueIds = filterValues.Select(f => f.Id);
                        var filterValuesToUpdate = filterToUpdate.Values.Where(v => filterValueIds.Contains(v.Id)); // Update filter values.
                        var filterValuesToRemove = filterToUpdate.Values.Where(v => !filterValueIds.Contains(v.Id));
                        var existingFilterValueIds = filterToUpdate.Values.Select(v => v.Id);
                        var filterValuesToAdd = filter.Values.Where(v => !existingFilterValueIds.Contains(v.Id));
                        foreach(var filterValueToUpdate in filterValuesToUpdate)
                        {
                            var filterValue = filterToUpdate.Values.First(v => v.Id == filterValueToUpdate.Id);
                            filterValue.UpdateDateTime = filterValueToUpdate.UpdateDateTime;
                            filterValue.Content = filterValueToUpdate.Content;
                        }

                        foreach(var filterValueToRemove in filterValuesToRemove)
                        {
                            _context.FilterValues.Remove(filterValueToRemove);
                        }

                        foreach(var filterValueToAdd in filterValuesToAdd)
                        {
                            var rec = new Models.FilterValue
                            {
                                Id = filterValueToAdd.Id,
                                Content = filterValueToAdd.Content,
                                CreateDateTime = filterValueToAdd.CreateDateTime,
                                UpdateDateTime = filterValueToAdd.UpdateDateTime,
                                FilterId = filter.Id
                            };
                            _context.FilterValues.Add(rec);
                        }
                    }

                    foreach (var filterToRemove in filtersToRemove)
                    {
                        _context.Filters.Remove(filterToRemove);
                    }

                    foreach (var filterToAdd in filtersToAdd)
                    {
                        var rec = new Models.Filter
                        {
                            Id = filterToAdd.Id,
                            Name = filterToAdd.Name,
                            ShopId = shop.Id,
                            Values = filterToAdd.Values == null ? new List<Models.FilterValue>() : filterToAdd.Values.Select(v => new Models.FilterValue
                            {
                                Id = v.Id,
                                Content = v.Content,
                                CreateDateTime = v.CreateDateTime,
                                UpdateDateTime = v.UpdateDateTime,
                                FilterId = filterToAdd.Id
                            }).ToList()
                        };
                        _context.Filters.Add(rec);
                    }
                    
                    var comments = shop.Comments == null ? new List<ShopComment>() : shop.Comments; // Update comments
                    var commentIds = comments.Select(c => c.Id);
                    var commentsToUpdate = record.Comments.Where(c => commentIds.Contains(c.Id)); 
                    var commentsToRemove = record.Comments.Where(c => !commentIds.Contains(c.Id));
                    var existingCommentIds = record.Comments.Select(c => c.Id);
                    var commentsToAdd = comments.Where(c => !existingCommentIds.Contains(c.Id));
                    foreach(var commentToUpdate in commentsToUpdate)
                    {
                        var comment = comments.First(c => c.Id == commentToUpdate.Id);
                        commentToUpdate.Score = comment.Score;
                        commentToUpdate.Subject = comment.Subject;
                        commentToUpdate.UpdateDateTime = comment.UpdateDateTime;
                        commentToUpdate.Content = comment.Content;
                    }

                    foreach(var commentToRemove in commentsToRemove)
                    {
                        _context.Comments.Remove(commentToRemove);
                    }

                    foreach(var commentToAdd in commentsToAdd)
                    {
                        var rec = new Models.Comment
                        {
                            Id = commentToAdd.Id,
                            Content = commentToAdd.Content,
                            Score = commentToAdd.Score,
                            CreateDateTime = commentToAdd.CreateDateTime,
                            ShopId = shop.Id,
                            UpdateDateTime = commentToAdd.UpdateDateTime,
                            Subject = commentToAdd.Subject
                        };
                        _context.Comments.Add(rec);
                    }

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

        public async Task<SearchShopsResult> Search(SearchShopsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Shop> shops = _context.Shops.Include(c => c.Category)
                .Include(c => c.PaymentMethods)
                .Include(c => c.ShopTags).ThenInclude(t => t.Tag)
                .Include(c => c.Comments)
                .Include(c => c.ShopMap)
                .Include(c => c.CategoryMap)
                .Include(c => c.Filters).ThenInclude(f => f.Values)
                .Include(c => c.ProductCategories);
            if (parameter.CategoryIds != null && parameter.CategoryIds.Any())
            {
                shops = shops.Where(s => parameter.CategoryIds.Contains(s.CategoryId));
            }

            if (parameter.ShopIds != null && parameter.ShopIds.Any())
            {
                shops = shops.Where(s => parameter.ShopIds.Contains(s.Id));
            }

            if (parameter.Tags != null && parameter.Tags.Any())
            {
                shops = shops.Where(s => s.ShopTags.Count() > 0 && s.ShopTags.Any(t => parameter.Tags.Contains(t.TagName)));
            }

            if (!string.IsNullOrWhiteSpace(parameter.Name))
            {
                shops = shops.Where(s => s.Name.ToLowerInvariant().Contains(parameter.Name.ToLowerInvariant()));
            }

            if (parameter.Subjects != null && parameter.Subjects.Any())
            {
                shops = shops.Where(s => parameter.Subjects.Contains(s.Subject));
            }

            if (parameter.CategoryMapNames != null && parameter.CategoryMapNames.Any())
            {
                shops = shops.Where(s => parameter.CategoryMapNames.Contains(s.CategoryMapName));
            }

            if (parameter.PlaceIds != null && parameter.PlaceIds.Any())
            {
                shops = shops.Where(s => parameter.PlaceIds.Contains(s.PlaceId));
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
                    shops = Order(orderBy, "create_datetime", s => s.CreateDateTime, shops);
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

            result.Content = await shops.Select(c => c.ToAggregate()).ToListAsync().ConfigureAwait(false);
            return result;
        }

        public async Task<SearchShopCommentsResult> SearchComments(SearchShopCommentsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Comment> comments = _context.Comments;
            if (!string.IsNullOrWhiteSpace(parameter.ShopId))
            {
                comments = comments.Where(c => parameter.ShopId == c.ShopId);
            }

            if (!string.IsNullOrWhiteSpace(parameter.Subject))
            {
                comments = comments.Where(c => c.Subject == parameter.Subject);
            }

            var result = new SearchShopCommentsResult
            {
                TotalResults = await comments.CountAsync().ConfigureAwait(false),
                StartIndex = parameter.StartIndex
            };

            comments = comments
                .OrderByDescending(c => c.UpdateDateTime);
            if (parameter.IsPagingEnabled)
            {
                comments = comments.Skip(parameter.StartIndex).Take(parameter.Count);
            }

            result.Content = await comments.Select(c => c.ToAggregate()).ToListAsync().ConfigureAwait(false);
            return result;
        }

        public async Task<bool> Remove(ShopAggregate shop)
        {
            if (shop == null)
            {
                throw new ArgumentNullException(nameof(shop));
            }

            var record = await _context.Shops.FirstOrDefaultAsync(s => s.Id == shop.Id);
            if (record == null)
            {
                return false;
            }

            try
            {
                _context.Shops.Remove(record);
                await _context.SaveChangesAsync();
                return true;
            }
            catch
            {
                return false;
            }
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
    }
}
