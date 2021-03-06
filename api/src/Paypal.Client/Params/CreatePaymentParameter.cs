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

using Paypal.Client.Common;
using System.Collections.Generic;

namespace Paypal.Client.Params
{
    public class CreatePaymentParameter
    {
        public string AccessToken { get; set; }
        public PaypalPayer Payer { get; set; }
        public IntentPayments Intent { get; set; }
        public IEnumerable<PaymentTransaction> Transactions { get; set; }
        public string ReturnUrl { get; set; }
        public string CancelUrl { get; set; }
    }
}
