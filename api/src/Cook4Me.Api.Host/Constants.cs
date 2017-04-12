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
        public static class RouteNames
        {
            public const string Products = "products";
            public const string Shops = "shops";
            public const string Users = "users";
            public const string Categories = "categories";
            public const string Parents = "parents";
            public const string Claims = "claims";
            public const string Search = ".search";
            public const string Me = "me";
        }

        public static class DtoNames
        {
            public static class Shop
            {
                public const string Id = "id";
                public const string CreateDateTime = "create_datetime";
                public const string Title = "title";
                public const string Map = "map";
                public const string Place = "place";
                public const string ShopPath = "shop_path";
                public const string UndergroundPath = "underground_path";
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

            public static class Error
            {
                public const string Code = "error";
                public const string Description = "error_description";
            }
        }
    }
}
