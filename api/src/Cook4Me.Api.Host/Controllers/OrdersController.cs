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
using Cook4Me.Api.Host.Handlers;
using Cook4Me.Api.Host.Operations.Orders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Orders)]
    public class OrdersController : BaseController
    {
        public ISearchOrdersOperation _searchOrdersOperation;

        public OrdersController(ISearchOrdersOperation searchOrdersOperation,
            IHandlersInitiator handlersInitiator) : base(handlersInitiator)
        {
            _searchOrdersOperation = searchOrdersOperation;
        }

        [Authorize("Connected")]
        [HttpPost(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            return await _searchOrdersOperation.Execute(jObj, User.GetSubject());
        }
    }
}
