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
using Cook4Me.Api.Core.Commands.Notifications;
using Cook4Me.Api.Core.Events.Notification;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Handlers
{
    public class NotificationCommandsHandler : Handles<UpdateNotificationCommand>
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IEventPublisher _eventPublisher;

        public NotificationCommandsHandler(INotificationRepository notificationRepository, IEventPublisher eventPublisher)
        {
            _notificationRepository = notificationRepository;
            _eventPublisher = eventPublisher;
        }

        public async Task Handle(UpdateNotificationCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var notification = await _notificationRepository.Get(message.Id);
            await _notificationRepository.Update(new NotificationAggregate
            {
                Id = message.Id,
                IsRead = message.IsRead
            });
            _eventPublisher.Publish(new NotificationUpdatedEvent
            {
                Id = message.Id,
                IsRead = message.IsRead,
                CommonId = message.CommonId,
                From = notification.From,
                To = notification.To
            });
        }
    }
}
