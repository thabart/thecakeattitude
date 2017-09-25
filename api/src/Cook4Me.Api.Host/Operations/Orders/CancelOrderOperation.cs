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
using Cook4Me.Common;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Threading.Tasks;
using Ups.Client;
using Ups.Client.Params;

namespace Cook4Me.Api.Host.Operations.Orders
{
    public interface ICancelOrderOperation
    {
        Task<IActionResult> Execute(string id, string subject);
    }

    public class CancelOrderOperation : ICancelOrderOperation
    {
        private readonly ICancelOrderValidator _validator;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly IResponseBuilder _responseBuilder;
        private readonly ISettingsProvider _settingsProvider;
        private readonly ICommandSender _commandSender;
        private readonly IUpsClient _upsClient;

        public CancelOrderOperation(IRequestBuilder requestBuilder, IControllerHelper controllerHelper, IResponseBuilder responseBuilder, 
            IUpsClient upsClient, ISettingsProvider settingsProvider, ICancelOrderValidator validator,
            ICommandSender commandSender)
        {
            _validator = validator;
            _requestBuilder = requestBuilder;
            _controllerHelper = controllerHelper;
            _responseBuilder = responseBuilder;
            _settingsProvider = settingsProvider;
            _commandSender = commandSender;
            _upsClient = upsClient;
        }

        public async Task<IActionResult> Execute(string id, string subject)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var validationResult = await _validator.Validate(id, subject);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }
            
            if (!string.IsNullOrWhiteSpace(validationResult.Order.TrackingNumber))
            {
                var cancel = await _upsClient.Cancel(validationResult.Order.TrackingNumber,
                new UpsCredentials
                {
                    LicenseNumber = _settingsProvider.GetUpsLicenseNumber(),
                    Password = _settingsProvider.GetUpsPassword(),
                    UserName = _settingsProvider.GetUpsUsername()
                });
                if (cancel.Response.ResponseStatusCode == "0")
                {
                    var error = _responseBuilder.GetError(ErrorCodes.Request, cancel.Response.Error.ErrorDescription);
                    return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
                }
            }

            _commandSender.Send(new CancelOrderCommand
            {
                OrderId = id
            });
            return new OkResult();
        }
    }
}
