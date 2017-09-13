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

using System.Collections.Generic;

namespace Paypal.Client.Common
{
    public class PaymentTransaction
    {
        public double Total { get; set; }
        public PaypalPayee Payee { get; set; }
        public string Currency { get; set; }
        public double SubTotal { get; set; }
        public double Tax { get; set; }
        public double Shipping { get; set; }
        public double HandlingFee { get; set; }
        public double ShippingDiscount { get; set; }
        public double Insurance { get; set; }
        public string Description { get; set; }
        public string Custom { get; set; }
        public string InvoiceNumber { get; set; }
        public IEnumerable<PaypalItem> Items { get; set; }
        public PaypalShippingAddress ShippingAddress { get; set; }
    }
}
