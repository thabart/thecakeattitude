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
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;
using Ups.Client;
using Ups.Client.Params;
using Ups.Client.Params.Locator;
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
            var httpHandler = new HttpClientHandler();
            ServicePointManager.ServerCertificateValidationCallback += (sender, cert, chain, sslPolicyErrors) => true;
            var client = new HttpClient(httpHandler);
            var parameter = new LocatorRequest
            {
                Security = new AccessRequestType
                {
                    AccessLicenseNumber = _accessLicenseNumber,
                    Password = _password,
                    UserId = _userName
                },
                Body = new LocatorRequestBody
                {
                    Request = new RequestType
                    {
                        RequestAction = "Locator",
                        RequestOption = "1",
                        TransactionReferenceType = new TransactionReferenceType
                        {
                            CustomerContext = "Your Test Case Summary Description",
                            XpciVersion = "1.0014"
                        }
                    },
                    Address = new LocatorOriginAddress
                    {
                        PhoneNumber = new StructuredPhoneNumberType(),
                        Address = new AddressKeyFormatType
                        {
                            AddressLine = "223 avenue des croix du feu",
                            PoliticalDivision2 = "Bruxelles",
                            CountryCode = "BE"
                        }
                    },
                    Translate = new TranslateType
                    {
                        LanguageCode = "ENG"
                    },
                    UnitOfMeasurement = new UnitOfMeasurementType
                    {
                        Code = "KM"
                    }
                }
            };

            var serializerSecurity = new XmlSerializer(typeof(AccessRequestType));
            var serializerBody = new XmlSerializer(typeof(LocatorRequestBody));
            var xmlSecurity = "";
            var xmlBody = "";
            using (var sww = new StringWriter())
            {
                using (var writer = XmlWriter.Create(sww))
                {
                    serializerSecurity.Serialize(writer, parameter.Security);
                    xmlSecurity = sww.ToString();
                }
            }

            using (var sww = new StringWriter())
            {
                using (var writer = XmlWriter.Create(sww))
                {
                    serializerBody.Serialize(writer, parameter.Body);
                    xmlBody = sww.ToString();
                }
            }

            var xml = xmlSecurity + "" + xmlBody;
            var body = new StringContent(xml);
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                Content = body,
                RequestUri = new Uri(_locationUrl)
            };
            var serializedContent = await client.SendAsync(request).ConfigureAwait(false);
            var res = await serializedContent.Content.ReadAsStringAsync();
            string s = "";
        }
    }
}
