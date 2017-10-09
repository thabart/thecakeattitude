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
using Cook4Me.Api.Core.Helpers;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Enrichers;
using Cook4Me.Api.Host.Helpers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Orders
{
    public interface IGetOrderOperation
    {
        Task<IActionResult> Execute(string orderId, string subject);
    }

    internal class GetOrderOperation : IGetOrderOperation
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IOrderEnricher _orderEnricher;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly IOrderPriceCalculatorHelper _orderPriceCalculatorHelper;
        private readonly IDiscountPriceCalculatorHelper _discountPriceCalculatorHelper;

        public GetOrderOperation(IOrderRepository orderRepository, IHalResponseBuilder halResponseBuilder, IOrderEnricher orderEnricher,
            IResponseBuilder responseBuilder, IControllerHelper controllerHelper, IOrderPriceCalculatorHelper orderPriceCalculatorHelper, IDiscountPriceCalculatorHelper discountPriceCalculatorHelper)
        {
            _orderRepository = orderRepository;
            _halResponseBuilder = halResponseBuilder;
            _orderEnricher = orderEnricher;
            _responseBuilder = responseBuilder;
            _controllerHelper = controllerHelper;
            _orderPriceCalculatorHelper = orderPriceCalculatorHelper;
            _discountPriceCalculatorHelper = discountPriceCalculatorHelper;
        }

        public async Task<IActionResult> Execute(string orderId, string subject)
        {
            if (string.IsNullOrWhiteSpace(orderId))
            {
                throw new ArgumentNullException(nameof(orderId));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var order = await _orderRepository.Get(orderId);
            if (order == null)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Server, ErrorDescriptions.TheOrderDoesntExist);
                return _controllerHelper.BuildResponse(System.Net.HttpStatusCode.NotFound, error);
            }

            if (order.Subject != subject && order.SellerId != subject)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Server, ErrorDescriptions.TheOrderCannotBeAccessedByYou);
                return _controllerHelper.BuildResponse(System.Net.HttpStatusCode.BadRequest, error);
            }

            if (order.OrderLines != null)
            {
                foreach(var orderLine in order.OrderLines)
                {

                }
            }

            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Orders + "/" + orderId));
            if (order.Status == OrderAggregateStatus.Created)
            {
                await _orderPriceCalculatorHelper.Update(order);
            }

            _orderEnricher.Enrich(_halResponseBuilder, order);
            return new OkObjectResult(_halResponseBuilder.Build());
        }
    }
}
