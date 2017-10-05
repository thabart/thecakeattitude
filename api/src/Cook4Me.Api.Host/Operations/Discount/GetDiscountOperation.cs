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
using Cook4Me.Api.Host.Helpers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Discount
{
    public interface IGetDiscountOperation
    {
        Task<IActionResult> Execute(string discountId, string subject);
    }

    internal class GetDiscountOperation : IGetDiscountOperation
    {
        private readonly IDiscountRepository _discountRepository;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IDiscountEnricher _discountEnricher;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IControllerHelper _controllerHelper;

        public GetDiscountOperation(IDiscountRepository discountRepository, IHalResponseBuilder halResponseBuilder, IDiscountEnricher discountEnricher,
            IResponseBuilder responseBuilder, IControllerHelper controllerHelper)
        {
            _discountRepository = discountRepository;
            _halResponseBuilder = halResponseBuilder;
            _discountEnricher = discountEnricher;
            _responseBuilder = responseBuilder;
            _controllerHelper = controllerHelper;
        }

        public async Task<IActionResult> Execute(string discountId, string subject)
        {
            if (string.IsNullOrWhiteSpace(discountId))
            {
                throw new ArgumentNullException(nameof(discountId));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var discount = await _discountRepository.Get(discountId);
            if (discount == null)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Server, ErrorDescriptions.TheDiscountDoesntExist);
                return _controllerHelper.BuildResponse(System.Net.HttpStatusCode.NotFound, error);
            }
            
            if (discount.Subject != subject)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Server, ErrorDescriptions.TheDiscountCannotBeAccessedByYou);
                return _controllerHelper.BuildResponse(System.Net.HttpStatusCode.BadRequest, error);
            }

            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Discounts + "/" + discountId));
            _discountEnricher.Enrich(_halResponseBuilder, discount);
            return new OkObjectResult(_halResponseBuilder.Build());
        }
    }
}
