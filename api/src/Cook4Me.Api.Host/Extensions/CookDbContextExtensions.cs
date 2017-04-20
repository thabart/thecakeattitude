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

using Cook4Me.Api.EF;
using Cook4Me.Api.EF.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Cook4Me.Api.Host.Extensions
{
    internal static class CookDbContextExtensions
    {
        public static void EnsureSeedData(this CookDbContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }
            
            InsertCategories(context);
            context.SaveChanges();
        }

        private static void InsertCategories(CookDbContext context)
        {
            if (!context.Categories.Any())
            {
                var shoesCategoryId = Guid.NewGuid().ToString();
                var bakeryCategoryId = Guid.NewGuid().ToString();
                var clothesCategory = new Category { Id = Guid.NewGuid().ToString(), Name = "Clothes", Description = "Clothes" };
                var alimentationCategory = new Category { Id = Guid.NewGuid().ToString(), Name = "Alimentation", Description = "Alimentation" };
                context.Categories.AddRange(new[]
                {
                    clothesCategory,
                    alimentationCategory,
                    new Category { Id = shoesCategoryId, Name = "Shoes", Description = "Shoes", ParentId = clothesCategory.Id },
                    new Category { Id = bakeryCategoryId, Name = "Pastry & Bakery", Description = "Pastry & Bakery", ParentId = alimentationCategory.Id }
                });
                context.Maps.AddRange(new[]
                {
                    new Map
                    {
                        CategoryId = shoesCategoryId,
                        MapName = "first_shoes_map",
                        PartialMapUrl = "/maps/map.json",
                        PartialOverviewUrl = "/maps/overview_map.png",
                        OverviewName = "shoes_overview",
                        IsMain = true
                    },
                    new Map
                    {
                        CategoryId = shoesCategoryId,
                        MapName = "second_shoes_map",
                        PartialMapUrl = "/maps/map.json",
                        PartialOverviewUrl = "/maps/overview_map.png",
                        OverviewName = "shoes_overview"
                    },
                    new Map
                    {
                        CategoryId = bakeryCategoryId,
                        MapName = "first_bakery_map",
                        PartialMapUrl = "/maps/map2.json",
                        PartialOverviewUrl = "/maps/overview_map2.png",
                        OverviewName = "bakery_overview",
                        IsMain = true
                    },
                    new Map
                    {
                        CategoryId = bakeryCategoryId,
                        MapName = "second_bakery_map",
                        PartialMapUrl = "/maps/map2.json",
                        PartialOverviewUrl = "/maps/overview_map2.png",
                        OverviewName = "bakery_overview"
                    }
                });
            }
        }
    }
}
