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
using Cook4Me.Api.Core.Events.Shop;
using Cook4Me.Api.Core.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;

namespace Cook4Me.Api.Host.Builders
{
    public interface IResponseBuilder
    {
        JObject GetShop(ShopAggregate shop);
        JObject GetShopAddedEvent(ShopAddedEvent evt);
        JObject GetError(string errorCode, string errorDescription);
        JObject GetCategory(Category category);
        JObject GetMap(Map map);
        JObject GetTag(Tag tag);
        JObject GetShopComment(ShopComment comment);
        JObject GetShopCommentAddedEvent(ShopCommentAddedEvent comment);
        JObject GetShopCommentRemovedEvent(ShopCommentRemovedEvent comment);
        JObject GetProduct(Product product);
        JObject GetFilter(Filter filter);
        JObject GetFilterValue(FilterValue filterValue);
        JObject GetPromotion(ProductPromotion promotion);
    }

    internal class ResponseBuilder : IResponseBuilder
    {
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
            result.Add(Constants.DtoNames.Shop.MapName, shop.MapName);
            result.Add(Constants.DtoNames.Shop.CategoryId, shop.CategoryId);
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
                    payment.Add(Constants.DtoNames.PaymentMethod.Method, Enum.GetName(typeof(PaymentMethods), record.Method));
                    if (!string.IsNullOrWhiteSpace(record.Iban))
                    {
                        payment.Add(Constants.DtoNames.PaymentMethod.Iban, record.Iban);
                    }

                    payments.Add(payment);
                }
            }

            result.Add(Constants.DtoNames.Shop.Payments, payments);
            result.Add(Constants.DtoNames.Shop.ShopPath, shop.ShopRelativePath); // Game
            result.Add(Constants.DtoNames.Shop.UndergroundPath, shop.UndergroundRelativePath);
            result.Add(Constants.DtoNames.Shop.CreateDateTime, shop.CreateDateTime); // Other informations
            result.Add(Constants.DtoNames.Shop.UpdateDateTime, shop.UpdateDateTime);
            result.Add(Constants.DtoNames.Shop.NbComments, nbComments);
            result.Add(Constants.DtoNames.Shop.AverageScore, shop.AverageScore);
            result.Add(Constants.DtoNames.Shop.TotalScore, shop.TotalScore);
            return result;
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

        public JObject GetCategory(Category category)
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

        public JObject GetMap(Map map)
        {
            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Map.MapName, map.MapName);
            jObj.Add(Constants.DtoNames.Map.MapPartialUrl, map.PartialMapUrl);
            jObj.Add(Constants.DtoNames.Map.OverViewName, map.OverviewName);
            jObj.Add(Constants.DtoNames.Map.OverviewPartialUrl, map.PartialOverviewUrl);
            jObj.Add(Constants.DtoNames.Map.IsMain, map.IsMain);
            return jObj;
        }

        public JObject GetTag(Tag tag)
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
            return jObj;
        }

        public JObject GetProduct(Product product)
        {
            if (product == null)
            {
                throw new ArgumentNullException(nameof(product));
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
            jObj.Add(Constants.DtoNames.Product.CreateDateTime, product.CreateDateTime);
            jObj.Add(Constants.DtoNames.Product.UpdateDateTime, product.UpdateDateTime);
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

            if (product.FilterValues != null && product.FilterValues.Any())
            {
                JArray arr = new JArray();
                foreach (var filterValue in product.FilterValues)
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

        public JObject GetProductFilter(ProductFilter productFilter)
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

        public JObject GetFilter(Filter filter)
        {
            if (filter == null)
            {
                throw new ArgumentNullException(nameof(filter));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Filter.Id, filter.Id);
            jObj.Add(Constants.DtoNames.Filter.Name, filter.Name);
            var values = new JArray();
            if (filter.Values != null && filter.Values.Any())
            {
                foreach(var value in filter.Values)
                {
                    values.Add(GetFilterValue(value));
                }
            }

            jObj.Add(Constants.DtoNames.Filter.Values, values);
            return jObj;
        }

        public JObject GetFilterValue(FilterValue filterValue)
        {
            if (filterValue == null)
            {
                throw new ArgumentNullException(nameof(filterValue));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.FilterValue.Id, filterValue.Id);
            jObj.Add(Constants.DtoNames.FilterValue.Content, filterValue.Content);
            return jObj;
        }

        public JObject GetPromotion(ProductPromotion promotion)
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
    }
}
