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

using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Host.Validators;
using Cook4Me.Common;
using Microsoft.AspNetCore.Mvc;
using Paypal.Client;
using Paypal.Client.Params;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Orders
{
    public interface IGetPaymentDetailsOperation
    {
        Task<IActionResult> Execute(string orderId, string subject);
    }

    internal class GetPaymentDetailsOperation : IGetPaymentDetailsOperation
    {
        private readonly IGetPaymentDetailsValidator _validator;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly IPaypalOauthClient _paypalOauthClient;
        private readonly ISettingsProvider _settingsProvider;
        private readonly IPaypalClient _paypalClient;

        public GetPaymentDetailsOperation(IGetPaymentDetailsValidator validator, IResponseBuilder responseBuilder, IControllerHelper controllerHelper,
            IPaypalOauthClient paypalOauthClient, ISettingsProvider settingsProvider, IPaypalClient paypalClient)
        {
            _validator = validator;
            _responseBuilder = responseBuilder;
            _controllerHelper = controllerHelper;
            _paypalOauthClient = paypalOauthClient;
            _settingsProvider = settingsProvider;
            _paypalClient = paypalClient;
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

            var validationResult = await _validator.Validate(orderId, subject);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            var token = await _paypalOauthClient.GetAccessToken(_settingsProvider.GetPaypalClientId(), _settingsProvider.GetPaypalClientSecret(),
                new PaypalOauthClientOptions
                {
                    ApplicationMode = PaypalApplicationModes.sandbox
                });
            var payment = await _paypalClient.GetPayment(new GetPaymentParameter
            {
                AccessToken = token.AccessToken,
                PaymentId = validationResult.Order.OrderPayment.TransactionId
            });
            if (!payment.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, payment.ErrorResponse.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            return new OkObjectResult(_responseBuilder.GetPaypalPayment(payment));
        }
    }
}
