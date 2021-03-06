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

using System;
using System.Collections.Generic;

namespace Cook4Me.Api.Core.Aggregates
{
    public enum DiscountAggregateValidities
    {
        Timer,
        Counter,
        Both
    }

    public enum DiscountAggregatePromotions
    {
        FixedAmount,
        Percentage
    }

    public class DiscountProductAggregate
    {
        public double MoneySaved { get; set; }
        public string ProductId { get; set; }
    }

    public class DiscountAggregate
    {
        public bool IsValid()
        {
            if (!IsActive) { return false; }
            var currentDateTime = DateTime.UtcNow;
            var isCounterValid = Counter > 0;
            var isTimeValid = StartDateTime <= currentDateTime && currentDateTime <= EndDateTime;
            switch(Validity)
            {
                case DiscountAggregateValidities.Both:
                    return isCounterValid && isTimeValid;
                case DiscountAggregateValidities.Counter:
                    return isCounterValid;
                case DiscountAggregateValidities.Timer:
                    return isTimeValid;
            }

            return false;
        }

        public string Id { get; set; }
        public string Code { get; set; }
        public DiscountAggregatePromotions PromotionType { get; set; } // FixedAmount & Percentage
        public DiscountAggregateValidities Validity { get; set; } // Timer & counter & both
        public int Counter { get; set; }
        public double Value { get; set; }
        public bool IsActive { get; set; }
        public bool IsPrivate { get; set; }
        public DateTime StartDateTime { get; set; }
        public DateTime EndDateTime { get; set; }
        public DateTime CreateDateTime { get; set; }
        public DateTime UpdateDateTime { get; set; }
        public string Subject { get; set; }
        public IEnumerable<DiscountProductAggregate> Products { get; set; }
    }
}
