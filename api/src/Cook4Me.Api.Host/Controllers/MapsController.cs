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
    [Route(Constants.RouteNames.Maps)]
    public class MapsController : Controller
    {
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IMapRepository _repository;

        public MapsController(IHalResponseBuilder halResponseBuilder, IResponseBuilder responseBuilder, IMapRepository repository)
        {
            _halResponseBuilder = halResponseBuilder;
            _responseBuilder = responseBuilder;
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var maps = await _repository.GetAll();
            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Maps));
            foreach (var map in maps)
            {
                AddMap(_halResponseBuilder, _responseBuilder, map);
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

            var map = await _repository.Get(id);
            if (map == null)
            {
                return new NotFoundResult();
            }

            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Maps + "/" + id)).AddEmbedded(e => e.AddObject(_responseBuilder.GetMap(map)));
            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private void AddMap(IHalResponseBuilder halResponseBuilder, IResponseBuilder responseBuilder, Map map)
        {
            halResponseBuilder.AddEmbedded(e => e.AddObject(responseBuilder.GetMap(map), (l) => l.AddSelf(@"/" + Constants.RouteNames.Maps + "/" + map.MapName)));
        }
    }
}
