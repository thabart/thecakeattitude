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

using Cook4Me.Api.Core.Commands.ClientService;
using Cook4Me.Api.Host.Extensions;
using Cook4Me.Api.Host.Handlers;
using Cook4Me.Api.Host.Operations.Announcement;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.ClientServices)]
    public class ClientServicesController : BaseController
    {
        private readonly ISearchClientServicesOperation _searchOperation;
        private readonly IGetClientServiceOperation _getOperation;
        private readonly IAddClientServiceOperation _addOperation;
        private readonly IDeleteClientServiceOperation _deleteOperation;
        private readonly IGetMineClientServicesOperation _getMineClientServicesOperation;
        private readonly ISearchMineClientServices _searchMineClientServices;

        public ClientServicesController(
            ISearchClientServicesOperation searchOperation, IGetClientServiceOperation getOperation,
            IAddClientServiceOperation addOperation, IDeleteClientServiceOperation deleteOperation,
            IGetMineClientServicesOperation getMineAnnouncementsOperation, ISearchMineClientServices searchMineAnnouncements,
            IHandlersInitiator handlersInitiator) : base(handlersInitiator)
        {
            _searchOperation = searchOperation;
            _getOperation = getOperation;
            _addOperation = addOperation;
            _deleteOperation = deleteOperation;
            _getMineClientServicesOperation = getMineAnnouncementsOperation;
            _searchMineClientServices = searchMineAnnouncements;
        }

        [HttpPost(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            return await _searchOperation.Execute(jObj);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            return await _getOperation.Execute(id);
        }

        [HttpGet(Constants.RouteNames.Me)]
        [Authorize("Connected")]
        public async Task<IActionResult> GetMineClientServices()
        {
            return await _getMineClientServicesOperation.Execute(User.GetSubject());
        }

        [HttpPost(Constants.RouteNames.SearchMine)]
        [Authorize("Connected")]
        public async Task<IActionResult> SearchMineClientServices([FromBody] JObject jObj)
        {
            return await _searchMineClientServices.Execute(User.GetSubject(), jObj);
        }

        [HttpPost]
        [Authorize("Connected")]
        public async Task<IActionResult> Add([FromBody] JObject jObj)
        {
            return await _addOperation.Execute(jObj, User.GetSubject(), this.GetCommonId());
        }

        [HttpDelete("{id}")]
        [Authorize("Connected")]
        public async Task<IActionResult> Remove(string id)
        {
            return await _deleteOperation.Execute(new RemoveClientServiceCommand
            {
                Subject = User.GetSubject(),
                AnnouncementId = id,
                CommonId = this.GetCommonId()
            });
        }
    }
}
