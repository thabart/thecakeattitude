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

using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Shops)]
    public class ShopsController : Controller
    {
        private readonly IShopRepository _repository;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IResponseBuilder _responseBuilder;

        public ShopsController(IShopRepository repository, IRequestBuilder requestBuilder, IResponseBuilder responseBuilder)
        {
            _repository = repository;
            _requestBuilder = requestBuilder;
            _responseBuilder = responseBuilder;
        }

        [HttpPost]
        public async Task<IActionResult> AddShop([FromBody] JObject obj)
        {
            var result = _requestBuilder.GetAddShop(obj);
            result.Id = Guid.NewGuid().ToString();
            result.CreateDateTime = DateTime.UtcNow;
            await _repository.Add(result);
            return new OkResult();
        }

        [HttpGet]
        public async Task<IActionResult> GetShops()
        {
            var arr = new JArray();
            var shops = await _repository.Get();
            foreach(var shop in shops)
            {
                arr.Add(_responseBuilder.GetShop(shop));
            }

            return new OkObjectResult(arr);
        }

        [HttpPost(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            var request = _requestBuilder.GetSearchShops(jObj);
            var shops = await _repository.Search(request);
            var arr = new JArray();
            foreach (var shop in shops)
            {
                arr.Add(_responseBuilder.GetShop(shop));
            }

            if (!arr.Any())
            {
                return new NotFoundResult();
            }

            return new OkObjectResult(arr);
        }
    }
}
