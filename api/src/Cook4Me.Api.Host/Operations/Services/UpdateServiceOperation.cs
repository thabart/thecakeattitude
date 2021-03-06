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
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Extensions;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Host.Validators;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Services
{
    public interface IUpdateServiceOperation
    {
        Task<IActionResult> Execute(string id, JObject jObj, string subject, string commonId, HttpRequest request);
    }

    internal class UpdateServiceOperation : IUpdateServiceOperation
    {
        private readonly IRequestBuilder _requestBuilder;
        private readonly IUpdateServiceValidator _updateServiceValidator;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly ICommandSender _commandSender;
        private readonly IHostingEnvironment _hostingEnvironment;

        public UpdateServiceOperation(IRequestBuilder requestBuilder, IUpdateServiceValidator updateServiceValidator,
            IResponseBuilder responseBuilder, IControllerHelper controllerHelper,
            ICommandSender commandSender, IHostingEnvironment hostingEnvironment)
        {
            _requestBuilder = requestBuilder;
            _updateServiceValidator = updateServiceValidator;
            _responseBuilder = responseBuilder;
            _controllerHelper = controllerHelper;
            _commandSender = commandSender;
            _hostingEnvironment = hostingEnvironment;
        }

        public async Task<IActionResult> Execute(string id, JObject jObj, string subject, string commonId, HttpRequest request)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var command = _requestBuilder.GetUpdateService(jObj);
            command.Id = id;
            var validationResult = await _updateServiceValidator.Execute(command, subject);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }
            
            var images = new List<string>();
            if (command.Images != null)
            {
                foreach (var image in command.Images)
                {
                    Uri uri = null;
                    if (Uri.TryCreate(image, UriKind.Absolute, out uri) && (uri.Scheme == "http" || uri.Scheme == "https"))
                    {
                        images.Add(image);
                        continue;
                    }

                    string path;
                    if (!AddImage(image, request, out path))
                    {
                        continue;
                    }

                    images.Add(path);
                }
            }

            command.CommonId = commonId;
            command.Images = images;
            command.UpdateDateTime = DateTime.UtcNow;
            _commandSender.Send(command);
            return new OkResult();
        }

        private bool AddImage(string base64Encoded, HttpRequest request, out string path)
        {
            path = null;
            if (string.IsNullOrWhiteSpace(base64Encoded))
            {
                return false;
            }

            var id = Guid.NewGuid().ToString();
            var picturePath = Path.Combine(_hostingEnvironment.WebRootPath, "services/" + id + ".jpg");
            if (System.IO.File.Exists(picturePath))
            {
                System.IO.File.Delete(picturePath);
            }

            try
            {
                base64Encoded = base64Encoded.Substring(base64Encoded.IndexOf(',') + 1);
                base64Encoded = base64Encoded.Trim('\0');
                var imageBytes = Convert.FromBase64String(base64Encoded);
                System.IO.File.WriteAllBytes(picturePath, imageBytes);
                path = request.GetAbsoluteUriWithVirtualPath() + "/services/" + id + ".jpg";
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
