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

using System;
using System.IO;
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

        [Fact]
        public async Task GetLocations()
        {
            var httpClientFactory = new HttpClientFactory();
            var locatorClient = new UpsClient(httpClientFactory);
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
                    AddressLine = "05555 avenue des croix du feu",
                    City = "Bruxelles",
                    Country = "BE"
                }
            });
        }

        [Fact]
        public async Task GetRatings()
        {
            var httpClientFactory = new HttpClientFactory();
            var upsClient = new UpsClient(httpClientFactory);
            await upsClient.GetRatings(new GetUpsRatingsParameter
            {
                Credentials = new UpsCredentials
                {
                    LicenseNumber = _accessLicenseNumber,
                    Password = _password,
                    UserName = _userName
                },
                AlternateDeliveryAddress = new UpsAlternateDeliveryAddressParameter
                {
                    Name = "U31095277",
                    Address = new UpsAddressParameter
                    {
                        AddressLine = "RUE EMILE VANDERVELD 39",
                        City = "Bruxelles",
                        PostalCode = "1200",
                        Country = "BE"
                    }
                },
                Shipper = new UpsShipperParameter
                {
                    Name = "Habart Thierry",
                    Address = new UpsAddressParameter
                    {
                        AddressLine = "10 avenue des croix du feu",
                        City = "Bruxelles",
                        PostalCode = "1020",
                        Country = "BE"
                    }
                },
                ShipFrom = new UpsShipParameter
                {
                    Name = "Habart Thierry",
                    Address = new UpsAddressParameter
                    {
                        AddressLine = "10 avenue des croix du feu",
                        City = "Bruxelles",
                        PostalCode = "1020",
                        Country = "BE"
                    }
                },
                ShipTo = new UpsShipParameter
                {
                    Name = "David Donab",
                    Address = new UpsAddressParameter
                    {
                         AddressLine = "rue solleveld 20",
                         City = "Bruxelles",
                         PostalCode = "1200",
                         Country = "BE"
                    }
                },
                Package = new UpsPackageParameter
                {
                    Length = 5,
                    Width = 4,
                    Height = 3,
                    Weight = 1
                }
            });
        }

        [Fact]
        public async Task ConfirmShip()
        {
            var httpClientFactory = new HttpClientFactory();
            var upsClient = new UpsClient(httpClientFactory);
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
                    Name = "PRESSE D'OR",
                    Address = new UpsAddressParameter
                    {
                        AddressLine = "CHAUSSéE D'IXELLES 33-35",
                        City = "IXELLES",
                        PostalCode = "1050",
                        Country = "BE"
                    }
                },
                Shipper = new UpsShipperParameter
                {
                    Name = "Habart Thierry",
                    Address = new UpsAddressParameter
                    {
                        AddressLine = "5 - 9 Place de Dinant",
                        City = "Bruxelles",
                        PostalCode = "1000",
                        Country = "BE"
                    }
                },
                ShipFrom = new UpsShipParameter
                {
                    Name = "Habart Thierry",
                    AttentionName = "Habart Thierry",
                    CompanyName = "Habart Thierry",
                    Address = new UpsAddressParameter
                    {
                        AddressLine = "5 - 9 Place de Dinant",
                        City = "Bruxelles",
                        PostalCode = "1000",
                        Country = "BE"
                    }
                },
                ShipTo = new UpsShipParameter
                {
                    Name = "David Donab",
                    AttentionName = "David Donab.",
                    CompanyName = "David Donab.",
                    Address = new UpsAddressParameter
                    {
                        AddressLine = "rue solleveld 20",
                        City = "Bruxelles",
                        PostalCode = "1200",
                        Country = "BE"
                    }
                },
                Package = new UpsPackageParameter
                {
                    Length = 5,
                    Width = 4,
                    Height = 3,
                    Weight = 1
                },
                EmailAddress = "habarthierry@hotmail.fr"
            });
            var res = "";
        }

        [Fact]
        public async Task AcceptShip()
        {
            var httpClientFactory = new HttpClientFactory();
            var upsClient = new UpsClient(httpClientFactory);
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
            var upsClient = new UpsClient(httpClientFactory);
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
