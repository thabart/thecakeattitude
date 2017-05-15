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

using Cook4Me.Api.Core.Commands.Announcement;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IAddAnnouncementValidator
    {
        Task<AddAnnouncementValidationResult> Validate(AddAnnouncementCommand command);
    }

    public class AddAnnouncementValidationResult
    {
        public AddAnnouncementValidationResult()
        {
            IsValid = true;
        }

        public AddAnnouncementValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class AddAnnouncementValidator : IAddAnnouncementValidator
    {
        private readonly IShopCategoryRepository _categoryRepository;
        private readonly IAnnouncementRepository _announcementRepository;
        private readonly IServiceRepository _serviceRepository;

        public AddAnnouncementValidator(IShopCategoryRepository categoryRepository, IAnnouncementRepository announcementRepository)
        {
            _categoryRepository = categoryRepository;
            _announcementRepository = announcementRepository;
        }

        public async Task<AddAnnouncementValidationResult> Validate(AddAnnouncementCommand command)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            if (!IsValid(command.Name, 1, 15))
            {
                return new AddAnnouncementValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Announcement.Name, 1, 15));
            }

            if (!IsValid(command.Description, 1, 255))
            {
                return new AddAnnouncementValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Announcement.Description, 1, 255));
            }

            if (!IsValid(command.GooglePlaceId))
            {
                return new AddAnnouncementValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Announcement.GooglePlaceId));
            }

            if (!string.IsNullOrWhiteSpace(command.CategoryId))
            {
                var category = await _categoryRepository.Get(command.CategoryId);
                if (category == null)
                {
                    return new AddAnnouncementValidationResult(ErrorDescriptions.TheCategoryDoesntExist);
                }
            }

            return new AddAnnouncementValidationResult();
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
