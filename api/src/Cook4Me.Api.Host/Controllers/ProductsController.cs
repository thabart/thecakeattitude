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
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Products)]
    public class ProductsController : Controller
    {
        private readonly IProductRepository _repository;
        private readonly IShopRepository _shopRepository;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IRequestBuilder _requestBuilder;

        public ProductsController(
            IProductRepository repository, IResponseBuilder responseBuilder,
            IHalResponseBuilder halResponseBuilder, IRequestBuilder requestBuilder,
            IShopRepository shopRepository)
        {
            _repository = repository;
            _responseBuilder = responseBuilder;
            _halResponseBuilder = halResponseBuilder;
            _requestBuilder = requestBuilder;
            _shopRepository = shopRepository;
        }

        [HttpGet(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search()
        {
            var parameter = _requestBuilder.GetSearchProducts(Request.Query);
            return await Search(parameter);
        }
        
        [HttpPost(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            var parameter = _requestBuilder.GetSearchProducts(jObj);
            return await Search(parameter);
        }

        private async Task<IActionResult> Search(SearchProductsParameter parameter)
        {
            var searchResult = await _repository.Search(parameter);
            _halResponseBuilder.AddLinks(l => l.AddSelf(GetProductLink(parameter.StartIndex, parameter.Count, Request.Query)));
            if (searchResult != null && searchResult.Content != null)
            {
                var comments = searchResult.Content;
                foreach (var comment in comments)
                {
                    AddProduct(_halResponseBuilder, _responseBuilder, comment);
                }

                double r = (double)searchResult.TotalResults / (double)parameter.Count;
                var nbPages = Math.Ceiling(r);
                nbPages = nbPages == 0 ? 1 : nbPages;
                for (var page = 1; page <= nbPages; page++)
                {
                    _halResponseBuilder.AddLinks(l => l.AddOtherItem("navigation", new Dtos.Link(GetProductLink((page - 1) * parameter.Count, parameter.Count, Request.Query), page.ToString())));
                }
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private void AddProduct(IHalResponseBuilder halResponseBuilder, IResponseBuilder responseBuilder, Product product)
        {
            _halResponseBuilder.AddEmbedded(e => e.AddObject(_responseBuilder.GetProduct(product),
                (l) =>
                {
                    l.AddOtherItem("shop", new Dtos.Link("/" + Constants.RouteNames.Shops + "/" + product.ShopId)).AddSelf(Constants.RouteNames.Products + "/" + product.Id);
                }));
        }

        private static string GetProductLink(int startIndex, int count, IQueryCollection query)
        {
            var builder = new StringBuilder();
            builder.Append($"?{Constants.DtoNames.Paginate.StartIndex}={startIndex}");
            builder.Append($"&{Constants.DtoNames.Paginate.Count}={count}");
            foreach (var kvp in query)
            {
                if (kvp.Key == Constants.DtoNames.Paginate.StartIndex ||
                    kvp.Key == Constants.DtoNames.Paginate.Count)
                {
                    continue;
                }

                builder.Append($"&{kvp.Key}={kvp.Value}");
            }

            return "/" + Constants.RouteNames.Products + "/" + Constants.RouteNames.Search +
                builder.ToString();
        }
    }
}
