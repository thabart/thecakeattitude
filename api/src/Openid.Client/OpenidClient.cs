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

using Cook4Me.Common;
using Cook4Me.Common.Factories;
using Newtonsoft.Json.Linq;
using Openid.Client.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Openid.Client
{
    public interface IOpenidClient
    {
        Task<UserResult> GetPublicClaims(string baseUrl, string subject);
    }

    internal class OpenidClient : IOpenidClient
    {
        private readonly IHttpClientFactory _httpClientFactory;

        public OpenidClient(IHttpClientFactory httpClientFactory, ISettingsProvider settingsProvider)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<UserResult> GetPublicClaims(string baseUrl, string subject)
        {
            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var request = new HttpRequestMessage
            {
                RequestUri = new  Uri(baseUrl + $"/users/{subject}/claims"),
                Method = HttpMethod.Get
            };
            var client = _httpClientFactory.GetHttpClient();
            var result = await client.SendAsync(request).ConfigureAwait(false);
            var content = await result.Content.ReadAsStringAsync().ConfigureAwait(false);
            return ToUserResultModel(JObject.Parse(content));
        }

        private static UserResult ToUserResultModel(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new UserResult
            {
                IsLocalAccount = jObj.Value<bool>("is_local_account")
            };
            var claimsObj = jObj.GetValue("claims") as JObject;
            var claims = new List<Claim>();
            if (claimsObj != null)
            {
                foreach(var child in claimsObj.Children())
                {
                    var childObj = child as JObject;
                    if (childObj == null)
                    {
                        continue;
                    }

                    claims.Add(new Claim(childObj.Properties().First().Name, childObj.Value<string>()));
                }
            }

            return result;
        }
    }
}
