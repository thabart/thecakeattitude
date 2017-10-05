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
using Cook4Me.Api.Core.Commands.Discount;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Host.Validators;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Net;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Discount
{
    public interface IAddDiscountOperation
    {
        Task<IActionResult> Execute(JObject jObj, string subject, string commonId);
    }
    
    internal class AddDiscountOperation : IAddDiscountOperation
    {
        private readonly IAddDiscountValidator _validator;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly ICommandSender _commandSender;

        public AddDiscountOperation(IAddDiscountValidator validator, IRequestBuilder requestBuilder, IResponseBuilder responseBuilder, IControllerHelper controllerHelper, ICommandSender commandSender)
        {
            _validator = validator;
            _requestBuilder = requestBuilder;
            _responseBuilder = responseBuilder;
            _controllerHelper = controllerHelper;
            _commandSender = commandSender;
        }

        public async Task<IActionResult> Execute(JObject jObj, string subject, string commonId)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }


            AddDiscountCommand command = null;
            try
            {
                command = _requestBuilder.GetAddDiscountCommand(jObj);
            }
            catch (ArgumentException ex)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ex.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }


            var validationResult = await _validator.Validate(command, subject);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            command.CommonId = commonId;
            command.Subject = subject;
            _commandSender.Send(command);
            return new OkResult();
        }
    }
}
