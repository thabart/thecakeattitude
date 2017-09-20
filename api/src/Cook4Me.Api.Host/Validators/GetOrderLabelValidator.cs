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
    public interface IGetOrderLabelValidator
    {
        Task<OrderLabelValidationResult> Validate(string subject, string orderId);
    }

    public class OrderLabelValidationResult
    {
        public OrderLabelValidationResult(OrderAggregate order)
        {
            Order = order;
            IsValid = true;
        }

        public OrderLabelValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
        public OrderAggregate Order { get; set; }
    }

    internal class GetOrderLabelValidator : IGetOrderLabelValidator
    {
        private readonly IOrderRepository _orderRepository;

        public GetOrderLabelValidator(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<OrderLabelValidationResult> Validate(string subject, string orderId)
        {
            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            if (string.IsNullOrWhiteSpace(orderId))
            {
                throw new ArgumentNullException(nameof(orderId));
            }

            var record = await _orderRepository.Get(orderId);
            if (record == null)
            {
                return new OrderLabelValidationResult(ErrorDescriptions.TheOrderDoesntExist);
            }

            if (string.IsNullOrWhiteSpace(record.ShipmentIdentificationNumber))
            {
                return new OrderLabelValidationResult(ErrorDescriptions.TheShipmentIdDoesntExist);
            }

            if (record.SellerId != subject)
            {
                return new OrderLabelValidationResult(ErrorDescriptions.TheOrderLabelCanBeUploadedOnlyByTheSeller);
            }

            return new OrderLabelValidationResult(record);
        }
    }
}
