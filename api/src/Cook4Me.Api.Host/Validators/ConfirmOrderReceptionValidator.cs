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
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Common;
using System;
using System.Linq;
using System.Threading.Tasks;
using Ups.Client;
using Ups.Client.Params;

namespace Cook4Me.Api.Host.Validators
{
    public interface IConfirmOrderReceptionValidator
    {
        Task<ConfirmOrderReceptionValidationResult> Validate(string orderId, string subject);
    }

    public class ConfirmOrderReceptionValidationResult
    {
        public ConfirmOrderReceptionValidationResult(OrderAggregate order)
        {
            Order = order;
            IsValid = true;
        }

        public ConfirmOrderReceptionValidationResult(string message)
        {
            IsValid = false;
            Message = message;
        }

        public OrderAggregate Order { get; set; }
        public bool IsValid { get; set; }
        public string Message { get; set; }
    }

    internal class ConfirmOrderReceptionValidator : IConfirmOrderReceptionValidator
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IUpsClient _upsClient;
        private readonly ISettingsProvider _settingsProvider;
        private const string DeliveredCode = "D";

        public ConfirmOrderReceptionValidator(IOrderRepository orderRepository, IUpsClient upsClient, ISettingsProvider settingsProvider)
        {
            _orderRepository = orderRepository;
            _upsClient = upsClient;
            _settingsProvider = settingsProvider;
        }

        public async Task<ConfirmOrderReceptionValidationResult> Validate(string orderId, string subject)
        {
            if (string.IsNullOrWhiteSpace(orderId))
            {
                throw new ArgumentNullException(nameof(orderId));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var record = await _orderRepository.Get(orderId);
            if (record == null)
            {
                return new ConfirmOrderReceptionValidationResult(ErrorDescriptions.TheOrderDoesntExist);
            }

            if (record.Subject != subject)
            {
                return new ConfirmOrderReceptionValidationResult(ErrorDescriptions.TheOrderReceptionCanBeConfirmedOnlyByTheBuyer);
            }

            if (record.Status != OrderAggregateStatus.Confirmed)
            {
                return new ConfirmOrderReceptionValidationResult(ErrorDescriptions.TheOrderIsNotConfirmed);
            }

            if (record.TransportMode == OrderTransportModes.Packet)
            {
                if (record.OrderPayment == null || record.OrderPayment.Status != OrderPaymentStatus.Approved)
                {
                    return new ConfirmOrderReceptionValidationResult(ErrorDescriptions.TheOrderPaymentHasNotBeenConfirmed);
                }

                if (!record.IsLabelPurchased || string.IsNullOrWhiteSpace(record.TrackingNumber))
                {
                    return new ConfirmOrderReceptionValidationResult(ErrorDescriptions.TheOrderLabelHasNotBeenPurchased);
                }

                var trackResult = await _upsClient.Track(record.TrackingNumber, new UpsCredentials
                {
                    LicenseNumber = _settingsProvider.GetUpsLicenseNumber(),
                    Password = _settingsProvider.GetUpsPassword(),
                    UserName = _settingsProvider.GetUpsUsername()
                });

                if (trackResult.Response.ResponseStatusCode == "0")
                {
                    return new ConfirmOrderReceptionValidationResult(trackResult.Response.Error.ErrorDescription);
                }

                if (trackResult.Shipment == null || trackResult.Shipment.Package == null || trackResult.Shipment.Package.Activity == null ||
                    !trackResult.Shipment.Package.Activity.Any(a => a.Status != null && a.Status.StatusType != null && a.Status.StatusType.Code == DeliveredCode))
                {
                    return new ConfirmOrderReceptionValidationResult(ErrorDescriptions.TheOrderParcelHasNotBeenDelivered);
                }
            }

            return new ConfirmOrderReceptionValidationResult(record);
        }
    }
}
