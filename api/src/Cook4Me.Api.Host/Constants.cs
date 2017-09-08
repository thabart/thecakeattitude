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
        public static class UpsCredentials
        {
            public const string _userName = "thabart1";
            public const string _password = "CakeAttitude1989";
            public const string _accessLicenseNumber = "FD300339C9051F5C";
        }

        public static class Assets
        {
            public const string PartialShop = "./wwwroot/shops/shop_template.json";
            public const string PartialUnderground = "./wwwroot/shops/underground_template.json";
        }

        public static class RouteNames
        {
            public const string Notifications = "notifications";
            public const string ClientServices = "clientservices";
            public const string Services = "services";
            public const string Products = "products";
            public const string Shops = "shops";
            public const string Users = "users";
            public const string ShopCategories = "shopcategories";
            public const string Map = "{id}/maps/{subid}";
            public const string Configuration = ".well-known/configuration";
            public const string Parents = "parents";
            public const string Claims = "claims";
            public const string Search = ".search";
            public const string SearchOccurrences = "occurrences/.search";
            public const string Tags = "tags";
            public const string Comments = "comments";
            public const string SearchShopsComment = "{id}/comments";
            public const string SearchComments = "{id}/comments";
            public const string RemoveComment = "{id}/comments/{subid}";
            public const string Filers = "filters";
            public const string Me = "me";
            public const string SearchMine = "me/.search";
            public const string Status = "status";
            public const string Messages = "messages";
            public const string Ups = "ups";
            public const string SearchLocations = "locations/.search";
            public const string Orders = "orders";
            public const string Dhl = "dhl";
            public const string ParcelShopLocations = "parcelshops/.search";
            public const string SearchCapabalities = "ratings/.search";
        }

        public static class DtoNames
        {
            public static class UpsRatingsNames
            {
                public const string TotalPrice = "total_price";
            }

            public static class GetUpsRatingsParameterNames
            {
                public const string AlternateDeliveryAddress = "alternate_delivery_address";
                public const string Shipper = "shipper";
                public const string ShipTo = "ship_to";
                public const string ShipFrom = "ship_from";
                public const string Package = "package";
            }

            public static class UpsPackageParameterNames
            {
                public const string Length = "length";
                public const string Width = "width";
                public const string Height = "height";
                public const string Weight = "weight";
            }

            public static class UpsShipParameterNames
            {
                public const string Name = "name";
                public const string Address = "address";
            }

            public static class UpsShipperParameterNames
            {
                public const string Name = "name";
                public const string Address = "address";
            }

            public static class UpsAlternateDeliveryAddressParameterNames
            {
                public const string Name = "name";
                public const string Address = "address";
            }

            public static class UpsAddressParameterNames
            {
                public const string AddressLine = "address_line";
                public const string City = "city";
                public const string Country = "country_code";
                public const string PostalCode = "postal_code";
            }

            public static class RatingsNames
            {
                public const string Ratings = "ratings";
            }

            public static class RatingNames
            {
                public const string Code = "code";
                public const string PriceWithTax = "price_with_tax";
                public const string PriceWithoutTax = "price_without_tax";
            }

            public static class DhlRatingNames
            {
                public const string ParcelType = "parcel_type";
            }

            public static class SearchDhlCapabilitiesParameterNames
            {
                public const string ParcelType = "parcel_type";
                public const string ToZipCode = "to_zip_code";
            }

            public static class DropLocationsNames
            {
                public const string Locations = "locations";
            }

            public static class DropLocationNames
            {
                public const string Id = "id";
                public const string Name = "name";
                public const string Address = "address";
                public const string Geolocation = "location";
                public const string OpeningTimes = "opening_times";
            }

            public static class DropLocationAddressNames
            {
                public const string CountryCode = "country";
                public const string ZipCode = "zip";
                public const string City = "city";
                public const string Street = "street";
                public const string Number = "number";
            }

            public static class DropLocationGeoloc
            {
                public const string Latitude = "lat";
                public const string Longitude = "lng";
            }

            public static class DropLocationOpeningTime
            {
                public const string TimeFrom = "time_from";
                public const string TimeTo = "time_to";
                public const string Day = "day";
            }

            public static class SearchDhlParcelShopLocationsParameterNames
            {
                public const string City = "city";
                public const string HouseNumber = "house_number";
                public const string Street = "street";
                public const string ZipCode = "zip_code";
                public const string Query = "query";
            }

            public static class SearchOrdersParameterNames
            {
                public const string Clients = "clients";
                public const string Sellers = "sellers";
                public const string Orders = "orders";
                public const string Status = "status";
            }

            public static class DropLocationResponse
            {
                public const string Id = "id";
                public const string Email = "email";
                public const string Fax = "fax";
                public const string HomePage = "home_page";
                public const string Phone = "phone";
                public const string Address = "address";
                public const string Image = "img";
                public const string OperatingHours = "operating_hours";
                public const string Distance = "distance";
                public const string Geocode = "geocode";
            }

            public static class OrderStatusNames
            {
                public const string NumberOfOrdersCreated = "number_of_orders_created";
                public const string NumberOfOrderLinesCreated = "number_of_lines_created";
            }

            public static class OrderNames
            {
                public const string Id = "id";
                public const string TotalPrice = "total_price";
                public const string CreateDateTime = "create_datetime";
                public const string UpdateDateTime = "update_datetime";
                public const string Status = "status";
                public const string Subject = "subject";
                public const string Lines = "lines";
                public const string ShopId = "shop_id";
                public const string TransportMode = "transport_mode";
                public const string Package = "package";
            }

            public static class OrderLineNames
            {
                public const string Id = "id";
                public const string Price = "price";
                public const string Quantity = "quantity";
                public const string ProductId = "product_id";
            }

            public static class LocationDistanceResponse
            {
                public const string Value = "value";
                public const string UnitOfMeasure = "unit_of_measure";
            }

            public static class StandardHoursResponse
            {
                public const string Days = "days";
            }

            public static class DayOfWeekResponse
            {
                public const string CloseHours = "close_hours";
                public const string OpenHours = "open_hours";
                public const string Day = "day";
            }

            public static class AddressKeyFormatResponse
            {
                public const string AddressLine = "address_line";
                public const string Country = "country";
                public const string City = "city";
            }

            public static class SearchUpsLocationsResponse
            {
                public const string Geocode = "geocode";
                public const string DropLocations = "drop_locations";
            }

            public static class GeocodeResponse
            {
                public const string Latitutde = "lat";
                public const string Longitude = "long";
            }

            public static class SearchUpsLocations
            {
                public const string AddressLine = "address_line";
                public const string Country = "country";
                public const string City = "city";
                public const string PostalCode = "postal_code";
            }

            public static class SearchUserMessage
            {
                public const string IsParent = "is_parent";
                public const string Orders = "orders";
                public const string IncludeParent = "include_parent";
            }

            public static class UserMessage
            {
                public const string Id = "id";
                public const string From = "from";
                public const string To = "to";
                public const string Content = "content";
                public const string ServiceId = "service_id";
                public const string ProductId = "product_id";
                public const string ClientServiceId = "clientservice_id";
                public const string CreateDateTime = "create_datetime";
                public const string Attachments = "attachments";
                public const string IsRead = "is_read";
                public const string Subject = "subject";
                public const string ParentId = "parent_id";
            }

            public static class UserMessageAttachment
            {
                public const string Id = "id";
                public const string Link = "link";
                public const string Name = "name";
            }

            public static class Message
            {
                public const string CommonId = "common_id";
            }

            public static class ProductCategory
            {
                public const string Id = "id";
                public const string Name = "name";
                public const string Description = "description";
                public const string ShopSectionName = "shop_section_name";
            }

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
                public const string CategoryMapName = "category_map_name";
                public const string CategoryMap = "category_map";
                public const string ShopMap = "shop_map";
                public const string CategoryId = "category_id";
                public const string Category = "category";
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
                // Comments
                public const string Comments = "comments";
                // Product categories
                public const string ProductCategories = "product_categories";
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
                public const string ShopCategoryIds = "shop_category_ids";
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
                public const string Comments = "comments";
                public const string NbComments = "nb_comments";
                public const string AvailableInStock = "available_in_stock";
            }

            public static class Service
            {
                public const string Id = "id";
                public const string ShopId = "shop_id";
                public const string Name = "name";
                public const string Description = "description";
                public const string Price = "price";
                public const string NewPrice = "new_price";
                public const string Images = "images";
                public const string Tags = "tags";
                public const string Occurrence = "occurrence";
                public const string AverageScore = "average_score";
                public const string TotalScore = "total_score";
                public const string NbComments = "nb_comments";
                public const string CreateDatetime = "create_datetime";
                public const string UpdateDatetime = "update_datetime";
            }

            public static class NotificationStatus
            {
                public const string NbRead = "nb_read";
                public const string NbUnread = "nb_unread";
            }

            public static class NotificationParameter
            {
                public const string Id = "id";
                public const string Type = "type";
                public const string Value = "value";
            }

            public static class Notification
            {
                public const string Id = "id";
                public const string From = "from";
                public const string To = "to";
                public const string StartDate = "start_date";
                public const string EndDate = "end_date";
                public const string Content = "content";
                public const string CreateDate = "create_date";
                public const string IsRead = "is_read";
                public const string Parameters = "parameters";
            }

            public static class ClientService
            {
                public const string Id = "id";
                public const string Name = "name";
                public const string Description = "description";
                public const string CategoryId = "category_id";
                public const string GooglePlaceId = "place_id";
                public const string Price = "price";
                public const string CreateDateTime = "create_datetime";
                public const string UpdateDateTime = "update_datetime";
                public const string Category = "category";
                public const string Location = "location";
                public const string Subject = "subject";
                public const string StreetAddress = "street_address";
            }

            public static class Occurrence
            {
                public const string StartDate = "start_date";
                public const string EndDate = "end_date";
                public const string StartTime = "start_time";
                public const string EndTime = "end_time";
                public const string Days = "days";
            }

            public static class ServiceOccurrence
            {
                public const string StartDateTime = "start_datetime";
                public const string EndDateTime = "end_datetime";
                public const string StartTime = "start_time";
                public const string EndTime = "end_time";
                public const string Days = "days";
            }

            public static class SearchService
            {
                public const string FromDateTime = "from_datetime";
                public const string ToDateTime = "to_datetime";
                public const string NorthEast = "ne";
                public const string SouthWest = "sw";
                public const string Orders = "orders";
                public const string Tag = "tag";
                public const string ShopCategoryIds = "shop_category_ids";
            }

            public static class ParcelNames
            {
                public const string Transporter = "transporter";
                public const string EstimatedPrice = "estimated_price";
                public const string Buyer = "buyer";
                public const string Seller = "seller";
                public const string ParcelShop = "parcel_shop";
            }

            public static class ParcelActorNames
            {
                public const string Name = "name";
                public const string Address = "address";
            }

            public static class ParcelShopNames
            {
                public const string Name = "name";
                public const string Id = "id";
                public const string Address = "address";
                public const string Location = "location";
            }

            public static class ParcelAddressNames
            {
                public const string AddressLine = "address_line";
                public const string City = "city";
                public const string CountryCode = "country_code";
                public const string PostalCode = "postal_code";
            }

            public static class Comment
            {
                public const string Id = "id";
                public const string Content = "content";
                public const string Score = "score";
                public const string ShopId = "shop_id";
                public const string ProductId = "product_id";
                public const string ServiceId = "service_id";
                public const string Subject = "subject";
                public const string CreateDatetime = "create_datetime";
                public const string UpdateDatetime = "update_datetime";
                public const string NbComments = "nb_comments";
                public const string TotalScore = "total_score";
                public const string AverageScore = "average_score";
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
                public const string PaypalAccount = "paypal_account";
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
                public const string PinImagePartialPath = "pin_image_partial_path";
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
                public const string Tag = "tag";
                public const string ShopIds = "shop_ids";
            }

            public static class SearchProduct
            {
                public const string Filters = "filters";
                public const string MinPrice = "min_price";
                public const string MaxPrice = "max_price";
                public const string ContainsValidPromotions = "contains_valid_promotions";
                public const string Orders = "orders";
                public const string ProductIds = "product_ids";
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
