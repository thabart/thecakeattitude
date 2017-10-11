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
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Core.Helpers
{
    public interface IOrderPriceCalculatorHelper
    {
        Task Update(OrderAggregate order);
        void Update(OrderAggregate order, IEnumerable<ProductAggregate> products);
    }

    internal class OrderPriceCalculatorHelper : IOrderPriceCalculatorHelper
    {
        private readonly IProductRepository _productRepository;
        private readonly IDiscountPriceCalculatorHelper _discountPriceCalculatorHelper;

        public OrderPriceCalculatorHelper(IProductRepository productRepository, IDiscountPriceCalculatorHelper discountPriceCalculatorHelper)
        {
            _productRepository = productRepository;
            _discountPriceCalculatorHelper = discountPriceCalculatorHelper;
        }

        public async Task Update(OrderAggregate order)
        {
            if (order == null)
            {
                throw new ArgumentNullException(nameof(order));
            }
            
            if (order.OrderLines == null || !order.OrderLines.Any())
            {
                order.TotalPrice = 0;
                return;
            }

            var productIds = order.OrderLines.Select(o => o.ProductId);
            var products = await _productRepository.Search(new SearchProductsParameter
            {
                ProductIds = productIds
            });
            Update(order, products.Content);
        }

        public void Update(OrderAggregate order, IEnumerable<ProductAggregate> products)
        {
            if (order == null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            if (products == null)
            {
                throw new ArgumentNullException(nameof(products));
            }

            var orderLines = order.OrderLines.ToList();
            foreach (var orderLine in orderLines)
            {
                var product = products.FirstOrDefault(c => c.Id == orderLine.ProductId);
                _discountPriceCalculatorHelper.UpdatePrice(product, orderLine);
            }

            order.OrderLines = orderLines;
            order.TotalPrice = orderLines.Sum(o => o.Price);
        }
    }
}
