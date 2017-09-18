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
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Common;
using Microsoft.AspNetCore.Mvc;
using Paypal.Client;
using Paypal.Client.Params;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Orders
{
    public interface IGetOrderTransactionOperation
    {
        Task<IActionResult> Execute(string id, string subject);
    }

    internal class GetOrderTransactionOperation : IGetOrderTransactionOperation
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IControllerHelper _controllerHelper;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IPaypalOauthClient _paypalOauthClient;
        private readonly IPaypalClient _paypalClient;
        private readonly ISettingsProvider _settingsProvider;

        public GetOrderTransactionOperation(
            IOrderRepository orderRepository, IControllerHelper controllerHelper, 
            IResponseBuilder responseBuilder, IHalResponseBuilder halResponseBuilder,
            IPaypalOauthClient paypalOauthClient, IPaypalClient paypalClient, ISettingsProvider settingsProvider)
        {
            _orderRepository = orderRepository;
            _controllerHelper = controllerHelper;
            _responseBuilder = responseBuilder;
            _halResponseBuilder = halResponseBuilder;
            _paypalOauthClient = paypalOauthClient;
            _paypalClient = paypalClient;
            _settingsProvider = settingsProvider;
        }

        public async Task<IActionResult> Execute(string id, string subject)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var order = await _orderRepository.Get(id);
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

            if (order.OrderPayment == null)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Server, ErrorDescriptions.TheOrderDoesntHavePayment);
                return _controllerHelper.BuildResponse(System.Net.HttpStatusCode.BadRequest, error);
            }
            
            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.OrderTransaction.Replace("{id}", id)));
            if (order.OrderPayment.PaymentMethod != OrderPayments.Paypal)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Server, ErrorDescriptions.ThePaymentMethodIsNotSupported);
                return _controllerHelper.BuildResponse(System.Net.HttpStatusCode.InternalServerError, error);
            }

            var token = await _paypalOauthClient.GetAccessToken(_settingsProvider.GetPaypalClientId(),
                _settingsProvider.GetPaypalClientSecret(),
                new PaypalOauthClientOptions
                {
                    ApplicationMode = PaypalApplicationModes.sandbox
                });
            var payment = await _paypalClient.GetPayment(new GetPaymentParameter
            {
                AccessToken = token.AccessToken,
                PaymentId = order.OrderPayment.TransactionId
            });
            return new OkObjectResult(_responseBuilder.GetPaypalTransaction(payment));
        }
    }
}
