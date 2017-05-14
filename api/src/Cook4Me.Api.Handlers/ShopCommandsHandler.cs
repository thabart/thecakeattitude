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
using Cook4Me.Api.Core.Commands.Shop;
using Cook4Me.Api.Core.Events.Shop;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Handlers
{
    public class ShopCommandsHandler : Handles<AddShopCommand>, Handles<AddShopCommentCommand>, Handles<RemoveShopCommentCommand>
    {
        private readonly IShopRepository _shopRepository;
        private readonly IEventPublisher _eventPublisher;

        public ShopCommandsHandler(IShopRepository shopRepository, IEventPublisher eventPublisher)
        {
            _shopRepository = shopRepository;
            _eventPublisher = eventPublisher;
        }

        public async Task Handle(AddShopCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            IEnumerable<ShopPaymentMethod> paymentMethods = null;
            if (message.PaymentMethods != null)
            {
                paymentMethods = message.PaymentMethods.Select(m => new ShopPaymentMethod
                {
                    Id = m.Id,
                    Iban = m.Iban,
                    Method = (ShopPaymentMethods)m.Method
                });
            }

            var aggregate = new ShopAggregate
            {
                Id = message.Id,
                Subject = message.Subject,
                Name = message.Name,
                Description = message.Description,
                BannerImage = message.BannerImage,
                ProfileImage = message.ProfileImage,
                MapName = message.MapName,
                CategoryId = message.CategoryId,
                PlaceId = message.PlaceId,
                StreetAddress = message.StreetAddress,
                PostalCode = message.PostalCode,
                Locality = message.Locality,
                Country = message.Country,
                GooglePlaceId = message.GooglePlaceId,
                Longitude = message.Longitude,
                Latitude = message.Latitude,
                ShopRelativePath = message.ShopRelativePath,
                UndergroundRelativePath = message.UndergroundRelativePath,
                CreateDateTime = message.CreateDateTime,
                UpdateDateTime = message.UpdateDateTime,
                ShopPaymentMethods = paymentMethods,
                TagNames = message.TagNames
            };
            await _shopRepository.Add(aggregate);
            _eventPublisher.Publish(new ShopAddedEvent
            {
                ShopId = message.Id,
                Name = message.Name,
                Longitude = message.Longitude,
                Latitude = message.Latitude
            });
        }

        public async Task Handle(AddShopCommentCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var record = await _shopRepository.Get(message.ShopId);
            if (record == null)
            {
                return;
            }

            var shopComment = new ShopComment
            {
                Id = message.Id,
                Content = message.Content,
                Score = message.Score,
                Subject = message.Subject,
                CreateDateTime = message.CreateDateTime,
                UpdateDateTime = message.UpdateDateTime
            };
            record.AddComment(shopComment);
            await _shopRepository.Update(record);
            _eventPublisher.Publish(new ShopCommentAddedEvent
            {
                Id = message.Id,
                ShopId = message.ShopId,
                Content = message.Content,
                Score = message.Score,
                Subject = message.Subject,
                CreateDateTime = message.CreateDateTime,
                UpdateDateTime = message.UpdateDateTime,
                AverageScore = record.AverageScore,
                NbComments = record.Comments == null ? 0 : record.Comments.Count()
            });
        }

        public async Task Handle(RemoveShopCommentCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var record = await _shopRepository.Get(message.ShopId);
            if (record == null)
            {
                return;
            }

            var shopComment = record.Comments == null ? null : record.Comments.FirstOrDefault(f => f.Id == message.CommentId);
            if (shopComment == null)
            {
                return;
            }

            record.RemoveComment(shopComment);
            await _shopRepository.Update(record);
            _eventPublisher.Publish(new ShopCommentRemovedEvent
            {
                Id = message.CommentId,
                ShopId = message.ShopId,
                AverageScore = record.AverageScore,
                NbComments = record.Comments == null ? 0 : record.Comments.Count()
            });
        }
    }
}
