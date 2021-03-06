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
    public class Filter
    {
        public string Id { get; set; }
        public string Value { get; set; }
    }

    public class FilterPrice
    {
        public double Min { get; set; }
        public double Max { get; set; }
    }

    public class SearchProductsParameter
    {
        public SearchProductsParameter()
        {
            StartIndex = 0;
            Count = 100;
            IsPagingEnabled = true;
            Orders = new List<OrderBy>
            {
                new OrderBy
                {
                    Method = OrderByMethods.Descending,
                    Target = "update_datetime"
                }
            };
        }

        public IEnumerable<string> ProductIds { get; set; }
        public IEnumerable<string> ShopIds { get; set; }
        public IEnumerable<string> CategoryIds { get; set; }
        public IEnumerable<string> ShopCategoryIds { get; set; }
        public IEnumerable<string> Tags { get; set; }
        public IEnumerable<Filter> Filters { get; set; }
        public FilterPrice FilterPrice { get; set; }
        public string ProductName { get; set; }
        public bool? ContainsActivePromotion { get; set; }
        public int StartIndex { get; set; }
        public int Count { get; set; }
        public bool IsPagingEnabled { get; set; }
        public IEnumerable<OrderBy> Orders { get; set; }
        public Location NorthEast { get; set; }
        public Location SouthWest { get; set; }
    }
}
