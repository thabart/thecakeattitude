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

using Cook4Me.Api.Core.Bus;
using Cook4Me.Common;

namespace Cook4Me.Api.Core.Commands.Orders
{
    public class PurchaseOrderLabelCommand : Command
    {
        public string OrderId { get; set; }
        public ParcelSize ParcelSize { get; set; }
        public string TrackingNumber { get; set; }
        public double ShippingPrice { get; set; }
        public string ShipmentDigest { get; set; }
    }
}