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
using System.Linq;

namespace Cook4Me.Api.Host.Extensions
{
    internal static class CookDbContextExtensions
    {
        private static string _shoesCategoryId = Guid.NewGuid().ToString();
        private static string _bakeryCategoryId = Guid.NewGuid().ToString();
        private static string _firstShopId = Guid.NewGuid().ToString();
        private static string _secondShopId = Guid.NewGuid().ToString();
        private static string _ecoTagName = "eco";
        private static string _secondHandTagName = "second hand";
        private static string _womenProductCategory = Guid.NewGuid().ToString();
        private static string _manProductCategory = Guid.NewGuid().ToString();
        private static string _jeanProductId = Guid.NewGuid().ToString();
        private static string _blueJeanProductId = Guid.NewGuid().ToString();
        private static string _colorFilterId = Guid.NewGuid().ToString();
        private static string _sizeFilterId = Guid.NewGuid().ToString();
        private static string _redColorFilterId = Guid.NewGuid().ToString();
        private static string _blueColorFilterId = Guid.NewGuid().ToString();
        private static string _smallSizeFilterId = Guid.NewGuid().ToString();
        private static string _mediumSizeFilterId = Guid.NewGuid().ToString();
        private static string _largeSizeFilterId = Guid.NewGuid().ToString();
        private static string _smallShoesId = Guid.NewGuid().ToString();
        private static string _mixtShoesId = Guid.NewGuid().ToString();

        public static void EnsureSeedData(this CookDbContext context)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }
            
