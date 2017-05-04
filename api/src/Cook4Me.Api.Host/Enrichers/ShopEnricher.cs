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
using System.Linq;

namespace Cook4Me.Api.Host.Enrichers
{
    public interface IShopEnricher
    {
        void Enrich(IHalResponseBuilder halResponseBuilder, ShopAggregate shop);
    }

    public class ShopEnricher : IShopEnricher
    {
        private readonly IResponseBuilder _responseBuilder;

        public ShopEnricher(IResponseBuilder responseBuilder)
        {
            _responseBuilder = responseBuilder;
        }

        public void Enrich(IHalResponseBuilder halResponseBuilder, ShopAggregate shop)
        {
            halResponseBuilder.AddEmbedded(e => e.AddObject(_responseBuilder.GetShop(shop),
                (l) =>
                {
                    l.AddOtherItem("category", new Dtos.Link("/" + Constants.RouteNames.Categories + "/" + shop.CategoryId, shop.ShopCategory.Name)).AddSelf(Constants.RouteNames.Shops + "/" + shop.Id);
                    if (shop.ShopFilters != null && shop.ShopFilters.Any())
                    {
                        foreach (var filter in shop.ShopFilters)
                        {
                            l.AddOtherItem("filters", new Dtos.Link("/" + Constants.RouteNames.Filers + "/" + filter.Id, filter.Name));
                        }
                    }

                    if (shop.ProductCategories != null && shop.ProductCategories.Any())
                    {
                        foreach (var productCategory in shop.ProductCategories)
                        {
                            l.AddOtherItem("productCategories", new Dtos.Link("/" + Constants.RouteNames.Filers + "/" + productCategory.Id, productCategory.Name));
                        }
                    }
                }));
        }
    }
}
