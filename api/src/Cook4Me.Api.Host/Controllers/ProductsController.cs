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

using Cook4Me.Api.Host.Handlers;
using Cook4Me.Api.Host.Operations.Product;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Products)]
    public class ProductsController : BaseController
    {
        private readonly ISearchProductsOperation _searchProductsOperation;

        public ProductsController(
            ISearchProductsOperation searchProductsOperation, IHandlersInitiator handlersInitiator) : base(handlersInitiator)
        {
            _searchProductsOperation = searchProductsOperation;
        }

        [HttpPost(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            return await _searchProductsOperation.Execute(jObj);
        }
    }
}
