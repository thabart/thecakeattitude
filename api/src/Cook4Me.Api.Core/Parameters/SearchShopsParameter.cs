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

using System.Collections.Generic;

namespace Cook4Me.Api.Core.Parameters
{
    public class Location
    {
        public float Latitude { get; set; }
        public float Longitude { get; set; }
    }

    public class SearchShopsParameter
    {
        public string PlaceId { get; set; }
        public string CategoryId { get; set; }
        public string Subject { get; set; }
        public Location NorthEast { get; set; }
        public Location SouthWest { get; set; }
        public IEnumerable<OrderBy> OrderBy { get; set; }
    }
}
