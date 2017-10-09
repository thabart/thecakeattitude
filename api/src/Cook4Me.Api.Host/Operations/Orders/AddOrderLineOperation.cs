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

using Cook4Me.Api.Core.Bus;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Host.Validators;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Orders
{
    public interface IAddOrderLineOperation
    {
        Task<IActionResult> Execute(JObject jObj, string subject, string commonId);
    }

    internal class AddOrderLineOperation : IAddOrderLineOperation
    {
        private readonly ICommandSender _commandSender;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IAddOrderLineValidator _validator;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IControllerHelper _controllerHelper;

        public AddOrderLineOperation(ICommandSender commandSender, IRequestBuilder requestBuilder, IAddOrderLineValidator validator,
            IResponseBuilder responseBuilder, IControllerHelper controllerHelper)
        {
            _commandSender = commandSender;
            _requestBuilder = requestBuilder;
            _validator = validator;
            _responseBuilder = responseBuilder;
            _controllerHelper = controllerHelper;
        }

        public async Task<IActionResult> Execute(JObject jObj, string subject, string commonId)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var command = _requestBuilder.GetAddOrderLine(jObj);
            command.Subject = subject;
            command.CommonId = commonId;
            command.Quantity = 1;
            var validationResult = await _validator.Execute(command);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            command.Id = Guid.NewGuid().ToString();
            _commandSender.Send(command);
            var obj = new { id = command.Id };
            return new OkObjectResult(obj);
        }
    }
}
