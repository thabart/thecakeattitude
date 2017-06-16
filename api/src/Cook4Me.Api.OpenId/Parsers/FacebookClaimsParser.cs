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

using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace Cook4Me.Api.OpenId.Parsers
{
    public static class FacebookClaimsParser
    {
        private static Dictionary<string, string> _mappingFacebookClaimToOpenId = new Dictionary<string, string>
        {
            { "id", SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Subject },
            { "name", SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Name },
            { "first_name", SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.GivenName },
            { "last_name", SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.FamilyName },
            { "gender", SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Gender },
            { "locale", SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Locale },
            { "picture", SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Picture },
            { "updated_at", SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.UpdatedAt },
            { "email", SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Email },
            { "birthday", SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.BirthDate },
            { "link", SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.WebSite }
        };

        private static Dictionary<string, Func<JToken, string>> _mappingTransformationClaimToOpenId = new Dictionary<string, Func<JToken, string>>
        {
            { "id", (t) => t.ToString() },
            { "name", (t) => t.ToString() },
            { "first_name", (t) => t.ToString() },
            { "last_name", (t) => t.ToString() },
            { "gender", (t) => t.ToString() },
            { "locale", (t) => t.ToString() },
            { "picture", (t) => {
                var obj = t as JObject;
                if (obj == null)
                {
                    return null;
                }

                var url = obj.SelectToken("data.url");
                return url == null ? null : url.ToString();
            }},
            { "updated_at", (t) => t.ToString() },
            { "email", (t) => t.ToString() },
            { "birthday", (t) => t.ToString() },
            { "link", (t) => t.ToString() },
        };

        public static List<Claim> Process(JObject jObj)
        {
            var result = new List<Claim>();
            foreach (var claim in jObj)
            {
                if (!_mappingFacebookClaimToOpenId.ContainsKey(claim.Key))
                {
                    continue;
                }

                var key = _mappingFacebookClaimToOpenId[claim.Key];
                var transformation = _mappingTransformationClaimToOpenId[claim.Key];
                result.Add(new Claim(key, transformation(claim.Value)));
            }

            return result;
        }
    }
}
