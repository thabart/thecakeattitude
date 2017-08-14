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

using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Primitives;
using System.Collections.Generic;
using System.Linq;

namespace Cook4Me.Api.Host.Authentications
{
    internal static class SignalrAuthentication
    {
        private static readonly string AUTH_QUERY_STRING_KEY = "authtoken";

        public static void UseJwtSignalRAuthentication(this IApplicationBuilder app)
        {
            app.Use(async (context, next) =>
            {
                if (string.IsNullOrWhiteSpace(context.Request.Headers["Authorization"]))
                {
                    try
                    {
                        if (context.Request.QueryString.HasValue)
                        {
                            var values = context.Request.Query.FirstOrDefault(kvp => kvp.Key == AUTH_QUERY_STRING_KEY);
                            if (!values.Equals(default(KeyValuePair<string, StringValues>)))
                            {
                                var token = values.Value.First();
                                if (!string.IsNullOrWhiteSpace(token))
                                {
                                    context.Request.Headers.Add("Authorization", new[] { $"Bearer {token}" });
                                }

                            }
                        }

                    }
                    catch { }
                }
                await next.Invoke();
            });

        }
    }
}
