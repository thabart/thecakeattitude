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
using Microsoft.AspNetCore.Mvc;
using Microsoft.SyndicationFeed;
using Microsoft.SyndicationFeed.Rss;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Cook4Me.Api.Host.Operations.Feeds
{
    public interface IGetAllFeedItemsOperation
    {
        Task<IActionResult> Execute();
    }

    internal class GetAllFeedItemsOperation : IGetAllFeedItemsOperation
    {
        private readonly IFeedRepository _feedRepository;

        public GetAllFeedItemsOperation(IFeedRepository feedRepository)
        {
            _feedRepository = feedRepository;
        }

        public async Task<IActionResult> Execute()
        {
            var feedItems = await _feedRepository.GetAll();
            var sw = new StringWriterWithEncoding(Encoding.UTF8);
            using (var xmlWriter = XmlWriter.Create(sw, new XmlWriterSettings { Async = true, Indent = true }))
            {
                var writer = new RssFeedWriter(xmlWriter);
                foreach (var feedItem in feedItems)
                {
                    var item = new SyndicationItem
                    {
                        Title = feedItem.Title,
                        Description = feedItem.Description,
                        Id = feedItem.Id,
                        Published = feedItem.CreateDateTime
                    };
                    item.AddContributor(new SyndicationPerson(feedItem.Author, "habarthierry@hotmail.fr"));
                    await writer.Write(item);
                }

                xmlWriter.Flush();
            }

            return new ObjectResult(sw.ToString());
        }
    }
}
