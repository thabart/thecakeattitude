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

using Cook4Me.Api.Core.Aggregates;
using Cook4Me.Api.Core.Events.ClientService;
using Cook4Me.Api.Core.Events.Messages;
using Cook4Me.Api.Core.Events.Notification;
using Cook4Me.Api.Core.Events.Orders;
using Cook4Me.Api.Core.Events.Product;
using Cook4Me.Api.Core.Events.Service;
using Cook4Me.Api.Core.Events.Shop;
using Cook4Me.Api.Core.Results;
using Dhl.Client.Results.Capabalities;
using Dhl.Client.Results.ShopParcelLocations;
using Newtonsoft.Json.Linq;
using Paypal.Client.Common;
using Paypal.Client.Responses;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Ups.Client.Common;
using Ups.Client.Responses.Locator;
using Ups.Client.Responses.Rating;
using Ups.Client.Responses.Track;

namespace Cook4Me.Api.Host.Builders
{
    public interface IResponseBuilder
    {
        JObject GetFeedItem(FeedItemAggregate feed);
        JObject GetServiceRemovedEvent(ServiceRemovedEvent evt);
        JObject GetDiscount(DiscountAggregate discount);
        JObject GetUpsTrack(TrackResponse track);
        JObject GetUpsTrackActivity(TrackShipmentPackageActivityResponse activity);
        JObject GetPaypalPayment(CreatePaymentResponse response);
        JObject GetPaypalItem(PaypalItem paypalItem);
        JObject GetOrderCanceled(OrderCanceledEvent evt);
        JObject GetOrderLabelPurchased(OrderLabelPurchasedEvent evt);
        JObject GetUpsService(UpsServiceAggregate service);
        JObject GetOrderTransactionApproved(OrderTransactionApprovedEvent evt);
        JObject GetPaypalTransaction(CreatePaymentResponse paymentResponse);
        JObject GetOrderParcel(OrderAggregateParcel orderParcel);
        JObject GetUpsRatings(RatingServiceSelectionResponse response);
        JObject GetCapabalities(IEnumerable<DhlCapabality> capabilities);
        JArray GetCapabality(DhlCapabality capabality);
        JObject GetShopParcelLocations(IEnumerable<ShopParcelLocation> locations);
        JObject GetShopParcelLocation(ShopParcelLocation location);
        JObject GetShopDropLocationAddress(ShopParcelLocationAddress adr);
        JObject GetShopDropLocationGeoloc(ShopParcelLocationGeo geoloc);
        JObject GetShopDropLocationOpeningTime(ShopParcelLocationOpeningTime openingTime);
        JObject GetOrderReceivedEvent(OrderReceivedEvent evt);
        JObject GetOrderConfirmeddEvent(OrderConfirmedEvent evt);
        JObject GetOrderAddedEvent(OrderAddedEvent evt);
        JObject GetOrderRemovedEvent(OrderRemovedEvent evt);
        JObject GetOrderUpdatedEvent(OrderUpdatedEvent evt);
        JObject GetOrder(OrderAggregate order);
        JObject GetOrderLine(OrderAggregateLine orderLine);
        JObject GetDistance(Distance distance);
        JArray GetStandardHours(StandardHours standardHours);
        JObject GetAddressKeyFormat(AddressKeyFormat addressKeyFormat);
        JObject GetDropLocation(LocatorDropLocation dropLocation);
        JObject GetGeocode(Geocode geocode);
        JObject GetUpsLocations(LocatorResponse locatorResponse);
        JObject GetMessageAddedEvent(MessageAddedEvent evt);
        JObject GetMessage(MessageAggregate message);
        JObject GetMessageAttachment(MessageAttachment attachment);
        JObject GetNotificationAddedEvent(NotificationAddedEvent evt);
        JObject GetOrderStatus(GetOrderStatusResult result);
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
        JObject GetServiceUpdatedEvent(ServiceUpdatedEvent evt);
        JObject GetServiceAddedEvent(ServiceAddedEvent evt);
        JObject GetClientServiceAddedEvent(ClientServiceAddedEvent evt);
        JObject GetClientServiceRemovedEvent(ClientServiceRemovedEvent evt);
        JObject GetProductUpdatedEvent(ProductUpdatedEvent evt);
        JObject GetProductAddedEvent(ProductAddedEvent evt);
        JObject GetProductRemovedEvent(ProductRemovedEvent evt);
        JObject GetProduct(ProductAggregate product);
        JObject GetService(ServiceAggregate service);
        JObject GetServiceOccurrence(ServiceResultLine service);
        JObject GetClientService(ClientServiceAggregate announcement);
    }

    internal class ResponseBuilder : IResponseBuilder
    {
        public JObject GetFeedItem(FeedItemAggregate feed)
        {
            if (feed == null)
            {
                throw new ArgumentNullException(nameof(feed));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.FeedItemNames.Author, feed.Author);
            jObj.Add(Constants.DtoNames.FeedItemNames.CreateDateTime, feed.CreateDateTime);
            jObj.Add(Constants.DtoNames.FeedItemNames.Description, feed.Description);
            jObj.Add(Constants.DtoNames.FeedItemNames.Title, feed.Title);
            jObj.Add(Constants.DtoNames.FeedItemNames.Id, feed.Id);
            return jObj;
        }

