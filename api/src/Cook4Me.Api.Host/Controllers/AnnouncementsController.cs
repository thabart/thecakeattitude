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

using Cook4Me.Api.Core.Commands.Announcement;
using Cook4Me.Api.Host.Extensions;
using Cook4Me.Api.Host.Handlers;
using Cook4Me.Api.Host.Operations.Announcement;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Announcements)]
    public class AnnouncementsController : BaseController
    {
        private readonly ISearchAnnouncementsOperation _searchOperation;
        private readonly IGetAnnouncementOperation _getOperation;
        private readonly IAddAnnouncementOperation _addOperation;
        private readonly IDeleteAnnouncementOperation _deleteOperation;
        private readonly IGetMineAnnouncementsOperation _getMineAnnouncementsOperation;
        private readonly ISearchMineAnnouncements _searchMineAnnouncements;

        public AnnouncementsController(
            ISearchAnnouncementsOperation searchOperation, IGetAnnouncementOperation getOperation,
            IAddAnnouncementOperation addOperation, IDeleteAnnouncementOperation deleteOperation,
            IGetMineAnnouncementsOperation getMineAnnouncementsOperation, ISearchMineAnnouncements searchMineAnnouncements,
            IHandlersInitiator handlersInitiator) : base(handlersInitiator)
        {
            _searchOperation = searchOperation;
            _getOperation = getOperation;
            _addOperation = addOperation;
            _deleteOperation = deleteOperation;
            _getMineAnnouncementsOperation = getMineAnnouncementsOperation;
            _searchMineAnnouncements = searchMineAnnouncements;
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
        public async Task<IActionResult> GetMineAnnouncements()
        {
            return await _getMineAnnouncementsOperation.Execute(User.GetSubject());
        }

        [HttpPost(Constants.RouteNames.SearchMine)]
        [Authorize("Connected")]
        public async Task<IActionResult> SearchMineAnnouncements([FromBody] JObject jObj)
        {
            return await _searchMineAnnouncements.Execute(User.GetSubject(), jObj);
        }

        [HttpPost]
        [Authorize("Connected")]
        public async Task<IActionResult> Add([FromBody] JObject jObj)
        {
            return await _addOperation.Execute(jObj, User.GetSubject());
        }

        [HttpDelete("{id}")]
        [Authorize("Connected")]
        public async Task<IActionResult> Remove(string id)
        {
            return await _deleteOperation.Execute(new RemoveAnnouncementCommand
            {
                Subject = User.GetSubject(),
                AnnouncementId = id,
                CommonId = this.GetCommonId()
            });
        }
    }
}
