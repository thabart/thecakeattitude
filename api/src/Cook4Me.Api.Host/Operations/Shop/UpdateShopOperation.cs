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
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Microsoft.AspNetCore.Hosting;
using Cook4Me.Api.Core.Bus;
using Cook4Me.Api.Host.Validators;
using Cook4Me.Api.Core.Commands.Shop;
using System.Net;
using Microsoft.AspNetCore.Http;
using System.IO;
using Cook4Me.Api.Host.Extensions;

namespace Cook4Me.Api.Host.Operations.Shop
{
    public interface IUpdateShopOperation
    {
        Task<IActionResult> Execute(JObject jObj, HttpRequest request, string id, string subject, string commonId);
    }

    internal class UpdateShopOperation : IUpdateShopOperation
    {
        private readonly IResponseBuilder _responseBuilder;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly IUpdateShopValidator _updateShopValidator;
        private readonly IHostingEnvironment _env;
        private readonly ICommandSender _commandSender;

        public UpdateShopOperation(IResponseBuilder responseBuilder, IRequestBuilder requestBuilder,
            IControllerHelper controllerHelper, IUpdateShopValidator updateShopValidator,
            IHostingEnvironment env, ICommandSender commandSender)
        {
            _responseBuilder = responseBuilder;
            _requestBuilder = requestBuilder;
            _controllerHelper = controllerHelper;
            _updateShopValidator = updateShopValidator;
            _env = env;
            _commandSender = commandSender;
        }

        public async Task<IActionResult> Execute(JObject jObj, HttpRequest request, string id, string subject, string commonId)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            // 1. Check the request
            UpdateShopCommand command = null;
            try
            {
                command = _requestBuilder.GetUpdateShop(jObj);
            }
            catch (ArgumentException ex)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ex.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            // 2. Add image
            if (!string.IsNullOrWhiteSpace(command.BannerImage))
            {
                string bannerImage = null;
                AddImage(command.BannerImage, request, "banner", out bannerImage);
                command.BannerImage = bannerImage;
            }

            if (!string.IsNullOrWhiteSpace(command.ProfileImage))
            {
                string profileImage = null;
                AddImage(command.ProfileImage, request, "profile", out profileImage);
                command.ProfileImage = profileImage;
            }

            command.Id = id;
            command.UpdateDateTime = DateTime.UtcNow;
            command.CommonId = commonId;
            if (command.ProductCategories != null)
            {
                foreach(var productCategory in command.ProductCategories)
                {
                    if (string.IsNullOrWhiteSpace(productCategory.Id))
                    {
                        productCategory.Id = Guid.NewGuid().ToString();
                    }
                }
            }

            if (command.ProductFilters != null)
            {
                foreach(var productFilter in command.ProductFilters)
                {
                    if (string.IsNullOrWhiteSpace(productFilter.Id))
                    {
                        productFilter.Id = Guid.NewGuid().ToString();
                    }

                    if (productFilter.Values != null)
                    {
                        foreach(var value in productFilter.Values)
                        {
                            if (string.IsNullOrWhiteSpace(value.Id))
                            {
                                value.Id = Guid.NewGuid().ToString();
                            }
                        }
                    }
                }
            }

            var validationResult = await _updateShopValidator.Validate(command, subject);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }            
            
            _commandSender.Send(command);
            return new OkResult();
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
