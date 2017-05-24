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
using Cook4Me.Api.Core.Commands.Product;
using Cook4Me.Api.Core.Events.Product;
using Cook4Me.Api.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Handlers
{
    public class ProductCommandsHandler : Handles<AddProductCommentCommand>, Handles<RemoveProductCommentCommand>, Handles<AddProductCommand>
    {
        private readonly IProductRepository _productRepository;
        private readonly IEventPublisher _eventPublisher;

        public ProductCommandsHandler(IProductRepository productRepository, IEventPublisher eventPublisher)
        {
            _productRepository = productRepository;
            _eventPublisher = eventPublisher;
        }

        public async Task Handle(AddProductCommentCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var record = await _productRepository.Get(message.ProductId);
            if (record == null)
            {
                return;
            }
            
            var shopComment = new ProductComment
            {
                Id = message.Id,
                Content = message.Content,
                Score = message.Score,
                Subject = message.Subject,
                CreateDateTime = message.CreateDateTime,
                UpdateDateTime = message.UpdateDateTime
            };
            record.AddComment(shopComment);
            await _productRepository.Update(record);
            _eventPublisher.Publish(new ProductCommentAddedEvent
            {
                Id = message.Id,
                ProductId = message.ProductId,
                Content = message.Content,
                Score = message.Score,
                Subject = message.Subject,
                CreateDateTime = message.CreateDateTime,
                UpdateDateTime = message.UpdateDateTime,
                AverageScore = record.AverageScore,
                NbComments = record.Comments == null ? 0 : record.Comments.Count()
            });
        }

        public async Task Handle(RemoveProductCommentCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var record = await _productRepository.Get(message.ProductId);
            if (record == null)
            {
                return;
            }

            var productComment = record.Comments == null ? null : record.Comments.FirstOrDefault(f => f.Id == message.CommentId);
            if (productComment == null)
            {
                return;
            }

            record.RemoveComment(productComment);
            await _productRepository.Update(record);
            _eventPublisher.Publish(new ProductCommentRemovedEvent
            {
                Id = message.CommentId,
                ProductId = message.ProductId,
                AverageScore = record.AverageScore,
                NbComments = record.Comments == null ? 0 : record.Comments.Count()
            });
        }

        public async Task Handle(AddProductCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var product = new ProductAggregate
            {
                Id = message.Id,
                AverageScore = 0,
                TotalScore = 0,
                CategoryId = message.CategoryId,
                CreateDateTime = message.CreateDateTime,
                UpdateDateTime = message.UpdateDateTime,
                Description = message.Description,
                Name = message.Name,
                NewPrice = message.NewPrice,
                Price = message.Price,
                Quantity = message.Quantity,
                Tags = message.Tags,
                UnitOfMeasure = message.UnitOfMeasure,
                ShopId = message.ShopId,
                AvailableInStock = message.AvailableInStock
            };
            var filters = new List<ProductAggregateFilter>();
            if (message.Filters != null && message.Filters.Any())
            {
                foreach(var filter in message.Filters)
                {
                    filters.Add(new ProductAggregateFilter
                    {
                        FilterId = filter.FilterId,
                        FilterValueId = filter.ValueId
                    });
                }
            }

            product.Filters = filters;
            await _productRepository.Insert(product);
            _eventPublisher.Publish(new ProductAddedEvent
            {
                Id = product.Id,
                CategoryId = product.CategoryId,
                AverageScore = product.AverageScore,
                CommonId = message.CommonId,
                CreateDateTime = product.CreateDateTime,
                Description = product.Description,
                Name = product.Name,
                NewPrice = product.NewPrice,
                Price = product.Price,
                Quantity = product.Quantity,
                ShopId = product.ShopId,
                TotalScore = product.TotalScore,
                UnitOfMeasure = product.UnitOfMeasure,
                UpdateDateTime = product.UpdateDateTime
            });
        }
    }
}
