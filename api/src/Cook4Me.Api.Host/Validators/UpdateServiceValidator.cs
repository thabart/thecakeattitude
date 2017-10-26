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
using Cook4Me.Api.Core.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IUpdateServiceValidator
    {
        Task<UpdateServiceValidationResult> Execute(UpdateServiceCommand command, string subject);
    }

    public class UpdateServiceValidationResult
    {
        public UpdateServiceValidationResult()
        {
            IsValid = true;
        }

        public UpdateServiceValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; set; }
        public string Message { get; set; }
    }

    internal class UpdateServiceValidator : IUpdateServiceValidator
    {
        private readonly IShopRepository _shopRepository;
        private readonly IServiceRepository _serviceRepository;

        public UpdateServiceValidator(IShopRepository shopRepository, IServiceRepository serviceRepository)
        {
            _shopRepository = shopRepository;
            _serviceRepository = serviceRepository;
        }

        public async Task<UpdateServiceValidationResult> Execute(UpdateServiceCommand command, string subject)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var service = await _serviceRepository.Get(command.Id);
            if (service == null)
            {
                return new UpdateServiceValidationResult(ErrorDescriptions.TheServiceDoesntExist);
            }

            var shop = await _shopRepository.Get(service.ShopId);
            if (shop == null)
            {
                return new UpdateServiceValidationResult(ErrorDescriptions.TheShopDoesntExist);
            }

            if (shop.Subject != subject)
            {
                return new UpdateServiceValidationResult(ErrorDescriptions.TheServiceCannotBeUpdatedByYou);
            }

            if (!IsValid(command.Name, 1, 50))
            {
                return new UpdateServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Service.Name, 1, 50));
            }

            if (!IsValid(command.Description, 1, 255))
            {
                return new UpdateServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Service.Description, 1, 255));
            }

            if (command.Occurrence == null)
            {
                return new UpdateServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Service.Occurrence));
            }

            if (command.Occurrence.Days == null || !command.Occurrence.Days.Any())
            {
                return new UpdateServiceValidationResult(ErrorDescriptions.TheDaysAreNotValid);
            }

            if (command.Occurrence.StartDate == default(DateTime))
            {
                return new UpdateServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Occurrence.StartDate));
            }

            if (command.Occurrence.EndDate == default(DateTime))
            {
                return new UpdateServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Occurrence.EndDate));
            }

            if (command.Occurrence.StartDate > command.Occurrence.EndDate || command.Occurrence.EndDate < DateTime.UtcNow)
            {
                return new UpdateServiceValidationResult(ErrorDescriptions.TheOccurrenceDatePeriodIsNotValid);
            }

            if (command.Occurrence.StartTime == default(TimeSpan))
            {
                return new UpdateServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Occurrence.StartTime));
            }

            if (command.Occurrence.EndTime == default(TimeSpan))
            {
                return new UpdateServiceValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Occurrence.EndTime));
            }

            if (command.Occurrence.StartTime > command.Occurrence.EndTime)
            {
                return new UpdateServiceValidationResult(ErrorDescriptions.TheOccurrenceTimePeriodIsNotValid);
            }
            
            if (command.Images != null)
            {
                foreach (var image in command.Images)
                {
                    Uri uri;
                    if (Uri.TryCreate(image, UriKind.Absolute, out uri) && (uri.Scheme == "http" || uri.Scheme == "https"))
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
                        return new UpdateServiceValidationResult(ErrorDescriptions.TheProductImageCanBeUrlOrBase64Encoded);
                    }
                }
            }

            return new UpdateServiceValidationResult();
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
