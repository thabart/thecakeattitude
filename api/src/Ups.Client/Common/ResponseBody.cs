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

namespace Ups.Client.Common
{
    public class ResponseBody
    {
        [XmlElement(ElementName = Constants.DtoNames.ResponseBodyNames.TransactionReference)]
        public TransactionReference TransactionReference { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ResponseBodyNames.ResponseStatusCode)]
        public string ResponseStatusCode { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ResponseBodyNames.ResponseStatusDescription)]
        public string ResponseStatusDescription { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.ResponseBodyNames.Error)]
        public ErrorResponse Error { get; set; }
    }
}
