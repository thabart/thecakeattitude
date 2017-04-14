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
using Cook4Me.Api.Host.Dtos;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace Cook4Me.Api.Host.Builders
{
    public interface IResponseBuilder
    {
        JObject GetShop(Shop shop);
        JObject GetError(string errorCode, string errorDescription);
        JObject GetUser(User user);
        JObject GetCategory(Category category);
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
            result.Add(Constants.DtoNames.Shop.CreateDateTime, shop.CreateDateTime);
            result.Add(Constants.DtoNames.Shop.Title, shop.Title);
            result.Add(Constants.DtoNames.Shop.Map, shop.MapName);
            result.Add(Constants.DtoNames.Shop.Place, shop.PlaceId);
            result.Add(Constants.DtoNames.Shop.ShopPath, shop.ShopRelativePath);
            result.Add(Constants.DtoNames.Shop.UndergroundPath, shop.UndergroundRelativePath);
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
            jObj.Add(Constants.DtoNames.Category.MapPartialUrl, category.PartialMapUrl);
            jObj.Add(Constants.DtoNames.Category.OverviewPartialUrl, category.PartialOverviewUrl);
            return jObj;
        }
    }
}
