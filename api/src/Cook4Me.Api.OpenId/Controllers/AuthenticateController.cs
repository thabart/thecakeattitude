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

using Cook4Me.Api.OpenId.Extensions;
using Cook4Me.Api.OpenId.ViewModels;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using SimpleIdentityServer.Core.Common.DTOs;
using SimpleIdentityServer.Core.Exceptions;
using SimpleIdentityServer.Core.Extensions;
using SimpleIdentityServer.Core.WebSite.Authenticate;
using SimpleIdentityServer.Host.Extensions;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Cook4Me.Api.OpenId.Controllers
{
    public class AuthenticateController : Controller
    {
        private const string ExternalAuthenticateCookieName = "CourierOpenId-{0}";
        private readonly IAuthenticateActions _authenticateActions;
        private readonly IDataProtector _dataProtector;
        private readonly IUrlHelper _urlHelper;

        public AuthenticateController(IAuthenticateActions authenticateActions, IDataProtectionProvider dataProtectionProvider,
            IUrlHelperFactory urlHelperFactory, IActionContextAccessor actionContextAccessor)
        {
            _authenticateActions = authenticateActions;
            _dataProtector = dataProtectionProvider.CreateProtector("Request");
            _urlHelper = urlHelperFactory.GetUrlHelper(actionContextAccessor.ActionContext);
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View(new LoginViewModel());
        }

        [HttpPost]
        public async Task<ActionResult> LocalLogin(LoginViewModel viewModel)
        {
            if (viewModel == null)
            {
                throw new ArgumentNullException(nameof(viewModel));
            }

            if (!ModelState.IsValid)
            {
                return View("Index", viewModel);
            }

            try
            {
                var resourceOwner = await _authenticateActions.LocalUserAuthentication(viewModel.ToParameter());
                var claims = resourceOwner.Claims;
                claims.Add(new Claim(ClaimTypes.AuthenticationInstant, DateTimeOffset.UtcNow.ConvertToUnixTimestamp().ToString(CultureInfo.InvariantCulture), ClaimValueTypes.Integer));
                var subject = claims.First(c => c.Type == SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Subject).Value;
                var authenticationManager = this.GetAuthenticationManager();
                await SetLocalCookie(authenticationManager, claims);
                return RedirectToAction("Index", "Profile");
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("invalid_credentials", ex.Message);
                return View("Index", viewModel);
            }
        }

        [HttpPost]
        public async Task ExternalLogin(string provider)
        {
            if (string.IsNullOrWhiteSpace(provider))
            {
                throw new ArgumentNullException(nameof(provider));
            }

            var redirectUrl = _urlHelper.AbsoluteAction("LoginCallback", "Authenticate");
            await HttpContext.Authentication.ChallengeAsync(provider, new AuthenticationProperties()
            {
                RedirectUri = redirectUrl
            });
        }

        [HttpGet]
        public async Task<ActionResult> LoginCallback(string error)
        {
            if (!string.IsNullOrWhiteSpace(error))
            {
                throw new IdentityServerException(
                    SimpleIdentityServer.Core.Errors.ErrorCodes.UnhandledExceptionCode,
                    string.Format(SimpleIdentityServer.Core.Errors.ErrorDescriptions.AnErrorHasBeenRaisedWhenTryingToAuthenticate, error));
            }

            // 1. Check if the user exists and insert it
            var authenticatedUser = await this.GetAuthenticatedUserExternal();
            var claims = await _authenticateActions.LoginCallback(authenticatedUser);

            // 2. Set cookie
            var authManager = this.GetAuthenticationManager();
            await SetLocalCookie(authManager, claims);
            await authManager.SignOutAsync(Constants.ExternalCookieName);

            // 3. Redirect to the profile
            return RedirectToAction("Index", "Profile");
        }

        [HttpGet]
        public async Task<ActionResult> OpenId(string code)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                throw new ArgumentNullException(nameof(code));
            }

            var authenticatedUser = await this.GetAuthenticatedUser(Constants.CookieName);
            var request = _dataProtector.Unprotect<AuthorizationRequest>(code);
            var actionResult = await _authenticateActions.AuthenticateResourceOwnerOpenId(
                request.ToParameter(),
                authenticatedUser,
                code);
            var result = this.CreateRedirectionFromActionResult(actionResult,
                request);
            if (result != null)
            {
                return result;
            }

            var viewModel = new LoginOpenIdViewModel
            {
                Code = code
            };

            return View(viewModel);
        }

        [HttpPost]
        public async Task<ActionResult> LocalLoginOpenId(LoginOpenIdViewModel viewModel)
        {
            if (viewModel == null)
            {
                throw new ArgumentNullException(nameof(viewModel));
            }

            if (string.IsNullOrWhiteSpace(viewModel.Code))
            {
                throw new ArgumentNullException(nameof(viewModel.Code));
            }
            
            try
            {
                // 1. Decrypt the request
                var request = _dataProtector.Unprotect<AuthorizationRequest>(viewModel.Code);

                // 2. Check the state of the view model
                if (!ModelState.IsValid)
                {
                    return View("OpenId", viewModel);
                }

                // 3. Local authentication
                var actionResult = await _authenticateActions.LocalOpenIdUserAuthentication(viewModel.ToParameter(),
                    request.ToParameter(),
                    viewModel.Code);
                var subject = actionResult.Claims.First(c => c.Type == SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Subject).Value;

                // 4. Authenticate the user by adding a cookie
                var authenticationManager = this.GetAuthenticationManager();
                await SetLocalCookie(authenticationManager, actionResult.Claims);

                // 5. Redirect the user agent
                var result = this.CreateRedirectionFromActionResult(actionResult.ActionResult,
                    request);
                if (result != null)
                {
                    return result;
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("invalid_credentials", ex.Message);
            }
            
            return View("OpenId", viewModel);
        }

        [HttpPost]
        public async Task ExternalLoginOpenId(string provider, string code)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                throw new ArgumentNullException("code");
            }

            // 1. Persist the request code into a cookie & fix the space problems
            var cookieValue = Guid.NewGuid().ToString();
            var cookieName = string.Format(ExternalAuthenticateCookieName, cookieValue);
            Response.Cookies.Append(cookieName, code,
                new CookieOptions
                {
                    Expires = DateTime.UtcNow.AddMinutes(5)
                });

            // 2. Redirect the User agent
            var redirectUrl = _urlHelper.AbsoluteAction("LoginCallbackOpenId", "Authenticate", new { code = cookieValue });
            await this.HttpContext.Authentication.ChallengeAsync(provider, new AuthenticationProperties()
            {
                RedirectUri = redirectUrl
            });
        }

        [HttpGet]
        public async Task<ActionResult> LoginCallbackOpenId(string code, string error)
        {
            if (string.IsNullOrWhiteSpace(code))
            {
                throw new ArgumentNullException("code");
            }

            // 1 : retrieve the request from the cookie
            var cookieName = string.Format(ExternalAuthenticateCookieName, code);
            var request = Request.Cookies[string.Format(ExternalAuthenticateCookieName, code)];
            if (request == null)
            {
                throw new IdentityServerException(SimpleIdentityServer.Core.Errors.ErrorCodes.UnhandledExceptionCode,
                    SimpleIdentityServer.Core.Errors.ErrorDescriptions.TheRequestCannotBeExtractedFromTheCookie);
            }

            // 2 : remove the cookie
            Response.Cookies.Append(cookieName, string.Empty,
                new CookieOptions
                {
                    Expires = DateTime.UtcNow.AddDays(-1)
                });

            // 3 : Raise an exception is there's an authentication error
            if (!string.IsNullOrWhiteSpace(error))
            {
                throw new IdentityServerException(
                    SimpleIdentityServer.Core.Errors.ErrorCodes.UnhandledExceptionCode,
                    string.Format(SimpleIdentityServer.Core.Errors.ErrorDescriptions.AnErrorHasBeenRaisedWhenTryingToAuthenticate, error));
            }

            // 4. Check if the user is authenticated
            var authenticatedUser = await this.GetAuthenticatedUserExternal();
            if (authenticatedUser == null ||
                !authenticatedUser.Identity.IsAuthenticated ||
                !(authenticatedUser.Identity is ClaimsIdentity))
            {
                throw new IdentityServerException(
                      SimpleIdentityServer.Core.Errors.ErrorCodes.UnhandledExceptionCode,
                      SimpleIdentityServer.Core.Errors.ErrorDescriptions.TheUserNeedsToBeAuthenticated);
            }

            // 5. Rerieve the claims
            var claimsIdentity = authenticatedUser.Identity as ClaimsIdentity;
            var claims = claimsIdentity.Claims.ToList();

            // 6. Try to authenticate the resource owner & returns the claims.
            var authorizationRequest = _dataProtector.Unprotect<AuthorizationRequest>(request);
            var actionResult = await _authenticateActions.ExternalOpenIdUserAuthentication(
                claims,
                authorizationRequest.ToParameter(),
                request);

            // 7. Store claims into new cookie
            if (actionResult.ActionResult != null)
            {
                var authenticationManager = this.GetAuthenticationManager();
                await SetLocalCookie(authenticationManager, actionResult.Claims);
                await authenticationManager.SignOutAsync(Constants.ExternalCookieName);
                return this.CreateRedirectionFromActionResult(actionResult.ActionResult,
                    authorizationRequest);
            }

            return RedirectToAction("OpenId", "Authenticate", new { code = code });
        }

        public async Task<ActionResult> Logout()
        {
            var authenticationManager = this.GetAuthenticationManager();
            await authenticationManager.SignOutAsync(Constants.CookieName);
            return RedirectToAction("Index");
        }

        private async Task SetLocalCookie(AuthenticationManager authenticationManager, IEnumerable<Claim> claims)
        {
            var identity = new ClaimsIdentity(claims, Constants.CookieName);
            var principal = new ClaimsPrincipal(identity);
            await authenticationManager.SignInAsync(Constants.CookieName, principal,
                new AuthenticationProperties
                {
                    ExpiresUtc = DateTime.UtcNow.AddDays(7),
                    IsPersistent = false
                });
        }
    }
}
