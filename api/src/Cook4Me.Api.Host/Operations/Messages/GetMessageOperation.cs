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

using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading.Tasks;
using System;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Enrichers;

namespace Cook4Me.Api.Host.Operations.Messages
{
    public interface IGetMessageOperation
    {
        Task<IActionResult> Execute(string id, string subject);
    }

    internal class GetMessageOperation : IGetMessageOperation
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IMessageEnricher _messageEnricher;

        public GetMessageOperation(
            IMessageRepository messageRepository, IHalResponseBuilder halResponseBuilder, IMessageEnricher messageEnricher)
        {
            _messageRepository = messageRepository;
            _halResponseBuilder = halResponseBuilder;
            _messageEnricher = messageEnricher;
        }

        public async Task<IActionResult> Execute(string id, string subject)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var message = await _messageRepository.Get(id);
            if (message == null)
            {
                return new NotFoundResult();
            }
            
            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Messages + "/" + id));
            _messageEnricher.Enrich(_halResponseBuilder, message);
            return new OkObjectResult(_halResponseBuilder.Build());
        }
    }
}
