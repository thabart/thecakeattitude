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

using SimpleIdentityServer.Client;
using Sumup.Client;
using Sumup.Client.Factories;
using Sumup.Client.Params;
using System;
using System.Threading.Tasks;
using Xunit;

namespace Cook4Me.Api.Host.Tests.Sumup
{
    public class SumupClientFixture
    {
        [Fact]
        public async Task AddClient()
        {
            var factory = new IdentityServerClientFactory();
            var result = await factory.CreateAuthSelector()
                .UseClientSecretBasicAuth("WmHaR9DdeX83Vs3ULFd8UPtB4fDP", "ddbd6de1beb66337604569a3572084e9513301430812fa605cd8e4e037c6b63a")
                .UseClientCredentials("user.subaccounts")
                .ExecuteAsync("https://api.sumup.com/token");
            var sumUpClient = new SumupClient(new HttpClientFactory());
            await sumUpClient.AddClient(new AddClientParameter
            {
                AccessToken = result.AccessToken,
                Id = Guid.NewGuid().ToString(),
                Name = "Thierry Habart",
                Phone = "0485350536",
                Address = new SumupAddress
                {
                    City = "Bruxelles",
                    Country = "BE",
                    Line1 = "223 avenue des croix du feu",
                    PostalCode = "1020"
                }
            });
        }
    }
}
