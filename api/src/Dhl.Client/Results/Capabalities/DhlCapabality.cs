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
using System.Collections.Generic;

namespace Dhl.Client.Results.Capabalities
{
    public class DhlCapabality
    {
        [JsonProperty(PropertyName = Constants.DtoNames.DhlCapabalityNames.Rank)]
        public int Rank { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.DhlCapabalityNames.FromCountryCode)]
        public string FromCountryCode { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.DhlCapabalityNames.ToCountryCode)]
        public string ToCountryCode { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.DhlCapabalityNames.ProductKey)]
        public string ProductKey { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.DhlCapabalityNames.ParcelTypes)]
        public DhlParcelType ParcelTypes { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.DhlCapabalityNames.Options)]
        public List<DhlCapabalityOption> Options { get; set; }
    }
}
