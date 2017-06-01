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

using Cook4Me.Api.Core.Commands.Service;
using System.Threading.Tasks;
using System;
using Cook4Me.Api.Core.Repositories;
using System.Linq;

namespace Cook4Me.Api.Host.Validators
{
    public interface IAddServiceValidator
    {
        Task<AddServiceValidationResult> Validate(AddServiceCommand command, string subject);
    }

    public class AddServiceValidationResult
    {
        public AddServiceValidationResult()
        {
            IsValid = true;
        }

        public AddServiceValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class AddServiceValidator : IAddServiceValidator
    {
        private readonly IShopRepository _shopRepository;

        public AddServiceValidator(IShopRepository shopRepository)
        {
            _shopRepository = shopRepository;
        }

        public async Task<AddServiceValidationResult> Validate(AddServiceCommand command, string subject)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var shop = await _shopRepository.Get(command.ShopId);
            if (shop == null)
            {
                return new AddServiceValidationResult(ErrorDescriptions.TheShopDoesntExist);
            }

            if (shop.Subject != subject)
            {
                return new AddServiceValidationResult(ErrorDescriptions.TheServiceCannotBeAddedByYou);
            }

            if (!IsValid(command.Name, 1, 15))
            {
                return new AddServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Service.Name, 1, 15));
            }

            if (!IsValid(command.Description, 1, 255))
            {
                return new AddServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Service.Description, 1, 255));
            }

            if (command.Price < 0)
            {
                return new AddServiceValidationResult(ErrorDescriptions.ThePriceCannotBeLessThanZero);
            }

            if (command.Occurrence == null)
            {
                return new AddServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Service.Occurrence));
            }

            if (command.Occurrence.Days == null || !command.Occurrence.Days.Any())
            {
                return new AddServiceValidationResult(ErrorDescriptions.TheDaysAreNotValid);
            }

            if (command.Occurrence.StartDate == default(DateTime))
            {
                return new AddServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Occurrence.StartDate));
            }

            if (command.Occurrence.EndDate == default(DateTime))
            {
                return new AddServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Occurrence.EndDate));
            }

            if (command.Occurrence.StartDate > command.Occurrence.EndDate || command.Occurrence.EndDate < DateTime.UtcNow)
            {
                return new AddServiceValidationResult(ErrorDescriptions.TheOccurrenceDatePeriodIsNotValid);
            }

            if (command.Occurrence.StartTime == default(TimeSpan))
            {
                return new AddServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Occurrence.StartTime));
            }

            if (command.Occurrence.EndTime == default(TimeSpan))
            {
                return new AddServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Occurrence.EndTime));
            }

            if (command.Occurrence.StartTime > command.Occurrence.EndTime)
            {
                return new AddServiceValidationResult(ErrorDescriptions.TheOccurrenceTimePeriodIsNotValid);
            }

            return new AddServiceValidationResult();
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
