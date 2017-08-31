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

using Cook4Me.Api.Core.Commands.Orders;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Extensions;
using Cook4Me.Api.Host.Handlers;
using Cook4Me.Api.Host.Operations.Orders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Orders)]
    public class OrdersController : BaseController
    {
        private readonly ISearchOrdersOperation _searchOrdersOperation;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IUpdateOrderOperation _updateOrderOperation;
        private readonly IDeleteOrderOperation _deleteOrderOperation;

        public OrdersController(ISearchOrdersOperation searchOrdersOperation, IResponseBuilder responseBuilder,
            IUpdateOrderOperation updateOrderOperation, IDeleteOrderOperation deleteOrderOperation,
            IHandlersInitiator handlersInitiator) : base(handlersInitiator)
        {
            _searchOrdersOperation = searchOrdersOperation;
            _responseBuilder = responseBuilder;
            _updateOrderOperation = updateOrderOperation;
            _deleteOrderOperation = deleteOrderOperation;
        }

        [HttpDelete("{id}")]
        [Authorize("Connected")]
        public async Task<IActionResult> DeleteOrder(string id)
        {
            var subject = User.GetSubject();
            if (string.IsNullOrEmpty(subject))
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ErrorDescriptions.TheSubjectCannotBeRetrieved);
                return this.BuildResponse(error, HttpStatusCode.BadRequest);
            }

            return await _deleteOrderOperation.Execute(new RemoveOrderCommand
            {
                CommonId = this.GetCommonId(),
                OrderId = id,
                Subject = subject
            });
        }

        [HttpPut("{id}")]
        [Authorize("Connected")]
        public async Task<IActionResult> UpdateOrder(string id, [FromBody] JObject jObj)
        {
            var subject = User.GetSubject();
            if (string.IsNullOrEmpty(subject))
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ErrorDescriptions.TheSubjectCannotBeRetrieved);
                return this.BuildResponse(error, HttpStatusCode.BadRequest);
            }

            return await _updateOrderOperation.Execute(jObj, id, subject, this.GetCommonId());
        }

        [Authorize("Connected")]
        [HttpPost(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            return await _searchOrdersOperation.Execute(jObj, User.GetSubject());
        }
    }
}