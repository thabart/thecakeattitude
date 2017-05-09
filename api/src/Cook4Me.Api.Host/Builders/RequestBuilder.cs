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

using Cook4Me.Api.Core.Commands.Shop;
using Cook4Me.Api.Core.Parameters;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;

namespace Cook4Me.Api.Host.Builders
{
    public interface IRequestBuilder
    {
        AddShopCommand GetAddShop(JObject jObj);
        AddPaymentInformation GetPaymentMethod(JObject jObj);
        AddShopCommentCommand GetAddShopComment(JObject jObj);
        SearchShopsParameter GetSearchShops(JObject jObj);
        SearchTagsParameter GetSearchTags(JObject jObj);
        Location GetLocation(JObject jObj);
        SearchShopCommentsParameter GetSearchShopComments(JObject jObj);
        SearchProductCommentsParameter GetSearchProductComments(JObject jObj);
        SearchProductsParameter GetSearchProducts(JObject jObj);
        SearchProductsParameter GetSearchProducts(IQueryCollection query);
        OrderBy GetOrderBy(JObject jObj);
    }

    internal class RequestBuilder : IRequestBuilder
    {
        public AddShopCommand GetAddShop(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new AddShopCommand();
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

            result.TagNames = ts;
            result.BannerImage = jObj.Value<string>(Constants.DtoNames.Shop.BannerImage);
            result.ProfileImage = jObj.Value<string>(Constants.DtoNames.Shop.ProfileImage);
            result.MapName = jObj.Value<string>(Constants.DtoNames.Shop.MapName);
            result.CategoryId = jObj.Value<string>(Constants.DtoNames.Shop.CategoryId);
            result.PlaceId = jObj.Value<string>(Constants.DtoNames.Shop.Place);
            result.StreetAddress = jObj.Value<string>(Constants.DtoNames.Shop.StreetAddress); // Street address
            result.PostalCode = jObj.Value<string>(Constants.DtoNames.Shop.PostalCode);
            result.Locality = jObj.Value<string>(Constants.DtoNames.Shop.Locality);
            result.Country = jObj.Value<string>(Constants.DtoNames.Shop.Country);
            var paymentMethods = new List<AddPaymentInformation>();
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
            result.PaymentMethods = paymentMethods;
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
                OrderBy = orderBy,
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex)
            };
            var count = jObj.Value<int>(Constants.DtoNames.Paginate.Count);
            if (count > 0)
            {
                result.Count = count;
            }

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

        public AddPaymentInformation GetPaymentMethod(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            AddPaymentInformationMethods? methodEnum = null;
            var method = jObj.Value<string>(Constants.DtoNames.PaymentMethod.Method);
            if (string.Equals(method, "cash", StringComparison.CurrentCultureIgnoreCase))
            {
                methodEnum = AddPaymentInformationMethods.Cash;
            }
            else if (string.Equals(method, "bank_transfer", StringComparison.CurrentCultureIgnoreCase))
            {
                methodEnum = AddPaymentInformationMethods.BankTransfer;
            }
            else if (string.Equals(method, "paypal", StringComparison.CurrentCultureIgnoreCase))
            {
                methodEnum = AddPaymentInformationMethods.PayPal;
            }

            if (methodEnum == null)
            {
                throw new ArgumentException(ErrorDescriptions.ThePaymentMethodDoesntExist);
            }

            return new AddPaymentInformation
            {
                Id = Guid.NewGuid().ToString(),
                Method = (AddPaymentInformationMethods)methodEnum.Value,
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

        public AddShopCommentCommand GetAddShopComment(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new AddShopCommentCommand
            {
                Content = jObj.Value<string>(Constants.DtoNames.Comment.Content),
                Score = jObj.Value<int>(Constants.DtoNames.Comment.Score),
                ShopId = jObj.Value<string>(Constants.DtoNames.Comment.ShopId)
            };
        }

        public SearchShopCommentsParameter GetSearchComment(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new SearchShopCommentsParameter
            {
                ShopId = jObj.Value<string>(Constants.DtoNames.Comment.ShopId),
                Subject = jObj.Value<string>(Constants.DtoNames.Comment.Subject),
                Count = jObj.Value<int>(Constants.DtoNames.Paginate.Count),
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex)
            };
        }

        public SearchShopCommentsParameter GetSearchShopComments(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new SearchShopCommentsParameter
            {
                Subject = jObj.Value<string>(Constants.DtoNames.Comment.Subject),
                Count = jObj.Value<int>(Constants.DtoNames.Paginate.Count),
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex)
            };

            return result;
        }

