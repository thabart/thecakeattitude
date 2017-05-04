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

using Cook4Me.Api.Core.Commands.Shop;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IRemoveShopCommentValidator
    {
        Task<RemoveShopCommentValidationResult> Validate(RemoveShopCommentCommand command);
    }

    public class RemoveShopCommentValidationResult
    {
        public RemoveShopCommentValidationResult()
        {
            IsValid = true;
        }

        public RemoveShopCommentValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    public class RemoveShopCommentValidator : IRemoveShopCommentValidator
    {
        private readonly IShopRepository _shopRepository;

        public RemoveShopCommentValidator(IShopRepository shopRepository)
        {
            _shopRepository = shopRepository;
        }

        public async Task<RemoveShopCommentValidationResult> Validate(RemoveShopCommentCommand command)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            var shop = await _shopRepository.Get(command.ShopId);
            if (shop == null)
            {
                return new RemoveShopCommentValidationResult(ErrorDescriptions.TheShopDoesntExist);
            }

            var comment = shop.Comments == null ? null : shop.Comments.FirstOrDefault(c => c.Id == command.CommentId);
            if (comment == null)
            {
                return new RemoveShopCommentValidationResult(ErrorDescriptions.TheCommentDoesntExist);
            }

            if (comment.Subject != command.Subject)
            {
                return new RemoveShopCommentValidationResult(ErrorDescriptions.TheCommentCannotBeRemovedByYou);
            }

            return new RemoveShopCommentValidationResult();
        }
    }
}
