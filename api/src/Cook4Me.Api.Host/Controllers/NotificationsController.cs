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

using Cook4Me.Api.Host.Handlers;
using Cook4Me.Api.Host.Operations.Notifications;
using Microsoft.AspNetCore.Mvc;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Notifications)]
    public class NotificationsController : BaseController
    {
        private readonly ISearchNotificationsOperation _searchNotificationsOperation;

        public NotificationsController(ISearchNotificationsOperation searchNotificationsOperation,
            IHandlersInitiator handlersInitiator) : base(handlersInitiator)
        {
            _searchNotificationsOperation = searchNotificationsOperation;
        }

        [HttpPost(Constants.RouteNames.Search)]
        public IActionResult Search()
        {
            return null;
        }
    }
}
