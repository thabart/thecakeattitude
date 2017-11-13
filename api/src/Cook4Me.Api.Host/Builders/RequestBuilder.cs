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
using Cook4Me.Api.Core.Commands.ClientService;
using Cook4Me.Api.Core.Commands.Discount;
using Cook4Me.Api.Core.Commands.Messages;
using Cook4Me.Api.Core.Commands.Notifications;
using Cook4Me.Api.Core.Commands.Orders;
using Cook4Me.Api.Core.Commands.Product;
using Cook4Me.Api.Core.Commands.Service;
using Cook4Me.Api.Core.Commands.Shop;
using Cook4Me.Api.Core.Commands.Ups;
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Host.Extensions;
using Cook4Me.Common;
using Dhl.Client.Params;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using Ups.Client.Params;

namespace Cook4Me.Api.Host.Builders
{
    public interface IRequestBuilder
    {
        SearchFeedItemsParameter GetSearchFeedItems(JObject jObj);
        UpdateProductFilter GetUpdateProductFilter(JObject jObj);
        UpdateProductCommand GetUpdateProduct(JObject jObj);
        SearchDiscountsParameter GetSearchDiscountsParameter(JObject jObj);
        AddDiscountCommand GetAddDiscountCommand(JObject jObj);
        ConfirmOrderLabelPurchaseCommand GetConfirmOrderLabelPurchase(JObject jObj);
        ParcelSize GetParcelSize(JObject jObj);
        PurchaseOrderLabelCommand GetPurchaseOrderLabelCommand(JObject jObj);
        AcceptOrderTransactionCommand GetAcceptOrderTransactionCommand(JObject jObj);
        BuyUpsLabelCommand GetBuyUpsLabelCommand(JObject jObj);
        UpsPaymentInformationParameter GetUpsPaymentInformation(JObject jObj);
        GetUpsRatingsParameter GetUpsRatingsParameter(JObject jObj);
        UpsAlternateDeliveryAddressParameter GetUpsAlternateDeliveryAddressParameter(JObject jObj);
        UpsShipParameter GetUpsShipParameter(JObject jObj);
        UpsAddressParameter GetUpsAddressParameter(JObject jObj);
        UpsPackageParameter GetUpsPackageParameter(JObject jObj);
        UpsShipperParameter GetUpsShipperParameter(JObject jObj);
        SearchDhlCapabilitiesParameter GetSearchDhlCapabilitiesParameter(JObject jObj);
        SearchDhlParcelShopLocationsParameter GetSearchDhlParcelShopLocations(JObject jObj);
        AddOrderLineCommand GetAddOrderLine(JObject jObj);
        UpdateOrderCommand GetUpdateOrder(JObject jObj);
        SearchOrdersParameter GetSearchOrdersParameter(JObject jObj);
        AddMessageCommand GetAddMessage(JObject jObj);
        SearchMessagesParameter GetSearchMessages(JObject jObj);
        GetNotificationStatusParameter GetNotificationStatus(JObject jObj);
        UpdateNotificationCommand GetUpdateNotification(JObject jObj);
        SearchNotificationsParameter GetSearchNotifications(JObject jObj);
        AddClientServiceCommand GetClientService(JObject jObj);
        AddShopCommand GetAddShop(JObject jObj);
        UpdateServiceCommand GetUpdateService(JObject jObj);
        AddServiceCommand GetAddService(JObject jObj);
        UpdateServiceOccurrence GetUpdateServiceOccurrence(JObject jObj);
        AddServiceOccurrence GetAddServiceOccurrence(JObject jObj);
        UpdateShopCommand GetUpdateShop(JObject jObj);
        AddShopCommentCommand GetAddShopComment(JObject jObj);
        AddProductCommentCommand GetAddProductComment(JObject jObj);
        AddServiceCommentCommand GetAddServiceComment(JObject jObj);
        AddProductCommand GetAddProduct(JObject jObj);
        SearchShopsParameter GetSearchShops(JObject jObj);
        SearchTagsParameter GetSearchTags(JObject jObj);
        Location GetLocation(JObject jObj);
        SearchShopCommentsParameter GetSearchShopComments(JObject jObj);
        SearchProductCommentsParameter GetSearchProductComments(JObject jObj);
        SearchServiceCommentParameter GetSearchServiceComments(JObject jObj);
        SearchProductsParameter GetSearchProducts(JObject jObj);
        SearchServiceParameter GetSearchServices(JObject jObj);
        SearchClientServicesParameter GetSearchAnnouncements(JObject jObj);
        SearchServiceOccurrenceParameter GetSearchServiceOccurrences(JObject jObj);
        GetLocationsParameter GetLocationsParameter(JObject jObj);
        OrderBy GetOrderBy(JObject jObj);
    }

    internal class RequestBuilder : IRequestBuilder
    {        
        public SearchFeedItemsParameter GetSearchFeedItems(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new SearchFeedItemsParameter
            {
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex)
            };
            var count = jObj.Value<int>(Constants.DtoNames.Paginate.Count);
            if (count > 0)
            {
                result.Count = count;
            }

            return result;
        }

