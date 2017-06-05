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
using Cook4Me.Api.Core.Commands.Service;
using Cook4Me.Api.Core.Events.Service;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Handlers
{
    public class ServiceCommandsHandler : Handles<AddServiceCommentCommand>, Handles<RemoveServiceCommentCommand>, Handles<AddServiceCommand>
    {
        private readonly IServiceRepository _serviceRepository;
        private readonly IEventPublisher _eventPublisher;

        public ServiceCommandsHandler(IServiceRepository serviceRepository, IEventPublisher eventPublisher)
        {
            _serviceRepository = serviceRepository;
            _eventPublisher = eventPublisher;
        }

        public async Task Handle(AddServiceCommentCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var record = await _serviceRepository.Get(message.ServiceId);
            if (record == null)
            {
                return;
            }

            var serviceComment = new ServiceComment
            {
                Id = message.Id,
                Content = message.Content,
                Score = message.Score,
                Subject = message.Subject,
                CreateDateTime = message.CreateDateTime,
                UpdateDateTime = message.UpdateDateTime
            };
            record.AddComment(serviceComment);
            await _serviceRepository.Update(record);
            _eventPublisher.Publish(new ServiceCommentAddedEvent
            {
                Id = message.Id,
                ServiceId = message.ServiceId,
                ShopId = record.ShopId,
                Content = message.Content,
                Score = message.Score,
                Subject = message.Subject,
                CreateDateTime = message.CreateDateTime,
                UpdateDateTime = message.UpdateDateTime,
                AverageScore = record.AverageScore,
                NbComments = record.Comments == null ? 0 : record.Comments.Count()
            });
        }

        public async Task Handle(RemoveServiceCommentCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var record = await _serviceRepository.Get(message.ServiceId);
            if (record == null)
            {
                return;
            }

            var serviceComment = record.Comments == null ? null : record.Comments.FirstOrDefault(f => f.Id == message.CommentId);
            if (serviceComment == null)
            {
                return;
            }

            record.RemoveComment(serviceComment);
            await _serviceRepository.Update(record);
            _eventPublisher.Publish(new ServiceCommentRemovedEvent
            {
                Id = message.CommentId,
                ShopId = record.ShopId,
                ServiceId = message.ServiceId,
                AverageScore = record.AverageScore,
                NbComments = record.Comments == null ? 0 : record.Comments.Count()
            });
        }

        public async Task Handle(AddServiceCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            ServiceAggregateOccurrence occurrence = null;
            if (message.Occurrence != null)
            {
                occurrence = new ServiceAggregateOccurrence
                {
                    Id = Guid.NewGuid().ToString(),
                    Days = message.Occurrence.Days,
                    StartDate = message.Occurrence.StartDate,
                    EndDate = message.Occurrence.EndDate,
                    StartTime = message.Occurrence.StartTime,
                    EndTime = message.Occurrence.EndTime
                };
            }

            var service = new ServiceAggregate
            {
                Id = message.Id,
                Name = message.Name,
                Description = message.Description,
                PartialImagesUrl = message.Images,
                Price = message.Price,
                NewPrice = message.NewPrice,
                Tags = message.Tags,
                ShopId = message.ShopId,
                CreateDateTime = message.CreateDateTime,
                UpdateDateTime = message.UpdateDateTime,
                TotalScore = 0,
                AverageScore = 0,
                Occurrence = occurrence
            };
            if (!await _serviceRepository.Add(service))
            {
                return;
            }

            _eventPublisher.Publish(new ServiceAddedEvent
            {
                Id = message.Id,
                Name = message.Name,
                Description = message.Description,
                Price = message.Price,
                NewPrice = message.NewPrice,
                ShopId = message.ShopId,
                CreateDateTime = message.CreateDateTime,
                UpdateDateTime = message.UpdateDateTime
            });
        }
    }
}
