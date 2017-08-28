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

using System.Xml.Serialization;

namespace Ups.Client.Responses.Locator
{
    public class LocatorErrorResponse
    {
        [XmlElement(ElementName = Constants.DtoNames.LocatorErrorResponseNames.ErrorSeverity)]
        public string ErrorSeverity { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorErrorResponseNames.ErrorCode)]
        public string ErrorCode { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorErrorResponseNames.ErrorDescription)]
        public string ErrorDescription { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorErrorResponseNames.MinimumRetrySeconds)]
        public string MinimumRetrySeconds { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.LocatorErrorResponseNames.ErrorDigest)]
        public string ErrorDigest { get; set; }
    }
}
