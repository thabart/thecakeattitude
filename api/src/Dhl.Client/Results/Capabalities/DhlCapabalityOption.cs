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

namespace Dhl.Client.Results.Capabalities
{
    public class DhlCapabalityOption
    {
        [JsonProperty(PropertyName = Constants.DtoNames.DhlCapabalityOptionNames.Key)]
        public string Key { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.DhlCapabalityOptionNames.Rank)]
        public int Rank { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.DhlCapabalityOptionNames.Price)]
        public DhlPrice Price { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.DhlCapabalityOptionNames.InputType)]
        public string InputType { get; set; }
        [JsonProperty(PropertyName = Constants.DtoNames.DhlCapabalityOptionNames.Exclusions)]
        public List<DhlExclusion> Exclusions { get; set; }
    }
}
