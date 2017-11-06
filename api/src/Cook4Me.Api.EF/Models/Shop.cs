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
using System.Collections.Generic;

namespace Cook4Me.Api.EF.Models
{
    public class Shop
    {
        public string Id { get; set; }
        public string Subject { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CategoryId { get; set; }
        public string BannerImage { get; set; }
        public string ProfileImage { get; set; }
        public string CategoryMapName { get; set; }
        public string ShopMapName { get; set; }
        public string StreetAddress { get; set; }
        public string PostalCode { get; set; }
        public string Locality { get; set; }
        public string Country { get; set; }
        public string PlaceId { get; set; }
        public string GooglePlaceId { get; set; }
        public float Longitude { get; set; }
        public float Latitude { get; set; }
        public DateTime CreateDateTime { get; set; }
        public DateTime UpdateDateTime { get; set; }
        public int TotalScore { get; set; }
        public double AverageScore { get; set; }
        public virtual Category Category { get; set; }
        public virtual ICollection<ShopTag> ShopTags { get; set; }
        public virtual ICollection<PaymentMethod> PaymentMethods { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual Map CategoryMap { get; set; }
        public virtual Map ShopMap { get; set; }
        public virtual ICollection<Filter> Filters { get; set; }
        public virtual ICollection<Product> Products { get; set; }
        public virtual ICollection<ProductCategory> ProductCategories { get; set; }
        public virtual ICollection<Service> Services { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<GameEntity> GameEntities { get; set; }
    }
}
