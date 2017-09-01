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
using Cook4Me.Api.Core.Commands.Orders;
using System.Threading.Tasks;
using System;
using Cook4Me.Api.Core.Repositories;
using System.Linq;
using Cook4Me.Api.Core.Parameters;

namespace Cook4Me.Api.Host.Validators
{
    public interface IUpdateOrderValidator
    {
        Task<UpdateOrderValidationResult> Validate(UpdateOrderCommand order, string subject);
    }

    public class UpdateOrderValidationResult
    {
        public UpdateOrderValidationResult(OrderAggregate order)
        {
            Order = order;
            IsValid = true;
        }

        public UpdateOrderValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
        public OrderAggregate Order { get; set; }
    }

    internal class UpdateOrderValidator : IUpdateOrderValidator
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;

        public UpdateOrderValidator(IOrderRepository orderRepository, IProductRepository productRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
        }

        public async Task<UpdateOrderValidationResult> Validate(UpdateOrderCommand order, string subject)
        {
            if (order == null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var record = await _orderRepository.Get(order.Id);
            if (record == null)
            {
                return new UpdateOrderValidationResult(ErrorDescriptions.TheOrderDoesntExist);
            }

            if (record.Status != OrderAggregateStatus.Created && record.Status == order.Status)
            {
                return new UpdateOrderValidationResult(string.Format(ErrorDescriptions.TheOrderCannotBeUpdatedBecauseOfItsState, Enum.GetName(typeof(OrderAggregateStatus), order.Status)));
            }

            if (order.OrderLines != null && order.OrderLines.Any())
            {
                var productIds = order.OrderLines.Select(o => o.ProductId);
                var products = await _productRepository.Search(new SearchProductsParameter { ProductIds = productIds });
                if (products.Content.Count() != productIds.Count())
                {
                    return new UpdateOrderValidationResult(ErrorDescriptions.TheOrderLineProductIsInvalid);
                }

                if (order.OrderLines.Any(o => o.Quantity <= 0))
                {
                    return new UpdateOrderValidationResult(ErrorDescriptions.TheOrderLineQuantityIsInvalid);
                }

                foreach (var orderLine in order.OrderLines)
                {
                    var product = products.Content.First(p => p.Id == orderLine.ProductId);
                    if (orderLine.Quantity > product.AvailableInStock)
                    {
                        return new UpdateOrderValidationResult(ErrorDescriptions.TheOrderLineQuantityIsTooMuch);
                    }
                }
            }

            return new UpdateOrderValidationResult(record);
        }
    }
}
