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

using Newtonsoft.Json;
using System.Collections.Generic;

namespace Dhl.Client.Results.ShopParcelLocations
{
    public class ShopParcelLocation
    {
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationNames.Id)]
        public string Id { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationNames.HarmonisedId)]
        public string HarmonisedId { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationNames.PsfKey)]
        public string PsfKey { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationNames.ShopType)]
        public string ShopType { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationNames.Name)]
        public string Name { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationNames.Keyword)]
        public string Keyword { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationNames.Address)]
        public ShopParcelLocationAddress Address { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationNames.GeoLocation)]
        public ShopParcelLocationGeo GeoLocation { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.ShopParcelLocationNames.OpeningTimes)]
        public List<ShopParcelLocationOpeningTime> OpeningTimes { get; set; }
    }
}
