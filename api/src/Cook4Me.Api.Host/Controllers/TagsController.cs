﻿#region copyright
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

using Cook4Me.Api.Host.Handlers;
using Cook4Me.Api.Host.Operations.Tag;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Tags)]
    public class TagsController : BaseController
    {
        private readonly ISearchTagsOperation _searchTagsOperation;
        private readonly IGetAllTagsOperation _getAllTagsOperation;
        private readonly IGetTagOperation _getTagOperation;

        public TagsController(ISearchTagsOperation searchTagsOperation, IGetAllTagsOperation getAllTagsOperation, IGetTagOperation getTagOperation, IHandlersInitiator handlersInitiator) : base(handlersInitiator)
        {
            _searchTagsOperation = searchTagsOperation;
            _getAllTagsOperation = getAllTagsOperation;
            _getTagOperation = getTagOperation;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            return await _getTagOperation.Execute(id);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return await _getAllTagsOperation.Execute();
        }

        [HttpPost(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            return await _searchTagsOperation.Execute(jObj);
        }
    }
}
