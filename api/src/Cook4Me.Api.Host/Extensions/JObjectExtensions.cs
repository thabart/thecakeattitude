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

namespace Cook4Me.Api.Host.Extensions
{
    internal static class JObjectExtensions
    {
        public static IEnumerable<string> TryGetStringArray(this JObject jObj, string key)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            JToken token;
            if (!jObj.TryGetValue(key, StringComparison.CurrentCultureIgnoreCase, out token))
            {
                return null;
            }

            var arr = token as JArray;
            if (arr == null)
            {
                return new[] { token.ToString() };
            }

            var lst = new List<string>();
            foreach (var row in arr)
            {
                lst.Add(row.ToString());
            }

            return lst;
        }

        public static DateTime TryGetDateTime(this JObject jObj, string key)
        {

            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            JToken token;
            if (!jObj.TryGetValue(key, StringComparison.CurrentCultureIgnoreCase, out token))
            {
                return default(DateTime);
            }

            DateTime result;
            if (!DateTime.TryParse(token.ToString(), out result))
            {
                return default(DateTime);
            }

            return result;
        }

        public static DateTime? TryGetNullableDateTime(this JObject jObj, string key)
        {

            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            JToken token;
            if (!jObj.TryGetValue(key, StringComparison.CurrentCultureIgnoreCase, out token))
            {
                return null;
            }

            DateTime result;
            if (!DateTime.TryParse(token.ToString(), out result))
            {
                return null;
            }

            return result;
        }

        public static TimeSpan TryGetTime(this JObject jObj, string key)
        {

            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            JToken token;
            if (!jObj.TryGetValue(key, StringComparison.CurrentCultureIgnoreCase, out token))
            {
                return default(TimeSpan);
            }

            TimeSpan result;
            if (!TimeSpan.TryParse(token.ToString(), out result))
            {
                return default(TimeSpan);
            }

            return result;
        }

        public static double TryGetDouble(this JObject jObj, string key)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            JToken token;
            if (!jObj.TryGetValue(key, StringComparison.CurrentCultureIgnoreCase, out token))
            {
                return default(double);
            }

            double result;
            if (!double.TryParse(token.ToString(), out result))
            {
                return default(double);
            }

            return result;
        }

        public static double? TryGetNullableDouble(this JObject jObj, string key)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            JToken token;
            if (!jObj.TryGetValue(key, StringComparison.CurrentCultureIgnoreCase, out token))
            {
                return null;
            }

            double result;
            if (!double.TryParse(token.ToString(), out result))
            {
                return null;
            }

            return result;
        }

        public static string TryGetString(this JObject jObj, string key)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            JToken token;
            if (!jObj.TryGetValue(key, StringComparison.CurrentCultureIgnoreCase, out token))
            {
                return null;
            }

            return token.ToString();
        }

        public static bool TryGetBoolean(this JObject jObj, string key)
        {
            var result = jObj.TryGetString(key);
            if (result == null)
            {
                return false;
            }

            bool res;
            if (!bool.TryParse(result, out res))
            {
                return false;
            }

            return res;
        }

        public static bool? TryGetNullableBoolean(this JObject jObj, string key)
        {
            var result = jObj.TryGetString(key);
            if (result == null)
            {
                return null;
            }

            bool res;
            if (!bool.TryParse(result, out res))
            {
                return null;
            }

            return res;
        }
    }
}
