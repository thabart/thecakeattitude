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

using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Enrichers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Product
{
    public interface ISearchProductsOperation
    {
        Task<IActionResult> Execute(JObject jObj);
    }

    internal class SearchProductsOperation : ISearchProductsOperation
    {
        private readonly IProductRepository _repository;
        private readonly IShopRepository _shopRepository;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IProductEnricher _productEnricher;

        public SearchProductsOperation(
            IProductRepository repository, IHalResponseBuilder halResponseBuilder, IRequestBuilder requestBuilder,
            IShopRepository shopRepository, IProductEnricher productEnricher)
        {
            _repository = repository;
            _halResponseBuilder = halResponseBuilder;
            _requestBuilder = requestBuilder;
            _shopRepository = shopRepository;
            _productEnricher = productEnricher;
        }

        public async Task<IActionResult> Execute(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var parameter = _requestBuilder.GetSearchProducts(jObj);
            var searchResult = await _repository.Search(parameter);
            _halResponseBuilder.AddLinks(l => l.AddSelf(GetProductLink()));
            if (searchResult != null && searchResult.Content != null)
            {
                var products = searchResult.Content;
                foreach (var product in products)
                {
                    _productEnricher.Enrich(_halResponseBuilder, product);
                }

                double r = (double)searchResult.TotalResults / (double)parameter.Count;
                var nbPages = Math.Ceiling(r);
                nbPages = nbPages == 0 ? 1 : nbPages;
                for (var page = 1; page <= nbPages; page++)
                {
                    _halResponseBuilder.AddLinks(l => l.AddOtherItem("navigation", new Dtos.Link(GetProductLink(), page.ToString())));
                }
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private static string GetProductLink()
        {
            return "/" + Constants.RouteNames.Products + "/" + Constants.RouteNames.Search;
        }
    }
}
