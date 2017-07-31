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
using Cook4Me.Api.Host.Extensions;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Host.Validators;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
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
        Task<IActionResult> Execute(JObject obj, HttpRequest request, string subject, string commonId);
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

        public async Task<IActionResult> Execute(JObject obj, HttpRequest request, string subject, string commonId)
        {
            if (obj == null)
            {
                throw new ArgumentNullException(nameof(obj));
            }

            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
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
            command.CommonId = commonId;
            if (!string.IsNullOrWhiteSpace(command.BannerImage))
            {
                string bannerImage = null;
                if (AddImage(command.BannerImage, request, "banner", out bannerImage))
                {
                    command.BannerImage = bannerImage;
                }
            }

            if (!string.IsNullOrWhiteSpace(command.ProfileImage))
            {
                string profileImage = null;
                if (AddImage(command.ProfileImage, request, "profile", out profileImage))
                {
                    command.ProfileImage = profileImage;
                }
            }

            // 2. Add the files.
            if (!AddShopMap(command, validationResult.CategoryMap, request))
            {
                var error = _responseBuilder.GetError(ErrorCodes.Server, ErrorDescriptions.TheShopCannotBeAdded);
                return _controllerHelper.BuildResponse(HttpStatusCode.InternalServerError, error);
            }

            var res = new { id = command.Id };
            _commandSender.Send(command);
            return new OkObjectResult(res);
        }

        private bool AddShopMap(AddShopCommand shop, ShopMap map, HttpRequest request)
        {
            if (!File.Exists(Constants.Assets.PartialShop) || !File.Exists(Constants.Assets.PartialUnderground))
            {
                return false;
            }

            var shopLines = File.ReadAllLines(Constants.Assets.PartialShop);
            var undergroundLines = File.ReadAllLines(Constants.Assets.PartialUnderground);
            var shopRelativePath = GetRelativeShopPath(shop.Id);
            var underGroundPath = GetRelativeUndergroundPath(shop.Id);
            var shopPath = Path.Combine(_env.WebRootPath, shopRelativePath);
            var undergroundPath = Path.Combine(_env.WebRootPath, underGroundPath);
            var shopFile = File.Create(shopPath);
            var undergroundFile = File.Create(undergroundPath);
            var virtualPath = request.GetAbsoluteUriWithVirtualPath();
            shop.ShopMap = new AddShopMapCommand
            {
                MapName = shop.Id + "_map",
                OverviewName = shop.Id + "_overview",
                PartialMapUrl = "/" + shopRelativePath,
                PartialOverviewUrl = "/shops/shop_overview.png"
            };
            using (var shopWriter = new StreamWriter(shopFile))
            {
                foreach (var shopLine in shopLines)
                {
                    shopWriter
                        .WriteLine(shopLine.Replace("<target_category_map_path>", virtualPath + map.PartialMapUrl)
                        .Replace("<target_category_overview_path>", virtualPath + map.PartialOverviewUrl)
                        .Replace("<target_underground_map_path>", virtualPath + "/" + underGroundPath)
                        .Replace("<target_underground_overview_path>", virtualPath + "/shops/underground_overview.png")
                        .Replace("<target_category_map_name>", map.MapName));
                }
            }

            using (var undergroundWriter = new StreamWriter(undergroundFile))
            {
                foreach (var undergroundLine in undergroundLines)
                {
                    undergroundWriter
                        .WriteLine(undergroundLine.Replace("<target_shop_map_path>", virtualPath + shop.ShopMap.PartialMapUrl)
                        .Replace("<target_shop_overview_path>", virtualPath + "/shops/shop_overview.png"));
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
        
        private bool AddImage(string base64Encoded, HttpRequest request, string type, out string path)
        {
            path = null;
            if (string.IsNullOrWhiteSpace(base64Encoded))
            {
                return false;
            }

            var id = Guid.NewGuid().ToString();
            var picturePath = Path.Combine(_env.WebRootPath, "shops/" + id + "_" + type + ".jpg");
            if (File.Exists(picturePath))
            {
                File.Delete(picturePath);
            }

            try
            {
                base64Encoded = base64Encoded.Substring(base64Encoded.IndexOf(',') + 1);
                base64Encoded = base64Encoded.Trim('\0');
                var imageBytes = Convert.FromBase64String(base64Encoded);
                File.WriteAllBytes(picturePath, imageBytes);
                path = request.GetAbsoluteUriWithVirtualPath() + "/shops/" + id + "_" + type + ".jpg";
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
