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
    public interface IAcceptOrderTransactionValidator
    {
        Task<AcceptOrderTransactionValidationResult> Validate(AcceptOrderTransactionCommand command, string subject);
    }

    public class AcceptOrderTransactionValidationResult
    {
        public AcceptOrderTransactionValidationResult()
        {
            IsValid = true;
        }

        public AcceptOrderTransactionValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class AcceptOrderTransactionValidator : IAcceptOrderTransactionValidator
    {
        private readonly IOrderRepository _orderRepository;

        public AcceptOrderTransactionValidator(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<AcceptOrderTransactionValidationResult> Validate(AcceptOrderTransactionCommand command, string subject)
        {
            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            var order = await _orderRepository.Get(command.OrderId);
            if (order == null)
            {
                return new AcceptOrderTransactionValidationResult(ErrorDescriptions.TheOrderDoesntExist);
            }

            if (order.OrderPayment == null)
            {
                return new AcceptOrderTransactionValidationResult(ErrorDescriptions.TheOrderDoesntHavePayment);
            }


            if (order.OrderPayment.TransactionId != command.TransactionId)
            {
                return new AcceptOrderTransactionValidationResult(ErrorDescriptions.TheOrderTransactionIsNotCorrect);
            }
            
            if (order.OrderPayment.Status == OrderPaymentStatus.Approved)
            {
                return new AcceptOrderTransactionValidationResult(ErrorDescriptions.TheOrderTransactionHasBeenApproved);
            }

            if (order.Subject != subject)
            {
                return new AcceptOrderTransactionValidationResult(ErrorDescriptions.TheOrderCanBeApprovedOnlyByItsCreator);
            }

            return new AcceptOrderTransactionValidationResult();
        }
    }
}
