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
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IRemoveServiceValidator
    {
        Task<RemoveServiceValidationResult> Validate(RemoveServiceCommand command);
    }

    public class RemoveServiceValidationResult
    {
        public RemoveServiceValidationResult()
        {
            IsValid = true;
        }

        public RemoveServiceValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class RemoveServiceValidator : IRemoveServiceValidator
    {
        private readonly IServiceRepository _repository;
        private readonly IShopRepository _shopRepository;

        public RemoveServiceValidator(IServiceRepository repository, IShopRepository shopRepository)
        {
            _repository = repository;
            _shopRepository = shopRepository;
        }

        public async Task<RemoveServiceValidationResult> Validate(RemoveServiceCommand command)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            var product = await _repository.Get(command.ServiceId);
            if (product == null)
            {
                return new RemoveServiceValidationResult(ErrorDescriptions.TheServiceDoesntExist);
            }

            var shop = await _shopRepository.Get(product.ShopId);
            if (shop == null)
            {
                return new RemoveServiceValidationResult(ErrorDescriptions.TheShopDoesntExist);
            }

            if (shop.Subject != command.Subject)
            {
                return new RemoveServiceValidationResult(ErrorDescriptions.TheServiceCannotBeRemovedByYou);
            }

            return new RemoveServiceValidationResult();
        }
    }
}
