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

using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.Core.Bus;
using Cook4Me.Api.Core.Commands.Shop;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Host.Validators;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Shop
{
    public interface IAddShopOperation
    {
        Task<IActionResult> Execute(JObject obj, string subject);
    }

    internal class AddShopOperation : IAddShopOperation
    {
        private readonly IResponseBuilder _responseBuilder;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly IAddShopValidator _addShopValidator;
        private readonly IHostingEnvironment _env;
        private readonly ICommandSender _commandSender;

        public AddShopOperation(IResponseBuilder responseBuilder, IRequestBuilder requestBuilder, 
            IControllerHelper controllerHelper, IAddShopValidator addShopValidator,
            IHostingEnvironment env, ICommandSender commandSender)
        {
            _responseBuilder = responseBuilder;
            _requestBuilder = requestBuilder;
            _controllerHelper = controllerHelper;
            _addShopValidator = addShopValidator;
            _env = env;
            _commandSender = commandSender;
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

            // 1. Check the request
            AddShopCommand command = null;
            try
            {
                command = _requestBuilder.GetAddShop(obj);
            }
            catch (ArgumentException ex)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ex.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }
            
            var validationResult = await _addShopValidator.Validate(command, subject);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            command.Id = Guid.NewGuid().ToString();
            command.CreateDateTime = DateTime.UtcNow;
            command.UpdateDateTime = DateTime.UtcNow;
            command.Subject = subject;
            command.ShopRelativePath = GetRelativeShopPath(command.Id);
            command.UndergroundRelativePath = GetRelativeUndergroundPath(command.Id);
            // 2. Add the files.
            if (!AddShopMap(command, validationResult.Map))
            {
                var error = _responseBuilder.GetError(ErrorCodes.Server, ErrorDescriptions.TheShopCannotBeAdded);
                return _controllerHelper.BuildResponse(HttpStatusCode.InternalServerError, error);
            }

            var res = new { id = command.Id, shop_path = command.ShopRelativePath, underground_path = command.UndergroundRelativePath };
            _commandSender.Send(command);
            return new OkObjectResult(res);
        }

        private bool AddShopMap(AddShopCommand shop, ShopMap map)
        {
            if (!File.Exists(Constants.Assets.PartialShop) || !System.IO.File.Exists(Constants.Assets.PartialUnderground))
            {
                return false;
            }

            var shopLines = File.ReadAllLines(Constants.Assets.PartialShop);
            var undergroundLines = File.ReadAllLines(Constants.Assets.PartialUnderground);
            var shopPath = Path.Combine(_env.WebRootPath, shop.ShopRelativePath);
            var undergroundPath = Path.Combine(_env.WebRootPath, shop.UndergroundRelativePath);
            var shopFile = File.Create(shopPath);
            var undergroundFile = File.Create(undergroundPath);
            using (var shopWriter = new StreamWriter(shopFile))
            {
                foreach (var shopLine in shopLines)
                {
                    shopWriter.WriteLine(shopLine.Replace("<map_name>", map.MapName).Replace("<warp_entry>", "shopentry_" + shop.Id).Replace("<underground_name>", "underground_" + shop.Id));
                }
            }

            using (var undergroundWriter = new StreamWriter(undergroundFile))
            {
                foreach (var undergroundLine in undergroundLines)
                {
                    undergroundWriter.WriteLine(undergroundLine.Replace("<map_name>", "shop_" + shop.Id));
                }
            }

            return true;
        }

        private static string GetRelativeShopPath(string id)
        {
            return @"shops/" + id + "_shop.json";
        }

        private static string GetRelativeUndergroundPath(string id)
        {
            return @"shops/" + id + "_underground.json";
        }
    }
}
