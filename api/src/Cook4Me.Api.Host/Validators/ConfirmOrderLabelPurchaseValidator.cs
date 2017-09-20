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
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Common;
using Openid.Client;
using Openid.Client.Responses;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IConfirmOrderLabelPurchaseValidator
    {
        Task<ConfirmOrderLabelPurchaseValidationResult> Validate(string subject, ConfirmOrderLabelPurchaseCommand command);
    }

    public class ConfirmOrderLabelPurchaseValidationResult
    {
        public ConfirmOrderLabelPurchaseValidationResult(OrderAggregate order, UserResult payer, UserResult seller)
        {
            Order = order;
            Payer = payer;
            Seller = seller;
            IsValid = true;
        }

        public ConfirmOrderLabelPurchaseValidationResult(string message)
        {
            Message = message;
            IsValid = false;
        }

        public OrderAggregate Order { get; set; }
        public UserResult Payer { get; set; }
        public UserResult Seller { get; set; }
        public string Message { get; set; }
        public bool IsValid { get; set; }
    }

    internal class ConfirmOrderLabelPurchaseValidator : IConfirmOrderLabelPurchaseValidator
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ISettingsProvider _settingsProvider;
        private readonly IOpenidClient _openidClient;

        public ConfirmOrderLabelPurchaseValidator(IOrderRepository orderRepository, ISettingsProvider settingsProvider, IOpenidClient openidClient)
        {
            _orderRepository = orderRepository;
            _settingsProvider = settingsProvider;
            _openidClient = openidClient;
        }

        public async Task<ConfirmOrderLabelPurchaseValidationResult> Validate(string subject, ConfirmOrderLabelPurchaseCommand command)
        {
            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentException(nameof(subject));
            }

            if (command == null)
            {
                throw new ArgumentNullException(nameof(command));
            }

            var order = await _orderRepository.Get(command.OrderId);
            if (order == null) // Check order exists.
            {
                return new ConfirmOrderLabelPurchaseValidationResult(ErrorDescriptions.TheOrderDoesntExist);
            }
            
            if (order.SellerId != subject) // Only the seller can purchase the label.
            {
                return new ConfirmOrderLabelPurchaseValidationResult(ErrorDescriptions.TheOrderLabelCanBePurchasedOnlyBySeller);
            }

            if (order.Status != OrderAggregateStatus.Confirmed) // The order state should be confirmed.
            {
                return new ConfirmOrderLabelPurchaseValidationResult(ErrorDescriptions.TheOrderIsNotConfirmed);
            }
            
            var payer = await _openidClient.GetPublicClaims(_settingsProvider.GetBaseOpenidUrl(), subject); // Retrieve the payer information.
            if (payer == null)
            {
                return new ConfirmOrderLabelPurchaseValidationResult(ErrorDescriptions.ThePayerPaypalAccountNotExist);
            }

            var seller = await _openidClient.GetPublicClaims(_settingsProvider.GetBaseOpenidUrl(), order.SellerId); // Retrieve the seller information.
            if (seller == null)
            {
                return new ConfirmOrderLabelPurchaseValidationResult(ErrorDescriptions.TheSellerPaypalAccountNotExist);
            }

            var paypalBuyer = payer.Claims.FirstOrDefault(c => c.Type == "paypal_email");
            var paypalSeller = seller.Claims.FirstOrDefault(c => c.Type == "paypal_email");
            if (paypalBuyer == null || string.IsNullOrWhiteSpace(paypalBuyer.Value))
            {
                return new ConfirmOrderLabelPurchaseValidationResult(ErrorDescriptions.ThePayerPaypalAccountNotExist);
            }

            if (paypalSeller == null || string.IsNullOrWhiteSpace(paypalSeller.Value))
            {
                return new ConfirmOrderLabelPurchaseValidationResult(ErrorDescriptions.TheSellerPaypalAccountNotExist);
            }

            return new ConfirmOrderLabelPurchaseValidationResult(order, payer, seller);
        }
    }
}
