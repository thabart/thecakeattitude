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
using Newtonsoft.Json.Linq;
using Paypal.Client;
using Paypal.Client.Common;
using Paypal.Client.Params;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Ups.Client;
using Ups.Client.Params;

namespace Cook4Me.Api.Host.Operations.Orders
{
    public interface IConfirmOrderLabelPurchaseOperation
    {
        Task<IActionResult> Execute(string orderId, string subject, string commonId, JObject jObj);
    }

    internal class ConfirmOrderLabelPurchaseOperation : IConfirmOrderLabelPurchaseOperation
    {
        private readonly IConfirmOrderLabelPurchaseValidator _validator;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IPaypalOauthClient _paypalOauthClient;
        private readonly IPaypalClient _paypalClient;
        private readonly ISettingsProvider _settingsProvider;
        private readonly IUpsClient _upsClient;
        private readonly ICommandSender _commandSender;

        public ConfirmOrderLabelPurchaseOperation(IConfirmOrderLabelPurchaseValidator validator, IRequestBuilder requestBuilder, 
            IControllerHelper controllerHelper, IResponseBuilder responseBuilder, IPaypalOauthClient paypalOauthClient,
            IPaypalClient paypalClient, ISettingsProvider settingsProvider, IUpsClient upsClient, ICommandSender commandSender)
        {
            _validator = validator;
            _requestBuilder = requestBuilder;
            _controllerHelper = controllerHelper;
            _responseBuilder = responseBuilder;
            _paypalOauthClient = paypalOauthClient;
            _paypalClient = paypalClient;
            _settingsProvider = settingsProvider;
            _upsClient = upsClient;
            _commandSender = commandSender;
        }

        public async Task<IActionResult> Execute(string orderId, string subject, string commonId, JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }


            ConfirmOrderLabelPurchaseCommand command = null;
            try
            {
                command = _requestBuilder.GetConfirmOrderLabelPurchase(jObj);
            }
            catch (ArgumentException ex)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ex.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }
            
            command.OrderId = orderId;
            command.CommonId = commonId;
            var validationResult = await _validator.Validate(subject, command); // Validate the command.
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            if (validationResult.Order.OrderParcel.Transporter != Transporters.Ups) // Only UPS transport mode is supported.
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ErrorDescriptions.TheUpsIsOnlySupported);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            var order = validationResult.Order; // 1. Confirm the Paypal transaction.                        
            var token = await _paypalOauthClient.GetAccessToken(_settingsProvider.GetPaypalClientId(), _settingsProvider.GetPaypalClientSecret(),
                new PaypalOauthClientOptions
                {
                    ApplicationMode = PaypalApplicationModes.sandbox
                });
            var acceptedPayment = await _paypalClient.ExecutePayment(command.TransactionId, new ExecutePaymentParameter // 4. Accept the payment. (seller => my paypal account).
            {
                AccessToken = token.AccessToken,
                PayerId = command.PayerId
            });
            if (!acceptedPayment.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, acceptedPayment.ErrorResponse.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            if (order.OrderPayment.PaymentMethod == OrderPayments.Paypal) // 2. Update the "buyer paypal transaction".
            {
                var transactionId = order.OrderPayment.TransactionId;
                var newPrice = new JObject();
                var newPriceDetails = new JObject();
                newPriceDetails.Add("shipping", order.ShippingPrice);
                newPriceDetails.Add("subtotal", order.TotalPrice);
                newPrice.Add("total", order.TotalPrice + order.ShippingPrice);
                newPrice.Add("currency", "EUR");
                newPrice.Add("details", newPriceDetails);
                var updatePayment = await _paypalClient.UpdatePayment(transactionId, new UpdatePaymentParameter
                {
                    AccessToken = token.AccessToken,
                    JsonPatches = new[]
                    {
                        new JsonPatch
                        {
                            Operation = JsonPatchOperations.replace,
                            Path = "/transactions/0/amount",
                            Value = newPrice
                        }
                     }
                });
                if (!updatePayment.IsValid)
                {
                    var error = _responseBuilder.GetError(ErrorCodes.Request, updatePayment.ErrorResponse.Message);
                    return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
                }
            } 

            _commandSender.Send(command);
            return new OkResult();
        }
    }
}
