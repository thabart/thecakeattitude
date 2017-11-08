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
using Cook4Me.Api.Core.Commands.Shop;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IUpdateShopValidator
    {
        Task<UpdateShopValidationResult> Validate(UpdateShopCommand shop, string subject);
    }

    public class UpdateShopValidationResult
    {
        public UpdateShopValidationResult(ShopAggregate shop)
        {
            Shop = shop;
            IsValid = true;
        }

        public UpdateShopValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
        public ShopAggregate Shop { get; set; }
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

            foreach (var paymentMethod in shop.PaymentMethods)
            {
                if (paymentMethod.Method == AddPaymentInformationMethods.BankTransfer) // Check bank transfer.
                {
                    var regex = new Regex("^[A-Z]{2}[0-9]{2}([0-9]{4}){3}", RegexOptions.IgnoreCase);
                    if (!regex.IsMatch(paymentMethod.Iban))
                    {
                        return new UpdateShopValidationResult(ErrorDescriptions.TheIbanIsNotValid);
                    }
                }
                else if (paymentMethod.Method == AddPaymentInformationMethods.PayPal) // Check paypal account.
                {
                    var regex = new Regex(@"^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$", RegexOptions.IgnoreCase);
                    if (!regex.IsMatch(paymentMethod.PaypalAccount))
                    {
                        return new UpdateShopValidationResult(ErrorDescriptions.ThePaypalAccountIsNotValid);
                    }
                }
            }

            if (shop.ProductCategories != null)
            {
                if (shop.ProductCategories.Any(f => string.IsNullOrWhiteSpace(f.Name)))
                {
                    return new UpdateShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.ProductCategories + "." + Constants.DtoNames.ProductCategory.Name));
                }

                if (shop.ProductCategories.GroupBy(c => c.Name).Any(kvp => kvp.Count() > 1))
                {
                    return new UpdateShopValidationResult(string.Format(ErrorDescriptions.DuplicateValues, Constants.DtoNames.Shop.ProductCategories));
                }

                if (shop.ProductCategories.Count() > 6)
                {
                    return new UpdateShopValidationResult(ErrorDescriptions.OnlyEightCategoriesCanBeAdded);
                }
            }

            if (shop.ProductFilters != null)
            {
                if (shop.ProductFilters.Any(f => string.IsNullOrWhiteSpace(f.Name)))
                {
                    return new UpdateShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.Filters + "." + Constants.DtoNames.Filter.Name));
                }

                if (shop.ProductFilters.Any(f => f.Values == null || !f.Values.Any()))
                {
                    return new UpdateShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.Filters + "." + Constants.DtoNames.Filter.Values));
                }

                if (shop.ProductFilters.GroupBy(c => c.Name).Any(kvp => kvp.Count() > 1))
                {
                    return new UpdateShopValidationResult(string.Format(ErrorDescriptions.DuplicateValues, Constants.DtoNames.Shop.Filters));
                }

                if (shop.ProductFilters.Any(p => p.Values.GroupBy(v => v).Count() != p.Values.Count()))
                {
                    return new UpdateShopValidationResult(string.Format(ErrorDescriptions.DuplicateValues, Constants.DtoNames.Shop.Filters + "." + Constants.DtoNames.Filter.Values));
                }
            }

            if (shop.UpdateGameEntities != null)
            {
                if (shop.UpdateGameEntities.Any(ug => record.ProductCategories.Any(pc => !string.IsNullOrWhiteSpace(ug.ProductCategoryId) && ug.ProductCategoryId != pc.Id)))
                {
                    return new UpdateShopValidationResult(ErrorDescriptions.TheProductCategoriesDoesntExist);
                }
            }

            return new UpdateShopValidationResult(record);
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
