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
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Stats
{
    public interface IGetStatsOperation
    {
        Task<IActionResult> Execute();
    }

    internal class GetStatsOperation : IGetStatsOperation
    {
        private readonly IShopRepository _shopRepository;
        private readonly IProductRepository _productRepository;
        private readonly IServiceRepository _serviceRepository;

        public GetStatsOperation(IShopRepository shopRepository, IProductRepository productRepository, IServiceRepository serviceRepository)
        {
            _shopRepository = shopRepository;
            _productRepository = productRepository;
            _serviceRepository = serviceRepository;
        }        

        public async Task<IActionResult> Execute()
        {
            var obj = new JObject();
            obj.Add(Constants.DtoNames.StatNames.NbProducts, await _productRepository.Count());
            obj.Add(Constants.DtoNames.StatNames.NbServices, await _serviceRepository.Count());
            obj.Add(Constants.DtoNames.StatNames.NbShops, await _shopRepository.Count());
            return new OkObjectResult(obj);
        }
    }
}