        public SearchDiscountsParameter GetSearchDiscountsParameter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }
            
            var result = new SearchDiscountsParameter
            {
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex)
            };
            var count = jObj.Value<int>(Constants.DtoNames.Paginate.Count);
            if (count > 0)
            {
                result.Count = count;
            }

            return result;
        }

        public AddDiscountCommand GetAddDiscountCommand(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new AddDiscountCommand();
            result.Counter = jObj.TryGetInt(Constants.DtoNames.DiscountNames.Counter);
            result.EndDateTime = jObj.TryGetDateTime(Constants.DtoNames.DiscountNames.EndDateTime);
            result.ProductIds = jObj.TryGetStringArray(Constants.DtoNames.DiscountNames.ProductIds);
            result.StartDateTime = jObj.TryGetDateTime(Constants.DtoNames.DiscountNames.StartDateTime);
            result.Value = jObj.TryGetDouble(Constants.DtoNames.DiscountNames.Value);
            result.IsPrivate = jObj.TryGetBoolean(Constants.DtoNames.DiscountNames.IsPrivate);
            var kvpPromotion = CommonBuilder.MappingDiscountPromotions.FirstOrDefault(kvp => kvp.Value == jObj.TryGetString(Constants.DtoNames.DiscountNames.Type));
            if (!kvpPromotion.Equals(default(KeyValuePair<DiscountAggregatePromotions, string>)) && !string.IsNullOrWhiteSpace(kvpPromotion.Value))
            {
                result.PromotionType = kvpPromotion.Key;
            }

            var kvpValidity = CommonBuilder.MappingDiscountValidities.FirstOrDefault(kvp => kvp.Value == jObj.TryGetString(Constants.DtoNames.DiscountNames.Validity));
            if (!kvpValidity.Equals(default(KeyValuePair<DiscountAggregateValidities, string>)) && !string.IsNullOrWhiteSpace(kvpValidity.Value))
            {
                result.Validity = kvpValidity.Key;
            }

            return result;

        }
        public ConfirmOrderLabelPurchaseCommand GetConfirmOrderLabelPurchase(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new ConfirmOrderLabelPurchaseCommand();
            result.CommonId = jObj.TryGetString(Constants.DtoNames.Message.CommonId);
            result.PayerId = jObj.TryGetString(Constants.DtoNames.PaypalApprovedNames.PayerId);
            result.TransactionId = jObj.TryGetString(Constants.DtoNames.PaypalApprovedNames.TransactionId);
            return result;
        }

        public ParcelSize GetParcelSize(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new ParcelSize
            {
                Height = jObj.TryGetDouble(Constants.DtoNames.ParcelSizeParameterNames.Height),
                Length = jObj.TryGetDouble(Constants.DtoNames.ParcelSizeParameterNames.Length),
                Weight = jObj.TryGetDouble(Constants.DtoNames.ParcelSizeParameterNames.Weight),
                Width = jObj.TryGetDouble(Constants.DtoNames.ParcelSizeParameterNames.Width)
            };
        }

        public PurchaseOrderLabelCommand GetPurchaseOrderLabelCommand(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new PurchaseOrderLabelCommand();
            var package = jObj.GetValue(Constants.DtoNames.PurchaseOrderLabelNames.Package) as JObject;
            if (package != null)
            {
                result.ParcelSize = GetParcelSize(package);
            }

            return result;
        }

        public AcceptOrderTransactionCommand GetAcceptOrderTransactionCommand(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new AcceptOrderTransactionCommand();
            result.CommonId = jObj.TryGetString(Constants.DtoNames.Message.CommonId);
            result.OrderId = jObj.TryGetString(Constants.DtoNames.AcceptOrderTransactionCommandNames.OrderId);
            result.PayerId = jObj.TryGetString(Constants.DtoNames.PaypalApprovedNames.PayerId);
            result.TransactionId = jObj.TryGetString(Constants.DtoNames.PaypalApprovedNames.TransactionId);
            var kvpPayment = CommonBuilder.MappingOrderPayments.FirstOrDefault(kvp => kvp.Value == jObj.TryGetString(Constants.DtoNames.OrderPaymentNames.PaymentMethod));
            if (!kvpPayment.Equals(default(KeyValuePair<OrderPayments, string>)) && !string.IsNullOrWhiteSpace(kvpPayment.Value))
            {
                result.PaymentMethod = kvpPayment.Key;
            }

            return result;
        }

        public BuyUpsLabelCommand GetBuyUpsLabelCommand(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var alternateAdrObj = jObj.GetValue(Constants.DtoNames.GetUpsRatingsParameterNames.AlternateDeliveryAddress) as JObject;
            var shipperObj = jObj.GetValue(Constants.DtoNames.GetUpsRatingsParameterNames.Shipper) as JObject;
            var shipToObj = jObj.GetValue(Constants.DtoNames.GetUpsRatingsParameterNames.ShipTo) as JObject;
            var shipFromObj = jObj.GetValue(Constants.DtoNames.GetUpsRatingsParameterNames.ShipFrom) as JObject;
            var packageObj = jObj.GetValue(Constants.DtoNames.GetUpsRatingsParameterNames.Package) as JObject;
            var cardObj = jObj.GetValue(Constants.DtoNames.GetUpsConfirmShipParameterNames.Card) as JObject;
            var result = new BuyUpsLabelCommand
            {
                AlternateDeliveryAddress = alternateAdrObj == null ? null : GetUpsAlternateDeliveryAddressParameter(alternateAdrObj),
                Package = packageObj == null ? null : GetUpsPackageParameter(packageObj),
                ShipFrom = shipFromObj == null ? null : GetUpsShipParameter(shipFromObj),
                ShipTo = shipToObj == null ? null : GetUpsShipParameter(shipToObj),
                Shipper = shipperObj == null ? null : GetUpsShipperParameter(shipperObj),
                PaymentInformation = cardObj == null ? null : GetUpsPaymentInformation(cardObj)
            };
            if (result.PaymentInformation != null && result.ShipFrom != null && result.ShipFrom.Address != null)
            {
                result.PaymentInformation.Address = result.ShipFrom.Address;    
            }

            return result;
        }

        public UpsPaymentInformationParameter GetUpsPaymentInformation(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new UpsPaymentInformationParameter
            {
                ExpirationDate = jObj.TryGetString(Constants.DtoNames.UpsPaymentInformationNames.Expiration),
                Number = jObj.TryGetString(Constants.DtoNames.UpsPaymentInformationNames.Number),
                SecurityCode = jObj.TryGetString(Constants.DtoNames.UpsPaymentInformationNames.Cvc),
                Type = jObj.TryGetString(Constants.DtoNames.UpsPaymentInformationNames.Type)
            };
        }

        public GetUpsRatingsParameter GetUpsRatingsParameter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var alternateAdrObj = jObj.GetValue(Constants.DtoNames.GetUpsRatingsParameterNames.AlternateDeliveryAddress) as JObject;
            var shipperObj = jObj.GetValue(Constants.DtoNames.GetUpsRatingsParameterNames.Shipper) as JObject;
            var shipToObj = jObj.GetValue(Constants.DtoNames.GetUpsRatingsParameterNames.ShipTo) as JObject;
            var shipFromObj = jObj.GetValue(Constants.DtoNames.GetUpsRatingsParameterNames.ShipFrom) as JObject;
            var packageObj = jObj.GetValue(Constants.DtoNames.GetUpsRatingsParameterNames.Package) as JObject;
            var service = jObj.TryGetString(Constants.DtoNames.GetUpsRatingsParameterNames.UpsService);
            var result = new GetUpsRatingsParameter
            {
                AlternateDeliveryAddress = alternateAdrObj == null ? null : GetUpsAlternateDeliveryAddressParameter(alternateAdrObj),
                Package = packageObj == null ? null : GetUpsPackageParameter(packageObj),
                ShipFrom = shipFromObj == null ? null : GetUpsShipParameter(shipFromObj),
                ShipTo = shipToObj == null ? null : GetUpsShipParameter(shipToObj),
                Shipper = shipperObj == null ? null : GetUpsShipperParameter(shipperObj)
            };

            if (!string.IsNullOrWhiteSpace(service))
            {
                var kvpUpsService = CommonBuilder.MappingUpsServices.FirstOrDefault(kvp => kvp.Value == service);
                if (!kvpUpsService.Equals(default(KeyValuePair<UpsAggregateServices, string>)))
                {
                    result.UpsService = kvpUpsService.Key;
                }
            }

            return result;
        }

        public UpsAlternateDeliveryAddressParameter GetUpsAlternateDeliveryAddressParameter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new UpsAlternateDeliveryAddressParameter
            {
                Name = jObj.TryGetString(Constants.DtoNames.UpsAlternateDeliveryAddressParameterNames.Name)
            };
            var adrObj = jObj.GetValue(Constants.DtoNames.UpsAlternateDeliveryAddressParameterNames.Address);
            if (adrObj != null)
            {
                var adr = adrObj as JObject;
                if (adr != null)
                {
                    result.Address = GetUpsAddressParameter(adr);
                }
            }

            return result;
        }

        public UpsShipperParameter GetUpsShipperParameter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new UpsShipperParameter
            {
                Name = jObj.TryGetString(Constants.DtoNames.UpsShipperParameterNames.Name)
            };
            var adrObj = jObj.GetValue(Constants.DtoNames.UpsShipParameterNames.Address);
            if (adrObj != null)
            {
                var adr = adrObj as JObject;
                if (adr != null)
                {
                    result.Address = GetUpsAddressParameter(adr);
                }
            }

            return result;
        }

        public UpsShipParameter GetUpsShipParameter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new UpsShipParameter
            {
                Name = jObj.TryGetString(Constants.DtoNames.UpsShipParameterNames.Name),
                AttentionName = jObj.TryGetString(Constants.DtoNames.UpsShipParameterNames.Name),
                CompanyName = jObj.TryGetString(Constants.DtoNames.UpsShipParameterNames.Name)
            };

            var adrObj = jObj.GetValue(Constants.DtoNames.UpsShipParameterNames.Address);
            if (adrObj != null)
            {
                var adr = adrObj as JObject;
                if (adr != null)
                {
                    result.Address = GetUpsAddressParameter(adr);
                }
            }

            return result;
        }

        public UpsAddressParameter GetUpsAddressParameter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new UpsAddressParameter
            {
                AddressLine = jObj.TryGetString(Constants.DtoNames.UpsAddressParameterNames.AddressLine),
                City = jObj.TryGetString(Constants.DtoNames.UpsAddressParameterNames.City),
                Country = jObj.TryGetString(Constants.DtoNames.UpsAddressParameterNames.Country),
                PostalCode = jObj.TryGetString(Constants.DtoNames.UpsAddressParameterNames.PostalCode)
            };
        }

        public UpsPackageParameter GetUpsPackageParameter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new UpsPackageParameter
            {
                Height = jObj.TryGetDouble(Constants.DtoNames.ParcelSizeParameterNames.Height),
                Length = jObj.TryGetDouble(Constants.DtoNames.ParcelSizeParameterNames.Length),
                Weight = jObj.TryGetDouble(Constants.DtoNames.ParcelSizeParameterNames.Weight),
                Width = jObj.TryGetDouble(Constants.DtoNames.ParcelSizeParameterNames.Width)
            };
        }

        public SearchDhlCapabilitiesParameter GetSearchDhlCapabilitiesParameter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new SearchDhlCapabilitiesParameter
            {
                ParcelType = jObj.TryGetString(Constants.DtoNames.SearchDhlCapabilitiesParameterNames.ParcelType),
                ToZipCode = jObj.TryGetString(Constants.DtoNames.SearchDhlCapabilitiesParameterNames.ToZipCode)
            };
        }

        public SearchDhlParcelShopLocationsParameter GetSearchDhlParcelShopLocations(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new SearchDhlParcelShopLocationsParameter
            {
                City = jObj.TryGetString(Constants.DtoNames.SearchDhlParcelShopLocationsParameterNames.City),
                HouseNumber = jObj.TryGetString(Constants.DtoNames.SearchDhlParcelShopLocationsParameterNames.HouseNumber),
                Street = jObj.TryGetString(Constants.DtoNames.SearchDhlParcelShopLocationsParameterNames.Street),
                ZipCode = jObj.TryGetString(Constants.DtoNames.SearchDhlParcelShopLocationsParameterNames.ZipCode),
                Query = jObj.TryGetString(Constants.DtoNames.SearchDhlParcelShopLocationsParameterNames.Query)
            };
        }

        public AddOrderLineCommand GetAddOrderLine(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new AddOrderLineCommand
            {
                ProductId = jObj.TryGetString(Constants.DtoNames.OrderLineNames.ProductId)
            };
        }

        public UpdateOrderCommand GetUpdateOrder(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var orderLines = new List<UpdateOrderLine>();
            var arrObj = jObj.GetValue(Constants.DtoNames.OrderNames.Lines);
            if (arrObj != null)
            {
                var arr = arrObj as JArray;
                if (arr != null)
                {
                    foreach(var rec in arr)
                    {
                        orderLines.Add(GetUpdateOrderLine(rec as JObject));
                    }
                }
            }

            var status = jObj.TryGetString(Constants.DtoNames.OrderNames.Status);
            var transportMode = jObj.TryGetString(Constants.DtoNames.OrderNames.TransportMode);
            var st = OrderAggregateStatus.Created;
            var tm = OrderTransportModes.None;
            switch (status)
            {
                case "created":
                    st = OrderAggregateStatus.Created;
                    break;
                case "confirmed":
                    st = OrderAggregateStatus.Confirmed;
                    break;
                case "received":
                    st = OrderAggregateStatus.Received;
                    break;
            }
            

            switch(transportMode)
            {
                case "manual":
                    tm = OrderTransportModes.Manual;
                    break;
                case "packet":
                    tm = OrderTransportModes.Packet;
                    break;
            }

            var result = new UpdateOrderCommand
            {
                Id = jObj.TryGetString(Constants.DtoNames.OrderNames.Id),
                OrderLines = orderLines,
                Status = st,
                TransportMode = tm
            };
            AddOrderParcelCommand orderParcel = null;
            var orderParcelObj = jObj.GetValue(Constants.DtoNames.OrderNames.Package) as JObject;
            if (orderParcelObj != null)
            {
                orderParcel = GetAddOrderParcel(orderParcelObj);
            }

            result.OrderParcel = orderParcel;
            return result;
        }

        public AddOrderParcelCommand GetAddOrderParcel(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var transporter = jObj.TryGetString(Constants.DtoNames.ParcelNames.Transporter);
            Transporters transporterEnum = Transporters.None;
            switch (transporter)
            {
                case "ups":
                    transporterEnum = Transporters.Ups;
                    break;
                case "dhl":
                    transporterEnum = Transporters.Dhl;
                    break;
            }

            var result = new AddOrderParcelCommand
            {
                EstimatedPrice = jObj.TryGetDouble(Constants.DtoNames.ParcelNames.EstimatedPrice),
                Transporter = transporterEnum
            };

            var upsServiceCode = jObj.TryGetString(Constants.DtoNames.ParcelNames.UpsService);
            var kvpUpsService = CommonBuilder.MappingUpsAggregateServices.FirstOrDefault(kvp => kvp.Value == upsServiceCode);
            if (!kvpUpsService.Equals(default(KeyValuePair<UpsAggregateServices, string>)))
            {
                result.UpsServiceCode = kvpUpsService.Key;
            }

            var buyerObj = jObj.GetValue(Constants.DtoNames.ParcelNames.Buyer) as JObject;
            var sellerObj = jObj.GetValue(Constants.DtoNames.ParcelNames.Seller) as JObject;
            var parcelShopObj = jObj.GetValue(Constants.DtoNames.ParcelNames.ParcelShop) as JObject;
            if (buyerObj != null)
            {
                result.BuyerName = buyerObj.TryGetString(Constants.DtoNames.ParcelActorNames.Name);
                var buyerAdrObj = buyerObj.GetValue(Constants.DtoNames.ParcelActorNames.Address) as JObject;
                if (buyerAdrObj != null)
                {
                    result.BuyerAddressLine = buyerAdrObj.TryGetString(Constants.DtoNames.ParcelAddressNames.AddressLine);
                    result.BuyerCity = buyerAdrObj.TryGetString(Constants.DtoNames.ParcelAddressNames.City);
                    result.BuyerCountryCode = buyerAdrObj.TryGetString(Constants.DtoNames.ParcelAddressNames.CountryCode);
                    result.BuyerAddressLine = buyerAdrObj.TryGetString(Constants.DtoNames.ParcelAddressNames.AddressLine);
                    result.BuyerPostalCode = buyerAdrObj.TryGetInt(Constants.DtoNames.ParcelAddressNames.PostalCode);
                }
            }

            if (sellerObj != null)
            {
                result.SellerName = sellerObj.TryGetString(Constants.DtoNames.ParcelActorNames.Name);
                var sellerAdrObj = sellerObj.GetValue(Constants.DtoNames.ParcelActorNames.Address) as JObject;
                if (sellerAdrObj != null)
                {
                    result.SellerAddressLine = sellerAdrObj.TryGetString(Constants.DtoNames.ParcelAddressNames.AddressLine);
                    result.SellerCity = sellerAdrObj.TryGetString(Constants.DtoNames.ParcelAddressNames.City);
                    result.SellerCountryCode = sellerAdrObj.TryGetString(Constants.DtoNames.ParcelAddressNames.CountryCode);
                    result.SellerAddressLine = sellerAdrObj.TryGetString(Constants.DtoNames.ParcelAddressNames.AddressLine);
                    result.SellerPostalCode = sellerAdrObj.TryGetInt(Constants.DtoNames.ParcelAddressNames.PostalCode);
                }
            }

            if (parcelShopObj != null)
            {
                result.ParcelShopId = parcelShopObj.TryGetString(Constants.DtoNames.ParcelShopNames.Id);
                result.ParcelShopName = parcelShopObj.TryGetString(Constants.DtoNames.ParcelShopNames.Name);
                var parcelShopLocation = parcelShopObj.GetValue(Constants.DtoNames.ParcelShopNames.Location) as JObject;
                if (parcelShopLocation != null)
                {
                    var location = GetLocation(parcelShopLocation);
                    result.ParcelShopLatitude = location.Latitude;
                    result.ParcelShopLongitude = location.Longitude;
                }

                var parcelAdrObj = parcelShopObj.GetValue(Constants.DtoNames.ParcelActorNames.Address) as JObject;
                if (parcelAdrObj != null)
                {
                    result.ParcelShopAddressLine = parcelAdrObj.TryGetString(Constants.DtoNames.ParcelAddressNames.AddressLine);
                    result.ParcelShopCity = parcelAdrObj.TryGetString(Constants.DtoNames.ParcelAddressNames.City);
                    result.ParcelShopCountryCode = parcelAdrObj.TryGetString(Constants.DtoNames.ParcelAddressNames.CountryCode);
                    result.ParcelShopAddressLine = parcelAdrObj.TryGetString(Constants.DtoNames.ParcelAddressNames.AddressLine);
                    result.ParcelShopPostalCode = parcelAdrObj.TryGetInt(Constants.DtoNames.ParcelAddressNames.PostalCode);
                }
            }

            return result;
        }

        public UpdateOrderLine GetUpdateOrderLine(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new UpdateOrderLine
            {
                Id = jObj.TryGetString(Constants.DtoNames.OrderLineNames.Id),
                ProductId = jObj.TryGetString(Constants.DtoNames.OrderLineNames.ProductId),
                Quantity = jObj.Value<int>(Constants.DtoNames.OrderLineNames.Quantity),
                DiscountCode = jObj.TryGetString(Constants.DtoNames.OrderLineNames.DiscountCode)
            };
        }

        public SearchOrdersParameter GetSearchOrdersParameter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var ordersObj = jObj.GetValue(Constants.DtoNames.SearchOrdersParameterNames.Orders);
            var orderBy = new List<OrderBy>();
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

            var statutsLst = new List<int>();
            var statutsObj = jObj.GetValue(Constants.DtoNames.SearchOrdersParameterNames.Status);
            if (statutsObj != null)
            {
                var statuts = statutsObj as JArray;
                if (statuts != null)
                {
                    foreach(var statut in statuts)
                    {
                        switch(statut.ToString())
                        {
                            case "created":
                                statutsLst.Add((int)OrderAggregateStatus.Created);
                                break;
                            case "confirmed":
                                statutsLst.Add((int)OrderAggregateStatus.Confirmed);
                                break;
                            case "received":
                                statutsLst.Add((int)OrderAggregateStatus.Received);
                                break;
                        }
                    }
                }
            }

            var result = new SearchOrdersParameter
            {
                IsPagingEnabled = true,
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex),
                OrderBy = orderBy,
                Status = statutsLst,
                Clients = jObj.TryGetStringArray(Constants.DtoNames.SearchOrdersParameterNames.Clients),
                Sellers = jObj.TryGetStringArray(Constants.DtoNames.SearchOrdersParameterNames.Sellers)
            };

            var count = jObj.Value<int>(Constants.DtoNames.Paginate.Count);
            if (count > 0)
            {
                result.Count = count;
            }

            return result;
        }

        public GetLocationsParameter GetLocationsParameter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new GetLocationsParameter
            {
                Address = new UpsAddressParameter
                {
                    AddressLine = jObj.TryGetString(Constants.DtoNames.SearchUpsLocations.AddressLine),
                    City = jObj.TryGetString(Constants.DtoNames.SearchUpsLocations.City),
                    Country = jObj.TryGetString(Constants.DtoNames.SearchUpsLocations.Country),
                    PostalCode = jObj.TryGetString(Constants.DtoNames.SearchUpsLocations.PostalCode)
                }
            };
        }

        public AddMessageCommand GetAddMessage(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var addMessageCommand = new AddMessageCommand
            {
                To = jObj.TryGetString(Constants.DtoNames.UserMessage.To),
                ProductId = jObj.TryGetString(Constants.DtoNames.UserMessage.ProductId),
                ServiceId = jObj.TryGetString(Constants.DtoNames.UserMessage.ServiceId),
                ClientServiceId = jObj.TryGetString(Constants.DtoNames.UserMessage.ClientServiceId),
                Content = jObj.TryGetString(Constants.DtoNames.UserMessage.Content),
                ParentId = jObj.TryGetString(Constants.DtoNames.UserMessage.ParentId),
                Subject = jObj.TryGetString(Constants.DtoNames.UserMessage.Subject)
            };

            return addMessageCommand;
        }

        public SearchMessagesParameter GetSearchMessages(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var ordersObj = jObj.GetValue(Constants.DtoNames.SearchUserMessage.Orders);
            var orderBy = new List<OrderBy>();
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

            var result = new SearchMessagesParameter
            {
                From = jObj.TryGetString(Constants.DtoNames.UserMessage.From),
                To = jObj.TryGetString(Constants.DtoNames.UserMessage.To),
                IsRead = jObj.TryGetNullableBoolean(Constants.DtoNames.UserMessage.IsRead),
                ProductId = jObj.TryGetString(Constants.DtoNames.UserMessage.ProductId),
                ServiceId = jObj.TryGetString(Constants.DtoNames.UserMessage.ServiceId),
                ParentId = jObj.TryGetString(Constants.DtoNames.UserMessage.ParentId),
                IncludeParent = jObj.TryGetBoolean(Constants.DtoNames.SearchUserMessage.IncludeParent),
                IsParent = jObj.TryGetNullableBoolean(Constants.DtoNames.SearchUserMessage.IsParent),
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex),
                IsPagingEnabled = true,
                OrderBy = orderBy
            };

            var count = jObj.Value<int>(Constants.DtoNames.Paginate.Count);
            if (count > 0)
            {
                result.Count = count;
            }

            return result;
        }

        public GetNotificationStatusParameter GetNotificationStatus(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new GetNotificationStatusParameter
            {                
                StartDate = jObj.TryGetNullableDateTime(Constants.DtoNames.Notification.StartDate),
                EndDate = jObj.TryGetNullableDateTime(Constants.DtoNames.Notification.EndDate)
            };
        }
        public UpdateNotificationCommand GetUpdateNotification(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new UpdateNotificationCommand
            {
                IsRead = jObj.TryGetBoolean(Constants.DtoNames.Notification.IsRead)
            };
        }

        public SearchNotificationsParameter GetSearchNotifications(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new SearchNotificationsParameter
            {
                From = jObj.TryGetString(Constants.DtoNames.Notification.From),
                StartDateTime = jObj.TryGetNullableDateTime(Constants.DtoNames.Notification.StartDate),
                EndDateTime = jObj.TryGetNullableDateTime(Constants.DtoNames.Notification.EndDate),
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex),
                IsRead = jObj.TryGetNullableBoolean(Constants.DtoNames.Notification.IsRead)
            };

            var count = jObj.Value<int>(Constants.DtoNames.Paginate.Count);
            if (count > 0)
            {
                result.Count = count;
            }

            return result;
        }

        public AddClientServiceCommand GetClientService(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new AddClientServiceCommand
            {
                Name = jObj.TryGetString(Constants.DtoNames.ClientService.Name),
                Description = jObj.TryGetString(Constants.DtoNames.ClientService.Description),
                CategoryId = jObj.TryGetString(Constants.DtoNames.ClientService.CategoryId),
                GooglePlaceId = jObj.TryGetString(Constants.DtoNames.ClientService.GooglePlaceId),
                StreetAddress = jObj.TryGetString(Constants.DtoNames.ClientService.StreetAddress),
                Price = jObj.TryGetDouble(Constants.DtoNames.ClientService.Price)
            };

            var location = jObj[Constants.DtoNames.ClientService.Location];
            if (location != null)
            {
                result.Latitude = location.Value<float>(Constants.DtoNames.Location.Latitude);
                result.Longitude = location.Value<float>(Constants.DtoNames.Location.Longitude);
            }

            return result;
        }

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
            result.CategoryId = jObj.Value<string>(Constants.DtoNames.Shop.CategoryId);
            result.StreetAddress = jObj.Value<string>(Constants.DtoNames.Shop.StreetAddress); // Street address
            result.PostalCode = jObj.Value<string>(Constants.DtoNames.Shop.PostalCode);
            result.Locality = jObj.Value<string>(Constants.DtoNames.Shop.Locality);
            result.Country = jObj.Value<string>(Constants.DtoNames.Shop.Country);

            var location = jObj[Constants.DtoNames.Shop.Location];
            if (location != null)
            {
                result.Latitude = location.Value<float>(Constants.DtoNames.Location.Latitude);
                result.Longitude = location.Value<float>(Constants.DtoNames.Location.Longitude);
            }

            var productFiltersObj = jObj[Constants.DtoNames.Shop.Filters];
            var filters = new List<AddProductShopFilter>();
            if (productFiltersObj != null)
            {
                var productFiltersArr = productFiltersObj as JArray;
                if (productFiltersArr != null)
                {
                    foreach(var productFilter in productFiltersArr)
                    {
                        filters.Add(GetAddProductShopFilter(productFilter as JObject));
                    }
                }
            }

            var productCategories = new List<AddShopProductCategory>();
            var productCategoriesObj = jObj[Constants.DtoNames.Shop.ProductCategories];
            if (productCategoriesObj != null)
            {
                var productCategoriesArr = productCategoriesObj as JArray;
                foreach(var productCategory in productCategoriesArr)
                {
                    productCategories.Add(GetAddShopProductCategory(productCategory as JObject));
                }
            }

            result.ProductFilters = filters;
            result.ProductCategories = productCategories;
            result.GooglePlaceId = jObj.Value<string>(Constants.DtoNames.Shop.GooglePlaceId);
            return result;
        }

        public UpdateServiceCommand GetUpdateService(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }


            var occurrenceObj = jObj.GetValue(Constants.DtoNames.Service.Occurrence);
            UpdateServiceOccurrence occurrence = null;
            if (occurrenceObj != null)
            {
                occurrence = GetUpdateServiceOccurrence(occurrenceObj as JObject);
            }

            return new UpdateServiceCommand
            {
                Name = jObj.TryGetString(Constants.DtoNames.Service.Name),
                Description = jObj.TryGetString(Constants.DtoNames.Service.Description),
                Price = jObj.TryGetDouble(Constants.DtoNames.Service.Price),
                Occurrence = occurrence,
                Images = jObj.TryGetStringArray(Constants.DtoNames.Service.Images),
                Tags = jObj.TryGetStringArray(Constants.DtoNames.Service.Tags)
            };
        }

        public AddServiceCommand GetAddService(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var occurrenceObj = jObj.GetValue(Constants.DtoNames.Service.Occurrence);
            AddServiceOccurrence occurrence = null;
            if (occurrenceObj != null)
            {
                occurrence = GetAddServiceOccurrence(occurrenceObj as JObject);
            }

            return new AddServiceCommand
            {
                Name = jObj.TryGetString(Constants.DtoNames.Service.Name),
                Description = jObj.TryGetString(Constants.DtoNames.Service.Description),
                Price = jObj.TryGetDouble(Constants.DtoNames.Service.Price),
                ShopId = jObj.TryGetString(Constants.DtoNames.Service.ShopId),
                Occurrence = occurrence,
                Images = jObj.TryGetStringArray(Constants.DtoNames.Service.Images),
                Tags = jObj.TryGetStringArray(Constants.DtoNames.Service.Tags)
            };
        }

        public UpdateServiceOccurrence GetUpdateServiceOccurrence(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var days = new List<DayOfWeek>();
            var daysStr = jObj.TryGetStringArray(Constants.DtoNames.Occurrence.Days);
            if (daysStr != null)
            {
                days = daysStr.Select(d => (DayOfWeek)Enum.Parse(typeof(DayOfWeek), d)).ToList();
            }

            return new UpdateServiceOccurrence
            {
                StartDate = jObj.TryGetDateTime(Constants.DtoNames.Occurrence.StartDate),
                EndDate = jObj.TryGetDateTime(Constants.DtoNames.Occurrence.EndDate),
                StartTime = jObj.TryGetTime(Constants.DtoNames.Occurrence.StartTime),
                EndTime = jObj.TryGetTime(Constants.DtoNames.Occurrence.EndTime),
                Days = days
            };
        }

        public AddServiceOccurrence GetAddServiceOccurrence(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var days = new List<DayOfWeek>();
            var daysStr = jObj.TryGetStringArray(Constants.DtoNames.Occurrence.Days);
            if (daysStr != null)
            {
                days = daysStr.Select(d => (DayOfWeek)Enum.Parse(typeof(DayOfWeek), d)).ToList();
            }

            return new AddServiceOccurrence
            {
                StartDate = jObj.TryGetDateTime(Constants.DtoNames.Occurrence.StartDate),
                EndDate = jObj.TryGetDateTime(Constants.DtoNames.Occurrence.EndDate),
                StartTime = jObj.TryGetTime(Constants.DtoNames.Occurrence.StartTime),
                EndTime = jObj.TryGetTime(Constants.DtoNames.Occurrence.EndTime),
                Days = days
            };
        }

        public AddShopProductCategory GetAddShopProductCategory(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new AddShopProductCategory
            {
                Name = jObj.TryGetString(Constants.DtoNames.ProductCategory.Name),
                Description = jObj.TryGetString(Constants.DtoNames.ProductCategory.Description)
            };
        }

        public UpdateShopProductCategory GetUpdateShopProductCategory(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new UpdateShopProductCategory
            {
                Id = jObj.TryGetString(Constants.DtoNames.ProductCategory.Id),
                Name = jObj.TryGetString(Constants.DtoNames.ProductCategory.Name),
                Description = jObj.TryGetString(Constants.DtoNames.ProductCategory.Description)
            };
        }

        public AddProductShopFilter GetAddProductShopFilter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }
            
            return new AddProductShopFilter
            {
                Name = jObj.TryGetString(Constants.DtoNames.Filter.Name),
                Values = jObj.TryGetStringArray(Constants.DtoNames.Filter.Values)
            };
        }

        public UpdateProductShopFilter GetUpdateProductShopFilter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var values = new List<UpdateProductShopFilterValue>();
            var valuesObj = jObj[Constants.DtoNames.Filter.Values];
            if (valuesObj != null)
            {
                var valuesArr = valuesObj as JArray;
                if (valuesArr != null)
                {
                    foreach(var value in valuesArr)
                    {
                        var obj = value as JObject;
                        values.Add(new UpdateProductShopFilterValue
                        {
                            Id = obj.TryGetString(Constants.DtoNames.FilterValue.Id),
                            Content = obj.TryGetString(Constants.DtoNames.FilterValue.Content)
                        });
                    }
                }
            }

            return new UpdateProductShopFilter
            {
                Id = jObj.TryGetString(Constants.DtoNames.Filter.Id),
                Name = jObj.TryGetString(Constants.DtoNames.Filter.Name),
                Values = values
            };
        }

        public UpdateShopCommand GetUpdateShop(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new UpdateShopCommand();
            result.Name = jObj.Value<string>(Constants.DtoNames.Shop.Name); // General information
            result.Description = jObj.Value<string>(Constants.DtoNames.Shop.Description);
            var tags = jObj.GetValue(Constants.DtoNames.Shop.Tags);
            JArray firstArr = null;
            var ts = new List<string>();
            if (tags != null && (firstArr = tags as JArray) != null)
            {
                foreach (var tag in tags)
                {
                    ts.Add(tag.ToString());
                }
            }

            result.TagNames = ts;
            result.BannerImage = jObj.Value<string>(Constants.DtoNames.Shop.BannerImage);
            result.ProfileImage = jObj.Value<string>(Constants.DtoNames.Shop.ProfileImage);
            result.StreetAddress = jObj.Value<string>(Constants.DtoNames.Shop.StreetAddress); // Street address
            result.PostalCode = jObj.Value<string>(Constants.DtoNames.Shop.PostalCode);
            result.Locality = jObj.Value<string>(Constants.DtoNames.Shop.Locality);
            result.Country = jObj.Value<string>(Constants.DtoNames.Shop.Country);

            var location = jObj[Constants.DtoNames.Shop.Location];
            if (location != null)
            {
                result.Latitude = location.Value<float>(Constants.DtoNames.Location.Latitude);
                result.Longitude = location.Value<float>(Constants.DtoNames.Location.Longitude);
            }

            var productFiltersObj = jObj[Constants.DtoNames.Shop.Filters];
            var filters = new List<UpdateProductShopFilter>();
            if (productFiltersObj != null)
            {
                var productFiltersArr = productFiltersObj as JArray;
                if (productFiltersArr != null)
                {
                    foreach (var productFilter in productFiltersArr)
                    {
                        filters.Add(GetUpdateProductShopFilter(productFilter as JObject));
                    }
                }
            }

            var productCategories = new List<UpdateShopProductCategory>();
            var productCategoriesObj = jObj[Constants.DtoNames.Shop.ProductCategories];
            if (productCategoriesObj != null)
            {
                var productCategoriesArr = productCategoriesObj as JArray;
                foreach (var productCategory in productCategoriesArr)
                {
                    productCategories.Add(GetUpdateShopProductCategory(productCategory as JObject));
                }
            }

            var gameEntities = new List<UpdateGameEntity>();
            var gameEntitiesObj = jObj[Constants.DtoNames.Shop.GameEntities];
            if (gameEntitiesObj != null)
            {
                var gameEntitiesArr = gameEntitiesObj as JArray;
                foreach(var gameEntity in gameEntitiesObj)
                {
                    gameEntities.Add(GetUpdateGameEntity(gameEntity as JObject));
                }
            }

            result.ProductFilters = filters;
            result.ProductCategories = productCategories;
            result.GooglePlaceId = jObj.Value<string>(Constants.DtoNames.Shop.GooglePlaceId);
            result.UpdateGameEntities = gameEntities;
            return result;
        }

        public UpdateGameEntity GetUpdateGameEntity(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var type = GameEntityTypes.Furniture;
            var keyValuePair = CommonBuilder.MappingGameEntityTypes.FirstOrDefault(kvp => kvp.Value == jObj.TryGetString(Constants.DtoNames.GameEntity.Type));
            if (!keyValuePair.Equals(default(KeyValuePair<GameEntityTypes, string>)) && !string.IsNullOrWhiteSpace(keyValuePair.Value))
            {
                type = keyValuePair.Key;
            }

            return new UpdateGameEntity
            {
                Id = jObj.TryGetString(Constants.DtoNames.GameEntity.Id),
                Col = jObj.TryGetInt(Constants.DtoNames.GameEntity.Col),
                Row = jObj.TryGetInt(Constants.DtoNames.GameEntity.Row),
                Name = jObj.TryGetString(Constants.DtoNames.GameEntity.Name),
                ProductCategoryId = jObj.TryGetString(Constants.DtoNames.GameEntity.ProductCategoryId),
                Type = type,
                IsFlipped = jObj.TryGetBoolean(Constants.DtoNames.GameEntity.IsFlipped)
            };
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
                ShopIds = jObj.TryGetStringArray(Constants.DtoNames.SearchShop.ShopIds),
                CategoryIds = jObj.TryGetStringArray(Constants.DtoNames.Shop.CategoryId),
                Subjects = jObj.TryGetStringArray(Constants.DtoNames.SearchShop.Subject),
                Tags = jObj.TryGetStringArray(Constants.DtoNames.SearchShop.Tags),
                Name = jObj.Value<string>(Constants.DtoNames.Shop.Name),
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex),
                NorthEast = northEastLocation,
                SouthWest = southWestLocation,
                OrderBy = orderBy
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

            var result = new SearchTagsParameter
            {
                Names = new[] { jObj.Value<string>(Constants.DtoNames.Tag.Name) },
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex),
                Orders = orderBy
            };

            var count = jObj.Value<int>(Constants.DtoNames.Paginate.Count);
            if (count > 0)
            {
                result.Count = count;
            }

            return result;
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

        public AddProductCommentCommand GetAddProductComment(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new AddProductCommentCommand
            {
                Content = jObj.Value<string>(Constants.DtoNames.Comment.Content),
                Score = jObj.Value<int>(Constants.DtoNames.Comment.Score),
                ProductId = jObj.Value<string>(Constants.DtoNames.Comment.ProductId)
            };
        }

        public AddServiceCommentCommand GetAddServiceComment(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new AddServiceCommentCommand
            {
                Content = jObj.Value<string>(Constants.DtoNames.Comment.Content),
                Score = jObj.Value<int>(Constants.DtoNames.Comment.Score),
                ServiceId = jObj.Value<string>(Constants.DtoNames.Comment.ServiceId)
            };
        }

        public UpdateProductCommand GetUpdateProduct(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new UpdateProductCommand
            {
                CategoryId = jObj.TryGetString(Constants.DtoNames.Product.CategoryId),
                Name = jObj.TryGetString(Constants.DtoNames.Product.Name),
                Description = jObj.TryGetString(Constants.DtoNames.Product.Description),
                Price = jObj.TryGetDouble(Constants.DtoNames.Product.Price),
                UnitOfMeasure = jObj.TryGetString(Constants.DtoNames.Product.UnitOfMeasure),
                Tags = jObj.TryGetStringArray(Constants.DtoNames.Product.Tags),
                Quantity = jObj.TryGetDouble(Constants.DtoNames.Product.Quantity),
                ShopId = jObj.TryGetString(Constants.DtoNames.Product.ShopId),
                AvailableInStock = jObj.TryGetNullableDouble(Constants.DtoNames.Product.AvailableInStock),
                PartialImagesUrl = jObj.TryGetStringArray(Constants.DtoNames.Product.Images)
            };

            var filters = new List<UpdateProductFilter>();
            var obj = jObj.GetValue(Constants.DtoNames.Product.Filters);
            var arr = obj as JArray;
            if (arr != null)
            {
                foreach (var rec in arr)
                {
                    filters.Add(GetUpdateProductFilter(rec as JObject));
                }
            }

            result.Filters = filters;
            return result;
        }

        public AddProductCommand GetAddProduct(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new AddProductCommand
            {
                CategoryId = jObj.TryGetString(Constants.DtoNames.Product.CategoryId),
                Name = jObj.TryGetString(Constants.DtoNames.Product.Name),
                Description = jObj.TryGetString(Constants.DtoNames.Product.Description),
                Price = jObj.TryGetDouble(Constants.DtoNames.Product.Price),
                UnitOfMeasure = jObj.TryGetString(Constants.DtoNames.Product.UnitOfMeasure),
                Tags = jObj.TryGetStringArray(Constants.DtoNames.Product.Tags),
                Quantity = jObj.TryGetDouble(Constants.DtoNames.Product.Quantity),
                ShopId = jObj.TryGetString(Constants.DtoNames.Product.ShopId),
                AvailableInStock = jObj.TryGetNullableDouble(Constants.DtoNames.Product.AvailableInStock),
                PartialImagesUrl = jObj.TryGetStringArray(Constants.DtoNames.Product.Images)
            };

            var filters = new List<AddProductFilter>();
            var obj = jObj.GetValue(Constants.DtoNames.Product.Filters);
            var arr = obj as JArray;
            if (arr != null)
            {
                foreach (var rec in arr)
                {
                    filters.Add(GetProductFilter(rec as JObject));
                }
            }

            result.Filters = filters;
            return result;
        }

        public AddProductFilter GetProductFilter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new AddProductFilter
            {
                FilterId = jObj.TryGetString(Constants.DtoNames.ProductFilter.FilterId),
                ValueId = jObj.TryGetString(Constants.DtoNames.ProductFilter.ValueId)
            };
        }

        public UpdateProductFilter GetUpdateProductFilter(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            return new UpdateProductFilter
            {
                FilterId = jObj.TryGetString(Constants.DtoNames.ProductFilter.FilterId),
                ValueId = jObj.TryGetString(Constants.DtoNames.ProductFilter.ValueId)
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
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex)
            };
            var count = jObj.Value<int>(Constants.DtoNames.Paginate.Count);
            if (count > 0)
            {
                result.Count = count;
            }

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
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex)
            };
            var count = jObj.Value<int>(Constants.DtoNames.Paginate.Count);
            if (count > 0)
            {
                result.Count = count;
            }

            return result;
        }

        public SearchServiceCommentParameter GetSearchServiceComments(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var result = new SearchServiceCommentParameter
            {
                Subject = jObj.Value<string>(Constants.DtoNames.Comment.Subject),
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex)
            };
            var count = jObj.Value<int>(Constants.DtoNames.Paginate.Count);
            if (count > 0)
            {
                result.Count = count;
            }

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
                ProductIds = jObj.TryGetStringArray(Constants.DtoNames.SearchProduct.ProductIds),
                ShopIds = jObj.TryGetStringArray(Constants.DtoNames.Product.ShopId),
                IsPagingEnabled = true,
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex),
                Filters = filters,
                FilterPrice = filterPrice,
                ProductName = jObj.Value<string>(Constants.DtoNames.Product.Name),
                CategoryIds = jObj.TryGetStringArray(Constants.DtoNames.Product.CategoryId),
                ShopCategoryIds = jObj.TryGetStringArray(Constants.DtoNames.Product.ShopCategoryIds),
                Orders = orderBy,
                NorthEast = northEastLocation,
                SouthWest = southWestLocation,
                Tags = jObj.TryGetStringArray(Constants.DtoNames.SearchShop.Tags)
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

        public SearchServiceOccurrenceParameter GetSearchServiceOccurrences(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var count = jObj.Value<int>(Constants.DtoNames.Paginate.Count);
            Location northEastLocation = null, southWestLocation = null;
            var neLocation = jObj[Constants.DtoNames.SearchService.NorthEast];
            var swLocation = jObj[Constants.DtoNames.SearchService.SouthWest];
            if (neLocation != null && swLocation != null)
            {
                northEastLocation = GetLocation(neLocation as JObject);
                southWestLocation = GetLocation(swLocation as JObject);
            }

            var fromDateTime = jObj.Value<DateTime>(Constants.DtoNames.SearchService.FromDateTime);
            var toDateTime = jObj.Value<DateTime>(Constants.DtoNames.SearchService.ToDateTime);
            var result = new SearchServiceOccurrenceParameter
            {
                Name = jObj.Value<string>(Constants.DtoNames.Service.Name),
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex),
                ShopId = jObj.Value<string>(Constants.DtoNames.Service.ShopId)
            };

            if (fromDateTime != null && !fromDateTime.Equals(default(DateTime)))
            {
                result.FromDateTime = fromDateTime;
            }

            if (toDateTime != null && !toDateTime.Equals(default(DateTime)))
            {
                result.ToDateTime = toDateTime;
            }

            if (count > 0)
            {
                result.Count = count;
            }

            return result;
        }

        public SearchServiceParameter GetSearchServices(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var count = jObj.Value<int>(Constants.DtoNames.Paginate.Count);
            Location northEastLocation = null, southWestLocation = null;
            var neLocation = jObj[Constants.DtoNames.SearchService.NorthEast];
            var swLocation = jObj[Constants.DtoNames.SearchService.SouthWest];
            if (neLocation != null && swLocation != null)
            {
                northEastLocation = GetLocation(neLocation as JObject);
                southWestLocation = GetLocation(swLocation as JObject);
            }

            var orders = new List<OrderBy>();
            var ordersObj = jObj.GetValue(Constants.DtoNames.SearchService.Orders);
            if (ordersObj != null)
            {
                var arr = ordersObj as JArray;
                if (arr != null)
                {
                    foreach (var order in arr)
                    {
                        orders.Add(GetOrderBy(order as JObject));
                    }
                }
            }

            var fromDateTime = jObj.Value<DateTime>(Constants.DtoNames.SearchService.FromDateTime);
            var toDateTime = jObj.Value<DateTime>(Constants.DtoNames.SearchService.ToDateTime);
            var result = new SearchServiceParameter
            {
                Name = jObj.Value<string>(Constants.DtoNames.Service.Name),
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex),
                ShopIds = jObj.TryGetStringArray(Constants.DtoNames.Service.ShopId),
                ShopCategoryIds = jObj.TryGetStringArray(Constants.DtoNames.SearchService.ShopCategoryIds),
                Orders = orders,
                NorthEast = northEastLocation,
                SouthWest = southWestLocation,
                Tags = jObj.TryGetStringArray(Constants.DtoNames.SearchService.Tags),
                
            };

            if (fromDateTime != null && !fromDateTime.Equals(default(DateTime)))
            {
                result.FromDateTime = fromDateTime;
            }

            if (toDateTime != null && !toDateTime.Equals(default(DateTime)))
            {
                result.ToDateTime = toDateTime;
            }

            if (count > 0)
            {
                result.Count = count;
            }

            return result;
        }

        public SearchClientServicesParameter GetSearchAnnouncements(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var count = jObj.Value<int>(Constants.DtoNames.Paginate.Count);
            Location northEastLocation = null, southWestLocation = null;
            var neLocation = jObj[Constants.DtoNames.SearchService.NorthEast];
            var swLocation = jObj[Constants.DtoNames.SearchService.SouthWest];
            if (neLocation != null && swLocation != null)
            {
                northEastLocation = GetLocation(neLocation as JObject);
                southWestLocation = GetLocation(swLocation as JObject);
            }

            var orders = new List<OrderBy>();
            var ordersObj = jObj.GetValue(Constants.DtoNames.SearchService.Orders);
            if (ordersObj != null)
            {
                var arr = ordersObj as JArray;
                if (arr != null)
                {
                    foreach (var order in arr)
                    {
                        orders.Add(GetOrderBy(order as JObject));
                    }
                }
            }

            var result = new SearchClientServicesParameter
            {
                CategoryIds = jObj.TryGetStringArray(Constants.DtoNames.ClientService.CategoryId),
                StartIndex = jObj.Value<int>(Constants.DtoNames.Paginate.StartIndex),
                Name = jObj.Value<string>(Constants.DtoNames.ClientService.Name),
                Orders = orders,
                NorthEast = northEastLocation,
                SouthWest = southWestLocation
            };
            
            if (count > 0)
            {
                result.Count = count;
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
