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
        private static string _shoesCategoryId = "a20ab67b-f046-40c5-b5cd-566b3fca2749"; //Guid.NewGuid().ToString();
        private static string _bakeryCategoryId = Guid.NewGuid().ToString();
        private static string _firstShopId = Guid.NewGuid().ToString();
        private static string _secondShopId = Guid.NewGuid().ToString();
        private static string _thirdShopId = Guid.NewGuid().ToString();
        private static string _firstShirtId = Guid.NewGuid().ToString();
        private static string _secondShirtId = Guid.NewGuid().ToString();
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

        public static void EnsureSeedData(this CookDbContext context, bool isTstMode)
        {
            if (context == null)
            {
                throw new ArgumentNullException(nameof(context));
            }
            
            InsertCategories(context);
            InsertTags(context);
            InsertShops(context, isTstMode);
            InsertFilters(context);
            InsertComments(context);
            InsertShopTags(context);
            InsertProductCategories(context);
            InsertProducts(context);
            InsertPromotions(context);
            InsertDays(context);
            InsertServices(context);
            InsertClientServices(context);
            InsertNotifications(context);
            InsertMessages(context);
            InsertOrders(context);
            InsertUpsServices(context);
            context.SaveChanges();
        }

        private static void InsertUpsServices(CookDbContext context)
        {
            if (!context.UpsServices.Any())
            {
                context.UpsServices.AddRange(new[]
                {
                    new UpsService
                    {
                        Id = Guid.NewGuid().ToString(),
                        CountryCode = "BE",
                        Service = (int)Core.Aggregates.UpsAggregateServices.AccessPointEconomy
                    },
                    new UpsService
                    {
                        Id = Guid.NewGuid().ToString(),
                        CountryCode = "DE",
                        Service = (int)Core.Aggregates.UpsAggregateServices.Standard
                    }
                });
            }
        }

        private static void InsertOrders(CookDbContext context)
        {
            if (!context.Orders.Any())
            {
                context.Orders.AddRange(new[]
                {
                    new Order // Empty order.
                    {
                        Id = Guid.NewGuid().ToString(),
                        Status = 0,
                        CreateDateTime = DateTime.UtcNow,
                        UpdateDateTime = DateTime.UtcNow,
                        TotalPrice = 1000,
                        Subject = "administrator",
                        ShopId = _firstShopId,
                        OrderLines = new []
                        {
                            new OrderLine
                            {
                                Id = Guid.NewGuid().ToString(),
                                Price = 1000,
                                ProductId = _jeanProductId,
                                Quantity = 2
                            }
                        }
                    },
                    new Order // Order (hand to hand mode) not yet confirmed.
                    {
                        Id = Guid.NewGuid().ToString(),
                        Status = 1,
                        CreateDateTime = DateTime.UtcNow,
                        UpdateDateTime = DateTime.UtcNow,
                        Subject = "administrator",
                        ShopId = _firstShopId,
                        TransportMode = 1,
                        IsLabelPurchased = false,
                        OrderLines = new []
                        {
                            new OrderLine
                            {
                                Id = Guid.NewGuid().ToString(),
                                Price = 1000,
                                ProductId = _jeanProductId,
                                Quantity = 2
                            }
                        }
                    },
                    new Order // Order (hand to hand mode) received
                    {
                        Id = Guid.NewGuid().ToString(),
                        Status = 2,
                        CreateDateTime = DateTime.UtcNow,
                        UpdateDateTime = DateTime.UtcNow,
                        Subject = "administrator",
                        ShopId = _firstShopId,
                        TransportMode = 1,
                        IsLabelPurchased = false,
                        OrderLines = new []
                        {
                            new OrderLine
                            {
                                Id = Guid.NewGuid().ToString(),
                                Price = 1000,
                                ProductId = _jeanProductId,
                                Quantity = 2
                            }
                        }
                    },
                    new Order // Confirmed order (packet mode) + payment created.
                    {
                        Id = Guid.NewGuid().ToString(),
                        Status = 1,
                        CreateDateTime = DateTime.UtcNow,
                        UpdateDateTime = DateTime.UtcNow,
                        Subject = "administrator",
                        ShopId = _firstShopId,
                        TransportMode = 2,
                        IsLabelPurchased = false,
                        OrderParcel = new OrderParcel
                        {
                            Id = Guid.NewGuid().ToString(),
                            Transporter = 1,
                            ParcelShopId = "1",
                            BuyerAddressLine = "10 GOERLITZER STRASSE",
                            BuyerCity = "NEUSS",
                            BuyerCountryCode = "DE",
                            BuyerName = "HT",
                            BuyerPostalCode = 41460,
                            ParcelShopAddressLine = "MUEHLENSTRASSE 20",
                            ParcelShopCity = "NEUSS",
                            ParcelShopCountryCode = "DE",
                            ParcelShopPostalCode = 41460,
                            SellerAddressLine = "NIEDERWALLSTRASSE 29",
                            SellerCity = "NEUSS",
                            SellerCountryCode = "DE",
                            SellerPostalCode = 41460
                        },
                        OrderLines = new []
                        {
                            new OrderLine
                            {
                                Id = Guid.NewGuid().ToString(),
                                Price = 1000,
                                ProductId = _jeanProductId,
                                Quantity = 2
                            }
                        },
                        OrderPayment = new OrderPayment
                        {
                            Id = Guid.NewGuid().ToString(),
                            Status = 0,
                            TransactionId = "PAY-69134876YM8579522LHGMMWI", // THE TRANSACTION ID SHOULD BE UPDATED.
                            PayerId = "RTTQKS7QPPFXL",
                            PaymentMethod = 0,
                            ApprovalUrl = "http://location"
                        }
                    },
                    new Order // Confirmed order (packet mode) + payment approved.
                    {
                        Id = Guid.NewGuid().ToString(),
                        Status = 1,
                        CreateDateTime = DateTime.UtcNow,
                        UpdateDateTime = DateTime.UtcNow,
                        Subject = "administrator",
                        ShopId = _firstShopId,
                        TransportMode = 2,
                        IsLabelPurchased = false,
                        OrderParcel = new OrderParcel
                        {
                            Id = Guid.NewGuid().ToString(),
                            Transporter = 1,
                            BuyerAddressLine = "10 GOERLITZER STRASSE",
                            ParcelShopId = "1",
                            BuyerCity = "NEUSS",
                            BuyerCountryCode = "DE",
                            BuyerName = "HT",
                            BuyerPostalCode = 41460,
                            ParcelShopAddressLine = "MUEHLENSTRASSE 20",
                            ParcelShopCity = "NEUSS",
                            ParcelShopCountryCode = "DE",
                            ParcelShopPostalCode = 41460,
                            SellerAddressLine = "NIEDERWALLSTRASSE 29",
                            SellerCity = "NEUSS",
                            SellerCountryCode = "DE",
                            SellerPostalCode = 41460
                        },
                        OrderLines = new []
                        {
                            new OrderLine
                            {
                                Id = Guid.NewGuid().ToString(),
                                Price = 1000,
                                ProductId = _jeanProductId,
                                Quantity = 2
                            }
                        },
                        OrderPayment = new OrderPayment
                        {
                            Id = Guid.NewGuid().ToString(),
                            Status = 1,
                            TransactionId = "PAY-69134876YM8579522LHGMMWI", // THE TRANSACTION ID SHOULD BE UPDATED.
                            PayerId = "RTTQKS7QPPFXL",
                            PaymentMethod = 0
                        }
                    },
                    new Order // Order ready to be confirmed (reception).
                    {
                        Id = Guid.NewGuid().ToString(),
                        Status = 1,
                        CreateDateTime = DateTime.UtcNow,
                        UpdateDateTime = DateTime.UtcNow,
                        Subject = "administrator",
                        ShopId = _firstShopId,
                        TransportMode = 2,
                        OrderParcel = new OrderParcel
                        {
                            Id = Guid.NewGuid().ToString(),
                            Transporter = 1,
                            ParcelShopId = "1",
                            BuyerAddressLine = "10 GOERLITZER STRASSE",
                            BuyerCity = "NEUSS",
                            BuyerCountryCode = "DE",
                            BuyerName = "HT",
                            BuyerPostalCode = 41460,
                            ParcelShopAddressLine = "MUEHLENSTRASSE 20",
                            ParcelShopCity = "NEUSS",
                            ParcelShopCountryCode = "DE",
                            ParcelShopPostalCode = 41460,
                            SellerAddressLine = "NIEDERWALLSTRASSE 29",
                            SellerCity = "NEUSS",
                            SellerCountryCode = "DE",
                            SellerPostalCode = 41460
                        },
                        OrderPayment = new OrderPayment
                        {
                            Id = Guid.NewGuid().ToString(),
                            Status = 1,
                            TransactionId = "PAY-69134876YM8579522LHGMMWI", // THE TRANSACTION ID SHOULD BE UPDATED.
                            PayerId = "RTTQKS7QPPFXL",
                            PaymentMethod = 0
                        },
                        IsLabelPurchased = true,
                        TrackingNumber = "1Z12345E0291980793",
                        TotalPrice = 1000,
                        OrderLines = new []
                        {
                            new OrderLine
                            {
                                Id = Guid.NewGuid().ToString(),
                                Price = 1000,
                                ProductId = _jeanProductId,
                                Quantity = 2
                            }
                        }
                    },
                    new Order // Order (packet) received
                    {
                        Id = Guid.NewGuid().ToString(),
                        Status = 2,
                        CreateDateTime = DateTime.UtcNow,
                        UpdateDateTime = DateTime.UtcNow,
                        Subject = "administrator",
                        ShopId = _firstShopId,
                        TransportMode = 2,
                        OrderParcel = new OrderParcel
                        {
                            Id = Guid.NewGuid().ToString(),
                            Transporter = 1,
                            ParcelShopId = "1",
                            BuyerAddressLine = "10 GOERLITZER STRASSE",
                            BuyerCity = "NEUSS",
                            BuyerCountryCode = "DE",
                            BuyerName = "HT",
                            BuyerPostalCode = 41460,
                            ParcelShopAddressLine = "MUEHLENSTRASSE 20",
                            ParcelShopCity = "NEUSS",
                            ParcelShopCountryCode = "DE",
                            ParcelShopPostalCode = 41460,
                            SellerAddressLine = "NIEDERWALLSTRASSE 29",
                            SellerCity = "NEUSS",
                            SellerCountryCode = "DE",
                            SellerPostalCode = 41460
                        },
                        OrderPayment = new OrderPayment
                        {
                            Id = Guid.NewGuid().ToString(),
                            Status = 2,
                            TransactionId = "PAY-69134876YM8579522LHGMMWI", // THE TRANSACTION ID SHOULD BE UPDATED.
                            PayerId = "RTTQKS7QPPFXL",
                            PaymentMethod = 0
                        },
                        IsLabelPurchased = true,
                        TrackingNumber = "1Z12345E0291980793",
                        TotalPrice = 1000,
                        OrderLines = new []
                        {
                            new OrderLine
                            {
                                Id = Guid.NewGuid().ToString(),
                                Price = 1000,
                                ProductId = _jeanProductId,
                                Quantity = 2
                            }
                        }
                    }
                });
            }
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
                    new Category { Id = _shoesCategoryId, Name = "Shoes", Description = "Shoes", ParentId = clothesCategory.Id, PinImagePartialPath = "/pins/shoes-pin.png" },
                    new Category { Id = _bakeryCategoryId, Name = "Pastry & Bakery", Description = "Pastry & Bakery", ParentId = alimentationCategory.Id, PinImagePartialPath = "/pins/pastry-pin.png" }
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
                        PartialOverviewUrl = "/maps/first_bakery_map_overview.png",
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

        private static void InsertShops(CookDbContext context, bool isTstMode)
        {
            if (!context.Shops.Any())
            {
                context.Shops.AddRange(new[]
                {
                    new Shop
                    {
                        Id = _firstShopId,
                        Subject = "laetitia",
                        Name = "shop 1",
                        Description = "description 1",
                        CategoryId = _shoesCategoryId,
                        CategoryMapName = "first_shoes_map",
                        StreetAddress = isTstMode ? "NIEDERWALLSTRASSE 29" : "rue solleveld 20",
                        PostalCode = isTstMode ? "41460" : "1200",
                        Locality = isTstMode ? "NEUSS": "Bruxelles",
                        Country = isTstMode ? "DE" : "BE",
                        PlaceId = "place3",
                        GooglePlaceId = "ChIJn9-QVlS0uEcRM-jduPqXdYs",
                        Longitude = isTstMode ? 6.687952600000017F :4.3630615F,
                        Latitude = isTstMode ? 51.2010754F : 50.8939195F,
                        TotalScore = 16,
                        AverageScore = 3.2,
                        PaymentMethods = new List<PaymentMethod>
                        {
                            new PaymentMethod
                            {
                                Id = Guid.NewGuid().ToString(),
                                Method = 0
                            },
                            new PaymentMethod
                            {
                                Id = Guid.NewGuid().ToString(),
                                Method = 1,
                                Iban = "BE400000000000000"
                            },
                            new PaymentMethod
                            {
                                Id = Guid.NewGuid().ToString(),
                                Method = 2,
                                PaypalAccount = "habarthierry@hotmail.fr"
                            }
                        },
                        ShopMap = new Map
                        {
                            MapName = "first_shop",
                            PartialMapUrl = "/shops/first_shop.json",
                            OverviewName = "first_shop_overview",
                            PartialOverviewUrl = "/shops/shop_overview.png"
                        }
                    },
                    new Shop
                    {
                        Id = _secondShopId,
                        Subject = "administrator",
                        Name = "shop 2",
                        Description = "description 1",
                        CategoryId = _shoesCategoryId,
                        CategoryMapName = "first_shoes_map",
                        StreetAddress = isTstMode ? "10 GOERLITZER STRASSE" : "223 avenue des croix du feu",
                        PostalCode = isTstMode ? "41460" : "1020",
                        Locality = isTstMode ? "NEUSS": "Bruxelles",
                        Country = isTstMode ? "DE" : "BE",
                        PlaceId = "place3",
                        GooglePlaceId = "ChIJ_7RBvmJLv0cRB-1T2vVgJcg",
                        Longitude = 6.623000000000047F,
                        Latitude = 51.12947F,
                        TotalScore = 16,
                        AverageScore = 3.2,
                        PaymentMethods = new List<PaymentMethod>
                        {
                            new PaymentMethod
                            {
                                Id = Guid.NewGuid().ToString(),
                                Method = 0
                            },
                            new PaymentMethod
                            {
                                Id = Guid.NewGuid().ToString(),
                                Method = 1,
                                Iban = "BE400000000000000"
                            },
                            new PaymentMethod
                            {
                                Id = Guid.NewGuid().ToString(),
                                Method = 2,
                                PaypalAccount = "habarthierry@hotmail.fr"
                            }
                        },
                        ShopMap = new Map
                        {
                            MapName = "first_shop",
                            PartialMapUrl = "/shops/first_shop.json",
                            OverviewName = "first_shop_overview",
                            PartialOverviewUrl = "/shops/shop_overview.png"
                        }
                    },
                    new Shop
                    {
                        Id = _thirdShopId,
                        Subject = "administrator",
                        Name = "shop 3",
                        Description = "description 1",
                        CategoryId = _shoesCategoryId,
                        CategoryMapName = "first_shoes_map",
                        StreetAddress = isTstMode ? "10 GOERLITZER STRASSE" : "223 avenue des croix du feu",
                        PostalCode = isTstMode ? "41460" : "1020",
                        Locality = isTstMode ? "NEUSS": "Bruxelles",
                        Country = isTstMode ? "DE" : "BE",
                        PlaceId = "place3",
                        GooglePlaceId = "ChIJ_7RBvmJLv0cRB-1T2vVgJcg",
                        Longitude = 6.623000000000047F,
                        Latitude = 51.12947F,
                        TotalScore = 16,
                        AverageScore = 3.2,
                        PaymentMethods = new List<PaymentMethod>
                        {
                            new PaymentMethod
                            {
                                Id = Guid.NewGuid().ToString(),
                                Method = 0
                            },
                            new PaymentMethod
                            {
                                Id = Guid.NewGuid().ToString(),
                                Method = 1,
                                Iban = "BE400000000000000"
                            },
                            new PaymentMethod
                            {
                                Id = Guid.NewGuid().ToString(),
                                Method = 2,
                                PaypalAccount = "habarthierry@hotmail.fr"
                            }
                        },
                        ShopMap = new Map
                        {
                            MapName = "first_shop",
                            PartialMapUrl = "/shops/first_shop.json",
                            OverviewName = "first_shop_overview",
                            PartialOverviewUrl = "/shops/shop_overview.png"
                        }
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
                    ShopSectionName = "thirdSection",
                    ShopId = _firstShopId
                },
                new ProductCategory
                {
                    Id = _manProductCategory,
                    Name = "Man",
                    Description = "Man",
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    ShopSectionName = "secondSection",
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
                    UnitOfMeasure = "piece",
                    Quantity = 1,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    AvailableInStock = 2000,
                    TotalScore = 5,
                    AverageScore = 2.5,
                    Images = new []
                    {
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
                        },
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
                        },
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
                        },
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
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
                    },
                    Comments = new []
                    {
                        new Comment
                        {
                            Id = Guid.NewGuid().ToString(),
                            Content = "first-comment-product",
                            Score = 1,
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Subject = "administrator"
                        },
                        new Comment
                        {
                            Id = Guid.NewGuid().ToString(),
                            Content = "second-comment-product",
                            Score = 5,
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Subject = "administrator"
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
                    UnitOfMeasure = "piece",
                    Quantity = 1,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    AvailableInStock = 2000,
                    TotalScore = 2,
                    AverageScore = 1,
                    Images = new []
                    {
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
                        },
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
                        },
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
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
                    },
                    Comments = new []
                    {
                        new Comment
                        {
                            Id = Guid.NewGuid().ToString(),
                            Content = "first-comment-product",
                            Score = 1,
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Subject = "administrator"
                        },
                        new Comment
                        {
                            Id = Guid.NewGuid().ToString(),
                            Content = "second-comment-product",
                            Score = 2,
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Subject = "administrator"
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
                    UnitOfMeasure = "piece",
                    Quantity = 1,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    AvailableInStock = 3000,
                    TotalScore = 5,
                    AverageScore = 5,
                    Images = new []
                    {
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
                        },
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
                        },
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
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
                    },
                    Comments = new []
                    {
                        new Comment
                        {
                            Id = Guid.NewGuid().ToString(),
                            Content = "first-comment-product",
                            Score = 5,
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Subject = "administrator"
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
                    UnitOfMeasure = "piece",
                    Quantity = 1,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    AvailableInStock = 3000,
                    TotalScore = 1,
                    AverageScore = 1,
                    Images = new []
                    {
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
                        },
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
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
                    },
                    Comments = new []
                    {
                        new Comment
                        {
                            Id = Guid.NewGuid().ToString(),
                            Content = "first-comment-product",
                            Score = 1,
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Subject = "administrator"
                        }
                    }
                },
                new Product
                {
                    Id = _firstShirtId,
                    Name = "First shirt",
                    ShopId = _secondShopId,
                    Description = "First shirt",
                    CategoryId = _manProductCategory,
                    Price = 250,
                    UnitOfMeasure = "piece",
                    Quantity = 1,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    AvailableInStock = 3000,
                    TotalScore = 1,
                    AverageScore = 1,
                    Images = new []
                    {
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
                        },
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
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
                    Comments = new []
                    {
                        new Comment
                        {
                            Id = Guid.NewGuid().ToString(),
                            Content = "first-comment-product",
                            Score = 1,
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Subject = "administrator"
                        }
                    }
                },
                new Product
                {
                    Id = _secondShirtId,
                    Name = "Second shirt",
                    ShopId = _secondShopId,
                    Description = "Second shirt",
                    CategoryId = _manProductCategory,
                    Price = 250,
                    UnitOfMeasure = "piece",
                    Quantity = 1,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    AvailableInStock = 3000,
                    TotalScore = 1,
                    AverageScore = 1,
                    Images = new []
                    {
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
                        },
                        new ProductImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/products/jean.jpg"
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
                    Comments = new []
                    {
                        new Comment
                        {
                            Id = Guid.NewGuid().ToString(),
                            Content = "first-comment-product",
                            Score = 1,
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Subject = "administrator"
                        }
                    }
                }
            });
        }

        private static void InsertPromotions(CookDbContext context)
        {
            context.Discounts.AddRange(new[]
            {
                new Discount
                {
                    Id = Guid.NewGuid().ToString(),
                    Code = Guid.NewGuid().ToString(),
                    Counter = 10,
                    CreateDateTime =  DateTime.UtcNow,
                    Products = new []
                    {
                        new ProductDiscount
                        {
                            Id = Guid.NewGuid().ToString(),
                            ProductId = _jeanProductId,
                            MoneySaved = 1
                        }
                    },
                    PromotionType = 0,
                    Subject = "administrator",
                    UpdateDateTime = DateTime.UtcNow,
                    Validity = 1,
                    Value = 50,
                    IsPrivate = false,
                    IsActive = true                    
                },
                new Discount
                {
                    Id = Guid.NewGuid().ToString(),
                    Code = Guid.NewGuid().ToString(),
                    Counter = 10,
                    CreateDateTime =  DateTime.UtcNow,
                    Products = new []
                    {
                        new ProductDiscount
                        {
                            Id = Guid.NewGuid().ToString(),
                            ProductId = _firstShirtId,
                            MoneySaved = 1
                        }
                    },
                    PromotionType = 0,
                    Subject = "administrator",
                    UpdateDateTime = DateTime.UtcNow,
                    Validity = 1,
                    Value = 50,
                    IsPrivate = false,
                    IsActive = true
                },
                new Discount
                {
                    Id = Guid.NewGuid().ToString(),
                    Code = Guid.NewGuid().ToString(),
                    CreateDateTime =  DateTime.UtcNow,
                    Products = new []
                    {
                        new ProductDiscount
                        {
                            Id = Guid.NewGuid().ToString(),
                            ProductId = _firstShirtId,
                            MoneySaved = 2
                        },
                        new ProductDiscount
                        {
                            Id = Guid.NewGuid().ToString(),
                            ProductId = _secondShirtId,
                            MoneySaved = 3
                        }
                    },
                    PromotionType = 1,
                    Subject = "administrator",
                    UpdateDateTime = DateTime.UtcNow,
                    Validity = 0,
                    Value = 50,
                    StartDateTime = DateTime.UtcNow.AddDays(-10),
                    EndDateTime = DateTime.UtcNow.AddDays(10),
                    IsPrivate = false,
                    IsActive = true
                }
            });
        }

        private static void InsertDays(CookDbContext context)
        {
            context.ServiceDays.AddRange(new[]
            {
                new ServiceDay
                {
                    Id = "0",
                    Name = "Sunday"
                },
                new ServiceDay
                {
                    Id = "1",
                    Name = "Monday"
                },
                new ServiceDay
                {
                    Id = "2",
                    Name = "Tuesday"
                }
            });
        }

        private static void InsertServices(CookDbContext context)
        {
            context.Services.AddRange(new[]
            {
                new Service
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = "first-service",
                    ShopId = _firstShopId,
                    Price = 200,
                    AverageScore = 2.5,
                    TotalScore = 5,
                    Occurrence = new ServiceOccurrence
                    {
                        Id = Guid.NewGuid().ToString(),
                        Days = new List<ServiceOccurrenceDay>
                        {
                            new ServiceOccurrenceDay
                            {
                                Id = Guid.NewGuid().ToString(),
                                DayId = "0"
                            },
                            new ServiceOccurrenceDay
                            {
                                Id = Guid.NewGuid().ToString(),
                                DayId = "2"
                            }
                        },
                        StartDate = DateTime.UtcNow.AddDays(-10),
                        EndDate = DateTime.UtcNow.AddDays(10),
                        StartTime = new TimeSpan(4, 0, 0),
                        EndTime = new TimeSpan(17, 0, 0)
                    },
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    Description = "first-description",
                    Tags = new []
                    {
                        new ServiceTag
                        {
                            Id = Guid.NewGuid().ToString(),
                            TagName = _ecoTagName
                        },
                        new ServiceTag
                        {
                            Id = Guid.NewGuid().ToString(),
                            TagName = _secondHandTagName
                        }
                    },
                    Images = new []
                    {
                        new ServiceImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/services/service.jpg"
                        }
                    },
                    Comments = new []
                    {
                        new Comment
                        {
                            Content = "comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1",
                            Id = Guid.NewGuid().ToString(),
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Subject = "administrator",
                            Score = 0
                        },
                        new Comment
                        {
                            Content = "comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1",
                            Id = Guid.NewGuid().ToString(),
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Subject = "administrator",
                            Score = 5
                        }
                    }
                },
                new Service
                {
                    Id = Guid.NewGuid().ToString(),
                    Name = "second-service",
                    ShopId = _firstShopId,
                    Price = 300,
                    AverageScore = 5,
                    TotalScore = 5,
                    Occurrence = new ServiceOccurrence
                    {
                        Id = Guid.NewGuid().ToString(),
                        Days = new List<ServiceOccurrenceDay>
                        {
                            new ServiceOccurrenceDay
                            {
                                Id = Guid.NewGuid().ToString(),
                                DayId = "0"
                            },
                            new ServiceOccurrenceDay
                            {
                                Id = Guid.NewGuid().ToString(),
                                DayId = "1"
                            }
                        },
                        StartDate = DateTime.UtcNow.AddDays(-30),
                        EndDate = DateTime.UtcNow.AddDays(30),
                        StartTime = new TimeSpan(1, 0, 0),
                        EndTime = new TimeSpan(2, 0, 0)
                    },
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    Description = "second-description",
                    Tags = new []
                    {
                        new ServiceTag
                        {
                            Id = Guid.NewGuid().ToString(),
                            TagName = _ecoTagName
                        }
                    },
                    Images = new []
                    {
                        new ServiceImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/services/service.jpg"
                        },
                        new ServiceImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "http://localhost:5000/services/service.jpg"
                        },
                        new ServiceImage
                        {
                            Id = Guid.NewGuid().ToString(),
                            PartialPath = "/services/service.jpg"
                        }
                    },
                    Comments = new []
                    {
                        new Comment
                        {
                            Content = "comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1 comment1",
                            Id = Guid.NewGuid().ToString(),
                            CreateDateTime = DateTime.UtcNow,
                            UpdateDateTime = DateTime.UtcNow,
                            Subject = "administrator",
                            Score = 5
                        }
                    }
                }
            });
        }

        private static void InsertNotifications(CookDbContext context)
        {
            context.Notifications.AddRange(new[]
            {
                new Notification
                {
                    Id = Guid.NewGuid().ToString(),
                    Content = "create_shop",
                    CreatedDateTime = DateTime.UtcNow,
                    IsRead = false,
                    From = "administrator",
                    To = "administrator",
                    Parameters = new []
                    {
                        new NotificationParameter
                        {
                            Id = Guid.NewGuid().ToString(),
                            Type = 0,
                            Value = _firstShopId
                        }
                    }
                },
                new Notification
                {
                    Id = Guid.NewGuid().ToString(),
                    Content = "add_shop_comment",
                    CreatedDateTime = DateTime.UtcNow,
                    IsRead = false,
                    From = "administrator",
                    To = "administrator"
                },
                new Notification
                {
                    Id = Guid.NewGuid().ToString(),
                    Content = "add_shop_comment",
                    CreatedDateTime = DateTime.UtcNow,
                    IsRead = false,
                    From = "administrator",
                    To = "administrator"
                },
                new Notification
                {
                    Id = Guid.NewGuid().ToString(),
                    Content = "add_shop_comment",
                    CreatedDateTime = DateTime.UtcNow,
                    IsRead = false,
                    From = "administrator",
                    To = "administrator"
                },
                new Notification
                {
                    Id = Guid.NewGuid().ToString(),
                    Content = "add_shop_comment",
                    CreatedDateTime = DateTime.UtcNow,
                    IsRead = false,
                    From = "administrator",
                    To = "administrator"
                },
                new Notification
                {
                    Id = Guid.NewGuid().ToString(),
                    Content = "add_shop_comment",
                    CreatedDateTime = DateTime.UtcNow,
                    IsRead = false,
                    From = "administrator",
                    To = "administrator"
                },
                new Notification
                {
                    Id = Guid.NewGuid().ToString(),
                    Content = "add_shop_comment",
                    CreatedDateTime = DateTime.UtcNow,
                    IsRead = false,
                    From = "laetitia",
                    To = "administrator"
                },
                new Notification
                {
                    Id = Guid.NewGuid().ToString(),
                    Content = "add_shop_comment",
                    CreatedDateTime = DateTime.UtcNow,
                    IsRead = false,
                    From = "laetitia",
                    To = "administrator"
                }
            });
        }

        private static void InsertMessages(CookDbContext context)
        {
            context.Messages.AddRange(new[]
            {
                new Message
                {
                    Id = Guid.NewGuid().ToString(),
                    Content = "Intéressé par votre voiture",
                    CreateDateTime = DateTime.UtcNow,
                    From = "laetitia",
                    To = "administrator",
                    IsRead = false,
                    Subject = "[ACHAT] VOITURE",
                    Children = new []
                    {
                        new Message
                        {
                            Id = Guid.NewGuid().ToString(),
                            Content = "Resp",
                            From = "laetitia",
                            To = "administrator",
                            IsRead = false
                        },
                        new Message
                        {
                            Id = Guid.NewGuid().ToString(),
                            Content = "Resp",
                            From = "laetitia",
                            To = "administrator",
                            IsRead = false
                        },
                        new Message
                        {
                            Id = Guid.NewGuid().ToString(),
                            Content = "Resp 2",
                            From = "administrator",
                            To = "laetitia",
                            IsRead = false
                        },
                        new Message
                        {
                            Id = Guid.NewGuid().ToString(),
                            Content = "Resp 2",
                            From = "administrator",
                            To = "laetitia",
                            IsRead = false
                        }
                    }
                },
                new Message
                {
                    Id = Guid.NewGuid().ToString(),
                    Content = "Intéressé par un gâteau d'anniversaire",
                    CreateDateTime = DateTime.UtcNow,
                    From = "administrator",
                    To = "laetitia",
                    IsRead = false,
                    Subject = "[ACHAT] GATEAU ANNIVERSAIRE"
                },
                new Message
                {
                    Id = Guid.NewGuid().ToString(),
                    Content = "Intéressé par un gâteau d'anniversaire",
                    CreateDateTime = DateTime.UtcNow,
                    From = "administrator",
                    To = "laetitia",
                    IsRead = false,
                    Subject = "[ACHAT] GATEAU ANNIVERSAIRE"
                },
                new Message
                {
                    Id = Guid.NewGuid().ToString(),
                    Content = "Intéressé par un gâteau d'anniversaire",
                    CreateDateTime = DateTime.UtcNow,
                    From = "administrator",
                    To = "laetitia",
                    IsRead = false,
                    Subject = "[ACHAT] GATEAU ANNIVERSAIRE"
                },
                new Message
                {
                    Id = Guid.NewGuid().ToString(),
                    Content = "Intéressé par un gâteau d'anniversaire",
                    CreateDateTime = DateTime.UtcNow,
                    From = "administrator",
                    To = "laetitia",
                    IsRead = false,
                    Subject = "[ACHAT] GATEAU ANNIVERSAIRE"
                }
            });
        }

        private static void InsertClientServices(CookDbContext context)
        {
            context.ClientServices.AddRange(new[]
            {
                new ClientService
                {
                    Id = Guid.NewGuid().ToString(),
                    CategoryId = _bakeryCategoryId,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    GooglePlaceId = "ChIJQdeO0VXCw0cReXpimsXR89g",
                    Longitude = 4.3630615F,
                    Latitude = 50.8939195F,
                    Description = "first announcement",
                    Name = "FA",
                    Price = 200,
                    Subject = "laetitia",
                    StreetAddress = "223 avenue des croix du feu"
                },
                new ClientService
                {
                    Id = Guid.NewGuid().ToString(),
                    CategoryId = _bakeryCategoryId,
                    CreateDateTime = DateTime.UtcNow,
                    UpdateDateTime = DateTime.UtcNow,
                    GooglePlaceId = "ChIJQdeO0VXCw0cReXpimsXR89g",
                    Longitude = 4.3630615F,
                    Latitude = 50.8939195F,
                    Description = "second announcement",
                    Name = "SA",
                    Price = 200,
                    Subject = "administrator",
                    StreetAddress = "223 avenue des croix du feu"
                }
            });
        }
    }
}
