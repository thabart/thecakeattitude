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

using Cook4Me.Api.Core.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;

namespace Cook4Me.Api.Host.Builders
{
    public interface IResponseBuilder
    {
        JObject GetShop(Shop shop);
        JObject GetError(string errorCode, string errorDescription);
        JObject GetUser(User user);
        JObject GetCategory(Category category);
        JObject GetMap(Map map);
        JObject GetTag(Tag tag);
    }

    internal class ResponseBuilder : IResponseBuilder
    {
        public JObject GetShop(Shop shop)
        {
            if (shop == null)
            {
                throw new ArgumentNullException(nameof(shop));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.Shop.Id, shop.Id);
            result.Add(Constants.DtoNames.Shop.Subject, shop.Subject); // General information
            result.Add(Constants.DtoNames.Shop.Name, shop.Name);
            result.Add(Constants.DtoNames.Shop.Description, shop.Description);
            if (shop.Tags != null && shop.Tags.Any())
            {
                JArray arr = new JArray();
                foreach(var tag in shop.Tags)
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
            location.Add(Constants.DtoNames.Shop.Latitude, shop.Latitude);
            location.Add(Constants.DtoNames.Shop.Longitude, shop.Longitude);
            result.Add(Constants.DtoNames.Shop.Location, location);
            result.Add(Constants.DtoNames.Shop.GooglePlaceId, shop.GooglePlaceId);
            var payments = new JArray(); // Payments
            if (shop.Payments != null && shop.Payments.Any())
            {
                foreach(var record in shop.Payments)
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
            result.Add(Constants.DtoNames.Shop.CreateDateTime, shop.CreateDateTime);
            result.Add(Constants.DtoNames.Shop.UpdateDateTime, shop.UpdateDateTime);
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

        public JObject GetUser(User user)
        {
            if (user == null)
            {
                throw new ArgumentNullException(nameof(user));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.User.City, user.City);
            result.Add(Constants.DtoNames.User.Email, user.Email);
            result.Add(Constants.DtoNames.User.IsSeller, user.IsSeller);
            result.Add(Constants.DtoNames.User.PhoneNumber, user.PhoneNumber);
            result.Add(Constants.DtoNames.User.PostalCode, user.PostalCode);
            result.Add(Constants.DtoNames.User.Pseudo, user.Pseudo);
            result.Add(Constants.DtoNames.User.StreetAddress, user.StreetAddress);
            result.Add(Constants.DtoNames.User.StreetNumber, user.StreetNumber);
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
    }
}