            InsertCategories(context);
            InsertTags(context);
            // InsertShops(context);
            // InsertFilters(context);
            // InsertComments(context);
            // InsertShopTags(context);
            // InsertProductCategories(context);
            // InsertProducts(context);
            // InsertPromotions(context);
            context.SaveChanges();
        }

        private static void InsertCategories(CookDbContext context)
        {
            if (!context.Categories.Any())
            {
                var clothesCategory = new Category { Id = Guid.NewGuid().ToString(), Name = "Clothes", Description = "Clothes" };
                var alimentationCategory = new Category { Id = Guid.NewGuid().ToString(), Name = "Alimentation", Description = "Alimentation" };
                context.Categories.AddRange(new[]
                {
                    clothesCategory,
                    alimentationCategory,
                    new Category { Id = _shoesCategoryId, Name = "Shoes", Description = "Shoes", ParentId = clothesCategory.Id },
                    new Category { Id = _bakeryCategoryId, Name = "Pastry & Bakery", Description = "Pastry & Bakery", ParentId = alimentationCategory.Id }
                });
                context.Maps.AddRange(new[]
                {
                    new Map
                    {
                        CategoryId = _shoesCategoryId,
                        MapName = "first_shoes_map",
                        PartialMapUrl = "/maps/first_shoes_map.json",
                        PartialOverviewUrl = "/maps/first_shoes_map_overview.png",
                        OverviewName = "first_shoes_map_overview",
                        IsMain = true
                    },
                    new Map
                    {
                        CategoryId = _shoesCategoryId,
                        MapName = "second_shoes_map",
                        PartialMapUrl = "/maps/second_shoes_map.json",
                        PartialOverviewUrl = "/maps/second_shoes_map_overview.png",
                        OverviewName = "second_shoes_map_overview"
                    },
                    new Map
                    {
                        CategoryId = _bakeryCategoryId,
                        MapName = "first_bakery_map",
                        PartialMapUrl = "/maps/first_bakery_map.json",
                        PartialOverviewUrl = "/maps/first_bakery_overview.png",
                        OverviewName = "first_bakery_overview",
                        IsMain = true
                    },
                    new Map
                    {
                        CategoryId = _bakeryCategoryId,
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
                        Name = _ecoTagName,
                        Description = "ecologique"
                    },
                    new Tag
                    {
                        Name = _secondHandTagName,
                        Description = "second hand"
                    }
                });
            }
        }

        private static void InsertShops(CookDbContext context)
        {
            if (!context.Shops.Any())
            {
                context.Shops.AddRange(new[]
                {
                    new Shop
                    {
                        Id = _firstShopId,
                        Subject = "administrator",
                        Name = "shop 1",
                        Description = "description 1",
                        CategoryId = _shoesCategoryId,
                        MapName = "first_shoes_map",
                        StreetAddress = "street adr 1",
                        PostalCode = "postal code 1",
                        Locality = "locality 1",
                        Country = "country 1",
                        PlaceId = "place3",
                        GooglePlaceId = "ChIJQdeO0VXCw0cReXpimsXR89g",
                        Longitude = 4.3630615F,
                        Latitude = 50.8939195F,
                        TotalScore = 16,
                        AverageScore = 3.2
                    },
                    new Shop
                    {
                        Id = _secondShopId,
                        Subject = "laetitia",
                        Name = "shop 2",
                        Description = "description 2",
                        CategoryId = _shoesCategoryId,
                        MapName = "first_shoes_map",
                        StreetAddress = "street adr 2",
                        PostalCode = "postal code 2",
                        Locality = "locality 2",
                        Country = "country 2",
                        PlaceId = "place4",
                        GooglePlaceId = "EjVBdmVudWUgZGVzIENyb2l4IGR1IEZldSAyMjgsIDEwMjAgQnJ1eGVsbGVzLCBCZWxnaXF1ZQ",
                        Longitude = 4.3677565F,
                        Latitude = 50.8919259F,
                        TotalScore = 4,
                        AverageScore = 4
                    }
                });
            }
        }

        private static void InsertFilters(CookDbContext context)
        {
            context.Filters.AddRange(new[]
            {
                new Filter
                {
                    Id = _colorFilterId,
                    Name = "Colors",
                    ShopId = _firstShopId,
                    Values = new []
                    {
                        new FilterValue
                        {
                            Id = _redColorFilterId,
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Content = "Red"
                        },
                        new FilterValue
                        {
                            Id = _blueColorFilterId,
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Content = "Blue"
                        }
                    }
                },
                new Filter
                {
                    Id = _sizeFilterId,
                    Name = "Size",
                    ShopId = _firstShopId,
                    Values = new []
                    {
                        new FilterValue
                        {
                            Id = _smallSizeFilterId,
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Content = "Small"
                        },
                        new FilterValue
                        {
                            Id = _mediumSizeFilterId,
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Content = "Medium"
                        },
                        new FilterValue
                        {
                            Id = _largeSizeFilterId,
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Content = "Large"
                        }
                    }
                }
            });
        }

        private static void InsertComments(CookDbContext context)
        {
            context.Comments.AddRange(new[]
            {
                new Comment
                {
                    Content = "comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1",
                    Id = Guid.NewGuid().ToString(),
                    ShopId = _firstShopId,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    Subject = "administrator",
                    Score = 5                    
                },
                new Comment
                {
                    Content = "comment2comment2comment2comment2comment2comment2comment2comment2comment2comment2comment2",
                    Id = Guid.NewGuid().ToString(),
                    ShopId = _firstShopId,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    Subject = "administrator",
                    Score = 3
                },
                new Comment
                {
                    Content = "comment3comment3comment3comment3comment3comment3comment3comment3comment3comment3comment3comment3comment3comment3comment3",
                    Id = Guid.NewGuid().ToString(),
                    ShopId = _firstShopId,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    Subject = "administrator",
                    Score = 3
                },
                new Comment
                {
                    Content = "comment4     comment4comment4comment4comment4comment4comment4comment4",
                    Id = Guid.NewGuid().ToString(),
                    ShopId = _firstShopId,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    Subject = "laetitia",
                    Score = 1
                },
                new Comment
                {
                    Content = "comment5",
                    Id = Guid.NewGuid().ToString(),
                    ShopId = _firstShopId,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    Subject = "laetitia",
                    Score = 4
                },
                new Comment
                {
                    Content = "comment1",
                    Id = Guid.NewGuid().ToString(),
                    ShopId = _secondShopId,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    Subject = "laetitia",
                    Score = 4
                }
            });
        }

        private static void InsertShopTags(CookDbContext context)
        {
            context.ShopTags.AddRange(new[]
            {
                new ShopTag
                {
                    Id = Guid.NewGuid().ToString(),
                    ShopId = _firstShopId,
                    TagName = _ecoTagName
                },
                new ShopTag
                {
                    Id = Guid.NewGuid().ToString(),
                    ShopId = _firstShopId,
                    TagName = _secondHandTagName
                },
                new ShopTag
                {
                    Id = Guid.NewGuid().ToString(),
                    ShopId = _secondShopId,
                    TagName = _ecoTagName
                }
            });
        }

        private static void InsertProductCategories(CookDbContext context)
        {
            context.ProductCategories.AddRange(new[]
            {
                new ProductCategory
                {
                    Id = _womenProductCategory,
                    Name = "Women",
                    Description = "Women",
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    ShopId = _firstShopId
                },
                new ProductCategory
                {
                    Id = _manProductCategory,
                    Name = "Man",
                    Description = "Man",
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    ShopId = _firstShopId
                }
            });
        }

        private static void InsertProducts(CookDbContext context)
        {
            context.Products.AddRange(new[]
            {
                new Product
                {
                    Id = _jeanProductId,
                    Name = "Jean",
                    ShopId = _firstShopId,
                    Description = "Jean",
                    CategoryId = _womenProductCategory,
                    Price = 200,
                    NewPrice = 200,
                    UnitOfMeasure = "piece",
                    Quantity = 1,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    AvailableInStock = 2000,
                    Images = new []
                    {
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "/products/jean.jpg"
                        }
                    },
                    Tags = new []
                    {
                        new ProductTag
                        {
                            Id = Guid.NewGuid().ToString(),
                            TagName = _ecoTagName
                        }
                    },
                    Filters = new []
                    {
                        new ProductFilter
                        {
                            Id = Guid.NewGuid().ToString(),
                            FilterValueId = _redColorFilterId
                        },
                        new ProductFilter
                        {
                            Id = Guid.NewGuid().ToString(),
                            FilterValueId = _blueColorFilterId
                        }
                    }
                },
                new Product
                {
                    Id = _blueJeanProductId,
                    Name = "Jean",
                    ShopId = _firstShopId,
                    Description = "Jean",
                    CategoryId = _womenProductCategory,
                    Price = 200,
                    NewPrice = 160,
                    UnitOfMeasure = "piece",
                    Quantity = 1,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    AvailableInStock = 2000,
                    Images = new []
                    {
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "/products/jean.jpg"
                        }
                    },
                    Tags = new []
                    {
                        new ProductTag
                        {
                            Id = Guid.NewGuid().ToString(),
                            TagName = _ecoTagName
                        }
                    },
                    Filters = new []
                    {
                        new ProductFilter
                        {
                            Id = Guid.NewGuid().ToString(),
                            FilterValueId = _blueColorFilterId
                        }
                    }
                },
                new Product
                {
                    Id = _smallShoesId,
                    Name = "Small shoes",
                    ShopId = _firstShopId,
                    Description = "Small shoes",
                    CategoryId = _womenProductCategory,
                    Price = 250,
                    NewPrice = 100,
                    UnitOfMeasure = "piece",
                    Quantity = 1,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    AvailableInStock = 3000,
                    Images = new []
                    {
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "/products/jean.jpg"
                        }
                    },
                    Tags = new []
                    {
                        new ProductTag
                        {
                            Id = Guid.NewGuid().ToString(),
                            TagName = _ecoTagName
                        }
                    },
                    Filters = new []
                    {
                        new ProductFilter
                        {
                            Id = Guid.NewGuid().ToString(),
                            FilterValueId = _smallSizeFilterId
                        }
                    }
                },
                new Product
                {
                    Id = _mixtShoesId,
                    Name = "Mixt shoes",
                    ShopId = _firstShopId,
                    Description = "Mixt shoes",
                    CategoryId = _manProductCategory,
                    Price = 250,
                    NewPrice = 250,
                    UnitOfMeasure = "piece",
                    Quantity = 1,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    AvailableInStock = 3000,
                    Images = new []
                    {
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "/products/jean.jpg"
                        }
                    },
                    Tags = new []
                    {
                        new ProductTag
                        {
                            Id = Guid.NewGuid().ToString(),
                            TagName = _ecoTagName
                        }
                    },
                    Filters = new []
                    {
                        new ProductFilter
                        {
                            Id = Guid.NewGuid().ToString(),
                            FilterValueId = _smallSizeFilterId
                        },
                        new ProductFilter
                        {
                            Id = Guid.NewGuid().ToString(),
                            FilterValueId = _mediumSizeFilterId
                        },
                        new ProductFilter
                        {
                            Id = Guid.NewGuid().ToString(),
                            FilterValueId = _largeSizeFilterId
                        }
                    }
                }
            });
        }

        private static void InsertPromotions(CookDbContext context)
        {
            context.Promotions.AddRange(new[]
            {
                new ProductPromotion
                {
                    Id = Guid.NewGuid().ToString(),
                    ProductId = _blueJeanProductId,
                    Type = (int)Core.Models.PromotionTypes.Percentage,
                    Discount = 20,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    ExpirationDateTime = DateTime.UtcNow.AddDays(2)                  
                },
                new ProductPromotion
                {
                    Id = Guid.NewGuid().ToString(),
                    ProductId = _smallShoesId,
                    Type = (int)Core.Models.PromotionTypes.Percentage,
                    Discount = 60,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    ExpirationDateTime = DateTime.UtcNow.AddDays(2)
                }
            });
        }
    }
}
