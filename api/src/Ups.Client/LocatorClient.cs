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
using System.Net.Http;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;
using Ups.Client.Common;
using Ups.Client.Factories;
using Ups.Client.Params;
using Ups.Client.Params.Locator;
using Ups.Client.Responses.Locator;

namespace Ups.Client
{
    public interface ILocatorClient
    {
        Task GetLocations(GetLocationsParameter parameter);
    }

    internal class LocatorClient : ILocatorClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private const string _locationUrl = "https://onlinetools.ups.com/ups.app/xml/Locator";

        public LocatorClient(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task GetLocations(GetLocationsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            if (parameter.Address == null)
            {
                throw new ArgumentNullException(nameof(parameter.Address));
            }

            if (parameter.Credentials == null)
            {
                throw new ArgumentNullException(nameof(parameter.Credentials));
            }

            var client = _httpClientFactory.GetHttpClient();
            var request = new LocatorRequest
            {
                Security = new AccessRequestType
                {
                    AccessLicenseNumber = parameter.Credentials.LicenseNumber,
                    Password = parameter.Credentials.Password,
                    UserId = parameter.Credentials.UserName
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
                            AddressLine = parameter.Address.AddressLine,
                            PoliticalDivision2 = parameter.Address.City,
                            CountryCode = parameter.Address.Country
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
                    serializerSecurity.Serialize(writer, request.Security);
                    xmlSecurity = sww.ToString();
                }
            }

            using (var sww = new StringWriter())
            {
                using (var writer = XmlWriter.Create(sww))
                {
                    serializerBody.Serialize(writer, request.Body);
                    xmlBody = sww.ToString();
                }
            }

            var xml = xmlSecurity + "" + xmlBody;
            var body = new StringContent(xml);
            var req = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                Content = body,
                RequestUri = new Uri(_locationUrl)
            };
            var serializedContent = await client.SendAsync(req).ConfigureAwait(false);
            var res = await serializedContent.Content.ReadAsStringAsync();
            var deserializer = new XmlSerializer(typeof(LocatorResponse));
            using (TextReader reader = new StringReader(res))
            {
                var r = (LocatorResponse)deserializer.Deserialize(reader);
                string s = "";
            }
        }
    }
}
