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

using System.Threading.Tasks;
using Ups.Client;
using Ups.Client.Factories;
using Ups.Client.Params;
using Xunit;

namespace Cook4Me.Api.Host.Tests.MondeRelay
{
    public class UpsFixture
    {
        private const string _userName = "thabart1";
        private const string _password = "CakeAttitude1989";
        private const string _accessLicenseNumber = "FD300339C9051F5C";
        private const string _locationUrl = "https://onlinetools.ups.com/ups.app/xml/Locator";

        [Fact]
        public async Task GetLocations()
        {
            var httpClientFactory = new HttpClientFactory();
            var locatorClient = new LocatorClient(httpClientFactory);
            await locatorClient.GetLocations(new GetLocationsParameter
            {
                Credentials = new UpsCredentials
                {
                    LicenseNumber = _accessLicenseNumber,
                    Password = _password,
                    UserName = _userName
                },
                Address = new UpsAddressParameter
                {
                    AddressLine = "05555 avenue des croix du feu",
                    City = "Bruxelles",
                    Country = "BE"
                }
            });
        }
    }
}
