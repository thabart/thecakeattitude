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

using System;
using System.Threading.Tasks;
using Cook4Me.Api.Core.Bus;
using Cook4Me.Api.Core.Commands.Ups;
using Ups.Client;
using Ups.Client.Params;

namespace Cook4Me.Api.Handlers
{
    public class UpsCommandsHandler : Handles<BuyUpsLabelCommand>
    {
        private readonly IEventPublisher _eventPublisher;
        private readonly IUpsClient _upsClient;

        public UpsCommandsHandler(IEventPublisher eventPublisher, IUpsClient upsClient)
        {
            _eventPublisher = eventPublisher;
            _upsClient = upsClient;
        }

        public async Task Handle(BuyUpsLabelCommand message)
        {
            if (message == null)
            {
                throw new ArgumentNullException(nameof(message));
            }

            if (message.Credentials == null)
            {
                throw new ArgumentNullException(nameof(message.Credentials));
            }

            await _upsClient.ConfirmShip(new ConfirmShipParameter
            {
                AlternateDeliveryAddress = message.AlternateDeliveryAddress,
                EmailAddress = message.EmailAddress,
                Package = message.Package,
                PaymentInformation = message.PaymentInformation,
                ShipFrom = message.ShipFrom,
                Shipper = message.Shipper,
                ShipTo = message.ShipTo,
                Credentials = message.Credentials
            });
        }
    }
}
