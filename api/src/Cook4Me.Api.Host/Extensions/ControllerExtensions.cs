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
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Net;

namespace Cook4Me.Api.Host.Extensions
{
    internal static class ControllerExtensions
    {
        public static IActionResult BuildResponse(this Controller controller, object content, HttpStatusCode statusCode)
        {
            return controller.BuildResponse(content, (int)statusCode);
        }

        public static IActionResult BuildResponse(this Controller controller, object content, int status)
        {
            if (controller == null)
            {
                throw new ArgumentNullException(nameof(controller));
            }

            if (content == null)
            {
                throw new ArgumentNullException(nameof(content));
            }

            return new ContentResult
            {
                ContentType = "application/json",
                Content = JsonConvert.SerializeObject(content),
                StatusCode = status
            };
        }

        public static string GetCommonId(this Controller controller)
        {
            var str = new StringValues();
            if (!controller.Request.Headers.TryGetValue("CommonId", out str))
            {
                return null;
            }

            return str.First();
        }
    }
}
