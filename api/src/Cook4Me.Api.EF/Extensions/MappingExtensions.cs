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

using Cook4Me.Api.EF.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using Domain = Cook4Me.Api.Core.Models;

namespace Cook4Me.Api.EF.Extensions
{
    internal static class MappingExtensions
    {
        public static Domain.Shop ToDomain(this Shop shop)
        {
            if (shop == null)
            {
                throw new ArgumentNullException(nameof(shop));
            }

            Domain.Category category = null;
            if (shop.Category != null)
            {
                category = shop.Category.ToDomain();
            }

            return new Domain.Shop
            {
                Id = shop.Id,
                Subject = shop.Subject,
                Name = shop.Name,
                Description = shop.Description,
                CategoryId = shop.CategoryId,
                StreetAddress = shop.StreetAddress,
                PostalCode = shop.PostalCode,
                Locality = shop.Locality,
                Country = shop.Country,
                PlaceId = shop.PlaceId,
                ShopRelativePath = shop.ShopRelativePath,
                UndergroundRelativePath = shop.UndergroundRelativePath,
                CreateDateTime = shop.CreateDateTime,
                UpdateDateTime = shop.UpdateDateTime,
                Category = category
            };
        }

        public static Shop ToModel(this Domain.Shop shop)
        {
            if (shop == null)
            {
                throw new ArgumentNullException(nameof(shop));
            }

            return new Shop
            {
                Id = shop.Id,
                Subject = shop.Subject,
                Name = shop.Name,
                Description = shop.Description,
                CategoryId = shop.CategoryId,
                StreetAddress = shop.StreetAddress,
                PostalCode = shop.PostalCode,
                Locality = shop.Locality,
                Country = shop.Country,
                PlaceId = shop.PlaceId,
                ShopRelativePath = shop.ShopRelativePath,
                UndergroundRelativePath = shop.UndergroundRelativePath,
                CreateDateTime = shop.CreateDateTime,
                UpdateDateTime = shop.UpdateDateTime
            };
        }

        public static Domain.User ToDomain(this User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            return new Domain.User
            {
                City = user.City,
                Email = user.Email,
                Id = user.Id,
                IsSeller = user.IsSeller,
                PhoneNumber = user.PhoneNumber,
                PostalCode = user.PostalCode,
                Pseudo = user.Pseudo,
                StreetAddress = user.StreetAddress,
                StreetNumber = user.StreetNumber
            };
        }

        public static User ToModel(this Domain.User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            return new User
            {
                City = user.City,
                Email = user.Email,
                Id = user.Id,
                IsSeller = user.IsSeller,
                PhoneNumber = user.PhoneNumber,
                PostalCode = user.PostalCode,
                Pseudo = user.Pseudo,
                StreetAddress = user.StreetAddress,
                StreetNumber = user.StreetNumber
            };
        }

        public static Domain.Category ToDomain(this Category category)
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            IEnumerable<Domain.Category> children = null;
            if (category.Children != null && category.Children.Any())
            {
                children = category.Children.Select(c => c.ToDomain());
            }

            IEnumerable<Domain.Map> maps = null;
            if (category.Maps != null && category.Maps.Any())
            {
                maps = category.Maps.Select(m => m.ToDomain());
            }

            return new Domain.Category
            {
                Id = category.Id,
                Description = category.Description,
                Name = category.Name,
                ParentId = category.ParentId,
                Children = children,
                Maps = maps
            };
        }

        public static Category ToModel(this Domain.Category category)
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

        public static Domain.Map ToDomain(this Map map)
        {
            if (map == null)
            {
                throw new ArgumentNullException(nameof(map));
            }

            return new Domain.Map
            {
                CategoryId = map.CategoryId,
                MapName = map.MapName,
                OverviewName = map.OverviewName,
                PartialMapUrl = map.PartialMapUrl,
                PartialOverviewUrl = map.PartialOverviewUrl,
                IsMain = map.IsMain
            };
        }

        public static Map ToModel(this Domain.Map map)
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

        public static Domain.Tag ToDomain(this Tag tag)
        {
            if (tag == null)
            {
                throw new ArgumentNullException(nameof(tag));
            }

            return new Domain.Tag
            {
                Name = tag.Name,
                Description = tag.Description
            };
        }

        public static Tag ToModel(this Domain.Tag tag)
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
    }
}
