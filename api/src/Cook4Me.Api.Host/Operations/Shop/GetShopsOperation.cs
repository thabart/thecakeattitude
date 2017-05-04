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

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Enrichers;

namespace Cook4Me.Api.Host.Operations.Shop
{
    public interface IGetShopsOperation
    {
        Task<IActionResult> Execute();
    }

    internal class GetShopsOperation : IGetShopsOperation
    {
        private readonly IShopRepository _repository;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IShopEnricher _shopEnricher;

        public GetShopsOperation(IShopRepository repository, IHalResponseBuilder halResponseBuilder, IShopEnricher shopEnricher)
        {
            _repository = repository;
            _halResponseBuilder = halResponseBuilder;
            _shopEnricher = shopEnricher;
        }

        public async Task<IActionResult> Execute()
        {
            var shops = await _repository.Get();
            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Shops));
            foreach (var shop in shops)
            {
                _shopEnricher.Enrich(_halResponseBuilder, shop);
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }
    }
}
