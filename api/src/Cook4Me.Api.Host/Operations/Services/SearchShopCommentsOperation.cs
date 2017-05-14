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
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Services
{
    public interface ISearchServiceCommentsOperation
    {
        Task<IActionResult> Execute(string serviceId, JObject jObj);
    }

    internal class SearchServiceCommentsOperation : ISearchServiceCommentsOperation
    {
        private readonly IRequestBuilder _requestBuilder;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IServiceRepository _serviceRepository;
        private readonly IServiceCommentEnricher _commentEnricher;

        public SearchServiceCommentsOperation(IRequestBuilder requestBuilder, IHalResponseBuilder halResponseBuilder, IServiceRepository serviceRepository, IServiceCommentEnricher commentEnricher)
        {
            _requestBuilder = requestBuilder;
            _halResponseBuilder = halResponseBuilder;
            _serviceRepository = serviceRepository;
            _commentEnricher = commentEnricher;
        }

        public async Task<IActionResult> Execute(string serviceId, JObject jObj)
        {
            if (string.IsNullOrWhiteSpace(serviceId))
            {
                throw new ArgumentNullException(nameof(serviceId));
            }

            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var parameter = _requestBuilder.GetSearchServiceComments(jObj);
            parameter.ServiceId = serviceId;
            var searchResult = await _serviceRepository.Search(parameter);
            _halResponseBuilder.AddLinks(l => l.AddSelf(GetCommentLink(serviceId)));
            if (searchResult != null && searchResult.Content != null)
            {
                var comments = searchResult.Content;
                foreach (var comment in comments)
                {
                    _commentEnricher.Enrich(_halResponseBuilder, comment, parameter.ServiceId);
                }

                double r = (double)searchResult.TotalResults / (double)parameter.Count;
                var nbPages = Math.Ceiling(r);
                nbPages = nbPages == 0 ? 1 : nbPages;
                for (var page = 1; page <= nbPages; page++)
                {
                    _halResponseBuilder.AddLinks(l => l.AddOtherItem("navigation", new Dtos.Link(GetCommentLink(serviceId), page.ToString())));
                }
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private static string GetCommentLink(string serviceId)
        {
            return "/" + Constants.RouteNames.Services + "/" + Constants.RouteNames.SearchComments.Replace("{id}", serviceId);
        }
    }
}