        public JObject GetDiscount(DiscountAggregate discount)
        {
            if (discount == null)
            {
                throw new ArgumentNullException(nameof(discount));
            }

            var obj = new JObject();

            var kvpValidity = CommonBuilder.MappingDiscountValidities.FirstOrDefault(d => d.Key == discount.Validity);
            if (!kvpValidity.Equals(default(KeyValuePair<DiscountAggregateValidities, string>)))
            {
                obj.Add(Constants.DtoNames.DiscountNames.Validity, kvpValidity.Value);
            }

            var kvpType = CommonBuilder.MappingDiscountPromotions.FirstOrDefault(d => d.Key == discount.PromotionType);
            if (!kvpType.Equals(default(KeyValuePair<DiscountAggregatePromotions, string>)))
            {
                obj.Add(Constants.DtoNames.DiscountNames.Type, kvpType.Value);
            }

            var productIds = new JArray();
            if (discount.Products != null)
            {
                foreach (var product in discount.Products)
                {
                    productIds.Add(product.ProductId);
                }
            }

            obj.Add(Constants.DtoNames.DiscountNames.Id, discount.Id);
            obj.Add(Constants.DtoNames.DiscountNames.Code, discount.Code);
            obj.Add(Constants.DtoNames.DiscountNames.Counter, discount.Counter);
            obj.Add(Constants.DtoNames.DiscountNames.EndDateTime, discount.EndDateTime);
            obj.Add(Constants.DtoNames.DiscountNames.StartDateTime, discount.StartDateTime);
            obj.Add(Constants.DtoNames.DiscountNames.Value, discount.Value);
            obj.Add(Constants.DtoNames.DiscountNames.Subject, discount.Subject);
            obj.Add(Constants.DtoNames.DiscountNames.IsActive, discount.IsActive);
            obj.Add(Constants.DtoNames.DiscountNames.IsPrivate, discount.IsPrivate);
            obj.Add(Constants.DtoNames.DiscountNames.ProductIds, productIds);
            return obj;
        }
        public JObject GetUpsTrack(TrackResponse track)
        {
            if (track == null)
            {
                throw new ArgumentNullException(nameof(track));
            }

            var obj = new JObject();
            var jArr = new JArray();
            if (track.Shipment != null && track.Shipment.Package != null && track.Shipment.Package.Activity != null)
            {
                foreach(var act in track.Shipment.Package.Activity)
                {
                    jArr.Add(GetUpsTrackActivity(act));
                }
            }

            obj.Add(Constants.DtoNames.OrderTrackNames.Activities, jArr);
            return obj;
        }

        public JObject GetUpsTrackActivity(TrackShipmentPackageActivityResponse activity)
        {
            if (activity == null)
            {
                throw new ArgumentNullException(nameof(activity));
            }

            var obj = new JObject();
            DateTime date;
            if (DateTime.TryParseExact(activity.Date, "yyyyMMdd", CultureInfo.InvariantCulture, DateTimeStyles.None, out date))
            {
                DateTime time;
                if (DateTime.TryParseExact(activity.Time, "hhmmss", CultureInfo.InvariantCulture, DateTimeStyles.None, out time))
                {
                    date.AddHours(time.Hour);
                    date.AddMinutes(time.Minute);
                    date.AddSeconds(time.Second);
                }

                obj.Add(Constants.DtoNames.OrderTrackActivityNames.Date, date);
            }

            if (activity.Status != null && activity.Status.StatusType != null)
            {
                obj.Add(Constants.DtoNames.OrderTrackActivityNames.Code, activity.Status.StatusType.Code);
                obj.Add(Constants.DtoNames.OrderTrackActivityNames.Description, activity.Status.StatusType.Description);
            }

            return obj;
        }

        public JObject GetPaypalPayment(CreatePaymentResponse response)
        {
            if (response == null)
            {
                throw new ArgumentNullException(nameof(response));
            }

            var obj = new JObject();
            if (response.Transactions != null && response.Transactions.Any())
            {
                var transaction = response.Transactions.First();
                obj.Add(Constants.DtoNames.OrderPaymentDetails.Total, transaction.Total);
                obj.Add(Constants.DtoNames.OrderPaymentDetails.SubTotal, transaction.SubTotal);
                var kvpState = CommonBuilder.MappingPayPalPaymentStatus.FirstOrDefault(kvp => kvp.Key == response.State);
                if (!kvpState.Equals(default(KeyValuePair<PaymentStates, string>)))
                {
                    obj.Add(Constants.DtoNames.OrderPaymentItemDetails.State, kvpState.Value);
                }

                obj.Add(Constants.DtoNames.OrderPaymentDetails.ShippingPrice, transaction.Shipping);
                var items = new JArray();
                if (transaction.Items != null)
                {
                    foreach(var item in transaction.Items)
                    {
                        items.Add(GetPaypalItem(item));
                    }
                }

                obj.Add(Constants.DtoNames.OrderPaymentDetails.Items, items);
            }

            return obj;
        }

        public JObject GetPaypalItem(PaypalItem paypalItem)
        {
            if (paypalItem == null)
            {
                throw new ArgumentNullException(nameof(paypalItem));
            }

            var obj = new JObject();
            obj.Add(Constants.DtoNames.OrderPaymentItemDetails.Description, paypalItem.Description);
            obj.Add(Constants.DtoNames.OrderPaymentItemDetails.Name, paypalItem.Name);
            obj.Add(Constants.DtoNames.OrderPaymentItemDetails.Price, paypalItem.Price);
            obj.Add(Constants.DtoNames.OrderPaymentItemDetails.Quantity, paypalItem.Quantity);
            return obj;
        }

