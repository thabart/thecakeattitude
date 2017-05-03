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

using Cook4Me.Api.Core.Models;
using System.Collections.Generic;

namespace Cook4Me.Api.Core.Commands.Shop
{
    public class AddShopCommand : Command
    {
        public string Id { get; set; }
        public string Subject { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public IEnumerable<string> Tags { get; set; }
        public string BannerImage { get; set; }
        public string ProfileImage { get; set; }
        public string MapName { get; set; }
        public string CategoryId { get; set; }
        public string PlaceId { get; set; }
        public string StreetAddress { get; set; }
        public string PostalCode { get; set; }
        public string Locality { get; set; }
        public string Country { get; set; }
        public string ShopRelativePath { get; set; }
        public string UndergroundRelativePath { get; set; }
        public string CreateDateTime { get; set; }
        public string UpdateDateTime { get; set; }
        public string GooglePlaceId { get; set; }
        public float Longitude { get; set; }
        public float Latitude { get; set; }
        public IEnumerable<PaymentMethod> PaymentMethods { get; set; }
    }
}
