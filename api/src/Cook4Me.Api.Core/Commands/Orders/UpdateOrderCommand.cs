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
using Cook4Me.Api.Core.Bus;
using System.Collections.Generic;

namespace Cook4Me.Api.Core.Commands.Orders
{
    public class UpdateOrderLine
    {
        public string Id { get; set; }
        public string ProductId { get; set; }
        public int Quantity { get; set; }
        public string DiscountCode { get; set; }
        public string DiscountId { get; set; }
    }

    public class UpdateOrderCommand : Command
    {
        public string Id { get; set; }
        public OrderAggregateStatus Status { get; set; }
        public OrderTransportModes TransportMode { get; set; }
        public IEnumerable<UpdateOrderLine> OrderLines { get; set; }
        public AddOrderParcelCommand OrderParcel { get; set; }
        public AddPaymentOrder PaymentOrder { get; set; }
    }
}
