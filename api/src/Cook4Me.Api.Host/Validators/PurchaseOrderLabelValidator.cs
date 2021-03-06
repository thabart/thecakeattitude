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
using Cook4Me.Api.Core.Commands.Orders;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Common;
using Openid.Client;
using System;
using System.Linq;
using System.Threading.Tasks;
using Ups.Client;
using Ups.Client.Params;

namespace Cook4Me.Api.Host.Validators
{
    public interface IPurchaseOrderLabelValidator
    {
        Task<PurchaseOrderLabelValidationResult> Validate(string subject, PurchaseOrderLabelCommand parameter);
    }

    public class PurchaseOrderLabelValidationResult
    {
        public PurchaseOrderLabelValidationResult(OrderAggregate order, string payerPaypalEmail, string sellerPaypalEmail, double shippingPrice, string shipmentDigest)
        {
            Order = order;
            PayerPaypalEmail = payerPaypalEmail;
            SellerPaypalEmail = sellerPaypalEmail;
            ShippingPrice = shippingPrice;
            IsValid = true;
            ShipmentDigest = shipmentDigest;
        }

        public PurchaseOrderLabelValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public bool IsValid { get; private set; }
        public string Message { get; private set; }
        public OrderAggregate Order { get; set; }
        public string PayerPaypalEmail { get; set; }
        public string SellerPaypalEmail { get; set; }
        public double ShippingPrice { get; set; }
        public string TrackingNumber { get; set; }
        public string ShipmentDigest { get; set; }
    }

    internal class PurchaseOrderLabelValidator : IPurchaseOrderLabelValidator
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IUpsClient _upsClient;
        private readonly IOpenidClient _openidClient;
        private readonly ISettingsProvider _settingsProvider;

        public PurchaseOrderLabelValidator(IOrderRepository orderRepository, IUpsClient upsClient, IOpenidClient openidClient, ISettingsProvider settingsProvider)
        {
            _orderRepository = orderRepository;
            _upsClient = upsClient;
            _openidClient = openidClient;
            _settingsProvider = settingsProvider;
        }

        public async Task<PurchaseOrderLabelValidationResult> Validate(string subject, PurchaseOrderLabelCommand parameter)
        {
            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentException(nameof(subject));
            }

            if (parameter == null)
            {
                throw new ArgumentNullException(nameof(parameter));
            }

            if (parameter.ParcelSize == null)
            {
                throw new ArgumentNullException(nameof(parameter.ParcelSize));
            }
            
            var order = await _orderRepository.Get(parameter.OrderId);
            if (order == null) // Check order exists.
            {
                return new PurchaseOrderLabelValidationResult(ErrorDescriptions.TheOrderDoesntExist);
            }

            if (parameter.ParcelSize.Height < 0 || parameter.ParcelSize.Length < 0 || parameter.ParcelSize.Weight < 0 || parameter.ParcelSize.Width < 0)
            {
                return new PurchaseOrderLabelValidationResult(ErrorDescriptions.TheParcelSizeIsInvalid);
            }

            if (order.SellerId != subject) // Only the seller can purchase the label.
            {
                return new PurchaseOrderLabelValidationResult(ErrorDescriptions.TheOrderLabelCanBePurchasedOnlyBySeller);
            }

            if (order.Status != OrderAggregateStatus.Confirmed) // The order state should be confirmed.
            {
                return new PurchaseOrderLabelValidationResult(ErrorDescriptions.TheOrderIsNotConfirmed);
            }

            if (order.OrderPayment == null || order.OrderPayment.Status != OrderPaymentStatus.Approved) // The order payment should be approved by the buyer.
            {
                return new PurchaseOrderLabelValidationResult(ErrorDescriptions.TheOrderPaymentHasNotBeenConfirmed);
            }

            double shippingPrice = 0;
            var payer = await _openidClient.GetPublicClaims(_settingsProvider.GetBaseOpenidUrl(), subject); // Get the payer information.
            if (payer == null)
            {
                return new PurchaseOrderLabelValidationResult(ErrorDescriptions.ThePayerPaypalAccountNotExist);
            }

            var seller = await _openidClient.GetPublicClaims(_settingsProvider.GetBaseOpenidUrl(), order.SellerId); // Get the seller information.
            if (seller == null)
            {
                return new PurchaseOrderLabelValidationResult(ErrorDescriptions.TheSellerPaypalAccountNotExist);
            }
            
            var paypalBuyer = payer.Claims.FirstOrDefault(c => c.Type == "paypal_email");
            var paypalSeller = seller.Claims.FirstOrDefault(c => c.Type == "paypal_email");
            if (paypalBuyer == null || string.IsNullOrWhiteSpace(paypalBuyer.Value))
            {
                return new PurchaseOrderLabelValidationResult(ErrorDescriptions.ThePayerPaypalAccountNotExist);
            }

            if (paypalSeller == null || string.IsNullOrWhiteSpace(paypalSeller.Value))
            {
                return new PurchaseOrderLabelValidationResult(ErrorDescriptions.TheSellerPaypalAccountNotExist);
            }

            string trackingNumber = null;
            string shipmentDigest = null;
            if (order.OrderParcel.Transporter == Transporters.Ups) // Retrieve UPS ratings.
            {
                var buyerName = payer.Claims.First(c => c.Type == SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Name).Value;
                var sellerName = seller.Claims.First(c => c.Type == SimpleIdentityServer.Core.Jwt.Constants.StandardResourceOwnerClaimNames.Name).Value;
                var confirmShip = await _upsClient.ConfirmShip(new ConfirmShipParameter // 1. Confirm UPS shippment.
                {
                    Credentials = new UpsCredentials
                    {
                        LicenseNumber = _settingsProvider.GetUpsLicenseNumber(),
                        Password = _settingsProvider.GetUpsPassword(),
                        UserName = _settingsProvider.GetUpsUsername()
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
                        Length = parameter.ParcelSize.Length,
                        Height = parameter.ParcelSize.Height,
                        Weight = parameter.ParcelSize.Weight,
                        Width = parameter.ParcelSize.Width
                    },
                    EmailAddress = "habarthierry@hotmail.fr",
                    UpsService = CommonBuilder.MappingBothUpsServices.First(kvp => kvp.Key == order.OrderParcel.UpsServiceCode).Value
                });

                if (confirmShip.Response.ResponseStatusCode == "0")
                {
                    return new PurchaseOrderLabelValidationResult(confirmShip.Response.Error.ErrorDescription);
                }

                /*
                var acceptUpsShipment = await _upsClient.AcceptShip(new AcceptShipParameter // 2. Accept UPS shipment.
                {
                    Credentials = new UpsCredentials
                    {
                        LicenseNumber = _settingsProvider.GetUpsLicenseNumber(),
                        Password = _settingsProvider.GetUpsPassword(),
                        UserName = _settingsProvider.GetUpsUsername()
                    },
                    ShipmentDigest = confirmShip.ShipmentDigest
                });

                if (acceptUpsShipment.Response.ResponseStatusCode == "0")
                {
                    return new PurchaseOrderLabelValidationResult(acceptUpsShipment.Response.Error.ErrorDescription);
                }
                */

                
                shipmentDigest = confirmShip.ShipmentDigest;
                shippingPrice = confirmShip.ShipmentCharges.TotalCharges.MonetaryValue;
            }

            return new PurchaseOrderLabelValidationResult(order, paypalBuyer.Value, paypalSeller.Value, shippingPrice, shipmentDigest);
        }
    }
}
