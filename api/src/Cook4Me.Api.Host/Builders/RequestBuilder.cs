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
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Host.Extensions;
using Microsoft.AspNetCore.Http;
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
        Location GetLocation(JObject jObj);
        Comment GetComment(JObject jObj);
        SearchCommentsParameter GetSearchComment(JObject jObj);
        SearchCommentsParameter GetSearchComment(IQueryCollection query);
        OrderBy GetOrderBy(JObject jObj);
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

            var location = jObj[Constants.DtoNames.Shop.Location];
            if (location != null)
            {
                result.Latitude = location.Value<float>(Constants.DtoNames.Location.Latitude);
                result.Longitude = location.Value<float>(Constants.DtoNames.Location.Longitude);
            }

            result.GooglePlaceId = jObj.Value<string>(Constants.DtoNames.Shop.GooglePlaceId);
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

            Location northEastLocation = null,
                southWestLocation = null;
            var neLocation = jObj[Constants.DtoNames.SearchShop.NorthEast];
            var swLocation = jObj[Constants.DtoNames.SearchShop.SouthWest];
            if (neLocation != null && swLocation != null)
            {
                northEastLocation = GetLocation(neLocation as JObject);
                southWestLocation = GetLocation(swLocation as JObject);
            }
            
            var orderBy = new List<OrderBy>();
            var ordersObj = jObj.GetValue(Constants.DtoNames.SearchShop.Orders);
            if (ordersObj != null)
            {
                var orders = ordersObj as JArray;
                if (orders != null)
                {
                    foreach (var order in orders)
                    {
                        orderBy.Add(GetOrderBy(order as JObject));
                    }
                }
            }

            var result = new SearchShopsParameter
            {
                CategoryId = jObj.Value<string>(Constants.DtoNames.Shop.CategoryId),
                PlaceId = jObj.Value<string>(Constants.DtoNames.Shop.Place),
                Subject = jObj.Value<string>(Constants.DtoNames.SearchShop.Subject),
                NorthEast = northEastLocation,
                SouthWest = southWestLocation,
                OrderBy = orderBy
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

        public Location GetLocation(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new Location
            {
                Latitude = jObj.Value<float>(Constants.DtoNames.Location.Latitude),
                Longitude = jObj.Value<float>(Constants.DtoNames.Location.Longitude)
            };
        }

        public Comment GetComment(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new Comment
            {
                Content = jObj.Value<string>(Constants.DtoNames.Comment.Content),
                Score = jObj.Value<int>(Constants.DtoNames.Comment.Score),
                ShopId = jObj.Value<string>(Constants.DtoNames.Comment.ShopId)
            };
        }

        public SearchCommentsParameter GetSearchComment(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new SearchCommentsParameter
            {
                ShopId = jObj.Value<string>(Constants.DtoNames.Comment.ShopId),
                Subject = jObj.Value<string>(Constants.DtoNames.Comment.Subject),
                Count = jObj.Value<int>(Constants.DtoNames.Paginate.Count),
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex)
            };
        }

        public SearchCommentsParameter GetSearchComment(IQueryCollection query)
        {
            if (query == null)
            {
                throw new ArgumentNullException(nameof(query));
            }

            var result = new SearchCommentsParameter();
            foreach(var key in query.Keys)
            {
                TrySetStr((r) => result.ShopId = r, key, Constants.DtoNames.Comment.ShopId, query);
                TrySetStr((r) => result.Subject = r, key, Constants.DtoNames.Comment.Subject, query);
                TrySetInt((r) => result.StartIndex = r <= 0 ? result.StartIndex : r, key, Constants.DtoNames.Paginate.StartIndex, query);
                TrySetInt((r) => result.Count = r <= 0 ? result.Count : r, key, Constants.DtoNames.Paginate.Count, query);
            }

            return result;
        }

        public OrderBy GetOrderBy(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var method = OrderByMethods.Ascending;
            var orderByMethod = jObj.Value<string>(Constants.DtoNames.OrderBy.Method);
            if (string.Equals(orderByMethod, "desc", StringComparison.CurrentCultureIgnoreCase))
            {
                method = OrderByMethods.Descending;
            }

            return new OrderBy
            {
                Target = jObj.Value<string>(Constants.DtoNames.OrderBy.Target),
                Method = method
            };
        }

        private static void TrySetStr(Action<string> setParameterCallback, string key, string value, IQueryCollection query)
        {
            if (key.Equals(value, StringComparison.CurrentCultureIgnoreCase))
            {
                setParameterCallback(query[key].ToString());
            }
        }

        private static void TrySetInt(Action<int> setParameterCallback, string key, string value, IQueryCollection query)
        {
            if (key.Equals(value, StringComparison.CurrentCultureIgnoreCase))
            {
                int number = GetInt(query[key].ToString(), key);
                setParameterCallback(number);
            }
        }

        private static int GetInt(string value, string name)
        {
            int number;
            if (!int.TryParse(value, out number))
            {
                throw new InvalidOperationException($"the parameter {name} is not valid");
            }

            return number;
        }
    }
}
