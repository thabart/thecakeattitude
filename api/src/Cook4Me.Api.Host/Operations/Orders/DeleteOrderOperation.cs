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
using Cook4Me.Api.Core.Commands.Orders;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Host.Validators;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Orders
{
    public interface IDeleteOrderOperation
    {
        Task<IActionResult> Execute(RemoveOrderCommand removeOrderCommand);
    }

    internal class DeleteOrderOperation : IDeleteOrderOperation
    {
        private readonly IResponseBuilder _responseBuilder;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly IRemoveOrderValidator _removeOrderValidator;
        private readonly IHostingEnvironment _env;
        private readonly ICommandSender _commandSender;

        public DeleteOrderOperation(IResponseBuilder responseBuilder, IRequestBuilder requestBuilder,
            IControllerHelper controllerHelper, IRemoveOrderValidator removeOrderValidator,
            IHostingEnvironment env, ICommandSender commandSender)
        {
            _responseBuilder = responseBuilder;
            _requestBuilder = requestBuilder;
            _controllerHelper = controllerHelper;
            _removeOrderValidator = removeOrderValidator;
            _env = env;
            _commandSender = commandSender;
        }

        public async Task<IActionResult> Execute(RemoveOrderCommand removeOrderCommand)
        {
            if (removeOrderCommand == null)
            {
                throw new ArgumentNullException(nameof(removeOrderCommand));
            }

            var validationResult = await _removeOrderValidator.Validate(removeOrderCommand);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Server, validationResult.Message);
                return _controllerHelper.BuildResponse(System.Net.HttpStatusCode.BadRequest, error);
            }

            _commandSender.Send(removeOrderCommand);
            return new OkResult();
        }
    }
}
