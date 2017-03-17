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

using Cook4Me.Api.OpenId.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using SimpleIdentityServer.Core.Common.DTOs;
using SimpleIdentityServer.Core.WebSite.Consent;
using SimpleIdentityServer.Host.Extensions;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.OpenId.Controllers
{
    [Authorize("Connected")]
    public class ConsentController : Controller
    {
        private readonly IConsentActions _consentActions;
        private readonly IDataProtector _dataProtector;

        public ConsentController(IConsentActions consentActions, IDataProtectionProvider dataProtectionProvider)
        {
            _consentActions = consentActions;
            _dataProtector = dataProtectionProvider.CreateProtector("Request");
        }

        public async Task<ActionResult> Index(string code)
        {
            var request = _dataProtector.Unprotect<AuthorizationRequest>(code);
            var client = new SimpleIdentityServer.Core.Models.Client();
            var authenticatedUser = await this.GetAuthenticatedUser(Constants.CookieName);
            var actionResult = await _consentActions.DisplayConsent(request.ToParameter(),
                authenticatedUser);

            var result = this.CreateRedirectionFromActionResult(actionResult.ActionResult, request);
            if (result != null)
            {
                return result;
            }

            var viewModel = new ConsentViewModel
            {
                ClientDisplayName = client.ClientName,
                AllowedScopeDescriptions = actionResult.Scopes == null ? new List<string>() : actionResult.Scopes.Select(s => s.Description).ToList(),
                AllowedIndividualClaims = actionResult.AllowedClaims == null ? new List<string>() : actionResult.AllowedClaims,
                LogoUri = client.LogoUri,
                PolicyUri = client.PolicyUri,
                TosUri = client.TosUri,
                Code = code
            };
            return View(viewModel);
        }

        public async Task<ActionResult> Confirm(string code)
        {
            var request = _dataProtector.Unprotect<AuthorizationRequest>(code);
            var parameter = request.ToParameter();
            var authenticatedUser = await this.GetAuthenticatedUser(Constants.CookieName);
            var actionResult = await _consentActions.ConfirmConsent(parameter,
                authenticatedUser);

            return this.CreateRedirectionFromActionResult(actionResult,
                request);
        }

        public ActionResult Cancel(string code)
        {
            var request = _dataProtector.Unprotect<AuthorizationRequest>(code);
            return Redirect(request.RedirectUri);
        }
    }
}
