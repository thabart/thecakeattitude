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
        void UpdatePrice(ProductAggregate product, OrderAggregateLine orderLine);
        double CalculatePrice(ProductAggregate product, DiscountAggregate discount);
        double CalculatePrice(ProductAggregate product, OrderAggregateLineDiscount discount);
        double CalculateMoneySaved(ProductAggregate product, OrderAggregateLineDiscount discount);
        double CalculateMoneySaved(ProductAggregate product, PublicProductDiscountActiveAggregate discount);
    }

    internal class DiscountPriceCalculatorHelper : IDiscountPriceCalculatorHelper
    {
        public void UpdatePrice(ProductAggregate product, OrderAggregateLine orderLine)
        {
            if (product == null)
            {
                throw new ArgumentNullException(nameof(product));
            }

            if (orderLine == null)
            {
                throw new ArgumentNullException(nameof(orderLine));
            }

            if (orderLine.OrderLineDiscount == null) // Return normal price without discount.
            {
                orderLine.Price = product.Price * orderLine.Quantity;
                return;
            }

            orderLine.OrderLineDiscount.MoneySavedPerProduct = CalculateMoneySaved(product, orderLine.OrderLineDiscount); // Calculate the discount & update the price.
            orderLine.Price = CalculatePrice(product, orderLine.OrderLineDiscount) * orderLine.Quantity;
        }

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

        public double CalculatePrice(ProductAggregate product, OrderAggregateLineDiscount discount)
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
            switch (discount.PromotionType)
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

        public double CalculateMoneySaved(ProductAggregate product, PublicProductDiscountActiveAggregate discount)
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
