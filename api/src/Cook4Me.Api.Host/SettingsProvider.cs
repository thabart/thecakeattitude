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
        public string GetBaseOpenidUrl()
        {
            return "http://localhost:5001";
        }

        public string GetBaseWebsite()
        {
            return "http://localhost:3000";
        }

        public string GetPaypalClientId()
        {
            return "AQsgq7UBKVB0aTLI3k-2VRP1q1iFK9qsb8t29QJIMC6M_JWejo6mgylGmSLb3fLmaSVPsHCpwBvk5Lxt";
        }

        public string GetPaypalClientSecret()
        {
            return "EA930i2soWpP_XywC1CELPSIDLZxTmiNHvVJuI0qhWna6v_hXSPpATlxSArZJQWBS1pw_e9gOqbf0git";
        }

        public string GetUpsLicenseNumber()
        {
            return "FD300339C9051F5C";
        }

        public string GetUpsPassword()
        {
            return "CakeAttitude1989";
        }

        public string GetUpsUsername()
        {
            return "thabart1";
        }

        public bool IsTstMode()
        {
            return true;
        }
    }
}
