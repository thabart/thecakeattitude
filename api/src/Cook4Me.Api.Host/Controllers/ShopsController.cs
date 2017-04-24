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

using Cook4Me.Api.Core.Models;
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Extensions;
using Cook4Me.Api.Host.Validators;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Shops)]
    public class ShopsController : Controller
    {
        private readonly IShopRepository _repository;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IHostingEnvironment _env;
        private readonly IAddShopValidator _addShopValidator;
        private readonly IHalResponseBuilder _halResponseBuilder;

        public ShopsController(
            IShopRepository repository, IRequestBuilder requestBuilder, IResponseBuilder responseBuilder,
            IHostingEnvironment env, IAddShopValidator addShopValidator, IHalResponseBuilder halResponseBuilder)
        {
            _repository = repository;
            _requestBuilder = requestBuilder;
            _responseBuilder = responseBuilder;
            _env = env;
            _addShopValidator = addShopValidator;
            _halResponseBuilder = halResponseBuilder;
        }

        [HttpPost]
        [Authorize("Connected")]
        public async Task<IActionResult> AddShop([FromBody] JObject obj)
        {
            // 1. Try to retrieve the subject.
            var subject = User.GetSubject();
            if (string.IsNullOrEmpty(subject))
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ErrorDescriptions.TheSubjectCannotBeRetrieved);
                return this.BuildResponse(error, HttpStatusCode.BadRequest);
            }

            // 2. Check the request.
            Shop addShopParameter = null;
            try
            {
                addShopParameter = _requestBuilder.GetAddShop(obj);
            }
            catch (ArgumentException ex)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ex.Message);
                return this.BuildResponse(error, HttpStatusCode.BadRequest);
            }

            var validationResult = await _addShopValidator.Validate(addShopParameter, subject);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return this.BuildResponse(error, HttpStatusCode.BadRequest);
            }

            addShopParameter.Id = Guid.NewGuid().ToString();
            addShopParameter.CreateDateTime = DateTime.UtcNow;
            addShopParameter.UpdateDateTime = DateTime.UtcNow;
            addShopParameter.Subject = subject;
            addShopParameter.ShopRelativePath = GetRelativeShopPath(addShopParameter.Id);
            addShopParameter.UndergroundRelativePath = GetRelativeUndergroundPath(addShopParameter.Id);
            // 3. Add the files.
            if (!AddShopMap(addShopParameter, validationResult.Map))
            {
                var error = _responseBuilder.GetError(ErrorCodes.Server, ErrorDescriptions.TheShopCannotBeAdded);
                return this.BuildResponse(error, HttpStatusCode.InternalServerError);
            }

            // 4. Persist the shop.
            var res = new { id = addShopParameter.Id, shop_path = addShopParameter.ShopRelativePath, underground_path = addShopParameter.UndergroundRelativePath };
            await _repository.Add(addShopParameter);
            return new OkObjectResult(res);
        }

        [HttpPost(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            var request = _requestBuilder.GetSearchShops(jObj);
            var shops = await _repository.Search(request);
            if (!shops.Any())
            {
                return new NotFoundResult();
            }
            
            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Shops + "/" + Constants.RouteNames.Search));
            foreach(var shop in shops)
            {
                AddShop(_halResponseBuilder, _responseBuilder, shop);
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        [HttpGet]
        public async Task<IActionResult> GetShops()
        {
            var arr = new JArray();
            var shops = await _repository.Get();
            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Shops));
            foreach (var shop in shops)
            {
                AddShop(_halResponseBuilder, _responseBuilder, shop);
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        [HttpGet(Constants.RouteNames.Me)]
        [Authorize("Connected")]
        public async Task<IActionResult> GetMineShops()
        {
            var subject = User.GetSubject();
            if (string.IsNullOrEmpty(subject))
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ErrorDescriptions.TheSubjectCannotBeRetrieved);
                return this.BuildResponse(error, HttpStatusCode.BadRequest);
            }
            
            var shops = await _repository.Search(new SearchShopsParameter
            {
                Subject = subject
            });
            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Shops+"/"+Constants.RouteNames.Me));
            foreach (var shop in shops)
            {
                AddShop(_halResponseBuilder, _responseBuilder, shop);
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private bool AddShopMap(Shop shop, Map map)
        {
            if (!System.IO.File.Exists(Constants.Assets.PartialShop) || !System.IO.File.Exists(Constants.Assets.PartialUnderground))
            {
                return false;
            }

            var shopLines = System.IO.File.ReadAllLines(Constants.Assets.PartialShop);
            var undergroundLines = System.IO.File.ReadAllLines(Constants.Assets.PartialUnderground);
            var shopPath = Path.Combine(_env.WebRootPath, shop.ShopRelativePath);
            var undergroundPath = Path.Combine(_env.WebRootPath, shop.UndergroundRelativePath);
            var shopFile = System.IO.File.Create(shopPath);
            var undergroundFile = System.IO.File.Create(undergroundPath);
            using (var shopWriter = new StreamWriter(shopFile))
            {
                foreach (var shopLine in shopLines)
                {
                    shopWriter.WriteLine(shopLine.Replace("<map_name>", map.MapName).Replace("<warp_entry>", "shopentry_" + shop.Id).Replace("<underground_name>", "underground_" + shop.Id));
                }
            }

            using (var undergroundWriter = new StreamWriter(undergroundFile))
            {
                foreach(var undergroundLine in undergroundLines)
                {
                    undergroundWriter.WriteLine(undergroundLine.Replace("<map_name>", "shop_" + shop.Id));
                }
            }

            return true;
        }

        private static string GetRelativeShopPath(string id)
        {
            return @"shops/" + id + "_shop.json";
        }

        private static string GetRelativeUndergroundPath(string id)
        {
            return @"shops/" + id + "_underground.json";
        }

        private void AddShop(IHalResponseBuilder halResponseBuilder, IResponseBuilder responseBuilder, Shop shop)
        {
            _halResponseBuilder.AddEmbedded(e => e.AddObject(_responseBuilder.GetShop(shop), (l) => l.AddItem(new Dtos.Link("/" + Constants.RouteNames.Categories + "/" + shop.CategoryId, shop.Category.Name))));
        }
    }
}
