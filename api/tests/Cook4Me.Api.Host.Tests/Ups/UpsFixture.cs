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
using Microsoft.AspNetCore.Mvc;
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
                    Width = 5,
                    Height = 5,
                    Weight = 2
                },
                EmailAddress = "habarthierry@hotmail.fr",
                UpsService = UpsServices.UpsStandard
            });
            var res2 = "";
        }

        [Fact]
        public async Task Void()
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
                    Width = 5,
                    Height = 5,
                    Weight = 2
                },
                EmailAddress = "habarthierry@hotmail.fr",
                UpsService = UpsServices.UpsStandard
            });
            var res2 = "";
            var v = await upsClient.Cancel(tmp.ShipmentIdentificationNumber, new UpsCredentials
            {
                LicenseNumber = _accessLicenseNumber,
                Password = _password,
                UserName = _userName
            });
            string s2 = "";
        }

        [Fact]
        public async Task AcceptShip()
        {
            var settingsProvider = new FakeSettingsProvider();
            var upsClient = new UpsClient(new FakeHttpClientFactory(), settingsProvider);
            var res = await upsClient.AcceptShip(new AcceptShipParameter
            {
                Credentials = new UpsCredentials
                {
                    LicenseNumber = _accessLicenseNumber,
                    Password = _password,
                    UserName = _userName
                },
                ShipmentDigest = "rO0ABXNyACpjb20udXBzLmVjaXMuY29yZS5zaGlwbWVudHMuU2hpcG1lbnREaWdlc3SgJfYX2HjqXgIAMFoAF2lzQUJSUmV0dXJuZWRpblJlc3BvbnNlWgARaXNBQlJVc2VyRWxpZ2libGVaAAVpc0FJQVoAGGlzQWx0ZXJuYXRlUGF5bWVudE1ldGhvZFoAE2lzQ04yMk51bWJlclByZXNlbnRaAA9pc0NOMjJSZXF1ZXN0ZWRaAB1pc0NvbWJpbmVkTUlhbmRMYWJlbEluZGljYXRvcloAEmlzRW5jcnlwdGlvbkZhaWxlZFoAGmlzSXRlbWl6ZWRDaGFyZ2VzUmVxdWVzdGVkWgAkaXNMYWJlbFJlcXVlc3RlZEZvclNpbXBsaWZpZWRSZXR1cm5zWgAiaXNNSUR1YWxSZXR1cm5BY2Nlc3NvcmlhbFJlcXVlc3RlZFoAGmlzTUlSZXR1cm5TZXJ2aWNlUmVxdWVzdGVkWgAZaXNNYWlsSW5ub3ZhdGlvbnNTaGlwbWVudFoADWlzTWlzc2luU0RTSWRaABZpc01pc3NpbmdTRFNNYXRjaExldmVsWgAjaXNNaXNzaW5nU0RTTmVnb3RpYXRlZFJhdGVJbmRpY2F0b3JaABFpc1BheVBhbFJlcXVlc3RlZFoAG2lzUHJlQXV0aG9yaXplZEFQTVJlcXVlc3RlZFoAImlzUHJlQXV0aG9yaXplZENyZWRpdENhcmRSZXF1ZXN0ZWRaAB5pc1ByZUF1dGhvcml6ZWRQYXlQYWxSZXF1ZXN0ZWRaABBpc1JlY2VpcHRUaGVybWFsWgAOaXNTRFNSZXF1ZXN0ZWRaABlpc1NoaXBwZXJBdXRob3JpemVkQnlUUEZDWgAbaXNTaW1wbGlmaWVkUmV0dXJuc1NoaXBtZW50WgASaXNTdXJlUG9zdFNoaXBtZW50WgAUaXNUUEZDUmF0ZXNSZXF1ZXN0ZWRaACFpc1RQRkNSYXRlc1JlcXVlc3RlZEFuZEF1dGhvcml6ZWRaABlpc1RheEluZm9ybWF0aW9uUmVxdWVzdGVkWgAkaXNVUFNQcmVtaXVtQ2FyZUFjY2Vzc29yaWFsUmVxdWVzdGVkWgAcaXNVc2VyRGlzY291bnRSYXRpbmdFbGlnaWJsZVoAEmxhYmVsTGlua0luZGljYXRvcloAEnJhdGVDaGFydEluZGljYXRvcloAFXJhdGluZ01ldGhvZFJlcXVlc3RlZEwAGEludGVybmF0aW9uYWxGb3Jtc0RldGFpbHQAK0xjb20vdXBzL2lmYy9jb3JlL0ludGVybmF0aW9uYWxGb3Jtc0RldGFpbDtMAAtQYXltZW50R1VJRHQAEkxqYXZhL2xhbmcvU3RyaW5nO0wADGRpc3RyaWN0Q29kZXEAfgACWwAPaW5zdHJ1Y3Rpb25Db2RldAATW0xqYXZhL2xhbmcvU3RyaW5nO0wADmxhYmVsUHJpbnRUeXBlcQB+AAJMAA9vQ09DRm9ybURldGFpbHN0ABVMamF2YS91dGlsL0FycmF5TGlzdDtMABNvbmNhbGxQaWNrdXBSZXF1ZXN0dAApTGNvbS91cHMvY29tbW9uL2NvcmUvT25jYWxsUGlja3VwUmVxdWVzdDtMAA5vdXRwdXRMYW5ndWFnZXQAHUxjb20vdXBzL2VjaXMvY29yZS9VUFNMb2NhbGU7TAANcGF5UGFsQWNjb3VudHQAG0xjb20vdXBzL2ltcy9QYXlQYWxBY2NvdW50O0wAF3JlZ2lzdHJhdGlvbkNvdW50cnlDb2RlcQB+AAJMAAxzZWN1cml0eUNvZGVxAH4AAkwACHNoaXBtZW50dAAeTGNvbS91cHMvY29tbW9uL2NvcmUvU2hpcG1lbnQ7TAAKc3RhdHVzTGluZXQAKkxjb20vdXBzL2NvbW1vbi9zdGF0dXNsaW5lL1NoaXBTdGF0dXNMaW5lO0wAEHVzZXJFbWFpbEFkZHJlc3NxAH4AAkwABHV1aWRxAH4AAnhwAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAc3IAKWNvbS51cHMuaWZjLmNvcmUuSW50ZXJuYXRpb25hbEZvcm1zRGV0YWlsAAAAAAAAAAECABpaABBwYXBlcmxlc3NJbnZvaWNlWgAOcGFwZXJsZXNzTmFmdGFaABRwYXBlcmxlc3NQYWNraW5nTGlzdFMAB3NlZFR5cGVaABZzaW5nbGVDdXJyZW5jeVNoaXBtZW50WgAQdmFsaWRhdGVTaGlwbWVudEwAC1JlcXVlc3RUeXBlcQB+AAJMAAxTaGlwbWVudEluZm90AB9MY29tL3Vwcy9pZmMvY29yZS9TaGlwbWVudEluZm87TAASY2xpZW50T3B0aW9uYWxEYXRhdAATTGphdmEvdXRpbC9IYXNoTWFwO0wAEmNuMjJBZGRpdGlvbmFsSW5mb3QAJUxjb20vdXBzL2lmYy9jb3JlL0NOMjJBZGRpdGlvbmFsSW5mbztMAB9jb21tZXJjaWFsSW52b2ljZUFkZGl0aW9uYWxJbmZvdAAyTGNvbS91cHMvaWZjL2NvcmUvQ29tbWVyY2lhbEludm9pY2VBZGRpdGlvbmFsSW5mbztMAAhjb250YWN0c3EAfgAETAAMY3VycmVuY3lDb2RlcQB+AAJMABFkYXRlT2ZFeHBvcnRhdGlvbnEAfgACTAAQZXhwb3J0aW5nQ2FycmllcnEAfgACTAAFZm9ybXNxAH4ABEwACWZvcm1zRGVzY3EAfgACTAAMZm9ybXNHcm91cElEcQB+AAJMAAtmb3Jtc1N0YXR1c3EAfgACTAAGbG9jYWxlcQB+AAJMAB9uQUZUQUNlcnRPZk9yaWdpbkFkZGl0aW9uYWxJbmZvdAA5TGNvbS91cHMvaWZjL2NvcmUvTkFGVEFDZXJ0aWZpY2F0ZU9mT3JpZ2luQWRkaXRpb25hbEluZm87TAAIcHJvZHVjdHNxAH4ABEwADHJldHVyblRvUGFnZXEAfgACTAARc0VEQWRkaXRpb25hbEluZm90ACRMY29tL3Vwcy9pZmMvY29yZS9TRURBZGRpdGlvbmFsSW5mbztMABx1U0NlcnRPZk9yaWdpbkFkZGl0aW9uYWxJbmZvdAA2TGNvbS91cHMvaWZjL2NvcmUvVVNDZXJ0aWZpY2F0ZU9mT3JpZ2luQWRkaXRpb25hbEluZm87TAAHdWdmSW5mb3EAfgAEeHAAAAAAAAEBcHBwcHBwcHB0AANVUFNwcHBwcHBwcHBwcHBwcHBwc3IAJ2NvbS51cHMuY29tbW9uLmNvcmUuT25jYWxsUGlja3VwUmVxdWVzdBIGqhlxlgNLAgAWWgASYWNjb3VudEJhc2VkUmF0aW5nWgAQYWx0ZXJuYXRlQWRkcmVzc1oADGNhbGN1bGF0ZVRheFoAF2Rpc2NvdW50UmF0aW5nSW5kaWNhdG9ySQAJcmF0ZUNoYXJ0WgARdXNlckxldmVsRGlzY291bnRaABd3ZWVrZW5kU2VydmljZVRlcnJpdG9yeUwAB2FkZHJlc3N0AB1MY29tL3Vwcy9jb21tb24vY29yZS9BZGRyZXNzO0wACmNsaWVudEluZm90ACBMY29tL3Vwcy9jb21tb24vY29yZS9DbGllbnRJbmZvO0wABWZsb29ycQB+AAJMAAhsb2NhdGlvbnEAfgACTAATcGlja3VwV2luZG93RW5kVGltZXQAHUxqYXZhL3V0aWwvR3JlZ29yaWFuQ2FsZW5kYXI7TAAVcGlja3VwV2luZG93U3RhcnRUaW1lcQB+ABhMABFwb2xpdGljYWxEaXZpc2lvbnEAfgACTAAJcHJuTnVtYmVycQB+AAJMAA5yZWdpc3RyYXRpb25JZHEAfgACTAAKcmVxdWVzdFZpYXQAOkxjb20vdXBzL2NvbW1vbi9jb3JlL09uY2FsbFBpY2t1cFJlcXVlc3QkUGlja3VwUmVxdWVzdFZpYTtMAARyb29tcQB+AAJMAA1zYW1lRnV0dXJlRGF5dABATGNvbS91cHMvY29tbW9uL2NvcmUvT25jYWxsUGlja3VwUmVxdWVzdCRTYW1lRnV0dXJlRGF5SW5kaWNhdG9yO0wAD3NlcnZpY2VDYXRlZ29yeXQAOUxjb20vdXBzL2NvbW1vbi9jb3JlL09uY2FsbFBpY2t1cFJlcXVlc3QkU2VydmljZUNhdGVnb3J5O0wADHNoaXBwZXJBZ2VudHQAG0xjb20vdXBzL2NvbW1vbi9jb3JlL0FnZW50O0wAEHdlZWtlbmRJbmRpY2F0b3J0ADpMY29tL3Vwcy9jb21tb24vY29yZS9PbmNhbGxQaWNrdXBSZXF1ZXN0JFdlZWtlbmRJbmRpY2F0b3I7eHAAAAAAAAAB9AAAcHB0AABxAH4AH3BwcHBwcHEAfgAfcHNyADdjb20udXBzLmNvbW1vbi5jb3JlLk9uY2FsbFBpY2t1cFJlcXVlc3QkU2VydmljZUNhdGVnb3J5Hiki8I+yLK0CAAB4cgArY29tLnVwcy5jb21tb24uY29yZS51dGlsLkFic3RyYWN0U3RyaW5nRW51bRw48q9z5cJTAgACTAAJY2xhc3NOYW1lcQB+AAJMAAtzdHJpbmdWYWx1ZXEAfgACeHB0ADdjb20udXBzLmNvbW1vbi5jb3JlLk9uY2FsbFBpY2t1cFJlcXVlc3QkU2VydmljZUNhdGVnb3J5dAAIRE9NRVNUSUNwc3IAOGNvbS51cHMuY29tbW9uLmNvcmUuT25jYWxsUGlja3VwUmVxdWVzdCRXZWVrZW5kSW5kaWNhdG9yL+OMMYAYGTkCAAB4cQB+ACF0ADhjb20udXBzLmNvbW1vbi5jb3JlLk9uY2FsbFBpY2t1cFJlcXVlc3QkV2Vla2VuZEluZGljYXRvcnQACFdFRUtEQVlTc3IAG2NvbS51cHMuZWNpcy5jb3JlLlVQU0xvY2FsZSgkHQk5RT40AgACTAAHY291bnRyeXEAfgACTAAPbGFuZ3VhZ2VEaWFsZWN0dAAtTGNvbS91cHMvZWNpcy9jb3JlL1VQU0xvY2FsZSRMYW5ndWFnZURpYWxlY3Q7eHBwc3IAK2NvbS51cHMuZWNpcy5jb3JlLlVQU0xvY2FsZSRMYW5ndWFnZURpYWxlY3TEmfrEd4vK7gIAA0wAB2RpYWxlY3RxAH4AAkwADGxhbmd1YWdlQ29kZXEAfgACTAAGdGhpcyQwcQB+AAZ4cHQAAkdCdAADZW5ncQB+ACtzcgAZY29tLnVwcy5pbXMuUGF5UGFsQWNjb3VudHek/Iw4/+RfAgABTAACY2N0AB9MY29tL3Vwcy9pbXMvQ3JlZGl0Q2FyZEFjY291bnQ7eHBzcgAdY29tLnVwcy5pbXMuQ3JlZGl0Q2FyZEFjY291bnQRMDfYJh88XQIAG1oADmRlZlBheW1lbnRBY2N0WgAIbW9kaWZpZWRaABBzZWNDb2RlVmFsaWRhdGVkWgAQdGVtcG9yYXJ5QWNjb3VudEwACGFjY3ROYW1lcQB+AAJMAAphY2N0TnVtYmVycQB+AAJMAA9hY2N0UHJvZmlsZU5hbWVxAH4AAkwAEmJpbGxpbmdBZ3JlZW1lbnRJRHEAfgACTAALYmlsbGluZ0NpdHlxAH4AAkwADmJpbGxpbmdDb3VudHJ5cQB+AAJMAA1iaWxsaW5nUG9zdGFscQB+AAJMAAxiaWxsaW5nU3RhdGVxAH4AAkwADmJpbGxpbmdTdHJlZXQxcQB+AAJMAA5iaWxsaW5nU3RyZWV0MnEAfgACTAAOYmlsbGluZ1N0cmVldDNxAH4AAkwACGNhcmRUeXBlcQB+AAJMAAljdXN0Q2xhc3NxAH4AAkwAB2V4cERhdGVxAH4AAkwABW93bmVycQB+AAJMABBwYXltZW50TWVkaWFUeXBlcQB+AAJMABByZXNlcnZlZFRBY2NvdW50cQB+AAJMAApzeXNCaWxBY05ycQB+AAJMAA11cHNBY2N0TnVtYmVycQB+AAJMABF1cHNBY2N0U3RhdHVzQ29kZXEAfgACTAALdXBzQWNjdFR5cGVxAH4AAkwAD3VzZXJEYXRDZ3lTeXNOcnEAfgACTAAIdmF0VGF4SURxAH4AAnhwAQEAAHQAB3RoYWJhcnR0ABBQWTE0STNaWUpZS1lYRDlTdAAIX2ltc18xMl90ABBQRDZLOVlZV0hQTDI5NDBYdAAGTGFla2VudAACQkV0AAQxMDIwdAAAdAAbMjIzIGF2ZW51ZSBkZXMgY3JvaXggZHUgZmV1cQB+ADxxAH4APHQAAjEydAACMDZ0AAcwMS8yMTAwdAAKSVQzOTAxOTAwN3EAfgA+cHQAEDRjODk0NWFhM2E4N2I0ZWN0AAZHNzBHVDZ0AAIwMXQAAjEzdAAQNGM4OTQ1YWEzYTg3MmZlY3B0AAJCRXEAfgAfc3IAHGNvbS51cHMuY29tbW9uLmNvcmUuU2hpcG1lbnTx2qNHAM+G/QIAcEoADlNoaXBtZW50TnVtYmVyWgAWYWNjb3VudEF1dGhvcml6ZWRGb3JFUVoAEWFjY291bnRCYXNlZFJhdGVkSQAMYWN0dWFsV2VpZ2h0SQATYXZlcmFnZVBrZ1dlaWdodEluZFoADWJMb2NhbGl6ZWREVFNaAA9iaWxsVG9FeGVtcHRpb25JAA5iaWxsYWJsZVdlaWdodEkADWJpbGxpbmdPcHRpb25aAAxibWFJbmRpY2F0b3JJABNjb21tb2RpdHlJZGVudGlmaWVySgAbY291bnRlck1hbmlmZXN0U3lzdGVtTnVtYmVyWgAMY3RmSW5kaWNhdG9ySQARZGltZW5zaW9uYWxXZWlnaHRaAA1kaXNjb3VudFJhdGVkWgAcZG9jdW1lbnRzT2ZOb0NvbW1lcmNpYWxWYWx1ZVoADGV4dGVuZGVkQXJlYVoAEmZ1dHVyZURhdGVTaGlwbWVudFoAGWdvb2RzTm90SW5GcmVlQ2lyY3VsYXRpb25aAA5pU2hpcEluZGljYXRvcloAC2lzVU9NTWV0cmljWgAPbmFwQWNjb3VudEJhc2VkWgASbmV0Q2hhcmdlT3ZlcmxheWVkSQAObnVtYmVyT2ZQaWVjZXNJABRwYXltZW50TWVkaWFUeXBlQ29kZVoAD3JmYVRlc3RMYWJlbEluZFoAEnJzTGFiZWxPdmVyMTAwUGFja1oACHNkc1JhdGVkSgAOc2VxdWVuY2VOdW1iZXJaABpzaGlwRG9jUHJvY2Vzc2luZ1JlcXVlc3RlZFoAD3NoaXBtZW50UHJpY2luZ1oAEHNoaXBtZW50VXBsb2FkZWRaABFzaW1wbGlmaWVkUmV0dXJuc1oADHNwbGl0RHV0eVZhdEkAC3RvdGFsV2VpZ2h0WgAVdHJhbnNQcm9tb0NvZGVSZW1vdmVkSQAedHJhbnNQcm9tb05vdEFwcGxpZWRSZWFzb25Db2RlWgAPdHJhbnNQcm9tb1JhdGVkSQAldXNlckxldmVsRGlzY291bnROb3RBcHBsaWVkUmVhc29uQ29kZVoAFnVzZXJMZXZlbERpc2NvdW50UmF0ZWRaAB91c2VyUmVxdWVzdGVkQWRkaXRpb25hbEhhbmRsaW5nUwAEem9uZUwACUlEQ1Jlc3VsdHQAE0xqYXZhL2xhbmcvQm9vbGVhbjtMABhRVk5CdW5kbGVDaGFyZ2VDb250YWluZXJ0ACVMY29tL3Vwcy9jb21tb24vY29yZS9DaGFyZ2VDb250YWluZXI7TAAcUVZOU2hpcEJ1bmRsZUNoYXJnZUNvbnRhaW5lcnEAfgBKTAAGVU9NRGltcQB+AAJMAAlVT01XZWlnaHRxAH4AAkwABFVVSURxAH4AAkwAHmFjY0FuZFN1cmNoZ1R0bENoYXJnZUNvbnRhaW5lcnEAfgBKTAATYWNjQ2hhcmdlc0NvbnRhaW5lcnEAfgBKTAAMYWNjQ29udGFpbmVydAAiTGNvbS91cHMvY29tbW9uL2NvcmUvQWNjQ29udGFpbmVyO0wAD2FsdERlbGl2ZXJ5VGltZXQAIExjb20vdXBzL2NvbW1vbi9jb3JlL0NvbW1pdFRpbWU7TAAaYmFzZVNlcnZpY2VDaGFyZ2VDb250YWluZXJxAH4ASkwAEWJpbGxhYmxlV2VpZ2h0SW5kcQB+AAJMABNiaWxsaW5nQ3VycmVuY3lDb2RlcQB+AAJMAApicmxPcHRpb25zdAAgTGNvbS91cHMvY29tbW9uL2NvcmUvQlJMT3B0aW9ucztMAApjbGllbnRJbmZvcQB+ABdMAApjb21taXRUaW1lcQB+AExMAAljb21tb25LZXlxAH4AAkwAGGNvbW1vbktleUFzc29jaWF0aW9uVHlwZXEAfgACTAAOY29uc0xvY2F0aW9uSURxAH4AAkwAHmNvdW50ZXJNYW5pZmVzdFN5c3RlbU51bWJlclN0cnEAfgACTAAMY3VycmVuY3lDb2RlcQB+AAJMAA1kYXRlVGltZVN0YW1wdAAQTGphdmEvdXRpbC9EYXRlO0wAC2RkdUZhY2lsaXR5dAAhTGNvbS91cHMvY29tbW9uL2NvcmUvRERVRmFjaWxpdHk7TAASZGVzY3JpcHRpb25PZkdvb2RzcQB+AAJMAAhkb2NTdGF0ZXQAI0xjb20vdXBzL2NvbW1vbi9jb3JlL0RvY3VtZW50U3RhdGU7TAAcZG9jdW1lbnRTZXJ2aWNlc1NldHRpbmdzSW5mb3QAMkxjb20vdXBzL2NvbW1vbi9jb3JlL0RvY3VtZW50U2VydmljZXNTZXR0aW5nc0luZm87TAAIZHV0aWFibGV0ACNMY29tL3Vwcy9jb21tb24vY29yZS9EdXRpYWJsZVN0YXRlO0wAB2VlaUluZm90AB1MY29tL3Vwcy9jb21tb24vY29yZS9FRUlJbmZvO0wAFGZpcnN0U2VydmljZVNlbGVjdGVkcQB+AAJMABRmb3JtYXR0ZWRPdXRwdXRTcGVjc3QAKkxjb20vdXBzL2NvbW1vbi9jb3JlL0Zvcm1hdHRlZE91dHB1dFNwZWNzO0wAC2ZyZWlnaHREYXRhdAAtTGNvbS91cHMvY29tbW9uL2NvcmUvZnJ0L1NoaXBtZW50RnJlaWdodERhdGE7TAATZ3JvdW5kVGltZWluVHJhbnNpdHQAEExqYXZhL2xhbmcvTG9uZztMABFpbnRGb3JtRGF0YUhvbGRlcnQAMUxjb20vdXBzL2NvbW1vbi9jb3JlL0ludGVybmF0aW9uYWxGb3JtRGF0YUhvbGRlcjtMAA1pbnRlcmNlcHRJbmZvdAAjTGNvbS91cHMvY29tbW9uL2NvcmUvSW50ZXJjZXB0SW5mbztMABlpbnRlcm5hdGlvbmFsRm9ybXNHcm91cElEcQB+AAJMAA1pbnZEYXRhSG9sZGVydAAnTGNvbS91cHMvY29tbW9uL2NvcmUvSW52b2ljZURhdGFIb2xkZXI7TAARaW52b2ljZUxpbmVUb3RhbHNxAH4AVkwAF21haWxJbm5vdmF0aW9uc1NoaXBtZW50dAAtTGNvbS91cHMvY29tbW9uL2NvcmUvTWFpbElubm92YXRpb25zU2hpcG1lbnQ7TAAJbWFpbGJveElkcQB+AAJMAAhtYWlsZXJJZHEAfgACTAAYbWFuZGF0b3J5T1BMRGludGVybmFsS2V5cQB+AAJMAAltcm5OdW1iZXJ0AB9MY29tL3Vwcy9jb21tb24vY29yZS9Ncm5OdW1iZXI7TAALcGFja2FnZUxpc3R0ABJMamF2YS91dGlsL1ZlY3RvcjtMABFwYXllck9mRHV0eUFuZFRheHQAH0xjb20vdXBzL2NvbW1vbi9jb3JlL1BheWVyVHlwZTtMABtwYXllck9mVHJhbnNwb3J0YXRpb25DaGFyZ2VxAH4AXUwAFnBheW1lbnRUcmFuc2FjdGlvbkdVSURxAH4AAkwAD3BpY2t1cEluZGljYXRvcnQAJUxjb20vdXBzL2NvbW1vbi9jb3JlL1BpY2t1cEluZGljYXRvcjtMABJwcm9tb3Rpb25Db250YWluZXJ0AChMY29tL3Vwcy9jb21tb24vY29yZS9Qcm9tb3Rpb25Db250YWluZXI7TAAXcHVibGlzaGVkUmF0aW5nTGV2ZWxJbmRxAH4AAkwADnJhdGVDaGFyZ2VUeXBldAAgTGNvbS91cHMvY29tbW9uL2NvcmUvQ2hhcmdlVHlwZTtMAA1yYXRpbmdPcHRpb25zdAAjTGNvbS91cHMvY29tbW9uL2NvcmUvUmF0aW5nT3B0aW9ucztMAA5yYXRpbmdSZXNwb25zZXQAJExjb20vdXBzL2NvbW1vbi9jb3JlL1JhdGluZ1Jlc3BvbnNlO1sAB3JlZkxpc3R0ACBbTGNvbS91cHMvY29tbW9uL2NvcmUvUmVmZXJlbmNlO0wADnJlZ2lzdHJhdGlvbklkcQB+AAJMAAdzZWRJbmZvdAAdTGNvbS91cHMvY29tbW9uL2NvcmUvU0VESW5mbztMAAdzZXJ2aWNldAAdTGNvbS91cHMvY29tbW9uL2NvcmUvU2VydmljZTtMABBzaGlwT25jYWxsUGlja3VwdAAmTGNvbS91cHMvY29tbW9uL2NvcmUvU2hpcE9uY2FsbFBpY2t1cDtMAApzaGlwVGlja2V0dAAkTGNvbS91cHMvY29tbW9uL2NvcmUvU2hpcHBpbmdUaWNrZXQ7TAAOc2hpcHBlckNvdW50cnlxAH4AAkwADXNoaXBwZXJOdW1iZXJxAH4AAkwACXRheFN0YXR1c3QAJ0xjb20vdXBzL2NvbW1vbi9jb3JlL1RheFJlc3BvbnNlU3RhdHVzO0wAFHRoaXJkUEZDQ3VycmVuY3lDb2RlcQB+AAJMAAR0eXBldAAiTGNvbS91cHMvY29tbW9uL2NvcmUvU2hpcG1lbnRUeXBlO0wAE3VwbG9hZERhdGVUaW1lU3RhbXBxAH4ATkwACHVzZXJEYXRhdAAmTGNvbS91cHMvY29tbW9uL2NvcmUvU2hpcG1lbnRVc2VyRGF0YTtMAAZ1c2VySURxAH4AAkwACHVzZXJuYW1lcQB+AAJMABV1c3BzU3ViQ2xhc3NpZmljYXRpb250ACtMY29tL3Vwcy9jb21tb24vY29yZS9VU1BTU3ViQ2xhc3NpZmljYXRpb247TAAIdmVjQWdlbnRxAH4AXEwADXZvaWRJbmRpY2F0b3J0ACNMY29tL3Vwcy9jb21tb24vY29yZS9Wb2lkSW5kaWNhdG9yO3hwAAAAAAAAAAAAAAAAAAoAAAAAAAAAAAAKAAAACgAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAGXodc4AAAAAAAAAAAAAAAAAAAAAAAAAAAAB9XBzcgAjY29tLnVwcy5jb21tb24uY29yZS5DaGFyZ2VDb250YWluZXImM8DIUTFGjAIAA1oAHm1pbmltdW1JbmNlbnRlZENoYXJnZUluZGljYXRvckwAB2NoYXJnZXN0AA9MamF2YS91dGlsL01hcDtMAAVwYXllcnQAIUxjb20vdXBzL2NvbW1vbi9jb3JlL0NoYXJnZVBheWVyO3hwAHNyABFqYXZhLnV0aWwuSGFzaE1hcAUH2sHDFmDRAwACRgAKbG9hZEZhY3RvckkACXRocmVzaG9sZHhwP0AAAAAAAAB3CAAAAAEAAAABc3IAHmNvbS51cHMuY29tbW9uLmNvcmUuQ2hhcmdlVHlwZa0flXkAI9K7AgABSQAGbV90eXBleHAAAABuc3IAGmNvbS51cHMuY29tbW9uLmNvcmUuQ2hhcmdlH0OwcexJRp4CAAJKAAZhbW91bnRMAApjaGFyZ2VUeXBlcQB+AGB4cAAAAAAAAAAAcQB+AHV4c3IAH2NvbS51cHMuY29tbW9uLmNvcmUuQ2hhcmdlUGF5ZXICt+moSvILFwIAAHhxAH4AIXQAH2NvbS51cHMuY29tbW9uLmNvcmUuQ2hhcmdlUGF5ZXJ0AAdTSElQUEVSc3EAfgBuAHNxAH4Acj9AAAAAAAAAdwgAAAABAAAAAXEAfgB1c3EAfgB2AAAAAAAAAABxAH4AdXhxAH4AeXQAAkNNdAADS0dTcHBzcQB+AG4Ac3EAfgByP0AAAAAAAAB3CAAAAAEAAAABcQB+AHVzcQB+AHYAAAAAAAAAAHEAfgB1eHEAfgB5c3IAIGNvbS51cHMuY29tbW9uLmNvcmUuQWNjQ29udGFpbmVycklff+hGsbUCAAFMAAZ2ZWNBY2NxAH4AXHhwc3IAEGphdmEudXRpbC5WZWN0b3LZl31bgDuvAQMAA0kAEWNhcGFjaXR5SW5jcmVtZW50SQAMZWxlbWVudENvdW50WwALZWxlbWVudERhdGF0ABNbTGphdmEvbGFuZy9PYmplY3Q7eHAAAAAAAAAABXVyABNbTGphdmEubGFuZy5PYmplY3Q7kM5YnxBzKWwCAAB4cAAAAApzcgApY29tLnVwcy5jb21tb24uY29yZS5TaGlwUmV0YWlsQWNjZXNzUG9pbnQAUCsaeSoCAwIAAHhyACNjb20udXBzLmNvbW1vbi5jb3JlLkFjY2Vzc29yaWFsSW1wbNV+Y673k8bxAgAFSQAHYWNjVHlwZUwAC2FkZFRvU3RyaW5ndAAwTGNvbS91cHMvY29tbW9uL2NvcmUvdXRpbC9Gb3JtYXR0ZWRTdHJpbmdCdWZmZXI7TAAPY2hhcmdlQ29udGFpbmVycQB+AEpMAAl0YXhEZXRhaWx0ACJMY29tL3Vwcy9jb21tb24vY29yZS9UYXhDb250YWluZXI7TAAXdGF4VG90YWxDaGFyZ2VDb250YWluZXJxAH4ASnhwAAACIHBzcQB+AG4Ac3EAfgByP0AAAAAAAAB3CAAAAAEAAAABcQB+AHVzcQB+AHYAAAAAAAAAAHEAfgB1eHEAfgB5cHBzcgAyY29tLnVwcy5jb21tb24uY29yZS5TaGlwVVBTQWNjZXNzUG9pbnROb3RpZmljYXRpb26RC3iLLxeiyAIAAHhyAC5jb20udXBzLmNvbW1vbi5jb3JlLlNoaXBFbWFpbFBob25lTm90aWZpY2F0aW9uvQ1S1MSEcUcCAAFMAAhwaG9uZU51bXEAfgACeHIAKWNvbS51cHMuY29tbW9uLmNvcmUuU2hpcEVtYWlsTm90aWZpY2F0aW9u4pZ5UwDT2KsCAARMAAxlbWFpbEFkZHJlc3NxAH4AAkwAE2ZhaWx1cmVFbWFpbEFkZHJlc3NxAH4AAkwAE3JlcGx5VG9FbWFpbEFkZHJlc3NxAH4AAkwAF3JlcXVlc3RUeXBlRW1haWxBZGRyZXNzcQB+AAJ4cgAkY29tLnVwcy5jb21tb24uY29yZS5TaGlwTm90aWZpY2F0aW9u6zzcMkFxBxACAAhMAAdkaWFsZWN0cQB+AAJMAAhsYW5ndWFnZXEAfgACTAAJbWVkaWFUeXBlcQB+AAJMAARtZW1vcQB+AAJMAAtyZXF1ZXN0VHlwZXEAfgACTAAMc2VudEZyb21OYW1lcQB+AAJMAAtzdWJqZWN0Q29kZXEAfgACTAALc3ViamVjdFRleHRxAH4AAnhxAH4AjAAAALtwc3EAfgBuAHNxAH4Acj9AAAAAAAAAdwgAAAABAAAAAXEAfgB1c3EAfgB2AAAAAAAAAABxAH4AdXhxAH4AeXBwdAACR0J0AANFTkd0AAIwM3QAAHQAAzAxMnEAfgCecHEAfgCedAAXaGFiYXJ0aGllcnJ5QGhvdG1haWwuZnJxAH4AnnEAfgCecQB+AJ5xAH4AnnNyAC5jb20udXBzLmNvbW1vbi5jb3JlLlNoaXBVQVBTaGlwcGVyTm90aWZpY2F0aW9uFPqr+sPr3FICAAB4cQB+AJQAAAC9cHNxAH4AbgBzcQB+AHI/QAAAAAAAAHcIAAAAAQAAAAFxAH4AdXNxAH4AdgAAAAAAAAAAcQB+AHV4cQB+AHlwcHQAAkdCdAADRU5HcQB+AJ1xAH4AnnQAAzAxM3EAfgCecHEAfgCedAAXaGFiYXJ0aGllcnJ5QGhvdG1haWwuZnJxAH4AnnEAfgCecQB+AJ5xAH4AnnNyACFjb20udXBzLmNvbW1vbi5jb3JlLkZ1ZWxTdXJjaGFyZ2X9xOCm+Er9LAIAAHhxAH4AjAAAAXdwc3EAfgBuAHNxAH4Acj9AAAAAAAAAdwgAAAABAAAAAXEAfgB1c3EAfgB2AAAAAAAAAB9xAH4AdXhxAH4AeXBwc3IAIWNvbS51cHMuY29tbW9uLmNvcmUuR2VybWFuUm9hZFRheAMfLL5hxfZqAgAAeHEAfgCMAAABlnBzcQB+AG4Ac3EAfgByP0AAAAAAAAB3CAAAAAEAAAABcQB+AHVzcQB+AHYAAAAAAAAAAHEAfgB1eHEAfgB5cHBwcHBwcHhzcgAeY29tLnVwcy5jb21tb24uY29yZS5Db21taXRUaW1ldDPVAfkTweoCAAFJAA5yYXZlQ29tbWl0VGltZXhw/////3NxAH4AbgBzcQB+AHI/QAAAAAAAAHcIAAAAAQAAAAFxAH4AdXNxAH4AdgAAAAAAAAGFcQB+AHV4cQB+AHl0AAIwMnEAfgCecHNyAB5jb20udXBzLmNvbW1vbi5jb3JlLkNsaWVudEluZm/QXpmyedbCwwIABkwAC2NvdW50cnlDb2RlcQB+AAJMAApkYXRhU291cmNlcQB+AAJMAARsYW5ncQB+AAJMAARuYW1lcQB+AAJMABJwbGRVcGxvYWRlZFZlcnNpb25xAH4AAkwAB3ZlcnNpb25xAH4AAnhwdAACVVN0AAJBWXQAAmVudAAEWE9MVHEAfgCedAAIMTcuMDcuMjhzcQB+ALQAAAAAcHBxAH4AnnB0AANFVVJzcgAOamF2YS51dGlsLkRhdGVoaoEBS1l0GQMAAHhwdwgAAAFen5rnlnhwcQB+AJ5zcgAhY29tLnVwcy5jb21tb24uY29yZS5Eb2N1bWVudFN0YXRlJtxWjP7WRicCAAFJAA9jdXJyZW50RG9jU3RhdGV4cAAAAANwc3IAIWNvbS51cHMuY29tbW9uLmNvcmUuRHV0aWFibGVTdGF0ZYKUT4Oc3yjxAgAAeHEAfgAhdAAhY29tLnVwcy5jb21tb24uY29yZS5EdXRpYWJsZVN0YXRldAAMTk9UX0RVVElBQkxFcHEAfgCec3IAKGNvbS51cHMuY29tbW9uLmNvcmUuRm9ybWF0dGVkT3V0cHV0U3BlY3OavO3S8eSk6gIAHVoACGN1dExhYmVsWgANZ2VuZXJhdGVMYWJlbFoAEmdlbmVyYXRlUFJMUmVjZWlwdFoAD2dlbmVyYXRlUmVjZWlwdFoAF2dlbmVyYXRlVXBzY29weUh0bWxUZXh0WgAMaGlkZUFCUlJhdGVzWgAOaGlkZUFjY3ROdW1JbmRaABRoaWRlUGVha1NlYXNvbkNoYXJnZVoADGhpZGVSYXRlc0luZEkAC2xhYmVsSGVpZ2h0SQAKbGFiZWxXaWR0aFoADW5vbkludGVybGFjZWRaAA5wZGZJbnRydWN0aW9uc1oADnByaW50TGFiZWxJY29uSQAZcHJpbnRMYWJlbEluc3RydWN0aW9uc0luZFoABnNhbXBsZVoAGXN1cHByZXNzU2Vjb25kUmVjZWlwdFBhZ2VMAAdjaGFyU2V0dAArTGNvbS91cHMvY29tbW9uL2NvcmUvQ2hhcmFjdGVyU2V0SW5kaWNhdG9yO0wAEWNvbnRyb2xMb2dCYXNlVVJMcQB+AAJMAA1odHRwVXNlckFnZW50dAAfTGNvbS91cHMvY29tbW9uL2NvcmUvVXNlckFnZW50O0wADGxhYmVsQmFzZVVSTHEAfgACTAAObGFiZWxJbWFnZVR5cGVxAH4AAkwAF3BhY2thZ2VOdW1Ub0dlbkxhYmVsRm9ycQB+AFxMAAxwcmxJbWFnZVR5cGVxAH4AAkwAEHJlY2VpcHRJbWFnZVR5cGVxAH4AAkwAGXRyYW5zbGF0ZWREb2N1bWVudENvbnRlbnR0AC9MY29tL3Vwcy9jb21tb24vY29yZS9UcmFuc2xhdGVkRG9jdW1lbnRDb250ZW50O0wAGHVwc0NvcHlUdXJuaW5Db3B5QmFzZVVSTHEAfgACTAAadXBzQ29weVR1cm5pbkNvcHlJbWFnZVR5cGVxAH4AAkwADndhcnNhd1RleHRMYW5ndAAoTGNvbS91cHMvY29tbW9uL2NvcmUvV2Fyc2F3VGV4dExhbmd1YWdlO3hwAAEAAAABAAAAAAAABgAAAAQAAAEAAAACAABzcgApY29tLnVwcy5jb21tb24uY29yZS5DaGFyYWN0ZXJTZXRJbmRpY2F0b3IkAavdaaQiVgIAAHhxAH4AIXQAKWNvbS51cHMuY29tbW9uLmNvcmUuQ2hhcmFjdGVyU2V0SW5kaWNhdG9ydAAGTGF0aW4xdAABL3NyAB1jb20udXBzLmNvbW1vbi5jb3JlLlVzZXJBZ2VudFAIAG9TYCE/AgAaSQAGY3VyUG9zTAAIYnVpbGROdW1xAH4AAkwACWJ1aWxkTnVtMnEAfgACTAAGbEFnZW50cQB+AAJMAAltYWpNb3pWZXJxAH4AAkwACG1hak9TVmVycQB+AAJMAAptYWpQbGF0VmVycQB+AAJMAAhtYWpvclZlcnEAfgACTAAJbWFqb3JWZXIycQB+AAJMAAltaW5Nb3pWZXJxAH4AAkwACG1pbk9TVmVycQB+AAJMAAptaW5QbGF0VmVycQB+AAJMAAhtaW5vclZlcnEAfgACTAAJbWlub3JWZXIycQB+AAJMAAptb3pWZXJzaW9udAASTGphdmEvbGFuZy9Eb3VibGU7TAAEbmFtZXEAfgACTAACb3NxAH4AAkwACW9zVmVyc2lvbnEAfgDXTAAGb3N0eXBlcQB+AAJMAAtwbGF0VmVyc2lvbnEAfgDXTAAIcGxhdGZvcm1xAH4AAkwACXVzZXJBZ2VudHEAfgACTAAHdmFyaWFudHEAfgACTAAGdmVuZG9ycQB+AAJMAAd2ZXJzaW9ucQB+ANdMAAh2ZXJzaW9uMnEAfgDXeHD/////cQB+AJ5xAH4AnnQAC21vemlsbGEvNC41dAABNHEAfgCecQB+AJ5xAH4A2nEAfgCedAABNXEAfgCecQB+AJ5xAH4A23EAfgCec3IAEGphdmEubGFuZy5Eb3VibGWAs8JKKWv7BAIAAUQABXZhbHVleHIAEGphdmEubGFuZy5OdW1iZXKGrJUdC5TgiwIAAHhwQBIAAAAAAAB0AAJOVnEAfgCec3EAfgDcv/AAAAAAAABxAH4AnnEAfgDgcQB+AJ50AAtNb3ppbGxhLzQuNXEAfgCedAAITmV0c2NhcGVxAH4A3nEAfgDgdAAaLi9sYWJlbC0tQlRSQUMtLS4tLUJJTVRZLS10AANnaWZzcQB+AIYAAAAKAAAAAHVxAH4AiQAAAApwcHBwcHBwcHBweHB0AARlcGwyc3IALWNvbS51cHMuY29tbW9uLmNvcmUuVHJhbnNsYXRlZERvY3VtZW50Q29udGVudIpWS6XBI/KVAgACWgAGc2FtcGxlTAAMY29udGVudFRhYmxlcQB+AG94cABzcQB+AHI/QAAAAAAAGHcIAAAAIAAAABJ0ABtTdGF0aWNDb250ZW50X0ludm9pY2VfVGl0bGV0ABBDdXN0b21zIEludm9pY2UgdAAaU3RhdGljQ29udGVudF9Gb2xkU2VudGVuY2V0AJRQbGFjZSB0aGUgbGFiZWwgaW4gYSBVUFMgU2hpcHBpbmcgUG91Y2guIElmIHlvdSBkbyBub3QgaGF2ZSBhIHBvdWNoLCBhZmZpeCB0aGUgZm9sZGVkIGxhYmVsIHVzaW5nIGNsZWFyIHBsYXN0aWMgc2hpcHBpbmcgdGFwZSBvdmVyIHRoZSBlbnRpcmUgbGFiZWwudAAYU3RhdGljQ29udGVudF9Db2xsZWN0aW9udAAcR0VUVElORyBZT1VSIFNISVBNRU5UIFRPIFVQU3QAElN0YXRpY0NvbnRlbnRfRm9sZHQAKkZvbGQgdGhlIHByaW50ZWQgbGFiZWwgYXQgdGhlIGRvdHRlZCBsaW5lLnQAJlN0YXRpY0NvbnRlbnRfQ3VzdG9tZXJzV2l0aERhaWx5UGlja3VwdAAdQ3VzdG9tZXJzIHdpdGggYSBEYWlseSBQaWNrdXB0ABNTdGF0aWNDb250ZW50X1ByaW50dAAQUHJpbnQgdGhlIGxhYmVsOnQAJlN0YXRpY0NvbnRlbnRfRGFpbHlDb2xsZWN0aW9uQ3VzdG9tZXJzdADLQWlyIHNoaXBtZW50cyAoaW5jbHVkaW5nIFdvcmxkd2lkZSBFeHByZXNzIGFuZCBFeHBlZGl0ZWQpIGNhbiBiZSBwaWNrZWQgdXAgb3IgZHJvcHBlZCBvZmYuIFRvIHNjaGVkdWxlIGEgcGlja3VwLCBvciB0byBmaW5kIGEgZHJvcC1vZmYgbG9jYXRpb24sIHNlbGVjdCB0aGUgUGlja3VwIG9yIERyb3Atb2ZmIGljb24gZnJvbSB0aGUgVVBTIHRvb2wgYmFyLiB0ACBTdGF0aWNDb250ZW50X0NvbGxlY3Rpb25TY2hlZHVsZXQBD0dyb3VuZCwgMyBEYXkgU2VsZWN0LCBhbmQgU3RhbmRhcmQgdG8gQ2FuYWRhIHNoaXBtZW50cyBtdXN0IGJlIGRyb3BwZWQgb2ZmIGF0IGFuIGF1dGhvcml6ZWQgVVBTIGxvY2F0aW9uLCBvciBoYW5kZWQgdG8gYSBVUFMgZHJpdmVyLiBQaWNrdXAgc2VydmljZSBpcyBub3QgYXZhaWxhYmxlIGZvciB0aGVzZSBzZXJ2aWNlcy4gVG8gZmluZCB0aGUgbmVhcmVzdCBkcm9wLW9mZiBsb2NhdGlvbiwgc2VsZWN0IHRoZSBEcm9wLW9mZiBpY29uIGZyb20gdGhlIFVQUyB0b29sIGJhci50ABVMYWJlbF9TSElQUEVSX1JFTEVBU0V0ACVBdHRlbnRpb24gVVBTIERyaXZlcjogU0hJUFBFUiBSRUxFQVNFdAAjU3RhdGljQ29udGVudF9EYWlseVBpY2t1cEN1c3RvbWVyczJ0ADJZb3VyIGRyaXZlciB3aWxsIHBpY2t1cCB5b3VyIHNoaXBtZW50KHMpIGFzIHVzdWFsLnQAGVBhZ2VUaXRsZXNfTGFiZWxQYWdlVGl0bGV0ABBWaWV3L1ByaW50IExhYmVsdAAbU3RhdGljQ29udGVudF9QcmludFNlbnRlbmNldABQU2VsZWN0IFByaW50IGZyb20gdGhlIEZpbGUgbWVudSBpbiB0aGlzIGJyb3dzZXIgd2luZG93IHRvIHByaW50IHRoZSBsYWJlbCBiZWxvdy50ABpTdGF0aWNDb250ZW50X0ludm9pY2VfVGV4dHQBCS0gMyBjb3BpZXMgb2YgYSBjb21wbGV0ZWQgY3VzdG9tcyBpbnZvaWNlIGFyZSByZXF1aXJlZCBmb3Igc2hpcG1lbnRzIHdpdGggYSBjb21tZXJjaWFsIHZhbHVlIGJlaW5nIHNoaXBwZWQgdG8vZnJvbSBub24tRVUgY291bnRyaWVzLiAgUGxlYXNlIGluc3VyZSB0aGUgY3VzdG9tcyBpbnZvaWNlIGNvbnRhaW5zIGFkZHJlc3MgaW5mb3JtYXRpb24sIHByb2R1Y3QgZGV0YWlsIC0gaW5jbHVkaW5nIHZhbHVlLCBzaGlwbWVudCBkYXRlIGFuZCB5b3VyIHNpZ25hdHVyZS50ABxTdGF0aWNDb250ZW50X0RhdGVPZlNoaXBtZW50dAAQRGF0ZSBvZiBTaGlwbWVudHQAGFN0YXRpY0NvbnRlbnRfQWNjZXB0YW5jZXQA61RvIGFja25vd2xlZGdlIHlvdXIgYWNjZXB0YW5jZSBvZiB0aGUgb3JpZ2luYWwgbGFuZ3VhZ2Ugb2YgdGhlIGFncmVlbWVudCB3aXRoIFVQUyBhcyBzdGF0ZWQgb24gdGhlIGNvbmZpcm0gcGF5bWVudCBwYWdlLCBhbmQgdG8gYXV0aG9yaXplIFVQUyB0byBhY3QgYXMgZm9yd2FyZGluZyBhZ2VudCBmb3IgZXhwb3J0IGNvbnRyb2wgYW5kIGN1c3RvbSBwdXJwb3NlcywgPGI+c2lnbiBhbmQgZGF0ZSBoZXJlOjwvYj50ABZTdGF0aWNDb250ZW50X0ZvbGRIZXJldAAJRk9MRCBIRVJFdAAXU3RhdGljQ29udGVudF9TaWduYXR1cmV0ABNTaGlwcGVyJ3MgU2lnbmF0dXJldAAoU3RhdGljQ29udGVudF9DdXN0b21lcnNXaXRoTm9EYWlseVBpY2t1cHQAIEN1c3RvbWVycyB3aXRob3V0IGEgRGFpbHkgUGlja3VweHEAfgDVdAAEaHRtbHNyACZjb20udXBzLmNvbW1vbi5jb3JlLldhcnNhd1RleHRMYW5ndWFnZT26YJe9SP6LAgAAeHEAfgAhdAAmY29tLnVwcy5jb21tb24uY29yZS5XYXJzYXdUZXh0TGFuZ3VhZ2V0AAIxMHBwcHBxAH4AnnBwcHQACElOVEVSTkVUcHEAfgCecHNxAH4AhgAAAAAAAAABdXEAfgCJAAAAB3NyAB9jb20udXBzLmNvbW1vbi5jb3JlLlNoaXBQYWNrYWdljcNsyBVp7a0CAC9JAA5iaWxsYWJsZVdlaWdodFoAF2NsaW5pY2FsVHJpYWxzSW5kaWNhdG9ySQAJZGltV2VpZ2h0WgAXaW5lbGlnaWJsZUhvbGRJbmRpY2F0b3JaABVsYXJnZVBhY2thZ2VTdXJjaGFyZ2VaABdub25NYWNoaW5lYWJsZUluZGljYXRvckkAF251bWJlck9mUGllY2VzUGVyUGFsbGV0UwAIb3ZlcnNpemVKAAlwYWNrYWdlSWRJABFwYWNrYWdlSWRlbnRpZmllcloAGXBhY2tlZEJ5VVBTU3RvcmVJbmRpY2F0b3JaABhwa2dEaW1TdXJjaGFyZ2VJbmRpY2F0b3JJABFwa2dTZXF1ZW5jZU51bWJlcloAH3VzZXJSZXF1ZXN0ZWRBZGRpdGlvbmFsSGFuZGxpbmdJAAZ3ZWlnaHRMABhRVk5CdW5kbGVDaGFyZ2VDb250YWluZXJxAH4ASkwAHFFWTlNoaXBCdW5kbGVDaGFyZ2VDb250YWluZXJxAH4ASkwAFlJTTXVsdGlQaWVjZVNoaXBtZW50SWRxAH4AAkwAE2FjY0NoYXJnZXNDb250YWluZXJxAH4ASkwADGFjY0NvbnRhaW5lcnEAfgBLTAAKYWN0aXZpdGllc3EAfgBcTAAHYXRuTGlzdHQAEExqYXZhL3V0aWwvTGlzdDtMABpiYXNlU2VydmljZUNoYXJnZUNvbnRhaW5lcnEAfgBKTAATY2xpbmljYWxUcmlhbHNJRE51bXEAfgACTAAdY3VzdG9tZXJFc3RpbWF0ZWREZWxpdmVyeURhdGVxAH4ATkwADWRhdGVUaW1lU3RhbXBxAH4ATkwAC2ZyZWlnaHREYXRhdAAsTGNvbS91cHMvY29tbW9uL2NvcmUvZnJ0L1BhY2thZ2VGcmVpZ2h0RGF0YTtMABtoYXpNYXRCdW5kbGVDaGFyZ2VDb250YWluZXJxAH4ASkwAFm1haWxJbm5vdmF0aW9uc1BhY2thZ2V0ACxMY29tL3Vwcy9jb21tb24vY29yZS9NYWlsSW5ub3ZhdGlvbnNQYWNrYWdlO0wAFm1lcmNoYW5kaXNlRGVzY3JpcHRpb25xAH4AAkwAGXBhY2thZ2VJZGVudGlmaWNhdGlvbkNvZGVxAH4AAkwAHXBhY2thZ2VJZGVudGlmaWNhdGlvbkNvZGVGdWxscQB+AAJMAA5wYWNrYWdlT1BMREtleXEAfgACTAALcGFja2FnZVR5cGVxAH4AAkwAD3BhY2thZ2VUeXBlU2l6ZXQAJUxjb20vdXBzL2NvbW1vbi9jb3JlL1BhY2thZ2VUeXBlU2l6ZTtMAAZwYXJlbnRxAH4ACEwAB3BrZ0RpbXN0ACNMY29tL3Vwcy9jb21tb24vY29yZS9Qa2dEaW1lbnNpb25zO1sAB3JlZkxpc3RxAH4AY0wADnJldHVyblNsaXBEYXRhcQB+AAJMABZzZXJ2aWNlQ2hhcmdlQ29udGFpbmVycQB+AEpMAAxzaWlJbmRpY2F0b3JxAH4AAkwAFHRvdGFsQ2hhcmdlQ29udGFpbmVycQB+AEpMAA50cmFja2luZ051bWJlcnEAfgACTAAgdXNlclNlbGVjdGVkRGVsaXZlcnlDb25maXJtYXRpb250AEJMY29tL3Vwcy9jb21tb24vY29yZS9TaGlwUGFja2FnZSRVc2VyU2VsZWN0ZWREZWxpdmVyeUNvbmZpcm1hdGlvbjtMAA91c3BzRW5kb3JzZW1lbnR0ACVMY29tL3Vwcy9jb21tb24vY29yZS9VU1BTRW5kb3JzZW1lbnQ7TAAWdXNwc0lycmVndWxhckluZGljYXRvcnQALExjb20vdXBzL2NvbW1vbi9jb3JlL1VTUFNJcnJlZ3VsYXJJbmRpY2F0b3I7TAANdm9pZEluZGljYXRvcnEAfgBseHAAAAAKAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////8AAAAACnNxAH4AbgBzcQB+AHI/QAAAAAAAAHcIAAAAAQAAAAFxAH4AdXNxAH4AdgAAAAAAAAAAcQB+AHV4cQB+AHlzcQB+AG4Ac3EAfgByP0AAAAAAAAB3CAAAAAEAAAABcQB+AHVzcQB+AHYAAAAAAAAAAHEAfgB1eHEAfgB5cHNxAH4AbgBzcQB+AHI/QAAAAAAAAHcIAAAAAQAAAAFxAH4AdXNxAH4AdgAAAAAAAAAAcQB+AHV4cQB+AHlzcQB+AIRzcQB+AIYAAAAAAAAAAHVxAH4AiQAAAApwcHBwcHBwcHBweHNxAH4AhgAAAAAAAAAAdXEAfgCJAAAACnBwcHBwcHBwcHB4c3IAE2phdmEudXRpbC5BcnJheUxpc3R4gdIdmcdhnQMAAUkABHNpemV4cAAAAAB3BAAAAAB4c3EAfgBuAHNxAH4Acj9AAAAAAAAAdwgAAAABAAAAAXEAfgB1c3EAfgB2AAAAAAAAAABxAH4AdXhxAH4AeXEAfgCecHBwcHNyACpjb20udXBzLmNvbW1vbi5jb3JlLk1haWxJbm5vdmF0aW9uc1BhY2thZ2U2oNCYoUMIQAIABkwAC2JhcmNvZGVUeXBlcQB+AAJMAAhjTjIySW5mb3QAHkxjb20vdXBzL2NvbW1vbi9jb3JlL0NOMjJJbmZvO0wADm1haWxNYW5pZmVzdElkcQB+AAJMAAlwYWNrYWdlSURxAH4AAkwAFnByb2Nlc3NpbmdDYXRlZ29yeUNvZGVxAH4AAkwAEXVzcHNQZXJtaXRJbXByaW50cQB+AAJ4cHBwcHB0AABxAH4BN3BwcHEAfgCedAACMDJwcQB+AG1zcgAhY29tLnVwcy5jb21tb24uY29yZS5Qa2dEaW1lbnNpb25zvm1reFW8VDoCAANTAAZoZWlnaHRTAAZsZW5ndGhTAAV3aWR0aHhwAAMABQAEdXIAIFtMY29tLnVwcy5jb21tb24uY29yZS5SZWZlcmVuY2U7W7BvnH4XSF0CAAB4cAAAAAZzcgAdY29tLnVwcy5jb21tb24uY29yZS5SZWZlcmVuY2Xc2M4HQHUt5wIABkkAAklEWgANbGFiZWxCYXJDb2RlZEwADWJhcmNvZGVNZXRob2RxAH4AAkwAB3JlZkNvZGVxAH4AAkwAB3JlZk5hbWVxAH4AAkwABHRleHRxAH4AAnhwAAAAAQB0AAMwMDh0AAIwMHQADVJlZmVyZW5jZSAjIDFwc3EAfgE9AAAAAgBxAH4BP3EAfgFAdAANUmVmZXJlbmNlICMgMnBwcHBwcQB+AJ5zcQB+AG4Ac3EAfgByP0AAAAAAAAB3CAAAAAEAAAABcQB+AHVzcQB+AHYAAAAAAAAAAHEAfgB1eHEAfgB5cQB+AJ5zcQB+AG4Ac3EAfgByP0AAAAAAAAB3CAAAAAEAAAABcQB+AHVzcQB+AHYAAAAAAAAAAHEAfgB1eHEAfgB5dAASMVpHNzBHVDY2ODA0OTI2MDU1c3IAQGNvbS51cHMuY29tbW9uLmNvcmUuU2hpcFBhY2thZ2UkVXNlclNlbGVjdGVkRGVsaXZlcnlDb25maXJtYXRpb24AAAAAAAAAAQIAAHhxAH4AIXQAQGNvbS51cHMuY29tbW9uLmNvcmUuU2hpcFBhY2thZ2UkVXNlclNlbGVjdGVkRGVsaXZlcnlDb25maXJtYXRpb250AAROT05Fc3IAI2NvbS51cHMuY29tbW9uLmNvcmUuVVNQU0VuZG9yc2VtZW50zr7d4WAE8qUCAAB4cQB+ACF0ACNjb20udXBzLmNvbW1vbi5jb3JlLlVTUFNFbmRvcnNlbWVudHQAA0xOUnNyACpjb20udXBzLmNvbW1vbi5jb3JlLlVTUFNJcnJlZ3VsYXJJbmRpY2F0b3IE2wI85i2XXwIAAHhxAH4AIXQAKmNvbS51cHMuY29tbW9uLmNvcmUuVVNQU0lycmVndWxhckluZGljYXRvcnQADk5PVF9BUFBMSUNBQkxFcHBwcHBwcHhwc3IAHWNvbS51cHMuY29tbW9uLmNvcmUuUGF5ZXJUeXBl2mDMmyPhGLICAAB4cgAoY29tLnVwcy5jb21tb24uY29yZS51dGlsLkFic3RyYWN0SW50RW51bfynQjF0TuasAgACSQAIaW50VmFsdWVMAAljbGFzc05hbWVxAH4AAnhwAAAACnQAHWNvbS51cHMuY29tbW9uLmNvcmUuUGF5ZXJUeXBlcHBwdAACMDFxAH4AdXNyACFjb20udXBzLmNvbW1vbi5jb3JlLlJhdGluZ09wdGlvbnMZciLml5pwrgIAFVoAEmFjY291bnRCYXNlZFJhdGluZ1oAFWFsbG93U2VydmljZURvd25ncmFkZVoAEmFsbG93VU9NQ29ycmVjdGlvbloADmNhbGN1bGF0ZVRheGVzWgAYZGVuc2l0eUVsaWdpYmxlSW5kaWNhdG9yWgAOZGlzY291bnRSYXRpbmdaACBpc0ludGVyY2VwdE9wdGlvbnNDaGFyZ2VzRW5hYmxlZFoAHmlzVHJhbnNwb3J0YXRpb25DaGFyZ2VzRW5hYmxlZFoAF2lzVXBncmFkZUNoYXJnZXNFbmFibGVkWgAIaXNVcHNlbGxJAAlyYXRlQ2hhcnRaABF0aGlyZFBGQ0luZGljYXRvcloAHXVzZUFjY3RTaGlwTHZsQmlsbGFibGVXZ3RDYWxjWgARdXNlckxldmVsRGlzY291bnRMAAxhY2Nlc3NNZXRob2RxAH4AAkwAC2JpbGxpbmdUaWVycQB+AAJMAA1odW5kcmVkV2VpZ2h0dAATTGphdmEvbGFuZy9JbnRlZ2VyO0wACnBpY2t1cERhdGVxAH4ATkwABXNkc0lEcQB+AAJMAA1zZHNNYXRjaExldmVscQB+AAJMAA50cmFuc1Byb21vQ29kZXQAJExjb20vdXBzL2NvbW1vbi9jb3JlL1RyYW5zUHJvbW9Db2RlO3hwAAAAAAAAAQEBAAAAAAYAAAB0AANSRUdwc3IAEWphdmEubGFuZy5JbnRlZ2VyEuKgpPeBhzgCAAFJAAV2YWx1ZXhxAH4A3QAAAAFzcQB+AMN3CAAAAV6fmunIeHBwcHNyACJjb20udXBzLmNvbW1vbi5jb3JlLlJhdGluZ1Jlc3BvbnNlXhSxDL2nzhkCAApaABtkZWZpY2l0V2VpZ2h0UmF0ZWRJbmRpY2F0b3JaAA1kaXNjb3VudFJhdGVkRAAYZnVlbFN1cmNoYXJnZUNvZWZmaWNpZW50WgALaW1wb3J0UmF0ZWRaABRyYXRlZEJ5SHVuZHJlZFdlaWdodEwAEWFiclJhdGVkSW5kaWNhdG9ydAAnTGNvbS91cHMvY29tbW9uL2NvcmUvQUJSUmF0ZWRJbmRpY2F0b3I7TAAQbnJmVHJhbnNhY3Rpb25JZHEAfgACTAAQcmF0aW5nSW5kaWNhdG9yc3EAfgEYTAAXd2lubmluZ1JhdGVUeXBlSW5jZW50ZWR0ACVMY29tL3Vwcy9jb21tb24vY29yZS9XaW5uaW5nUmF0ZVR5cGU7TAAYd2lubmluZ1JhdGVUeXBlUHVibGlzaGVkcQB+AWZ4cAAAP/FHrhSBwIAAAHNyACVjb20udXBzLmNvbW1vbi5jb3JlLkFCUlJhdGVkSW5kaWNhdG9yF5KdTRVrAXkCAAFJAAttX2luZGljYXRvcnhwAAAAAnQAEzE1MDU5MTYyODMzMzkxRjY5MUJzcQB+AS8AAAAAdwQAAAAAeHNyACNjb20udXBzLmNvbW1vbi5jb3JlLldpbm5pbmdSYXRlVHlwZe6MvWbOUKaeAgAAeHEAfgAhdAAjY29tLnVwcy5jb21tb24uY29yZS5XaW5uaW5nUmF0ZVR5cGV0ABFPVEhFUl9SQVRJTkdfVFlQRXNxAH4BbHQAI2NvbS51cHMuY29tbW9uLmNvcmUuV2lubmluZ1JhdGVUeXBldAAUU01BTExfUEFDS0FHRV9SQVRJTkd1cQB+ATsAAAAFc3EAfgE9AAAAAQBxAH4BP3EAfgFAdAANUmVmZXJlbmNlICMgMXBzcQB+AT0AAAACAHEAfgE/cQB+AUB0AA1SZWZlcmVuY2UgIyAycHBwcHQACklUMzkwMTkwMDdwc3IAG2NvbS51cHMuY29tbW9uLmNvcmUuU2VydmljZZGF5NRJIjDyAgAEWgAXYWNjb3VudENvbnRyYWN0UmVxdWlyZWRMAA9jaGFyZ2VDb250YWluZXJxAH4ASkwABnJhdmVJZHEAfgACTAAEdHlwZXEAfgACeHAAc3EAfgBuAHNxAH4Acj9AAAAAAAAAdwgAAAABAAAAAXEAfgB1c3EAfgB2AAAAAAAAAaRxAH4AdXhxAH4AeXQAA0dORHQAAzAxMXBwcQB+AJ50AAZHNzBHVDZzcgAlY29tLnVwcy5jb21tb24uY29yZS5UYXhSZXNwb25zZVN0YXR1c4IFz91d4Hk7AgAAeHEAfgAhdAAlY29tLnVwcy5jb21tb24uY29yZS5UYXhSZXNwb25zZVN0YXR1c3QAAVJxAH4AnnNyACBjb20udXBzLmNvbW1vbi5jb3JlLlNoaXBtZW50VHlwZQo7WP5CUcNHAgAAeHEAfgAhdAAgY29tLnVwcy5jb21tb24uY29yZS5TaGlwbWVudFR5cGV0AAlTTUFMTF9QS0dwcHQACHRoYWJhcnQxcHNyACljb20udXBzLmNvbW1vbi5jb3JlLlVTUFNTdWJDbGFzc2lmaWNhdGlvbvxNNytapMjCAgAAeHEAfgAhdAApY29tLnVwcy5jb21tb24uY29yZS5VU1BTU3ViQ2xhc3NpZmljYXRpb250AA5OT1RfQVBQTElDQUJMRXNxAH4AhgAAAAAAAAAEdXEAfgCJAAAABXNyABljb20udXBzLmNvbW1vbi5jb3JlLkFnZW50wS/XxZ7wK0UCABZaAA9iaWxsVG9FeGVtcHRpb25aABljb21tZXJjaWFsU2lnbmF0dXJlUmVxSW5kSQAEcm9sZUwAAklEcQB+AAJMAApQQ1Bob25lTnVtcQB+AAJMAAdhZGRyZXNzcQB+ABZMABBiYWxhbmNlQ29udGFpbmVycQB+AEpMABJjb21wYW55RGlzcGxheU5hbWVxAH4AAkwABWVtYWlscQB+AAJMAAlleHRlbnNpb25xAH4AAkwAA2ZheHQAH0xjb20vdXBzL2NvbW1vbi9jb3JlL0ZheE51bWJlcjtMABlncmFuZFRvdGFsQ2hhcmdlQ29udGFpbmVycQB+AEpMAARuYW1lcQB+AAJMAAhuaWNrTmFtZXEAfgACTAAOcGF5bWVudEFjY291bnR0AB1MY29tL3Vwcy9jb21tb24vY29yZS9BY2NvdW50O0wABXBob25lcQB+AAJMABtyZXRhaWxMb2NhdGlvbkFjY291bnROdW1iZXJxAH4AAkwAD3NoaXBwaW5nQWNjb3VudHEAfgGSTAAJdGF4RGV0YWlscQB+AI5MAAV0YXhJZHEAfgACTAAJdGF4SWRUeXBlcQB+AAJMABd0YXhUb3RhbENoYXJnZUNvbnRhaW5lcnEAfgBKeHAAAAAAAApxAH4AnnEAfgCec3IAG2NvbS51cHMuY29tbW9uLmNvcmUuQWRkcmVzc+nkrbcek+YAAgAYRAAJQVZRdWFsaXR5WgAXY29uc2lnbmVlQmlsbGluZ0VuYWJsZWRaAA5wb0JveEluZGljYXRvcloAEHByb2ZpbGVJbmRpY2F0b3JaAAtyZXNpZGVudGlhbEwABWFkZHIycQB+AAJMAAVhZGRyM3EAfgACTAAJYWRkclNhdmVkcQB+AAJMABdhZGRyU3RhbmRhcmRpemF0aW9uVHlwZXEAfgACTAAVYWRkclZhbGlkYXRpb25SZXN1bHRzcQB+AAJMAARjaXR5cQB+AAJMAAtjb250YWN0TmFtZXEAfgACTAAHY291bnRyeXEAfgACTAARZGF0YUNhcHR1cmVNZXRob2RxAH4AAkwADGZhY2lsaXR5Q29kZXEAfgACTAAhZnJlaWdodEZvcndhcmRpbmdTb3J0RmFjaWxpdHlDb2RlcQB+AAJMAApsb2NhdGlvbklEcQB+AAJMAApwb3N0YWxDb2RlcQB+AAJMAAxwb3N0YWxDb2RlSGlxAH4AAkwADHBvc3RhbENvZGVMb3EAfgACTAAFc3RhdGVxAH4AAkwABnN0cmVldHEAfgACTAAUdXBzQWNjZXNzUG9pbnROdW1iZXJxAH4AAkwADHVyYmFuaXphdGlvbnEAfgACeHAAAAAAAAAAAAAAAABxAH4AnnEAfgCecQB+AJ5xAH4AnnEAfgCedAAFTkVVU1NxAH4AnnQAAkRFcQB+AJ5wcHEAfgCedAAFNDE0NjBxAH4AnnEAfgCecQB+AJ50ABUxMCBHT0VSTElUWkVSIFNUUkFTU0VwcQB+AJ5zcQB+AG4Ac3EAfgByP0AAAAAAAAB3CAAAAAEAAAABcQB+AHVzcQB+AHYAAAAAAAABpHEAfgB1eHEAfgB5cHEAfgCecQB+AJ5wc3EAfgBuAHNxAH4Acj9AAAAAAAAAdwgAAAABAAAAAXEAfgB1c3EAfgB2AAAAAAAAAaRxAH4AdXhxAH4AeXQADkhhYmFydCBUaGllcnJ5cQB+AJ5zcgAaY29tLnVwcy5jb21tb24uY29yZS5QYXlQYWwx/ixW1qAwdgIABEwAEXBheXBhbEFjY291bnROYW1lcQB+AAJMABhwYXlwYWxCaWxsaW5nQWdyZWVtZW50SURxAH4AAkwAC3BheXBhbEVtYWlscQB+AAJMAA1wYXlwYWxQYXllcklkcQB+AAJ4cgAqY29tLnVwcy5jb21tb24uY29yZS5BbHRlcm5hdGVQYXltZW50TWV0aG9kO0ZGc3N2mhMCAARJABRwYXltZW50TWVkaWFUeXBlQ29kZUwACmFjY291bnRLZXlxAH4AAkwADmJpbGxpbmdBZGRyZXNzcQB+ABZMABZwYXltZW50VHJhbnNhY3Rpb25HVUlEcQB+AAJ4cgAbY29tLnVwcy5j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"
            });
            string s = "";
        }

        [Fact]
        public async Task GetLabel()
        {
            var settingsProvider = new FakeSettingsProvider();
            var upsClient = new UpsClient(new FakeHttpClientFactory(), settingsProvider);
            var res = await upsClient.GetLabel(new GetLabelParameter
            {
                Credentials = new UpsCredentials
                {
                    LicenseNumber = _accessLicenseNumber,
                    Password = _password,
                    UserName = _userName
                },
                TrackingNumber = "1Z12345E8791315509"
            });
            if (res.LabelResults != null && res.LabelResults.LabelImage != null)
            {
                var b64 = res.LabelResults.LabelImage.GraphicImage;
                var bytes = Convert.FromBase64String(b64);
                File.WriteAllBytes(@"C:\Output\output.gif", bytes);
            }

            string s = "";
        }

        [Fact]
        public async Task Track()
        {
            var settingsProvider = new FakeSettingsProvider();
            var upsClient = new UpsClient(new FakeHttpClientFactory(), settingsProvider);
            var res = await upsClient.Track("1Z12345E0291980793",
                new UpsCredentials
                {
                    LicenseNumber = _accessLicenseNumber,
                    Password = _password,
                    UserName = _userName
                }
            );

            string s = "";
        }
    }
}