        public JObject GetOrderCanceled(OrderCanceledEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var obj = new JObject();
            obj.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            obj.Add(Constants.DtoNames.OrderNames.Id, evt.OrderId);
            return obj;
        }

        public JObject GetOrderLabelPurchased(OrderLabelPurchasedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }
            
            var obj = new JObject();
            obj.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            obj.Add(Constants.DtoNames.OrderNames.TrackingNumber, evt.TrackingNumber);
            obj.Add(Constants.DtoNames.OrderNames.Id, evt.OrderId);
            return obj;
        }

        public JObject GetUpsService(UpsServiceAggregate service)
        {
            if (service == null)
            {
                throw new ArgumentNullException(nameof(service));
            }

            var obj = new JObject();
            obj.Add(Constants.DtoNames.UpsServiceNames.Id, service.Id);
            obj.Add(Constants.DtoNames.UpsServiceNames.CountryCode, service.CountryCode);
            obj.Add(Constants.DtoNames.UpsServiceNames.Service, CommonBuilder.MappingUpsAggregateServices.First(kvp => kvp.Key == service.Service).Value);
            return obj;
        }

        public JObject GetOrderTransactionApproved(OrderTransactionApprovedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var result = new JObject();
            return result;
        }

        public JObject GetPaypalTransaction(CreatePaymentResponse paymentResponse)
        {
            if (paymentResponse == null)
            {
                throw new ArgumentNullException(nameof(paymentResponse));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.OrderTransactionNames.Id, paymentResponse.Id);
            var stateKvp = CommonBuilder.MappingPayPalPaymentStatus.FirstOrDefault(kvp => kvp.Key == paymentResponse.State);
            if (!stateKvp.Equals(default(KeyValuePair<PaymentStates, string>)) && !string.IsNullOrWhiteSpace(stateKvp.Value))
            {
                result.Add(Constants.DtoNames.OrderTransactionNames.State, stateKvp.Value);
            }

            var approvalLink = paymentResponse.Links.FirstOrDefault(l => l.Rel == "approval_url");
            if (approvalLink != null)
            {
                result.Add(Constants.DtoNames.OrderTransactionNames.ApprovalUrl, approvalLink.Href);
            }

            result.Add(Constants.DtoNames.OrderTransactionNames.PaymentMethod, "paypal");
            return result;
        }

        public JObject GetUpsRatings(RatingServiceSelectionResponse response)
        {
            if (response == null)
            {
                throw new ArgumentNullException(nameof(response));
            }

            double price = 0;
            if (response.RatedShipment != null && response.RatedShipment.TotalCharges != null)
            {
                price = response.RatedShipment.TotalCharges.MonetaryValue;
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.UpsRatingsNames.TotalPrice, price);
            if (response.RatedShipment != null && response.RatedShipment.RatedShipmentWarning != null)
            {
                var messages = new JArray();
                foreach (var message in response.RatedShipment.RatedShipmentWarning)
                {
                    messages.Add(message);
                }

                jObj.Add(Constants.DtoNames.UpsRatingsNames.Messages, messages);
            }

            return jObj;
        }

        public JObject GetCapabalities(IEnumerable<DhlCapabality> capabilities)
        {
            if (capabilities == null)
            {
                throw new ArgumentNullException(nameof(capabilities));
            }

            var jObj = new JObject();
            var arr = new JArray();
            foreach(var capabality in capabilities)
            {
                arr.Merge(GetCapabality(capabality));
            }

            jObj.Add(Constants.DtoNames.RatingsNames.Ratings, arr);
            return jObj;
        }

        public JArray GetCapabality(DhlCapabality capabality)
        {
            if (capabality == null)
            {
                throw new ArgumentNullException(nameof(capabality));
            }

            var arr = new JArray();
            if (capabality.Options != null)
            {
                var opts = capabality.Options.Where(opt => opt.Key == "PS" || opt.Key == "DOOR");
                foreach(var opt in opts)
                {
                    var jObj = new JObject();
                    var optPrice = opt.Price == null ? new DhlPrice() : opt.Price;
                    var priceWithTax = capabality.ParcelTypes.Price.WithTax + optPrice.WithTax;
                    var priceWithoutTax = capabality.ParcelTypes.Price.WithoutTax + optPrice.WithoutTax;
                    jObj.Add(Constants.DtoNames.RatingNames.PriceWithTax, priceWithTax);
                    jObj.Add(Constants.DtoNames.RatingNames.PriceWithoutTax, priceWithoutTax);
                    jObj.Add(Constants.DtoNames.RatingNames.Code, opt.Key);
                    jObj.Add(Constants.DtoNames.DhlRatingNames.ParcelType, capabality.ParcelTypes.Key);
                    arr.Add(jObj);
                }
            }

            return arr;
        }

        public JObject GetShopParcelLocations(IEnumerable<ShopParcelLocation> locations)
        {
            if (locations == null)
            {
                throw new ArgumentNullException(nameof(locations));
            }

            var jObj = new JObject();
            var arr = new JArray();
            foreach(var location in locations)
            {
                arr.Add(GetShopParcelLocation(location));
            }

            jObj.Add(Constants.DtoNames.DropLocationsNames.Locations, arr);
            return jObj;
        }

