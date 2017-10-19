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
    public interface IUpdateProductValidator
    {
        Task<UpdateProductValidationResult> Validate(UpdateProductCommand command, string subject);
    }

    public class UpdateProductValidationResult
    {
        public UpdateProductValidationResult()
        {
            IsValid = true;
        }

        public UpdateProductValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; set; }
        public string Message { get; set; }
    }

    internal class UpdateProductValidator : IUpdateProductValidator
    {
        private static IEnumerable<string> _unitOfMeasures = new[]
        {
            "kg",
            "piece",
            "l"
        };
        private readonly IProductRepository _productRepository;
        private readonly IShopRepository _shopRepository;
        private readonly IFilterRepository _filterRepository;

        public UpdateProductValidator(IProductRepository productRepository, IShopRepository shopRepository, IFilterRepository filterRepository)
        {
            _productRepository = productRepository;
            _shopRepository = shopRepository;
            _filterRepository = filterRepository;
        }

        public async Task<UpdateProductValidationResult> Validate(UpdateProductCommand command, string subject)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var record = await _productRepository.Get(command.Id);
            var shop = await _shopRepository.Get(record.ShopId);
            if (record == null)
            {
                return new UpdateProductValidationResult(ErrorDescriptions.TheProductDoesntExist);
            }

            if (shop == null)
            {
                return new UpdateProductValidationResult(ErrorDescriptions.TheShopDoesntExist);
            }

            if (shop.Subject != subject)
            {
                return new UpdateProductValidationResult(ErrorDescriptions.TheProductCannotBeUpdatedByYou);
            }

            if (!IsValid(command.Name, 1, 50))
            {
                return new UpdateProductValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Product.Name, 1, 15));
            }

            if (!IsValid(command.Description, 1, 255))
            {
                return new UpdateProductValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Product.Description, 1, 255));
            }

            if (command.Price < 0)
            {
                return new UpdateProductValidationResult(ErrorDescriptions.ThePriceCannotBeLessThanZero);
            }

            if (command.Quantity < 0)
            {
                return new UpdateProductValidationResult(ErrorDescriptions.TheQuantityCannotBeLessThanZero);
            }

            if (command.AvailableInStock != null && command.AvailableInStock < 0)
            {
                return new UpdateProductValidationResult(ErrorDescriptions.TheAvailableInStockCannotBeLessThanZero);
            }

            if (command.PartialImagesUrl != null)
            {
                foreach(var image in command.PartialImagesUrl)
                {
                    Uri uri;
                    if (Uri.TryCreate(image, UriKind.RelativeOrAbsolute, out uri))
                    {
                        continue;
                    }

                    try
                    {
                        var base64Encoded = image;
                        base64Encoded = base64Encoded.Substring(image.IndexOf(',') + 1);
                        base64Encoded = base64Encoded.Trim('\0');
                        Convert.FromBase64String(base64Encoded);
                    }
                    catch
                    {
                        return new UpdateProductValidationResult(ErrorDescriptions.TheProductImageCanBeUrlOrBase64Encoded);
                    }
                }
            }

            var unitOfMeasure = _unitOfMeasures.FirstOrDefault(u => command.UnitOfMeasure.ToLowerInvariant().Equals(u, StringComparison.CurrentCultureIgnoreCase));
            if (string.IsNullOrWhiteSpace(unitOfMeasure))
            {
                return new UpdateProductValidationResult(string.Format(ErrorDescriptions.TheUnitOfMeasureIsNotCorrect, string.Join(",", _unitOfMeasures)));
            }

            if (command.Filters != null && command.Filters.Any())
            {
                var filterValuesIds = command.Filters.Select(f => f.ValueId);
                var filters = await _filterRepository.Search(new SearchFilterValuesParameter
                {
                    FilterValueIds = filterValuesIds
                });
                if (filters.Filters.Count() != filterValuesIds.Count())
                {
                    return new UpdateProductValidationResult(ErrorDescriptions.SomeFiltersAreNotValid);
                }
            }

            return new UpdateProductValidationResult();
        }

        private static bool IsValid(string value, int min, int max)
        {
            return !string.IsNullOrWhiteSpace(value) && (value.Length >= min) && (value.Length <= max);
        }
    }
}
