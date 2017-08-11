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
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Messages
{
    public interface ISearchMessagesOperation
    {
        Task<IActionResult> Execute(JObject jObj, string subject);
    }

    internal class SearchMessagesOperation : ISearchMessagesOperation
    {
        private readonly IMessageRepository _repository;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IMessageEnricher _messageEnricher;

        public SearchMessagesOperation(IMessageRepository repository, IRequestBuilder requestBuilder, IHalResponseBuilder halResponseBuilder, IMessageEnricher messageEnricher)
        {
            _repository = repository;
            _requestBuilder = requestBuilder;
            _halResponseBuilder = halResponseBuilder;
            _messageEnricher = messageEnricher;
        }

        public async  Task<IActionResult> Execute(JObject jObj, string subject)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }
            
            var href = "/" + Constants.RouteNames.Messages + "/" + Constants.RouteNames.Search;
            var request = _requestBuilder.GetSearchMessages(jObj);
            var searchResult = await _repository.Search(request);
            if (searchResult.Content == null || !searchResult.Content.Any())
            {
                return new NotFoundResult();
            }

            _halResponseBuilder.AddLinks(l => l.AddSelf(href));
            foreach (var message in searchResult.Content)
            {
                _messageEnricher.Enrich(_halResponseBuilder, message);
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
