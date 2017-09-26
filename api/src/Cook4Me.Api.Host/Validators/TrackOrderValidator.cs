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
    public interface ITrackOrderValidator
    {
        Task<TrackOrderValidationResult> Validate(string orderId, string subject);
    }

    public class TrackOrderValidationResult
    {
        public TrackOrderValidationResult(OrderAggregate order)
        {
            IsValid = true;
            Order = order;
        }

        public TrackOrderValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public OrderAggregate Order { get; private set; }
        public bool IsValid { get; private set; }
        public string Message { get; private set; }
    }

    internal class TrackOrderValidator : ITrackOrderValidator
    {
        private readonly IOrderRepository _repository;

        public TrackOrderValidator(IOrderRepository repository)
        {
            _repository = repository;
        }

        public async Task<TrackOrderValidationResult> Validate(string orderId, string subject)
        {
            if (string.IsNullOrWhiteSpace(orderId))
            {
                throw new ArgumentNullException(nameof(orderId));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var order = await _repository.Get(orderId);
            if (order == null)
            {
                return new TrackOrderValidationResult(ErrorDescriptions.TheOrderDoesntExist);
            }

            if (order.SellerId != null && order.Subject != subject)
            {
                return new TrackOrderValidationResult(ErrorDescriptions.TheOrderCanBeTrackedBySellerOrBuyer);
            }

            if (string.IsNullOrWhiteSpace(order.TrackingNumber))
            {
                return new TrackOrderValidationResult(ErrorDescriptions.TheOrderDoesntContainTrackingNumber);
            }

            return new TrackOrderValidationResult(order);
        }
    }
}
