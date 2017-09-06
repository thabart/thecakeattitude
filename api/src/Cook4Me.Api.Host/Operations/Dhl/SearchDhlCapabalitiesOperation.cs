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

using Cook4Me.Api.Host.Builders;
using Dhl.Client;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Dhl
{
    public interface ISearchDhlCapabalitiesOperation
    {
        Task<IActionResult> Execute(JObject jObj);
    }

    internal class SearchDhlCapabalitiesOperation : ISearchDhlCapabalitiesOperation
    {
        private readonly IRequestBuilder _requestBuilder;
        private readonly IDhlClient _dhlClient;
        private readonly IResponseBuilder _responseBuilder;

        public SearchDhlCapabalitiesOperation(IRequestBuilder requestBuilder, IDhlClient dhlClient, IResponseBuilder responseBuilder)
        {
            _dhlClient = dhlClient;
            _requestBuilder = requestBuilder;
            _responseBuilder = responseBuilder;
        }

        public async Task<IActionResult> Execute(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var parameter = _requestBuilder.GetSearchDhlCapabilitiesParameter(jObj);
            var capabalities = await _dhlClient.GetCapabilities(parameter);
            return new OkObjectResult(_responseBuilder.GetCapabalities(capabalities));
        }
    }
}
