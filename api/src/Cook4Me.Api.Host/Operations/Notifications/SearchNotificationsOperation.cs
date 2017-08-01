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
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Enrichers;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Operations.Notifications
{
    public interface ISearchNotificationsOperation
    {
        Task<IActionResult> Execute(JObject jObj, string subject);
    }

    internal class SearchNotificationsOperation : ISearchNotificationsOperation
    {
        private readonly IRequestBuilder _requestBuilder;
        private readonly INotificationRepository _notificationRepository;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly INotificationEnricher _notificationEnricher;

        public SearchNotificationsOperation(IRequestBuilder requestBuilder, INotificationRepository notificationRepository, 
            IHalResponseBuilder halResponseBuilder, INotificationEnricher notificationEnricher)
        {
            _requestBuilder = requestBuilder;
            _notificationRepository = notificationRepository;
            _halResponseBuilder = halResponseBuilder;
            _notificationEnricher = notificationEnricher;
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

            var href = "/" + Constants.RouteNames.Notifications + "/" + Constants.RouteNames.Search;
            var request = _requestBuilder.GetSearchNotifications(jObj);
            request.To = subject;
            var searchResult = await _notificationRepository.Search(request);
            if (searchResult.Content == null || !searchResult.Content.Any())
            {
                return new OkObjectResult(new { });
            }

            _halResponseBuilder.AddLinks(l => l.AddSelf(href));
            foreach (var shop in searchResult.Content)
            {
                _notificationEnricher.Enrich(_halResponseBuilder, shop);
            }

            double r = (double)searchResult.TotalResults / (double)request.Count;
            var nbPages = Math.Ceiling(r);
            nbPages = nbPages == 0 ? 1 : nbPages;
            for (var page = 1; page <= nbPages; page++)
            {
                _halResponseBuilder.AddLinks(l => l.AddOtherItem("navigation", new Dtos.Link(href, page.ToString())));
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }
    }
}
