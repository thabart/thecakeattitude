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
using System.Threading.Tasks;
using Xunit;

namespace Cook4Me.Api.Host.Tests.Paypal
{
    public class PayPalTestFixture
    {
        private const string _baseUrl = "https://api.sandbox.paypal.com/v1";
        private const string _clientId = "AQsgq7UBKVB0aTLI3k-2VRP1q1iFK9qsb8t29QJIMC6M_JWejo6mgylGmSLb3fLmaSVPsHCpwBvk5Lxt";
        private const string _clientSecret = "EA930i2soWpP_XywC1CELPSIDLZxTmiNHvVJuI0qhWna6v_hXSPpATlxSArZJQWBS1pw_e9gOqbf0git";

        [Fact]
        public async Task GetOpenIdAccessToken()
        {
            var httpClientFactory = new HttpClientFactory();
            var openidClient = new PaypalOpenidClient(httpClientFactory);
            await openidClient.GetUserAccessToken(new GetOpenidAccessTokenParameter
            {
                ApplicationMode = PaypalApplicationModes.sandbox,
                // 
                AuthorizationCode = "Okh4QCEPufYqr37pozUP1Za9ke0M06xJYxVWgrGZDe4cumoHzgAweDREydl43uj5U_V6tlYYBXmMfLs56oPt0OxHilXyVNwcZGCRDOxQy25t-FazOKuC3uErv81XWXj8SOUtqEXQh3tH_adQO8wgzZjRQFL6p91cpV6oSTyrxCtsOesR0KDPY2EjLacl5EjgOVliiX71wfXVvit1",
                ClientId = _clientId,
                ClientSecret = _clientSecret
            });
        }

        [Fact]
        public async Task ExecutePayment()
        {
            var httpClientFactory = new HttpClientFactory();
            var oAuthTokenCredential = new PaypalOauthClient(httpClientFactory);
            var token = await oAuthTokenCredential.GetAccessToken(_clientId,
                _clientSecret,
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

            var res = await paypalClient.GetPayment(new GetPaymentParameter
            {
                AccessToken = token.AccessToken,
                PaymentId = r.Id
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

        }

        [Fact]
        public async Task ExecuteShippingPayment()
        {
            var httpClientFactory = new HttpClientFactory();
            var oAuthTokenCredential = new PaypalOauthClient(httpClientFactory);
            var token = await oAuthTokenCredential.GetAccessToken(_clientId,
                _clientSecret,
                new PaypalOauthClientOptions
                {
                    ApplicationMode = PaypalApplicationModes.sandbox
                });
            var paypalClient = new PaypalClient(httpClientFactory);
            var r = await paypalClient.CreatePayment(new CreatePaymentParameter
            {
                AccessToken = token.AccessToken,
                Intent = IntentPayments.sale,
                Payer = new PaypalPayer
                {
                    PaymentMethod = PaypalPaymentMethods.Paypal,
                    Email = "habarthierry-facilitator@hotmail.fr"
                },
                Transactions = new[]
                {
                   new PaymentTransaction
                   {
                       Currency = "EUR",
                       Total = 5,
                       Shipping = 5,
                       Payee = new PaypalPayee
                       {
                           Email = "habarthierry@first-receiver.fr"
                       }
                   }
                },
                CancelUrl = "http://localhost:3000/cancel",
                ReturnUrl = "http://localhost:3000/accept"
            });
            string s = "";
        }
    }
}
