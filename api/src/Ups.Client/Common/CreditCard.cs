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
    public class CreditCard
    {
        [XmlElement(ElementName = Constants.DtoNames.CreditCardNames.Type)]
        public string Type { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.CreditCardNames.Number)]
        public string Number { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.CreditCardNames.ExpirationDate)]
        public string ExpirationDate { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.CreditCardNames.SecurityCode)]
        public string SecurityCode { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.CreditCardNames.Address)]
        public Address Address { get; set; }
    }
}
