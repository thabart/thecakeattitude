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
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IAddShopValidator
    {
        Task<AddShopValidationResult> Validate(AddShopCommand shop, string subject); 
    }

    public class AddShopValidationResult
    {
        public AddShopValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public AddShopValidationResult(ShopCategoryAggregate category, ShopMap map)
        {
            IsValid = true;
            Category = category;
            Map = map;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
        public ShopCategoryAggregate Category { get; private set; }
        public ShopMap Map { get; private set; }
    }

    public class AddShopValidator : IAddShopValidator
    {
        private readonly IShopCategoryRepository _categoryRepository;
        private readonly IShopRepository _shopRepository;
        private readonly IMapRepository _mapRepository;

        public AddShopValidator(IShopCategoryRepository categoryRepository, IShopRepository shopRepository, IMapRepository mapRepository)
        {
            _categoryRepository = categoryRepository;
            _shopRepository = shopRepository;
            _mapRepository = mapRepository;
        }

        public async Task<AddShopValidationResult> Validate(AddShopCommand shop, string subject)
        {
            if (shop == null)
            {
                throw new ArgumentNullException(nameof(shop));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            // 1. Check category.
            var category = await _categoryRepository.Get(shop.CategoryId);
            if (category == null)
            {
                return new AddShopValidationResult(ErrorDescriptions.TheCategoryDoesntExist);
            }

            // 2. Check map
            var map = await _mapRepository.Get(shop.MapName);
            if (map == null)
            {
                return new AddShopValidationResult(ErrorDescriptions.TheMapDoesntExist);
            }

            // 3. Check place id exists.
            var partialMap = "wwwroot" + map.PartialMapUrl;
            if (!File.Exists(partialMap))
            {
                return new AddShopValidationResult(ErrorDescriptions.TheMapFileDoesntExist);
            }

            using (var stream = File.OpenText(partialMap))
            {
                using (var reader = new JsonTextReader(stream))
                {
                    var obj = JObject.Load(reader);
                    if (obj.SelectToken(@"$..layers[?(@.name == 'Npcs')].objects[?(@.name == '" + shop.PlaceId + "')]") == null)
                    {
                        return new AddShopValidationResult(ErrorDescriptions.ThePlaceDoesntExist);
                    }
                }
            }

            // 4. Check the user doesn't already have a shop on the same category.
            var searchResult = await _shopRepository.Search(new SearchShopsParameter
            {
                CategoryIds = new[] { shop.CategoryId },
                Subjects = new[] { subject }
            });
            if (searchResult.Content != null && searchResult.Content.Any())
            {
                return new AddShopValidationResult(ErrorDescriptions.TheShopCannotBeAddedBecauseThereIsAlreadyOneInTheCategory);
            }

            // 5. Check mandatory parameters.
            if (!IsValid(shop.Name, 1, 15))
            {
                return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Shop.Name, 1, 15));
            }

            if (!IsValid(shop.Description, 1, 255))
            {
                return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatoryAndShouldContainsBetween, Constants.DtoNames.Shop.Description, 5, 15));
            }

            if (!IsValid(shop.PlaceId))
            {
                return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.Place));
            }

            if (!IsValid(shop.GooglePlaceId))
            {
                return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.GooglePlaceId));
            }

            if (!IsValid(shop.StreetAddress))
            {
                return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.StreetAddress));
            }

            if (!IsValid(shop.PostalCode))
            {
                return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.PostalCode));
            }

            if (!IsValid(shop.Locality))
            {
                return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.Locality));
            }

            if (!IsValid(shop.Country))
            {
                return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.Country));
            }

            if (shop.PaymentMethods == null || !shop.PaymentMethods.Any())
            {
                return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.Payments));
            }

            if (shop.ProductCategories != null)
            {
                if (shop.ProductCategories.Any(f => string.IsNullOrWhiteSpace(f.Name)))
                {
                    return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.ProductCategories + "." + Constants.DtoNames.ProductCategory.Name));
                }

                if (shop.ProductCategories.GroupBy(c => c.Name).Any(kvp => kvp.Count() > 1))
                {
                    return new AddShopValidationResult(string.Format(ErrorDescriptions.DuplicateValues, Constants.DtoNames.Shop.ProductCategories));
                }
            }

            if (shop.ProductFilters != null)
            {
                if (shop.ProductFilters.Any(f => string.IsNullOrWhiteSpace(f.Name)))
                {
                    return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.Filters + "." + Constants.DtoNames.Filter.Name));
                }

                if (shop.ProductFilters.Any(f => f.Values == null || !f.Values.Any()))
                {
                    return new AddShopValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.Shop.Filters + "." + Constants.DtoNames.Filter.Values));
                }

                if (shop.ProductFilters.GroupBy(c => c.Name).Any(kvp => kvp.Count() > 1))
                {
                    return new AddShopValidationResult(string.Format(ErrorDescriptions.DuplicateValues, Constants.DtoNames.Shop.Filters));
                }

                if (shop.ProductFilters.Any(p => p.Values.GroupBy(v => v).Count() != p.Values.Count()))
                {
                    return new AddShopValidationResult(string.Format(ErrorDescriptions.DuplicateValues, Constants.DtoNames.Shop.Filters + "." + Constants.DtoNames.Filter.Values));
                }
            }

            return new AddShopValidationResult(category, map);
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
