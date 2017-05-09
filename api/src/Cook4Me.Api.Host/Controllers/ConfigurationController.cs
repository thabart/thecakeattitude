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

using Cook4Me.Api.Host.Extensions;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Configuration)]
    public class ConfigurationController : Controller
    {
        [HttpGet]
        public IActionResult Get()
        {
            var issuer = Request.GetAbsoluteUriWithVirtualPath();
            var jObj = new JObject();
            jObj.Add("products_endpoint", issuer + "/" + Constants.RouteNames.Products);
            jObj.Add("shops_endpoint", issuer + "/" + Constants.RouteNames.Shops);
            jObj.Add("tags_endpoint", issuer + "/" + Constants.RouteNames.Tags);
            jObj.Add("shopcategories_endpoint", issuer + "/" + Constants.RouteNames.ShopCategories);
            return new OkObjectResult(jObj);
        }
    }
}