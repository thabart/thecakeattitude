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
using Cook4Me.Api.Host.Enrichers;
using Cook4Me.Api.Host.Handlers;
using Cook4Me.Api.Host.Operations.Product;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Product
{
    public interface ISearchProductCommentsOperation
    {
        Task<IActionResult> Execute(string productId, JObject query);
    }

    internal class SearchProductCommentsOperation : ISearchProductCommentsOperation
    {
        private readonly IRequestBuilder _requestBuilder;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IProductRepository _productRepository;
        private readonly ICommentEnricher _commentEnricher;

        public SearchProductCommentsOperation(IRequestBuilder requestBuilder, IHalResponseBuilder halResponseBuilder, IProductRepository productRepository, ICommentEnricher commentEnricher)
        {
            _requestBuilder = requestBuilder;
            _halResponseBuilder = halResponseBuilder;
            _productRepository = productRepository;
            _commentEnricher = commentEnricher;
        }

        public async Task<IActionResult> Execute(string productId, JObject jObj)
        {
            if (string.IsNullOrWhiteSpace(productId))
            {
                throw new ArgumentNullException(nameof(productId));
            }

            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var parameter = _requestBuilder.GetSearchProductComments(jObj);
            parameter.ProductId = productId;
            var searchResult = await _productRepository.Search(parameter);
            _halResponseBuilder.AddLinks(l => l.AddSelf(GetCommentLink(productId)));
            if (searchResult != null && searchResult.Content != null)
            {
                var comments = searchResult.Content;
                foreach (var comment in comments)
                {
                    _commentEnricher.Enrich(_halResponseBuilder, comment, parameter.ProductId);
                }

                double r = (double)searchResult.TotalResults / (double)parameter.Count;
                var nbPages = Math.Ceiling(r);
                nbPages = nbPages == 0 ? 1 : nbPages;
                for (var page = 1; page <= nbPages; page++)
                {
                    _halResponseBuilder.AddLinks(l => l.AddOtherItem("navigation", new Dtos.Link(GetCommentLink(productId), page.ToString())));
                }
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private static string GetCommentLink(string productId)
        {
            return "/" + Constants.RouteNames.Products + "/" + Constants.RouteNames.SearchProductComment.Replace("{id}", productId);
        }
    }
}
