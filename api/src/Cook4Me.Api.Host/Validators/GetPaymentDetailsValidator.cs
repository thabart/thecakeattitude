﻿#region copyright
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
    public interface IGetPaymentDetailsValidator
    {
        Task<GetPaymentDetailsValidationResult> Validate(string id, string subject);
    }

    public class GetPaymentDetailsValidationResult
    {
        public GetPaymentDetailsValidationResult(OrderAggregate order)
        {
            Order = order;
            IsValid = true;
        }

        public GetPaymentDetailsValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
        public OrderAggregate Order { get; set; }
    }

    internal class GetPaymentDetailsValidator : IGetPaymentDetailsValidator
    {
        private readonly IOrderRepository _orderRepository;

        public GetPaymentDetailsValidator(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<GetPaymentDetailsValidationResult> Validate(string orderId, string subject)
        {
            if (string.IsNullOrWhiteSpace(orderId))
            {
                throw new ArgumentNullException(nameof(orderId));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var record = await _orderRepository.Get(orderId);
            if (record == null)
            {
                return new GetPaymentDetailsValidationResult(ErrorDescriptions.TheOrderDoesntExist);
            }

            if (record.Subject != subject)
            {
                return new GetPaymentDetailsValidationResult(ErrorDescriptions.TheOrderPaymentDetailsCanBeUploadByTheBuyer);
            }

            if (record.OrderPayment == null || string.IsNullOrWhiteSpace(record.OrderPayment.Id))
            {
                return new GetPaymentDetailsValidationResult(ErrorDescriptions.TheOrderPaymentDoesntExist);
            }

            return new GetPaymentDetailsValidationResult(record);
        }
    }
}
