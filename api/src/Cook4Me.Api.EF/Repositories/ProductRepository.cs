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
    internal class ProductRepository : IProductRepository
    {
        private readonly CookDbContext _context;

        public ProductRepository(CookDbContext context)
        {
            _context = context;
        }

        public async Task<SearchProductsResult> Search(SearchProductsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            IQueryable<Models.Product> products = _context.Products
                .Include(p => p.Images)
                .Include(p => p.Tags).ThenInclude(t => t.Tag)
                .Include(p => p.Shop)
                .Include(p => p.Comments)
                .Include(p => p.Filters).ThenInclude(p => p.FilterValue).ThenInclude(p => p.Filter)
                .Include(p => p.Promotions);
            if (parameter.ShopIds != null && parameter.ShopIds.Any())
            {
                products = products.Where(p => parameter.ShopIds.Contains(p.ShopId));
            }

            if (parameter.ProductIds != null && parameter.ProductIds.Any())
            {
                products = products.Where(p => parameter.ProductIds.Contains(p.Id));
            }

            if (!string.IsNullOrWhiteSpace(parameter.TagName))
            {
                products = products.Where(s => s.Tags.Count() > 0 && s.Tags.Any(t => t.TagName.ToLowerInvariant().Contains(parameter.TagName.ToLowerInvariant())));
            }

            if (parameter.ContainsActivePromotion != null)
            {
                var currentDate = DateTime.UtcNow;
                if (parameter.ContainsActivePromotion.Value)
                {
                    products = products.Where(p => p.Promotions.Any(pm => pm.Code == null && pm.ExpirationDateTime > currentDate));
                }
                else
                {
                    products = products.Where(p => !p.Promotions.Any(pm => pm.Code == null && pm.ExpirationDateTime > currentDate));
                }                
            }

            if (parameter.NorthEast != null && parameter.SouthWest != null)
            {
                products = products.Where(p => p.Shop.Latitude >= parameter.SouthWest.Latitude && p.Shop.Latitude <= parameter.NorthEast.Latitude
                    && p.Shop.Longitude >= parameter.SouthWest.Longitude && p.Shop.Longitude <= parameter.NorthEast.Longitude);
            }

            if (!string.IsNullOrWhiteSpace(parameter.ProductName))
            {
                products = products.Where(p => p.Name.ToLowerInvariant().Contains(parameter.ProductName.ToLowerInvariant()));
            }

            if (parameter.CategoryIds != null && parameter.CategoryIds.Any())
            {
                products = products.Where(p => parameter.CategoryIds.Contains(p.CategoryId));
            }

            if (parameter.ShopCategoryIds != null && parameter.ShopCategoryIds.Any())
            {
                products = products.Where(p => parameter.ShopCategoryIds.Contains(p.Shop.CategoryId));
            }

            if (parameter.Filters != null)
            {
                foreach(var filter in parameter.Filters)
                {
                    products = products.Where(p => p.Filters.Any(f => f.FilterValue.Content == filter.Value && f.FilterValue.FilterId == filter.Id));
                }
            }

            if (parameter.FilterPrice != null)
            {
                products = products.Where(p => p.NewPrice >= parameter.FilterPrice.Min && p.NewPrice <= parameter.FilterPrice.Max);
            }

            var result = new SearchProductsResult
            {
                TotalResults = await products.CountAsync().ConfigureAwait(false),
                StartIndex = parameter.StartIndex
            };
            
            if (parameter.Orders != null)
            {
                foreach (var order in parameter.Orders)
                {
                    products = Order(order, "update_datetime", s => s.UpdateDateTime, products);
                    products = Order(order, "create_datetime", s => s.CreateDateTime, products);
                    products = Order(order, "price", s => s.NewPrice, products);
                }
            }

            if (parameter.IsPagingEnabled)
            {
                products = products.Skip(parameter.StartIndex).Take(parameter.Count);
            }

            result.Content = await products.Select(p => p.ToAggregate()).ToListAsync().ConfigureAwait(false);
            return result;
        }

        public async Task<ProductAggregate> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            IQueryable<Models.Product> products = _context.Products
                .Include(p => p.Images)
                .Include(p => p.Tags)
                .Include(p => p.Shop)
                .Include(p => p.Comments)
                .Include(p => p.Filters).ThenInclude(p => p.FilterValue).ThenInclude(p => p.Filter)
                .Include(p => p.Promotions);
            var result = await products.FirstOrDefaultAsync(p => p.Id == id).ConfigureAwait(false);
            if (result == null)
            {
                return null;
            }

            return result.ToAggregate();
        }

        public async Task<SearchProductCommentsResult> Search(SearchProductCommentsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }


            IQueryable<Models.Comment> comments = _context.Comments;
            if (!string.IsNullOrWhiteSpace(parameter.ProductId))
            {
                comments = comments.Where(c => parameter.ProductId == c.ProductId);
            }

            if (!string.IsNullOrWhiteSpace(parameter.Subject))
            {
                comments = comments.Where(c => c.Subject == parameter.Subject);
            }

            var result = new SearchProductCommentsResult
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

            result.Content = await comments.Select(c => c.ToProductCommentAggregate()).ToListAsync().ConfigureAwait(false);
            return result;
        }

        public async Task<bool> Update(ProductAggregate productAggregate)
        {
            if (productAggregate == null)
            {
                throw new ArgumentNullException(nameof(productAggregate));
            }
            
            using (var transaction = await _context.Database.BeginTransactionAsync().ConfigureAwait(false))
            {
                try
                {
                    var record = await _context.Products.Include(s => s.Comments).FirstOrDefaultAsync(s => s.Id == productAggregate.Id).ConfigureAwait(false);
                    if (record == null)
                    {
                        return false;
                    }

                    record.AverageScore = productAggregate.AverageScore;
                    record.CategoryId = productAggregate.CategoryId;
                    record.Description = productAggregate.Description;
                    record.Name = productAggregate.Name;
                    record.NewPrice = productAggregate.NewPrice;
                    record.Price = productAggregate.Price;
                    record.Quantity = productAggregate.Quantity;
                    record.ShopId = productAggregate.ShopId;
                    record.TotalScore = productAggregate.TotalScore;
                    record.UnitOfMeasure = productAggregate.UnitOfMeasure;
                    record.UpdateDateTime = productAggregate.UpdateDateTime;
                    var comments = productAggregate.Comments == null ? new List<ProductComment>() : productAggregate.Comments;
                    var commentIds = comments.Select(c => c.Id);
                    // Update the comments
                    if (record.Comments != null)
                    {
                        var commentsToUpdate = record.Comments.Where(c => commentIds.Contains(c.Id));
                        var commentsToRemove = record.Comments.Where(c => !commentIds.Contains(c.Id));
                        var existingCommentIds = record.Comments.Select(c => c.Id);
                        var commentsToAdd = comments.Where(c => !existingCommentIds.Contains(c.Id));
                        foreach (var commentToUpdate in commentsToUpdate)
                        {
                            var comment = comments.First(c => c.Id == commentToUpdate.Id);
                            commentToUpdate.Score = comment.Score;
                            commentToUpdate.Subject = comment.Subject;
                            commentToUpdate.UpdateDateTime = comment.UpdateDateTime;
                            commentToUpdate.Content = comment.Content;
                        }

                        foreach (var commentToRemove in commentsToRemove)
                        {
                            _context.Comments.Remove(commentToRemove);
                        }

                        foreach (var commentToAdd in commentsToAdd)
                        {
                            var rec = new Models.Comment
                            {
                                Id = commentToAdd.Id,
                                Content = commentToAdd.Content,
                                Score = commentToAdd.Score,
                                CreateDateTime = commentToAdd.CreateDateTime,
                                ProductId = productAggregate.Id,
                                UpdateDateTime = commentToAdd.UpdateDateTime,
                                Subject = commentToAdd.Subject
                            };
                            _context.Comments.Add(rec);
                        }
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

        public async Task<bool> Insert(ProductAggregate productAggregate)
        {
            if (productAggregate == null)
            {
                throw new ArgumentNullException(nameof(productAggregate));
            }

            try
            {
                var record = productAggregate.ToModel();
                var tags = new List<Models.ProductTag>();
                if (productAggregate.Tags != null && productAggregate.Tags.Any()) // Add tags
                {
                    var tagNames = productAggregate.Tags;
                    var connectedTags = _context.Tags.Where(t => tagNames.Any(tn => t.Name == tn));
                    foreach (var connectedTag in connectedTags)
                    {
                        tags.Add(new Models.ProductTag
                        {
                            Id = Guid.NewGuid().ToString(),
                            TagName = connectedTag.Name,
                            ProductId = productAggregate.Id
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
                        tags.Add(new Models.ProductTag
                        {
                            Id = Guid.NewGuid().ToString(),
                            TagName = notExistingTagName,
                            ProductId = productAggregate.Id,
                            Tag = newTag
                        });
                    }
                }

                if (productAggregate.Filters != null && productAggregate.Filters.Any()) // Add filters
                {
                    var ids = productAggregate.Filters.Select(f => f.FilterValueId);
                    var filters = await _context.FilterValues.Where(f => ids.Contains(f.Id)).Select(f => 
                        new Models.ProductFilter
                        {
                            Id = Guid.NewGuid().ToString(),
                            FilterValueId = f.Id,
                            ProductId = productAggregate.Id
                        }).ToListAsync().ConfigureAwait(false);
                    record.Filters = filters;
                }

                if (productAggregate.PartialImagesUrl != null && productAggregate.PartialImagesUrl.Any()) // Add images
                {
                    record.Images = productAggregate.PartialImagesUrl.Select(i =>
                        new Models.ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = i
                        }
                    ).ToList();
                }

                record.Tags = tags;
                _context.Products.Add(record);
                await _context.SaveChangesAsync().ConfigureAwait(false);
                return true;
            }
            catch
            {
                return false;
            }
        }

        private static IQueryable<Models.Product> Order<TKey>(OrderBy orderBy, string key, Expression<Func<Models.Product, TKey>> keySelector, IQueryable<Models.Product> products)
        {
            if (string.Equals(orderBy.Target, key, StringComparison.CurrentCultureIgnoreCase))
            {
                if (orderBy.Method == OrderByMethods.Ascending)
                {
                    return products.OrderBy(keySelector);
                }

                return products.OrderByDescending(keySelector);
            }

            return products;
        }
    }
}
