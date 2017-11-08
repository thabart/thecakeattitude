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
using Newtonsoft.Json.Linq;
using Cook4Me.Api.Host.Builders;
using System.Linq;
using Cook4Me.Api.Core.Aggregates;
using System.Collections.Generic;

namespace Cook4Me.Api.Host.Operations.GameEntities
{
    public interface IGetAllGameEntities
    {
        Task<IActionResult> Execute();
    }

    internal class GetAllGameEntities : IGetAllGameEntities
    {
        private readonly IGameEntityRepository _repository;

        public GetAllGameEntities(IGameEntityRepository repository)
        {
            _repository = repository;
        }

        public async Task<IActionResult> Execute()
        {
            var result = await _repository.GetAll();
            var jArr = new JArray();
            foreach(var record in result)
            {
                var jObj = new JObject();
                jObj.Add(Constants.DtoNames.GameEntity.Name, record.Name);
                jObj.Add(Constants.DtoNames.GameEntity.MaxAvailableInStock, record.MaxAvailableInStock);
                jObj.Add(Constants.DtoNames.GameEntity.Description, record.Description);
                jObj.Add(Constants.DtoNames.GameEntity.IsShelf, record.IsShelf);
                var kvp = CommonBuilder.MappingGameEntityTypes.FirstOrDefault(k => k.Key == record.Type);
                if (kvp.Equals(default(KeyValuePair<GameEntityTypes, string>)) && !string.IsNullOrWhiteSpace(kvp.Value))
                {
                    jObj.Add(Constants.DtoNames.GameEntity.Type, kvp.Value);
                }

                jArr.Add(jObj);
            }

            return new OkObjectResult(jArr);
        }
    }
}
