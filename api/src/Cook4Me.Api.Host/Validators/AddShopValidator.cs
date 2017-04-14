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

using Cook4Me.Api.Core.Models;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IAddShopValidator
    {
        Task<AddShopValidationResult> Validate(Shop shop, string subject); 
    }

    public class AddShopValidationResult
    {
        public AddShopValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public AddShopValidationResult(Category category)
        {
            IsValid = true;
            Category = category;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
        public Category Category { get; private set; }
    }

    public class AddShopValidator : IAddShopValidator
    {
        private readonly ICategoryRepository _categoryRepository;

        public AddShopValidator(ICategoryRepository categoryRepository)
        {
            _categoryRepository = categoryRepository;
        }

        public async Task<AddShopValidationResult> Validate(Shop shop, string subject)
        {
            if (shop == null)
            {
                throw new ArgumentNullException(nameof(shop));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            // Check category.
            var category = await _categoryRepository.Get(shop.CategoryId);
            if (category == null)
            {
                return new AddShopValidationResult(ErrorDescriptions.TheCategoryDoesntExist);
            }

            // Check mandatory parameters.
            if (!IsValid(shop.Name, 1, 15))
            {
                return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Shop.Name, 5, 15));
            }

            if (!IsValid(shop.Description, 1, 255))
            {
                return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Shop.Description, 5, 15));
            }

            if (!IsValid(shop.PlaceId))
            {
                return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.Place));
            }

            return new AddShopValidationResult(category);
        }

        private static bool IsValid(string value, int min, int max)
        {
            return !string.IsNullOrWhiteSpace(value) && (value.Length >= min) && (value.Length <= max);
        }

        private static bool IsValid(string value)
        {
            return !string.IsNullOrWhiteSpace(value);
        }
    }
}
