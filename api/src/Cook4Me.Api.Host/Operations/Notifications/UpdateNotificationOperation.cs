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
using Cook4Me.Api.Core.Commands.Notifications;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Host.Validators;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Notifications
{
    public interface IUpdateNotificationOperation
    {
        Task<IActionResult> Execute(JObject jObj, string id, string subject, string commonId);
    }

    internal class UpdateNotificationOperation : IUpdateNotificationOperation
    {
        private readonly IRequestBuilder _requestBuilder;
        private readonly IUpdateNotificationValidator _updateNotificationValidator;
        private readonly ICommandSender _commandSender;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IControllerHelper _controllerHelper;

        public UpdateNotificationOperation(IRequestBuilder requestBuilder, IUpdateNotificationValidator updateNotificationValidator,
            ICommandSender commandSender, IResponseBuilder responseBuilder, IControllerHelper controllerHelper)
        {
            _requestBuilder = requestBuilder;
            _updateNotificationValidator = updateNotificationValidator;
            _commandSender = commandSender;
            _responseBuilder = responseBuilder;
            _controllerHelper = controllerHelper;
        }

        public async Task<IActionResult> Execute(JObject jObj, string id, string subject, string commonId)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            UpdateNotificationCommand command = null;
            try
            {
                command = _requestBuilder.GetUpdateNotification(jObj);
            }
            catch (ArgumentException ex)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ex.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            command.Id = id;
            command.CommonId = commonId;
            var validationResult = await _updateNotificationValidator.Validate(command, subject);
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
