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

using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.Core.Bus;
using System;
using System.Collections.Generic;

namespace Cook4Me.Api.Core.Commands.Shop
{
    public enum UpdatePaymentInformationMethods
    {
        Cash,
        BankTransfer,
        PayPal
    }

    public class UpdateShopProductCategory
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }

    public class UpdateProductShopFilterValue
    {
        public string Id { get; set; }
        public string Content { get; set; }
    }

    public class UpdateProductShopFilter
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public IEnumerable<UpdateProductShopFilterValue> Values { get; set; }
    }

    public class UpdateGameEntity
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Col { get; set; }
        public int Row { get; set; }
        public string ProductCategoryId { get; set; }
        public GameEntityTypes Type { get; set; }
        public bool IsFlipped { get; set; }
    }
    
    public class UpdateShopCommand : Command
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string BannerImage { get; set; }
        public string ProfileImage { get; set; }
        public string StreetAddress { get; set; }
        public string PostalCode { get; set; }
        public string Locality { get; set; }
        public string Country { get; set; }
        public DateTime UpdateDateTime { get; set; }
        public string GooglePlaceId { get; set; }
        public float Longitude { get; set; }
        public float Latitude { get; set; }
        public IEnumerable<string> TagNames { get; set; }
        public IEnumerable<UpdateShopProductCategory> ProductCategories { get; set; }
        public IEnumerable<UpdateProductShopFilter> ProductFilters { get; set; }
        public IEnumerable<UpdateGameEntity> UpdateGameEntities { get; set; }
    }
}
