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

namespace Cook4Me.Api.Host
{
    internal static class Constants
    {
        public static class Assets
        {
            public const string PartialShop = "./Assets/shop.json";
            public const string PartialUnderground = "./Assets/underground.json";
        }

        public static class RouteNames
        {
            public const string Products = "products";
            public const string Shops = "shops";
            public const string Users = "users";
            public const string ShopCategories = "shopcategories";
            public const string Map = "{id}/maps/{subid}";
            public const string Configuration = ".well-known/configuration";
            public const string Parents = "parents";
            public const string Claims = "claims";
            public const string Search = ".search";
            public const string Tags = "tags";
            public const string Comments = "comments";
            public const string SearchShopsComment = "{id}/comments";
            public const string RemoveShopComment = "{id}/comments/{subid}";
            public const string Filers = "filters";
            public const string Me = "me";
        }

        public static class DtoNames
        {
            public static class Shop
            {
                public const string Id = "id";
                public const string Subject = "subject";
                // General information.
                public const string Name = "name";
                public const string Description = "description";
                public const string Tags = "tags";
                public const string BannerImage = "banner_image";
                public const string ProfileImage = "profile_image";
                public const string MapName = "map_name";
                public const string CategoryId = "category_id";
                public const string Place = "place";
                // Address
                public const string StreetAddress = "street_address";
                public const string PostalCode = "postal_code";
                public const string Locality = "locality";
                public const string Country = "country";
                public const string Location = "location";
                public const string GooglePlaceId = "google_place_id";
                // Payment
                public const string Payments = "payments";
                // Filters
                public const string Filters = "filters";
                // Tilemap information
                public const string ShopPath = "shop_path";
                public const string UndergroundPath = "underground_path";
                // Other information
                public const string CreateDateTime = "create_datetime";
                public const string UpdateDateTime = "update_datetime";
                public const string AverageScore = "average_score";
                public const string NbComments = "nb_comments";
                public const string TotalScore = "total_score";
            }

            public static class Paginate
            {
                public const string StartIndex = "start_index";
                public const string Length = "length";
                public const string Count = "count";
            }
            
            public static class Product
            {
                public const string Id = "id";
                public const string Name = "name";
                public const string Description = "description";
                public const string CategoryId = "category_id";
                public const string Price = "price";
                public const string NewPrice = "new_price";
                public const string UnitOfMeasure = "unit_of_measure";
                public const string Quantity = "quantity";
                public const string ShopId = "shop_id";
                public const string CreateDateTime = "create_datetime";
                public const string UpdateDateTime = "update_datetime";
                public const string Tags = "tags";
                public const string Images = "images";
                public const string Filters = "filters";
                public const string Promotions = "promotions";
                public const string AverageScore = "average_score";
                public const string TotalScore = "total_score";
            }

            public static class Comment
            {
                public const string Id = "id";
                public const string Content = "content";
                public const string Score = "score";
                public const string ShopId = "shop_id";
                public const string Subject = "subject";
                public const string CreateDatetime = "create_datetime";
                public const string UpdateDatetime = "update_datetime";
            }

            public static class RatingSummary
            {
                public const string NbComments = "nb_comments";
                public const string AverageStore = "average_score";
            }

            public static class Location
            {
                public const string Latitude = "lat";
                public const string Longitude = "lng";
            }

            public static class PaymentMethod
            {
                public const string Method = "method";
                public const string Iban = "iban";
            }

            public static class Filter
            {
                public const string Name = "name";
                public const string Id = "id";
                public const string Values = "values";
                public const string Value = "value";
            }

            public static class ProductFilter
            {
                public const string FilterId = "filter_id";
                public const string ValueId = "value_id";
                public const string Name = "name";
                public const string Content = "content";
            }

            public static class FilterValue
            {
                public const string Id = "id";
                public const string Content = "content";
            }

            public static class Promotion
            {
                public const string Id = "id";
                public const string ProductId = "product_id";
                public const string Discount = "discount";
                public const string Type = "type";
                public const string Code = "code";
                public const string UpdateDateTime = "update_datetime";
                public const string CreateDateTime = "create_datetime";
                public const string ExpirationDateTime = "expiration_datetime";
            }

            public static class Seller
            {
                public const string Pseudo = "pseudo";
                public const string Email = "email";
                public const string PhoneNumber = "phone_number";
            }

            public static class Category
            {
                public const string Id = "id";
                public const string Name = "name";
                public const string Description = "description";
                public const string ParentId = "parent_id";
                public const string MainMap = "main_map";
                public const string Maps = "maps";
                public const string Children = "children";
            }

            public static class Map
            {
                public const string MapName = "map_name";
                public const string OverViewName = "overview_name";
                public const string MapPartialUrl = "map_link";
                public const string OverviewPartialUrl = "overview_link";
                public const string IsMain = "is_main";
            }

            public static class Tag
            {
                public const string Name = "name";
                public const string Description = "description";
            }

            public static class User
            {
                public const string Pseudo = "pseudo";
                public const string IsSeller = "is_seller";
                public const string StreetAddress = "street_address";
                public const string StreetNumber = "street_number";
                public const string PostalCode = "postal_code";
                public const string City = "city";
                public const string Email = "email";
                public const string PhoneNumber = "phone_number";
            }

            public static class SearchShop
            {
                public const string Subject = "subject";
                public const string NorthEast = "ne";
                public const string SouthWest = "sw";
                public const string Orders = "orders";
            }

            public static class SearchProduct
            {
                public const string Filters = "filters";
                public const string MinPrice = "min_price";
                public const string MaxPrice = "max_price";
                public const string ContainsValidPromotions = "contains_valid_promotions";
                public const string Orders = "orders";
            }

            public static class OrderBy
            {
                public const string Target = "target";
                public const string Method = "method";
            }

            public static class Error
            {
                public const string Code = "error";
                public const string Description = "error_description";
            }

            public static class HalLink
            {
                public const string Name = "name";
                public const string Templated = "templated";
                public const string Href = "href";
            }

            public static class HalResponse
            {
                public const string Self = "self";
                public const string Links = "_links";
                public const string Items = "items";
                public const string Embedded = "_embedded";
            }
        }
    }
}
