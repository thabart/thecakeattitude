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
    public interface ITrackOrderOperation
    {
        Task<IActionResult> Execute(string orderId, string subject);
    }

    internal class TrackOrderOperation : ITrackOrderOperation
    {
        private readonly ITrackOrderValidator _validator;
        private readonly IControllerHelper _controllerHelper;
        private readonly IResponseBuilder _responseBuilder;
        private readonly ISettingsProvider _settingsProvider;
        private readonly IUpsClient _upsClient;

        public TrackOrderOperation(ITrackOrderValidator validator, IControllerHelper controllerHelper, IResponseBuilder responseBuilder, ISettingsProvider settingsProvider, IUpsClient upsClient)
        {
            _validator = validator;
            _controllerHelper = controllerHelper;
            _responseBuilder = responseBuilder;
            _settingsProvider = settingsProvider;
            _upsClient = upsClient;
        }

        public async Task<IActionResult> Execute(string orderId, string subject)
        {
            if (string.IsNullOrWhiteSpace(orderId))
            {
                throw new ArgumentNullException(nameof(orderId));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }
            
            var validationResult = await _validator.Validate(orderId, subject);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            var track = await _upsClient.Track(validationResult.Order.TrackingNumber,
                new UpsCredentials
                {
                    LicenseNumber = _settingsProvider.GetUpsLicenseNumber(),
                    Password = _settingsProvider.GetUpsPassword(),
                    UserName = _settingsProvider.GetUpsUsername()
                }
            );

            if (track.Response.ResponseStatusCode == "0")
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, track.Response.Error.ErrorDescription);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            return new OkObjectResult(_responseBuilder.GetUpsTrack(track));
        }
    }
}