        public SearchProductCommentsParameter GetSearchProductComments(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }
            
            var result = new SearchProductCommentsParameter
            {
                Subject = jObj.Value<string>(Constants.DtoNames.Comment.Subject),
                Count = jObj.Value<int>(Constants.DtoNames.Paginate.Count),
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex)
            };

            return result;
        }


        public SearchProductsParameter GetSearchProducts(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var filters = new List<Core.Parameters.Filter>();
            var arr = jObj.SelectToken(Constants.DtoNames.SearchProduct.Filters) as JArray;
            if (arr != null)
            {
                foreach(var record in arr)
                {
                    filters.Add(GetFilter(record as JObject));
                }
            }

            var count = jObj.Value<int>(Constants.DtoNames.Paginate.Count);
            var minPrice = jObj.Value<double>(Constants.DtoNames.SearchProduct.MinPrice);
            var maxPrice = jObj.Value<double>(Constants.DtoNames.SearchProduct.MaxPrice);
            var containsValidPromotionStr = jObj.Value<string>(Constants.DtoNames.SearchProduct.ContainsValidPromotions);
            FilterPrice filterPrice = null;
            if (minPrice != default(double) && maxPrice != default(double))
            {
                filterPrice = new FilterPrice
                {
                    Min = minPrice,
                    Max = maxPrice
                };
            }

            var orderBy = new List<OrderBy>();
            var ordersObj = jObj.GetValue(Constants.DtoNames.SearchProduct.Orders);
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

            Location northEastLocation = null, southWestLocation = null;
            var neLocation = jObj[Constants.DtoNames.SearchShop.NorthEast];
            var swLocation = jObj[Constants.DtoNames.SearchShop.SouthWest];
            if (neLocation != null && swLocation != null)
            {
                northEastLocation = GetLocation(neLocation as JObject);
                southWestLocation = GetLocation(swLocation as JObject);
            }

            var result = new SearchProductsParameter
            {
                ShopId = jObj.Value<string>(Constants.DtoNames.Product.ShopId),
                IsPagingEnabled = true,
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex),
                Filters = filters,
                FilterPrice = filterPrice,
                ProductName = jObj.Value<string>(Constants.DtoNames.Product.Name),
                CategoryId = jObj.Value<string>(Constants.DtoNames.Product.CategoryId),
                Orders = orderBy,
                NorthEast = northEastLocation,
                SouthWest = southWestLocation
            };

            bool containsValidPromotion = false;
            if (bool.TryParse(containsValidPromotionStr, out containsValidPromotion))
            {
                result.ContainsActivePromotion = containsValidPromotion;
            }

            if (count > 0)
            {
                result.Count = count;
            }

            return result;
        }

        public SearchProductsParameter GetSearchProducts(IQueryCollection query)
        {
            if (query == null)
            {
                throw new ArgumentNullException(nameof(query));
            }

            var result = new SearchProductsParameter();
            foreach (var key in query.Keys)
            {
                TrySetStr((r) => result.ShopId = r, key, Constants.DtoNames.Product.ShopId, query);
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

        public Core.Parameters.Filter GetFilter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new Core.Parameters.Filter
            {
                Id = jObj.Value<string>(Constants.DtoNames.Filter.Id),
                Value = jObj.Value<string>(Constants.DtoNames.Filter.Value)
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
