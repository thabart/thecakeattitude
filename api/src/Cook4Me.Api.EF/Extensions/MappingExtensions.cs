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
using Cook4Me.Api.EF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using Domain = Cook4Me.Api.Core.Models;

namespace Cook4Me.Api.EF.Extensions
{
    internal static class MappingExtensions
    {
        public static ShopAggregate ToAggregate(this Shop shop)
        {
            if (shop == null)
            {
                throw new ArgumentNullException(nameof(shop));
            }

            ShopCategory shopCategory = null;
            var tagNames = new List<string>();
            var paymentMethods = new List<ShopPaymentMethod>();
            var comments = new List<ShopComment>();
            var filters = new List<ShopFilter>();
            var productCategories = new List<ShopProductCategory>();
            if (shop.Category != null)
            {
                shopCategory = new ShopCategory
                {
                    Id = shop.Category.Id,
                    Name = shop.Category.Name,
                    Description = shop.Category.Description
                };
            }

            if (shop.ShopTags != null)
            {
                tagNames = shop.ShopTags.Select(t => t.TagName).ToList();
            }

            if (shop.PaymentMethods != null)
            {
                paymentMethods = shop.PaymentMethods.Select(s => new ShopPaymentMethod
                {
                    Id = s.Id,
                    Iban = s.Iban,
                    Method = (ShopPaymentMethods)s.Method
                }).ToList();
            }

            if (shop.Comments != null)
            {
                comments = shop.Comments.Select(c => new ShopComment
                {
                    Id = c.Id,
                    Content = c.Content,
                    CreateDateTime = c.CreateDateTime,
                    Subject = c.Subject,
                    UpdateDateTime = c.UpdateDateTime,
                    Score = c.Score
                }).ToList();
            }

            if (shop.Filters != null)
            {
                filters = shop.Filters.Select(f => new ShopFilter
                {
                    Id = f.Id,
                    Name = f.Name,
                    Values = f.Values == null ? new List<ShopFilterValue>() : f.Values.Select(v => new ShopFilterValue
                    {
                        Id = v.Id,
                        Content = v.Content
                    })
                }).ToList();
            }

            if (shop.ProductCategories != null)
            {
                productCategories = shop.ProductCategories.Select(c => new ShopProductCategory
                {
                    Id = c.Id,
                    Name = c.Name,
                    Description = c.Description
                }).ToList();
            }

            return new ShopAggregate
            {
                Id = shop.Id,
                Subject = shop.Subject,
                Name = shop.Name,
                Description = shop.Description,
                BannerImage = shop.BannerImage,
                ProfileImage = shop.ProfileImage,
                MapName = shop.MapName,
                CategoryId = shop.CategoryId,
                PlaceId = shop.PlaceId,
                StreetAddress = shop.StreetAddress,
                PostalCode = shop.PostalCode,
                Locality = shop.Locality,
                Country = shop.Country,
                ShopRelativePath = shop.ShopRelativePath,
                UndergroundRelativePath = shop.UndergroundRelativePath,
                CreateDateTime = shop.CreateDateTime,
                UpdateDateTime = shop.UpdateDateTime,
                GooglePlaceId = shop.GooglePlaceId,
                Latitude = shop.Latitude,
                Longitude = shop.Longitude,
                TotalScore = shop.TotalScore,
                AverageScore = shop.AverageScore,
                ShopCategory = shopCategory,
                TagNames = tagNames,
                ShopPaymentMethods = paymentMethods,
                Comments = comments,
                ShopFilters = filters,
                ProductCategories = productCategories
            };
        }

        public static Shop ToModel(this ShopAggregate shop)
        {
            if (shop == null)
            {
                throw new ArgumentNullException(nameof(shop));
            }

            var paymentMethods = new List<PaymentMethod>();
            if (shop.ShopPaymentMethods != null)
            {
                paymentMethods = shop.ShopPaymentMethods.Select(s => new PaymentMethod
                {
                    Id = s.Id,
                    Iban = s.Iban,
                    Method = (int)s.Method
                }).ToList();
            }

            return new Shop
            {
                Id = shop.Id,
                Subject = shop.Subject,
                Name = shop.Name,
                Description = shop.Description,
                BannerImage = shop.BannerImage,
                ProfileImage = shop.ProfileImage,
                MapName = shop.MapName,
                CategoryId = shop.CategoryId,
                PlaceId = shop.PlaceId,
                StreetAddress = shop.StreetAddress,
                PostalCode = shop.PostalCode,
                Locality = shop.Locality,
                Country = shop.Country,
                ShopRelativePath = shop.ShopRelativePath,
                UndergroundRelativePath = shop.UndergroundRelativePath,
                CreateDateTime = shop.CreateDateTime,
                UpdateDateTime = shop.UpdateDateTime,
                GooglePlaceId = shop.GooglePlaceId,
                Latitude = shop.Latitude,
                Longitude = shop.Longitude,
                TotalScore = shop.TotalScore,
                PaymentMethods = paymentMethods
            };
        }
        
