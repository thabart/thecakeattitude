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
using Cook4Me.Api.Host.Builders;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;
using Params = Ups.Client.Params;

namespace Cook4Me.Api.Host.Operations.Ups
{
    public interface IPurchaseUpsLabelOperation
    {
        Task<IActionResult> Execute(JObject jObj);
    }

    internal class PurchaseUpsLabelOperation : IPurchaseUpsLabelOperation
    {
        private readonly IRequestBuilder _requestBuilder;
        private readonly IResponseBuilder _responseBuilder;
        private readonly ICommandSender _commandSender;

        public PurchaseUpsLabelOperation(IRequestBuilder requestBuilder, IResponseBuilder responseBuilder, ICommandSender commandSender)
        {
            _requestBuilder = requestBuilder;
            _responseBuilder = responseBuilder;
            _commandSender = commandSender;
        }

        public Task<IActionResult> Execute(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var command = _requestBuilder.GetBuyUpsLabelCommand(jObj);
            command.Credentials = new Params.UpsCredentials
            {
                LicenseNumber = Constants.UpsCredentials._accessLicenseNumber,
                Password = Constants.UpsCredentials._password,
                UserName = Constants.UpsCredentials._userName
            };
            command.EmailAddress = "habarthierry@hotmail.fr";
            _commandSender.Send(command);
            return Task.FromResult<IActionResult>(null);
        }
    }
}
