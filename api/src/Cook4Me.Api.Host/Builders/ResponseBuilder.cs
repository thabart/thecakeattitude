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
using Cook4Me.Api.Core.Events.ClientService;
using Cook4Me.Api.Core.Events.Messages;
using Cook4Me.Api.Core.Events.Notification;
using Cook4Me.Api.Core.Events.Product;
using Cook4Me.Api.Core.Events.Service;
using Cook4Me.Api.Core.Events.Shop;
using Cook4Me.Api.Core.Results;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;

namespace Cook4Me.Api.Host.Builders
{
    public interface IResponseBuilder
    {
        JObject GetMessageAddedEvent(MessageAddedEvent evt);
        JObject GetMessage(MessageAggregate message);
        JObject GetMessageAttachment(MessageAttachment attachment);
        JObject GetNotificationAddedEvent(NotificationAddedEvent evt);
        JObject GetNotificationStatus(GetNotificationStatusResult result);
        JObject GetNotificationUpdatedEvent(NotificationUpdatedEvent evt);
        JObject GetNotification(NotificationAggregate notification);
        JObject GetShop(ShopAggregate shop);
        JObject GetFilter(ShopFilter filter);
        JObject GetFilterValue(ShopFilterValue filterValue);
        JObject GetShopAddedEvent(ShopAddedEvent evt);
        JObject GetShopUpdatedEvent(ShopUpdatedEvent evt);
        JObject GetError(string errorCode, string errorDescription);
        JObject GetShopCategory(ShopCategoryAggregate category);
        JObject GetMap(ShopMap map);
        JObject GetTag(TagAggregate tag);
        JObject GetShopComment(ShopComment comment);
        JObject GetProductComment(ProductComment productComment);
        JObject GetServiceComment(ServiceComment serviceComment);
        JObject GetShopCommentAddedEvent(ShopCommentAddedEvent comment);
        JObject GetShopCommentRemovedEvent(ShopCommentRemovedEvent comment);
        JObject GetShopRemovedEvent(ShopRemovedEvent evt);
        JObject GetProductCommentAddedEvent(ProductCommentAddedEvent comment);
        JObject GetProductCommentRemovedEvent(ProductCommentRemovedEvent comment);
        JObject GetServiceCommentRemovedEvent(ServiceCommentRemovedEvent comment);
        JObject GetServiceCommentAddedEvent(ServiceCommentAddedEvent comment);
        JObject GetServiceAddedEvent(ServiceAddedEvent evt);
        JObject GetClientServiceAddedEvent(ClientServiceAddedEvent evt);
        JObject GetClientServiceRemovedEvent(ClientServiceRemovedEvent evt);
        JObject GetProductAddedEvent(ProductAddedEvent evt);
        JObject GetProduct(ProductAggregate product);
        JObject GetPromotion(ProductAggregatePromotion promotion);
        JObject GetService(ServiceAggregate service);
        JObject GetServiceOccurrence(ServiceResultLine service);
        JObject GetClientService(ClientServiceAggregate announcement);
    }

    internal class ResponseBuilder : IResponseBuilder
    {
        public JObject GetMessageAddedEvent(MessageAddedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }
            
            var result = new JObject();
            result.Add(Constants.DtoNames.UserMessage.Id, evt.Id);
            result.Add(Constants.DtoNames.UserMessage.Content, evt.Content);
            result.Add(Constants.DtoNames.UserMessage.CreateDateTime, evt.CreateDateTime);
            result.Add(Constants.DtoNames.UserMessage.From, evt.From);
            result.Add(Constants.DtoNames.UserMessage.IsRead, evt.IsRead);
            result.Add(Constants.DtoNames.UserMessage.ProductId, evt.ProductId);
            result.Add(Constants.DtoNames.UserMessage.ServiceId, evt.ServiceId);
            result.Add(Constants.DtoNames.UserMessage.To, evt.To);
            result.Add(Constants.DtoNames.UserMessage.ParentId, evt.ParentId);
            result.Add(Constants.DtoNames.UserMessage.Subject, evt.Subject);
            result.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            return result;
        }

        public JObject GetMessage(MessageAggregate message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            var attachments = new JArray();
            if (message.MessageAttachments != null)
            {
                foreach(var attachment in message.MessageAttachments)
                {
                    attachments.Add(GetMessageAttachment(attachment));
                }
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.UserMessage.Id, message.Id);
            result.Add(Constants.DtoNames.UserMessage.Content, message.Content);
            result.Add(Constants.DtoNames.UserMessage.CreateDateTime, message.CreateDateTime);
            result.Add(Constants.DtoNames.UserMessage.From, message.From);
            result.Add(Constants.DtoNames.UserMessage.IsRead, message.IsRead);
            result.Add(Constants.DtoNames.UserMessage.ProductId, message.ProductId);
            result.Add(Constants.DtoNames.UserMessage.ServiceId, message.ServiceId);
            result.Add(Constants.DtoNames.UserMessage.ParentId, message.ParentId);
            result.Add(Constants.DtoNames.UserMessage.Subject, message.Subject);
            result.Add(Constants.DtoNames.UserMessage.To, message.To);
            result.Add(Constants.DtoNames.UserMessage.Attachments, attachments);
            return result;
        }

