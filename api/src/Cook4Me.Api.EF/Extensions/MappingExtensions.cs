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
using Cook4Me.Api.Core.Results;
using Cook4Me.Api.EF.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Cook4Me.Api.EF.Extensions
{
    internal static class MappingExtensions
    {
        public static FilterResult ToAggregate(this Filter filter)
        {
            if (filter == null)
            {
                throw new ArgumentNullException(nameof(filter));
            }

            return new FilterResult
            {
                Id = filter.Id,
                Name = filter.Name
            };
        }

        public static FilterValueResult ToAggregate(this FilterValue filter)
        {
            if (filter == null)
            {
                throw new ArgumentNullException(nameof(filter));
            }

            return new FilterValueResult
            {
                Id = filter.Id,
                Content = filter.Content
            };
        }

        public static AnnouncementAggregate ToAggregate(this Announcement announcement)
        {
            if (announcement == null)
            {
                throw new ArgumentNullException(nameof(announcement));
            }

            AnnouncementCategory category = null;
            if (announcement.Category != null)
            {
                category = announcement.Category.ToCategoryAggregate();
            }

            return new AnnouncementAggregate
            {
                Id = announcement.Id,
                CategoryId = announcement.CategoryId,
                CreateDateTime = announcement.CreateDateTime,
                Description = announcement.Description,
                Name = announcement.Name,
                Subject = announcement.Subject,
                UpdateDateTime = announcement.UpdateDateTime,
                Longitude = announcement.Longitude,
                Latitude = announcement.Latitude,
                Price = announcement.Price,
                GooglePlaceId = announcement.GooglePlaceId,
                Category = category,
                StreetAddress = announcement.StreetAddress
            };
        }

        public static Announcement ToModel(this AnnouncementAggregate announcement)
        {
            if (announcement == null)
            {
                throw new ArgumentNullException(nameof(announcement));
            }

            return new Announcement
            {
                Id = announcement.Id,
                CategoryId = announcement.CategoryId,
                CreateDateTime = announcement.CreateDateTime,
                Description = announcement.Description,
                Name = announcement.Name,
                Subject = announcement.Subject,
                UpdateDateTime = announcement.UpdateDateTime,
                Latitude = announcement.Latitude,
                Longitude = announcement.Longitude,
                Price = announcement.Price,
                GooglePlaceId = announcement.GooglePlaceId,
                StreetAddress = announcement.StreetAddress
            };
        }

        public static Service ToModel(this ServiceAggregate aggregate)
        {
            if (aggregate == null)
            {
                throw new ArgumentNullException(nameof(aggregate));
            }

            return new Service
            {
                Id = aggregate.Id,
                Name = aggregate.Name,
                Description = aggregate.Description,
                NewPrice = aggregate.NewPrice,
                Price = aggregate.Price,
                ShopId = aggregate.ShopId,
                UpdateDateTime = aggregate.UpdateDateTime,
                TotalScore = aggregate.TotalScore,
                AverageScore = aggregate.AverageScore,
                CreateDateTime = aggregate.CreateDateTime
            };
        }

        public static AnnouncementCategory ToCategoryAggregate(this Category category)
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            return new AnnouncementCategory
            {
                Id = category.Id,
                Description = category.Description,
                Name = category.Name
            };
        }

        public static Category ToModel(this AnnouncementCategory category)
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            return new Category
            {
                Id = category.Id,
                Description = category.Description,
                Name = category.Name
            };
        }

        public static ShopAggregate ToAggregate(this Shop shop)
        {
            if (shop == null)
            {
                throw new ArgumentNullException(nameof(shop));
            }

            ShopCategory shopCategory = null;
            ShopMap shopMap = null;
            ShopMap categoryMap = null;
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
                    Description = shop.Category.Description,
                    PinImagePartialPath = shop.Category.PinImagePartialPath
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
                    Method = (ShopPaymentMethods)s.Method,
                    PaypalAccount = s.PaypalAccount
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
                    Description = c.Description,
                    ShopSectionName = c.ShopSectionName
                }).ToList();
            }

            if (shop.CategoryMap != null)
            {
                categoryMap = new ShopMap
                {
                    MapName = shop.CategoryMap.MapName,
                    OverviewName = shop.CategoryMap.OverviewName,
                    PartialOverviewUrl = shop.CategoryMap.PartialOverviewUrl,
                    PartialMapUrl = shop.CategoryMap.PartialMapUrl,
                    CategoryId = shop.CategoryMap.CategoryId,
                    IsMain = shop.CategoryMap.IsMain
                };
            }

            if (shop.ShopMap != null)
            {
                shopMap = new ShopMap
                {
                    MapName = shop.ShopMap.MapName,
                    OverviewName = shop.ShopMap.OverviewName,
                    PartialOverviewUrl = shop.ShopMap.PartialOverviewUrl,
                    PartialMapUrl = shop.ShopMap.PartialMapUrl,
                    IsMain = shop.ShopMap.IsMain
                };
            }

            return new ShopAggregate
            {
                Id = shop.Id,
                Subject = shop.Subject,
                Name = shop.Name,
                Description = shop.Description,
                BannerImage = shop.BannerImage,
                ProfileImage = shop.ProfileImage,
                ShopMapName = shop.ShopMapName,
                CategoryMapName = shop.CategoryMapName,
                CategoryId = shop.CategoryId,
                PlaceId = shop.PlaceId,
                StreetAddress = shop.StreetAddress,
                PostalCode = shop.PostalCode,
                Locality = shop.Locality,
                Country = shop.Country,
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
                ProductCategories = productCategories,
                ShopMap = shopMap,
                CategoryMap = categoryMap
            };
        }

        public static Shop ToModel(this ShopAggregate shop)
        {
            if (shop == null)
            {
                throw new ArgumentNullException(nameof(shop));
            }

            var shopMap = new Map();
            if (shop.ShopMap != null)
            {
                shopMap = shop.ShopMap.ToModel();
            }

            var paymentMethods = new List<PaymentMethod>();
            if (shop.ShopPaymentMethods != null)
            {
                paymentMethods = shop.ShopPaymentMethods.Select(s => new PaymentMethod
                {
                    Id = s.Id,
                    Iban = s.Iban,
                    PaypalAccount = s.PaypalAccount,
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
                CategoryMapName = shop.CategoryMapName,
                CategoryId = shop.CategoryId,
                PlaceId = shop.PlaceId,
                StreetAddress = shop.StreetAddress,
                PostalCode = shop.PostalCode,
                Locality = shop.Locality,
                Country = shop.Country,
                CreateDateTime = shop.CreateDateTime,
                UpdateDateTime = shop.UpdateDateTime,
                GooglePlaceId = shop.GooglePlaceId,
                Latitude = shop.Latitude,
                Longitude = shop.Longitude,
                TotalScore = shop.TotalScore,
                PaymentMethods = paymentMethods,
                ShopMap = shopMap
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
                Maps = maps,
                PinImagePartialPath = category.PinImagePartialPath
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
                Maps = maps,
                PinImagePartialPath = category.PinImagePartialPath
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

        public static ProductComment ToProductCommentAggregate(this Comment comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            return new ProductComment
            {
                Id = comment.Id,
                Content = comment.Content,
                Score = comment.Score,
                Subject = comment.Subject,
                UpdateDateTime = comment.UpdateDateTime,
                CreateDateTime = comment.CreateDateTime
            };
        }

        public static ProductComment ToAggregateProduct(this Comment comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            return new ProductComment
            {
                Id = comment.Id,
                Content = comment.Content,
                Score = comment.Score,
                Subject = comment.Subject,
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
                filterValues = product.Filters.Select(f => f.ToAggregate()).Where(f => f != null);
            }

            IEnumerable<ProductAggregatePromotion> promotions = new List<ProductAggregatePromotion>();
            if (product.Promotions != null)
            {
                promotions = product.Promotions.Where(p => string.IsNullOrWhiteSpace(p.Code)).Select(p => p.ToAggregate());
            }

            ICollection<ProductComment> comments = new List<ProductComment>();
            if (product.Comments != null)
            {
                comments = product.Comments.Select(c => c.ToAggregateProduct()).ToList();
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
                Promotions = promotions,
                AverageScore = product.AverageScore,
                TotalScore = product.TotalScore,
                Comments = comments,
                AvailableInStock = product.AvailableInStock
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
                Name = product.Name,
                NewPrice = product.NewPrice,
                AvailableInStock = product.AvailableInStock
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
                Name = productCategory.Name,
                ShopSectionName = productCategory.ShopSectionName
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

        public static ServiceResultLine ToAggregate(this Service service, ServiceOccurrence serviceOccurrence, DateTime dateTime)
        {
            if (service == null)
            {
                throw new ArgumentNullException(nameof(service));
            }

            if (serviceOccurrence == null)
            {
                throw new ArgumentNullException(nameof(serviceOccurrence));
            }

            IEnumerable<string> images = null;
            if (service.Images != null)
            {
                images = service.Images.Select(i => i.PartialPath);
            }

            IEnumerable<string> tags = null;
            if (service.Tags != null)
            {
                tags = service.Tags.Select(t => t.TagName);
            }

            return new ServiceResultLine
            {
                Description = service.Description,
                Id = service.Id,
                Name = service.Name,
                PartialImagesUrl = images,
                Price = service.Price,
                ShopId = service.ShopId,
                Tags = tags,
                AverageScore = service.AverageScore,
                TotalScore = service.TotalScore,
                NewPrice = service.NewPrice,
                StartDateTime = dateTime.Add(serviceOccurrence.StartTime),
                EndDateTime = dateTime.Add(serviceOccurrence.EndTime)
            };
        }

        public static ServiceAggregate ToAggregate(this Service service)
        {
            if (service == null)
            {
                throw new ArgumentNullException(nameof(service));
            }

            ServiceAggregateOccurrence occurrence = null;
            if (service.Occurrence != null)
            {
                occurrence = service.Occurrence.ToAggregate();
            }

            IEnumerable<string> images = null;
            if (service.Images != null)
            {
                images = service.Images.Select(i => i.PartialPath);
            }

            IEnumerable<string> tags = null;
            if (service.Tags != null)
            {
                tags = service.Tags.Select(t => t.TagName);
            }

            ICollection<ServiceComment> comments = null;
            if (service.Comments != null)
            {
                comments = service.Comments.Select(c => c.ToAggregateService()).ToList();
            }

            return new ServiceAggregate
            {
                Description = service.Description,
                Id = service.Id,
                Name = service.Name,
                Occurrence = occurrence,
                PartialImagesUrl = images,
                Price = service.Price,
                ShopId = service.ShopId,
                Tags = tags,
                AverageScore = service.AverageScore,
                TotalScore = service.TotalScore,
                NewPrice = service.NewPrice,
                Comments = comments,
                CreateDateTime = service.CreateDateTime,
                UpdateDateTime = service.UpdateDateTime
            };
        }

        public static ServiceAggregateOccurrence ToAggregate(this ServiceOccurrence occurrence)
        {
            if (occurrence == null)
            {
                throw new ArgumentNullException(nameof(occurrence));
            }

            IEnumerable<DayOfWeek> days = null;
            if (occurrence.Days != null)
            {
                days = occurrence.Days.Select(d => (DayOfWeek)Enum.Parse(typeof(DayOfWeek), d.DayId));
            }
            return new ServiceAggregateOccurrence
            {
                Id = occurrence.Id,
                Days = days,
                ServiceId = occurrence.ServiceId,
                StartDate = occurrence.StartDate,
                EndDate = occurrence.EndDate,
                StartTime = occurrence.StartTime,
                EndTime = occurrence.EndTime
            };
        }

        public static ServiceComment ToAggregateService(this Comment comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            return new ServiceComment
            {
                Content = comment.Content,
                CreateDateTime = comment.CreateDateTime,
                Id = comment.Id,
                Score = comment.Score,
                Subject = comment.Subject,
                UpdateDateTime = comment.UpdateDateTime
            };
        }
    }
}
