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

using Newtonsoft.Json.Linq;
using Paypal.Client.Common;
using Paypal.Client.Factories;
using Paypal.Client.Params;
using Paypal.Client.Responses;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Paypal.Client
{
    public interface IPaypalClient
    {

    }

    internal class PaypalClient : IPaypalClient
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public PaypalClient(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<CreatePaymentResponse> CreatePayment(CreatePaymentParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            if (string.IsNullOrWhiteSpace(parameter.AccessToken))
            {
                throw new ArgumentNullException(nameof(parameter.AccessToken));
            }

            var jobj = ToDto(parameter);
            var client = _httpClientFactory.GetHttpClient();
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                Content = new StringContent(jobj.ToString(), Encoding.UTF8, "application/json"),
                RequestUri = new Uri($"{BaseConstants.RESTSandboxEndpoint}v1/payments/payment")
            };

            request.Headers.Add("Authorization", $"Bearer {parameter.AccessToken}");
            var response = await client.SendAsync(request).ConfigureAwait(false);
            var content = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            var jObj = JObject.Parse(content);
            return ToCreatePaymentModel(jObj);
        }

        private static CreatePaymentResponse ToCreatePaymentModel(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new CreatePaymentResponse
            {
                Id = jObj.Value<string>("id")
            };

            var intentObj = jObj.Value<string>("intent");
            var stateObj = jObj.Value<string>("state");
            if (intentObj == "authorize")
            {
                result.Intent = IntentPayments.authorize;
            }
            else if (intentObj == "order")
            {
                result.Intent = IntentPayments.order;
            }
            else if (intentObj == "sale")
            {
                result.Intent = IntentPayments.sale;
            }

            if (stateObj == "approved")
            {
                result.State = PaymentStates.Approved;
            }
            else if (stateObj == "created")
            {
                result.State = PaymentStates.Created;
            }
            else if (stateObj == "failed")
            {
                result.State = PaymentStates.Failed;
            }

            var payer = jObj.GetValue("payer") as JObject;
            if (payer != null)
            {
                result.Payer = ToPayerModel(payer);
            }

            var linksObj = jObj.GetValue("links") as JArray;
            if (linksObj != null)
            {
                var links = new List<HalLink>();
                foreach(var l in linksObj)
                {
                    links.Add(ToHalLinkModel(l as JObject));
                }

                result.Links = links;
            }

            return result;
        }

        private static HalLink ToHalLinkModel(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new HalLink
            {
                Href = jObj.Value<string>("href"),
                Method = jObj.Value<string>("method"),
                Rel = jObj.Value<string>("rel")
            };
        }

        private static PaypalPayer ToPayerModel(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new PaypalPayer();
            var paymentMethod = jObj.Value<string>("payment_method");
            if (paymentMethod == "credit_card")
            {
                result.PaymentMethod = PaypalPaymentMethods.CreditCard;
            }
            else if (paymentMethod == "paypal")
            {
                result.PaymentMethod = PaypalPaymentMethods.Paypal;
            }

            var payerInfo = jObj.GetValue("payer_info") as JObject;
            if (payerInfo != null)
            {
                result.Email = payerInfo.Value<string>("email");
                result.FirstName = payerInfo.Value<string>("first_name");
                result.MiddleName = payerInfo.Value<string>("middle_name");
                result.LastName = payerInfo.Value<string>("last_name");
                result.Suffix = payerInfo.Value<string>("suffix");
                result.PayerId = payerInfo.Value<string>("payer_id");
            }

            return result;
        }

        private static JObject ToDto(CreatePaymentParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            var jObj = new JObject();
            var payer = new JObject();
            var redirectUrls = new JObject();
            var transactions = new JArray();
            var intent = string.Empty;
            switch (parameter.Intent)
            {
                case IntentPayments.sale:
                    intent = "sale";
                    break;
                case IntentPayments.authorize:
                    intent = "authorize";
                    break;
                case IntentPayments.order:
                    intent = "order";
                    break;
            }

            if (parameter.Transactions != null)
            {
                foreach(var transaction in parameter.Transactions)
                {
                    transactions.Add(ToDto(transaction));
                }
            }

            redirectUrls.Add("return_url", parameter.ReturnUrl);
            redirectUrls.Add("cancel_url", parameter.CancelUrl);
            payer.Add("payment_method", "paypal");
            jObj.Add("intent", intent);
            jObj.Add("payer", payer);
            jObj.Add("transactions", transactions);
            jObj.Add("redirect_urls", redirectUrls);
            return jObj;
        }

        private static JObject ToDto(PaymentTransaction parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }
            
            var jObj = new JObject();
            var amount = new JObject();
            var amountDetails = new JObject();
            var paymentOptions = new JObject();
            var itemsList = new JObject();
            var items = new JArray();
            if (parameter.Items != null)
            {
                foreach(var item in parameter.Items)
                {
                    items.Add(ToDto(item));
                }
            }

            itemsList.Add("items", items);
            paymentOptions.Add("allowed_payment_method", "INSTANT_FUNDING_SOURCE");
            amountDetails.Add("subtotal", parameter.SubTotal);
            amountDetails.Add("tax", parameter.Tax);
            amountDetails.Add("shipping", parameter.Shipping);
            amountDetails.Add("handling_fee", parameter.HandlingFee);
            amountDetails.Add("shipping_discount", parameter.ShippingDiscount);
            amountDetails.Add("insurance", parameter.Insurance);
            amount.Add("total", parameter.Total);
            amount.Add("currency", parameter.Currency);
            amount.Add("details", amountDetails);
            jObj.Add("amount", amount);
            jObj.Add("description", parameter.Description);
            jObj.Add("custom", parameter.Custom);
            jObj.Add("invoice_number", parameter.InvoiceNumber);
            jObj.Add("payment_options", paymentOptions);
            jObj.Add("item_list", itemsList);
            if (parameter.ShippingAddress != null)
            {
                jObj.Add("shipping_address", ToDto(parameter.ShippingAddress));
            }

            if (parameter.Payee != null)
            {
                jObj.Add("payee", ToDto(parameter.Payee));
            }
            
            return jObj;
        }

        private static JObject ToDto(PaypalPayer payer)
        {
            if (payer == null)
            {
                throw new ArgumentNullException(nameof(payer));
            }

            var jObj = new JObject();
            var payerInfo = new JObject();
            var paymentMethod = string.Empty;
            switch (payer.PaymentMethod)
            {
                case PaypalPaymentMethods.CreditCard:
                    paymentMethod = "credit_card";
                    break;
                case PaypalPaymentMethods.Paypal:
                    paymentMethod = "paypal";
                    break;
            }

            payerInfo.Add("email", payer.Email);
            payerInfo.Add("first_name", payer.FirstName);
            payerInfo.Add("last_name", payer.LastName);
            payerInfo.Add("middle_name", payer.MiddleName);
            // TODO : Continue
            jObj.Add("payment_method", paymentMethod);
            jObj.Add("payer_info", payerInfo);
            return jObj;
        }

        private static JObject ToDto(PaypalPayee payee)
        {
            if (payee == null)
            {
                throw new ArgumentNullException(nameof(payee));
            }

            var jObj = new JObject();
            jObj.Add("email", payee.Email);
            return jObj;
        }

        private static JObject ToDto(PaypalItem item)
        {
            if (item == null)
            {
                throw new ArgumentNullException(nameof(item));
            }

            var jObj = new JObject();
            jObj.Add("description", item.Description);
            jObj.Add("name", item.Name);
            jObj.Add("price", item.Price);
            jObj.Add("quantity", item.Quantity);
            jObj.Add("sku", item.Sku);
            jObj.Add("tax", item.Tax);
            jObj.Add("currency", item.Currency);
            return jObj;
        }

        private static JObject ToDto(PaypalShippingAddress adr)
        {
            if (adr == null)
            {
                throw new ArgumentNullException(nameof(adr));
            }

            var jObj = new JObject();
            jObj.Add("recipient_name", adr.RecipientName);
            jObj.Add("line1", adr.Line1);
            jObj.Add("line2", adr.Line2);
            jObj.Add("city", adr.City);
            jObj.Add("country_code", adr.CountryCode);
            jObj.Add("postal_code", adr.PostalCode);
            jObj.Add("phone", adr.Phone);
            jObj.Add("state", adr.State);
            return jObj;
        }
    }
}
