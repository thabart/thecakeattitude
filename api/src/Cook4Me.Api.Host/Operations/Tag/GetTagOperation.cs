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
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Tag
{
    public interface IGetTagOperation
    {
        Task<IActionResult> Execute(string id);
    }

    internal class GetTagOperation : IGetTagOperation
    {
        private readonly ITagRepository _repository;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IRequestBuilder _requestBuilder;
        private readonly ITagEnricher _tagEnricher;

        public GetTagOperation(
            ITagRepository repository, IHalResponseBuilder halResponseBuilder,
            IRequestBuilder requestBuilder, ITagEnricher tagEnricher)
        {
            _repository = repository;
            _halResponseBuilder = halResponseBuilder;
            _requestBuilder = requestBuilder;
            _tagEnricher = tagEnricher;
        }

        public async Task<IActionResult> Execute(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var service = await _repository.Get(id);
            if (service == null)
            {
                return new NotFoundResult();
            }

            _halResponseBuilder.AddLinks(l => l.AddSelf(GetTagLink(id)));
            _tagEnricher.Enrich(_halResponseBuilder, service);
            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private static string GetTagLink(string id)
        {
            return "/" + Constants.RouteNames.Tags + "/" + id;
        }
    }
}
