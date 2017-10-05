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
using Cook4Me.Api.Core.Commands.Discount;
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IAddDiscountValidator
    {
        Task<AddDiscountValidationResult> Validate(AddDiscountCommand command, string subject);
    }

    public class AddDiscountValidationResult
    {
        public AddDiscountValidationResult()
        {
            IsValid = true;
        }

        public AddDiscountValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public string Message { get; set; }
        public bool IsValid { get; set; }
    }

    internal class AddDiscountValidator : IAddDiscountValidator
    {
        private readonly IProductRepository _productRepository;
        private readonly IShopRepository _shopRepository;

        public AddDiscountValidator(IProductRepository productRepository, IShopRepository shopRepository)
        {
            _productRepository = productRepository;
            _shopRepository = shopRepository;
        }   

        public async Task<AddDiscountValidationResult> Validate(AddDiscountCommand command, string subject)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            if (command.ProductIds == null || !command.ProductIds.Any())
            {
                return new AddDiscountValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.DiscountNames.ProductIds));
            }
            
            if (command.Value <= 0)
            {
                return new AddDiscountValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.DiscountNames.Value));
            }
            
            if ((command.Validity == DiscountAggregateValidities.Counter || command.Validity == DiscountAggregateValidities.Both) && command.Counter <= 0)
            {
                return new AddDiscountValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.DiscountNames.Counter));
            }

            if ((command.Validity == DiscountAggregateValidities.Timer || command.Validity == DiscountAggregateValidities.Both))
            {
                if (command.StartDateTime.Equals(default(DateTime)))
                {
                    return new AddDiscountValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.DiscountNames.StartDateTime));
                }

                if (command.EndDateTime.Equals(default(DateTime)))
                {
                    return new AddDiscountValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.DiscountNames.EndDateTime));
                }

                if (command.StartDateTime >= command.EndDateTime)
                {
                    return new AddDiscountValidationResult(ErrorDescriptions.TheStartDateMustBeInferiorToEndDate);
                }
            }

            var products = await _productRepository.Search(new SearchProductsParameter
            {
                ProductIds = command.ProductIds
            });

            if(products.Content == null || products.Content.Count() != command.ProductIds.Count())
            {
                return new AddDiscountValidationResult(ErrorDescriptions.SomeProductsDontExist);
            }

            if ((command.Validity == DiscountAggregateValidities.Counter || command.Validity == DiscountAggregateValidities.Both) 
                && command.PromotionType == DiscountAggregatePromotions.FixedAmount && products.Content.Any(p => p.Price <= command.Value))
            {
                return new AddDiscountValidationResult(ErrorDescriptions.TheProductPriceCannotBeInferiorToTheDiscount);
            }

            var shopIds = products.Content.Select(p => p.ShopId).Distinct();
            if (shopIds.Count() != 1)
            {
                return new AddDiscountValidationResult(ErrorDescriptions.TheProductsShouldBelongsToTheSameShop);
            }

            var shop = await _shopRepository.Get(shopIds.First());
            if (shop.Subject != subject)
            {
                return new AddDiscountValidationResult(ErrorDescriptions.TheDiscountCannotBeAddedByYou);
            }

            return new AddDiscountValidationResult();
        }
    }
}
