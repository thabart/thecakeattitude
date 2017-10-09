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
using Cook4Me.Api.Core.Commands.Orders;
using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Common;
using Openid.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Ups.Client;
using Ups.Client.Params;

namespace Cook4Me.Api.Host.Validators
{
    public interface IUpdateOrderValidator
    {
        Task<UpdateOrderValidationResult> Validate(UpdateOrderCommand order, string subject);
    }

    public class UpdateOrderValidationResult
    {
        public UpdateOrderValidationResult(OrderAggregate order, IEnumerable<ProductAggregate> products, string payerPaypalEmail, string sellerPaypalEmail, double shippingPrice)
        {
            Order = order;
            Products = products;
            PayerPaypalEmail = payerPaypalEmail;
            SellerPaypalEmail = sellerPaypalEmail;
            ShippingPrice = shippingPrice;
            IsValid = true;
        }

        public UpdateOrderValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
        public OrderAggregate Order { get; set; }
        public IEnumerable<ProductAggregate> Products { get; set; }
        public string PayerPaypalEmail { get; set; }
        public string SellerPaypalEmail { get; set; }
        public double ShippingPrice { get; set; }
    }

    internal class UpdateOrderValidator : IUpdateOrderValidator
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IProductRepository _productRepository;
        private readonly IOpenidClient _openidClient;
        private readonly ISettingsProvider _settingsProvider;
        private readonly IUpsClient _upsClient;
        private readonly IDiscountRepository _discountRepository;

        public UpdateOrderValidator(IOrderRepository orderRepository, IProductRepository productRepository, 
            IOpenidClient openidClient, ISettingsProvider settingsProvider, IUpsClient upsClient, IDiscountRepository discountRepository)
        {
            _orderRepository = orderRepository;
            _productRepository = productRepository;
            _openidClient = openidClient;
            _settingsProvider = settingsProvider;
            _upsClient = upsClient;
            _discountRepository = discountRepository;
        }

