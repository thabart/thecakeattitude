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

using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Enrichers;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.ShopCategory
{
    public interface IGetAllShopCategoriesOperation
    {
        Task<IActionResult> Execute();
    }

    internal class GetAllShopCategoriesOperation : IGetAllShopCategoriesOperation
    {
        private readonly IShopCategoryRepository _repository;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IShopCategoryEnricher _shopCategoryEnricher;

        public GetAllShopCategoriesOperation(IShopCategoryRepository repository, IHalResponseBuilder halResponseBuilder, IShopCategoryEnricher shopCategoryEnricher)
        {
            _repository = repository;
            _halResponseBuilder = halResponseBuilder;
            _shopCategoryEnricher = shopCategoryEnricher;
        }

        public async Task<IActionResult> Execute()
        {
            var categories = await _repository.GetAll();
            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.ShopCategories));
            foreach (var category in categories)
            {
                _shopCategoryEnricher.Enrich(_halResponseBuilder, category);
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }
    }
}
