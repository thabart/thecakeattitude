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
using Paypal.Client.Factories;
using Paypal.Client.Params;
using Paypal.Client.Responses;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace Paypal.Client
{
    public interface IPaypalOpenidClient
    {
        Task<OpenIdTokenResponse> GetUserAccessToken(GetOpenidAccessTokenParameter parameter);
    }

    internal class PaypalOpenidClient : IPaypalOpenidClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private const string _oauthTokenPath = "/v1/identity/openidconnect/tokenservice";

        public PaypalOpenidClient(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<OpenIdTokenResponse> GetUserAccessToken(GetOpenidAccessTokenParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            Uri uniformResourceIdentifier = null;
            Uri baseUri = null;
            switch (parameter.ApplicationMode)
            {
                case PaypalApplicationModes.sandbox:
                    baseUri = new Uri(BaseConstants.RESTSandboxEndpoint);
                    break;
                case PaypalApplicationModes.live:
                    baseUri = new Uri(BaseConstants.RESTLiveEndpoint);
                    break;
            }
            Uri.TryCreate(baseUri, _oauthTokenPath, out uniformResourceIdentifier);
            var base64ClientId = Converters.ConvertClientCredentialsToBase64String(parameter.ClientId, parameter.ClientSecret);
            var httpRequest = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = uniformResourceIdentifier,
                Content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "grant_type", "authorization_code" },
                    { "code", parameter.AuthorizationCode }
                })
            };
            httpRequest.Headers.Add("Authorization", "Basic " + base64ClientId);
            var client = _httpClientFactory.GetHttpClient();
            var response = await client.SendAsync(httpRequest).ConfigureAwait(false);
            var content = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            var res = JObject.Parse(content);
            return new OpenIdTokenResponse
            {
                AccessToken = res.Value<string>("access_token"),
                TokenType = res.Value<string>("token_type"),
                RefreshToken = res.Value<string>("refresh_token"),
                IdToken = res.Value<string>("id_token"),
                ExpiresIn = res.Value<int>("expires_in")
            };
        }
    }
}
