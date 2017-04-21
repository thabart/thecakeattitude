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
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Tags)]
    public class TagsController : Controller
    {
        private readonly ITagRepository _repository;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IRequestBuilder _requestBuilder;

        public TagsController(ITagRepository repository, IResponseBuilder responseBuilder, IHalResponseBuilder halResponseBuilder, IRequestBuilder requestBuilder)
        {
            _repository = repository;
            _responseBuilder = responseBuilder;
            _halResponseBuilder = halResponseBuilder;
            _requestBuilder = requestBuilder;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var tags = await _repository.GetAll();
            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Tags));
            foreach (var category in tags)
            {
                AddTag(_halResponseBuilder, _responseBuilder, category);
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        [HttpPost(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            var request = _requestBuilder.GetSearchTags(jObj);
            var tags = await _repository.Search(request);
            if (!tags.Any())
            {
                return new NotFoundResult();
            }

            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Tags + "/" + Constants.RouteNames.Search));
            foreach (var tag in tags)
            {
                AddTag(_halResponseBuilder, _responseBuilder, tag);
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private void AddTag(IHalResponseBuilder halResponseBuilder, IResponseBuilder responseBuilder, Tag tag)
        {
            halResponseBuilder.AddEmbedded(e => e.AddObject(responseBuilder.GetTag(tag), (l) => l.AddSelf(@"/" + Constants.RouteNames.Tags + "/" + tag.Name)));
        }
    }
}
