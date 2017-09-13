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

using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Paypal.Client.Factories;

namespace Paypal.Client
{
    public interface IPaypalOauthClient
    {
        Task<PaypalToken> GetAccessToken(string clientId, string clientSecret, PaypalOauthClientOptions options);
    }

    internal class PaypalOauthClient : IPaypalOauthClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private const string OAuthTokenPath = "/v1/oauth2/token";
        private PaypalOauthClientOptions _options;
        private PaypalToken _paypalToken { get; set; }
        private int _accessTokenExpirationSafetyGapInSeconds;
        private DateTime _accessTokenLastCreationDate;
        private SDKVersion _sdkVersion;

        public int AccessTokenExpirationSafetyGapInSeconds
        {
            get { return this._accessTokenExpirationSafetyGapInSeconds; }
            set { this._accessTokenExpirationSafetyGapInSeconds = value; }
        }

        public PaypalOauthClient(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _sdkVersion = new SDKVersionImpl();
            AccessTokenExpirationSafetyGapInSeconds = 120;
        }

        public async Task<PaypalToken> GetAccessToken(string clientId, string clientSecret, PaypalOauthClientOptions options)
        {
            if (_paypalToken == null)
            {
                _paypalToken = new PaypalToken
                {
                    ClientId = clientId,
                    ClientSecret = clientSecret
                };
            }

            if (_options == null)
            {
                _options = options;
            }

            if (!string.IsNullOrWhiteSpace(_paypalToken.AccessToken))
            {
                double elapsedSeconds = (DateTime.Now - _paypalToken.AccessTokenLastCreationDate).TotalSeconds;
                if (elapsedSeconds > _paypalToken.AccessTokenExpirationInSeconds - this.AccessTokenExpirationSafetyGapInSeconds)
                {
                    _paypalToken.AccessToken = null;
                }
            }
            
            if (string.IsNullOrEmpty(_paypalToken.AccessToken))
            {
                var base64ClientId = ConvertClientCredentialsToBase64String(_paypalToken.ClientId, _paypalToken.ClientSecret);
                await UpdateOauthToken(base64ClientId);
            }

            return _paypalToken;
        }

        private async Task UpdateOauthToken(string base64ClientId)
        {
            Uri uniformResourceIdentifier = null;
            Uri baseUri = null;
            switch(_options.ApplicationMode)
            {
                case PaypalApplicationModes.sandbox:
                    baseUri = new Uri(BaseConstants.RESTSandboxEndpoint);
                    break;
                case PaypalApplicationModes.live:
                    baseUri = new Uri(BaseConstants.RESTLiveEndpoint);
                    break;
            }

            Uri.TryCreate(baseUri, OAuthTokenPath, out uniformResourceIdentifier);
            var httpRequest = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = uniformResourceIdentifier,
                Content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "grant_type", "client_credentials" }
                })
            };
            Dictionary<string, string> headers = new Dictionary<string, string>();
            headers.Add("Authorization", "Basic " + base64ClientId);
            httpRequest.Headers.TryAddWithoutValidation("Accept", "*/*");
            var userAgentHeader = new UserAgentHeader(_sdkVersion == null ? "" : _sdkVersion.GetSDKId(), _sdkVersion == null ? "" : _sdkVersion.GetSDKVersion());
            var userAgentMap = userAgentHeader.GetHeader();
            foreach (var entry in userAgentMap)
            {
                Encoding iso8851 = Encoding.GetEncoding("iso-8859-1", new EncoderReplacementFallback(string.Empty), new DecoderExceptionFallback());
                byte[] bytes = Encoding.Convert(Encoding.UTF8,iso8851, Encoding.UTF8.GetBytes(entry.Value));                
                httpRequest.Headers.TryAddWithoutValidation("User-Agent", iso8851.GetString(bytes));
            }

            foreach (KeyValuePair<string, string> header in headers)
            {
                httpRequest.Headers.TryAddWithoutValidation(header.Key, header.Value);
            }

            var client = _httpClientFactory.GetHttpClient();
            var response = await client.SendAsync(httpRequest).ConfigureAwait(false);
            var content = await response.Content.ReadAsStringAsync().ConfigureAwait(false);
            var deserializedObject = JsonConvert.DeserializeObject(content) as JObject;
            _paypalToken.AccessToken = deserializedObject.Value<string>("access_token");
            _paypalToken.ApplicationId = deserializedObject.Value<string>("app_id");
            _paypalToken.Scope = deserializedObject.Value<string>("scope");
            _paypalToken.AccessTokenExpirationInSeconds = deserializedObject.Value<int>("expires_in");
            _paypalToken.AccessTokenLastCreationDate = DateTime.Now;
        }

        private class SDKVersionImpl : SDKVersion
        {
            public string GetSDKId()
            {
                return BaseConstants.SdkId;
            }

            public string GetSDKVersion()
            {
                return BaseConstants.SdkVersion;
            }
        }
        
        private static string ConvertClientCredentialsToBase64String(string clientId, string clientSecret)
        {
            if (string.IsNullOrEmpty(clientId))
            {
                throw new ArgumentNullException(nameof(clientId));
            }
            else if (string.IsNullOrEmpty(clientSecret))
            {
                throw new ArgumentNullException(nameof(clientSecret));
            }

            try
            {
                byte[] bytes = Encoding.UTF8.GetBytes(string.Format("{0}:{1}", clientId, clientSecret));
                return Convert.ToBase64String(bytes);
            }
            catch (Exception ex)
            {
                if (ex is FormatException || ex is ArgumentNullException)
                {
                    throw new Exception("Unable to convert client credentials to base-64 string.\n" +
                                                         "  clientId: \"" + clientId + "\"\n" +
                                                         "  clientSecret: \"" + clientSecret + "\"\n" +
                                                         "  Error: " + ex.Message);
                }

                throw new Exception(ex.Message, ex);
            }
        }
    }    
}
