﻿#region copyright
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
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Host.Extensions;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Cook4Me.Api.Host.Builders
{
    public interface IRequestBuilder
    {
        User GetUser(JObject jObj);
        Shop GetAddShop(JObject jObj);
        SearchShopsParameter GetSearchShops(JObject jObj);
        SearchTagsParameter GetSearchTags(JObject jObj);
        PaymentMethod GetPaymentMethod(JObject jObj);
    }

    internal class RequestBuilder : IRequestBuilder
    {
        public Shop GetAddShop(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new Shop();
            result.Name = jObj.Value<string>(Constants.DtoNames.Shop.Name); // General information
            result.Description = jObj.Value<string>(Constants.DtoNames.Shop.Description);
            var tags = jObj.GetValue(Constants.DtoNames.Shop.Tags);
            JArray firstArr = null;
            var ts = new List<string>();
            if (tags != null && (firstArr = tags as JArray) != null)
            {
                foreach(var tag in tags)
                {
                    ts.Add(tag.ToString());
                }
            }

            result.Tags = ts;
            result.BannerImage = jObj.Value<string>(Constants.DtoNames.Shop.BannerImage);
            result.ProfileImage = jObj.Value<string>(Constants.DtoNames.Shop.ProfileImage);
            result.MapName = jObj.Value<string>(Constants.DtoNames.Shop.MapName);
            result.CategoryId = jObj.Value<string>(Constants.DtoNames.Shop.CategoryId);
            result.PlaceId = jObj.Value<string>(Constants.DtoNames.Shop.Place);
            result.StreetAddress = jObj.Value<string>(Constants.DtoNames.Shop.StreetAddress); // Street address
            result.PostalCode = jObj.Value<string>(Constants.DtoNames.Shop.PostalCode);
            result.Locality = jObj.Value<string>(Constants.DtoNames.Shop.Locality);
            result.Country = jObj.Value<string>(Constants.DtoNames.Shop.Country);
            var paymentMethods = new List<PaymentMethod>();
            var payments = jObj[Constants.DtoNames.Shop.Payments];
            JArray arr = null;
            if (payments != null && (arr = payments as JArray) != null)
            {
                foreach(var payment in payments)
                {
                    paymentMethods.Add(GetPaymentMethod(payment as JObject));
                }
            }

            result.Payments = paymentMethods;
            return result;
        }

        public User GetUser(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new User
            {
                Pseudo = jObj.TryGetString(Constants.DtoNames.User.Pseudo),
                StreetAddress = jObj.TryGetString(Constants.DtoNames.User.StreetAddress),
                StreetNumber = jObj.TryGetString(Constants.DtoNames.User.StreetNumber),
                PostalCode = jObj.TryGetString(Constants.DtoNames.User.PostalCode),
                City = jObj.TryGetString(Constants.DtoNames.User.City),
                Email = jObj.TryGetString(Constants.DtoNames.User.Email),
                PhoneNumber = jObj.TryGetString(Constants.DtoNames.User.PhoneNumber),
                IsSeller = jObj.TryGetBoolean(Constants.DtoNames.User.IsSeller)
            };
            return result;
        }

        public SearchShopsParameter GetSearchShops(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new SearchShopsParameter
            {
                CategoryId = jObj.Value<string>(Constants.DtoNames.Shop.CategoryId),
                PlaceId = jObj.Value<string>(Constants.DtoNames.Shop.Place),
                Subject = jObj.Value<string>(Constants.DtoNames.SearchShop.Subject)
            };
            return result;
        }

        public SearchTagsParameter GetSearchTags(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new SearchTagsParameter
            {
                Name = jObj.Value<string>(Constants.DtoNames.Tag.Name)
            };
            return result;
        }

        public PaymentMethod GetPaymentMethod(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            PaymentMethods? methodEnum = null;
            var method = jObj.Value<string>(Constants.DtoNames.PaymentMethod.Method);
            if (string.Equals(method, "cash", StringComparison.CurrentCultureIgnoreCase))
            {
                methodEnum = PaymentMethods.Cash;
            }
            else if (string.Equals(method, "bank_transfer", StringComparison.CurrentCultureIgnoreCase))
            {
                methodEnum = PaymentMethods.BankTransfer;
            }
            else if (string.Equals(method, "paypal", StringComparison.CurrentCultureIgnoreCase))
            {
                methodEnum = PaymentMethods.PayPal;
            }

            if (methodEnum == null)
            {
                throw new ArgumentException(ErrorDescriptions.ThePaymentMethodDoesntExist);
            }

            return new PaymentMethod
            {
                Id = Guid.NewGuid().ToString(),
                Method = methodEnum.Value,
                Iban = jObj.Value<string>(Constants.DtoNames.PaymentMethod.Iban)
            };
        }
    }
}
