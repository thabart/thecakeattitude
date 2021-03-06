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

using System;
using System.Collections.Generic;

namespace Cook4Me.Api.EF.Models
{
    public class Order
    {
        public string Id { get; set; }
        public string OrderParcelId { get; set; }
        public string OrderPaymentId { get; set; }
        public DateTime CreateDateTime { get; set; }
        public DateTime UpdateDateTime { get; set; }
        public int Status { get; set; }
        public int TransportMode { get; set; }
        public string Subject { get; set; }
        public string ShopId { get; set; }
        public double TotalPrice { get; set; }
        public double ShippingPrice { get; set; }
        public string TrackingNumber { get; set; }
        public string ShipmentDigest { get; set; }
        public bool IsLabelPurchased { get; set; }
        public virtual ICollection<OrderLine> OrderLines { get; set; }
        public virtual OrderParcel OrderParcel { get; set; }
        public virtual Shop Shop { get; set; }
        public virtual OrderPayment OrderPayment { get; set; }
    }
}