        public JObject GetShopParcelLocation(ShopParcelLocation location)
        {
            if (location == null)
            {
                throw new ArgumentNullException(nameof(location));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.DropLocationNames.Id, location.Id);
            jObj.Add(Constants.DtoNames.DropLocationNames.Name, location.Name);
            jObj.Add(Constants.DtoNames.DropLocationNames.Address, GetShopDropLocationAddress(location.Address));
            jObj.Add(Constants.DtoNames.DropLocationNames.Geolocation, GetShopDropLocationGeoloc(location.GeoLocation));
            var arr = new JArray();
            if (location.OpeningTimes != null)
            {
                foreach(var openingTime in location.OpeningTimes)
                {
                    arr.Add(GetShopDropLocationOpeningTime(openingTime));
                }
            }
            
            jObj.Add(Constants.DtoNames.DropLocationNames.OpeningTimes, arr);
            return jObj;
        }

        public JObject GetShopDropLocationAddress(ShopParcelLocationAddress adr)
        {
            if (adr == null)
            {
                throw new ArgumentNullException(nameof(adr));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.DropLocationAddressNames.City, adr.City);
            jObj.Add(Constants.DtoNames.DropLocationAddressNames.ZipCode, adr.ZipCode);
            jObj.Add(Constants.DtoNames.DropLocationAddressNames.CountryCode, adr.CountryCode);
            jObj.Add(Constants.DtoNames.DropLocationAddressNames.Street, adr.Street);
            jObj.Add(Constants.DtoNames.DropLocationAddressNames.Number, adr.Number);
            return jObj;
        }

        public JObject GetShopDropLocationGeoloc(ShopParcelLocationGeo geoloc)
        {
            if (geoloc == null)
            {
                throw new ArgumentNullException(nameof(geoloc));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.DropLocationGeoloc.Latitude, geoloc.Latitude);
            jObj.Add(Constants.DtoNames.DropLocationGeoloc.Longitude, geoloc.Longitude);
            return jObj;
        }

        public JObject GetShopDropLocationOpeningTime(ShopParcelLocationOpeningTime openingTime)
        {
            if (openingTime == null)
            {
                throw new ArgumentNullException(nameof(openingTime));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.DropLocationOpeningTime.Day, openingTime.WeekDay);
            jObj.Add(Constants.DtoNames.DropLocationOpeningTime.TimeFrom, openingTime.TimeFrom);
            jObj.Add(Constants.DtoNames.DropLocationOpeningTime.TimeTo, openingTime.TimeTo);
            return jObj;
        }

        public JObject GetOrderStatus(GetOrderStatusResult result)
        {
            if (result == null)
            {
                throw new ArgumentNullException(nameof(result));
            }

            var obj = new JObject();
            obj.Add(Constants.DtoNames.OrderStatusNames.NumberOfOrdersCreated, result.NumberOfOrderCreated);
            obj.Add(Constants.DtoNames.OrderStatusNames.NumberOfOrderLinesCreated, result.NumberOfOrderLinesCreated);
            return obj;
        }

        public JObject GetOrderReceivedEvent(OrderReceivedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }
            
