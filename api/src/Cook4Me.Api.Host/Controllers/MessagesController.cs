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

using Cook4Me.Api.Host.Extensions;
using Cook4Me.Api.Host.Operations.Messages;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Messages)]
    public class MessagesController : Controller
    {
        private readonly IGetMessageOperation _getMessageOperation;
        private readonly IAddMessageOperation _addMessageOperation;
        private readonly ISearchMessagesOperation _searchMessagesOperation;

        public MessagesController(IGetMessageOperation getMessageOperation, IAddMessageOperation addMessageOperation, ISearchMessagesOperation searchMessagesOperation)
        {
            _getMessageOperation = getMessageOperation;
            _addMessageOperation = addMessageOperation;
            _searchMessagesOperation = searchMessagesOperation;
        }

        [HttpPost(Constants.RouteNames.Search)]
        [Authorize("Connected")]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            return await _searchMessagesOperation.Execute(jObj, User.GetSubject());
        }
        
        [HttpPost]
        [Authorize("Connected")]
        public async Task<IActionResult> Add([FromBody] JObject jObj)
        {
            return await _addMessageOperation.Execute(jObj, User.GetSubject(), this.GetCommonId());
        }

        [HttpGet("{id}")]
        [Authorize("Connected")]
        public async Task<IActionResult> Get(string id)
        {
            return await _getMessageOperation.Execute(id, User.GetSubject());
        }
    }
}
