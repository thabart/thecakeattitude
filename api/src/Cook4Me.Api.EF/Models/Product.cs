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
    public class Product
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CategoryId { get; set; }
        public double Price { get; set; }
        public double NewPrice { get; set; }
        public string UnitOfMeasure { get; set; }
        public double Quantity { get; set; }
        public double AvailableInStock { get; set; }
        public DateTime CreateDateTime { get; set; }
        public DateTime UpdateDateTime { get; set; }
        public string ShopId { get; set; }
        public virtual ProductCategory Category { get; set; }
        public virtual ICollection<ProductImage> Images { get; set; }
        public virtual ICollection<Comment> Comments { get; set; }
        public virtual ICollection<ProductTag> Tags { get; set; }
        public virtual ICollection<ProductFilter> Filters { get; set; }
        public virtual ICollection<ProductPromotion> Promotions { get; set; }
        public virtual Shop Shop { get; set; }
    }
}
