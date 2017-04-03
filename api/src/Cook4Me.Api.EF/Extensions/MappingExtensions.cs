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
                Title = shop.Title
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
                Title = shop.Title
            };

        }
    }
}
