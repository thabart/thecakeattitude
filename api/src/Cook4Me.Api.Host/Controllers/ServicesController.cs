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

using Cook4Me.Api.Host.Operations.Services;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Services)]
    public class ServicesController : Controller
    {
        private readonly ISearchServiceOccurrencesOperation _searchServiceOccurrencesOperation;
        private readonly ISearchServicesOperation _searchServicesOperation;

        public ServicesController(
            ISearchServiceOccurrencesOperation searchServiceOccurrencesOperation, ISearchServicesOperation searchServicesOperation)
        {
            _searchServiceOccurrencesOperation = searchServiceOccurrencesOperation;
            _searchServicesOperation = searchServicesOperation;
        }

        [HttpPost(Constants.RouteNames.SearchOccurrences)]
        public async Task<IActionResult> SearchOccurrences([FromBody] JObject jObj)
        {
            return await _searchServiceOccurrencesOperation.Execute(jObj);
        }

        [HttpPost(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            return await _searchServicesOperation.Execute(jObj);
        }
    }
}
