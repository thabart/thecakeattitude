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
using SimpleIdentityServer.Client;
using SimpleIdentityServer.Core.Errors;
using SimpleIdentityServer.Core.Models;
using SimpleIdentityServer.Core.Repositories;
using SimpleIdentityServer.Core.Services;
using SimpleIdentityServer.Core.Validators;
using SimpleIdentityServer.Host.Extensions;
using Sumup.Client;
using Sumup.Client.Params;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Cook4Me.Api.OpenId.Controllers
{
    [Route(Constants.RouteNames.Users)]
    public class UsersController : Controller
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
        private readonly IAuthenticateResourceOwnerService _authenticateResourceOwnerService;
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ISumupClient _sumUpClient;

        public UsersController(IGrantedTokenValidator grantedTokenValidator,
            IGrantedTokenRepository grantedTokenRepository,
            IRequestBuilder requestBuilder,
            IHostingEnvironment hostingEnvironment,
            IResourceOwnerRepository resourceOwnerRepository,
            IAuthenticateResourceOwnerService authenticateResourceOwnerService,
            ISumupClient sumUpClient)
        {
            _grantedTokenValidator = grantedTokenValidator;
            _grantedTokenRepository = grantedTokenRepository;
            _requestBuilder = requestBuilder;
            _hostingEnvironment = hostingEnvironment;
            _resourceOwnerRepository = resourceOwnerRepository;
            _authenticateResourceOwnerService = authenticateResourceOwnerService;
            _sumUpClient = sumUpClient;
        }

        [HttpGet(Constants.RouteNames.UserClaims)] // User Authentication enabled.
        public async Task<IActionResult> GetClaims()
        {
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

            var jObj = new JObject();
            foreach(var claim in user.Claims)
            {
                jObj.Add(claim.Type, claim.Value);
            }

            return new OkObjectResult(jObj);
        }

        [HttpPut] // User Authentication enabled.
        public async Task<IActionResult> Update([FromBody] JObject json)
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

            // 2. Check the user exists.
            var user = await _resourceOwnerRepository.GetAsync(subjectResult.Subject);
            if (user == null)
            {
                return this.BuildError(ErrorCodes.InvalidRequestCode, ErrorDescriptions.TheRoDoesntExist, HttpStatusCode.NotFound);
            }
            
            // 4. Construct the request and update user information.
            var updateParameter = _requestBuilder.GetUpdateUserParameter(json);
            updateParameter.Login = subjectResult.Subject;
            var claims = updateParameter.Claims;
            var assignedClaims = claims.Where(c => c.Type != SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Picture && c.Type != Constants.Claims.BannerImage && c.Type != SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Subject).ToList();
            assignedClaims.Add(new Claim(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Subject, subjectResult.Subject));
            var pictureClaim = claims.FirstOrDefault(c => c.Type == SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Picture);
            var bannerClaim = claims.FirstOrDefault(c => c.Type == Constants.Claims.BannerImage);
            if (pictureClaim != null)
            {
                string path;
                if (AddImage(pictureClaim.Value, subjectResult.Subject, true, out path))
                {
                    assignedClaims.Add(new Claim(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Picture, path));
                }
                else
                {
                    assignedClaims.Add(pictureClaim);
                }
            }

            if (bannerClaim != null)
            {
                string path;
                if (AddImage(bannerClaim.Value, subjectResult.Subject, false, out path))
                {
                    assignedClaims.Add(new Claim(Constants.Claims.BannerImage, path));
                }
                else
                {
                    assignedClaims.Add(bannerClaim);
                }
            }


            user.TwoFactorAuthentication = updateParameter.TwoFactorAuthentication;
            if (!string.IsNullOrWhiteSpace(updateParameter.Password) && user.IsLocalAccount)
            {
                if (!Regex.IsMatch(updateParameter.Password, @"^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$"))
                {
                    return this.BuildError(ErrorCodes.InvalidRequestCode, "the password is not correct", HttpStatusCode.InternalServerError);
                }

                user.Password = _authenticateResourceOwnerService.GetHashedPassword(updateParameter.Password);
            }

            user.Claims = assignedClaims;
            if (user.Claims != null)
            {
                Claim updatedClaim;
                if (((updatedClaim = user.Claims.FirstOrDefault(c => c.Type == SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.UpdatedAt)) != null))
                {
                    user.Claims.Remove(updatedClaim);
                }

                user.Claims.Add(new Claim(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.UpdatedAt, DateTime.UtcNow.ToString()));
            }

            // 5. Update the information.
            if (!await _resourceOwnerRepository.UpdateAsync(user))
            {
                return this.BuildError(ErrorCodes.UnhandledExceptionCode, Constants.ErrorMessages.ErrorOccuredWhileTryingToUpdateTheUser);
            }

            return new OkResult();
        }

        [HttpGet(Constants.RouteNames.Confirm)] // User Authentication enabled.
        public async Task<IActionResult> Confirm()
        {
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

            if (user.IsLocalAccount)
            {
                return this.BuildError(ErrorCodes.InvalidRequestCode, "the resource owner is already confirmed", HttpStatusCode.InternalServerError);
            }

            // 3. Update the information.
            user.IsLocalAccount = true;
            if (user.Claims != null)
            {
                Claim updatedClaim;
                if (((updatedClaim = user.Claims.FirstOrDefault(c => c.Type == SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.UpdatedAt)) != null))
                {
                    user.Claims.Remove(updatedClaim);
                }

                user.Claims.Add(new Claim(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.UpdatedAt, DateTime.UtcNow.ToString()));
            }

            // 4. Update the information.
            if (!await _resourceOwnerRepository.UpdateAsync(user))
            {
                return this.BuildError(ErrorCodes.UnhandledExceptionCode, Constants.ErrorMessages.ErrorOccuredWhileTryingToUpdateTheUser);
            }

            return new OkResult();
        }

        [HttpGet(Constants.RouteNames.PublicClaims)]
        public async Task<IActionResult> GetPublicClaims(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            // 1. Get the user.
            var user = await _resourceOwnerRepository.GetAsync(id);
            if (user == null)
            {
                return this.BuildError(ErrorCodes.InvalidRequestCode, ErrorDescriptions.TheRoDoesntExist, HttpStatusCode.NotFound);
            }

            return new OkObjectResult(ToDto(user));
        }

        [HttpPost(Constants.RouteNames.BulkPublicClaims)]
        public async Task<IActionResult> GetBulkPublicClaims([FromBody] JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var parameter = _requestBuilder.GetSearchResourceOwner(jObj);
            var result = await _resourceOwnerRepository.Search(parameter);
            if (result == null)
            {
                return this.BuildError(ErrorCodes.InternalError, ErrorDescriptions.TheBulkPublicClaimsIsNotWorking, HttpStatusCode.InternalServerError);
            }
            
            var arr = new JArray();
            foreach(var resourceOwner in result.Content)
            {
                arr.Add(ToDto(resourceOwner));
            }

            return new OkObjectResult(arr);
        }

        [HttpPost(Constants.RouteNames.CreditCard)] // Update the credit card information.
        public async Task<IActionResult> UpdateCreditCard([FromBody] JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            // 1. Get the subject.
            var subjectResult = await GetSubject();
            if (!subjectResult.IsValid)
            {
                return subjectResult.Error;
            }

            // 2. Check the user exists.
            var user = await _resourceOwnerRepository.GetAsync(subjectResult.Subject);
            if (user == null)
            {
                return this.BuildError(ErrorCodes.InvalidRequestCode, ErrorDescriptions.TheRoDoesntExist, HttpStatusCode.NotFound);
            }

            // 3. Fetch the customer_id && update the user.
            var factory = new IdentityServerClientFactory();
            var tokenResult = await factory.CreateAuthSelector()
                .UseClientSecretBasicAuth(Constants.SumUpClientId, Constants.SumUpClientSecret)
                .UseClientCredentials("user.subaccounts")
                .ExecuteAsync(Constants.BaseSumupApi + "/token");
            var sumUpClient = await _sumUpClient.GetClientPayments(subjectResult.Subject, tokenResult.AccessToken);
            if (sumUpClient == null)
            {
                var result = await _sumUpClient.AddClient(new AddClientParameter
                {
                    Id = subjectResult.Subject,
                    AccessToken = tokenResult.AccessToken,
                    Name = TryGetValue(user.Claims, SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Name),
                    Phone = TryGetValue(user.Claims, SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.PhoneNumber)
                });
                
            }

            /*
            var sumUpCustomerId = TryGetValue(user.Claims, Constants.Claims.SumUpCustomerId);
            if (string.IsNullOrWhiteSpace(sumUpCustomerId))
            {
                var result = await _sumUpClient.AddClient(new AddClientParameter
                {
                    Id = subjectResult.Subject,
                    AccessToken = tokenResult.AccessToken,
                    Name = TryGetValue(user.Claims, SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Name),
                    Phone = TryGetValue(user.Claims, SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.PhoneNumber)
                });

                sumUpCustomerId = result.CustomerId;
                user.Claims.Add(new Claim(Constants.Claims.SumUpCustomerId, sumUpCustomerId));
                await _resourceOwnerRepository.UpdateAsync(user);
            }
            */

            return null;
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

        private bool AddImage(string base64Encoded, string subject, bool isProfile, out string path)
        {
            path = null;
            if (string.IsNullOrWhiteSpace(base64Encoded))
            {
                return false;
            }
            
            var picturePath = Path.Combine(_hostingEnvironment.WebRootPath, "img/users/" + subject + (isProfile ? "_profile" : "_banner") +  ".jpg");
            try
            {
                base64Encoded = base64Encoded.Substring(base64Encoded.IndexOf(',') + 1);
                base64Encoded = base64Encoded.Trim('\0');
                var imageBytes = Convert.FromBase64String(base64Encoded);
                if (System.IO.File.Exists(picturePath))
                {
                    System.IO.File.Delete(picturePath);
                }

                System.IO.File.WriteAllBytes(picturePath, imageBytes);
                path = Request.GetAbsoluteUriWithVirtualPath()+ "/img/users/" + subject + (isProfile ? "_profile" : "_banner") + ".jpg";
                return true;
            }
            catch(Exception ex)
            {
                return false;
            }

        }

        private static string TryGetValue(IEnumerable<Claim> claims, string type)
        {
            var claim = claims.FirstOrDefault(c => c.Type == type);
            if (claim == null)
            {
                return string.Empty;
            }

            return claim.Value;
        }

        private static JObject ToDto(ResourceOwner resourceOwner)
        {
            var jObj = new JObject();
            var claims = new JObject();
            claims.Add(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Subject, TryGetValue(resourceOwner.Claims, SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Subject));
            claims.Add(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Email, TryGetValue(resourceOwner.Claims, SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Email));
            claims.Add(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Picture, TryGetValue(resourceOwner.Claims, SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Picture));
            claims.Add(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Name, TryGetValue(resourceOwner.Claims, SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Name));
            claims.Add(Constants.Claims.HomePhoneNumber, TryGetValue(resourceOwner.Claims, Constants.Claims.HomePhoneNumber));
            claims.Add(Constants.Claims.MobilePhoneNumber, TryGetValue(resourceOwner.Claims, Constants.Claims.MobilePhoneNumber));
            claims.Add(Constants.Claims.BannerImage, TryGetValue(resourceOwner.Claims, Constants.Claims.BannerImage));
            jObj.Add(Constants.Dtos.ResourceOwner.Claims, claims);
            jObj.Add(Constants.Dtos.ResourceOwner.IsLocalAccount, resourceOwner.IsLocalAccount);
            return jObj;
        }
    }
}
