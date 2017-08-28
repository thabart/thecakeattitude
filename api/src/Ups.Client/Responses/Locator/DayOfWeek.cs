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
    public class DayOfWeek
    {
        [XmlElement(ElementName = Constants.DtoNames.DayOfWeekNames.ClosedIndicator)]
        public string ClosedIndicator { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.DayOfWeekNames.CloseHours)]
        public string CloseHours { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.DayOfWeekNames.Day)]
        public string Day { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.DayOfWeekNames.LatestDropOffHours)]
        public string LatestDropOffHours { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.DayOfWeekNames.Open24HoursIndicator)]
        public string Open24HoursIndicator { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.DayOfWeekNames.OpenHours)]
        public string OpenHours { get; set; }
        [XmlElement(ElementName = Constants.DtoNames.DayOfWeekNames.PrepHours)]
        public string PrepHours { get; set; }
    }
}
