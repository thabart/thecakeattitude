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
using Cook4Me.Api.Host.Params;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IPurchaseOrderLabelValidator
    {
        Task<PurchaseOrderLabelValidationResult> Validate(string subject, PurchaseOrderLabelParameter parameter);
    }

    public class PurchaseOrderLabelValidationResult
    {
        public PurchaseOrderLabelValidationResult()
        {
            IsValid = true;
        }

        public PurchaseOrderLabelValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class PurchaseOrderLabelValidator : IPurchaseOrderLabelValidator
    {
        private readonly IOrderRepository _orderRepository;

        public PurchaseOrderLabelValidator(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public async Task<PurchaseOrderLabelValidationResult> Validate(string subject, PurchaseOrderLabelParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }
            
            var order = await _orderRepository.Get(parameter.OrderId);
            if (order == null)
            {
                return new PurchaseOrderLabelValidationResult(ErrorDescriptions.TheOrderDoesntExist);
            }

            if (order.SellerId != subject)
            {
                return new PurchaseOrderLabelValidationResult(ErrorDescriptions.TheOrderLabelCanBePurchasedOnlyBySeller);
            }

            if (order.Status != OrderAggregateStatus.Confirmed)
            {
                return new PurchaseOrderLabelValidationResult(ErrorDescriptions.TheOrderIsNotConfirmed);
            }

            if (order.OrderPayment == null || order.OrderPayment.Status != OrderPaymentStatus.Approved)
            {
                return new PurchaseOrderLabelValidationResult(ErrorDescriptions.TheOrderPaymentHasNotBeenConfirmed);
            }

            return new PurchaseOrderLabelValidationResult();
        }
    }
}
