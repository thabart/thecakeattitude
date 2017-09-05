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
using Dhl.Client.Results.ShopParcelLocations;
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
    }

    internal class DhlClient : IDhlClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private const string _url = "https://api-gw.dhlparcel.nl/parcel-shop-locations";

        public DhlClient(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        public async Task<IEnumerable<ShopParcelLocation>> GetParcelShopLocations(SearchDhlParcelShopLocationsParameter parameter)
        {
            var client = _httpClientFactory.GetHttpClient();
            var query = string.Empty;
            if (!string.IsNullOrEmpty(parameter.Query))
            {
                query = "q=" + parameter.Query;
            }
            else
            {
                query = "city=" + parameter.City + "&houseNumber=" + parameter.HouseNumber + "&street="+parameter.Street + "&zipCode=" + parameter.ZipCode;
            }
            var request = new HttpRequestMessage
            {
                RequestUri = new Uri(_url + "/" + parameter.Country + "?" + query)
            };

            var responseMessage = await client.SendAsync(request).ConfigureAwait(false);
            var content = await responseMessage.Content.ReadAsStringAsync().ConfigureAwait(false);
            return JsonConvert.DeserializeObject<IEnumerable<ShopParcelLocation>>(content);
        }
    }
}
