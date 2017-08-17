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

using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Ups.Client.Params;
using Xunit;

namespace Cook4Me.Api.Host.Tests.MondeRelay
{
    public class UpsFixture
    {
        private const string _userName = "thabart1";
        private const string _password = "SORbonne1989";
        private const string _accessLicenseNumber = "FD300339C9051F5C";
        private const string _testUrl = "https://wwwcie.ups.com/rest/Ship";

        [Fact]
        public async Task Ship()
        {
            var httpHandler = new HttpClientHandler();
            ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
            var client = new HttpClient(httpHandler);
            var parameter = new ShipmentRequest
            {
                Security = new UpsSecurity
                {
                    ServiceAccessToken = new ServiceAccessToken
                    {
                        AccessLicenseNumber = _accessLicenseNumber
                    },
                    UsernameToken = new UsernameToken
                    {
                        Password = _password,
                        Username = _userName
                    }
                }
            };
            var json = JsonConvert.SerializeObject(parameter);
            var body = new StringContent(json);
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                Content = body,
                RequestUri = new Uri(_testUrl)
            };
            var serializedContent = await client.SendAsync(request).ConfigureAwait(false);
            var res = await serializedContent.Content.ReadAsStringAsync();
            string s = "";
        }
    }
}
