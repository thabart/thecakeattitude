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

using Cook4Me.Api.Core.Commands.Orders;
using System.Threading.Tasks;
using System;
using Cook4Me.Api.Core.Repositories;

namespace Cook4Me.Api.Host.Validators
{
    public interface IAddOrderLineValidator
    {
        Task<AddOrderLineValidationResult> Execute(AddOrderLineCommand command);
    }

    public class AddOrderLineValidationResult
    {
        public AddOrderLineValidationResult()
        {
            IsValid = true;
        }

        public AddOrderLineValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class AddOrderLineValidator : IAddOrderLineValidator
    {
        private static IProductRepository _productRepository;
        private static IShopRepository _shopRepository;

        public AddOrderLineValidator(IProductRepository productRepository, IShopRepository shopRepository)
        {
            _productRepository = productRepository;
            _shopRepository = shopRepository;
        }

        public  async Task<AddOrderLineValidationResult> Execute(AddOrderLineCommand command)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            if (string.IsNullOrWhiteSpace(command.ProductId))
            {
                return new AddOrderLineValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.OrderLineNames.ProductId));
            }

            var product = await _productRepository.Get(command.ProductId);
            if (product == null)
            {
                return new AddOrderLineValidationResult(ErrorDescriptions.TheProductDoesntExist);
            }

            if (command.Quantity <= 0)
            {
                return new AddOrderLineValidationResult(ErrorDescriptions.TheOrderLineQuantityIsInvalid);
            }

            if (command.Quantity > product.AvailableInStock)
            {
                return new AddOrderLineValidationResult(ErrorDescriptions.TheOrderLineQuantityIsTooMuch);
            }

            var shop = await _shopRepository.Get(product.ShopId);
            if (shop == null)
            {
                return new AddOrderLineValidationResult(ErrorDescriptions.TheShopDoesntExist);
            }

            if (shop.Subject == command.Subject)
            {
                return new AddOrderLineValidationResult(ErrorDescriptions.TheProductCannotBeOrderedByYou);
            }


            return new AddOrderLineValidationResult();
        }
    }
}
