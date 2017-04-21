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
            InsertTags(context);
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
                        PartialMapUrl = "/maps/first_shoes_map.json",
                        PartialOverviewUrl = "/maps/first_shoes_map_overview.png",
                        OverviewName = "first_shoes_map_overview",
                        IsMain = true
                    },
                    new Map
                    {
                        CategoryId = shoesCategoryId,
                        MapName = "second_shoes_map",
                        PartialMapUrl = "/maps/second_shoes_map.json",
                        PartialOverviewUrl = "/maps/second_shoes_map_overview.png",
                        OverviewName = "second_shoes_map_overview"
                    },
                    new Map
                    {
                        CategoryId = bakeryCategoryId,
                        MapName = "first_bakery_map",
                        PartialMapUrl = "/maps/first_bakery_map.json",
                        PartialOverviewUrl = "/maps/first_bakery_overview.png",
                        OverviewName = "first_bakery_overview",
                        IsMain = true
                    },
                    new Map
                    {
                        CategoryId = bakeryCategoryId,
                        MapName = "second_bakery_map",
                        PartialMapUrl = "/maps/second_bakery_map.json",
                        PartialOverviewUrl = "/maps/second_bakery_map_overview.png",
                        OverviewName = "second_bakery_overview"
                    }
                });
            }
        }

        private static void InsertTags(CookDbContext context)
        {
            if (!context.Tags.Any())
            {
                context.Tags.AddRange(new[]
                {
                    new Tag
                    {
                        Name = "eco",
                        Description = "ecologique"
                    },
                    new Tag
                    {
                        Name = "second hand",
                        Description = "second hand"
                    }
                });
            }
        }
    }
}
