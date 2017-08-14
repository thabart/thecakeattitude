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

using Cook4Me.Api.Core.Commands.ClientService;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IAddClientServiceValidator
    {
        Task<AddClientServiceValidationResult> Validate(AddClientServiceCommand command);
    }

    public class AddClientServiceValidationResult
    {
        public AddClientServiceValidationResult()
        {
            IsValid = true;
        }

        public AddClientServiceValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class AddClientServiceValidator : IAddClientServiceValidator
    {
        private readonly IShopCategoryRepository _categoryRepository;
        private readonly IClientServiceRepository _announcementRepository;
        private readonly IServiceRepository _serviceRepository;

        public AddClientServiceValidator(IShopCategoryRepository categoryRepository, IClientServiceRepository announcementRepository)
        {
            _categoryRepository = categoryRepository;
            _announcementRepository = announcementRepository;
        }

        public async Task<AddClientServiceValidationResult> Validate(AddClientServiceCommand command)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            if (!IsValid(command.Name, 1, 50))
            {
                return new AddClientServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.ClientService.Name, 1, 15));
            }

            if (!IsValid(command.Description, 1, 255))
            {
                return new AddClientServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.ClientService.Description, 1, 255));
            }

            if (command.Price < 0)
            {
                return new AddClientServiceValidationResult(ErrorDescriptions.ThePriceCannotBeLessThanZero);
            }

            if (!IsValid(command.GooglePlaceId))
            {
                return new AddClientServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.ClientService.GooglePlaceId));
            }

            if (!string.IsNullOrWhiteSpace(command.CategoryId))
            {
                var category = await _categoryRepository.Get(command.CategoryId);
                if (category == null)
                {
                    return new AddClientServiceValidationResult(ErrorDescriptions.TheCategoryDoesntExist);
                }
            }

            return new AddClientServiceValidationResult();
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
