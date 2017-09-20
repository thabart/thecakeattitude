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
using Cook4Me.Api.Core.Bus;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Core.Commands.Orders;
using System.Net;
using Cook4Me.Api.Host.Validators;

namespace Cook4Me.Api.Host.Operations.Orders
{
    public interface IConfirmOrderPurchaseOperation
    {
        Task<IActionResult> Execute(string orderId, string subject, string commonId, JObject jObj);
    }

    internal class ConfirmOrderPurchaseOperation : IConfirmOrderPurchaseOperation
    {
        private readonly IRequestBuilder _requestBuilder;
        private readonly IResponseBuilder _responseBuilder;
        private readonly ICommandSender _commandSender;
        private readonly IControllerHelper _controllerHelper;
        private readonly IAcceptOrderTransactionValidator _validator;

        public ConfirmOrderPurchaseOperation(IRequestBuilder requestBuilder, IResponseBuilder responseBuilder, ICommandSender commandSender, IControllerHelper controllerHelper,
            IAcceptOrderTransactionValidator validator)
        {
            _requestBuilder = requestBuilder;
            _responseBuilder = responseBuilder;
            _commandSender = commandSender;
            _controllerHelper = controllerHelper;
            _validator = validator;
        }

        public async Task<IActionResult> Execute(string orderId, string subject, string commonId, JObject jObj)
        {
            if (string.IsNullOrWhiteSpace(orderId))
            {
                throw new ArgumentNullException(nameof(orderId));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            AcceptOrderTransactionCommand command = null;
            try
            {
                command = _requestBuilder.GetAcceptOrderTransactionCommand(jObj);
            }
            catch (ArgumentException ex)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ex.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            command.OrderId = orderId;
            command.CommonId = commonId;
            var validationResult = await _validator.Validate(command, subject);
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
