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
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Core.Repositories;
using System.Xml;
using System.IO;
using Microsoft.SyndicationFeed.Rss;
using Microsoft.SyndicationFeed;

namespace Cook4Me.Api.Host.Operations.Feeds
{
    public interface ISearchFeedItemsOperation
    {
        Task<IActionResult> Execute(JObject jObj);
    }

    internal class SearchFeedItemsOperation : ISearchFeedItemsOperation
    {
        private readonly IRequestBuilder _requestBuilder;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IFeedRepository _feedRepository;
        private readonly IHalResponseBuilder _halResponseBuilder;

        public SearchFeedItemsOperation(IRequestBuilder requestBuilder, IResponseBuilder responseBuilder, IFeedRepository feedRepository, IHalResponseBuilder halResponseBuilder)
        {
            _requestBuilder = requestBuilder;
            _responseBuilder = responseBuilder;
            _feedRepository = feedRepository;
            _halResponseBuilder = halResponseBuilder;
        }

        public async Task<IActionResult> Execute(JObject jObj)
        {
            if (jObj == null)
            {
                throw new ArgumentNullException(nameof(jObj));
            }

            var parameter = _requestBuilder.GetSearchFeedItems(jObj);
            var searchResult = await _feedRepository.Search(parameter);
            _halResponseBuilder.AddLinks(l => l.AddSelf(GetFeedItemsLink()));
            if (searchResult != null && searchResult.Content != null)
            {
                var feedItems = searchResult.Content;
                foreach (var feedItem in feedItems)
                {
                    _halResponseBuilder.AddEmbedded(e => e.AddObject(_responseBuilder.GetFeedItem(feedItem)));
                }

                double r = (double)searchResult.TotalResults / (double)parameter.Count;
                var nbPages = Math.Ceiling(r);
                nbPages = nbPages == 0 ? 1 : nbPages;
                for (var page = 1; page <= nbPages; page++)
                {
                    _halResponseBuilder.AddLinks(l => l.AddOtherItem("navigation", new Dtos.Link(GetFeedItemsLink(), page.ToString())));
                }
            }

            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private static string GetFeedItemsLink()
        {
            return "/" + Constants.RouteNames.FeedItems + "/" + Constants.RouteNames.Search;
        }
    }
}
