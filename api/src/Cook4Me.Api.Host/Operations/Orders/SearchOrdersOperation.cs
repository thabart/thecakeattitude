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

using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.Core.Helpers;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Enrichers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Cook4Me.Api.Core.Parameters;

namespace Cook4Me.Api.Host.Operations.Orders
{
    public interface ISearchOrdersOperation
    {
        Task<IActionResult> Execute(JObject jObj, string subject);
    }

    internal class SearchOrdersOperation : ISearchOrdersOperation
    {
        private readonly IOrderRepository _repository;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IOrderEnricher _orderEnricher;

        public SearchOrdersOperation(IOrderRepository repository, IRequestBuilder requestBuilder,
            IHalResponseBuilder halResponseBuilder, IOrderEnricher orderEnricher)
        {
            _repository = repository;
            _requestBuilder = requestBuilder;
            _halResponseBuilder = halResponseBuilder;
            _orderEnricher = orderEnricher;
        }

        public async Task<IActionResult> Execute(JObject jObj, string subject)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var request = _requestBuilder.GetSearchOrdersParameter(jObj);
            var searchResult = await _repository.Search(request);
            searchResult.Content = searchResult.Content == null ? new List<OrderAggregate>() : searchResult.Content;
            var href = "/" + Constants.RouteNames.Orders + "/" + Constants.RouteNames.Search;
            _halResponseBuilder.AddLinks(l => l.AddSelf(href));
            foreach (var order in searchResult.Content)
            {
                if (order.Subject != subject && order.SellerId != subject)
                {
                    continue;
                }

                await _orderEnricher.Enrich(_halResponseBuilder, order);
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
    }
}
