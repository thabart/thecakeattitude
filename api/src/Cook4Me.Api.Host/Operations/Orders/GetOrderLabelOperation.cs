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

using Cook4Me.Api.Host.Builders;
using Cook4Me.Api.Host.Helpers;
using Cook4Me.Api.Host.Validators;
using Cook4Me.Common;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Net;
using System.Threading.Tasks;
using Ups.Client;
using Ups.Client.Params;

namespace Cook4Me.Api.Host.Operations.Orders
{
    public interface IGetOrderLabelOperation
    {
        Task<IActionResult> Execute(string subject, string orderId);
    }

    internal class GetOrderLabelOperation : IGetOrderLabelOperation
    {
        private readonly IResponseBuilder _responseBuilder;
        private readonly IControllerHelper _controllerHelper;
        private readonly IGetOrderLabelValidator _validator;
        private readonly IUpsClient _upsClient;
        private readonly ISettingsProvider _settingsProvider;

        public GetOrderLabelOperation(IResponseBuilder responseBuilder, IControllerHelper controllerHelper, IGetOrderLabelValidator validator, 
            IUpsClient upsClient, ISettingsProvider settingsProvider)
        {
            _responseBuilder = responseBuilder;
            _controllerHelper = controllerHelper;
            _validator = validator;
            _upsClient = upsClient;
            _settingsProvider = settingsProvider;
        }

        public async Task<IActionResult> Execute(string subject, string orderId)
        {
            if (string.IsNullOrWhiteSpace(subject))
            {
                throw new ArgumentNullException(nameof(subject));
            }

            if (string.IsNullOrWhiteSpace(orderId))
            {
                throw new ArgumentNullException(nameof(orderId));
            }
            
            var validationResult = await _validator.Validate(subject, orderId);
            if (!validationResult.IsValid)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, validationResult.Message);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            var label = await _upsClient.GetLabel(new GetLabelParameter
            {
                Credentials = new UpsCredentials
                {
                    LicenseNumber = _settingsProvider.GetUpsLicenseNumber(),
                    Password = _settingsProvider.GetUpsPassword(),
                    UserName = _settingsProvider.GetUpsUsername()
                },
                TrackingNumber = _settingsProvider.IsTstMode() ? "1Z12345E8791315509" : validationResult.Order.ShipmentIdentificationNumber
            });

            if (label.LabelResults == null || label.LabelResults.LabelImage == null)
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ErrorDescriptions.TheLabelCannotBeRetrieved);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            if (!string.Equals(label.LabelResults.LabelImage.LabelImageFormat.Code, "gif", StringComparison.CurrentCultureIgnoreCase) &&
                !string.Equals(label.LabelResults.LabelImage.LabelImageFormat.Code, "pdf", StringComparison.CurrentCultureIgnoreCase))
            {
                var error = _responseBuilder.GetError(ErrorCodes.Request, ErrorDescriptions.TheLabelFormatIsNotSupported);
                return _controllerHelper.BuildResponse(HttpStatusCode.BadRequest, error);
            }

            var contentType = "application/pdf";
            if (string.Equals(label.LabelResults.LabelImage.LabelImageFormat.Code, "gif", StringComparison.CurrentCultureIgnoreCase))
            {
                contentType = "application/gif";
            }

            var b64 = label.LabelResults.LabelImage.GraphicImage;
            var response = new FileContentResult(Convert.FromBase64String(b64), contentType)
            {
                FileDownloadName = $"{validationResult.Order.Id}.{label.LabelResults.LabelImage.LabelImageFormat.Code}"
            };
            return response;
        }
    }
}
