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

            var res = new { id = command.Id };
            _commandSender.Send(command);
            return new OkObjectResult(res);
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