        public static ShopCategoryAggregate ToAggregate(this Category category)
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            IEnumerable<ShopCategoryAggregate> children = null;
            if (category.Children != null && category.Children.Any())
            {
                children = category.Children.Select(c => c.ToAggregate());
            }

            IEnumerable<ShopMap> maps = null;
            if (category.Maps != null && category.Maps.Any())
            {
                maps = category.Maps.Select(m => m.ToAggregate());
            }

            return new ShopCategoryAggregate
            {
                Id = category.Id,
                Description = category.Description,
                Name = category.Name,
                ParentId = category.ParentId,
                Children = children,
                Maps = maps
            };
        }

        public static Category ToModel(this ShopCategoryAggregate category)
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            ICollection<Map> maps = null;
            if (category.Maps != null && category.Maps.Any())
            {
                maps = category.Maps.Select(m => m.ToModel()).ToList();
            }

            return new Category
            {
                Id = category.Id,
                Description = category.Description,
                Name = category.Name,
                ParentId = category.ParentId,
                Maps = maps
            };
        }

        public static ShopMap ToAggregate(this Map map)
        {
            if (map == null)
            {
                throw new ArgumentNullException(nameof(map));
            }

            return new ShopMap
            {
                CategoryId = map.CategoryId,
                MapName = map.MapName,
                OverviewName = map.OverviewName,
                PartialMapUrl = map.PartialMapUrl,
                PartialOverviewUrl = map.PartialOverviewUrl,
                IsMain = map.IsMain
            };
        }

        public static Map ToModel(this ShopMap map)
        {
            if (map == null)
            {
                throw new ArgumentNullException(nameof(map));
            }

            return new Map
            {
                CategoryId = map.CategoryId,
                MapName = map.MapName,
                OverviewName = map.OverviewName,
                PartialMapUrl = map.PartialMapUrl,
                PartialOverviewUrl = map.PartialOverviewUrl,
                IsMain = map.IsMain
            };
        }

        public static TagAggregate ToAggregate(this Tag tag)
        {
            if (tag == null)
            {
                throw new ArgumentNullException(nameof(tag));
            }

            return new TagAggregate
            {
                Name = tag.Name,
                Description = tag.Description
            };
        }

        public static Tag ToModel(this TagAggregate tag)
        {
            if (tag == null)
            {
                throw new ArgumentNullException(nameof(tag));
            }

            return new Tag
            {
                Name = tag.Name,
                Description = tag.Description
            };
        }

        public static Domain.PaymentMethod ToDomain(this PaymentMethod paymentMethod)
        {
            if (paymentMethod == null)
            {
                throw new ArgumentNullException(nameof(paymentMethod));
            }

            return new Domain.PaymentMethod
            {
                Iban = paymentMethod.Iban,
                Method = (Domain.PaymentMethods)paymentMethod.Method
            };
        }

        public static PaymentMethod ToModel(this Domain.PaymentMethod paymentMethod)
        {
            if (paymentMethod == null)
            {
                throw new ArgumentNullException(nameof(paymentMethod));
            }

            return new PaymentMethod
            {
                Id = paymentMethod.Id,
                Iban = paymentMethod.Iban,
                Method = (int)paymentMethod.Method
            };
        }

        public static ShopComment ToAggregate(this Comment comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            return new ShopComment
            {
                Id = comment.Id,
                Content = comment.Content,
                Score = comment.Score,
                Subject = comment.Subject,
                UpdateDateTime = comment.UpdateDateTime,
                CreateDateTime = comment.CreateDateTime
            };
        }

        public static Domain.Comment ToDomain(this Comment comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            return new Domain.Comment
            {
                Id = comment.Id,
                Content = comment.Content,
                Score = comment.Score,
                Subject = comment.Subject,
                ShopId = comment.ShopId,
                UpdateDateTime = comment.UpdateDateTime,
                CreateDateTime = comment.CreateDateTime
            };
        }

        public static Comment ToModel(this Domain.Comment comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            return new Comment
            {
                Id = comment.Id,
                Content = comment.Content,
                Score = comment.Score,
                Subject = comment.Subject,
                ShopId = comment.ShopId,
                UpdateDateTime = comment.UpdateDateTime,
                CreateDateTime = comment.CreateDateTime
            };
        }

        public static ProductAggregate ToAggregate(this Product product)
        {
            if(product == null)
            {
                throw new ArgumentNullException(nameof(product));
            }

            IEnumerable<string> images = new List<string>();
            if (product.Images != null)
            {
                images = product.Images.Select(i => i.PartialPath);
            }

            IEnumerable<string> tags = new List<string>();
            if (product.Tags != null)
            {
                tags = product.Tags.Select(t => t.TagName);
            }

            IEnumerable<ProductAggregateFilter> filterValues = new List<ProductAggregateFilter>();
            if (product.Filters != null)
            {
                filterValues = product.Filters.Select(f => f.ToAggregate());
            }

            IEnumerable<ProductAggregatePromotion> promotions = new List<ProductAggregatePromotion>();
            if (product.Promotions != null)
            {
                promotions = product.Promotions.Where(p => string.IsNullOrWhiteSpace(p.Code)).Select(p => p.ToAggregate());
            }

            return new ProductAggregate
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                Description = product.Description,
                CreateDateTime = product.CreateDateTime,
                UpdateDateTime = product.UpdateDateTime,
                Quantity = product.Quantity,
                Price = product.Price,
                NewPrice = product.NewPrice,
                ShopId = product.ShopId,
                UnitOfMeasure = product.UnitOfMeasure,
                Name = product.Name,
                PartialImagesUrl = images,
                Tags = tags,
                Filters = filterValues,
                Promotions = promotions
            };
        }

        public static Product ToModel(this ProductAggregate product)
        {
            if (product == null)
            {
                throw new ArgumentNullException(nameof(product));
            }

            return new Product
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                Description = product.Description,
                CreateDateTime = product.CreateDateTime,
                UpdateDateTime = product.UpdateDateTime,
                Quantity = product.Quantity,
                Price = product.Price,
                ShopId = product.ShopId,
                UnitOfMeasure = product.UnitOfMeasure,
                Name = product.Name
            };
        }

        public static Domain.Filter ToDomain(this Filter filter)
        {
            if (filter == null)
            {
                throw new ArgumentNullException(nameof(filter));
            }

            var values = new List<Domain.FilterValue>();
            if (filter.Values != null && filter.Values.Any())
            {
                values = filter.Values.Select(v => v.ToDomain()).ToList();
            }

            return new Domain.Filter
            {
                Id = filter.Id,
                Name = filter.Name,
                ShopId = filter.ShopId,
                Values = values
            };
        }

        public static Domain.FilterValue ToDomain(this FilterValue filterValue)
        {
            if (filterValue == null)
            {
                throw new ArgumentNullException(nameof(filterValue));
            }

            return new Domain.FilterValue
            {
                Id = filterValue.Id,
                Content = filterValue.Content
            };
        }

        public static ProductAggregateFilter ToAggregate(this ProductFilter filter)
        {
            if (filter == null)
            {
                throw new ArgumentNullException(nameof(filter));
            }

            if (filter.FilterValue == null || filter.FilterValue.Filter == null)
            {
                return null;
            }

            return new ProductAggregateFilter
            {
                FilterId = filter.FilterValue.Filter.Id,
                FilterName = filter.FilterValue.Filter.Name,
                FilterValueContent = filter.FilterValue.Content,
                FilterValueId = filter.FilterValue.Id
            };
        }

        public static ProductAggregateCategory ToAggregate(this ProductCategory productCategory)
        {
            if (productCategory == null)
            {
                throw new ArgumentNullException(nameof(productCategory));
            }

            return new ProductAggregateCategory
            {
                Id = productCategory.Id,
                Description = productCategory.Description,
                Name = productCategory.Name
            };
        }

        public static ProductAggregatePromotion ToAggregate(this ProductPromotion productPromotion)
        {
            if (productPromotion == null)
            {
                throw new ArgumentNullException(nameof(productPromotion));
            }

            return new ProductAggregatePromotion
            {
                Id = productPromotion.Id,
                Code = productPromotion.Code,
                Discount = productPromotion.Discount,
                ProductId = productPromotion.ProductId,
                Type = (PromotionTypes)productPromotion.Type,
                CreateDateTime = productPromotion.CreateDateTime,
                ExpirationDateTime = productPromotion.ExpirationDateTime,
                UpdateDateTime = productPromotion.UpdateDateTime
            };
        }
    }
}
