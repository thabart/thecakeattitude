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
using Cook4Me.Api.Core.Repositories;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface ICancelOrderValidator
    {
        Task<CancelOrderValidationResult> Validate(string id, string subject);
    }

    public class CancelOrderValidationResult
    {
        public CancelOrderValidationResult(OrderAggregate order)
        {
            IsValid = true;
            Order = order;
        }

        public CancelOrderValidationResult(string message)
        {
            Message = message;
            IsValid = false;
        }

        public bool IsValid { get; set; }
        public string Message { get; set; }
        public OrderAggregate Order { get; set; }
    }

    internal class CancelOrderValidator : ICancelOrderValidator
    {
        private readonly IOrderRepository _orderRepository;

        public CancelOrderValidator(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<CancelOrderValidationResult> Validate(string id, string subject)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var order = await _orderRepository.Get(id);
            if (order == null)
            {
                return new CancelOrderValidationResult(ErrorDescriptions.TheOrderDoesntExist);
            }

            if (order.Subject != subject)
            {
                return new CancelOrderValidationResult(ErrorDescriptions.TheOrderCannotBeCanceledByYou);
            }

            if (order.IsLabelPurchased)
            {
                return new CancelOrderValidationResult(ErrorDescriptions.TheOrderCannotBeCanceledPurchased);
            }

            return new CancelOrderValidationResult(order);
        }
    }
}
