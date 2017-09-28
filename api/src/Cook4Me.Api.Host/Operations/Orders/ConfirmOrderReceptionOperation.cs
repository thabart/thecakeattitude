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
using Cook4Me.Api.Core.Bus;
using Cook4Me.Api.Core.Commands.Orders;
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
    public interface IConfirmOrderReceptionOperation
    {
        Task<IActionResult> Execute(string orderId, string subject);
    }

    internal class ConfirmOrderReceptionOperation : IConfirmOrderReceptionOperation
    {
        private readonly IConfirmOrderReceptionValidator _validator;
        private readonly IResponseBuilder _responseBuilder;
        private readonly ICommandSender _commandSender;
        private readonly IControllerHelper _controllerHelper;
        private readonly IPaypalOauthClient _paypalOauthClient;
        private readonly IPaypalClient _paypalClient;
        private readonly ISettingsProvider _settingsProvider;

        public ConfirmOrderReceptionOperation(IConfirmOrderReceptionValidator validator, IResponseBuilder responseBuilder,
            ICommandSender commandSender, IControllerHelper controllerHelper, IPaypalOauthClient paypalOauthClient, IPaypalClient paypalClient,
            ISettingsProvider settingsProvider)
        {
            _validator = validator;
            _responseBuilder = responseBuilder;
            _commandSender = commandSender;
            _controllerHelper = controllerHelper;
            _paypalOauthClient = paypalOauthClient;
            _paypalClient = paypalClient;
            _settingsProvider = settingsProvider;
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

            var isPaymentReceived = false;
            if (validationResult.Order.TransportMode == OrderTransportModes.Packet)
            {
                var token = await _paypalOauthClient.GetAccessToken(_settingsProvider.GetPaypalClientId(), _settingsProvider.GetPaypalClientSecret(),
                    new PaypalOauthClientOptions
                    {
                        ApplicationMode = PaypalApplicationModes.sandbox
                    });
                var payment = validationResult.Order.OrderPayment;
                var executePaymentResult = await _paypalClient.ExecutePayment(payment.TransactionId, new ExecutePaymentParameter
                {
                    AccessToken = token.AccessToken,
                    PayerId = payment.PayerId
                });
                if (!executePaymentResult.IsValid)
                {
                    var error = _responseBuilder.GetError(ErrorCodes.Request, executePaymentResult.ErrorResponse.Message);
                    return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
                }

                isPaymentReceived = true;
            }

            _commandSender.Send(new ReceiveOrderCommand
            {
                OrderId = orderId,
                IsPaymentReceived = isPaymentReceived
            });

            return new OkResult();
        }
    }
}
