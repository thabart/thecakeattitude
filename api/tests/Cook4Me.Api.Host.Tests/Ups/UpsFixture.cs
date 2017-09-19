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

using Cook4Me.Common.Factories;
using System;
using System.IO;
using System.Threading.Tasks;
using Ups.Client;
using Ups.Client.Params;
using Xunit;

namespace Cook4Me.Api.Host.Tests.MondeRelay
{
    public class UpsFixture
    {
        private const string _userName = "thabart1";
        private const string _password = "CakeAttitude1989";
        private const string _accessLicenseNumber = "FD300339C9051F5C";

        [Fact]
        public async Task GetLocations()
        {
            var settingsProvider = new FakeSettingsProvider();
            var locatorClient = new UpsClient(new FakeHttpClientFactory(), settingsProvider);
            var result = await locatorClient.GetLocations(new GetLocationsParameter
            {
                Credentials = new UpsCredentials
                {
                    LicenseNumber = _accessLicenseNumber,
                    Password = _password,
                    UserName = _userName
                },
                Address = new UpsAddressParameter
                {
                    AddressLine = "10 GOERLITZER STRASSE",
                    City = "NEUSS",
                    PostalCode = "41460",
                    Country = "DE"
                }
            });
            string s = "";
        }

        [Fact]
        public async Task GetRatings()
        {
            var settingsProvider = new FakeSettingsProvider();
            var upsClient = new UpsClient(new FakeHttpClientFactory(), settingsProvider);
            var res = await upsClient.GetRatings(new GetUpsRatingsParameter
            {
                Credentials = new UpsCredentials
                {
                    LicenseNumber = _accessLicenseNumber,
                    Password = _password,
                    UserName = _userName
                },
                AlternateDeliveryAddress = new UpsAlternateDeliveryAddressParameter
                {
                    Name = "U91006321",
                    Address = new UpsAddressParameter
                    {
                        AddressLine = "MUEHLENSTRASSE 20",
                        City = "NEUSS",
                        PostalCode = "41460",
                        Country = "DE"
                    }
                },
                Shipper = new UpsShipperParameter
                {
                    Name = "Habart Thierry",
                    Address = new UpsAddressParameter
                    {
                        AddressLine = "10 GOERLITZER STRASSE",
                        City = "NEUSS",
                        PostalCode = "41460",
                        Country = "DE"
                    }
                },
                ShipFrom = new UpsShipParameter
                {
                    Name = "Habart Thierry",
                    Address = new UpsAddressParameter
                    {
                        AddressLine = "10 GOERLITZER STRASSE",
                        City = "NEUSS",
                        PostalCode = "41460",
                        Country = "DE"
                    }
                },
                ShipTo = new UpsShipParameter
                {
                    Name = "Laetitia Buyse",
                    Address = new UpsAddressParameter
                    {
                         AddressLine = "NIEDERWALLSTRASSE 29",
                        City = "NEUSS",
                        PostalCode = "41460",
                        Country = "DE"
                    }
                },
                Package = new UpsPackageParameter
                {
                    Length = 5,
                    Width = 4,
                    Height = 3,
                    Weight = 1
                },
                UpsService = UpsServices.UpsStandard
            });
            string s = "";
        }

        [Fact]
        public async Task ConfirmShip()
        {
            var settingsProvider = new FakeSettingsProvider();
            var upsClient = new UpsClient(new FakeHttpClientFactory(), settingsProvider);
            var tmp = await upsClient.ConfirmShip(new ConfirmShipParameter
            {
                Credentials = new UpsCredentials
                {
                    LicenseNumber = _accessLicenseNumber,
                    Password = _password,
                    UserName = _userName
                },
                AlternateDeliveryAddress = new UpsAlternateDeliveryAddressParameter
                {
                    Name = "U91006321",
                    Address = new UpsAddressParameter
                    {
                        AddressLine = "MUEHLENSTRASSE 20",
                        City = "NEUSS",
                        PostalCode = "41460",
                        Country = "DE"
                    }
                },
                Shipper = new UpsShipperParameter
                {
                    Name = "Habart Thierry",
                    Address = new UpsAddressParameter
                    {
                        AddressLine = "10 GOERLITZER STRASSE",
                        City = "NEUSS",
                        PostalCode = "41460",
                        Country = "DE"
                    }
                },
                ShipFrom = new UpsShipParameter
                {
                    Name = "Habart Thierry",
                    AttentionName = "Habart Thierry",
                    CompanyName = "Habart Thierry",
                    Address = new UpsAddressParameter
                    {
                        AddressLine = "10 GOERLITZER STRASSE",
                        City = "NEUSS",
                        PostalCode = "41460",
                        Country = "DE"
                    }
                },
                ShipTo = new UpsShipParameter
                {
                    Name = "Laetitia Buyse",
                    AttentionName = "Laetitia Buyse",
                    CompanyName = "Laetitia Buyse",
                    Address = new UpsAddressParameter
                    {
                        AddressLine = "NIEDERWALLSTRASSE 29",
                        City = "NEUSS",
                        PostalCode = "41460",
                        Country = "DE"
                    }
                },
                Package = new UpsPackageParameter
                {
                    Length = 5,
                    Width = 4,
                    Height = 3,
                    Weight = 1
                },
                EmailAddress = "habarthierry@hotmail.fr",
                UpsService = UpsServices.UpsStandard
            });
            var res = "";
        }

        [Fact]
        public async Task AcceptShip()
        {
            var httpClientFactory = new HttpClientFactory();
            var settingsProvider = new FakeSettingsProvider();
            var upsClient = new UpsClient(httpClientFactory, settingsProvider);
            var res = await upsClient.AcceptShip(new AcceptShipParameter
            {
                Credentials = new UpsCredentials
                {
                    LicenseNumber = _accessLicenseNumber,
                    Password = _password,
                    UserName = _userName
                }
            });
        }

        [Fact]
        public async Task GetLabel()
        {
            var httpClientFactory = new HttpClientFactory();
            var settingsProvider = new FakeSettingsProvider();
            var upsClient = new UpsClient(httpClientFactory, settingsProvider);
            var res = await upsClient.GetLabel(new GetLabelParameter
            {
                Credentials = new UpsCredentials
                {
                    LicenseNumber = _accessLicenseNumber,
                    Password = _password,
                    UserName = _userName
                },
                TrackingNumber = "1ZC4RT41YZ00313825"
            });
            if (res.LabelResults != null && res.LabelResults.LabelImage != null)
            {
                var b64 = res.LabelResults.LabelImage.GraphicImage;
                var bytes = Convert.FromBase64String(b64);
                File.WriteAllBytes(@"C:\Output\output.gif", bytes);
            }

            string s = "";
        }
    }
}
