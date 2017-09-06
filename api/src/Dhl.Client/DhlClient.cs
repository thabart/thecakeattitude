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

using Dhl.Client.Factories;
using Dhl.Client.Params;
using Dhl.Client.Results.Capabalities;
using Dhl.Client.Results.ShopParcelLocations;
using Microsoft.AspNet.Http.Extensions;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace Dhl.Client
{
    public interface IDhlClient
    {
        Task<IEnumerable<ShopParcelLocation>> GetParcelShopLocations(SearchDhlParcelShopLocationsParameter parameter);
        Task<IEnumerable<DhlCapabality>> GetCapabilities(SearchDhlCapabilitiesParameter parameter);
    }

    internal class DhlClient : IDhlClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private const string _url = "https://my.dhlparcel.be/api";
        private const string _gUrl = "https://api-gw.dhlparcel.nl";
        private const string _countryCode = "BE";

        public DhlClient(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<IEnumerable<ShopParcelLocation>> GetParcelShopLocations(SearchDhlParcelShopLocationsParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            var queryBuilder = new QueryBuilder();
            if (!string.IsNullOrEmpty(parameter.Query))
            {
                queryBuilder.Add("q", parameter.Query);
            }

            if (!string.IsNullOrWhiteSpace(parameter.City))
            {
                queryBuilder.Add("city", parameter.City);
            }

            if (!string.IsNullOrWhiteSpace(parameter.HouseNumber))
            {
                queryBuilder.Add("houseNumber", parameter.HouseNumber);
            }

            if (!string.IsNullOrWhiteSpace(parameter.Street))
            {
                queryBuilder.Add("street", parameter.Street);
            }

            if (!string.IsNullOrWhiteSpace(parameter.ZipCode))
            {
                queryBuilder.Add("zipCode", parameter.ZipCode);
            }

            var query = queryBuilder.ToQueryString();
            var requestUri = new Uri(_gUrl + "/parcel-shop-locations/" + _countryCode + query);
            var request = new HttpRequestMessage
            {
                RequestUri = requestUri
            };

            var client = _httpClientFactory.GetHttpClient();
            var responseMessage = await client.SendAsync(request).ConfigureAwait(false);
            var content = await responseMessage.Content.ReadAsStringAsync().ConfigureAwait(false);
            return JsonConvert.DeserializeObject<IEnumerable<ShopParcelLocation>>(content);
        }

        public async Task<IEnumerable<DhlCapabality>> GetCapabilities(SearchDhlCapabilitiesParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            var queryBuilder = new QueryBuilder();
            queryBuilder.Add("accountNumber", "48000005");
            queryBuilder.Add("fromCountry", _countryCode);
            queryBuilder.Add("toCountry", _countryCode);
            queryBuilder.Add("fromBusiness", "false");
            queryBuilder.Add("toBusiness", "false");
            if (!string.IsNullOrWhiteSpace(parameter.ToZipCode))
            {
                queryBuilder.Add("toZipCode", parameter.ToZipCode);
            }

            if (!string.IsNullOrWhiteSpace(parameter.ParcelType))
            {
                queryBuilder.Add("parcelType", parameter.ParcelType);
            }
            
            var query = queryBuilder.ToQueryString();
            var requestUri = new Uri(_url + "/capabilities" + query);
            var request = new HttpRequestMessage
            {
                RequestUri = requestUri
            };

            var client = _httpClientFactory.GetHttpClient();
            var responseMessage = await client.SendAsync(request).ConfigureAwait(false);
            var content = await responseMessage.Content.ReadAsStringAsync().ConfigureAwait(false);
            return JsonConvert.DeserializeObject<IEnumerable<DhlCapabality>>(content);
        }
    }
}
