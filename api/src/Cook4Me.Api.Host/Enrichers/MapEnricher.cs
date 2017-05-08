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

using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.Host.Builders;
using System;

namespace Cook4Me.Api.Host.Enrichers
{
    public interface IMapEnricher
    {
        void Enrich(IHalResponseBuilder halResponseBuilder, ShopMap shopMap);
    }

    internal class MapEnricher : IMapEnricher
    {
        private readonly IResponseBuilder _responseBuilder;

        public MapEnricher(IResponseBuilder responseBuilder)
        {
            _responseBuilder = responseBuilder;
        }

        public void Enrich(IHalResponseBuilder halResponseBuilder, ShopMap shopMap)
        {
            if (halResponseBuilder == null)
            {
                throw new ArgumentNullException(nameof(halResponseBuilder));
            }

            if (shopMap == null)
            {
                throw new ArgumentNullException(nameof(shopMap));
            }

            halResponseBuilder.AddEmbedded(e => e.AddObject(_responseBuilder.GetMap(shopMap)));
        }
    }
}
