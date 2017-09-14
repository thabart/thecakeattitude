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
using System.Text;

namespace Paypal.Client
{
    internal static class Converters
    {
        public static string ConvertClientCredentialsToBase64String(string clientId, string clientSecret)
        {
            if (string.IsNullOrEmpty(clientId))
            {
                throw new ArgumentNullException(nameof(clientId));
            }
            else if (string.IsNullOrEmpty(clientSecret))
            {
                throw new ArgumentNullException(nameof(clientSecret));
            }

            try
            {
                byte[] bytes = Encoding.UTF8.GetBytes(string.Format("{0}:{1}", clientId, clientSecret));
                return Convert.ToBase64String(bytes);
            }
            catch (Exception ex)
            {
                if (ex is FormatException || ex is ArgumentNullException)
                {
                    throw new Exception("Unable to convert client credentials to base-64 string.\n" +
                                                         "  clientId: \"" + clientId + "\"\n" +
                                                         "  clientSecret: \"" + clientSecret + "\"\n" +
                                                         "  Error: " + ex.Message);
                }

                throw new Exception(ex.Message, ex);
            }
        }
    }
}
