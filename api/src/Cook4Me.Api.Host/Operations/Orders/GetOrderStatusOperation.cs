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

using Cook4Me.Api.Core.Parameters;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Orders
{
    public interface IGetOrderStatusOperation
    {
        Task<IActionResult> Execute(string subject);
    }

    internal class GetOrderStatusOperation : IGetOrderStatusOperation
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IResponseBuilder _responseBuilder;

        public GetOrderStatusOperation(IOrderRepository orderRepository, IHalResponseBuilder halResponseBuilder, IResponseBuilder responseBuilder)
        {
            _orderRepository = orderRepository;
            _halResponseBuilder = halResponseBuilder;
            _responseBuilder = responseBuilder;
        }

        public async Task<IActionResult> Execute(string subject)
        {
            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }
            
            var content = await _orderRepository.GetStatus(new GetOrderStatusParameter
            {
                Subject = subject,
            });
            var href = "/" + Constants.RouteNames.Orders + "/" + Constants.RouteNames.Status;
            _halResponseBuilder.AddLinks(l => l.AddSelf(href)).AddEmbedded(e => e.AddObject(_responseBuilder.GetOrderStatus(content)));
            return new OkObjectResult(_halResponseBuilder.Build());
        }
    }
}
