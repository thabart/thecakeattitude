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

using Newtonsoft.Json.Linq;
using Paypal.Client;
using Paypal.Client.Common;
using Paypal.Client.Factories;
using Paypal.Client.Params;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace Cook4Me.Api.Host.Tests.Paypal
{
    public class PayPalTestFixture
    {
        private const string _baseUrl = "https://api.sandbox.paypal.com/v1";

        internal class PayResponseEnvelope
        {
            public string Timestamp { get; set; }
            public string Ack { get; set; }
            public string CorrelationId { get; set; }
            public string Build { get; set; }
        }

        internal class PayResponse
        {
            public PayResponseEnvelope Envelope { get; set;}
            public string PayKey { get; set; }
            public string PaymentExecStatus { get; set; }
        }

        [Fact]
        public async Task ExecutePayment()
        {
            var httpClientFactory = new HttpClientFactory();
            var oAuthTokenCredential = new PaypalOauthClient(httpClientFactory);
            var token = await oAuthTokenCredential.GetAccessToken("AQsgq7UBKVB0aTLI3k-2VRP1q1iFK9qsb8t29QJIMC6M_JWejo6mgylGmSLb3fLmaSVPsHCpwBvk5Lxt",
                "EA930i2soWpP_XywC1CELPSIDLZxTmiNHvVJuI0qhWna6v_hXSPpATlxSArZJQWBS1pw_e9gOqbf0git",
                new PaypalOauthClientOptions
                {
                    ApplicationMode = PaypalApplicationModes.sandbox
                });
            var paypalClient = new PaypalClient(httpClientFactory);
            var r = await paypalClient.CreatePayment(new CreatePaymentParameter
            {
                AccessToken = token.AccessToken,
                Intent = IntentPayments.authorize,
                Payer = new PaypalPayer
                {
                    PaymentMethod = PaypalPaymentMethods.Paypal,
                    Email = "habarthierry-facilitator@hotmail.fr"
                },
                Transactions = new []
                {
                   new PaymentTransaction
                   {
                       Currency = "EUR",
                       Total = 10,
                       Shipping = 5,
                       SubTotal = 5,
                       Items = new []
                       {
                           new PaypalItem
                           {
                               Currency = "EUR",
                               Name = "Red hat",
                               Price = 5,
                               Quantity = 1
                           }
                       },
                       Payee = new PaypalPayee
                       {
                           Email = "habarthierry@first-receiver.fr"
                       }
                   }
                },
                CancelUrl = "http://localhost:3000/cancel",
                ReturnUrl = "http://localhost:3000/accept"
            });

            var newPrice = new JObject();
            var newPriceDetails = new JObject();
            newPriceDetails.Add("subtotal", "5");
            newPriceDetails.Add("shipping", "3");
            newPrice.Add("total", "8");
            newPrice.Add("currency", "EUR");
            newPrice.Add("details", newPriceDetails);
            var r2 = await paypalClient.UpdatePayment(r.Id, new UpdatePaymentParameter
            {
                AccessToken = token.AccessToken,
                JsonPatches = new []
                {
                    new JsonPatch
                    {
                        Operation = JsonPatchOperations.replace,
                        Path = "/transactions/0/amount",
                        Value = newPrice
                    }
                }
            });
            var r3 = await paypalClient.ExecutePayment(r.Id, new ExecutePaymentParameter
            {
                AccessToken = token.AccessToken,
                PayerId = "" // Return the payer id returned in the http://localhost:3000/accept?paymentId=PAY-52K97665BJ176034HLG4V4EY&token=EC-0AG28408B7828094W&PayerID=RTTQKS7QPPFXL
            });
            string s = "";
            /*
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
            var tokenResult = await factory.CreateAuthSelector()
                .UseClientSecretPostAuth("AQsgq7UBKVB0aTLI3k-2VRP1q1iFK9qsb8t29QJIMC6M_JWejo6mgylGmSLb3fLmaSVPsHCpwBvk5Lxt", "EA930i2soWpP_XywC1CELPSIDLZxTmiNHvVJuI0qhWna6v_hXSPpATlxSArZJQWBS1pw_e9gOqbf0gi")
                .UseClientCredentials()
                .ExecuteAsync("https://api-3t.sandbox.paypal.com/v1/oauth2/token");

            string s = "";
            */
            /*
            var client = new HttpClient();
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            var jObj = new JObject();
            jObj.Add("intent", "authorize");
            var content = new StringContent(jObj.ToString(), Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                Content = content,
                RequestUri = new Uri($"{_baseUrl}/payments/payment")
            };
            var result = await client.SendAsync(request);
            var responseObj = JObject.Parse(await result.Content.ReadAsStringAsync());
            string s = "";
            */
            // When user clicks on buy then create a payment.

        }

        [Fact]
        public async Task Execute_Payment()
        {
            // 1. Create the PAYMENT.
            // ARRANGE
            var client = new HttpClient();
            System.Net.ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls;
            var jObj = new JObject();
            jObj.Add("actionType", "PAY");
            jObj.Add("currencyCode", "USD");
            var receiverList = new JObject();
            var receivers = new JArray();
            var primaryReceiver = new JObject();
            primaryReceiver.Add("amount", "14");
            primaryReceiver.Add("email", "habarthierry-facilitator@hotmail.fr");
            primaryReceiver.Add("primary", "true");
            receivers.Add(primaryReceiver);
            var firstReceiver = new JObject();
            firstReceiver.Add("amount", "1.00");
            firstReceiver.Add("email", "habarthierry@first-receiver.fr");
            firstReceiver.Add("primary", "false");
            receivers.Add(firstReceiver);
            var secondReceiver = new JObject();
            secondReceiver.Add("amount", "10.00");
            secondReceiver.Add("email", "habarthierry@second-receiver.fr");
            secondReceiver.Add("primary", "false");
            receivers.Add(secondReceiver);
            receiverList.Add("receiver", receivers);
            jObj.Add("receiverList", receiverList);
            jObj.Add("returnUrl", "http://localhost:3000");
            jObj.Add("cancelUrl", "http://localhost:3000");
            var requestEnv = new JObject();
            requestEnv.Add("errorLanguage", "en_US");
            requestEnv.Add("detailLevel", "ReturnAll");
            jObj.Add("requestEnvelope", requestEnv);

            var content = new StringContent(jObj.ToString(), Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage
            {
                Method = System.Net.Http.HttpMethod.Post,
                Content = content,
                RequestUri = new Uri("https://svcs.sandbox.paypal.com/AdaptivePayments/Pay")
            };
            
            request.Headers.Add("X-PAYPAL-SECURITY-USERID", "habarthierry-facilitator_api1.hotmail.fr");
            request.Headers.Add("X-PAYPAL-SECURITY-PASSWORD", "QR76ZK58CT5V3U5H");
            request.Headers.Add("X-PAYPAL-SECURITY-SIGNATURE", "AFcWxV21C7fd0v3bYYYRCpSSRl31ATZo.aofsYM-AmE4KLVXlU7rl.aL");
            request.Headers.Add("X-PAYPAL-REQUEST-DATA-FORMAT", "JSON");
            request.Headers.Add("X-PAYPAL-RESPONSE-DATA-FORMAT", "JSON");
            request.Headers.Add("X-PAYPAL-APPLICATION-ID", "APP-80W284485P519543T");

            // /v1/payments/payment
            var result = await client.SendAsync(request);
            var responseObj = JObject.Parse(await result.Content.ReadAsStringAsync());
            var paymentResponse = GetPayResponse(responseObj);


            string s = "";
            // 2. Retrieve the "payKey" and redirect the user to the following URL : https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_ap-payment&paykey=<Your-preapproval-key>
            // 3. Retrieve information about the payment : https://developer.paypal.com/docs/classic/adaptive-payments/ht_ap-basicChainedPayment-curl-etc/
        }

        private static PayResponse GetPayResponse(JObject jObj)
        {
            return new PayResponse
            {
                PayKey = jObj.GetValue("payKey").ToString(),
                PaymentExecStatus = jObj.GetValue("paymentExecStatus").ToString()
            };
        }
    }
}
