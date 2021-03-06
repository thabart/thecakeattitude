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

using Cook4Me.Api.Host.Operations.ShopCategory;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.ShopCategories)]
    public class ShopCategoriesController : Controller
    {
        private readonly IGetAllShopCategoriesOperation _getAllShopCategoriesOperation;
        private readonly IGetParentShopCategoriesOperation _getParentShopCategoriesOperation;
        private readonly IGetShopCategoryOperation _getShopCategoryOperation;

        public ShopCategoriesController(IGetAllShopCategoriesOperation getAllShopCategoriesOperation, IGetParentShopCategoriesOperation getParentShopCategoriesOperation,
            IGetShopCategoryOperation getShopCategoryOperation)
        {
            _getAllShopCategoriesOperation = getAllShopCategoriesOperation;
            _getParentShopCategoriesOperation = getParentShopCategoriesOperation;
            _getShopCategoryOperation = getShopCategoryOperation;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return await _getAllShopCategoriesOperation.Execute();
        }

        [HttpGet(Constants.RouteNames.Parents)]
        public async Task<IActionResult> GetAllParents()
        {
            return await _getParentShopCategoriesOperation.Execute();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            return await _getShopCategoryOperation.Execute(id);
        }
    }
}
