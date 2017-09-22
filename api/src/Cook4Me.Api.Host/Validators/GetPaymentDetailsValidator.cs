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

using Cook4Me.Api.Core.Repositories;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Validators
{
    public interface IGetPaymentDetailsValidator
    {
        Task<GetPaymentDetailsValidationResult> Validate(string id, string subject);
    }

    public class GetPaymentDetailsValidationResult
    {

    }

    internal class GetPaymentDetailsValidator : IGetPaymentDetailsValidator
    {
        private readonly IOrderRepository _orderRepository;

        public GetPaymentDetailsValidator(IOrderRepository orderRepository)
        {
            _orderRepository = orderRepository;
        }

        public Task<GetPaymentDetailsValidationResult> Validate(string id, string subject)
        {
            throw new NotImplementedException();
        }
    }
}
