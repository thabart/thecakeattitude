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

using Cook4Me.Api.Core.Models;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Host.Validators;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations
{
    public interface IAddShopOperation
    {

    }

    internal class AddShopOperation : IAddShopOperation
    {
        private readonly IResponseBuilder _responseBuilder;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly IAddShopValidator _addShopValidator;

        public AddShopOperation(IResponseBuilder responseBuilder, IRequestBuilder requestBuilder, IControllerHelper controllerHelper, IAddShopValidator addShopValidator)
        {
            _responseBuilder = responseBuilder;
            _requestBuilder = requestBuilder;
            _controllerHelper = controllerHelper;
            _addShopValidator = addShopValidator;
        }

        public async Task<IActionResult> Execute(JObject obj, string subject)
        {
            if (obj == null)
            {
                throw new ArgumentNullException(nameof(obj));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            Shop addShopParameter = null;
            try
            {
                addShopParameter = _requestBuilder.GetAddShop(obj);
            }
            catch (ArgumentException ex)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ex.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }
            
            var validationResult = await _addShopValidator.Validate(addShopParameter, subject);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            return null;
        }
    }
}
