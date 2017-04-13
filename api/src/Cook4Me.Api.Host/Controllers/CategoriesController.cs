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
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;
using Cook4Me.Api.Core.Parameters;
using System;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Categories)]
    public class CategoriesController : Controller
    {
        private readonly ICategoryRepository _repository;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IHalResponseBuilder _halResponseBuilder;

        public CategoriesController(ICategoryRepository repository, IResponseBuilder responseBuilder, IHalResponseBuilder halResponseBuilder)
        {
            _repository = repository;
            _responseBuilder = responseBuilder;
            _halResponseBuilder = halResponseBuilder;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var categories = await _repository.GetAll();
            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Categories));
            foreach(var category in categories)
            {
                _halResponseBuilder.AddEmbedded(e => e.AddObject(_responseBuilder.GetCategory(category), (l) => l.AddSelf(@"/"+Constants.RouteNames.Categories+"/"+category.Id)));
            }
            
            return new OkObjectResult(_halResponseBuilder.Build());
        }

        [HttpGet(Constants.RouteNames.Parents)]
        public async Task<IActionResult> GetAllParents()
        {
            var categories = (await _repository.Search(new SearchCategoriesParameter { ParentId = null })).Select(c => _responseBuilder.GetCategory(c));
            return new OkObjectResult(categories);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var category = await _repository.Get(id);
            if (category == null)
            {
                return new NotFoundResult();
            }

            return new OkObjectResult(_responseBuilder.GetCategory(category));
        }
    }
}
