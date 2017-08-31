﻿#region copyright
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
    public class AddressKeyFormatType
    {
        [XmlElement(ElementName = Constants.DtoNames.AddressKeyFormatTypeNames.ConsigneeName)]
        public string ConsigneeName { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.AddressKeyFormatTypeNames.AddressLine)]
        public string AddressLine { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.AddressKeyFormatTypeNames.CountryCode)]
        public string CountryCode { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.AddressKeyFormatTypeNames.PoliticalDivision1)]
        public string PoliticalDivision1 { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.AddressKeyFormatTypeNames.PoliticalDivision2)]
        public string PoliticalDivision2 { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.AddressKeyFormatTypeNames.PoliticalDivision3)]
        public string PoliticalDivision3 { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.AddressKeyFormatTypeNames.PostcodePrimaryLow)]
        public string PostcodePrimaryLow { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.AddressKeyFormatTypeNames.PostcodeExtendedLow)]
        public string PostcodeExtendedLow { get; set; }
    }
}