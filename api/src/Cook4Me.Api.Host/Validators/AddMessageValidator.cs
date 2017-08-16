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

using Cook4Me.Api.Core.Commands.Messages;
using System.Threading.Tasks;
using System;
using Cook4Me.Api.Core.Repositories;

namespace Cook4Me.Api.Host.Validators
{
    public interface IAddMessageValidator
    {
        Task<AddMessageValidationResult> Validate(AddMessageCommand command);
    }

    public class AddMessageValidationResult
    {
        public AddMessageValidationResult()
        {
            IsValid = true;
        }

        public AddMessageValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class AddMessageValidator : IAddMessageValidator
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IProductRepository _productRepository;
        private readonly IServiceRepository _serviceRepository;

        public AddMessageValidator(IMessageRepository messageRepository, IProductRepository productRepository, IServiceRepository serviceRepository)
        {
            _messageRepository = messageRepository;
            _productRepository = productRepository;
            _serviceRepository = serviceRepository;
        }

        public async Task<AddMessageValidationResult> Validate(AddMessageCommand command)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            if (string.IsNullOrWhiteSpace(command.ServiceId) && string.IsNullOrWhiteSpace(command.ProductId) && string.IsNullOrWhiteSpace(command.To)) // Check mandatories parameters.
            {
                return new AddMessageValidationResult(string.Format(ErrorDescriptions.TheParametersAreMandatories, Constants.DtoNames.UserMessage.ServiceId + "," + Constants.DtoNames.UserMessage.ProductId + "," + Constants.DtoNames.UserMessage.To));
            }

            if (string.IsNullOrWhiteSpace(command.Content))
            {
                return new AddMessageValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.UserMessage.Content));
            }

            if (command.Content.Length > 255)
            {
                return new AddMessageValidationResult(string.Format(ErrorDescriptions.TheParameterLengthCannotExceedNbCharacters, Constants.DtoNames.UserMessage.Content, "255"));
            }

            if (!string.IsNullOrWhiteSpace(command.ProductId) && !string.IsNullOrWhiteSpace(command.ServiceId)) // Check parameters are not specified at same time.
            {
                return new AddMessageValidationResult(ErrorDescriptions.TheProductAndServiceCannotBeSpecifiedAtSameTime);
            }

            if (!string.IsNullOrWhiteSpace(command.ServiceId))
            {
                var service = await _serviceRepository.Get(command.ServiceId);
                if (service == null)
                {
                    return new AddMessageValidationResult(ErrorDescriptions.TheServiceDoesntExist);
                }
            }
            
            if (!string.IsNullOrWhiteSpace(command.ProductId))
            {
                var product = await _productRepository.Get(command.ProductId);
                if (product == null)
                {
                    return new AddMessageValidationResult(ErrorDescriptions.TheProductDoesntExist);
                }
            }

            if (string.IsNullOrWhiteSpace(command.ParentId)) // Check messageSubject contains a correct subject.
            {
                if (string.IsNullOrWhiteSpace(command.Subject))
                {
                    return new AddMessageValidationResult(string.Format(ErrorDescriptions.TheParameterIsMandatory, Constants.DtoNames.UserMessage.Subject));
                }

                if (command.Subject.Length > 100)
                {
                    return new AddMessageValidationResult(string.Format(ErrorDescriptions.TheParameterLengthCannotExceedNbCharacters, Constants.DtoNames.UserMessage.Subject, "100"));
                }
            }
            else
            {
                var parent = await _messageRepository.Get(command.ParentId);
                if (parent == null)
                {
                    return new AddMessageValidationResult(ErrorDescriptions.TheParentMessageDoesntExist);
                }
            }

            return new AddMessageValidationResult();
        }
    }
}
