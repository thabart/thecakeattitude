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
using Paypal.Client.Common;
using System.Collections.Generic;

namespace Cook4Me.Api.Host.Builders
{
    public class CommonBuilder
    {
        public static Dictionary<OrderPayments, string> MappingOrderPayments = new Dictionary<OrderPayments, string>
        {
            { OrderPayments.Paypal, "paypal" }
        };

        public static Dictionary<OrderPaymentStatus, string> MappingOrderPaymentStatus = new Dictionary<OrderPaymentStatus, string>
        {
            { OrderPaymentStatus.Approved, "approved" },
            { OrderPaymentStatus.Confirmed, "confirmed" },
            { OrderPaymentStatus.Created, "created" },
            { OrderPaymentStatus.Failed, "failed" }
        };

        public static Dictionary<PaymentStates, string> MappingPayPalPaymentStatus = new Dictionary<PaymentStates, string>
        {
            { PaymentStates.Approved, "approved" },
            { PaymentStates.Created, "created" },
            { PaymentStates.Failed, "failed" }
        };

        public static Dictionary<OrderAggregateStatus, string> MappingOrderAggregateStatus = new Dictionary<OrderAggregateStatus, string>
        {
            { OrderAggregateStatus.Created, "created" },
            { OrderAggregateStatus.Confirmed, "confirmed" },
            { OrderAggregateStatus.Received, "received" }
        };

        public static Dictionary<OrderTransportModes, string> MappingOrderTransportModes = new Dictionary<OrderTransportModes, string>
        {
            { OrderTransportModes.Manual, "manual" },
            { OrderTransportModes.Packet, "packet" }
        };
    }
}
