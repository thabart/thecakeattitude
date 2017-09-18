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
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Paypal.Client;
using Paypal.Client.Common;
using Paypal.Client.Params;
using Paypal.Client.Responses;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Orders
{
    public interface IUpdateOrderOperation
    {
        Task<IActionResult> Execute(JObject jObj, string id, string subject, string commonId);
    }

    internal class UpdateOrderOperation : IUpdateOrderOperation
    {
        private readonly IResponseBuilder _responseBuilder;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly IUpdateOrderValidator _updateOrderValidator;
        private readonly IHostingEnvironment _env;
        private readonly ICommandSender _commandSender;
        private readonly IPaypalOauthClient _paypalOauthClient;
        private readonly IPaypalClient _paypalClient;
        private readonly ISettingsProvider _settingsProvider;

        public UpdateOrderOperation(IResponseBuilder responseBuilder, IRequestBuilder requestBuilder,
            IControllerHelper controllerHelper, IUpdateOrderValidator updateOrderValidator,
            IHostingEnvironment env, ICommandSender commandSender, IPaypalOauthClient paypalOauthClient, IPaypalClient paypalClient,
            ISettingsProvider settingsProvider)
        {
            _responseBuilder = responseBuilder;
            _requestBuilder = requestBuilder;
            _controllerHelper = controllerHelper;
            _updateOrderValidator = updateOrderValidator;
            _env = env;
            _commandSender = commandSender;
            _paypalOauthClient = paypalOauthClient;
            _paypalClient = paypalClient;
            _settingsProvider = settingsProvider;
        }

        public async Task<IActionResult> Execute(JObject jObj, string id, string subject, string commonId)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            UpdateOrderCommand command = null;
            try
            {
                command = _requestBuilder.GetUpdateOrder(jObj);
            }
            catch (ArgumentException ex)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ex.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            command.Id = id;
            command.CommonId = commonId;
            var validationResult = await _updateOrderValidator.Validate(command, subject);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            if (command.TransportMode == OrderTransportModes.Packet)
            {
                try
                {
                    var result = await Pay(validationResult);
                    command.PaymentOrder = new AddPaymentOrder
                    {
                        TransactionId = result.Id,
                        PaymentMethod = OrderPayments.Paypal
                    };
                }
                catch
                {
                    var error = _responseBuilder.GetError(ErrorCodes.Request, ErrorDescriptions.ThePaypalPaymentDoesntWork);
                    return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
                }
            }

            _commandSender.Send(command);
            return new OkResult();
        }
        
        private async Task<CreatePaymentResponse> Pay(UpdateOrderValidationResult result)
        {
            var token = await _paypalOauthClient.GetAccessToken(_settingsProvider.GetPaypalClientId(), _settingsProvider.GetPaypalClientSecret(),
                new PaypalOauthClientOptions
                {
                    ApplicationMode = PaypalApplicationModes.sandbox
                });
            var items = result.Order.OrderLines.Select(o =>
            {
                var product = result.Products.First(p => p.Id == o.ProductId);
                return new PaypalItem
                {
                    Name = product.Name,
                    Description = product.Description,
                    Currency = Constants.Currency,
                    Quantity = o.Quantity,
                    Price = product.Price
                };
            });
            return await _paypalClient.CreatePayment(new CreatePaymentParameter
            {
                AccessToken = token.AccessToken,
                Intent = IntentPayments.authorize,
                Payer = new PaypalPayer
                {
                    PaymentMethod = PaypalPaymentMethods.Paypal,
                    Email = result.PayerPaypalEmail
                },
                Transactions = new[]
                {
                    new PaymentTransaction
                    {
                       Currency = Constants.Currency, // TODO : Calculate the estimated price.
                       Total = result.ShippingPrice + items.Sum(i => i.Price * i.Quantity),
                       Shipping = result.ShippingPrice,
                       SubTotal = items.Sum(i => i.Price * i.Quantity),
                       Items = items,
                       Payee = new PaypalPayee
                       {
                           Email = result.SellerPaypalEmail
                       }
                    }
                },
                CancelUrl = $"{_settingsProvider.GetBaseWebsite()}/orders/{result.Order.Id}/cancelpayment",
                ReturnUrl = $"{_settingsProvider.GetBaseWebsite()}/orders/{result.Order.Id}/acceptpayment"
            });
        }
    }
}
