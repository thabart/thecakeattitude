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
using System.Threading.Tasks;
using System;
using Cook4Me.Api.Core.Repositories;
using Newtonsoft.Json.Linq;
using Cook4Me.Api.Host.Builders;

namespace Cook4Me.Api.Host.Operations.Notifications
{
    public interface IGetNotificationStatusOperation
    {
        Task<IActionResult> Execute(JObject jObj, string subject);
    }

    internal class GetNotificationStatusOperation : IGetNotificationStatusOperation
    {
        private readonly INotificationRepository _notificationRepository;
        private readonly IRequestBuilder _requestBuilder;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IHalResponseBuilder _halResponseBuilder;

        public GetNotificationStatusOperation(INotificationRepository notificationRepository, IRequestBuilder requestBuilder, 
            IResponseBuilder responseBuilder, IHalResponseBuilder halResponseBuilder)
        {
            _notificationRepository = notificationRepository;
            _requestBuilder = requestBuilder;
            _responseBuilder = responseBuilder;
            _halResponseBuilder = halResponseBuilder;
        }

        public async Task<IActionResult> Execute(JObject jObj, string subject)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            var request = _requestBuilder.GetNotificationStatus(jObj);
            request.To = subject;
            var content = await _notificationRepository.Search(request);
            var href = "/" + Constants.RouteNames.Notifications + "/" + Constants.RouteNames.Status;
            _halResponseBuilder.AddLinks(l => l.AddSelf(href)).AddEmbedded(e => e.AddObject(_responseBuilder.GetNotificationStatus(content)));
            return new OkObjectResult(_halResponseBuilder.Build());
        }
    }
}
