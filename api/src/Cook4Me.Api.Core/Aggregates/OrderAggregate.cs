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
using System.Collections.Generic;

namespace Cook4Me.Api.Core.Aggregates
{
    public enum OrderAggregateStatus
    {
        Created,
        Confirmed,
        Received
    }

    public enum OrderTransportModes
    {
        None,
        Manual,
        Packet
    }

    public class OrderAggregate
    {
        public string Id { get; set; }
        public DateTime CreateDateTime { get; set; }
        public DateTime UpdateDateTime { get; set; }
        public OrderAggregateStatus Status { get; set; }
        public OrderTransportModes TransportMode { get; set; }
        public string Subject { get; set; }
        public string ShopId { get; set; }
        public string SellerId { get; set; }
        public IEnumerable<OrderAggregateLine> OrderLines { get; set; }
        public OrderAggregateParcel OrderParcel { get; set; }
        public OrderAggregatePayment OrderPayment { get; set; }
        public double TotalPrice { get; set; }
    }
}
