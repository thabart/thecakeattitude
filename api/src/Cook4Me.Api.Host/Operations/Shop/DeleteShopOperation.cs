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

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Cook4Me.Api.Core.Commands.Shop;
using Cook4Me.Api.Host.Validators;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Core.Bus;

namespace Cook4Me.Api.Host.Operations.Shop
{
    public interface IDeleteShopOperation
    {
        Task<IActionResult> Execute(RemoveShopCommand removeShopCommand);
    }

    internal class DeleteShopOperation : IDeleteShopOperation
    {
        private readonly IRemoveShopValidator _validator;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly ICommandSender _commandSender;

        public DeleteShopOperation(IRemoveShopValidator validator, IResponseBuilder responseBuilder, IControllerHelper controllerHelper, ICommandSender commandSender)
        {
            _validator = validator;
            _responseBuilder = responseBuilder;
            _controllerHelper = controllerHelper;
            _commandSender = commandSender;
        }

        public async Task<IActionResult> Execute(RemoveShopCommand removeShopCommand)
        {
            if (removeShopCommand == null)
            {
                throw new ArgumentNullException(nameof(removeShopCommand));
            }

            var validationResult = await _validator.Validate(removeShopCommand);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Server, validationResult.Message);
                return _controllerHelper.BuildResponse(System.Net.HttpStatusCode.BadRequest, error);
            }

            _commandSender.Send(removeShopCommand);
            return new OkResult();
        }
    }
}
