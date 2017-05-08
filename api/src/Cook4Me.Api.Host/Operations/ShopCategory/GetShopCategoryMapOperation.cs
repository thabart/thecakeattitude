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

using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Enrichers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.ShopCategory
{
    public interface IGetShopCategoryMapOperation
    {
        Task<IActionResult> Execute(string categoryId, string mapId);
    }

    internal class GetShopCategoryMapOperation : IGetShopCategoryMapOperation
    {
        private readonly IMapRepository _mapRepository;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IMapEnricher _mapEnricher;

        public GetShopCategoryMapOperation(IMapRepository mapRepository, IHalResponseBuilder halResponseBuilder, IMapEnricher mapEnricher)
        {
            _mapRepository = mapRepository;
            _halResponseBuilder = halResponseBuilder;
            _mapEnricher = mapEnricher;
        }

        public async Task<IActionResult> Execute(string categoryId, string mapId)
        {
            if (string.IsNullOrWhiteSpace(categoryId))
            {
                throw new ArgumentNullException(nameof(categoryId));
            }

            if (string.IsNullOrWhiteSpace(mapId))
            {
                throw new ArgumentNullException(nameof(mapId));
            }

            var maps = await _mapRepository.Search(new SearchMapsParameter
            {
                CategoryId = categoryId,
                MapName = mapId
            });
            if (maps == null || !maps.Any())
            {
                return new NotFoundResult();
            }

            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.ShopCategories + "/" + Constants.RouteNames.Map.Replace("{id}", categoryId).Replace("{subid}", mapId)));
            _mapEnricher.Enrich(_halResponseBuilder, maps.First());
            return new OkObjectResult(_halResponseBuilder.Build());
        }
    }
}
