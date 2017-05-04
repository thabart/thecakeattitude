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
using Cook4Me.Api.Host.Operations;
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
        private readonly ICommentRepository _commentRepository;
        private readonly IAddCommentValidator _addCommentValidator;
        private readonly IAddShopOperation _addShopOperation;

        public ShopsController(
            IShopRepository repository, IRequestBuilder requestBuilder, IResponseBuilder responseBuilder,
            IHostingEnvironment env, IAddShopValidator addShopValidator, IHalResponseBuilder halResponseBuilder,
            ICommentRepository commentRepository, IAddCommentValidator addCommentValidator,
            IAddShopOperation addShopOperation)
        {
            _repository = repository;
            _requestBuilder = requestBuilder;
            _responseBuilder = responseBuilder;
            _env = env;
            _addShopValidator = addShopValidator;
            _halResponseBuilder = halResponseBuilder;
            _commentRepository = commentRepository;
            _addCommentValidator = addCommentValidator;
            _addShopOperation = addShopOperation;
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

        [HttpGet("{id}")]
        public async Task<IActionResult> GetShop(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var shop = await _repository.Get(id);
            if (shop == null)
            {
                return new NotFoundResult();
            }

            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Shops + "/" + id));
            AddShop(_halResponseBuilder, _responseBuilder, shop);
            return new OkObjectResult(_halResponseBuilder.Build());
        }

        [HttpPost]
        [Authorize("Connected")]
        public async Task<IActionResult> AddShop([FromBody] JObject obj)
        {
            var subject = User.GetSubject();
            if (string.IsNullOrEmpty(subject))
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ErrorDescriptions.TheSubjectCannotBeRetrieved);
                return this.BuildResponse(error, HttpStatusCode.BadRequest);
            }

            return await _addShopOperation.Execute(obj, subject);
        }

        [HttpPost(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            var href = "/" + Constants.RouteNames.Shops + "/" + Constants.RouteNames.Search;
            var request = _requestBuilder.GetSearchShops(jObj);
            var searchResult = await _repository.Search(request);
            if (searchResult.Content == null || !searchResult.Content.Any())
            {
                return new NotFoundResult();
            }
            
            _halResponseBuilder.AddLinks(l => l.AddSelf(href));
            foreach(var shop in searchResult.Content)
            {
                AddShop(_halResponseBuilder, _responseBuilder, shop);
            }
            
            double r = (double)searchResult.TotalResults / (double)request.Count;
            var nbPages = Math.Ceiling(r);
            nbPages = nbPages == 0 ? 1 : nbPages;
            for (var page = 1; page <= nbPages; page++)
            {
                _halResponseBuilder.AddLinks(l => l.AddOtherItem("navigation", new Dtos.Link(href, page.ToString())));
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
            foreach (var shop in shops.Content)
            {
                AddShop(_halResponseBuilder, _responseBuilder, shop);
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        [HttpPost(Constants.RouteNames.Comments)]
        [Authorize("Connected")]
        public async Task<IActionResult> AddComment([FromBody] JObject jObj)
        {
            var comment = _requestBuilder.GetComment(jObj);
            comment.CreateDateTime = DateTime.UtcNow;
            comment.UpdateDateTime = DateTime.UtcNow;
            comment.Id = Guid.NewGuid().ToString();
            comment.Subject = User.GetSubject();
            var validationResult = await _addCommentValidator.Validate(comment);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return this.BuildResponse(error, HttpStatusCode.BadRequest);
            }

            if (validationResult.Shop != null)
            {
                validationResult.Shop.AddComment(comment);
                if (!await _repository.Update(validationResult.Shop))
                {
                    var error = _responseBuilder.GetError(ErrorCodes.Server, ErrorDescriptions.TheShopCannotBeUpdated);
                    return this.BuildResponse(error, HttpStatusCode.BadRequest);
                }
            }

            if (!await _commentRepository.Add(comment))
            {
                var error = _responseBuilder.GetError(ErrorCodes.Server, ErrorDescriptions.TheCommentCannotBeInserted);
                return this.BuildResponse(error, HttpStatusCode.BadRequest);
            }

            var obj = new { id = comment.Id };
            return new OkObjectResult(obj);
        }

        private void AddShop(IHalResponseBuilder halResponseBuilder, IResponseBuilder responseBuilder, Shop shop)
        {
            _halResponseBuilder.AddEmbedded(e => e.AddObject(_responseBuilder.GetShop(shop), 
                (l) =>
                {
                    l.AddOtherItem("category", new Dtos.Link("/" + Constants.RouteNames.Categories + "/" + shop.CategoryId, shop.Category.Name)).AddSelf(Constants.RouteNames.Shops + "/" + shop.Id);
                    if (shop.Filters != null && shop.Filters.Any())
                    {
                        foreach(var filter in shop.Filters)
                        {
                            l.AddOtherItem("filters", new Dtos.Link("/" + Constants.RouteNames.Filers + "/" + filter.Id, filter.Name));
                        }
                    }

                    if (shop.ProductCategories != null && shop.ProductCategories.Any())
                    {
                        foreach(var productCategory in shop.ProductCategories)
                        {
                            l.AddOtherItem("productCategories", new Dtos.Link("/" + Constants.RouteNames.Filers + "/" + productCategory.Id, productCategory.Name));
                        }
                    }
                }));
        }
    }
}
