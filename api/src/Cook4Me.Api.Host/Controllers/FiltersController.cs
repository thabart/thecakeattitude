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

using Cook4Me.Api.Core.Models;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Filers)]
    public class FiltersController : Controller
    {
        private readonly IFilterRepository _repository;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IHalResponseBuilder _halResponseBuilder;

        public FiltersController(
            IFilterRepository repository, IRequestBuilder requestBuilder, 
            IResponseBuilder responseBuilder, IHalResponseBuilder halResponseBuilder)
        {
            _repository = repository;
            _requestBuilder = requestBuilder;
            _responseBuilder = responseBuilder;
            _halResponseBuilder = halResponseBuilder;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Index(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var record = await _repository.Get(id);
            if (record == null)
            {
                return new NotFoundResult();
            }

            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Filers + "/" + id));
            AddFilter(_halResponseBuilder, _responseBuilder, record);
            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private void AddFilter(IHalResponseBuilder halResponseBuilder, IResponseBuilder responseBuilder, Filter filter)
        {
            _halResponseBuilder.AddEmbedded(e => e.AddObject(_responseBuilder.GetFilter(filter),
                (l) => l.AddOtherItem("shop", new Dtos.Link("/" + Constants.RouteNames.Shops + "/" + filter.ShopId)).AddSelf(Constants.RouteNames.Filers + "/" + filter.Id)));
        }
    }
}
