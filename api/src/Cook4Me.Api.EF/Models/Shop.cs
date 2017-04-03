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

using System;

namespace Cook4Me.Api.EF.Models
{
    public class Shop
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string MapName { get; set; }
        public string PlaceId { get; set; }
        public DateTime CreateDateTime { get; set; }
    }
}
