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
using Cook4Me.Api.Core.Helpers;
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Enrichers
{
    public interface IOrderEnricher
    {
        Task Enrich(IHalResponseBuilder halResponseBuilder, OrderAggregate order);
    }

    internal class OrderEnricher : IOrderEnricher
    {
        private readonly IResponseBuilder _responseBuilder;
        private readonly IOrderPriceCalculatorHelper _orderPriceCalculatorHelper;
        private readonly IProductRepository _productRepository;

        public OrderEnricher(IResponseBuilder responseBuilder, IOrderPriceCalculatorHelper orderPriceCalculatorHelper, IProductRepository productRepository)
        {
            _responseBuilder = responseBuilder;
            _orderPriceCalculatorHelper = orderPriceCalculatorHelper;
            _productRepository = productRepository;
        }

        public async Task Enrich(IHalResponseBuilder halResponseBuilder, OrderAggregate order)
        {
            if (halResponseBuilder == null)
            {
                throw new ArgumentNullException(nameof(halResponseBuilder));
            }

            if (order == null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            if (order.Status == OrderAggregateStatus.Created)
            {
                await _orderPriceCalculatorHelper.Update(order);
            }

            halResponseBuilder.AddEmbedded(e => e.AddObject(_responseBuilder.GetOrder(order),
                (l) =>
                {
                    l.AddOtherItem("shop", new Dtos.Link("/" + Constants.RouteNames.Shops + "/" + order.ShopId));
                    l.AddOtherItem("user", new Dtos.Link("/" + Constants.RouteNames.Users + "/" + order.Subject));
                    l.AddSelf(Constants.RouteNames.Orders + "/" + order.Id);
                }));
        }
    }
}
