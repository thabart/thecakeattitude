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

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Enrichers;
using Newtonsoft.Json.Linq;

namespace Cook4Me.Api.Host.Operations.Shop
{
    public interface ISearchShopCommentsOperation
    {
        Task<IActionResult> Execute(string shopId, JObject jObj);
    }

    internal class SearchShopCommentsOperation : ISearchShopCommentsOperation
    {
        private readonly IRequestBuilder _requestBuilder;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IShopRepository _shopRepository;
        private readonly IShopCommentEnricher _commentEnricher;

        public SearchShopCommentsOperation(IRequestBuilder requestBuilder, IHalResponseBuilder halResponseBuilder, IShopRepository shopRepository, IShopCommentEnricher commentEnricher)
        {
            _requestBuilder = requestBuilder;
            _halResponseBuilder = halResponseBuilder;
            _shopRepository = shopRepository;
            _commentEnricher = commentEnricher;
        }

        public async Task<IActionResult> Execute(string shopId, JObject jObj)
        {
            if (string.IsNullOrWhiteSpace(shopId))
            {
                throw new ArgumentNullException(nameof(shopId));
            }

            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var parameter = _requestBuilder.GetSearchShopComments(jObj);
            parameter.ShopId = shopId;
            var searchResult = await _shopRepository.SearchComments(parameter);
            _halResponseBuilder.AddLinks(l => l.AddSelf(GetCommentLink(shopId)));
            if (searchResult != null && searchResult.Content != null)
            {
                var comments = searchResult.Content;
                foreach (var comment in comments)
                {
                    _commentEnricher.Enrich(_halResponseBuilder, comment, parameter.ShopId);
                }

                double r = (double)searchResult.TotalResults / (double)parameter.Count;
                var nbPages = Math.Ceiling(r);
                nbPages = nbPages == 0 ? 1 : nbPages;
                for (var page = 1; page <= nbPages; page++)
                {
                    _halResponseBuilder.AddLinks(l => l.AddOtherItem("navigation", new Dtos.Link(GetCommentLink(shopId), page.ToString())));
                }
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private static string GetCommentLink(string shopId)
        {
            return "/" + Constants.RouteNames.Shops + "/" + Constants.RouteNames.SearchComments.Replace("{id}", shopId);
        }
    }
}
