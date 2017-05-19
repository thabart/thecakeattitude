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

using Cook4Me.Api.Core.Commands.Shop;
using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Extensions;
using Cook4Me.Api.Host.Handlers;
using Cook4Me.Api.Host.Operations.Shop;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Threading.Tasks;

namespace Cook4Me.Api.Host.Controllers
{
    [Route(Constants.RouteNames.Shops)]
    public class ShopsController : BaseController
    {
        private readonly IResponseBuilder _responseBuilder;
        private readonly IAddShopOperation _addShopOperation;
        private readonly IAddShopCommentOperation _addShopCommentOperation;
        private readonly IGetShopOperation _getShopOperation;
        private readonly IGetShopsOperation _getShopsOperation;
        private readonly ISearchShopsOperation _searchShopsOperation;
        private readonly IGetMineShopsOperation _getMineShopsOperation;
        private readonly IRemoveShopCommentOperation _removeShopCommentOperation;
        private readonly ISearchShopCommentsOperation _searchShopCommentsOperation;
        private readonly ISearchMineShopsOperation _searchMineShopsOperation;
        private readonly IDeleteShopOperation _deleteShopOperation;

        public ShopsController(IResponseBuilder responseBuilder, IAddShopOperation addShopOperation, IAddShopCommentOperation addShopCommentOperation,
            IGetShopOperation getShopOperation, IGetShopsOperation getShopsOperation, ISearchShopsOperation searchShopsOperation,
            IGetMineShopsOperation getMineShopsOperation, IRemoveShopCommentOperation removeShopCommentOperation, ISearchShopCommentsOperation searchShopCommentsOperation,
            ISearchMineShopsOperation searchMineShopsOperation, IDeleteShopOperation deleteShopOperation,
            IHandlersInitiator handlersInitiator) : base(handlersInitiator)
        {
            _responseBuilder = responseBuilder;
            _addShopOperation = addShopOperation;
            _addShopCommentOperation = addShopCommentOperation;
            _getShopOperation = getShopOperation;
            _getShopsOperation = getShopsOperation;
            _searchShopsOperation = searchShopsOperation;
            _getMineShopsOperation = getMineShopsOperation;
            _removeShopCommentOperation = removeShopCommentOperation;
            _searchShopCommentsOperation = searchShopCommentsOperation;
            _searchMineShopsOperation = searchMineShopsOperation;
            _deleteShopOperation = deleteShopOperation;
        }

        [HttpGet]
        public async Task<IActionResult> GetShops()
        {
            return await _getShopsOperation.Execute();
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetShop(string id)
        {
            return await _getShopOperation.Execute(id);
        }

        [HttpDelete("{id}")]
        [Authorize("Connected")]
        public async Task<IActionResult> DeleteShop(string id)
        {
            return await _deleteShopOperation.Execute(new RemoveShopCommand
            {
                ShopId = id,
                Subject = User.GetSubject(),
                CommonId = this.GetCommonId()
            });
        }

        [HttpPost]
        [Authorize("Connected")]
        public async Task<IActionResult> AddShop([FromBody] JObject obj)
        {
            var subject = User.GetSubject();
            if (string.IsNullOrEmpty(subject))
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ErrorDescriptions.TheSubjectCannotBeRetrieved);
                return this.BuildResponse(error, HttpStatusCode.BadRequest);
            }

            return await _addShopOperation.Execute(obj, subject);
        }

        [HttpPost(Constants.RouteNames.Search)]
        public async Task<IActionResult> Search([FromBody] JObject jObj)
        {
            return await _searchShopsOperation.Execute(jObj);
        }

        [HttpGet(Constants.RouteNames.Me)]
        [Authorize("Connected")]
        public async Task<IActionResult> GetMineShops()
        {
            var subject = User.GetSubject();
            if (string.IsNullOrEmpty(subject))
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ErrorDescriptions.TheSubjectCannotBeRetrieved);
                return this.BuildResponse(error, HttpStatusCode.BadRequest);
            }

            return await _getMineShopsOperation.Execute(subject);
        }

        [HttpPost(Constants.RouteNames.SearchMine)]
        [Authorize("Connected")]
        public async Task<IActionResult> SearchMineShops([FromBody] JObject jObj)
        {
            return await _searchMineShopsOperation.Execute(jObj, User.GetSubject());
        } 

        [HttpPost(Constants.RouteNames.Comments)]
        [Authorize("Connected")]
        public async Task<IActionResult> AddComment([FromBody] JObject jObj)
        {
            return await _addShopCommentOperation.Execute(jObj, User.GetSubject());
        }

        [HttpPost(Constants.RouteNames.SearchComments)]
        public async Task<IActionResult> SearchComments(string id, [FromBody] JObject jObj)
        {
            return await _searchShopCommentsOperation.Execute(id, jObj);
        }

        [HttpDelete(Constants.RouteNames.RemoveComment)]
        [Authorize("Connected")]
        public async Task<IActionResult> RemoveComment(string id, string subid)
        {
            return await _removeShopCommentOperation.Execute(new RemoveShopCommentCommand
            {
                CommentId = subid,
                Subject = User.GetSubject(),
                ShopId = id
            });
        }
    }
}
