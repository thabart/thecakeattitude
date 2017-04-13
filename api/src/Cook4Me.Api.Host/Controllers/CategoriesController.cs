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
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Dtos;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

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
                AddCategory(_halResponseBuilder, _responseBuilder, category);
            }
            
            return new OkObjectResult(_halResponseBuilder.Build());
        }

        [HttpGet(Constants.RouteNames.Parents)]
        public async Task<IActionResult> GetAllParents()
        {
            var categories = await _repository.Search(new SearchCategoriesParameter { ParentId = null });
            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Categories + "/" + Constants.RouteNames.Parents));
            foreach(var category in categories)
            {
                AddCategory(_halResponseBuilder, _responseBuilder, category);
            }

            return new OkObjectResult(_halResponseBuilder.Build());
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

            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Categories + "/" + id)).AddEmbedded(e => e.AddObject(_responseBuilder.GetCategory(category)));
            if (category.Children != null && category.Children.Any())
            {
                foreach(var child in category.Children)
                {
                    _halResponseBuilder.AddLinks(l => l.AddItem(new Link("/" + Constants.RouteNames.Categories + "/" + child.Id, child.Name)));
                }
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private void AddCategory(IHalResponseBuilder halResponseBuilder, IResponseBuilder responseBuilder, Category category)
        {
            halResponseBuilder.AddEmbedded(e => e.AddObject(responseBuilder.GetCategory(category), (l) => l.AddSelf(@"/" + Constants.RouteNames.Categories + "/" + category.Id)));
        }
    }
}
