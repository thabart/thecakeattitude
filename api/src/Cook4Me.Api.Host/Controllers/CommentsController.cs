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

using Cook4Me.Api.Core.Models;
using Cook4Me.Api.Core.Repositories;
using Cook4Me.Api.Host.Builders;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Comments)]
    public class CommentsController : Controller
    {
        private readonly ICommentRepository _repository;
        private readonly IResponseBuilder _responseBuilder;
        private readonly IHalResponseBuilder _halResponseBuilder;
        private readonly IRequestBuilder _requestBuilder;

        public CommentsController(ICommentRepository repository, IResponseBuilder responseBuilder, IHalResponseBuilder halResponseBuilder, IRequestBuilder requestBuilder)
        {
            _repository = repository;
            _responseBuilder = responseBuilder;
            _halResponseBuilder = halResponseBuilder;
            _requestBuilder = requestBuilder;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                throw new ArgumentNullException(nameof(id));
            }

            var comment = await _repository.Get(id);
            if (comment == null)
            {
                return new NotFoundResult();
            }
            
            _halResponseBuilder.AddLinks(l => l.AddSelf("/" + Constants.RouteNames.Comments + "/" + id));
            AddComment(_halResponseBuilder, _responseBuilder, comment);
            return new OkObjectResult(_halResponseBuilder.Build());
        }

        [HttpGet(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search()
        {
            var parameter = _requestBuilder.GetSearchComment(Request.Query);
            var searchResult = await _repository.Search(parameter);
            _halResponseBuilder.AddLinks(l => l.AddSelf(GetCommentLink(parameter.StartIndex, parameter.Count)));
            if (searchResult != null && searchResult.Content != null)
            {
                var comments = searchResult.Content;
                foreach (var comment in comments)
                {
                    AddComment(_halResponseBuilder, _responseBuilder, comment);
                }

                double r = (double)searchResult.TotalResults / (double)parameter.Count;
                var nbPages = Math.Ceiling(r);
                nbPages = nbPages == 0 ? 1 : nbPages;
                for (var page = 1; page <= nbPages; page++)
                {
                    _halResponseBuilder.AddLinks(l => l.AddOtherItem("navigation", new Dtos.Link(GetCommentLink((page - 1) * parameter.Count, parameter.Count), page.ToString())));
                }
            }
            
            return new OkObjectResult(_halResponseBuilder.Build());
        }

        private void AddComment(IHalResponseBuilder halResponseBuilder, IResponseBuilder responseBuilder, Comment comment)
        {
            _halResponseBuilder.AddEmbedded(e => e.AddObject(_responseBuilder.GetComment(comment),
                (l) => l.AddOtherItem("shop", new Dtos.Link("/" + Constants.RouteNames.Shops + "/" + comment.ShopId))
                    .AddSelf(Constants.RouteNames.Comments + "/" + comment.Id)));
        }

        private static string GetCommentLink(int startIndex, int count)
        {
            return "/" + Constants.RouteNames.Comments + "/" + Constants.RouteNames.Search +
                "?" + Constants.DtoNames.Paginate.StartIndex + "=" + startIndex + "&" + Constants.DtoNames.Paginate.Count + "=" + count;
        }
    }
}
