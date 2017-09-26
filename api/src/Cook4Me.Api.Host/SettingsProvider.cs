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

using System;
using Cook4Me.Common;

namespace Cook4Me.Api.Host
{
    public class SettingsProvider : ISettingsProvider
    {
        public string BaseOpenidUrl { get; set; }
        public string BaseWebsite { get; set; }
        public string PaypalClientId { get; set; }
        public string PaypalClientSecret { get; set; }
        public string PaypalEmail { get; set; }
        public string UpsLicenseNumber { get; set; }
        public string UpsPassword { get; set; }
        public string UpsUsername { get; set; }
        public bool TstMode { get; set; }

        public string GetBaseOpenidUrl()
        {
            return BaseOpenidUrl;
        }

        public string GetBaseWebsite()
        {
            return BaseWebsite;
        }

        public string GetPaypalClientId()
        {
            return PaypalClientId;
        }

        public string GetPaypalClientSecret()
        {
            return PaypalClientSecret;
        }

        public string GetPaypalEmail()
        {
            return PaypalEmail;
        }

        public string GetUpsLicenseNumber()
        {
            return UpsLicenseNumber;
        }

        public string GetUpsPassword()
        {
            return UpsPassword;
        }

        public string GetUpsUsername()
        {
            return UpsUsername;
        }

        public bool IsTstMode()
        {
            return TstMode;
        }
    }
}
