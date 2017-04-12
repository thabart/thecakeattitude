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

            return new Domain.Shop
            {
                Id = shop.Id,
                CreateDateTime = shop.CreateDateTime,
                MapName = shop.MapName,
                PlaceId = shop.PlaceId,
                Title = shop.Title,
                ShopRelativePath = shop.ShopRelativePath,
                UndergroundRelativePath = shop.UndergroundRelativePath
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
                CreateDateTime = shop.CreateDateTime,
                MapName = shop.MapName,
                PlaceId = shop.PlaceId,
                Title = shop.Title,
                ShopRelativePath = shop.ShopRelativePath,
                UndergroundRelativePath = shop.UndergroundRelativePath
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

            return new Domain.Category
            {
                Id = category.Id,
                Description = category.Description,
                Name = category.Name,
                ParentId = category.ParentId
            };
        }

        public static Category ToModel(this Domain.Category category)
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            return new Category
            {
                Id = category.Id,
                Description = category.Description,
                Name = category.Name,
                ParentId = category.ParentId
            };
        }
    }
}
