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

using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.Host.Builders;
using System;

namespace Cook4Me.Api.Host.Enrichers
{
    public interface IProductCommentEnricher
    {
        void Enrich(IHalResponseBuilder halResponseBuilder, ProductComment productComment, string productId);
    }

    internal class ProductCommentEnricher : IProductCommentEnricher
    {
        private readonly IResponseBuilder _responseBuilder;

        public ProductCommentEnricher(IResponseBuilder responseBuilder)
        {
            _responseBuilder = responseBuilder;
        }

        public void Enrich(IHalResponseBuilder halResponseBuilder, ProductComment productComment, string productId)
        {
            if (halResponseBuilder == null)
            {
                throw new ArgumentNullException(nameof(halResponseBuilder));
            }

            if (productComment == null)
            {
                throw new ArgumentNullException(nameof(productComment));
            }

            halResponseBuilder.AddEmbedded(e => e.AddObject(_responseBuilder.GetProductComment(productComment),
                (l) => l.AddOtherItem("product", new Dtos.Link("/" + Constants.RouteNames.Products + "/" + productId))));
        }
    }
}
