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

using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Enrichers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Discount
{
    public interface ISearchDiscountOperation
    {
        Task<IActionResult> Execute(JObject jObj, string subject);
    }

    internal class SearchDiscountOperation : ISearchDiscountOperation
    {
        private readonly IDiscountRepository _repository;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IDiscountEnricher _discountEnricher;

        public SearchDiscountOperation(IDiscountRepository repository, IRequestBuilder requestBuilder,
            IHalResponseBuilder halResponseBuilder, IDiscountEnricher discountEnricher)
        {
            _repository = repository;
            _requestBuilder = requestBuilder;
            _halResponseBuilder = halResponseBuilder;
            _discountEnricher = discountEnricher;
        }

        public async Task<IActionResult> Execute(JObject jObj, string subject)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var request = _requestBuilder.GetSearchDiscountsParameter(jObj);
            request.Subject = subject;
            var searchResult = await _repository.Search(request);
            searchResult.Content = searchResult.Content == null ? new List<DiscountAggregate>() : searchResult.Content;
            var href = "/" + Constants.RouteNames.Discounts + "/" + Constants.RouteNames.Search;
            _halResponseBuilder.AddLinks(l => l.AddSelf(href));
            foreach (var order in searchResult.Content)
            {
                _discountEnricher.Enrich(_halResponseBuilder, order);
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
