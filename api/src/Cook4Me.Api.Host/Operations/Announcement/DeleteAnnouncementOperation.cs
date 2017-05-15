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
using System.Threading.Tasks;
using System;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Core.Bus;
using Cook4Me.Api.Core.Commands.Announcement;
using Cook4Me.Api.Host.Validators;

namespace Cook4Me.Api.Host.Operations.Announcement
{
    public interface IDeleteAnnouncementOperation
    {
        Task<IActionResult> Execute(RemoveAnnouncementCommand command);
    }

    internal class DeleteAnnouncementOperation : IDeleteAnnouncementOperation
    {
        private readonly IRemoveAnnouncementValidator _validator;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly ICommandSender _commandSender;

        public DeleteAnnouncementOperation(
            IRemoveAnnouncementValidator validator, IResponseBuilder responseBuilder, IControllerHelper controllerHelper, ICommandSender commandSender)
        {
            _validator = validator;
            _responseBuilder = responseBuilder;
            _controllerHelper = controllerHelper;
            _commandSender = commandSender;
        }

        public async Task<IActionResult> Execute(RemoveAnnouncementCommand command)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }


            var validationResult = await _validator.Validate(command);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Server, validationResult.Message);
                return _controllerHelper.BuildResponse(System.Net.HttpStatusCode.BadRequest, error);
            }

            _commandSender.Send(command);
            return new OkResult();
        }
    }
}
