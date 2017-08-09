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
using SimpleIdentityServer.Core.Parameters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;

namespace Cook4Me.Api.OpenId.Builders
{
    public interface IRequestBuilder
    {
        IList<Claim> GetUpdateUserParameter(JObject json);
        SearchResourceOwnerParameter GetSearchResourceOwner(JObject json);
        string GetUploadImage(JObject json);
    }

    internal class RequestBuilder : IRequestBuilder
    {
        private Dictionary<string, Action<ICollection<Claim>, string>> _mappingKeyToUpdateUserParameter = new Dictionary<string, Action<ICollection<Claim>, string>>
        {
            { Constants.Dtos.UpdateUser.Name, (u, v) => u.Add(new Claim(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Name, v)) },
            { Constants.Dtos.UpdateUser.Email, (u, v) => u.Add(new Claim(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Email, v)) },
            { Constants.Dtos.UpdateUser.PhoneNumber, (u, v) => u.Add(new Claim(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.PhoneNumber, v)) },
            { Constants.Claims.HomePhoneNumber, (u, v) => u.Add(new Claim(Constants.Claims.HomePhoneNumber, v)) },
            { Constants.Claims.MobilePhoneNumber, (u, v) => u.Add(new Claim(Constants.Claims.MobilePhoneNumber, v)) },
            { Constants.Claims.GooglePlaceId, (u, v) => u.Add(new Claim(Constants.Claims.GooglePlaceId, v)) },
            { Constants.Claims.BannerImage, (u, v) => u.Add(new Claim(Constants.Claims.BannerImage, v)) },
            { Constants.Dtos.UpdateUser.Picture, (u, v) => u.Add(new Claim(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Picture, v)) }
        };

        private Dictionary<string, Action<JObject, string>> _mappingKeyToAddress = new Dictionary<string, Action<JObject, string>>
        {
            { Constants.Dtos.UpdateUser.StreetAddress, (o, v) => o.Add(SimpleIdentityServer.Core.Jwt.Constants.StandardAddressClaimNames.StreetAddress, v) },
            { Constants.Dtos.UpdateUser.PostalCode, (o, v) => o.Add(SimpleIdentityServer.Core.Jwt.Constants.StandardAddressClaimNames.PostalCode, v) },
            { Constants.Dtos.UpdateUser.Locality, (o, v) => o.Add(SimpleIdentityServer.Core.Jwt.Constants.StandardAddressClaimNames.Locality, v) },
            { Constants.Dtos.UpdateUser.Country, (o, v) => o.Add(SimpleIdentityServer.Core.Jwt.Constants.StandardAddressClaimNames.Country, v) }
        };

        public SearchResourceOwnerParameter GetSearchResourceOwner(JObject json)
        {
            if (json == null)
            {
                throw new ArgumentNullException(nameof(json));
            }

            return new SearchResourceOwnerParameter
            {
                Subjects = TryGetStringArr(json, Constants.Dtos.SearchResourceOwner.Subjects)
            };
        }

        public IList<Claim> GetUpdateUserParameter(JObject json)
        {
            if (json == null)
            {
                throw new ArgumentNullException(nameof(json));
            }

            var claims = new List<Claim>();
            var address = new JObject();
            foreach (var kvp in json)
            {
                if (_mappingKeyToUpdateUserParameter.ContainsKey(kvp.Key))
                {
                    _mappingKeyToUpdateUserParameter[kvp.Key](claims, kvp.Value.Value<string>());
                    continue;
                }

                if (_mappingKeyToAddress.ContainsKey(kvp.Key))
                {
                    _mappingKeyToAddress[kvp.Key](address, kvp.Value.Value<string>());
                    continue;
                }
            }

            if (address.Children().Any())
            {
                claims.Add(new Claim(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Address, address.ToString()));
            }

            return claims;
        }

        public string GetUploadImage(JObject json)
        {
            if (json == null)
            {
                throw new ArgumentNullException(nameof(json));
            }

            return json.Value<string>(SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Picture);
        }

        private static T GetEnum<T>(string str) where T : struct
        {
            T result;
            var name = Enum.GetNames(typeof(T)).FirstOrDefault(e => string.Equals(e, str, StringComparison.CurrentCultureIgnoreCase));
            if (string.IsNullOrWhiteSpace(name))
            {
                return default(T);
            }

            return (T)Enum.Parse(typeof(T), name);
        }

        private IEnumerable<string> TryGetStringArr(JObject json, string key)
        {
            JToken token = null;
            if (!json.TryGetValue(key, StringComparison.CurrentCultureIgnoreCase, out token))
            {
                return null;
            }

            var arr = token as JArray;
            if (arr == null)
            {
                return null;
            }

            return arr.Select(a => a.ToString());
        }
    }
}