        public JObject GetMessageAttachment(MessageAttachment attachment)
        {
            if (attachment == null)
            {
                throw new ArgumentNullException(nameof(attachment));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.UserMessageAttachment.Id, attachment.Id);
            result.Add(Constants.DtoNames.UserMessageAttachment.Link, attachment.Link);
            result.Add(Constants.DtoNames.UserMessageAttachment.Name, attachment.Name);
            return result;
        }

        public JObject GetNotificationStatus(GetNotificationStatusResult param)
        {
            if (param == null)
            {
                throw new ArgumentNullException(nameof(param));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.NotificationStatus.NbRead, param.NbRead);
            result.Add(Constants.DtoNames.NotificationStatus.NbUnread, param.NbUnread);
            return result;
        }

        public JObject GetNotificationAddedEvent(NotificationAddedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.Notification.Id, evt.Id);
            result.Add(Constants.DtoNames.Notification.Content, evt.Content);
            result.Add(Constants.DtoNames.Notification.IsRead, evt.IsRead);
            result.Add(Constants.DtoNames.Notification.From, evt.From);
            result.Add(Constants.DtoNames.Notification.To, evt.To);
            return result;
        }

        public JObject GetNotificationUpdatedEvent(NotificationUpdatedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.Notification.Id, evt.Id);
            result.Add(Constants.DtoNames.Notification.IsRead, evt.IsRead);
            result.Add(Constants.DtoNames.Notification.From, evt.From);
            result.Add(Constants.DtoNames.Notification.To, evt.To);
            result.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            return result;
        }

        public JObject GetNotification(NotificationAggregate notification)
        {
            if (notification == null)
            {
                throw new ArgumentNullException(nameof(notification));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.Notification.Id, notification.Id);
            result.Add(Constants.DtoNames.Notification.From, notification.From);
            result.Add(Constants.DtoNames.Notification.To, notification.To);
            result.Add(Constants.DtoNames.Notification.Content, notification.Content);
            result.Add(Constants.DtoNames.Notification.CreateDate, notification.CreatedDateTime);
            result.Add(Constants.DtoNames.Notification.IsRead, notification.IsRead);
            if (notification.Parameters != null)
            {
                var arr = new JArray();
                foreach(var parameter in notification.Parameters)
                {
                    arr.Add(GetNotificationParameter(parameter));
                }

                result.Add(Constants.DtoNames.Notification.Parameters, arr);
            }

            return result;
        }

        public JObject GetNotificationParameter(NotificationParameter parameter)
        {
            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            string type = null;
            switch(parameter.Type)
            {
                case NotificationParameterTypes.ShopId:
                    type = "shop_id";
                    break;
                case NotificationParameterTypes.ProductId:
                    type = "product_id";
                    break;
                case NotificationParameterTypes.ServiceId:
                    type = "service_id";
                    break;
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.NotificationParameter.Id, parameter.Id);
            result.Add(Constants.DtoNames.NotificationParameter.Value, parameter.Value);
            if (!string.IsNullOrWhiteSpace(type))
            {
                result.Add(Constants.DtoNames.NotificationParameter.Type, type);
            }

            return result;
        }

        public JObject GetShop(ShopAggregate shop)
        {
            if (shop == null)
            {
                throw new ArgumentNullException(nameof(shop));
            }

            var nbComments = 0;
            if (shop.Comments != null)
            {
                nbComments = shop.Comments.Count();
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.Shop.Id, shop.Id);
            result.Add(Constants.DtoNames.Shop.Subject, shop.Subject); // General information
            result.Add(Constants.DtoNames.Shop.Name, shop.Name);
            result.Add(Constants.DtoNames.Shop.Description, shop.Description);
            if (shop.TagNames != null && shop.TagNames.Any())
            {
                JArray arr = new JArray();
                foreach(var tag in shop.TagNames)
                {
                    arr.Add(tag);
                }

                result.Add(Constants.DtoNames.Shop.Tags, arr);
            }

            result.Add(Constants.DtoNames.Shop.BannerImage, shop.BannerImage);
            result.Add(Constants.DtoNames.Shop.ProfileImage, shop.ProfileImage);
            result.Add(Constants.DtoNames.Shop.CategoryMapName, shop.CategoryMapName);
            result.Add(Constants.DtoNames.Shop.CategoryId, shop.CategoryId);
            if (shop.ShopCategory != null)
            {
                result.Add(Constants.DtoNames.Shop.Category, GetShopCategory(shop.ShopCategory));
            }

            result.Add(Constants.DtoNames.Shop.Place, shop.PlaceId);
            result.Add(Constants.DtoNames.Shop.StreetAddress, shop.StreetAddress); // Street address
            result.Add(Constants.DtoNames.Shop.PostalCode, shop.PostalCode);
            result.Add(Constants.DtoNames.Shop.Locality, shop.Locality);
            result.Add(Constants.DtoNames.Shop.Country, shop.Country);
            var location = new JObject();
            location.Add(Constants.DtoNames.Location.Latitude, shop.Latitude);
            location.Add(Constants.DtoNames.Location.Longitude, shop.Longitude);
            result.Add(Constants.DtoNames.Shop.Location, location);
            result.Add(Constants.DtoNames.Shop.GooglePlaceId, shop.GooglePlaceId);
            var payments = new JArray(); // Payments
            if (shop.ShopPaymentMethods != null && shop.ShopPaymentMethods.Any())
            {
                foreach(var record in shop.ShopPaymentMethods)
                {
                    var payment = new JObject();
                    payment.Add(Constants.DtoNames.PaymentMethod.Method, Enum.GetName(typeof(ShopPaymentMethods), record.Method));
                    if (!string.IsNullOrWhiteSpace(record.Iban))
                    {
                        payment.Add(Constants.DtoNames.PaymentMethod.Iban, record.Iban);
                    }

                    if (!string.IsNullOrWhiteSpace(record.PaypalAccount))
                    {
                        payment.Add(Constants.DtoNames.PaymentMethod.PaypalAccount, record.PaypalAccount);
                    }

                    payments.Add(payment);
                }
            }

            var productCategories = new JArray();
            if (shop.ProductCategories != null && shop.ProductCategories.Any())
            {
                foreach(var record in shop.ProductCategories)
                {
                    productCategories.Add(GetProductCategory(record));
                }
            }

            var filters = new JArray(); // Filters
            if (shop.ShopFilters != null && shop.ShopFilters.Any())
            {
                foreach(var filter in shop.ShopFilters)
                {
                    filters.Add(GetFilter(filter));
                }
            }

            if (shop.CategoryMap != null) // Category Map
            {
                result.Add(Constants.DtoNames.Shop.CategoryMap, GetMap(shop.CategoryMap));
            }

            if (shop.ShopMap != null) // Shop map.
            {
                result.Add(Constants.DtoNames.Shop.ShopMap, GetMap(shop.ShopMap));
            }
            
            result.Add(Constants.DtoNames.Shop.Filters, filters);
            result.Add(Constants.DtoNames.Shop.Payments, payments);
            result.Add(Constants.DtoNames.Shop.ProductCategories, productCategories);
            result.Add(Constants.DtoNames.Shop.ShopPath, shop.ShopRelativePath); // Game
            result.Add(Constants.DtoNames.Shop.UndergroundPath, shop.UndergroundRelativePath);
            result.Add(Constants.DtoNames.Shop.CreateDateTime, shop.CreateDateTime); // Other informations
            result.Add(Constants.DtoNames.Shop.UpdateDateTime, shop.UpdateDateTime);
            result.Add(Constants.DtoNames.Shop.NbComments, nbComments);
            result.Add(Constants.DtoNames.Shop.AverageScore, shop.AverageScore);
            result.Add(Constants.DtoNames.Shop.TotalScore, shop.TotalScore);
            return result;
        }

        public JObject GetProductCategory(ShopProductCategory category)
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.ProductCategory.Id, category.Id);
            result.Add(Constants.DtoNames.ProductCategory.Name, category.Name);
            result.Add(Constants.DtoNames.ProductCategory.Description, category.Description);
            result.Add(Constants.DtoNames.ProductCategory.ShopSectionName, category.ShopSectionName);
            return result;
        }

        public JObject GetFilter(ShopFilter filter)
        {
            if (filter == null)
            {
                throw new ArgumentNullException(nameof(filter));
            }

            var obj = new JObject();
            obj.Add(Constants.DtoNames.Filter.Id, filter.Id);
            obj.Add(Constants.DtoNames.Filter.Name, filter.Name);
            if (filter.Values != null && filter.Values.Any())
            {
                var arr = new JArray();
                foreach(var f in filter.Values)
                {
                    arr.Add(GetFilterValue(f));
                }

                obj.Add(Constants.DtoNames.Filter.Values, arr);
            }

            return obj;
        }

        public JObject GetFilterValue(ShopFilterValue filterValue)
        {
            if (filterValue == null)
            {
                throw new ArgumentNullException(nameof(filterValue));
            }

            var obj = new JObject();
            obj.Add(Constants.DtoNames.FilterValue.Id, filterValue.Id);
            obj.Add(Constants.DtoNames.FilterValue.Content, filterValue.Content);
            return obj;
        }

        public JObject GetShopAddedEvent(ShopAddedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var result = new JObject();
            var location = new JObject();
            location.Add(Constants.DtoNames.Location.Latitude, evt.Latitude);
            location.Add(Constants.DtoNames.Location.Longitude, evt.Longitude);
            result.Add(Constants.DtoNames.Shop.Id, evt.ShopId);
            result.Add(Constants.DtoNames.Shop.Location, location);
            result.Add(Constants.DtoNames.Shop.Name, evt.Name);
            result.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            return result;
        }

        public JObject GetShopUpdatedEvent(ShopUpdatedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var result = new JObject();
            var location = new JObject();
            location.Add(Constants.DtoNames.Location.Latitude, evt.Latitude);
            location.Add(Constants.DtoNames.Location.Longitude, evt.Longitude);
            result.Add(Constants.DtoNames.Shop.Id, evt.ShopId);
            result.Add(Constants.DtoNames.Shop.Location, location);
            result.Add(Constants.DtoNames.Shop.Name, evt.Name);
            result.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            return result;
        }
        
        public JObject GetError(string errorCode, string errorDescription)
        {
            if (string.IsNullOrWhiteSpace(errorCode))
            {
                throw new ArgumentNullException(nameof(errorCode));
            }

            if (string.IsNullOrWhiteSpace(errorDescription))
            {
                throw new ArgumentNullException(nameof(errorDescription));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.Error.Code, errorCode);
            result.Add(Constants.DtoNames.Error.Description, errorDescription);
            return result;
        }

        public JObject GetShopCategory(ShopCategory category)
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Category.Id, category.Id);
            jObj.Add(Constants.DtoNames.Category.Name, category.Name);
            jObj.Add(Constants.DtoNames.Category.Description, category.Description);
            jObj.Add(Constants.DtoNames.Category.PinImagePartialPath, category.PinImagePartialPath);
            return jObj;
        }

        public JObject GetShopCategory(ShopCategoryAggregate category)
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Category.Id, category.Id);
            jObj.Add(Constants.DtoNames.Category.Name, category.Name);
            jObj.Add(Constants.DtoNames.Category.Description, category.Description);
            jObj.Add(Constants.DtoNames.Category.ParentId, category.ParentId);
            if (category.Children != null && category.Children.Any())
            {
                var arr = new JArray();
                foreach(var child in category.Children)
                {
                    var subObj = new JObject();
                    subObj.Add(Constants.DtoNames.Category.Id, child.Id);
                    subObj.Add(Constants.DtoNames.Category.Name, child.Name);
                    subObj.Add(Constants.DtoNames.Category.Description, child.Description);
                    subObj.Add(Constants.DtoNames.Category.ParentId, child.ParentId);
                    arr.Add(subObj);
                }

                jObj.Add(Constants.DtoNames.Category.Children, arr);
            }

            if (category.Maps != null && category.Maps.Any())
            {
                var arr = new JArray();
                foreach(var map in category.Maps)
                {
                    arr.Add(GetMap(map));
                }

                jObj.Add(Constants.DtoNames.Category.Maps, arr);
            }

            return jObj;
        }

        public JObject GetMap(ShopMap map)
        {
            if (map == null)
            {
                throw new ArgumentNullException(nameof(map));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Map.MapName, map.MapName);
            jObj.Add(Constants.DtoNames.Map.MapPartialUrl, map.PartialMapUrl);
            jObj.Add(Constants.DtoNames.Map.OverViewName, map.OverviewName);
            jObj.Add(Constants.DtoNames.Map.OverviewPartialUrl, map.PartialOverviewUrl);
            jObj.Add(Constants.DtoNames.Map.IsMain, map.IsMain);
            return jObj;
        }

        public JObject GetTag(TagAggregate tag)
        {
            if (tag == null)
            {
                throw new ArgumentNullException(nameof(tag));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Tag.Name, tag.Name);
            jObj.Add(Constants.DtoNames.Tag.Description, tag.Description);
            return jObj;
        }

        public JObject GetShopComment(ShopComment comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Comment.Content, comment.Content);
            jObj.Add(Constants.DtoNames.Comment.Id, comment.Id);
            jObj.Add(Constants.DtoNames.Comment.Score, comment.Score);
            jObj.Add(Constants.DtoNames.Comment.Subject, comment.Subject);
            jObj.Add(Constants.DtoNames.Comment.CreateDatetime, comment.CreateDateTime);
            jObj.Add(Constants.DtoNames.Comment.UpdateDatetime, comment.UpdateDateTime);
            return jObj;
        }

        public JObject GetProductComment(ProductComment productComment)
        {
            if (productComment == null)
            {
                throw new ArgumentNullException(nameof(productComment));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Comment.Content, productComment.Content);
            jObj.Add(Constants.DtoNames.Comment.Id, productComment.Id);
            jObj.Add(Constants.DtoNames.Comment.Score, productComment.Score);
            jObj.Add(Constants.DtoNames.Comment.Subject, productComment.Subject);
            jObj.Add(Constants.DtoNames.Comment.CreateDatetime, productComment.CreateDateTime);
            jObj.Add(Constants.DtoNames.Comment.UpdateDatetime, productComment.UpdateDateTime);
            return jObj;
        }

        public JObject GetServiceComment(ServiceComment serviceComment)
        {

            if (serviceComment == null)
            {
                throw new ArgumentNullException(nameof(serviceComment));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Comment.Content, serviceComment.Content);
            jObj.Add(Constants.DtoNames.Comment.Id, serviceComment.Id);
            jObj.Add(Constants.DtoNames.Comment.Score, serviceComment.Score);
            jObj.Add(Constants.DtoNames.Comment.Subject, serviceComment.Subject);
            jObj.Add(Constants.DtoNames.Comment.CreateDatetime, serviceComment.CreateDateTime);
            jObj.Add(Constants.DtoNames.Comment.UpdateDatetime, serviceComment.UpdateDateTime);
            return jObj;
        }

        public JObject GetShopCommentAddedEvent(ShopCommentAddedEvent comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Comment.Content, comment.Content);
            jObj.Add(Constants.DtoNames.Comment.Id, comment.Id);
            jObj.Add(Constants.DtoNames.Comment.Score, comment.Score);
            jObj.Add(Constants.DtoNames.Comment.ShopId, comment.ShopId);
            jObj.Add(Constants.DtoNames.Comment.Subject, comment.Subject);
            jObj.Add(Constants.DtoNames.Comment.CreateDatetime, comment.CreateDateTime);
            jObj.Add(Constants.DtoNames.Comment.UpdateDatetime, comment.UpdateDateTime);
            jObj.Add(Constants.DtoNames.Comment.NbComments, comment.NbComments);
            jObj.Add(Constants.DtoNames.Comment.AverageScore, comment.AverageScore);
            jObj.Add(Constants.DtoNames.Message.CommonId, comment.CommonId);
            return jObj;
        }

        public JObject GetProductCommentAddedEvent(ProductCommentAddedEvent comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Comment.Content, comment.Content);
            jObj.Add(Constants.DtoNames.Comment.Id, comment.Id);
            jObj.Add(Constants.DtoNames.Comment.ShopId, comment.ShopId);
            jObj.Add(Constants.DtoNames.Comment.Score, comment.Score);
            jObj.Add(Constants.DtoNames.Comment.ProductId, comment.ProductId);
            jObj.Add(Constants.DtoNames.Comment.Subject, comment.Subject);
            jObj.Add(Constants.DtoNames.Comment.CreateDatetime, comment.CreateDateTime);
            jObj.Add(Constants.DtoNames.Comment.UpdateDatetime, comment.UpdateDateTime);
            jObj.Add(Constants.DtoNames.Comment.NbComments, comment.NbComments);
            jObj.Add(Constants.DtoNames.Comment.AverageScore, comment.AverageScore);
            return jObj;
        }

        public JObject GetShopCommentRemovedEvent(ShopCommentRemovedEvent comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Comment.Id, comment.Id);
            jObj.Add(Constants.DtoNames.Comment.ShopId, comment.ShopId);
            jObj.Add(Constants.DtoNames.Comment.NbComments, comment.NbComments);
            jObj.Add(Constants.DtoNames.Comment.AverageScore, comment.AverageScore);
            jObj.Add(Constants.DtoNames.Message.CommonId, comment.CommonId);
            return jObj;
        }

        public JObject GetShopRemovedEvent(ShopRemovedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Shop.Id, evt.ShopId);
            jObj.Add(Constants.DtoNames.Shop.Subject, evt.ShopId);
            jObj.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            return jObj;
        }


        public JObject GetServiceCommentRemovedEvent(ServiceCommentRemovedEvent comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Comment.Id, comment.Id);
            jObj.Add(Constants.DtoNames.Comment.ServiceId, comment.ServiceId);
            jObj.Add(Constants.DtoNames.Comment.ShopId, comment.ShopId);
            jObj.Add(Constants.DtoNames.Comment.NbComments, comment.NbComments);
            jObj.Add(Constants.DtoNames.Comment.AverageScore, comment.AverageScore);
            return jObj;
        }

        public JObject GetServiceCommentAddedEvent(ServiceCommentAddedEvent comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Comment.Content, comment.Content);
            jObj.Add(Constants.DtoNames.Comment.Id, comment.Id);
            jObj.Add(Constants.DtoNames.Comment.ShopId, comment.ShopId);
            jObj.Add(Constants.DtoNames.Comment.Score, comment.Score);
            jObj.Add(Constants.DtoNames.Comment.ServiceId, comment.ServiceId);
            jObj.Add(Constants.DtoNames.Comment.Subject, comment.Subject);
            jObj.Add(Constants.DtoNames.Comment.CreateDatetime, comment.CreateDateTime);
            jObj.Add(Constants.DtoNames.Comment.UpdateDatetime, comment.UpdateDateTime);
            jObj.Add(Constants.DtoNames.Comment.NbComments, comment.NbComments);
            jObj.Add(Constants.DtoNames.Comment.AverageScore, comment.AverageScore);
            return jObj;
        }

        public JObject GetServiceAddedEvent(ServiceAddedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Service.Id, evt.Id);
            jObj.Add(Constants.DtoNames.Service.Name, evt.Name);
            jObj.Add(Constants.DtoNames.Service.Description, evt.Description);
            jObj.Add(Constants.DtoNames.Service.ShopId, evt.ShopId);
            jObj.Add(Constants.DtoNames.Service.Price, evt.Price);
            jObj.Add(Constants.DtoNames.Service.NewPrice, evt.NewPrice);
            jObj.Add(Constants.DtoNames.Service.CreateDatetime, evt.CreateDateTime);
            jObj.Add(Constants.DtoNames.Service.UpdateDatetime, evt.UpdateDateTime);
            return jObj;
        }

        public JObject GetClientServiceAddedEvent(ClientServiceAddedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            jObj.Add(Constants.DtoNames.ClientService.Description, evt.Description);
            jObj.Add(Constants.DtoNames.ClientService.Id, evt.Id);
            jObj.Add(Constants.DtoNames.ClientService.CategoryId, evt.CategoryId);
            jObj.Add(Constants.DtoNames.ClientService.CreateDateTime, evt.CreateDateTime);
            jObj.Add(Constants.DtoNames.ClientService.GooglePlaceId, evt.GooglePlaceId);
            var location = new JObject();
            location.Add(Constants.DtoNames.Location.Latitude, evt.Latitude);
            location.Add(Constants.DtoNames.Location.Longitude, evt.Longitude);
            jObj.Add(Constants.DtoNames.ClientService.Location, location);
            jObj.Add(Constants.DtoNames.ClientService.Name, evt.Name);
            jObj.Add(Constants.DtoNames.ClientService.Price, evt.Price);
            jObj.Add(Constants.DtoNames.ClientService.UpdateDateTime, evt.UpdateDateTime);
            return jObj;
        }

        public JObject GetClientServiceRemovedEvent(ClientServiceRemovedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.ClientService.Id, evt.AnnouncementId);
            jObj.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            return jObj;
        }

        public JObject GetProductAddedEvent(ProductAddedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Product.Id, evt.Id);
            jObj.Add(Constants.DtoNames.Product.Name, evt.Name);
            jObj.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            jObj.Add(Constants.DtoNames.Product.Description, evt.Description);
            jObj.Add(Constants.DtoNames.Product.CategoryId, evt.CategoryId);
            jObj.Add(Constants.DtoNames.Product.Price, evt.Price);
            jObj.Add(Constants.DtoNames.Product.NewPrice, evt.NewPrice);
            jObj.Add(Constants.DtoNames.Product.UnitOfMeasure, evt.UnitOfMeasure);
            jObj.Add(Constants.DtoNames.Product.Quantity, evt.Quantity);
            jObj.Add(Constants.DtoNames.Product.ShopId, evt.ShopId);
            jObj.Add(Constants.DtoNames.Product.AverageScore, evt.AverageScore);
            jObj.Add(Constants.DtoNames.Product.TotalScore, evt.TotalScore);
            jObj.Add(Constants.DtoNames.Product.CreateDateTime, evt.CreateDateTime);
            jObj.Add(Constants.DtoNames.Product.UpdateDateTime, evt.UpdateDateTime);
            return jObj;

        }

        public JObject GetProductCommentRemovedEvent(ProductCommentRemovedEvent comment)
        {
            if (comment == null)
            {
                throw new ArgumentNullException(nameof(comment));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Comment.Id, comment.Id);
            jObj.Add(Constants.DtoNames.Comment.ProductId, comment.ProductId);
            jObj.Add(Constants.DtoNames.Comment.ShopId, comment.ShopId);
            jObj.Add(Constants.DtoNames.Comment.NbComments, comment.NbComments);
            jObj.Add(Constants.DtoNames.Comment.AverageScore, comment.AverageScore);
            return jObj;
        }

        public JObject GetProduct(ProductAggregate product)
        {
            if (product == null)
            {
                throw new ArgumentNullException(nameof(product));
            }

            var nbComments = 0;
            if (product.Comments != null)
            {
                nbComments = product.Comments.Count();
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Product.Id, product.Id);
            jObj.Add(Constants.DtoNames.Product.Name, product.Name);
            jObj.Add(Constants.DtoNames.Product.Description, product.Description);
            jObj.Add(Constants.DtoNames.Product.CategoryId, product.CategoryId);
            jObj.Add(Constants.DtoNames.Product.Price, product.Price);
            jObj.Add(Constants.DtoNames.Product.NewPrice, product.NewPrice);
            jObj.Add(Constants.DtoNames.Product.UnitOfMeasure, product.UnitOfMeasure);
            jObj.Add(Constants.DtoNames.Product.Quantity, product.Quantity);
            jObj.Add(Constants.DtoNames.Product.ShopId, product.ShopId);
            jObj.Add(Constants.DtoNames.Product.AverageScore, product.AverageScore);
            jObj.Add(Constants.DtoNames.Product.TotalScore, product.TotalScore);
            jObj.Add(Constants.DtoNames.Product.CreateDateTime, product.CreateDateTime);
            jObj.Add(Constants.DtoNames.Product.UpdateDateTime, product.UpdateDateTime);
            jObj.Add(Constants.DtoNames.Product.NbComments, nbComments);
            if (product.Tags != null && product.Tags.Any())
            {
                JArray arr = new JArray();
                foreach (var tag in product.Tags)
                {
                    arr.Add(tag);
                }

                jObj.Add(Constants.DtoNames.Product.Tags, arr);
            }

            if (product.PartialImagesUrl != null && product.PartialImagesUrl.Any())
            {
                JArray arr = new JArray();
                foreach (var image in product.PartialImagesUrl)
                {
                    arr.Add(image);
                }

                jObj.Add(Constants.DtoNames.Product.Images, arr);
            }

            if (product.Filters != null && product.Filters.Any())
            {
                JArray arr = new JArray();
                foreach (var filterValue in product.Filters)
                {
                    arr.Add(GetProductFilter(filterValue));
                }

                jObj.Add(Constants.DtoNames.Product.Filters, arr);
            }

            if (product.Promotions != null && product.Promotions.Any())
            {
                JArray arr = new JArray();
                foreach(var promotion in product.Promotions)
                {
                    arr.Add(GetPromotion(promotion));
                }

                jObj.Add(Constants.DtoNames.Product.Promotions, arr);
            }

            return jObj;
        }

        public JObject GetProductFilter(ProductAggregateFilter productFilter)
        {
            if (productFilter == null)
            {
                throw new ArgumentNullException(nameof(productFilter));
            }


            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.ProductFilter.FilterId, productFilter.FilterId);
            jObj.Add(Constants.DtoNames.ProductFilter.ValueId, productFilter.FilterValueId);
            jObj.Add(Constants.DtoNames.ProductFilter.Name, productFilter.FilterName);
            jObj.Add(Constants.DtoNames.ProductFilter.Content, productFilter.FilterValueContent);
            return jObj;
        }

        public JObject GetPromotion(ProductAggregatePromotion promotion)
        {
            if (promotion == null)
            {
                throw new ArgumentNullException(nameof(promotion));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Promotion.Id, promotion.Id);
            jObj.Add(Constants.DtoNames.Promotion.ProductId, promotion.ProductId);
            jObj.Add(Constants.DtoNames.Promotion.Discount, promotion.Discount);
            var type = promotion.Type == PromotionTypes.Percentage ? "percentage" : "reduction";
            jObj.Add(Constants.DtoNames.Promotion.Type, type);
            if (!string.IsNullOrWhiteSpace(promotion.Code))
            {
                jObj.Add(Constants.DtoNames.Promotion.Code, promotion.Code);
            }

            jObj.Add(Constants.DtoNames.Promotion.CreateDateTime, promotion.CreateDateTime);
            jObj.Add(Constants.DtoNames.Promotion.UpdateDateTime, promotion.UpdateDateTime);
            jObj.Add(Constants.DtoNames.Promotion.ExpirationDateTime, promotion.ExpirationDateTime);
            return jObj;
        }

        public JObject GetService(ServiceAggregate service)
        {
            if (service == null)
            {
                throw new ArgumentNullException(nameof(service));
            }

            var nbComments = 0;
            if (service.Comments != null)
            {
                nbComments = service.Comments.Count();
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Service.Id, service.Id);
            jObj.Add(Constants.DtoNames.Service.Name, service.Name);
            jObj.Add(Constants.DtoNames.Service.ShopId, service.ShopId);
            jObj.Add(Constants.DtoNames.Service.Description, service.Description);
            jObj.Add(Constants.DtoNames.Service.Price, service.Price);
            jObj.Add(Constants.DtoNames.Service.NewPrice, service.NewPrice);
            jObj.Add(Constants.DtoNames.Service.AverageScore, service.AverageScore);
            jObj.Add(Constants.DtoNames.Service.TotalScore, service.TotalScore);
            jObj.Add(Constants.DtoNames.Service.NbComments, nbComments);
            if (service.PartialImagesUrl != null)
            {
                var arr = new JArray();
                foreach (var url in service.PartialImagesUrl)
                {
                    arr.Add(url);
                }

                jObj.Add(Constants.DtoNames.Service.Images, arr);
            }

            if (service.Tags != null)
            {
                var arr = new JArray();
                foreach (var tag in service.Tags)
                {
                    arr.Add(tag);
                }

                jObj.Add(Constants.DtoNames.Service.Tags, arr);
            }

            if (service.Occurrence != null)
            {
                jObj.Add(Constants.DtoNames.Service.Occurrence, GetServiceOccurrence(service.Occurrence));
            }

            return jObj;
        }

        public JObject GetServiceOccurrence(ServiceResultLine service)
        {
            if (service == null)
            {
                throw new ArgumentNullException(nameof(service));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Service.Id, service.Id);
            jObj.Add(Constants.DtoNames.Service.Name, service.Name);
            jObj.Add(Constants.DtoNames.Service.ShopId, service.ShopId);
            jObj.Add(Constants.DtoNames.Service.Description, service.Description);
            jObj.Add(Constants.DtoNames.Service.Price, service.Price);
            jObj.Add(Constants.DtoNames.Service.AverageScore, service.AverageScore);
            jObj.Add(Constants.DtoNames.Service.TotalScore, service.TotalScore);
            jObj.Add(Constants.DtoNames.Service.NewPrice, service.NewPrice);
            jObj.Add(Constants.DtoNames.ServiceOccurrence.StartDateTime, service.StartDateTime);
            jObj.Add(Constants.DtoNames.ServiceOccurrence.EndDateTime, service.EndDateTime);
            if (service.PartialImagesUrl != null)
            {
                var arr = new JArray();
                foreach (var url in service.PartialImagesUrl)
                {
                    arr.Add(url);
                }

                jObj.Add(Constants.DtoNames.Service.Images, arr);
            }

            if (service.Tags != null)
            {
                var arr = new JArray();
                foreach(var tag in service.Tags)
                {
                    arr.Add(tag);
                }

                jObj.Add(Constants.DtoNames.Service.Tags, arr);
            }

            return jObj;
        }

        public JObject GetServiceOccurrence(ServiceAggregateOccurrence aggregate)
        {
            if (aggregate == null)
            {
                throw new ArgumentNullException(nameof(aggregate));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.ServiceOccurrence.StartDateTime, aggregate.StartDate);
            jObj.Add(Constants.DtoNames.ServiceOccurrence.EndDateTime, aggregate.EndDate);
            jObj.Add(Constants.DtoNames.ServiceOccurrence.StartTime, aggregate.StartTime);
            jObj.Add(Constants.DtoNames.ServiceOccurrence.EndTime, aggregate.EndTime);
            if (aggregate.Days != null)
            {
                var arr = new JArray();
                foreach(var day in aggregate.Days)
                {
                    arr.Add(((int)day).ToString());
                }

                jObj.Add(Constants.DtoNames.ServiceOccurrence.Days, arr);
            }

            return jObj;
        }

        public JObject GetClientService(ClientServiceAggregate announcement)
        {
            if (announcement == null)
            {
                throw new ArgumentNullException(nameof(announcement));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.ClientService.Id, announcement.Id);
            jObj.Add(Constants.DtoNames.ClientService.Name, announcement.Name);
            jObj.Add(Constants.DtoNames.ClientService.Description, announcement.Description);
            jObj.Add(Constants.DtoNames.ClientService.CategoryId, announcement.CategoryId);
            jObj.Add(Constants.DtoNames.ClientService.GooglePlaceId, announcement.GooglePlaceId);
            jObj.Add(Constants.DtoNames.ClientService.Price, announcement.Price);
            jObj.Add(Constants.DtoNames.ClientService.Subject, announcement.Subject);
            jObj.Add(Constants.DtoNames.ClientService.StreetAddress, announcement.StreetAddress);
            jObj.Add(Constants.DtoNames.ClientService.CreateDateTime, announcement.CreateDateTime);
            jObj.Add(Constants.DtoNames.ClientService.UpdateDateTime, announcement.UpdateDateTime);
            var location = new JObject();
            location.Add(Constants.DtoNames.Location.Latitude, announcement.Latitude);
            location.Add(Constants.DtoNames.Location.Longitude, announcement.Longitude);
            jObj.Add(Constants.DtoNames.ClientService.Location, location);
            if (announcement.Category != null)
            {
                jObj.Add(Constants.DtoNames.ClientService.Category, GetCategory(announcement.Category));
            }

            return jObj;
        }

        public JObject GetCategory(ClientServiceCategory category)
        {
            if (category == null)
            {
                throw new ArgumentNullException(nameof(category));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Category.Id, category.Id);
            jObj.Add(Constants.DtoNames.Category.Name, category.Name);
            jObj.Add(Constants.DtoNames.Category.Description, category.Description);
            return jObj;
        }
    }
}
