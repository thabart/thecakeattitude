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

namespace Dhl.Client
{
    internal static class Constants
    {
        public static class DtoNames
        {
            public static class ShopParcelLocationNames
            {
                public const string Id = "id";
                public const string HarmonisedId = "harmonisedId";
                public const string PsfKey = "psfKey";
                public const string ShopType = "shopType";
                public const string Name = "name";
                public const string Keyword = "keyword";
                public const string Address = "address";
                public const string GeoLocation = "geoLocation";
                public const string OpeningTimes = "openingTimes";
            }

            public static class ShopParcelLocationAddressNames
            {
                public const string CountryCode = "countryCode";
                public const string ZipCode = "zipCode";
                public const string City = "city";
                public const string Street = "street";
                public const string Number = "number";
                public const string IsBusiness = "isBusiness";
            }

            public static class ShopParcelLocationGeoNames
            {
                public const string Latitude = "latitude";
                public const string Longitude = "longitude";
            }

            public static class ShopParcelLocationOpeningTimeNames
            {
                public const string TimeFrom = "timeFrom";
                public const string TimeTo = "timeTo";
                public const string WeekDay = "weekDay";
            }

            public static class DhlCapabalityNames
            {
                public const string Rank = "rank";
                public const string FromCountryCode = "fromCountryCode";
                public const string ToCountryCode = "toCountryCode";
                public const string ProductKey = "productKey";
                public const string ParcelTypes = "parcelTypes";
                public const string Options = "options";
            }

            public static class DhlCapabalityOptionNames
            {
                public const string Key = "key";
                public const string Rank = "rank";
                public const string Price = "price";
                public const string InputType = "inputType";
                public const string Exclusions = "exclusions";
            }

            public static class DhlParcelTypeNames
            {
                public const string Key = "key";
                public const string MinWeightKg = "minWeightKg";
                public const string MaxWeightKg = "maxWeightKg";
                public const string Dimensions = "dimensions";
                public const string Price = "price";
            }

            public static class DhlExclusionNames
            {
                public const string Key = "key";
                public const string Rank = "rank";
                public const string InputType = "inputType";
            }

            public static class DhlPriceNames
            {
                public const string WithoutTax = "withoutTax";
                public const string WithTax = "withTax";
            }

            public static class DhlDimensionNames
            {
                public const string MaxLengthCm = "maxLengthCm";
                public const string MaxWidthCm = "maxWidthCm";
                public const string MaxHeightCm = "maxHeightCm";
            }
        }
    }
}
