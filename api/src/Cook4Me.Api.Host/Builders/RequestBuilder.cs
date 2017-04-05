﻿#region copyright
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

using Cook4Me.Api.Core.Models;
using Cook4Me.Api.Core.Parameters;
using Newtonsoft.Json.Linq;
using System;

namespace Cook4Me.Api.Host.Builders
{
    public interface IRequestBuilder
    {
        Shop GetAddShop(JObject jObj);
        SearchShopsParameter GetSearchShops(JObject jObj);
    }

    internal class RequestBuilder : IRequestBuilder
    {
        public Shop GetAddShop(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new Shop();
            result.Title = jObj.Value<string>(Constants.DtoNames.Shop.Title);
            result.MapName = jObj.Value<string>(Constants.DtoNames.Shop.Map);
            result.PlaceId = jObj.Value<string>(Constants.DtoNames.Shop.Place);
            return result;
        }

        public SearchShopsParameter GetSearchShops(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new SearchShopsParameter
            {
                Map = jObj.Value<string>(Constants.DtoNames.Shop.Map),
                Place = jObj.Value<string>(Constants.DtoNames.Shop.Place)
            };
            return result;
        }
    }
}