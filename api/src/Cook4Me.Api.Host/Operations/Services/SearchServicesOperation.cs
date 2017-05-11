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
    public interface ISearchServicesOperation
    {
        Task<IActionResult> Execute(JObject jObj);
    }

    internal class SearchServicesOperation : ISearchServicesOperation
    {
        private readonly IServiceRepository _repository;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IServiceEnricher _serviceEnricher;

        public SearchServicesOperation(
            IServiceRepository repository, IHalResponseBuilder halResponseBuilder,
            IRequestBuilder requestBuilder, IServiceEnricher serviceEnricher)
        {
            _repository = repository;
            _halResponseBuilder = halResponseBuilder;
            _requestBuilder = requestBuilder;
            _serviceEnricher = serviceEnricher;
        }

        public async Task<IActionResult> Execute(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var parameter = _requestBuilder.GetSearchServices(jObj);
            var searchResult = await _repository.Search(parameter);
            _halResponseBuilder.AddLinks(l => l.AddSelf(GetServicesLink()));
            if (searchResult != null && searchResult.Content != null)
            {
                var services = searchResult.Content;
                foreach (var service in services)
                {
                    _serviceEnricher.Enrich(_halResponseBuilder, service);
                }

                double r = (double)searchResult.TotalResults / (double)parameter.Count;
                var nbPages = Math.Ceiling(r);
                nbPages = nbPages == 0 ? 1 : nbPages;
                for (var page = 1; page <= nbPages; page++)
                {
                    _halResponseBuilder.AddLinks(l => l.AddOtherItem("navigation", new Dtos.Link(GetServicesLink(), page.ToString())));
                }
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private static string GetServicesLink()
        {
            return "/" + Constants.RouteNames.Services + "/" + Constants.RouteNames.Search;
        }
    }
}
