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
using Cook4Me.Api.Core.Aggregates;

namespace Cook4Me.Api.Host.Validators
{
    public interface IRemoveOrderValidator
    {
        Task<RemoveOrderValidationResult> Validate(RemoveOrderCommand command);
    }

    public class RemoveOrderValidationResult
    {
        public RemoveOrderValidationResult()
        {
            IsValid = true;
        }

        public RemoveOrderValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class RemoveOrderValidator : IRemoveOrderValidator
    {
        private readonly IOrderRepository _orderRepository;

        public RemoveOrderValidator(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<RemoveOrderValidationResult> Validate(RemoveOrderCommand command)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            var order = await _orderRepository.Get(command.OrderId);
            if (order == null)
            {
                return new RemoveOrderValidationResult(ErrorDescriptions.TheOrderDoesntExist);
            }

            if (order.Subject != command.Subject)
            {
                return new RemoveOrderValidationResult(ErrorDescriptions.TheOrderCannotBeRemovedByYou);
            }

            if (order.Status == OrderAggregateStatus.Received)
            {
                return new RemoveOrderValidationResult(ErrorDescriptions.TheReceivedOrderCannotBeRemoved);
            }

            return new RemoveOrderValidationResult();
        }
    }
}
