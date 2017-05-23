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

using Cook4Me.Api.Core.Commands.Product;
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IAddProductValidator
    {
        Task<AddProductValidationResult> Validate(AddProductCommand command, string subject);
    }

    public class AddProductValidationResult
    {
        public AddProductValidationResult()
        {
            IsValid = true;
        }

        public AddProductValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class AddProductValidator : IAddProductValidator
    {
        private static IEnumerable<string> _unitOfMeasures = new[]
        {
            "kg",
            "piece", 
            "l"
        };
        private readonly IShopRepository _shopRepository;
        private readonly IFilterRepository _filterRepository;

        public AddProductValidator(IShopRepository shopRepository, IFilterRepository filterRepository)
        {
            _shopRepository = shopRepository;
            _filterRepository = filterRepository;
        }

        public async Task<AddProductValidationResult> Validate(AddProductCommand command, string subject)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            if (string.IsNullOrWhiteSpace(command.ShopId))
            {
                return new AddProductValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Product.ShopId));
            }

            if (string.IsNullOrWhiteSpace(command.UnitOfMeasure))
            {
                return new AddProductValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Product.UnitOfMeasure));
            }

            var shop = await _shopRepository.Get(command.ShopId);
            if (shop == null)
            {
                return new AddProductValidationResult(ErrorDescriptions.TheShopDoesntExist);
            }

            if (shop.Subject == subject)
            {
                return new AddProductValidationResult(ErrorDescriptions.TheProductCannotBeAddedByYou);
            }

            if (!IsValid(command.Name, 1, 15))
            {
                return new AddProductValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Product.Name, 1, 15));
            }

            if (!IsValid(command.Description, 1, 255))
            {
                return new AddProductValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Product.Description, 1, 255));
            }

            if (command.Price < 0)
            {
                return new AddProductValidationResult(ErrorDescriptions.ThePriceCannotBeLessThanZero);
            }

            if (command.Quantity < 0)
            {
                return new AddProductValidationResult(ErrorDescriptions.TheQuantityCannotBeLessThanZero);
            }

            if (command.AvailableInStock != null && command.AvailableInStock < 0)
            {
                return new AddProductValidationResult(ErrorDescriptions.TheAvailableInStockCannotBeLessThanZero);
            }

            var unitOfMeasure = _unitOfMeasures.FirstOrDefault(u => command.UnitOfMeasure.ToLowerInvariant().Equals(u, StringComparison.CurrentCultureIgnoreCase));
            if (string.IsNullOrWhiteSpace(unitOfMeasure))
            {
                return new AddProductValidationResult(string.Format(ErrorDescriptions.TheUnitOfMeasureIsNotCorrect, string.Join("," ,_unitOfMeasures)));
            }

            if (command.Filters != null)
            {
                var filters = await _filterRepository.Search(new SearchFiltersParameter
                {
                    Filters = command.Filters.Select(f => f.FilterId)
                });
                if (command.Filters.Count() != filters.Filters.Count())
                {
                    return new AddProductValidationResult(ErrorDescriptions.SomeFiltersAreNotValid);
                }
            }

            return new AddProductValidationResult();
        }

        private static bool IsValid(string value, int min, int max)
        {
            return !string.IsNullOrWhiteSpace(value) && (value.Length >= min) && (value.Length <= max);
        }
    }
}
