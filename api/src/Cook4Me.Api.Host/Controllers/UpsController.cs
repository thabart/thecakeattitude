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

using Cook4Me.Api.Host.Operations.Ups;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Ups)]
    public class UpsController : Controller
    {
        private readonly IGetLocationsOperation _getLocationsOperation;
        private readonly IGetRatingsOperation _getRatingsOperation;
        private readonly IPurchaseUpsLabelOperation _purchaseUpsLabelOperation;
        private readonly IGetUpsServicesOperation _getUpsServicesOperation;

        public UpsController(IGetLocationsOperation getLocationsOperation, IGetRatingsOperation getRatingsOperation, 
            IPurchaseUpsLabelOperation purchaseUpsLabelOperation, IGetUpsServicesOperation getUpsServicesOperation)
        {
            _getLocationsOperation = getLocationsOperation;
            _getRatingsOperation = getRatingsOperation;
            _purchaseUpsLabelOperation = purchaseUpsLabelOperation;
            _getUpsServicesOperation = getUpsServicesOperation;
        }

        [HttpPost(Constants.RouteNames.ParcelShopLocations)]
        public async Task<IActionResult> SearchLocations([FromBody] JObject jObj)
        {
            return await _getLocationsOperation.Execute(jObj);
        }

        [HttpPost(Constants.RouteNames.SearchCapabalities)]
        public async Task<IActionResult> GetRatings([FromBody] JObject jObj)
        {
            return await _getRatingsOperation.Execute(jObj);
        }

        [HttpPost(Constants.RouteNames.BuyLabel)]
        public async Task<IActionResult> Purchase([FromBody] JObject jObj)
        {
            return await _purchaseUpsLabelOperation.Execute(jObj);
        }

        [HttpGet(Constants.RouteNames.UpsServices)]
        public async Task<IActionResult> GetServices(string id)
        {
            return await _getUpsServicesOperation.Execute(id);
        }
    }
}