        public async Task<UpdateOrderValidationResult> Validate(UpdateOrderCommand order, string subject)
        {
            if (order == null)
            {
                throw new ArgumentNullException(nameof(order));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var record = await _orderRepository.Get(order.Id);
            if (record == null)
            {
                return new UpdateOrderValidationResult(ErrorDescriptions.TheOrderDoesntExist);
            }

            if (record.Status == OrderAggregateStatus.Received) // Cannot update received order.
            {
                return new UpdateOrderValidationResult(ErrorDescriptions.TheReceivedOrderCannotBeUpdated);
            }

            if (record.Status != OrderAggregateStatus.Created && record.Status == order.Status) // Confirmed & received order cannot be updated.
            {
                return new UpdateOrderValidationResult(string.Format(ErrorDescriptions.TheOrderCannotBeUpdatedBecauseOfItsState, Enum.GetName(typeof(OrderAggregateStatus), order.Status)));
            }

            if (record.Status != order.Status)
            {
                if (record.Status == OrderAggregateStatus.Created && order.Status != OrderAggregateStatus.Confirmed) // created => confirmed.
                {
                    return new UpdateOrderValidationResult(string.Format(ErrorDescriptions.TheOrderStateCannotBeUpdated, Enum.GetName(typeof(OrderAggregateStatus), record.Status), Enum.GetName(typeof(OrderAggregateStatus), order)));
                }

                if (record.Status == OrderAggregateStatus.Confirmed && order.Status != OrderAggregateStatus.Received) // confirmed => received
                {
                    return new UpdateOrderValidationResult(string.Format(ErrorDescriptions.TheOrderStateCannotBeUpdated, Enum.GetName(typeof(OrderAggregateStatus), record.Status), Enum.GetName(typeof(OrderAggregateStatus), order)));
                }
            }

            if (order.TransportMode ==  OrderTransportModes.Manual && order.Status == OrderAggregateStatus.Received && record.Subject != subject) // Only the creator can confirm the order.
            {
                return new UpdateOrderValidationResult(ErrorDescriptions.TheOrderReceptionCanBeConfirmedOnlyByItsCreator);
            }

            IEnumerable<ProductAggregate> prods = null;
            if (order.OrderLines != null && order.OrderLines.Any()) // Check the lines.
            {
                var productIds = order.OrderLines.Select(o => o.ProductId);
                var products = await _productRepository.Search(new SearchProductsParameter { ProductIds = productIds });
                if (products.Content.Count() != productIds.Count())
                {
                    return new UpdateOrderValidationResult(ErrorDescriptions.TheOrderLineProductIsInvalid);
                }

                if (order.OrderLines.Any(o => o.Quantity <= 0))
                {
                    return new UpdateOrderValidationResult(ErrorDescriptions.TheOrderLineQuantityIsInvalid);
                }

                foreach (var orderLine in order.OrderLines)
                {
                    var product = products.Content.First(p => p.Id == orderLine.ProductId);
                    if (orderLine.Quantity > product.AvailableInStock && product.AvailableInStock.HasValue)
                    {
                        return new UpdateOrderValidationResult(ErrorDescriptions.TheOrderLineQuantityIsTooMuch);
                    }
                }

                prods = products.Content;
                var discountCodes = order.OrderLines.Select(o => o.DiscountCode).Where(dc => !string.IsNullOrEmpty(dc));
                if (discountCodes.Any()) // Check discounts.
                {
                    var discounts = await _discountRepository.Search(new SearchDiscountsParameter
                    {
                        IsPagingEnabled = false,
                        DiscountCodes = discountCodes
                    });
                    if (discounts.Content == null || !discounts.Content.Any() || discounts.Content.Count() != discountCodes.Count())
                    {
                        return new UpdateOrderValidationResult(ErrorDescriptions.TheDiscountCodesAreNotValid);
                    }

                    foreach(var orderLine in order.OrderLines)
                    {
                        if (string.IsNullOrWhiteSpace(orderLine.DiscountCode))
                        {
                            continue;
                        }

                        var discount = discounts.Content.First(c => c.Code == orderLine.DiscountCode);
                        if (discount.Products == null || !discount.Products.Any(p => p.ProductId == orderLine.ProductId)) // Check discount is valid for the product.
                        {
                            return new UpdateOrderValidationResult(string.Format(ErrorDescriptions.TheDiscountCannotBeUsedForThisProduct, orderLine.ProductId));
                        }

                        if (!discount.IsValid()) // Check discount is valid.
                        {
                            return new UpdateOrderValidationResult(string.Format(ErrorDescriptions.TheProductDiscountIsInvalid, orderLine.DiscountCode));
                        }

                        orderLine.DiscountId = discount.Id;
                    }
                }
            }

            double shippingPrice = 0;
            string payerEmail = string.Empty;
            string sellerEmail = string.Empty;
            if (order.Status == OrderAggregateStatus.Confirmed && order.TransportMode == OrderTransportModes.Packet)
            {
                if (order.OrderParcel == null)
                {
                    return new UpdateOrderValidationResult(ErrorDescriptions.TheParcelDoesntExist);
                }

                var payer = await _openidClient.GetPublicClaims(_settingsProvider.GetBaseOpenidUrl(), subject);
                if (payer == null)
                {
                    return new UpdateOrderValidationResult(ErrorDescriptions.ThePayerPaypalAccountNotExist);
                }

                var seller = await _openidClient.GetPublicClaims(_settingsProvider.GetBaseOpenidUrl(), record.SellerId);
                if (seller == null)
                {
                    return new UpdateOrderValidationResult(ErrorDescriptions.TheSellerPaypalAccountNotExist);
                }

                var paypalBuyer = payer.Claims.FirstOrDefault(c => c.Type == "paypal_email");
                var paypalSeller = seller.Claims.FirstOrDefault(c => c.Type == "paypal_email");
                if (paypalBuyer == null || string.IsNullOrWhiteSpace(paypalBuyer.Value))
                {
                    return new UpdateOrderValidationResult(ErrorDescriptions.ThePayerPaypalAccountNotExist);
                }

                if (paypalSeller == null || string.IsNullOrWhiteSpace(paypalSeller.Value))
                {
                    return new UpdateOrderValidationResult(ErrorDescriptions.TheSellerPaypalAccountNotExist);
                }

                if (order.OrderParcel.Transporter == Transporters.Ups)
                {
                    var buyerName = payer.Claims.First(c => c.Type == SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Name).Value;
                    var sellerName = seller.Claims.First(c => c.Type == SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Name).Value;
                    var parameter = new GetUpsRatingsParameter
                    {
                        Credentials = new UpsCredentials
                        {
                            LicenseNumber = _settingsProvider.GetUpsLicenseNumber(),
                            Password = _settingsProvider.GetUpsPassword(),
                            UserName = _settingsProvider.GetUpsUsername()
                        },
                        Shipper = new UpsShipperParameter
                        {
                            Name = buyerName,
                            Address = new UpsAddressParameter
                            {
                                AddressLine = order.OrderParcel.BuyerAddressLine,
                                City = order.OrderParcel.BuyerCity,
                                Country = order.OrderParcel.BuyerCountryCode,
                                PostalCode = order.OrderParcel.BuyerPostalCode.ToString()
                            }
                        },
                        ShipFrom = new UpsShipParameter
                        {
                            Name = buyerName,
                            AttentionName = buyerName,
                            CompanyName = buyerName,
                            Address = new UpsAddressParameter
                            {
                                AddressLine = order.OrderParcel.BuyerAddressLine,
                                City = order.OrderParcel.BuyerCity,
                                Country = order.OrderParcel.BuyerCountryCode,
                                PostalCode = order.OrderParcel.BuyerPostalCode.ToString()
                            }
                        },
                        ShipTo = new UpsShipParameter
                        {
                            Name = sellerName,
                            AttentionName = sellerName,
                            CompanyName = sellerName,
                            Address = new UpsAddressParameter
                            {
                                AddressLine = order.OrderParcel.SellerAddressLine,
                                City = order.OrderParcel.SellerCity,
                                Country = order.OrderParcel.SellerCountryCode,
                                PostalCode = order.OrderParcel.SellerPostalCode.ToString()
                            }
                        },
                        Package = new UpsPackageParameter
                        {
                            Height = Constants.PackageInfo.Height,
                            Length = Constants.PackageInfo.Length,
                            Weight = Constants.PackageInfo.Weight,
                            Width = Constants.PackageInfo.Width
                        },
                        AlternateDeliveryAddress = new UpsAlternateDeliveryAddressParameter
                        {
                            Name = order.OrderParcel.ParcelShopName,
                            Address = new UpsAddressParameter
                            {
                                AddressLine = order.OrderParcel.ParcelShopAddressLine,
                                City = order.OrderParcel.ParcelShopCity,
                                Country = order.OrderParcel.ParcelShopCountryCode,
                                PostalCode = order.OrderParcel.ParcelShopPostalCode.ToString()
                            }
                        },
                        UpsService = CommonBuilder.MappingBothUpsServices.First(kvp => kvp.Key == order.OrderParcel.UpsServiceCode).Value
                    };
                    var ratingsResponse = await _upsClient.GetRatings(parameter);
                    if (ratingsResponse.Response.Error != null)
                    {
                        return new UpdateOrderValidationResult(ratingsResponse.Response.Error.ErrorDescription);
                    }

                    shippingPrice = ratingsResponse.RatedShipment.TotalCharges.MonetaryValue;
                    payerEmail = paypalBuyer.Value;
                    sellerEmail = paypalSeller.Value;
               }
            }

            return new UpdateOrderValidationResult(record, prods, payerEmail, sellerEmail, shippingPrice);
        }
    }
}
