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

using Microsoft.AspNetCore.Mvc;
using SimpleIdentityServer.Core.Common.Extensions;
using SimpleIdentityServer.Host.DTOs.Response;
using System;
using System.Net;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Cook4Me.Api.OpenId.Extensions
{
    internal static class ControllerExtensions
    {
        public static async Task<ClaimsPrincipal> GetAuthenticatedUserExternal(this Controller controller)
        {
            if (controller == null)
            {
                throw new ArgumentNullException(nameof(controller));
            }

            var user = await controller.HttpContext.Authentication.AuthenticateAsync(Constants.ExternalCookieName);
            return user ?? new ClaimsPrincipal(new ClaimsIdentity());
        }

        public static ActionResult BuildError(this Controller controller, string code, string message)
        {
            return BuildError(controller, code, message, HttpStatusCode.InternalServerError);
        }

        public static ActionResult BuildError(this Controller controller, string code, string message, HttpStatusCode status)
        {
            var error = new ErrorResponse
            {
                error = code,
                error_description = message
            };

            return new ContentResult
            {
                Content = error.SerializeWithDataContract(),
                ContentType = "application/json",
                StatusCode = (int)status
            };
        }
    }
}
