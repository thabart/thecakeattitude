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

using System;
using System.Threading.Tasks;
using Cook4Me.Api.Core.Bus;
using Cook4Me.Api.Core.Commands.Discount;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.Core.Events.Discount;

namespace Cook4Me.Api.Handlers
{
    public class DiscountCommandsHandler : Handles<AddDiscountCommand>
    {
        private readonly IDiscountRepository _discountRepository;
        private readonly IEventPublisher _eventPublisher;

        public DiscountCommandsHandler(IDiscountRepository discountRepository, IEventPublisher eventPublisher)
        {
            _discountRepository = discountRepository;
            _eventPublisher = eventPublisher;
        }

        public async Task Handle(AddDiscountCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var record = new DiscountAggregate
            {
                Code = Guid.NewGuid().ToString(),
                Value = message.Value,
                Counter = message.Counter,
                CreateDateTime = message.CreateDateTime,
                EndDateTime = message.EndDateTime,
                Id = Guid.NewGuid().ToString(),
                ProductIds = message.ProductIds,
                PromotionType = message.PromotionType,
                StartDateTime = message.StartDateTime,
                UpdateDateTime = message.UpdateDateTime,
                Validity = message.Validity,
                Subject = message.Subject,
                IsActive = true,
                IsPrivate = message.IsPrivate
            };
            await _discountRepository.Insert(record);
            _eventPublisher.Publish(new DiscountAddedEvent
            {
                Id = record.Id,
                Seller = message.Subject,
                CommonId = message.CommonId
            });
        }
    }
}