            var result = new JObject();
            result.Add(Constants.DtoNames.OrderNames.Id, evt.OrderId);
            result.Add(Constants.DtoNames.OrderNames.Subject, evt.Client);
            result.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            return result;
        }

        public JObject GetOrderConfirmeddEvent(OrderConfirmedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var obj = new JObject();

            var result = new JObject();
            result.Add(Constants.DtoNames.OrderNames.Id, evt.OrderId);
            result.Add(Constants.DtoNames.OrderNames.Subject, evt.Client);
            result.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            return result;
        }

        public JObject GetOrderAddedEvent(OrderAddedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.OrderNames.Id, evt.OrderId);
            result.Add(Constants.DtoNames.OrderNames.Subject, evt.Subject);
            result.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            return result;
        }

        public JObject GetOrderRemovedEvent(OrderRemovedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.OrderNames.Id, evt.Id);
            result.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            return result;
        }

        public JObject GetOrderUpdatedEvent(OrderUpdatedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.OrderNames.Id, evt.OrderId);
            result.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            return result;
        }

        public JObject GetOrder(OrderAggregate order)
        {
            if (order == null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            var result = new JObject();
            var arr = new JArray();
            if (order.OrderLines != null)
            {
                foreach(var orderLine in order.OrderLines)
                {
                    arr.Add(GetOrderLine(orderLine));
                }
            }

            result.Add(Constants.DtoNames.OrderNames.Id, order.Id);
            result.Add(Constants.DtoNames.OrderNames.CreateDateTime, order.CreateDateTime);
            result.Add(Constants.DtoNames.OrderNames.IsLabelPurchased, order.IsLabelPurchased);
            result.Add(Constants.DtoNames.OrderNames.UpdateDateTime, order.UpdateDateTime);
            result.Add(Constants.DtoNames.OrderNames.TotalPrice, order.TotalPrice);
            result.Add(Constants.DtoNames.OrderNames.Subject, order.Subject);
            result.Add(Constants.DtoNames.OrderNames.ShopId, order.ShopId);
            result.Add(Constants.DtoNames.OrderNames.ShippingPrice, order.ShippingPrice);
            result.Add(Constants.DtoNames.OrderNames.TrackingNumber, order.TrackingNumber);
            var kvpStatus = CommonBuilder.MappingOrderAggregateStatus.FirstOrDefault(kvp => kvp.Key == order.Status);
            if (!kvpStatus.Equals(default(KeyValuePair<OrderAggregateStatus, string>)) && !string.IsNullOrWhiteSpace(kvpStatus.Value))
            {
                result.Add(Constants.DtoNames.OrderNames.Status, kvpStatus.Value);
            }

            var kvpTransport = CommonBuilder.MappingOrderTransportModes.FirstOrDefault(kvp => kvp.Key == order.TransportMode);
            if (!kvpTransport.Equals(default(KeyValuePair<OrderTransportModes, string>)) && !string.IsNullOrWhiteSpace(kvpTransport.Value))
            {
                result.Add(Constants.DtoNames.OrderNames.TransportMode, kvpTransport.Value);
            }

            result.Add(Constants.DtoNames.OrderNames.Lines, arr);
            if (order.OrderParcel != null)
            {
                result.Add(Constants.DtoNames.OrderNames.Package, GetOrderParcel(order.OrderParcel));
            }

            if (order.OrderPayment != null)
            {
                result.Add(Constants.DtoNames.OrderNames.Payment, GetOrderPayment(order.OrderPayment));
            }

            return result;
        }

        public JObject GetOrderPayment(OrderAggregatePayment payment)
        {
            if (payment == null)
            {
                throw new ArgumentNullException(nameof(payment));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.OrderPaymentNames.Id, payment.Id);
            result.Add(Constants.DtoNames.OrderPaymentNames.OrderId, payment.OrderId);
            result.Add(Constants.DtoNames.OrderPaymentNames.TransactionId, payment.TransactionId);
            result.Add(Constants.DtoNames.OrderPaymentNames.ApprovalUrl, payment.ApprovalUrl);
            var kvpPayment = CommonBuilder.MappingOrderPayments.FirstOrDefault(kvp => kvp.Key == payment.PaymentMethod);
            if (!kvpPayment.Equals(default(KeyValuePair<OrderPayments, string>)) && !string.IsNullOrWhiteSpace(kvpPayment.Value))
            {
                result.Add(Constants.DtoNames.OrderPaymentNames.PaymentMethod, kvpPayment.Value);
            }

            var kvpStatus = CommonBuilder.MappingOrderPaymentStatus.FirstOrDefault(kvp => kvp.Key == payment.Status);
            if (!kvpStatus.Equals(default(KeyValuePair<OrderPaymentStatus, string>)) && !string.IsNullOrWhiteSpace(kvpStatus.Value))
            {
                result.Add(Constants.DtoNames.OrderPaymentNames.Status, kvpStatus.Value);
            }

            return result;
        }

        public JObject GetOrderParcel(OrderAggregateParcel orderParcel)
        {
            if (orderParcel == null)
            {
                throw new ArgumentNullException(nameof(orderParcel));
            }

            var jObj = new JObject();

            var buyerObj = new JObject();
            var adrBuyerObj = new JObject();
            buyerObj.Add(Constants.DtoNames.ParcelActorNames.Name, orderParcel.BuyerName);
            buyerObj.Add(Constants.DtoNames.ParcelActorNames.Address, adrBuyerObj);
            adrBuyerObj.Add(Constants.DtoNames.ParcelAddressNames.AddressLine, orderParcel.BuyerAddressLine);
            adrBuyerObj.Add(Constants.DtoNames.ParcelAddressNames.City, orderParcel.BuyerCity);
            adrBuyerObj.Add(Constants.DtoNames.ParcelAddressNames.PostalCode, orderParcel.BuyerPostalCode);
            adrBuyerObj.Add(Constants.DtoNames.ParcelAddressNames.CountryCode, orderParcel.BuyerCountryCode);
            
            var sellerObj = new JObject();
            var adrSellerObj = new JObject();
            sellerObj.Add(Constants.DtoNames.ParcelActorNames.Name, orderParcel.SellerName);
            sellerObj.Add(Constants.DtoNames.ParcelActorNames.Address, adrSellerObj);
            adrSellerObj.Add(Constants.DtoNames.ParcelAddressNames.AddressLine, orderParcel.SellerAddressLine);
            adrSellerObj.Add(Constants.DtoNames.ParcelAddressNames.City, orderParcel.SellerCity);
            adrSellerObj.Add(Constants.DtoNames.ParcelAddressNames.PostalCode, orderParcel.SellerPostalCode);
            adrSellerObj.Add(Constants.DtoNames.ParcelAddressNames.CountryCode, orderParcel.SellerCountryCode);

            var parcelShop = new JObject();
            var adrParcelShop = new JObject();
            var parcelShopLocation = new JObject();
            parcelShop.Add(Constants.DtoNames.ParcelShopNames.Id, orderParcel.ParcelShopId);
            parcelShop.Add(Constants.DtoNames.ParcelShopNames.Name, orderParcel.ParcelShopName);
            parcelShopLocation.Add(Constants.DtoNames.Location.Latitude, orderParcel.ParcelShopLatitude);
            parcelShopLocation.Add(Constants.DtoNames.Location.Longitude, orderParcel.ParcelShopLongitude);
            adrParcelShop.Add(Constants.DtoNames.ParcelAddressNames.AddressLine, orderParcel.ParcelShopAddressLine);
            adrParcelShop.Add(Constants.DtoNames.ParcelAddressNames.City, orderParcel.ParcelShopCity);
            adrParcelShop.Add(Constants.DtoNames.ParcelAddressNames.PostalCode, orderParcel.ParcelShopPostalCode);
            adrParcelShop.Add(Constants.DtoNames.ParcelAddressNames.CountryCode, orderParcel.ParcelShopCountryCode);
            parcelShop.Add(Constants.DtoNames.ParcelShopNames.Location, parcelShopLocation);
            parcelShop.Add(Constants.DtoNames.ParcelShopNames.Address, adrParcelShop);

            jObj.Add(Constants.DtoNames.ParcelNames.Buyer, buyerObj);
            jObj.Add(Constants.DtoNames.ParcelNames.Seller, sellerObj);
            jObj.Add(Constants.DtoNames.ParcelNames.EstimatedPrice, orderParcel.EstimatedPrice);
            jObj.Add(Constants.DtoNames.ParcelSizeParameterNames.Height, orderParcel.Height);
            jObj.Add(Constants.DtoNames.ParcelSizeParameterNames.Length, orderParcel.Length);
            jObj.Add(Constants.DtoNames.ParcelSizeParameterNames.Weight, orderParcel.Weight);
            jObj.Add(Constants.DtoNames.ParcelSizeParameterNames.Width, orderParcel.Width);
            var kvpOrderService = CommonBuilder.MappingUpsAggregateServices.FirstOrDefault(kvp => kvp.Key == orderParcel.UpsServiceCode);
            if (!kvpOrderService.Equals(default(KeyValuePair<UpsAggregateServices, string>)))
            {
                jObj.Add(Constants.DtoNames.ParcelNames.UpsService, kvpOrderService.Value);
            }

            if (orderParcel.Transporter != Transporters.None)
            {
                string transporter = null;
                switch(orderParcel.Transporter)
                {
                    case Transporters.Dhl:
                        transporter = "dhl";
                        break;
                    case Transporters.Ups:
                        transporter = "ups";
                        break;
                }

                jObj.Add(Constants.DtoNames.ParcelNames.Transporter, transporter);
            }

            jObj.Add(Constants.DtoNames.ParcelNames.ParcelShop, parcelShop);
            return jObj;
        }

        public JObject GetOrderLine(OrderAggregateLine orderLine)
        {
            if (orderLine == null)
            {
                throw new ArgumentNullException(nameof(orderLine));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.OrderLineNames.Id, orderLine.Id);
            result.Add(Constants.DtoNames.OrderLineNames.Price, orderLine.Price);
            result.Add(Constants.DtoNames.OrderLineNames.ProductId, orderLine.ProductId);
            result.Add(Constants.DtoNames.OrderLineNames.Quantity, orderLine.Quantity);
            if (orderLine.OrderLineDiscount != null)
            {
                var discount = new JObject();
                discount.Add(Constants.DtoNames.DiscountNames.Id, orderLine.OrderLineDiscount.Id);
                discount.Add(Constants.DtoNames.DiscountNames.Code, orderLine.OrderLineDiscount.Code);
                discount.Add(Constants.DtoNames.DiscountNames.Value, orderLine.OrderLineDiscount.Value);
                discount.Add(Constants.DtoNames.DiscountNames.MoneySaved, orderLine.OrderLineDiscount.MoneySavedPerProduct);
                var kvpValidity = CommonBuilder.MappingDiscountValidities.FirstOrDefault(d => d.Key == orderLine.OrderLineDiscount.Validity);
                if (!kvpValidity.Equals(default(KeyValuePair<DiscountAggregateValidities, string>)))
                {
                    discount.Add(Constants.DtoNames.DiscountNames.Validity, kvpValidity.Value);
                }

                var kvpType = CommonBuilder.MappingDiscountPromotions.FirstOrDefault(d => d.Key == orderLine.OrderLineDiscount.PromotionType);
                if (!kvpType.Equals(default(KeyValuePair<DiscountAggregatePromotions, string>)))
                {
                    discount.Add(Constants.DtoNames.DiscountNames.Type, kvpType.Value);
                }

                result.Add(Constants.DtoNames.OrderLineNames.Discount, discount);
            }

            return result;
        }

        public JObject GetUpsLocations(LocatorResponse locatorResponse)
        {
            if (locatorResponse == null)
            {
                throw new ArgumentNullException(nameof(locatorResponse));
            }

            var jObj = new JObject();
            var arr = new JArray();
            if (locatorResponse.SearchResults != null && locatorResponse.SearchResults.DropLocation != null)
            {
                foreach (var searchResult in locatorResponse.SearchResults.DropLocation)
                {
                    arr.Add(GetDropLocation(searchResult));
                }
            }

            jObj.Add(Constants.DtoNames.DropLocationsNames.Locations, arr);
            return jObj;
        }

        public JObject GetDropLocation(LocatorDropLocation dropLocation)
        {
            if (dropLocation == null)
            {
                throw new ArgumentNullException(nameof(dropLocation));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.DropLocationNames.Id, dropLocation.LocationId);
            if (dropLocation.AddressKeyFormat != null)
            {
                if (!string.IsNullOrWhiteSpace(dropLocation.AddressKeyFormat.ConsigneeName))
                {
                    jObj.Add(Constants.DtoNames.DropLocationNames.Name, dropLocation.AddressKeyFormat.ConsigneeName);
                }

                jObj.Add(Constants.DtoNames.DropLocationNames.Address, GetAddressKeyFormat(dropLocation.AddressKeyFormat));
            }

            if (dropLocation.Geocode != null)
            {
                jObj.Add(Constants.DtoNames.DropLocationNames.Geolocation, GetGeocode(dropLocation.Geocode));
            }

            if (dropLocation.OperatingHours != null && dropLocation.OperatingHours.StandardHours != null)
            {
                var operatingHours = new JArray();
                foreach (var standardHours in dropLocation.OperatingHours.StandardHours)
                {
                    operatingHours.Merge(GetStandardHours(standardHours));
                }

                jObj.Add(Constants.DtoNames.DropLocationNames.OpeningTimes, operatingHours);
            }

            if (dropLocation.ServiceOfferingList != null && dropLocation.ServiceOfferingList.ServiceOffering != null)
            {
                var services = new JArray();
                foreach(var service in dropLocation.ServiceOfferingList.ServiceOffering)
                {
                    services.Add(service.Code);
                }

                jObj.Add(Constants.DtoNames.DropLocationsNames.Services, services);
            }

            return jObj;
        }

        public JObject GetDistance(Distance distance)
        {
            if (distance == null)
            {
                throw new ArgumentNullException(nameof(distance));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.LocationDistanceResponse.Value, distance.Value);
            if (distance.UnitOfMeasurement != null)
            {
                result.Add(Constants.DtoNames.LocationDistanceResponse.UnitOfMeasure, distance.UnitOfMeasurement.Code);
            }

            return result;
        }

        public JObject GetAddressKeyFormat(AddressKeyFormat addressKeyFormat)
        {
            if (addressKeyFormat == null)
            {
                throw new ArgumentNullException(nameof(addressKeyFormat));
            }

            var result = new JObject();
            result.Add(Constants.DtoNames.DropLocationAddressNames.Street, addressKeyFormat.AddressLine);
            result.Add(Constants.DtoNames.DropLocationAddressNames.City, addressKeyFormat.PoliticalDivision2);
            result.Add(Constants.DtoNames.DropLocationAddressNames.CountryCode, addressKeyFormat.CountryCode);
            result.Add(Constants.DtoNames.DropLocationAddressNames.ZipCode, addressKeyFormat.PostcodePrimaryLow);
            return result;
        }

        public JObject GetGeocode(Geocode geocode)
        {
            if (geocode == null)
            {
                throw new ArgumentNullException(nameof(geocode));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.DropLocationGeoloc.Latitude, geocode.Latitude);
            jObj.Add(Constants.DtoNames.DropLocationGeoloc.Longitude, geocode.Longitude);
            return jObj;
        }

        public JArray GetStandardHours(StandardHours standardHours)
        {
            if (standardHours == null)
            {
                throw new ArgumentNullException(nameof(standardHours));
            }

            var daysOfWeek = new JArray();
            foreach(var dayOfWeek in standardHours.DaysOfWeek)
            {
                var rec = new JObject();
                rec.Add(Constants.DtoNames.DropLocationOpeningTime.TimeFrom, dayOfWeek.OpenHours);
                rec.Add(Constants.DtoNames.DropLocationOpeningTime.Day, dayOfWeek.Day);
                rec.Add(Constants.DtoNames.DropLocationOpeningTime.TimeTo, dayOfWeek.CloseHours);
                daysOfWeek.Add(rec);
            }

            return daysOfWeek;
        }

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
            result.Add(Constants.DtoNames.UserMessage.ClientServiceId, evt.ClientServiceId);
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
            result.Add(Constants.DtoNames.UserMessage.ClientServiceId, message.ClientServiceId);
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
                case NotificationParameterTypes.MessageId:
                    type = "message_id";
                    break;
                case NotificationParameterTypes.ClientServiceId:
                    type = "client_service_id";
                    break;
                case NotificationParameterTypes.ShopServiceId:
                    type = "shop_service_id";
                    break;
                case NotificationParameterTypes.OrderId:
                    type = "order_id";
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
            result.Add(Constants.DtoNames.Shop.CategoryId, shop.CategoryId);
            if (shop.ShopCategory != null)
            {
                result.Add(Constants.DtoNames.Shop.Category, GetShopCategory(shop.ShopCategory));
            }

            result.Add(Constants.DtoNames.Shop.StreetAddress, shop.StreetAddress); // Street address
            result.Add(Constants.DtoNames.Shop.PostalCode, shop.PostalCode);
            result.Add(Constants.DtoNames.Shop.Locality, shop.Locality);
            result.Add(Constants.DtoNames.Shop.Country, shop.Country);
            var location = new JObject();
            location.Add(Constants.DtoNames.Location.Latitude, shop.Latitude);
            location.Add(Constants.DtoNames.Location.Longitude, shop.Longitude);
            result.Add(Constants.DtoNames.Shop.Location, location);
            result.Add(Constants.DtoNames.Shop.GooglePlaceId, shop.GooglePlaceId);

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

            var gameEntities = new JArray();
            if (shop.ShopGameEntities != null)
            {
                foreach(var shopGameEntity in shop.ShopGameEntities)
                {
                    var obj = new JObject();
                    obj.Add(Constants.DtoNames.GameEntity.Id, shopGameEntity.Id);
                    obj.Add(Constants.DtoNames.GameEntity.Name, shopGameEntity.Name);
                    obj.Add(Constants.DtoNames.GameEntity.Row, shopGameEntity.Row);
                    obj.Add(Constants.DtoNames.GameEntity.Col, shopGameEntity.Col);
                    obj.Add(Constants.DtoNames.GameEntity.ProductCategoryId, shopGameEntity.ProductCategoryId);
                    obj.Add(Constants.DtoNames.GameEntity.IsFlipped, shopGameEntity.IsFlipped);
                    var record = CommonBuilder.MappingGameEntityTypes.First(kvp => kvp.Key == shopGameEntity.Type);
                    obj.Add(Constants.DtoNames.GameEntity.Type, record.Value);
                    gameEntities.Add(obj);
                }
            }
            
            result.Add(Constants.DtoNames.Shop.Filters, filters);
            result.Add(Constants.DtoNames.Shop.ProductCategories, productCategories);
            result.Add(Constants.DtoNames.Shop.CreateDateTime, shop.CreateDateTime); // Other informations
            result.Add(Constants.DtoNames.Shop.UpdateDateTime, shop.UpdateDateTime);
            result.Add(Constants.DtoNames.Shop.NbComments, nbComments);
            result.Add(Constants.DtoNames.Shop.AverageScore, shop.AverageScore);
            result.Add(Constants.DtoNames.Shop.TotalScore, shop.TotalScore);
            result.Add(Constants.DtoNames.Shop.GameEntities, gameEntities);
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

        public JObject GetServiceUpdatedEvent(ServiceUpdatedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Service.Id, evt.Id);
            jObj.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
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
            jObj.Add(Constants.DtoNames.Service.CreateDatetime, evt.CreateDateTime);
            jObj.Add(Constants.DtoNames.Service.UpdateDatetime, evt.UpdateDateTime);
            jObj.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
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

        public JObject GetProductUpdatedEvent(ProductUpdatedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Product.Id, evt.Id);
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
            jObj.Add(Constants.DtoNames.Product.UnitOfMeasure, evt.UnitOfMeasure);
            jObj.Add(Constants.DtoNames.Product.Quantity, evt.Quantity);
            jObj.Add(Constants.DtoNames.Product.ShopId, evt.ShopId);
            jObj.Add(Constants.DtoNames.Product.AverageScore, evt.AverageScore);
            jObj.Add(Constants.DtoNames.Product.TotalScore, evt.TotalScore);
            jObj.Add(Constants.DtoNames.Product.CreateDateTime, evt.CreateDateTime);
            jObj.Add(Constants.DtoNames.Product.UpdateDateTime, evt.UpdateDateTime);
            return jObj;
        }

        public JObject GetProductRemovedEvent(ProductRemovedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Product.Id, evt.ProductId);
            jObj.Add(Constants.DtoNames.Product.ShopId, evt.ShopId);
            jObj.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
            return jObj;
        }

        public JObject GetServiceRemovedEvent(ServiceRemovedEvent evt)
        {
            if (evt == null)
            {
                throw new ArgumentNullException(nameof(evt));
            }

            var jObj = new JObject();
            jObj.Add(Constants.DtoNames.Service.Id, evt.ServiceId);
            jObj.Add(Constants.DtoNames.Service.ShopId, evt.ShopId);
            jObj.Add(Constants.DtoNames.Message.CommonId, evt.CommonId);
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
            jObj.Add(Constants.DtoNames.Product.UnitOfMeasure, product.UnitOfMeasure);
            jObj.Add(Constants.DtoNames.Product.Quantity, product.Quantity);
            jObj.Add(Constants.DtoNames.Product.ShopId, product.ShopId);
            jObj.Add(Constants.DtoNames.Product.AverageScore, product.AverageScore);
            jObj.Add(Constants.DtoNames.Product.TotalScore, product.TotalScore);
            jObj.Add(Constants.DtoNames.Product.CreateDateTime, product.CreateDateTime);
            jObj.Add(Constants.DtoNames.Product.UpdateDateTime, product.UpdateDateTime);
            jObj.Add(Constants.DtoNames.Product.AvailableInStock, product.AvailableInStock);
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

            if (product.ActiveDiscounts != null && product.ActiveDiscounts.Any())
            {
                JArray arr = new JArray();
                foreach (var activeDiscount in product.ActiveDiscounts)
                {
                    var obj = new JObject();
                    obj.Add(Constants.DtoNames.DiscountNames.Id, activeDiscount.Id);
                    obj.Add(Constants.DtoNames.DiscountNames.Code, activeDiscount.Code);
                    obj.Add(Constants.DtoNames.DiscountNames.MoneySaved, activeDiscount.MoneySaved);
                    obj.Add(Constants.DtoNames.DiscountNames.Value, activeDiscount.Value);
                    var kvpType = CommonBuilder.MappingDiscountPromotions.FirstOrDefault(d => d.Key == activeDiscount.PromotionType);
                    if (!kvpType.Equals(default(KeyValuePair<DiscountAggregatePromotions, string>)))
                    {
                        obj.Add(Constants.DtoNames.DiscountNames.Type, kvpType.Value);
                    }

                    arr.Add(obj);
                }

                jObj.Add(Constants.DtoNames.Product.Discounts, arr);
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
