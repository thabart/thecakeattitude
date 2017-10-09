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

using Cook4Me.Api.Core.Aggregates;
using System;

namespace Cook4Me.Api.Core.Helpers
{
    public interface IDiscountPriceCalculatorHelper
    {
        double CalculatePrice(ProductAggregate product, DiscountAggregate discount);
        double CalculateMoneySaved(ProductAggregate product, OrderAggregateLineDiscount discount);
    }

    internal class DiscountPriceCalculatorHelper : IDiscountPriceCalculatorHelper
    {
        public double CalculatePrice(ProductAggregate product, DiscountAggregate discount)
        {
            if (product == null)
            {
                throw new ArgumentNullException(nameof(product));
            }

            if (discount == null)
            {
                throw new ArgumentNullException(nameof(discount));
            }

            double result = product.Price;
            switch(discount.PromotionType)
            {
                case DiscountAggregatePromotions.FixedAmount:
                    result -= discount.Value;
                    break;
                case DiscountAggregatePromotions.Percentage:
                    result = result - ((result * discount.Value) / 100);
                    break;
            }

            return result;
        }

        public double CalculateMoneySaved(ProductAggregate product, OrderAggregateLineDiscount discount)
        {
            if (product == null)
            {
                throw new ArgumentNullException(nameof(product));
            }

            if (discount == null)
            {
                throw new ArgumentNullException(nameof(discount));
            }

            switch (discount.PromotionType)
            {
                case DiscountAggregatePromotions.FixedAmount:
                    return discount.Value;
                case DiscountAggregatePromotions.Percentage:
                    return ((product.Price * discount.Value) / 100);
            }

            return 0;
        }
    }
}
