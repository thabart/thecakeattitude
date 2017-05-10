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

using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using System;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;

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

        public SearchServicesOperation(IServiceRepository repository, IHalResponseBuilder halResponseBuilder, IRequestBuilder requestBuilder)
        {
            _repository = repository;
            _halResponseBuilder = halResponseBuilder;
            _requestBuilder = requestBuilder;
        }

        public async Task<IActionResult> Execute(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }
            
            var parameter = _requestBuilder.GetSearchServices(jObj);
            var searchResult = await _repository.Search(parameter);
            return null;
        }
    }
}
