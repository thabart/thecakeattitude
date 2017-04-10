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

using Cook4Me.Api.OpenId.Builders;
using Cook4Me.Api.OpenId.Extensions;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json.Linq;
using SimpleIdentityServer.Core.Errors;
using SimpleIdentityServer.Core.Repositories;
using SimpleIdentityServer.Core.Validators;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Cook4Me.Api.OpenId.Controllers
{
    [Route(Constants.RouteNames.Users)]
    public class UserController : Controller
    {
        private class GetSubjectResult
        {
            public GetSubjectResult(string subject)
            {
                Subject = subject;
                IsValid = true;
            }

            public GetSubjectResult(ActionResult error)
            {
                Error = error;
                IsValid = false;
            }

            public string Subject;
            public bool IsValid;
            public ActionResult Error;
        }

        private readonly IRequestBuilder _requestBuilder;
        private readonly IGrantedTokenValidator _grantedTokenValidator;
        private readonly IGrantedTokenRepository _grantedTokenRepository;
        private readonly IResourceOwnerRepository _resourceOwnerRepository;
        private readonly IHostingEnvironment _hostingEnvironment;

        public UserController(IGrantedTokenValidator grantedTokenValidator,
            IGrantedTokenRepository grantedTokenRepository,
            IRequestBuilder requestBuilder,
            IHostingEnvironment hostingEnvironment,
            IResourceOwnerRepository resourceOwnerRepository)
        {
            _grantedTokenValidator = grantedTokenValidator;
            _grantedTokenRepository = grantedTokenRepository;
            _requestBuilder = requestBuilder;
            _hostingEnvironment = hostingEnvironment;
            _resourceOwnerRepository = resourceOwnerRepository;
        }

        [HttpPut(Constants.RouteNames.UserClaims)]
        public async Task<IActionResult> UpdateClaims([FromBody] JObject json)
        {
            if (json == null)
            {
                throw new ArgumentNullException(nameof(json));
            }

            // 1. Get the subject.
            var subjectResult = await GetSubject();
            if (!subjectResult.IsValid)
            {
                return subjectResult.Error;
            }

            // 2. Get the user.
            var user = await _resourceOwnerRepository.GetAsync(subjectResult.Subject);
            if (user == null)
            {
                return this.BuildError(ErrorCodes.InvalidRequestCode, ErrorDescriptions.TheRoDoesntExist, HttpStatusCode.NotFound);
            }

            // 2. Construct the request and update user information.
            var newClaims = _requestBuilder.GetUpdateUserParameter(json);
            var assignedClaims = new List<Claim>();
            foreach (var claim in user.Claims)
            {
                var record = newClaims.FirstOrDefault(c => c.Type == claim.Type);
                if (record == null || record.Type == SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Subject)
                {
                    assignedClaims.Add(claim);
                    continue;
                }

                assignedClaims.Add(record);
            }

            user.Claims = assignedClaims;
            if (!await _resourceOwnerRepository.UpdateAsync(user))
            {
                return this.BuildError(ErrorCodes.UnhandledExceptionCode, Constants.ErrorMessages.ErrorOccuredWhileTryingToUpdateTheUser);
            }

            return new OkResult();
        }

        private async Task<GetSubjectResult> GetSubject()
        {
            var accessToken = GetAccessTokenFromAuthorizationHeader();
            if (string.IsNullOrWhiteSpace(accessToken))
            {
                return new GetSubjectResult(this.BuildError(ErrorCodes.InvalidToken, string.Empty));
            }

            GrantedTokenValidationResult valResult;
            if (!((valResult = await _grantedTokenValidator.CheckAccessTokenAsync(accessToken)).IsValid))
            {
                return new GetSubjectResult(this.BuildError(valResult.MessageErrorCode, valResult.MessageErrorDescription));
            }

            var grantedToken = await _grantedTokenRepository.GetTokenAsync(accessToken);
            if (grantedToken == null || grantedToken.IdTokenPayLoad == null)
            {
                return new GetSubjectResult(this.BuildError(ErrorCodes.UnhandledExceptionCode, Constants.ErrorMessages.SubjectDoesntExist));
            }

            return new GetSubjectResult(grantedToken.IdTokenPayLoad.GetClaimValue(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Subject));
        }

        private string GetAccessTokenFromAuthorizationHeader()
        {
            const string authorizationName = "Authorization";
            StringValues values;
            if (!Request.Headers.TryGetValue(authorizationName, out values))
            {
                return string.Empty;
            }

            var authenticationHeader = values.First();
            var authorization = AuthenticationHeaderValue.Parse(authenticationHeader);
            var scheme = authorization.Scheme;
            if (string.Compare(scheme, "Bearer", StringComparison.CurrentCultureIgnoreCase) != 0)
            {
                return string.Empty;
            }

            return authorization.Parameter;
        }
    }
}
