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

using Newtonsoft.Json.Linq;
using Sumup.Client.Factories;
using Sumup.Client.Params;
using Sumup.Client.Responses;
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Sumup.Client
{
    public interface ISumupClient
    {

    }

    internal class SumupClient : ISumupClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private const string _baseUrl = "https://api.sumup.com";

        public SumupClient(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<AddClientResponse> AddClient(AddClientParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            var client = _httpClientFactory.GetHttpClient();
            var jObj = ToDto(parameter);
            var content = new StringContent(jObj.ToString(), Encoding.UTF8, "application/json");
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(_baseUrl + "/v0.1/customers"),
                Content = content
            };
            request.Headers.Add("Authorization", $"Bearer {parameter.AccessToken}");
            var serializedContent = await client.SendAsync(request).ConfigureAwait(false);
            serializedContent.EnsureSuccessStatusCode();
            var json = await serializedContent.Content.ReadAsStringAsync();
            return ToModel(JObject.Parse(json));
        }

        private static JObject ToDto(AddClientParameter parameter)
        {
            var result = new JObject();
            var personalDetails = new JObject();
            var adr = new JObject();
            personalDetails.Add(Constants.DtoNames.ClientNames.Name, parameter.Name);
            personalDetails.Add(Constants.DtoNames.ClientNames.Phone, parameter.Phone);
            if (parameter.Address != null)
            {
                adr.Add(Constants.DtoNames.SumupAddressNames.Line1, parameter.Address.Line1);
                adr.Add(Constants.DtoNames.SumupAddressNames.Line2, parameter.Address.Line2);
                adr.Add(Constants.DtoNames.SumupAddressNames.Country, parameter.Address.Country);
                adr.Add(Constants.DtoNames.SumupAddressNames.PostalCode, parameter.Address.PostalCode);
                adr.Add(Constants.DtoNames.SumupAddressNames.City, parameter.Address.City);
                adr.Add(Constants.DtoNames.SumupAddressNames.State, parameter.Address.State);
                personalDetails.Add(Constants.DtoNames.ClientNames.Address, adr);
            }

            result.Add(Constants.DtoNames.ClientNames.Id, parameter.Id);
            result.Add(Constants.DtoNames.ClientNames.PersonalDetails, personalDetails);
            return result;
        }

        private static AddClientResponse ToModel(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new AddClientResponse
            {
                CustomerId = jObj.Value<string>(Constants.DtoNames.ClientNames.Id)
            };

            var personalDetails = jObj.GetValue(Constants.DtoNames.ClientNames.PersonalDetails) as JObject;
            if (personalDetails != null)
            {
                result.Name = personalDetails.Value<string>(Constants.DtoNames.ClientNames.Name);
                result.Phone = personalDetails.Value<string>(Constants.DtoNames.ClientNames.Phone);
                var addressObj = personalDetails.GetValue(Constants.DtoNames.ClientNames.Address) as JObject;
                if (addressObj != null)
                {
                    result.Address = new AddClientAddressResponse
                    {
                        AddressLine1 = addressObj.Value<string>(Constants.DtoNames.ClientResponseAddressNames.AddressLine1),
                        AddressLine2 = addressObj.Value<string>(Constants.DtoNames.ClientResponseAddressNames.AddressLine2),
                        City = addressObj.Value<string>(Constants.DtoNames.ClientResponseAddressNames.City),
                        Country = addressObj.Value<string>(Constants.DtoNames.ClientResponseAddressNames.Country),
                        CountryEnName = addressObj.Value<string>(Constants.DtoNames.ClientResponseAddressNames.CountryEnName),
                        CountryNativeName = addressObj.Value<string>(Constants.DtoNames.ClientResponseAddressNames.CountryNativeName),
                        LandLine = addressObj.Value<string>(Constants.DtoNames.ClientResponseAddressNames.LandLine),
                        Line1 = addressObj.Value<string>(Constants.DtoNames.ClientResponseAddressNames.Line1),
                        Line2 = addressObj.Value<string>(Constants.DtoNames.ClientResponseAddressNames.Line2),
                        PostalCode = addressObj.Value<string>(Constants.DtoNames.ClientResponseAddressNames.PostalCode),
                        PostCode = addressObj.Value<string>(Constants.DtoNames.ClientResponseAddressNames.PostCode),
                        RegionId = addressObj.Value<string>(Constants.DtoNames.ClientResponseAddressNames.RegionId),
                        RegionName = addressObj.Value<string>(Constants.DtoNames.ClientResponseAddressNames.RegionName),
                        State = addressObj.Value<string>(Constants.DtoNames.ClientResponseAddressNames.State)
                    };
                }
            }

            return result;
        }
    }
}
