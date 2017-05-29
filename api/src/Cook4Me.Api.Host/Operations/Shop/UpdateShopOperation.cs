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

using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using System;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Microsoft.AspNetCore.Hosting;
using Cook4Me.Api.Core.Bus;
using Cook4Me.Api.Host.Validators;
using Cook4Me.Api.Core.Commands.Shop;
using System.Net;

namespace Cook4Me.Api.Host.Operations.Shop
{
    public interface IUpdateShopOperation
    {
        Task<IActionResult> Execute(JObject jObj, string subject);
    }

    internal class UpdateShopOperation : IUpdateShopOperation
    {
        private readonly IResponseBuilder _responseBuilder;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly IUpdateShopValidator _updateShopValidator;
        private readonly IHostingEnvironment _env;
        private readonly ICommandSender _commandSender;

        public UpdateShopOperation(IResponseBuilder responseBuilder, IRequestBuilder requestBuilder,
            IControllerHelper controllerHelper, IUpdateShopValidator updateShopValidator,
            IHostingEnvironment env, ICommandSender commandSender)
        {
            _responseBuilder = responseBuilder;
            _requestBuilder = requestBuilder;
            _controllerHelper = controllerHelper;
            _updateShopValidator = updateShopValidator;
            _env = env;
            _commandSender = commandSender;
        }

        public async Task<IActionResult> Execute(JObject jObj, string subject)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            // 1. Check the request
            UpdateShopCommand command = null;
            try
            {
                command = _requestBuilder.GetUpdateShop(jObj);
            }
            catch (ArgumentException ex)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ex.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            command.UpdateDateTime = DateTime.UtcNow;
            var validationResult = await _updateShopValidator.Validate(command, subject);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }            
            
            _commandSender.Send(command);
            return new OkResult();
        }
    }
}
