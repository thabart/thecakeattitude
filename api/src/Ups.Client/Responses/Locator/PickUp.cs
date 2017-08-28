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

namespace Ups.Client.Responses.Locator
{
    public class PickUp
    {
        [XmlElement(ElementName = Constants.DtoNames.PickUpNames.DayOfWeek)]
        public string DayOfWeek { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.PickUpNames.PickUpDetails)]
        public string PickUpDetails { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.PickUpNames.PickUpTime)]
        public string PickUpTime { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.PickUpNames.NoPickUpIndicator)]
        public string NoPickUpIndicator { get; set; }
    }
}
