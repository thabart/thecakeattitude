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
using Newtonsoft.Json;
using System.Net;

namespace Cook4Me.Api.Host.Helpers
{
    public interface IControllerHelper
    {
        IActionResult BuildResponse(HttpStatusCode code, object obj);
        IActionResult BuildResponse(int code, object obj);
    }

    internal class ControllerHelper : IControllerHelper
    {
        public IActionResult BuildResponse(HttpStatusCode code, object obj)
        {
            return BuildResponse((int) code, obj);
        }

        public IActionResult BuildResponse(int code, object obj)
        {
            return new ContentResult
            {
                ContentType = "application/json",
                Content = JsonConvert.SerializeObject(obj),
                StatusCode = code
            };
        }
    }
}
