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
using Cook4Me.Api.Core.Bus;
using Cook4Me.Api.Core.Commands.ClientService;
using Cook4Me.Api.Core.Events.ClientService;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Handlers
{
    public class ClientServiceCommandsHandler : Handles<AddClientServiceCommand>, Handles<RemoveClientServiceCommand>
    {
        private readonly IClientServiceRepository _repository;
        private readonly IEventPublisher _eventPublisher;

        public ClientServiceCommandsHandler(IClientServiceRepository repository, IEventPublisher eventPublisher)
        {
            _repository = repository;
            _eventPublisher = eventPublisher;
        }

        public async Task Handle(AddClientServiceCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var record = new ClientServiceAggregate
            {
                CategoryId = message.CategoryId,
                CreateDateTime = message.CreateDateTime,
                Description = message.Description,
                GooglePlaceId = message.GooglePlaceId,
                Id = message.Id,
                Latitude = message.Latitude,
                Longitude = message.Longitude,
                Name = message.Name,
                Price = message.Price,
                Subject = message.Subject,
                StreetAddress = message.StreetAddress,
                UpdateDateTime = message.UpdateDateTime
            };
            if (!await _repository.Add(record))
            {
                return;
            }

            _eventPublisher.Publish(new ClientServiceAddedEvent
            {
                CategoryId = message.CategoryId,
                CreateDateTime = message.CreateDateTime,
                Description = message.Description,
                GooglePlaceId = message.GooglePlaceId,
                Id = message.Id,
                Latitude = message.Latitude,
                Longitude = message.Longitude,
                Name = message.Name,
                Price = message.Price,
                Subject = message.Subject,
                UpdateDateTime = message.UpdateDateTime,
                CommonId = message.CommonId
            });
        }

        public async Task Handle(RemoveClientServiceCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var record = await _repository.Get(message.AnnouncementId);
            if (record == null || (record.Subject != message.Subject))
            {
                return;
            }

            if (!await _repository.Delete(record.Id))
            {
                return;
            }

            _eventPublisher.Publish(new ClientServiceRemovedEvent
            {
                AnnouncementId = message.AnnouncementId,
                Subject = message.Subject,
                CommonId = message.CommonId
            });
        }
    }
}
