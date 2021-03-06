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

using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Net;
using System.Threading.Tasks;
using Ups.Client;
using client = Ups.Client;

namespace Cook4Me.Api.Host.Operations.Ups
{
    public interface IGetLocationsOperation
    {
        Task<IActionResult> Execute(JObject parameter);   
    }

    internal class GetLocationsOperation : IGetLocationsOperation
    {
        private readonly IUpsClient _upsClient;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IControllerHelper _controllerHelper;

        public GetLocationsOperation(IUpsClient upsClient, IRequestBuilder requestBuilder, IResponseBuilder responseBuilder, IControllerHelper controllerHelper)
        {
            _upsClient = upsClient;
            _requestBuilder = requestBuilder;
            _responseBuilder = responseBuilder;
            _controllerHelper = controllerHelper;
        }

        public async Task<IActionResult> Execute(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var searchUpsLocations = _requestBuilder.GetLocationsParameter(jObj);
            searchUpsLocations.Credentials = new client.Params.UpsCredentials
            {
                LicenseNumber = Constants.UpsCredentials._accessLicenseNumber,
                UserName = Constants.UpsCredentials._userName,
                Password = Constants.UpsCredentials._password
            };
            var result = await _upsClient.GetLocations(searchUpsLocations);
            if (result.Response != null && result.Response.Error != null)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, result.Response.Error.ErrorDescription);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            return new OkObjectResult(_responseBuilder.GetUpsLocations(result));
        }
    }
}
