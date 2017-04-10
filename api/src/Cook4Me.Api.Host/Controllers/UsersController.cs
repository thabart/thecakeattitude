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


using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Users)]
    public class UsersController : Controller
    {
        private readonly IUserRepository _repository;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IRequestBuilder _requestBuilder;

        public UsersController(IUserRepository repository, IResponseBuilder responseBuilder, IRequestBuilder requestBuilder)
        {
            _repository = repository;
            _responseBuilder = responseBuilder;
            _requestBuilder = requestBuilder;
        }

        [HttpGet(Constants.RouteNames.Me)]
        [Authorize("Connected")]
        public async Task<IActionResult> Get()
        {
            var subject = User.GetSubject();
            if (string.IsNullOrEmpty(subject))
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ErrorDescriptions.TheSubjectCannotBeRetrieved);
                return this.BuildResponse(error, HttpStatusCode.BadRequest);
            }

            var user = await _repository.Get(subject);
            if (user == null)
            {
                return new StatusCodeResult((int)HttpStatusCode.NotFound);
            }

            return new OkObjectResult(_responseBuilder.GetUser(user));
        }
    }
}
