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
using Cook4Me.Api.Core.Commands.Product;
using Cook4Me.Api.Core.Commands.Service;
using Cook4Me.Api.Core.Commands.Shop;
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IAddCommentValidator
    {
        Task<AddCommentValidationResult> Validate(AddShopCommentCommand comment);
        Task<AddCommentValidationResult> Validate(AddProductCommentCommand command);
        Task<AddCommentValidationResult> Validate(AddServiceCommentCommand command);
    }

    public class AddCommentValidationResult
    {
        public AddCommentValidationResult()
        {
            IsValid = true;
        }

        public AddCommentValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class AddCommentValidator : IAddCommentValidator
    {
        private readonly IShopRepository _shopRepository;
        private readonly IProductRepository _productRepository;
        private readonly IServiceRepository _serviceRepository;

        public AddCommentValidator(IShopRepository shopRepository, IProductRepository productRepository, IServiceRepository serviceRepository)
        {
            _shopRepository = shopRepository;
            _productRepository = productRepository;
            _serviceRepository = serviceRepository;
        }

        public async Task<AddCommentValidationResult> Validate(AddShopCommentCommand comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            var validationResult = Validate(comment.ShopId, comment.Content, comment.Score, Constants.DtoNames.Comment.ShopId);
            if (!validationResult.IsValid)
            {
                return validationResult;
            }

            ShopAggregate shop = null;
            // Check shop exists && 1 comment.
            if (!string.IsNullOrWhiteSpace(comment.ShopId))
            {
                shop = await _shopRepository.Get(comment.ShopId);
                if (shop == null)
                {
                    return new AddCommentValidationResult(ErrorDescriptions.TheShopDoesntExist);
                }

                var comments = await _shopRepository.SearchComments(new SearchShopCommentsParameter
                {
                    ShopId = comment.ShopId,
                    Subject = comment.Subject
                });
                if (comments.TotalResults > 0)
                {
                    return new AddCommentValidationResult(ErrorDescriptions.TheCommentAlreadyExists);
                }
            }

            // Check content size.
            if (!string.IsNullOrWhiteSpace(comment.Content) && comment.Content.Length > 255)
            {
                return new AddCommentValidationResult(string.Format(ErrorDescriptions.TheParameterLengthCannotExceedNbCharacters, Constants.DtoNames.Comment.Content, "255"));
            }

            // Check score.
            if (comment.Score < 1 || comment.Score > 5)
            {
                return new AddCommentValidationResult(ErrorDescriptions.TheScoreMustBeBetween);
            }

            return new AddCommentValidationResult();
        }

        public async Task<AddCommentValidationResult> Validate(AddProductCommentCommand comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            var validationResult = Validate(comment.ProductId, comment.Content, comment.Score, Constants.DtoNames.Comment.ProductId);
            if (!validationResult.IsValid)
            {
                return validationResult;
            }

            ProductAggregate product = null;
            // Check shop exists && 1 comment.
            if (!string.IsNullOrWhiteSpace(comment.ProductId))
            {
                product = await _productRepository.Get(comment.ProductId);
                if (product == null)
                {
                    return new AddCommentValidationResult(ErrorDescriptions.TheShopDoesntExist);
                }

                var comments = await _productRepository.Search(new SearchProductCommentsParameter
                {
                    ProductId = comment.ProductId,
                    Subject = comment.Subject
                });
                if (comments.TotalResults > 0)
                {
                    return new AddCommentValidationResult(ErrorDescriptions.TheCommentAlreadyExists);
                }
            }

            return new AddCommentValidationResult();
        }

        public async Task<AddCommentValidationResult> Validate(AddServiceCommentCommand command)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            var validationResult = Validate(command.ServiceId, command.Content, command.Score, Constants.DtoNames.Comment.ServiceId);
            if (!validationResult.IsValid)
            {
                return validationResult;
            }

            ServiceAggregate service = null;
            // Check shop exists && 1 comment.
            if (!string.IsNullOrWhiteSpace(command.ServiceId))
            {
                service = await _serviceRepository.Get(command.ServiceId);
                if (service == null)
                {
                    return new AddCommentValidationResult(ErrorDescriptions.TheServiceDoesntExist);
                }

                var comments = await _serviceRepository.Search(new SearchServiceCommentParameter
                {
                    ServiceId = service.Id,
                    Subject = command.Subject
                });
                if (comments.TotalResults > 0)
                {
                    return new AddCommentValidationResult(ErrorDescriptions.TheCommentAlreadyExists);
                }
            }

            return new AddCommentValidationResult();

        }

        private static AddCommentValidationResult Validate(string id, string content, int score, string name)
        {
            // Check id exists.
            if (string.IsNullOrWhiteSpace(id))
            {
                return new AddCommentValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, name));
            }

            // Check content size.
            if (!string.IsNullOrWhiteSpace(content) && content.Length > 255)
            {
                return new AddCommentValidationResult(string.Format(ErrorDescriptions.TheParameterLengthCannotExceedNbCharacters, Constants.DtoNames.Comment.Content, "255"));
            }

            // Check score.
            if (score < 1 || score > 5)
            {
                return new AddCommentValidationResult(ErrorDescriptions.TheScoreMustBeBetween);
            }

            return new AddCommentValidationResult();
        }
    }
}
