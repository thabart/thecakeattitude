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

using Cook4Me.Api.Core.Commands.Shop;
using System;
using Cook4Me.Api.Core.Repositories;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IUpdateShopValidator
    {
        Task<UpdateShopValidationResult> Validate(UpdateShopCommand shop, string subject);
    }

    public class UpdateShopValidationResult
    {
        public UpdateShopValidationResult()
        {
            IsValid = true;
        }

        public UpdateShopValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class UpdateShopValidator : IUpdateShopValidator
    {
        private readonly IShopRepository _shopRepository;
        private readonly IMapRepository _mapRepository;

        public UpdateShopValidator(IShopRepository shopRepository, IMapRepository mapRepository)
        {
            _shopRepository = shopRepository;
            _mapRepository = mapRepository;
        }

        public async Task<UpdateShopValidationResult> Validate(UpdateShopCommand shop, string subject)
        {
            if (shop == null)
            {
                throw new ArgumentNullException(nameof(shop));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var record = await _shopRepository.Get(shop.Id);
            if (record == null)
            {
                return new UpdateShopValidationResult(ErrorDescriptions.TheShopDoesntExist);
            }

            // 1. Check mandatory parameters.
            if (!IsValid(shop.Name, 1, 15))
            {
                return new UpdateShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Shop.Name, 1, 15));
            }

            if (!IsValid(shop.Description, 1, 255))
            {
                return new UpdateShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Shop.Description, 5, 15));
            }

            if (!IsValid(shop.GooglePlaceId))
            {
                return new UpdateShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.GooglePlaceId));
            }

            if (!IsValid(shop.StreetAddress))
            {
                return new UpdateShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.StreetAddress));
            }

            if (!IsValid(shop.PostalCode))
            {
                return new UpdateShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.PostalCode));
            }

            if (!IsValid(shop.Locality))
            {
                return new UpdateShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.Locality));
            }

            if (!IsValid(shop.Country))
            {
                return new UpdateShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.Country));
            }

            if (shop.PaymentMethods == null || !shop.PaymentMethods.Any())
            {
                return new UpdateShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.Payments));
            }

            return new UpdateShopValidationResult();
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
