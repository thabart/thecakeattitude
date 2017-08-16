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
using Cook4Me.Api.Core.Commands.Messages;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Host.Validators;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Messages
{
    public interface IAddMessageOperation
    {
        Task<IActionResult> Execute(JObject obj, string subject, string commonId);
    }

    internal class AddMessageOperation : IAddMessageOperation
    {
        private readonly IResponseBuilder _responseBuilder;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IAddMessageValidator _addMessageValidator;
        private readonly ICommandSender _commandSender;
        private readonly IControllerHelper _controllerHelper;

        public AddMessageOperation(IResponseBuilder responseBuilder, IRequestBuilder requestBuilder,
            IAddMessageValidator addMessageValidator, ICommandSender commandSender, IControllerHelper controllerHelper)
        {
            _responseBuilder = responseBuilder;
            _requestBuilder = requestBuilder;
            _addMessageValidator = addMessageValidator;
            _commandSender = commandSender;
            _controllerHelper = controllerHelper;
        }

        public async Task<IActionResult> Execute(JObject obj, string subject, string commonId)
        {
            if (obj == null)
            {
                throw new ArgumentNullException(nameof(obj));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            // 1. Check the request
            AddMessageCommand command = null;
            try
            {
                command = _requestBuilder.GetAddMessage(obj);
            }
            catch (ArgumentException ex)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ex.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            command.From = subject;
            var validationResult = await _addMessageValidator.Validate(command);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            command.Id = Guid.NewGuid().ToString();
            command.CreateDateTime = DateTime.UtcNow;
            command.CommonId = commonId;

            // 2. Send the command.
            var res = new { id = command.Id };
            _commandSender.Send(command);
            return new OkObjectResult(res);
        }
    }
}
