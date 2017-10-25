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
using Cook4Me.Api.Core.Repositories;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IRemoveProductValidator
    {
        Task<RemoveProductValidationResult> Validate(RemoveProductCommand command);
    }

    public class RemoveProductValidationResult
    {
        public RemoveProductValidationResult()
        {
            IsValid = true;
        }

        public RemoveProductValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class RemoveProductValidator : IRemoveProductValidator
    {
        private readonly IProductRepository _repository;
        private readonly IShopRepository _shopRepository;

        public RemoveProductValidator(IProductRepository repository, IShopRepository shopRepository)
        {
            _repository = repository;
            _shopRepository = shopRepository;
        }

        public async Task<RemoveProductValidationResult> Validate(RemoveProductCommand command)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            var product = await _repository.Get(command.ProductId);
            if (product == null)
            {
                return new RemoveProductValidationResult(ErrorDescriptions.TheProductDoesntExist);
            }

            var shop = await _shopRepository.Get(product.ShopId);
            if (shop == null)
            {
                return new RemoveProductValidationResult(ErrorDescriptions.TheShopDoesntExist);
            }

            if (shop.Subject != command.Subject)
            {
                return new RemoveProductValidationResult(ErrorDescriptions.TheProductCannotBeRemovedByYou);
            }

            return new RemoveProductValidationResult();
        }
    }
}
