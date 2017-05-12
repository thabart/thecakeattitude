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

using Cook4Me.Api.Core.Commands.Service;
using Cook4Me.Api.Host.Extensions;
using Cook4Me.Api.Host.Operations.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Services)]
    public class ServicesController : Controller
    {
        private readonly ISearchServiceOccurrencesOperation _searchServiceOccurrencesOperation;
        private readonly ISearchServicesOperation _searchServicesOperation;
        private readonly IGetServiceOperation _getServiceOperation;
        private readonly ISearchServiceCommentsOperation _searchServiceCommentsOperation;
        private readonly IRemoveServiceCommentOperation _removeServiceCommentOperation;
        private readonly IAddServiceCommentOperation _addServiceCommentOperation;

        public ServicesController(
            ISearchServiceOccurrencesOperation searchServiceOccurrencesOperation, ISearchServicesOperation searchServicesOperation,
            IGetServiceOperation getServiceOperation, ISearchServiceCommentsOperation searchServiceCommentsOperation, 
            IRemoveServiceCommentOperation removeServiceCommentOperation, IAddServiceCommentOperation addServiceCommentOperation)
        {
            _searchServiceOccurrencesOperation = searchServiceOccurrencesOperation;
            _searchServicesOperation = searchServicesOperation;
            _getServiceOperation = getServiceOperation;
            _searchServiceCommentsOperation = searchServiceCommentsOperation;
            _removeServiceCommentOperation = removeServiceCommentOperation;
            _addServiceCommentOperation = addServiceCommentOperation;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetService(string id)
        {
            return await _getServiceOperation.Execute(id);
        }

        [HttpPost(Constants.RouteNames.SearchOccurrences)]
        public async Task<IActionResult> SearchOccurrences([FromBody] JObject jObj)
        {
            return await _searchServiceOccurrencesOperation.Execute(jObj);
        }

        [HttpPost(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            return await _searchServicesOperation.Execute(jObj);
        }

        [HttpPost(Constants.RouteNames.SearchComments)]
        public async Task<IActionResult> SearchComments(string id, [FromBody] JObject jObj)
        {
            return await _searchServiceCommentsOperation.Execute(id, jObj);
        }

        [HttpPost(Constants.RouteNames.Comments)]
        [Authorize("Connected")]
        public async Task<IActionResult> AddComment([FromBody] JObject jObj)
        {
            return await _addServiceCommentOperation.Execute(jObj, User.GetSubject());
        }

        [HttpDelete(Constants.RouteNames.RemoveComment)]
        [Authorize("Connected")]
        public async Task<IActionResult> RemoveComment(string id, string subid)
        {
            return await _removeServiceCommentOperation.Execute(new RemoveServiceCommentCommand
            {
                CommentId = subid,
                Subject = User.GetSubject(),
                ServiceId = id
            });
        }
    }
}
