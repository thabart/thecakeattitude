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
using Cook4Me.Api.Core.Commands.Messages;
using Cook4Me.Api.Core.Events.Messages;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Handlers
{
    public class MessageCommandsHandler : Handles<AddMessageCommand>
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IEventPublisher _eventPublisher;

        public MessageCommandsHandler(IMessageRepository messageRepository, IEventPublisher eventPublisher)
        {
            _messageRepository = messageRepository;
            _eventPublisher = eventPublisher;
        }

        public async Task Handle(AddMessageCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var messageAggregate = new MessageAggregate
            {
                Id = Guid.NewGuid().ToString(),
                Content = message.Content,
                From = message.From,
                To = message.To,
                IsRead = false,
                ProductId = message.ProductId,
                ServiceId = message.ServiceId,
                ParentId = message.ParentId,
                Subject = message.Subject,
                CreateDateTime = DateTime.UtcNow
            };
            await _messageRepository.Add(messageAggregate);
            _eventPublisher.Publish(new MessageAddedEvent
            {
                Id = messageAggregate.Id,
                Content = messageAggregate.Content,
                From = messageAggregate.From,
                To = messageAggregate.To,
                IsRead = messageAggregate.IsRead,
                ProductId = messageAggregate.ProductId,
                ServiceId = messageAggregate.ServiceId,
                ParentId = messageAggregate.ParentId,
                Subject = messageAggregate.Subject,
                CreateDateTime = messageAggregate.CreateDateTime
            });
        }
    }
}
