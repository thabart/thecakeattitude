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

namespace Cook4Me.Api.Host.Operations.Orders
{
    public interface IPurchaseLabelOperation
    {
        Task<IActionResult> Execute(string id, string subject, JObject jObj);
    }

    internal class PurchaseLabelOperation : IPurchaseLabelOperation
    {
        private readonly IPurchaseOrderLabelValidator _validator;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IPaypalOauthClient _paypalOauthClient;
        private readonly IPaypalClient _paypalClient;
        private readonly ISettingsProvider _settingsProvider;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly ICommandSender _commandSender;

        public PurchaseLabelOperation(IPurchaseOrderLabelValidator validator, IRequestBuilder requestBuilder,
             IPaypalOauthClient paypalOauthClient, IPaypalClient paypalClient, ISettingsProvider settingsProvider,
             IResponseBuilder responseBuilder, IControllerHelper controllerHelper, ICommandSender commandSender)
        {
            _validator = validator;
            _requestBuilder = requestBuilder;
            _paypalOauthClient = paypalOauthClient;
            _paypalClient = paypalClient;
            _settingsProvider = settingsProvider;
            _responseBuilder = responseBuilder;
            _controllerHelper = controllerHelper;
            _commandSender = commandSender;
        }

        public async Task<IActionResult> Execute(string id, string subject, JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var command = _requestBuilder.GetPurchaseOrderLabelCommand(jObj);
            command.OrderId = id;
            var validationResult = await _validator.Validate(subject, command);
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
            var payment = await _paypalClient.CreatePayment(new CreatePaymentParameter
            {
                AccessToken = token.AccessToken,
                Intent = IntentPayments.sale,
                Payer = new PaypalPayer
                {
                    PaymentMethod = PaypalPaymentMethods.Paypal,
                    Email = validationResult.PayerPaypalEmail
                },
                Transactions = new[]
               {
                    new PaymentTransaction
                    {
                       Currency = Constants.Currency,
                       Total = validationResult.ShippingPrice,
                       Shipping = validationResult.ShippingPrice,
                       Payee = new PaypalPayee
                       {
                           Email = validationResult.SellerPaypalEmail
                       }
                    }
                },
                CancelUrl = $"{_settingsProvider.GetBaseWebsite()}/orders/{validationResult.Order.Id}/cancelpurchaselabel",
                ReturnUrl = $"{_settingsProvider.GetBaseWebsite()}/orders/{validationResult.Order.Id}/acceptpurchaselabel"
            });

            var approvalUrl = payment.Links.FirstOrDefault(l => l.Rel == "approval_url").Href;
            var res = new JObject();
            res.Add("approval_url", approvalUrl);
            return new OkObjectResult(res);
        }
    }
}
