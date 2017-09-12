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

namespace Sumup.Client
{
    public static class Constants
    {
        public static class DtoNames
        {
            public static class ClientNames
            {
                public const string Id = "customer_id";
                public const string PersonalDetails = "personal_details";
                public const string Name = "name";
                public const string Phone = "phone";
                public const string Address = "address";
            } 

            public static class ClientResponseAddressNames
            {
                public const string AddressLine1 = "address_line1";
                public const string AddressLine2 = "address_line2";
                public const string City = "city";
                public const string Country = "country";
                public const string CountryEnName = "country_en_name";
                public const string CountryNativeName = "country_native_name";
                public const string RegionId = "region_id";
                public const string RegionName = "region_name";
                public const string PostCode = "post_code";
                public const string LandLine = "landline";
                public const string Line1 = "line1";
                public const string Line2 = "line2";
                public const string PostalCode = "postal_code";
                public const string State = "state";
            }

            public static class SumupAddressNames
            {
                public const string Line1 = "line1";
                public const string Line2 = "line2";
                public const string Country = "country";
                public const string PostalCode = "postal_code";
                public const string City = "city";
                public const string State = "state";
            }
        }
    }
}
