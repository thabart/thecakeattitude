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

using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Enrichers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Announcement
{
    public interface IGetMineClientServicesOperation
    {
        Task<IActionResult> Execute(string subject);
    }

    internal class GetMineClientServicesOperation : IGetMineClientServicesOperation
    {
        private readonly IClientServiceRepository _repository;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IClientServiceEnricher _enricher;

        public GetMineClientServicesOperation(
            IClientServiceRepository repository, IHalResponseBuilder halResponseBuilder, 
            IRequestBuilder requestBuilder, IClientServiceEnricher enricher)
        {
            _repository = repository;
            _halResponseBuilder = halResponseBuilder;
            _requestBuilder = requestBuilder;
            _enricher = enricher;
        }

        public async Task<IActionResult> Execute(string subject)
        {
            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var announces = await _repository.Search(new SearchClientServicesParameter
            {
                Subjects = new [] { subject }
            });
            _halResponseBuilder.AddLinks(l => l.AddSelf(GetAnnouncementLink()));
            if (announces.TotalResults > 0)
            {
                foreach (var announce in announces.Content)
                {
                    _enricher.Enrich(_halResponseBuilder, announce);
                }
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private static string GetAnnouncementLink()
        {
            return "/" + Constants.RouteNames.ClientServices + "/" + Constants.RouteNames.Me;
        }
    }
}
