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

using Cook4Me.Api.Host.Extensions;
using Cook4Me.Api.Host.Handlers;
using Cook4Me.Api.Host.Operations.Notifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Notifications)]
    public class NotificationsController : BaseController
    {
        private readonly ISearchNotificationsOperation _searchNotificationsOperation;
        private readonly IUpdateNotificationOperation _updateNotificationOperation;
        private readonly IGetNotificationStatusOperation _getNotificationStatusOperation;

        public NotificationsController(ISearchNotificationsOperation searchNotificationsOperation, IUpdateNotificationOperation updateNotificationOperation,
            IGetNotificationStatusOperation getNotificationStatusOperation, IHandlersInitiator handlersInitiator) : base(handlersInitiator)
        {
            _searchNotificationsOperation = searchNotificationsOperation;
            _updateNotificationOperation = updateNotificationOperation;
            _getNotificationStatusOperation = getNotificationStatusOperation;
        }

        [HttpPost(Constants.RouteNames.Search)]
        [Authorize("Connected")]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            return await _searchNotificationsOperation.Execute(jObj, User.GetSubject());
        }

        [HttpPut("{id}")]
        [Authorize("Connected")]
        public async Task<IActionResult> Update(string id, [FromBody] JObject jObj)
        {
            return await _updateNotificationOperation.Execute(jObj, id, User.GetSubject(), this.GetCommonId());
        }

        [HttpPost(Constants.RouteNames.Status)]
        [Authorize("Connected")]
        public async Task<IActionResult> Status([FromBody] JObject jObj)
        {
            return await _getNotificationStatusOperation.Execute(jObj, User.GetSubject());
        }
    }
}
