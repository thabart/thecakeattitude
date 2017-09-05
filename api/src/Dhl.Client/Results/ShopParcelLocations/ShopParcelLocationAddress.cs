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

using Newtonsoft.Json;

namespace Dhl.Client.Results.ShopParcelLocations
{
    public class ShopParcelLocationAddress
    {
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationAddressNames.CountryCode)]
        public string CountryCode { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationAddressNames.ZipCode)]
        public string ZipCode { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationAddressNames.City)]
        public string City { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationAddressNames.Street)]
        public string Street { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationAddressNames.Number)]
        public string Number { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationAddressNames.IsBusiness)]
        public string IsBusiness { get; set; }
    }
}
